import { PlusOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Button, Table } from "antd";
import { useMemo } from "react";

import { AddPersonToVillageButton } from "./AddPersonToVillageButton";
import type { PersonInContextFragment, PersonInVillageInContextFragment, VillageInContextFragment } from "@/generated/graphql";



export type VillageOrPerson = "Village" | "Person";
function getTo(from: VillageOrPerson): VillageOrPerson {
    if(from === "Village") { return "Person"; }
    return "Village";
}

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
    // const to = useMemo(() => from && getTo(from), [from]);

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

        return cols;
    }, []);

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