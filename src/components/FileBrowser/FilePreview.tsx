import { App } from "antd";
import type { JSX } from "react";
import { useCallback } from "react";

import { MediaPlayerRow } from "../MediaPlayerRow";
import type { FileEntryBasicFragment } from "@/generated/graphql";

export type FilePreviewFn = (file: FileEntryBasicFragment) => void;

export function useFilePreview(): FilePreviewFn {
  const { modal, message } = App.useApp();

  return useCallback<FilePreviewFn>(
    (file) => {
      const content = getFilePreviewContent(file);
      if (!content) {
        return void message.warning("Unsupported file for preview");
      }

      modal.info({
        title: file.name,
        closable: true,
        content: <div className="flex justify-center">{content}</div>,
        width: "50%",
      });
    },
    [modal, message],
  );
}

const imageExts = new Set([
  "bmp",
  "gif",
  "icns",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "tif",
  "tiff",
  "webp",
]);
const videoExts = new Set(["mov", "mp4"]);

function getFilePreviewContent(file: FileEntryBasicFragment): JSX.Element | undefined {
  const ext = file.name.substring(file.name.lastIndexOf(".") + 1);

  if (imageExts.has(ext)) {
    return imageFilePreview(file.url);
  }
  if (videoExts.has(ext)) {
    return videoFilePreview(file.url);
  }

  return undefined;
}

function imageFilePreview(url: string | null | undefined) {
  // oxlint-disable-next-line next/no-img-element typescript/prefer-nullish-coalescing
  return <img src={url || undefined} alt="File Preview" />;
}

function videoFilePreview(url: string | null | undefined) {
  return <MediaPlayerRow src={url} mediaColProps={{ span: 24 }} waveformColProps={{ span: 24 }} />;
}
