"use client";

import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowLeft } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { AddVillageButton } from "../AddVillageButton";
import { VillageDetails } from "./VillageDetails";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";
import type { VillageInContextFragment } from "@/generated/graphql";

const columns: ColumnsType<VillageInContextFragment> = [
  {
    title: "Name",
    dataIndex: "name",
  },
];

export interface VillageBrowserProps {
  selectedVillageId?: string;
}
// oxlint-disable-next-line max-lines-per-function
export function VillageBrowser({ selectedVillageId }: VillageBrowserProps) {
  const { villages } = useDashboardState();
  const [search, setSearch] = useState("");
  const { refetchVillage, setSelectedRelation } = useDashboardDispatch();

  const filteredVillages = useMemo(() => {
    return villages.filter(
      (v) =>
        v.name.toLowerCase().includes(search) ||
        v.divinities?.toLowerCase()?.includes(search) ||
        v.rituals?.toLowerCase()?.includes(search) ||
        v.temples?.toLowerCase()?.includes(search) ||
        v.notes?.toLowerCase()?.includes(search) ||
        v.people.some((p) => p.person.name.toLowerCase().includes(search)),
    );
  }, [villages, search]);

  const currentVillage = useMemo(() => {
    if (!selectedVillageId) {
      return;
    }
    return villages.find((v) => v.id === selectedVillageId);
  }, [villages, selectedVillageId]);

  const onVillageUpdate = useCallback(() => {
    if (!selectedVillageId) {
      return;
    }
    void refetchVillage(selectedVillageId);
  }, [refetchVillage, selectedVillageId]);

  return currentVillage ? (
    <Space orientation="vertical" className="w-full h-full overflow-y-auto">
      <Button
        onClick={() => {
          setSelectedRelation({ type: "village" });
        }}
      >
        <ArrowLeft />
      </Button>
      <VillageDetails village={currentVillage} onUpdate={onVillageUpdate} />
    </Space>
  ) : (
    <Space orientation="vertical" className="w-full h-full overflow-y-auto pb-4">
      <Input.Search
        placeholder="Search Villages"
        allowClear
        onSearch={(value) => {
          if (value) {
            setSearch(value.toLowerCase());
          } else {
            setSearch("");
          }
        }}
      />
      <Table
        dataSource={filteredVillages}
        rowKey="id"
        columns={columns}
        className="striped"
        pagination={false}

        rowClassName={(p) =>
          currentVillage === p.id ? "selected cursor-pointer" : " cursor-pointer"
        }
        onRow={(p) => ({
          onClick: () => {
            setSelectedRelation({ type: "village", villageId: p.id });
          },
        })}
      />
      <AddVillageButton />
    </Space>
  );
}
