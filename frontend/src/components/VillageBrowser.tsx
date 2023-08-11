import { useQuery } from "@apollo/client";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { AsyncData } from "./AsyncData";
import { AddVillageButton } from "./AddVillageButton";
import { GetAllVillagesDocument, SimpleVillageFragment } from "@/generated/graphql";
import { useMemo } from "react";



export function VillageBrowser() {
    const { data: villageData, loading, error } = useQuery(GetAllVillagesDocument);

    const columns: ColumnsType<SimpleVillageFragment> = [
        {
            title: "Name",
            dataIndex: "name"
        }
    ];

    const dataSource = useMemo(() => villageData?.villages.map((v) => ({ ...v, key: v.id })), [ villageData ]);

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
        <AddVillageButton/>
    </Space>
}
