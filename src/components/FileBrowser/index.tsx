// oxlint-disable import/max-dependencies
"use client";

import { Button, Descriptions, Table, Space, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CompassIcon } from "lucide-react";
import Link from "next/link";
import type { Reference as TableReference } from "rc-table/es/interface";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { MultiCase } from "../MultiCase";
import { useAddReferenceModal, useCreateFolderModal, useUploadFileModal } from "./hooks";
import { SingleFileDetails } from "./SingleFileDetails";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";
import type { FileEntryBasicFragment } from "@/generated/graphql";
import { ROOT_FILE_ENTRY_ID } from "@/lib/files";
import { isDefined } from "@/utils/array";
import type { AntDTreeNode } from "@/utils/tree";

const fileBrowserColumns: ColumnsType<AntDTreeNode<FileEntryBasicFragment>> = [
  {
    title: <h3 className="ml-4 text-lg font-bold">Files</h3>,
    dataIndex: "title",
  },
  {
    key: "icons",
    render: (_, record) => <Space>{record.data.metadata?.location && <CompassIcon />}</Space>,
  },
];

// oxlint-disable-next-line max-lines-per-function
export function FileBrowser() {
  const { fileTree, selectedFiles, filePredicate } = useDashboardState();
  const { setSelectedFiles, filterFiles } = useDashboardDispatch();

  const tableRef = useRef<TableReference>(null);

  const onSelect = useCallback(
    (keys: (string | number)[]) => {
      const files = keys
        .map((k, i, a) =>
          typeof k === "string" && fileTree.hasNode(k) && a.indexOf(k) === i
            ? fileTree.getNode(k)
            : undefined,
        )
        .filter(isDefined);

      setSelectedFiles(files);
    },
    [setSelectedFiles, fileTree],
  );

  const files = useMemo<AntDTreeNode<FileEntryBasicFragment>[]>(
    () =>
      fileTree.toAntdTree({
        titleFn: (t) => t.name,
        isLeafFn: (t) => t.type !== "directory",
        filter: filePredicate,
      })?.children ?? [],
    [filePredicate, fileTree],
  );

  const selectedDirectory = useMemo(() => {
    if (selectedFiles[0]?.type === "directory") {
      return selectedFiles[0].id;
    }
    return selectedFiles[0]?.parentId ?? ROOT_FILE_ENTRY_ID;
  }, [selectedFiles]);

  const { createFolderModalContent, openCreateFolderModal } = useCreateFolderModal();
  const { uploadFileModalContent, openUploadFileModal } = useUploadFileModal();
  const { addReferenceModalContent, openAddReferenceModal } = useAddReferenceModal();

  const onSearch = useCallback(
    (value: string) => {
      if (value) {
        filterFiles(
          (file) => file.name.includes(value) || file.tags.some((t) => t.includes(value)),
        );
      } else {
        filterFiles();
      }
    },
    [filterFiles],
  );

  const onRowClick = useCallback(
    (row: AntDTreeNode<FileEntryBasicFragment>) => {
      return (ev: MouseEvent) => {
        if (ev.ctrlKey) {
          // Individual multi-select
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion - Only strings are used for row keys in this component.
          onSelect([...selectedFiles.map((f) => f.id), row.key as string]);
        } else if (ev.shiftKey) {
          // Remove text selection that is caused by shift-clicking text.
          document.getSelection()?.removeAllRanges();

          // Range multi-selected
          const lastFile = selectedFiles.at(-1);
          if (lastFile) {
            onSelect([
              ...selectedFiles.slice(0, -1).map((f) => f.id),
              // oxlint-disable-next-line typescript/no-unsafe-type-assertion - Only strings are used for row keys in this component.
              ...fileTree.getTraversedRange(lastFile.id, row.key as string).map((f) => f.id),
            ]);
          }
        } else {
          // Single select
          if (selectedFiles.length === 1 && selectedFiles[0].id === row.key) {
            onSelect([]);
          } else {
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion - Only strings are used for row keys in this component.
            onSelect([row.key as string]);
          }
        }
      };
    },
    [fileTree, onSelect, selectedFiles],
  );

  useEffect(() => {
    if (!tableRef.current || selectedFiles.length === 0) {
      return;
    }
    const firstFile = selectedFiles[0];
    const rows = [...tableRef.current.nativeElement.querySelectorAll("tr")];
    const firstRow = rows.find((r) => r.textContent?.includes(firstFile.name));
    if (!firstRow) {
      console.warn(`Could not find row with text '${firstFile.name}'`);
      return;
    }

    firstRow.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedFiles]);

  return (
    <div className="flex flex-col h-full gap-1">
      <Input.Search placeholder="Search Files" onSearch={onSearch} className="p-4" />
      <Table
        dataSource={files}
        ref={tableRef}
        className="flex-1 overflow-y-auto striped px-4"
        rowClassName={(row) =>
          selectedFiles.some((sf) => sf.id === row.key)
            ? "selected cursor-pointer"
            : " cursor-pointer"
        }
        onRow={(row) => ({
          onClick: onRowClick(row),
        })}
        columns={fileBrowserColumns}
        size="small"
        expandable={{
          defaultExpandAllRows: true,
        }}
      />
      <div className="border-solid border-l-0 border-r-0 border-b-0 border-t-2 p-4 flex flex-col gap-2">
        <MultiCase
          value={selectedFiles}
          multiple={
            <>
              <Descriptions
                title={`${selectedFiles.length} files selected`}
                className="wrap-title"
              ></Descriptions>
              <Space>
                <Link
                  href={`/compare?files=${selectedFiles.map((f) => f.id).join(",")}`}
                  target="_blank"
                >
                  Preview Files
                </Link>
              </Space>
            </>
          }
          // oxlint-disable-next-line react/no-unstable-nested-components
          single={(selectedFile) => <SingleFileDetails file={selectedFile} />}
        />
        <Space align="center">
          <Button
            disabled={selectedFiles.length > 1}
            onClick={() => {
              openCreateFolderModal(selectedDirectory);
            }}
          >
            Create Folder
          </Button>
          {createFolderModalContent}
          <Button
            disabled={selectedFiles.length > 1}
            onClick={() => {
              openUploadFileModal(selectedDirectory);
            }}
          >
            Upload File
          </Button>
          {uploadFileModalContent}
          <Button
            disabled={selectedFiles.length > 1}
            onClick={() => {
              openAddReferenceModal(selectedDirectory);
            }}
          >
            Add Reference
          </Button>
          {addReferenceModalContent}
        </Space>
      </div>
    </div>
  );
}
