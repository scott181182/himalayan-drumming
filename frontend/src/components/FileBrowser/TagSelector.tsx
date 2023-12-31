
import { PlusOutlined } from "@ant-design/icons";
import { useApolloClient, useMutation } from "@apollo/client";
import type { InputRef} from "antd";
import { Button, Divider, Input, Select, Space } from "antd";
import { useCallback, useRef, useState } from "react";

import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { useEnums } from "@/contexts/EnumContext";
import type { FileEntryBasicFragment} from "@/generated/graphql";
import { GetAllTagsDocument, GetFullContextDocument, TagFileDocument, UntagFileDocument } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";



export interface TagSelectorProps {
    file: FileEntryBasicFragment;
}

export function TagSelector({
    file,
}: TagSelectorProps) {
    const { tagOptions } = useEnums();
    const { updateFile } = useDashboardDispatch();
    const handlePromise = usePromiseMessage();
    const apollo = useApolloClient();
    const [tagFile, { loading }] = useMutation(TagFileDocument, {
        refetchQueries: [ GetAllTagsDocument, GetFullContextDocument ]
    });

    const inputRef = useRef<InputRef>(null);
    const [newTag, setNewTag] = useState("");

    const onTagSuccess = useCallback(() => {
        setNewTag("");
    }, [setNewTag]);



    const onAddTag = useCallback((tag: string) => {
        apollo.mutate({
            mutation: TagFileDocument,
            variables: {
                fileId: file.id,
                tag
            }
        })
            .then((res) => {
                if(res.data?.tagFile) { updateFile(res.data?.tagFile); }
            })
            .then(...handlePromise("File tagged", "Error tagging file"));
    }, [apollo, file.id, handlePromise, updateFile]);
    const onRemoveTag = useCallback((tag: string) => {
        apollo.mutate({
            mutation: UntagFileDocument,
            variables: {
                fileId: file.id,
                tag
            }
        })
            .then((res) => {
                if(res.data?.untagFile) { updateFile(res.data?.untagFile); }
            })
            .then(...handlePromise("File tag remove", "Error untagging file"));
    }, [apollo, file.id, handlePromise, updateFile]);

    const createTag = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        console.log(newTag);
        if(!newTag) { return; }

        return tagFile({
            refetchQueries: [ GetAllTagsDocument ],
            variables: {
                fileId: file.id,
                tag: newTag
            }
        })
            .then((res) => {
                if(res.data?.tagFile) { updateFile(res.data?.tagFile); }
            })
            .then(...handlePromise("Tag Created", "Error Creating Tag", { onSuccess: onTagSuccess }))
            .then(() => inputRef.current?.focus());
    }, [newTag, tagFile, file.id, handlePromise, onTagSuccess, updateFile]);



    return (
        <Select
            className="w-full"
            value={file.tags}
            options={tagOptions}
            mode="tags"

            onSelect={onAddTag}
            onDeselect={onRemoveTag}

            dropdownRender={(menu) => <>
                {menu}
                <Divider className="my-4 mx-0"/>
                <Space className="pb-2 pt-0 px-4">
                    <Input
                        placeholder="Please enter item"
                        ref={inputRef}
                        value={newTag}
                        onChange={(ev) => setNewTag(ev.target.value)}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={createTag} disabled={!newTag} loading={loading}>
                        Add Tag
                    </Button>
                </Space>
            </>}
        />
    );
}
