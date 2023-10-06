import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { CreateFolderDocument } from "@/generated/graphql";
import { useApolloClient } from "@apollo/client";
import { Input, Modal } from "antd";
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