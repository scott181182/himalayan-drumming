import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import type { TableColumnsType } from "antd";
import { Button, Table } from "antd";
import { useCallback, useMemo } from "react";

import { useDashboardDispatch } from "@/contexts/DashboardContext";
import type { PersonInContextFragment, PersonOnFileInContextFragment, FileEntryInContextFragment } from "@/generated/graphql";
import { RemovePersonFromFileDocument } from "@/generated/graphql";



export interface PersonOnFileTableProps {
    personOnFile: PersonOnFileInContextFragment[]

    person?: PersonInContextFragment;
    file?: FileEntryInContextFragment;
}

export function PersonOnFileTable({
    personOnFile,
    person,
    file
}: PersonOnFileTableProps) {
    const { refetchResources, setSelectedRelation, setSelectedFilesById } = useDashboardDispatch();

    const [removeMutation] = useMutation(RemovePersonFromFileDocument);

    const removeRelation = useCallback((rec: PersonOnFileInContextFragment) => {
        removeMutation({
            variables: {
                fileId: rec.file.id,
                personId: rec.person.id
            }
        }).then(() => refetchResources({
            fileIds: [ rec.file.id ],
            personIds: [ rec.person.id ]
        }));
    }, [refetchResources, removeMutation]);

    const columns = useMemo(() => {
        const cols: TableColumnsType<PersonOnFileInContextFragment> = [];
        if(!person) {
            cols.push({
                title: "Person",
                dataIndex: "person",
                render: (_, rec) => <Button
                    type="link"
                    size="small"
                    onClick={() => setSelectedRelation({ type: "person", personId: rec.person.id })}
                >
                    {rec.person.name}
                </Button>
            });
        }
        if(!file) {
            cols.push({
                title: "File",
                dataIndex: "file",
                render: (_, rec) => <Button
                    type="link"
                    size="small"
                    onClick={() => setSelectedFilesById([ rec.file.id ])}
                >
                    {rec.file.name}
                </Button>
            });
        }
        cols.push({
            title: "Instrument",
            dataIndex: "instrument",
            render: (_, rec) => rec.instrument
        });
        cols.push({
            title: "Notes",
            dataIndex: "notes",
            render: (_, rec) => rec.notes
        });
        cols.push({
            key: "remove",
            render: (_, rec) => <Button
                icon={<DeleteOutlined/>}
                onClick={() => removeRelation(rec)}
            />
        });

        return cols;
    }, [person, file, setSelectedRelation, setSelectedFilesById, removeRelation]);

    const footer = useMemo<JSX.Element | undefined>(() => {
        if(person && file) { return undefined; }
        if(person) {
            // return;
        }
        if(file) {
            // return <AddPersonToVillageButton file={file}/>;
        }
    }, [person, file]);

    return <Table
        dataSource={personOnFile}
        columns={columns}
        size="small"
        className="overflow-x-auto"

        footer={() => footer}
        pagination={false}
    />;
}