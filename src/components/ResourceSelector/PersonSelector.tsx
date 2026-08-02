import { useQuery } from "@apollo/client/react";
import { Select } from "antd";
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

// oxlint-disable-next-line max-lines-per-function
export function PersonSelector({ value, onChange }: Readonly<PersonSelectorProps>) {
  const { data, loading, refetch } = useQuery(GetPeopleDocument, {
    variables: {
      skip: 0,
      take: 10,
    },
  });

  const options = useMemo<{ value: string; label: string }[]>(
    () =>
      [...(data?.people ?? []), value]
        // oxlint-disable-next-line unicorn/no-array-callback-reference
        .filter(isDefined)
        .map((f) => ({
          label: f.name,
          value: f.id,
        }))
        // oxlint-disable-next-line unicorn/no-array-callback-reference
        .filter(uniqByFilter("value")) ?? [],
    [data?.people, value],
  );

  const onSearch = useCallback(
    (text: string) => {
      void refetch({ where: { name: { contains: text } } });
    },
    [refetch],
  );

  return (
    <Select
      value={value?.id}
      title={value?.name}

      options={options}
      onChange={(id, opt) => {
        if (Array.isArray(opt)) {
          return;
        }
        if (opt) {
          onChange?.({ id, name: opt.label });
        }
      }}

      loading={loading}
      showSearch={{
        filterOption: false,
        onSearch,
      }}
    />
  );
}
