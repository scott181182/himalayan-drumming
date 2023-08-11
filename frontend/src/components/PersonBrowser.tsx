import { useQuery } from "@apollo/client";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

import { AsyncData } from "./AsyncData";
import { GetAllPeopleDocument, PersonAndParentFragment } from "@/generated/graphql";
import { AddPersonButton } from "./AddPersonButton";




export function PersonBrowser() {
    const { data: peopleData, loading, error } = useQuery(GetAllPeopleDocument);

    const columns: ColumnsType<PersonAndParentFragment> = [
        {
            title: "Name",
            dataIndex: "name"
        }
    ];

    const dataSource = useMemo(() => peopleData?.people.map((p) => ({ ...p, key: p.id })), [ peopleData ]);

    return <Space direction="vertical" className="w-full">
        {/* TODO: add search bar */}
        <AsyncData
            data={dataSource}
            loading={loading}
            error={error}
        >
            {(data) =>
                <Table
                    dataSource={data}
                    columns={columns}
                    className="striped"
                />
            }
        </AsyncData>
        <AddPersonButton/>
    </Space>
}
