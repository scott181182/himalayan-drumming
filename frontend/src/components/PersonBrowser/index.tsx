"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { PersonDetails } from "./PersonDetails";
import { AddPersonButton } from "../AddPersonButton";
import { useDashboardState } from "../DashboardContext";
import type { PersonInContextFragment } from "@/generated/graphql";



const columns: ColumnsType<PersonInContextFragment> = [
    {
        title: "Name",
        dataIndex: "name"
    }
];



export function PersonBrowser() {
    const { people } = useDashboardState();
    const [ selectedPerson, setSelectedPerson ] = useState<PersonInContextFragment | undefined>();



    return selectedPerson ?
        <Space direction="vertical" className="w-full h-full">
            <Button onClick={() => setSelectedPerson(undefined)}>
                <LeftOutlined/>
            </Button>
            <PersonDetails person={selectedPerson}/>
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
                    onClick: () => setSelectedPerson(p)
                })}
            />
            <AddPersonButton/>
        </Space>;
}
