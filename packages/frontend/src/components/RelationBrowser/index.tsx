"use client";

import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { useCallback, useMemo } from "react";

import cls from "./index.module.scss";
import { PersonBrowser } from "../PersonBrowser";
import { VillageBrowser } from "../VillageBrowser";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";



const tabClassName = `mx-4 h-full ${cls["constrained-tabs"]}`;




export function RelationBrowser() {
    const { selectedRelation } = useDashboardState();
    const { setSelectedRelation } = useDashboardDispatch();

    const activeKey = useMemo(() => selectedRelation?.type ?? "person", [selectedRelation?.type]);
    const setActiveKey = useCallback((key: string) => {
        setSelectedRelation({ type: key as "person" | "village" });
    }, [setSelectedRelation]);

    
    const items = useMemo<TabsProps["items"]>(() => [
        {
            key: "person",
            label: "People",
            children: <PersonBrowser selectedPersonId={selectedRelation?.type === "person" ? selectedRelation.personId : undefined}/>
        },
        {
            key: "village",
            label: "Villages",
            children: <VillageBrowser selectedVillageId={selectedRelation?.type === "village" ? selectedRelation.villageId : undefined}/>
        }
    ], [selectedRelation]);

    return <Tabs
        items={items}
        className={tabClassName}
        
        activeKey={activeKey}
        onChange={setActiveKey}
    />;
}
