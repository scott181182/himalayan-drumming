"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { authClient } from "@/lib/auth-client";



export function AppNavbar() {
    const router = useRouter();
    const { data } = authClient.useSession();

    const user = useMemo(() => data?.user, [data?.user]);

    const signout = useCallback(() => {
        authClient.signOut().then(() => {
            router.push("/login");
        });
    }, [router]);

    const profileOptions = useMemo<ItemType[]>(() => [
        {
            key: "signout",
            label: "Logout",
            onClick: signout
        }
    ], [signout]);

    return <Space className="text-white w-full justify-between">
        <h1 className="text-2xl">Himalayan Drumming Research Dashboard</h1>

        <Space className="float-right">
            {
                user?.name ? (
                    <Dropdown arrow={false} menu={{ items: profileOptions }}>
                        <div className="flex items-center gap-2">
                            <span>{user.name}</span>
                            <Avatar size="large" icon={<UserOutlined />} className="border-white" />
                        </div>
                    </Dropdown>
                ) : (
                    <Button href="/login" type="default">Login</Button>
                )
            }
        </Space>
    </Space>;
}
