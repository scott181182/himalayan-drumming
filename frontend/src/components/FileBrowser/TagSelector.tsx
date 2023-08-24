import { FileEntryBasicFragment, GetAllTagsDocument, GetFullContextDocument, TagFileDocument } from "@/generated/graphql";
import { App, Button, Divider, Input, InputRef, Select, Space } from "antd";

import { useEnums } from "../EnumContext";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { usePromiseMessage } from "@/utils/antd";



export interface TagSelectorProps {
    file: FileEntryBasicFragment;
}

export function TagSelector({
    file,
}: TagSelectorProps) {
    const { tagOptions } = useEnums();
    const handlePromise = usePromiseMessage();
    const [tagFile, { loading }] = useMutation(TagFileDocument, {
        refetchQueries: [ GetAllTagsDocument, GetFullContextDocument ]
    });

    const inputRef = useRef<InputRef>(null);
    const [newTag, setNewTag] = useState("");

    const onTagSuccess = useCallback(() => {
        setNewTag("");
    }, [setNewTag]);

    const onAddTag = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        console.log(newTag);
        if(!newTag) { return; }

        return tagFile({
            variables: {
                fileId: file.id,
                tag: newTag
            }
        })
            .then(...handlePromise("Tag Created", "Error Creating Tag", { onSuccess: onTagSuccess }))
            .then(() => inputRef.current?.focus());
    }, [newTag, tagFile, handlePromise, onTagSuccess]);



    return (
        <Select
            className="w-full"
            value={file.tags}
            options={tagOptions}

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
                    <Button type="text" icon={<PlusOutlined />} onClick={onAddTag} disabled={!newTag} loading={loading}>
                        Add Tag
                    </Button>
                </Space>
            </>}
        />
    );
}