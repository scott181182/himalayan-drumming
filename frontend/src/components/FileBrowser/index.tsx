"use client";

import { CompassOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { App, Button, Descriptions, Table, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo } from "react";

import { TagSelector } from "./TagSelector";
import { VideoPlayer } from "./VideoPlayer";
import { MultiCase } from "../MultiCase";
import { useDashboardDispatch, useDashboardState } from "@/components/DashboardContext";
import type { FileEntryBasicFragment} from "@/generated/graphql";
import { AssignFileMetadataDocument, GetAllFileEntriesDocument, GetFullContextDocument, StartFullScanDocument } from "@/generated/graphql";
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
    const { modal, message } = App.useApp();
    const apolloClient = useApolloClient();
    const promiseMsg = usePromiseMessage();

    const { fileTree, selectedFiles, selectedLocation } = useDashboardState();
    const { setSelectedFiles } = useDashboardDispatch();

    const startFullScan = useCallback(() => {
        apolloClient.mutate({
            mutation: StartFullScanDocument,
            refetchQueries: [ GetAllFileEntriesDocument ]
        }).then(...promiseMsg(
            "Full File Scan Completed!",
            "An error occurred during the file scan."
        ));
    }, [apolloClient, promiseMsg]);

    const onSelect = useCallback((keys: (string | number)[]) => {
        const files = keys.map((k) => typeof k === "string" && fileTree.hasNode(k) ?
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
            refetchQueries: [ GetFullContextDocument ],
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
        }).then(...promiseMsg(
            "Successfully assigned location to file!",
            "There was an unexpected error assigning location to file"
        ));
    }, [apolloClient, promiseMsg, selectedFiles, selectedLocation]);



    const files = useMemo<AntDTreeNode<FileEntryBasicFragment>[]>(
        () => fileTree.toAntdTree({
            titleFn: (t) => t.name,
            isLeafFn: (t) => t.type !== "directory"
        })?.children ?? [],
        [fileTree]
    );

    const previewFile = (file: FileEntryBasicFragment) => {
        const ext = file.name.substring(file.name.lastIndexOf(".") + 1);

        if(["mp4", "mov"].includes(ext)) {
            modal.info({
                title: file.name,
                closable: true,
                content: <VideoPlayer src={file.url}/>,
                width: "50%"
            });
        } else {
            message.warning("Unsupported file for preview");
        }
    };



    return <div className="flex flex-col h-full gap-1">
        <Button onClick={startFullScan} className="m-4">
            Full Scan
        </Button>
        <Table
            dataSource={files}
            className="flex-1 overflow-y-auto striped px-4"
            rowClassName={(row) => selectedFiles.some((sf) => sf.id === row.key) ? "selected cursor-pointer" : " cursor-pointer"}
            onRow={(row) => ({
                onClick: () => onSelect([ row.key ])
            })}
            columns={fileBrowserColumns}
            size="small"
        />
        <MultiCase
            value={selectedFiles}
            multiple={<Descriptions title={`${selectedFiles.length} files selected`}></Descriptions>}
            single={(selectedFile) => <>
                <Descriptions
                    title={selectedFile.name}
                    className="p-4 border-t-2 border-t-black wrap-title"
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="Tags">
                        <TagSelector file={selectedFile}/>
                    </Descriptions.Item>
                </Descriptions>
                <Space>
                    <Button
                        disabled={!selectedLocation}
                        onClick={assignLocation}
                        className="mx-8"
                    >
                        Assign Location
                    </Button>
                    <Button
                        onClick={() => previewFile(selectedFile)}
                        className="mx-8"
                    >
                        Preview File
                    </Button>
                </Space>
            </>}
        />
        {/* <Modal

        >

        </Modal> */}
    </div>;

}
