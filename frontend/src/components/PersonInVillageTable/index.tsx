import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import type { TableColumnsType } from "antd";
import { Button, Table } from "antd";
import { useCallback, useMemo } from "react";

import { AddPersonToVillageButton } from "./AddPersonToVillageButton";
import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { RemovePersonFromVillageDocument, type PersonInContextFragment, type PersonInVillageInContextFragment, type VillageInContextFragment } from "@/generated/graphql";



export interface PersonInVillageTableProps {
    peopleInVillage: PersonInVillageInContextFragment[]

    person?: PersonInContextFragment;
    village?: VillageInContextFragment;
}

export function PersonInVillageTable({
    peopleInVillage,
    person,
    village
}: PersonInVillageTableProps) {
    const { refetchResources } = useDashboardDispatch();

    const [removeMutation] = useMutation(RemovePersonFromVillageDocument);

    const removeRelation = useCallback((rec: PersonInVillageInContextFragment) => {
        removeMutation({
            variables: {
                villageId: rec.village.id,
                personId: rec.person.id
            }
        }).then(() => refetchResources({
            villageIds: [ rec.village.id ],
            personIds: [ rec.person.id ]
        }));
    }, [refetchResources, removeMutation]);

    const columns = useMemo(() => {
        const cols: TableColumnsType<PersonInVillageInContextFragment> = [];
        if(!person) {
            cols.push({
                title: "Person",
                dataIndex: "person",
                render: (_, rec) => rec.person.name
            });
        }
        if(!village) {
            cols.push({
                title: "Village",
                dataIndex: "village",
                render: (_, rec) => rec.village.name
            });
        }
        cols.push({
            title: "Relation",
            dataIndex: "description",
            render: (_, rec) => rec.description
        });
        cols.push({
            key: "remove",
            render: (_, rec) => <Button
                icon={<DeleteOutlined/>}
                onClick={() => removeRelation(rec)}
            />
        });

        return cols;
    }, [person, removeRelation, village]);

    const footer = useMemo(() => {
        if(person && village) { return; }
        if(person) {
            // return;
        }
        if(village) {
            return <AddPersonToVillageButton village={village}/>;
        }
    }, [person, village]);

    return <Table
        dataSource={peopleInVillage}
        columns={columns}
        size="small"

        footer={() => footer}
    />;
}