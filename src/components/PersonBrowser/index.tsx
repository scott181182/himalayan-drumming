"use client";

import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowLeftIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useDashboardDispatch, useDashboardState } from "../../contexts/DashboardContext";
import { AddPersonButton } from "../AddPersonButton";
import { PersonDetails } from "./PersonDetails";
import type { PersonInContextFragment } from "@/generated/graphql";

const columns: ColumnsType<PersonInContextFragment> = [
  {
    title: "Name",
    dataIndex: "name",
  },
];

export interface PersonBrowserProps {
  selectedPersonId?: string;
}
// oxlint-disable-next-line max-lines-per-function
export function PersonBrowser({ selectedPersonId }: Readonly<PersonBrowserProps>) {
  const { people } = useDashboardState();
  const { refetchPerson, setSelectedRelation } = useDashboardDispatch();

  const [filteredPeople, setFilteredPeople] = useState(people);

  const selectedPerson = useMemo(() => {
    if (!selectedPersonId) {
      return;
    }
    return people.find((p) => p.id === selectedPersonId);
  }, [people, selectedPersonId]);

  const onPersonUpdate = useCallback(() => {
    if (!selectedPersonId) {
      return;
    }
    void refetchPerson(selectedPersonId);
  }, [refetchPerson, selectedPersonId]);

  return selectedPerson ? (
    <Space orientation="vertical" className="w-full h-full overflow-y-auto">
      <Button
        onClick={() => {
          setSelectedRelation({ type: "person" });
        }}
      >
        <ArrowLeftIcon />
      </Button>
      <PersonDetails person={selectedPerson} onUpdate={onPersonUpdate} />
    </Space>
  ) : (
    <Space orientation="vertical" className="w-full h-full overflow-y-auto pb-4">
      <Input.Search
        placeholder="Search People"
        allowClear
        onSearch={(value) => {
          if (value) {
            const search = value.toLowerCase();
            setFilteredPeople(
              people.filter(
                (p) =>
                  p.name.toLowerCase().includes(search) ||
                  p.caste?.toLowerCase()?.includes(search) ||
                  p.education?.toLowerCase()?.includes(search) ||
                  p.gender?.toLowerCase()?.includes(search) ||
                  p.notes?.toLowerCase()?.includes(search) ||
                  p.villages.some((piv) => piv.village.name.toLowerCase().includes(search)),
              ),
            );
          } else {
            setFilteredPeople(people);
          }
        }}
      />
      <Table
        dataSource={filteredPeople}
        rowKey="id"
        columns={columns}
        className="striped"
        pagination={false}

        rowClassName={(p) =>
          selectedPerson === p.id ? "selected cursor-pointer" : " cursor-pointer"
        }
        onRow={(p) => ({
          onClick: () => {
            setSelectedRelation({ type: "person", personId: p.id });
          },
        })}
      />
      <AddPersonButton />
    </Space>
  );
}
