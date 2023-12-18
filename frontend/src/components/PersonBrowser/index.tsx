"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo } from "react";

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



export interface PersonBrowserProps {
    selectedPersonId?: string;
}
export function PersonBrowser({
    selectedPersonId
}: PersonBrowserProps) {
    const { people } = useDashboardState();
    const { refetchPerson, setSelectedRelation } = useDashboardDispatch();

    const selectedPerson = useMemo(() => {
        if(!selectedPersonId) { return undefined; }
        return people.find((p) => p.id === selectedPersonId);
    }, [people, selectedPersonId]);

    const onPersonUpdate = useCallback(() => {
        if(!selectedPersonId) { return; }
        refetchPerson(selectedPersonId);
    }, [refetchPerson, selectedPersonId]);



    return selectedPerson ?
        <Space direction="vertical" className="w-full h-full overflow-y-auto">
            <Button onClick={() => setSelectedRelation({ type: "person" })}>
                <LeftOutlined/>
            </Button>
            <PersonDetails person={selectedPerson} onUpdate={onPersonUpdate}/>
        </Space> :
        <Space direction="vertical" className="w-full h-full overflow-y-auto pb-4">
            {/* TODO: add search bar */}
            <Table
                dataSource={people}
                rowKey="id"
                columns={columns}
                className="striped"
                pagination={false}

                rowClassName={(p) => selectedPerson === p.id ? "selected cursor-pointer" : " cursor-pointer"}
                onRow={(p) => ({
                    onClick: () => setSelectedRelation({ type: "person", personId: p.id })
                })}
            />
            <AddPersonButton/>
        </Space>;
}
