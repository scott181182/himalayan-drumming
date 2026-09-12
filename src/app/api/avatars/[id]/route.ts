import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth, getAuthDbClient } from "@/lib/server/auth";
import type { DbClient } from "@/lib/server/db";
import { storage, AVATAR_DIR } from "@/lib/server/storage";

async function handleFileUpload(
  db: DbClient,
  image: File,
  personId: string,
  avatarFilename: string,
): Promise<NextResponse> {
  try {
    const avatarPath = `${AVATAR_DIR}/${avatarFilename}`;
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unnecessary-type-assertion
    await storage.write(avatarPath, image.stream() as unknown as NodeJS.ReadableStream);

    // oxlint-disable-next-line typescript/return-await
    return db.person
      .update({
        where: { id: personId },
        data: { avatarUrl: await storage.publicUrl(avatarPath) },
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", reason: "There was an error uploading the file" },
      { status: 500 },
    );
  }
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

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ status: "error", reason: "Unauthorized" }, { status: 401 });
  }
  const db = getAuthDbClient(session.user.id);

  const formData = await req.formData();
  const image = formData.get("image");
  if (!image) {
    return NextResponse.json({ status: "error", reason: "No image in request" }, { status: 400 });
  }
  if (Array.isArray(image)) {
    return NextResponse.json(
      { status: "error", reason: "Only one image allowed for upload" },
      { status: 400 },
    );
  }
  if (image instanceof File) {
    const imageExt = image.name.slice(image.name.lastIndexOf(".") + 1);
    const avatarFilename = `${personId}.${imageExt}`;
    return handleFileUpload(db, image, personId, avatarFilename);
  }
  return NextResponse.json(
    { status: "error", reason: "The uploaded image is not a valid file" },
    { status: 400 },
  );
}
