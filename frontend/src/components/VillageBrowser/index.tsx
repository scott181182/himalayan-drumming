"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";

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



export function VillageBrowser() {
    const { villages, selectedVillage } = useDashboardState();
    const { refetchVillage } = useDashboardDispatch();
    const [ selectedVillageId, setSelectedVillageId ] = useState<string | undefined>();

    const currentVillage = useMemo(() => {
        if(!selectedVillageId) { return undefined; }
        return villages.find((v) => v.id === selectedVillageId);
    }, [villages, selectedVillageId]);

    const onVillageUpdate = useCallback(() => {
        if(!selectedVillageId) { return; }
        refetchVillage(selectedVillageId);
    }, [refetchVillage, selectedVillageId]);


    
    useEffect(() => {
        if(selectedVillage) {
            setSelectedVillageId(selectedVillage.id);
        }
    }, [selectedVillage]);



    return currentVillage ?
        <Space direction="vertical" className="w-full h-full overflow-y-auto">
            <Button onClick={() => setSelectedVillageId(undefined)}>
                <LeftOutlined/>
            </Button>
            <VillageDetails village={currentVillage} onUpdate={onVillageUpdate}/>
        </Space> :
        <Space direction="vertical" className="w-full h-full overflow-y-auto pb-4">
            {/* TODO: add search bar */}
            <Table
                dataSource={villages}
                rowKey="id"
                columns={columns}
                className="striped"
                pagination={false}

                rowClassName={(p) => currentVillage === p.id ? "selected cursor-pointer" : " cursor-pointer"}
                onRow={(p) => ({
                    onClick: () => setSelectedVillageId(p.id)
                })}
            />
            <AddVillageButton/>
        </Space>;
}
