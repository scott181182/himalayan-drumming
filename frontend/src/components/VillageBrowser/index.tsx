"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";

import { VillageDetails } from "./VillageDetails";
import { AddVillageButton } from "../AddVillageButton";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";
import type { VillageInContextFragment } from "@/generated/graphql";



const columns: ColumnsType<VillageInContextFragment> = [
    {
        title: "Name",
        dataIndex: "name"
    }
];


export interface VillageBrowserProps {
    selectedVillageId?: string;
}
export function VillageBrowser({
    selectedVillageId
}: VillageBrowserProps) {
    const { villages } = useDashboardState();
    const { refetchVillage, setSelectedRelation } = useDashboardDispatch();
    const [searchValue, setSearchValue] = useState("");

    const filteredVillages = useMemo(() => {
        return searchValue ?
            villages.filter((v) =>
                v.name.toLowerCase().includes(searchValue) ||
                v.divinities?.toLowerCase()?.includes(searchValue) ||
                v.rituals?.toLowerCase()?.includes(searchValue) ||
                v.temples?.toLowerCase()?.includes(searchValue) ||
                v.notes?.toLowerCase()?.includes(searchValue) ||
                v.people.some((p) => p.person.name.toLowerCase().includes(searchValue))
            ) :
            villages;
    }, [searchValue, villages]);

    const currentVillage = useMemo(() => {
        if(!selectedVillageId) { return undefined; }
        return villages.find((v) => v.id === selectedVillageId);
    }, [villages, selectedVillageId]);

    const onVillageUpdate = useCallback(() => {
        if(!selectedVillageId) { return; }
        refetchVillage(selectedVillageId);
    }, [refetchVillage, selectedVillageId]);



    return currentVillage ?
        <Space direction="vertical" className="w-full h-full overflow-y-auto">
            <Button onClick={() => setSelectedRelation({ type: "village" })}>
                <LeftOutlined/>
            </Button>
            <VillageDetails village={currentVillage} onUpdate={onVillageUpdate}/>
        </Space> :
        <Space direction="vertical" className="w-full h-full overflow-y-auto pb-4">
            <Input.Search
                placeholder="Search Villages"
                allowClear
                onSearch={setSearchValue}
            />
            <Table
                dataSource={filteredVillages}
                rowKey="id"
                columns={columns}
                className="striped"
                pagination={false}

                rowClassName={(p) => currentVillage === p.id ? "selected cursor-pointer" : " cursor-pointer"}
                onRow={(p) => ({
                    onClick: () => setSelectedRelation({ type: "village", villageId: p.id })
                })}
            />
            <AddVillageButton/>
        </Space>;
}
