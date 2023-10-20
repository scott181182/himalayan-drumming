
import { CloseOutlined } from "@ant-design/icons";
import { useApolloClient, useQuery } from "@apollo/client";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { ReactElement} from "react";
import { useCallback, useMemo } from "react";

import cls from "./FileSelector.module.scss";
import { useDashboardDispatch } from "@/contexts/DashboardContext";
import type { FileEntryBasicFragment} from "@/generated/graphql";
import { AssociateFilesDocument, DisassociateFilesDocument, GetFileEntriesDocument } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";
import { uniqByFilter } from "@/utils/array";




function makeCustomFileTag(setSelectedFilesById: (fileIds: string[]) => void) {
    return function CustomFileTage({ label, onClose, value }: CustomTagProps): ReactElement {
        return <span
            className={`ant-select-selection-item ${cls.fileTag}`}
            title={label?.toString()}
        >
            <span
                className="ant-select-selection-item-content"
                onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    setSelectedFilesById([value]);
                }}
            >
                {label}
            </span>
            <span
                className="ant-select-selection-item-remove"
                onClick={onClose}    
            >
                <CloseOutlined/>
            </span>
        </span>;
    };
}


export interface FileSelectorProps {
    file: FileEntryBasicFragment;
}

export function FileSelector({
    file,
}: FileSelectorProps) {
    const { updateFile, setSelectedFilesById } = useDashboardDispatch();
    const handlePromise = usePromiseMessage();
    const apollo = useApolloClient();

    const { data: fileEntries, loading: filesLoading, refetch } = useQuery(GetFileEntriesDocument, {
        variables: {
            skip: 0,
            take: 10
        }
    });

    const fileOptions = useMemo<DefaultOptionType[]>(
        () => [ ...(fileEntries?.fileEntries ?? []), ...file.associatedFiles].map((f) => ({
            label: f.name,
            value: f.id
        })).filter(uniqByFilter("value")),
        [fileEntries?.fileEntries, file.associatedFiles]
    );



    const onAssociate = useCallback((file2Id: string) => {
        apollo.mutate({
            mutation: AssociateFilesDocument,
            variables: {
                file1Id: file.id,
                file2Id
            }
        })
            .then((res) => {
                res.data?.associateFiles?.forEach(updateFile);
            })
            .then(...handlePromise("Files Associated", "Error associating files"));
    }, [apollo, file.id, handlePromise, updateFile]);
    const onDisassociate = useCallback((file2Id: string) => {
        apollo.mutate({
            mutation: DisassociateFilesDocument,
            variables: {
                file1Id: file.id,
                file2Id,
            }
        })
            .then((res) => {
                res.data?.disassociateFiles?.forEach(updateFile);
            })
            .then(...handlePromise("Files Disassociated", "Error disassociating file"));
    }, [apollo, file.id, handlePromise, updateFile]);


    const onSearch = useCallback((text: string) => {
        console.log(text);
        refetch({ where: { name: { contains: text } } });
    }, [refetch]);



    return (
        <Select
            className="w-full"
            value={file.associatedFiles.map((f) => f.id)}
            options={fileOptions}
            filterOption={false}
            mode="tags"

            loading={filesLoading}
            tagRender={makeCustomFileTag(setSelectedFilesById)}

            onSelect={onAssociate}
            onDeselect={onDisassociate}
            onSearch={onSearch}

            onClick={(ev) => {
                console.log(ev);
            }}
        />
    );
}
