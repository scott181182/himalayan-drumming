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

    const [filteredVillages, setFilteredVillages] = useState(villages);

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
                onSearch={(value) => {
                    if(!value) {
                        setFilteredVillages(villages);
                    } else {
                        const search = value.toLowerCase();
                        setFilteredVillages(villages.filter((v) =>
                            v.name.toLowerCase().includes(search) ||
                            v.divinities?.toLowerCase()?.includes(search) ||
                            v.rituals?.toLowerCase()?.includes(search) ||
                            v.temples?.toLowerCase()?.includes(search) ||
                            v.notes?.toLowerCase()?.includes(search) ||
                            v.people.some((p) => p.person.name.toLowerCase().includes(search))
                        ));
                    }
                }}
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
