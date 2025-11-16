import { FileImageOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Input, Modal, Upload } from "antd";
import type { ReactNode} from "react";
import { useCallback, useState } from "react";

import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { CreateFileReferenceDocument, CreateFolderDocument } from "@/generated/graphql";





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
        });
    }, [apolloClient, folderName, onCancel, parentId, refetchDashboard]);

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
    </Modal>;

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
        // Casting here because the Ant Design type isn't up-to-date with this footer render function.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        footer={((_: unknown, { CancelBtn }: { CancelBtn: any }) => <CancelBtn/>) as unknown as ReactNode}
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
    </Modal>;

    return {
        openUploadFileModal,
        closeUploadFileModal: onCancel,
        uploadFileModalContent
    };
}



export function useAddReferenceModal() {
    const apolloClient = useApolloClient();
    const { refetchDashboard } = useDashboardDispatch();

    const [open, setOpen] = useState(false);
    const [parentId, setParentId] = useState<string | undefined>();
    const [fileName, setFileName] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const onCancel = useCallback(() => {
        setOpen(false);
        setFileName("");
        setFileUrl("");
    }, [setOpen]);

    const onSubmit = useCallback(() => {
        if(!parentId) {
            console.warn("No parentId set, cannot submit file reference");
            return;
        }
        if(!fileName) {
            console.warn("No fileName set, cannot submit file reference");
            return;
        }
        if(!fileUrl) {
            console.warn("No fileUrl set, cannot submit file reference");
            return;
        }
        apolloClient.mutate({
            mutation: CreateFileReferenceDocument,
            variables: {
                parentId,
                name: fileName,
                url: fileUrl
            }
        }).then(() => {
            onCancel();
            return refetchDashboard();
        });
    }, [apolloClient, fileName, fileUrl, onCancel, parentId, refetchDashboard]);

    const openAddReferenceModal = useCallback((parentId: string) => {
        setParentId(parentId);
        setOpen(true);
    }, [setParentId, setOpen]);



    const addReferenceModalContent = <Modal
        open={open}
        closable
        onCancel={onCancel}
        okText="Add File Reference"
        onOk={onSubmit}
        okButtonProps={{
            disabled: !parentId
        }}
        bodyStyle={{ paddingRight: "1.5rem" }}
    >
        <Input
            value={fileName}
            onChange={(ev) => setFileName(ev.target.value)}
            placeholder="Reference Name"
            className="mb-2"
        />
        <Input
            value={fileUrl}
            onChange={(ev) => setFileUrl(ev.target.value)}
            placeholder="Reference URL"
        />
    </Modal>;

    return {
        openAddReferenceModal,
        closeCreateFolderModal: onCancel,
        addReferenceModalContent
    };
}