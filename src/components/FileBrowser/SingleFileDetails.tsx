import { useApolloClient } from "@apollo/client/react";
import { Descriptions, Space, Button } from "antd";
import { useCallback } from "react";

import { useFilePreview } from "./FilePreview";
import { FileSelector } from "./FileSelector";
import { TagSelector } from "./TagSelector";
import { useDashboardState, useDashboardDispatch } from "@/contexts/DashboardContext";
import type { FileEntryBasicFragment } from "@/generated/graphql";
import { AssignFileMetadataDocument } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";

export interface SingleFileDetailsProps {
  file: FileEntryBasicFragment;
}
// oxlint-disable-next-line max-lines-per-function
export function SingleFileDetails({ file }: Readonly<SingleFileDetailsProps>) {
  const apolloClient = useApolloClient();
  const promiseMsg = usePromiseMessage();

  const { selectedLocation } = useDashboardState();
  const { updateFile } = useDashboardDispatch();
  const previewFile = useFilePreview();

  const assignLocation = useCallback(() => {
    if (!selectedLocation) {
      return;
    }

    void apolloClient
      .mutate({
        mutation: AssignFileMetadataDocument,
        variables: {
          fileId: file.id,
          data: {
            location: selectedLocation.id
              ? {
                  connect: { id: selectedLocation.id },
                }
              : {
                  create: {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  },
                },
          },
        },
      })
      .then((res) => {
        if (res.data?.updateMetadata) {
          updateFile(res.data.updateMetadata);
        }
      })
      .then(
        ...promiseMsg(
          "Successfully assigned location to file!",
          "There was an unexpected error assigning location to file",
        ),
      );
  }, [apolloClient, promiseMsg, file, selectedLocation, updateFile]);

  return (
    <>
      <Descriptions title={file.name} className="wrap-title" bordered size="small" column={24}>
        <Descriptions.Item label="Tags" span={24}>
          <TagSelector file={file} />
        </Descriptions.Item>
        <Descriptions.Item label="Associated Files" span={24}>
          <FileSelector file={file} />
        </Descriptions.Item>
      </Descriptions>
      <Space align="center" className="w-full">
        <Button disabled={!selectedLocation} onClick={assignLocation}>
          Assign Location
        </Button>
        {file.type === "file" && (
          <Button
            onClick={() => {
              previewFile(file);
            }}
          >
            Preview File
          </Button>
        )}
        {file.type === "reference" && (
          // oxlint-disable-next-line typescript/prefer-nullish-coalescing - We don't want the empty string here.
          <Button href={file.url || undefined} target="_blank">
            Open Referenced File
          </Button>
        )}
      </Space>
    </>
  );
}
