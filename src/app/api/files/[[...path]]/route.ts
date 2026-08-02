import path from "node:path";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth, getAuthDbClient } from "@/lib/auth";
import type { DbClient } from "@/lib/db";
import { fileTree2prismaCreateInput } from "@/lib/server/scan";
import { FILES_DIR, storage } from "@/lib/server/storage";

async function handleFileUpload(
  db: DbClient,
  file: File,
  parentId: string,
  vPath: string,
): Promise<NextResponse> {
  try {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unnecessary-type-assertion
    await storage.write(vPath, file.stream() as unknown as NodeJS.ReadableStream);

    const fileCreateInput = await fileTree2prismaCreateInput(
      {
        id: vPath,
        value: {
          name: file.name,
          path: vPath,
          type: "file",
        },
        children: [],
      },
      parentId,
      storage,
    );

    // oxlint-disable-next-line typescript/return-await
    return db.fileEntry
      .create({ data: fileCreateInput })
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

export async function GET(req: NextRequest, ctx: RouteContext<"/api/files/[[...path]]">) {
  const { path: pathParams } = await ctx.params;

  const vPath = pathParams ? FILES_DIR + "/" + pathParams.join("/") : FILES_DIR;
  if (!vPath) {
    return NextResponse.json({ status: "error", reason: "Missing file path" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ status: "error", reason: "Unauthorized" }, { status: 401 });
  }

  try {
    const fileStream = await storage.read(vPath);
    if (!fileStream) {
      return NextResponse.json(
        { status: "error", reason: "File not found in storage" },
        { status: 404 },
      );
    }

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return new NextResponse(fileStream as unknown as ReadableStream);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", reason: "There was an error retrieving the avatar" },
      { status: 500 },
    );
  }
}

/**
 * File upload endpoint, on `/api/files/upload` route.
 *
 * It expects a POST request with form data containing the file to be uploaded and the parent directory ID where the file should be stored.
 *
 * @param req The Request object
 * @param ctx The RouteContext object containing route parameters
 * @returns A NextResponse object indicating the result of the file upload operation
 */
// oxlint-disable-next-line max-lines-per-function
export async function POST(req: NextRequest, ctx: RouteContext<"/api/files/[[...path]]">) {
  const { path: pathParams } = await ctx.params;
  if (!pathParams || pathParams.length !== 1 || pathParams[0] !== "upload") {
    return NextResponse.json({ status: "error", reason: "Method not allowed" }, { status: 405 });
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ status: "error", reason: "Unauthorized" }, { status: 401 });
  }
  const db = getAuthDbClient(session.user.id);

  const formData = await req.formData();
  const parentId = formData.get("parentId");
  if (!parentId || typeof parentId !== "string") {
    return NextResponse.json({ status: "error", reason: "Missing parentId" }, { status: 400 });
  }

  const parent = await db.fileEntry.findUnique({
    where: { id: parentId },
  });
  if (!parent) {
    return NextResponse.json(
      { status: "error", reason: "Could not find parent directory" },
      { status: 404 },
    );
  }
  if (parent?.type !== "directory") {
    return NextResponse.json(
      { status: "error", reason: "Can only upload files underneath directories" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ status: "error", reason: "No file in request" }, { status: 400 });
  }
  if (Array.isArray(file)) {
    return NextResponse.json(
      { status: "error", reason: "Only one file allowed for upload" },
      { status: 400 },
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json(
      { status: "error", reason: "The uploaded file is not a valid file" },
      { status: 400 },
    );
  }

  const vPath = path.join(parent.path, file.name);
  // TODO: check if file already exists

  return handleFileUpload(db, file, parentId, vPath);
}
