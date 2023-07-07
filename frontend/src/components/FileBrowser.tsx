import { useApolloClient } from "@apollo/client";
import type { TreeDataNode } from "antd";
import { Button, Descriptions, Tag, Tree } from "antd";
import { useCallback, useContext, useMemo } from "react";

import { MultiCase } from "./MultiCase";
import {  DashboardDispatchContext, useDashboardState } from "@/app/context";
import { AssignFileMetadataDocument, GetAllFileEntriesDocument, StartFullScanDocument } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";
import { isDefined } from "@/utils/array";



export function FileBrowser() {
    const apolloClient = useApolloClient();
    const promiseMsg = usePromiseMessage();

    const { fileTree, selectedFiles, selectedLocation } = useDashboardState();
    const dispath = useContext(DashboardDispatchContext);

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

        dispath?.({ type: "setSelectedFiles", payload: files });
    }, [dispath, fileTree]);

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



    return <div className="flex flex-col h-full gap-1">
        <Button onClick={startFullScan} className="m-4">
            Full Scan
        </Button>
        <h3 className="ml-4 text-lg font-bold">Files</h3>
        <Tree
            treeData={files}
            className="flex-1 overflow-y-auto"
            selectedKeys={selectedFiles.map((f) => f.id)}
            onSelect={onSelect}
        />
        <MultiCase
            value={selectedFiles}
            multiple={<Descriptions title={`${selectedFiles.length} files selected`}></Descriptions>}
            single={(selectedFile) => <>
                <Descriptions
                    title={selectedFile.name}
                    className="p-4 border-t-2 border-t-black"
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="Tags">
                        {selectedFile.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location">
                        {selectedFile.metadata?.location ?
                            `${selectedFile.metadata.location.latitude}, ${selectedFile.metadata.location.longitude}` :
                            <em>None</em>
                        }
                    </Descriptions.Item>
                </Descriptions>
                <Button
                    disabled={!selectedLocation}
                    onClick={assignLocation}
                    className="mx-8"
                >
                    Assign Location
                </Button>
            </>}
        />
    </div>;

}
