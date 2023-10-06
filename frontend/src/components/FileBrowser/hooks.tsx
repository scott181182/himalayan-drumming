import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { CreateFolderDocument } from "@/generated/graphql";
import { FileImageOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Input, Modal, Upload } from "antd";
import { useCallback, useState } from "react";





export function useCreateFolderModal() {
    const apolloClient = useApolloClient();
    const { refetchDashboard } = useDashboardDispatch();

    const [open, setOpen] = useState(false);
    const [parentId, setParentId] = useState<string | undefined>();
    const [folderName, setFolderName] = useState("");

    const onCancel = useCallback(() => {
        setOpen(false);
        setFolderName("");
    }, [setOpen, setFolderName]);

    const onSubmit = useCallback(() => {
        if(!parentId) {
            console.warn("No parentId set, cannot submit folder");
            return;
        }
        apolloClient.mutate({
            mutation: CreateFolderDocument,
            variables: {
                parentId,
                name: folderName
            }
        }).then(() => {
            onCancel();
            return refetchDashboard();
        })
    }, [apolloClient, folderName]);

    const openCreateFolderModal = useCallback((parentId: string) => {
        setParentId(parentId);
        setOpen(true);
    }, [setParentId, setOpen]);



    const createFolderModalContent = <Modal
        open={open}
        closable
        onCancel={onCancel}
        okText="Create Folder"
        onOk={onSubmit}
        okButtonProps={{
            disabled: !parentId
        }}
    >
        <Input
            value={folderName}
            onChange={(ev) => setFolderName(ev.target.value)}
            placeholder="Folder Name"
        />
    </Modal>

    return {
        openCreateFolderModal,
        closeCreateFolderModal: onCancel,
        createFolderModalContent
    };
}



export function useUploadFileModal() {
    const { refetchDashboard } = useDashboardDispatch();

    const [open, setOpen] = useState(false);
    const [parentId, setParentId] = useState<string | undefined>();

    const onCancel = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const openUploadFileModal = useCallback((parentId: string) => {
        setParentId(parentId);
        setOpen(true);
    }, [setParentId, setOpen]);



    const uploadFileModalContent = <Modal
        open={open}
        closable
        onCancel={onCancel}
        okButtonProps={{
            disabled: !parentId
        }}
        footer={(_, { CancelBtn }) => <CancelBtn/>}
    >
        <Upload.Dragger
            method="POST"
            action={`/api/files/${parentId}/children`}
            name="file"
            multiple={false}
            onChange={(info) => {
                if(info.file.status === "done") {
                    refetchDashboard();
                    onCancel();
                }
            }}
            disabled={!parentId}
        >
            <p className="ant-upload-drag-icon">
                <FileImageOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Upload.Dragger>
    </Modal>

    return {
        openUploadFileModal,
        closeUploadFileModal: onCancel,
        uploadFileModalContent
    };
}