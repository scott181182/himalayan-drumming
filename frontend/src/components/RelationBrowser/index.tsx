"use client";

import type { TabsProps } from "antd";
import { Tabs } from "antd";

import cls from "./index.module.scss";
import { PersonBrowser } from "../PersonBrowser";
import { VillageBrowser } from "../VillageBrowser";



const tabClassName = `mx-4 h-full ${cls["constrained-tabs"]}`;

export function RelationBrowser() {
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

    return <Tabs
        items={items}
        className={tabClassName}
    />;
}
