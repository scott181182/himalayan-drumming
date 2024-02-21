"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
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



export interface PersonBrowserProps {
    selectedPersonId?: string;
}
export function PersonBrowser({
    selectedPersonId
}: PersonBrowserProps) {
    const { people } = useDashboardState();
    const { refetchPerson, setSelectedRelation } = useDashboardDispatch();
    const [searchValue, setSearchValue] = useState("");

    const filteredPeople = useMemo(() => {
        return searchValue ?
            people.filter((p) =>
                p.name.toLowerCase().includes(searchValue) ||
                p.caste?.toLowerCase()?.includes(searchValue) ||
                p.education?.toLowerCase()?.includes(searchValue) ||
                p.gender?.toLowerCase()?.includes(searchValue) ||
                p.notes?.toLowerCase()?.includes(searchValue) ||
                p.villages.some((p) => p.village.name.toLowerCase().includes(searchValue)) ||
                p.files.some((f) => f.file.name.toLowerCase().includes(searchValue))
            ) :
            people;
    }, [people, searchValue]);

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
            <Input.Search
                placeholder="Search People"
                allowClear
                onSearch={setSearchValue}
            />
            <Table
                dataSource={filteredPeople}
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
