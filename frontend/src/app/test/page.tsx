"use client";

import { Col, Row, Select, Tag, Tooltip } from "antd";
import type { NextPage } from "next";
import { useState } from "react";

import type { ResourceSelectorColumns } from "@/components/ResourceSelector";
import { ResourceSelector } from "@/components/ResourceSelector";
import type { PersonWhereInput, PersonForTableFragment } from "@/generated/graphql";
import { GetPeopleDocument} from "@/generated/graphql";



const personColumns: ResourceSelectorColumns<PersonForTableFragment> = [
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "Parent",
        key: "parent",
        render: (_, record) => record.parent?.name ?? null
    },
    {
        title: "Children",
        key: "children",
        render: (_, record) => record.children.map((child) => <Tag key={child.id}>{child.name}</Tag>) ?? null
    },
    {
        title: "Villages",
        key: "villages",
        render: (_, record) => record.villages.map((village) => {
            const villageTag = <Tag key={village.village.id}>{village.village.name}</Tag>;
            return village.description ?
                <Tooltip title={village.description} key={village.village.id}>{villageTag}</Tooltip> :
                villageTag;
        }) ?? null,
        filterOptions: (people) => {
            /** Map from village id to name */
            const villageMap: Record<string, string> = {};
            for(const person of people) {
                for(const village of person.villages) {
                    villageMap[village.village.id] = village.village.name;
                }
            }
            return Object.entries(villageMap).map(([value, text]) => ({ value, text }));
        }
    }
];

const TestPage: NextPage = () => {
    const [value, setValue] = useState<PersonForTableFragment | undefined>();


    return <Row className="w-full p-4" justify="center">
        <Col span={4}>
            <ResourceSelector
                value={value}
                onChange={setValue}

                // keyFn={(person) => person.id}
                recordKey="id"
                renderValue={(person) => person.name}

                columns={personColumns}

                className="w-full"
                queryDocumentNode={GetPeopleDocument}
                queryMap={(res) => res.people}
                onQuery={(filters, search) => {
                    const conditions: PersonWhereInput[] = [];
                    if(search) {
                        conditions.push({
                            OR: [
                                { name: { contains: search } },
                                { parent: { name: { contains: search } } },
                                { children: { some: { name: { contains: search } } } },
                                { villages: { some: { village: { name: { contains: search} } } } }
                            ]
                        });
                    }
                    if(filters.villages) {
                        conditions.push({
                            villages: { some: { villageId: { in: filters.villages as string[] } } }
                        });
                    }

                    return { where: { AND: conditions } };
                }}
            />
        </Col>
        <Col span={4}>
            <Select
                options={[
                    {label: "Test", value: "test"}
                ]}
            />
        </Col>
    </Row>;
};
export default TestPage;
