"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";

import { PersonDetails } from "./PersonDetails";
import { useDashboardDispatch, useDashboardState } from "../../contexts/DashboardContext";
import { AddPersonButton } from "../AddPersonButton";
import type { PersonInContextFragment } from "@/generated/graphql";



const columns: ColumnsType<PersonInContextFragment> = [
    {
        title: "Name",
        dataIndex: "name"
    }
];



export function PersonBrowser() {
    const { people } = useDashboardState();
    const { refetchPerson } = useDashboardDispatch();
    const [ selectedPersonId, setSelectedPersonId ] = useState<string | undefined>();

    const selectedPerson = useMemo(() => {
        if(!selectedPersonId) { return undefined; }
        return people.find((p) => p.id === selectedPersonId);
    }, [people, selectedPersonId]);

    const onPersonUpdate = useCallback(() => {
        if(!selectedPersonId) { return; }
        refetchPerson(selectedPersonId);
    }, [refetchPerson, selectedPersonId]);



    return selectedPerson ?
        <Space direction="vertical" className="w-full h-full">
            <Button onClick={() => setSelectedPersonId(undefined)}>
                <LeftOutlined/>
            </Button>
            <PersonDetails person={selectedPerson} onUpdate={onPersonUpdate}/>
        </Space> :
        <Space direction="vertical" className="w-full h-full">
            {/* TODO: add search bar */}
            <Table
                dataSource={people}
                rowKey="id"
                columns={columns}
                className="striped overflow-y-auto"

                rowClassName={(p) => selectedPerson === p.id ? "selected cursor-pointer" : " cursor-pointer"}
                onRow={(p) => ({
                    onClick: () => setSelectedPersonId(p.id)
                })}
            />
            <AddPersonButton/>
        </Space>;
}
