import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback } from "react";

import type { PersonForTableFragment } from "@/generated/graphql";



const columns: ColumnsType<PersonForTableFragment> = [
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
        }) ?? null
    }
];



export interface PersonTableProps {
    dataSource: PersonForTableFragment[];
    onSelect?: (value: PersonForTableFragment) => void;
}

export function PersonTable({
    dataSource,
    onSelect
}: PersonTableProps) {
    const onRow = useCallback((row: PersonForTableFragment) => ({
        onClick: () => { onSelect?.(row); }
    }), [onSelect]);

    return <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        expandable={{
            // This is to avoid the table thinking that a Person's children make this a tree structure
            childrenColumnName: "_children"
        }}

        onRow={onRow}
        rowClassName="cursor-pointer"
        rowKey="id"
    />;
}
