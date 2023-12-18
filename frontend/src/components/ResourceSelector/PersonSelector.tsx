import { useQuery } from "@apollo/client";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/lib/select";
import { useCallback, useMemo } from "react";

import { GetPeopleDocument } from "@/generated/graphql";
import { isDefined, uniqByFilter } from "@/utils/array";



export interface PersonSelectorValue {
    id: string;
    name: string;
}

export interface PersonSelectorProps {
    value?: PersonSelectorValue;
    onChange?: (value: PersonSelectorValue) => void;
}

export function PersonSelector({
    value,
    onChange
}: PersonSelectorProps) {
    const { data, loading, refetch } = useQuery(GetPeopleDocument, {
        variables: {
            skip: 0,
            take: 10
        }
    });

    const options = useMemo<DefaultOptionType[]>(
        () => [ ...(data?.people ?? []), value ]
            .filter(isDefined)
            .map((f) => ({
                label: f.name,
                value: f.id
            }))
            .filter(uniqByFilter("value")) ?? [],
        [data?.people, value]
    );

    const onSearch = useCallback((text: string) => {
        refetch({ where: { name: { contains: text } } });
    }, [refetch]);

    return <Select
        value={value?.id}
        title={value?.name}

        options={options}
        onChange={(id, opt) => {
            if(Array.isArray(opt)) { return; }
            onChange?.({ id, name: opt.label as string });
        }}

        filterOption={false}
        loading={loading}
        showSearch
        onSearch={onSearch}
    />;
}