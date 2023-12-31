"use client";

import { CompassOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Button, Descriptions, Table, Space, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { MouseEvent} from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useFilePreview } from "./FilePreview";
import { FileSelector } from "./FileSelector";
import { useAddReferenceModal, useCreateFolderModal, useUploadFileModal } from "./hooks";
import { TagSelector } from "./TagSelector";
import { MultiCase } from "../MultiCase";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";
import type { FileEntryBasicFragment} from "@/generated/graphql";
import { AssignFileMetadataDocument } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";
import { isDefined } from "@/utils/array";
import type { AntDTreeNode } from "@/utils/tree";



const fileBrowserColumns: ColumnsType<AntDTreeNode<FileEntryBasicFragment>> = [
    {
        title: <h3 className="ml-4 text-lg font-bold">Files</h3>,
        dataIndex: "title",
    },
    {
        key: "icons",
        render: (_, record) => <Space>
            {record.data.metadata?.location && <CompassOutlined/>}
        </Space>
    }
];



export function FileBrowser() {
    const apolloClient = useApolloClient();
    const promiseMsg = usePromiseMessage();

    const { fileTree, selectedFiles, selectedLocation, filePredicate } = useDashboardState();
    const { setSelectedFiles, updateFile, filterFiles } = useDashboardDispatch();

    const tableRef = useRef<HTMLDivElement>(null);



    const onSelect = useCallback((keys: (string | number)[]) => {
        const files = keys.map((k, i, a) => typeof k === "string" && fileTree.hasNode(k) && a.indexOf(k) === i ?
            fileTree.getNode(k) :
            undefined
        ).filter(isDefined);

        setSelectedFiles(files);
    }, [setSelectedFiles, fileTree]);

    const assignLocation = useCallback(() => {
        const selectedFile = selectedFiles[0];
        if(!selectedFile || !selectedLocation) { return; }

        apolloClient.mutate({
            mutation: AssignFileMetadataDocument,
            variables: {
                fileId: selectedFile.id,
                data: {
                    location: selectedLocation.id ? {
                        connect: { id: selectedLocation.id }
                    } : {
                        create: {
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude
                        }
                    }
                }
            }
        })
            .then((res) => {
                if(res.data?.updateMetadata) { updateFile(res.data.updateMetadata); }
            })
            .then(...promiseMsg(
                "Successfully assigned location to file!",
                "There was an unexpected error assigning location to file"
            ));
    }, [apolloClient, promiseMsg, selectedFiles, selectedLocation, updateFile]);


    const files = useMemo<AntDTreeNode<FileEntryBasicFragment>[]>(
        () => fileTree.toAntdTree({
            titleFn: (t) => t.name,
            isLeafFn: (t) => t.type !== "directory",
            filter: filePredicate
        })?.children ?? [],
        [filePredicate, fileTree]
    );

    const previewFile = useFilePreview();

    const { createFolderModalContent, openCreateFolderModal } = useCreateFolderModal();
    const { uploadFileModalContent, openUploadFileModal } = useUploadFileModal();
    const { addReferenceModalContent, openAddReferenceModal } = useAddReferenceModal();



    const onSearch = useCallback((value: string) => {
        if(value) {
            filterFiles((file) =>
                file.name.includes(value) || file.tags.some((t) => t.includes(value)));
        } else {
            filterFiles();
        }
    }, [filterFiles]);

    const onRowClick = useCallback((row: AntDTreeNode<FileEntryBasicFragment>) => {
        return (ev: MouseEvent) => {
            if(ev.ctrlKey) {
                // Individual multi-select
                onSelect([ ...selectedFiles.map((f) => f.id), row.key ]);
            } else if(ev.shiftKey) {
                // Remove text selection that is caused by shift-clicking text.
                document.getSelection()?.removeAllRanges();

                // Range multi-selected
                const lastFile = selectedFiles[selectedFiles.length - 1];
                onSelect([
                    ...selectedFiles.slice(0, -1).map((f) => f.id),
                    ...fileTree.getTraversedRange(lastFile.id, row.key as string).map((f) => f.id)
                ]);
            } else {
                // Single select
                onSelect([ row.key ]);
            }
        };
    }, [fileTree, onSelect, selectedFiles]);



    useEffect(() => {
        if(!tableRef.current || selectedFiles.length === 0) { return; }
        const firstFile = selectedFiles[0];
        const rows = [ ...tableRef.current.getElementsByTagName("tr") ];
        const firstRow = rows.find((r) => r.textContent?.includes(firstFile.name));
        if(!firstRow) {
            console.warn(`Could not find row with text '${firstFile.name}'`);
            return;
        }

        firstRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [selectedFiles]);


    return <div className="flex flex-col h-full gap-1">
        <Input.Search
            placeholder="Search Files"
            onSearch={onSearch}
            className="p-4"
        />
        <Table
            dataSource={files}
            ref={tableRef}
            className="flex-1 overflow-y-auto striped px-4"
            rowClassName={(row) => selectedFiles.some((sf) => sf.id === row.key) ? "selected cursor-pointer" : " cursor-pointer"}
            onRow={(row) => ({
                onClick: onRowClick(row),
            })}
            columns={fileBrowserColumns}
            size="small"
            expandable={{
                defaultExpandAllRows: true
            }}
        />
        <div className="border-solid border-l-0 border-r-0 border-b-0 border-t-2">
            <MultiCase
                value={selectedFiles}
                multiple={<>
                    <Descriptions
                        title={`${selectedFiles.length} files selected`}
                        className="p-4 border-t-2 border-t-black wrap-title"
                    ></Descriptions>
                    <Space>
                        <Link
                            href={`/compare?files=${selectedFiles.map((f) => f.id).join(",")}`}
                            target="_blank"
                        >
                            Preview Files
                        </Link>
                    </Space>
                </>}
                single={(selectedFile) => <>
                    <Descriptions
                        title={selectedFile.name}
                        className="p-4 border-t-2 border-t-black wrap-title"
                        bordered
                        size="small"
                    >
                        <Descriptions.Item label="Tags" span={24}>
                            <TagSelector file={selectedFile}/>
                        </Descriptions.Item>
                        <Descriptions.Item label="Associated Files" span={24}>
                            <FileSelector file={selectedFile}/>
                        </Descriptions.Item>
                    </Descriptions>
                    <Space align="center" className="w-full px-4">
                        <Button
                            disabled={!selectedLocation}
                            onClick={assignLocation}
                        >
                            Assign Location
                        </Button>
                        {
                            selectedFile.type === "file" &&
                            <Button
                                onClick={() => previewFile(selectedFile)}
                            >
                                Preview File
                            </Button>
                        }
                        {
                            selectedFile.type === "reference" &&
                            <Button
                                href={selectedFile.url || undefined}
                                target="_blank"
                            >
                                Open Referenced File
                            </Button>
                        }
                        {
                            selectedFile.type === "directory" && <>
                                <Button
                                    onClick={() => openCreateFolderModal(selectedFile.id)}
                                >
                                    Create Folder
                                </Button>
                                {createFolderModalContent}
                                <Button
                                    onClick={() => openUploadFileModal(selectedFile.id)}
                                >
                                    Upload File
                                </Button>
                                {uploadFileModalContent}
                                <Button
                                    onClick={() => openAddReferenceModal(selectedFile.id)}
                                >
                                    Add Reference
                                </Button>
                                {addReferenceModalContent}
                            </>
                        }
                    </Space>
                </>}
            />
        </div>
    </div>;

}
