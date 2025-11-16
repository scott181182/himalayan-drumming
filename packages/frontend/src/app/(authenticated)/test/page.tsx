"use client";

import { Col, Row, Tag, Tooltip } from "antd";
import type { FilterValue } from "antd/es/table/interface";
import type { NextPage } from "next";
import { useCallback, useState } from "react";

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
        /**
         * Returns a filter option for every village present in the table.
         * Maybe this could eventually get all villages from the database.
         */
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
    // An example state value.
    // This will usually be handled by a form context.
    const [value, setValue] = useState<PersonForTableFragment | undefined>();

    /** Defines how a query for Persons is build up from a set of filters and a search string. */
    const onQuery = useCallback((filters: Record<string, FilterValue | null>, search?: string) => {
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
    }, []);



    return <Row className="w-full p-4" justify="center">
        <Col span={4}>
            <ResourceSelector
                value={value}
                onChange={setValue}

                recordKey="id"
                renderValue={(person) => person.name}

                columns={personColumns}

                className="w-full"
                queryDocumentNode={GetPeopleDocument}
                queryMap={(res) => res.people}
                onQuery={onQuery}
            />
        </Col>
    </Row>;
};
export default TestPage;
