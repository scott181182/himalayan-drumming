"use client";

import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { useEffect, useState } from "react";

import cls from "./index.module.scss";
import { PersonBrowser } from "../PersonBrowser";
import { VillageBrowser } from "../VillageBrowser";
import { useDashboardState } from "@/contexts/DashboardContext";



const tabClassName = `mx-4 h-full ${cls["constrained-tabs"]}`;

const items: TabsProps["items"] = [
    {
        key: "People",
        label: "People",
        children: <PersonBrowser/>
    },
    {
        key: "Villages",
        label: "Villages",
        children: <VillageBrowser/>
    }
];



export function RelationBrowser() {
    const { selectedVillage } = useDashboardState();
    const [activeKey, setActiveKey] = useState("People");
    
    useEffect(() => {
        if(selectedVillage) {
            setActiveKey("Villages");
        }
    }, [selectedVillage]);

    return <Tabs
        items={items}
        className={tabClassName}
        
        activeKey={activeKey}
        onChange={setActiveKey}
    />;
}
