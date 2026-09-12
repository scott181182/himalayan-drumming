import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/server/auth";
import type { DbClient } from "@/lib/server/db";
import { ApiError } from "@/lib/server/errors";
import { getFileUploadContext, prepareUpload } from "@/lib/server/files";
import { storage, AVATAR_DIR } from "@/lib/server/storage";

async function handleFileUpload(
  db: DbClient,
  image: File,
  personId: string,
  vPath: string,
): Promise<NextResponse> {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unnecessary-type-assertion
  await storage.write(vPath, image.stream() as unknown as NodeJS.ReadableStream);

  // oxlint-disable-next-line typescript/return-await
  return db.person
    .update({
      where: { id: personId },
      data: { avatarUrl: await storage.publicUrl(vPath) },
    })
    .then(() => {
      return NextResponse.json({ status: "success" }, { status: 200 });
    })
    .catch((gerr) => {
      console.error(gerr);
      return NextResponse.json(
        { status: "error", reason: "There was an error updating the person record" },
        { status: 500 },
      );
    });
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/avatars/[id]">) {
  const { id: filename } = await ctx.params;
  if (!filename) {
    return NextResponse.json({ status: "error", reason: "Missing file name" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ status: "error", reason: "Unauthorized" }, { status: 401 });
  }

  const filepath = `${AVATAR_DIR}/${filename}`;
  try {
    const avatarStream = await storage.read(filepath);
    if (!avatarStream) {
      return NextResponse.json(
        { status: "error", reason: "Avatar file not found in storage" },
        { status: 404 },
      );
    }

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return new NextResponse(avatarStream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "image/*",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", reason: "There was an error retrieving the avatar" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/avatars/[id]">) {
  const { id: personId } = await ctx.params;
  if (!personId) {
    return NextResponse.json({ status: "error", reason: "Missing personId" }, { status: 400 });
  }

  try {
    const { db, formData } = await getFileUploadContext(req);

    const { file, vPath } = prepareUpload(formData, "image", AVATAR_DIR, (f) => {
      const imageExt = f.name.slice(f.name.lastIndexOf(".") + 1);
      return `${personId}.${imageExt}`;
    });

    return await handleFileUpload(db, file, personId, vPath);
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toNextResponse();
    }
    console.error(error);
    return NextResponse.json(
      { status: "error", reason: "There was an error processing the request" },
      { status: 500 },
    );
  }
}
