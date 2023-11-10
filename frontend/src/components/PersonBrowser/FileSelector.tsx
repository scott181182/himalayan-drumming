
import { CloseOutlined } from "@ant-design/icons";
import { useApolloClient, useQuery } from "@apollo/client";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { ReactElement} from "react";
import { useCallback, useMemo } from "react";

import cls from "./FileSelector.module.scss";
import { useDashboardDispatch } from "@/contexts/DashboardContext";
import type { FileEntryBasicFragment, PersonInContextFragment} from "@/generated/graphql";
import { AssociateFilesDocument, DisassociateFilesDocument, GetFileEntriesDocument, UpdatePersonDocument } from "@/generated/graphql";
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
    person: PersonInContextFragment;
}

export function FileSelector({
    person,
}: FileSelectorProps) {
    const { updatePerson, setSelectedFilesById } = useDashboardDispatch();
    const handlePromise = usePromiseMessage();
    const apollo = useApolloClient();

    const { data: fileEntries, loading: filesLoading, refetch } = useQuery(GetFileEntriesDocument, {
        variables: {
            skip: 0,
            take: 10
        }
    });

    const fileOptions = useMemo<DefaultOptionType[]>(
        () => [ ...(fileEntries?.fileEntries ?? []), ...person.files].map((f) => ({
            label: f.name,
            value: f.id
        })).filter(uniqByFilter("value")),
        [fileEntries?.fileEntries, person.files]
    );



    const onAssociate = useCallback((fileId: string) => {
        apollo.mutate({
            mutation: UpdatePersonDocument,
            variables: {
                personId: person.id,
                data: {
                    files: {
                        connect: [ { id: fileId } ]
                    }
                }
            }
        })
            .then((res) => {
                if(res.data?.updatePerson) {
                    updatePerson(res.data?.updatePerson);
                }
            })
            .then(...handlePromise("File Associated", "Error associating file"));
    }, [apollo, handlePromise, person.id, updatePerson]);

    const onDisassociate = useCallback((fileId: string) => {
        apollo.mutate({
            mutation: UpdatePersonDocument,
            variables: {
                personId: person.id,
                data: {
                    files: {
                        disconnect: [ { id: fileId } ]
                    }
                }
            }
        })
            .then((res) => {
                if(res.data?.updatePerson) {
                    updatePerson(res.data?.updatePerson);
                }
            })
            .then(...handlePromise("File Disassociated", "Error disassociating file"));
    }, [apollo, handlePromise, person.id, updatePerson]);


    const onSearch = useCallback((text: string) => {
        console.log(text);
        refetch({ where: { name: { contains: text } } });
    }, [refetch]);



    return (
        <Select
            className="w-full"
            value={person.files.map((f) => f.id)}
            options={fileOptions}
            filterOption={false}
            mode="tags"

            loading={filesLoading}
            tagRender={makeCustomFileTag(setSelectedFilesById)}

            onSelect={onAssociate}
            onDeselect={onDisassociate}
            onSearch={onSearch}
        />
    );
}
