import type { NextRequest } from "next/server";

import { ApiError } from "./errors";
import { auth, getAuthDbClient } from "@/lib/server/auth";
import type { DbClient } from "@/lib/server/db";

export interface FileUploadContext {
  db: DbClient;
  formData: FormData;
}
export async function getFileUploadContext(req: Readonly<NextRequest>): Promise<FileUploadContext> {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(401, "Unauthorized");
  }
  const db = getAuthDbClient(session.user.id);

  const formData = await req.formData();

  return { db, formData };
}

export interface PrepareUploadResult {
  vPath: string;
  file: File;
}
export function prepareUpload(
  formData: Readonly<FormData>,
  fileKey: string,
  basePath: string,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  fileName: string | string[] | undefined | ((file: File) => string | string[] | undefined),
): PrepareUploadResult {
  const file = formData.get(fileKey);
  if (!file) {
    throw new ApiError(400, "No file in request");
  }
  if (Array.isArray(file)) {
    throw new ApiError(400, "Only one file allowed for upload");
  }
  if (!(file instanceof File)) {
    throw new ApiError(400, "The uploaded file is not a valid file");
  }

  if (typeof fileName === "function") {
    fileName = fileName(file);
  }

  if (!fileName || (Array.isArray(fileName) && fileName.length !== 1)) {
    throw new ApiError(400, "Invalid file name");
  }
  if (!Array.isArray(fileName)) {
    fileName = [fileName];
  }

  const vPath = [basePath, ...fileName].join("/");
  return { vPath, file };
}
