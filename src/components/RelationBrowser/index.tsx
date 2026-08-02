"use client";

import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { useCallback, useMemo } from "react";

import { PersonBrowser } from "../PersonBrowser";
import { VillageBrowser } from "../VillageBrowser";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";

import cls from "./index.module.css";

const tabClassName = `mx-4 h-full ${cls["constrained-tabs"]}`;

// oxlint-disable-next-line max-lines-per-function
export function RelationBrowser() {
  const { selectedRelation } = useDashboardState();
  const { setSelectedRelation } = useDashboardDispatch();

  const activeKey = useMemo(() => selectedRelation?.type ?? "person", [selectedRelation?.type]);
  const setActiveKey = useCallback(
    (key: string) => {
      if (key !== "person" && key !== "village") {
        console.warn("Unexpected tab key:", key);
        return;
      }
      setSelectedRelation({ type: key });
    },
    [setSelectedRelation],
  );

  const items = useMemo<TabsProps["items"]>(
    () => [
      {
        key: "person",
        label: "People",
        children: (
          <PersonBrowser
            selectedPersonId={
              selectedRelation?.type === "person" ? selectedRelation.personId : undefined
            }
          />
        ),
      },
      {
        key: "village",
        label: "Villages",
        children: (
          <VillageBrowser
            selectedVillageId={
              selectedRelation?.type === "village" ? selectedRelation.villageId : undefined
            }
          />
        ),
      },
    ],
    [selectedRelation],
  );

  return (
    <Tabs
      items={items}
      className={tabClassName}

      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
}
