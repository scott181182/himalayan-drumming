import type { TabsProps } from "antd";
import { Tabs } from "antd";

import { PersonBrowser } from "./PersonBrowser";
import { VillageBrowser } from "./VillageBrowser";



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
        className="mx-4"
    />;
}
