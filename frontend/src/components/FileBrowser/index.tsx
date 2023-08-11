import { useApolloClient } from "@apollo/client";
import { CompassOutlined } from "@ant-design/icons";
import type { TreeDataNode } from "antd";
import { App, Modal , Button, Descriptions, Tag, Tree, Table, Row, Col } from "antd";
import { useCallback, useMemo } from "react";

import { MultiCase } from "../MultiCase";
import { useDashboardDispatch, useDashboardState } from "@/app/context";
import type { FileEntryBasicFragment} from "@/generated/graphql";
import { AssignFileMetadataDocument, GetAllFileEntriesDocument, StartFullScanDocument } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";
import { isDefined } from "@/utils/array";
import { ColumnsType } from "antd/es/table";
import { VideoPlayer } from "./VideoPlayer";



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
            refetchQueries: [ GetAllFileEntriesDocument ],
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



    const files = useMemo<TreeDataNode[]>(
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

    const columns: ColumnsType<TreeDataNode> = [
        {
            title: <h3 className="ml-4 text-lg font-bold">Files</h3>,
            dataIndex: "title",
        }
    ]

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
            columns={columns}
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
                        {selectedFile.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location">
                        {selectedFile.metadata?.location ?
                            <Button
                                icon={<CompassOutlined/>}
                                onClick={() => message.info(`(${selectedFile.metadata?.location?.latitude}, ${selectedFile.metadata?.location?.longitude})`)}
                            /> :
                            <em>None</em>
                        }
                    </Descriptions.Item>
                </Descriptions>
                <Row>
                    <Col>
                        <Button
                            disabled={!selectedLocation}
                            onClick={assignLocation}
                            className="mx-8"
                        >
                            Assign Location
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            onClick={() => previewFile(selectedFile)}
                            className="mx-8"
                        >
                            Preview File
                        </Button>
                    </Col>
                </Row>
            </>}
        />
        {/* <Modal

        >

        </Modal> */}
    </div>;

}
