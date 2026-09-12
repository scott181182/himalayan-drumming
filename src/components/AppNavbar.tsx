"use client";

import { App, Avatar, Button, Dropdown, Space } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { authClient } from "@/lib/client/auth";

export function AppNavbar() {
  const { message } = App.useApp();
  const router = useRouter();
  const { data } = authClient.useSession();

  const user = useMemo(() => data?.user, [data?.user]);

  const signout = useCallback(() => {
    authClient
      .signOut()
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Signout failed", error);
        message.error("Signout failed");
      });
  }, [router, message]);

  const profileOptions = useMemo<ItemType[]>(
    () => [
      {
        key: "signout",
        label: "Logout",
        onClick: signout,
      },
    ],
    [signout],
  );

  return (
    <Space className="text-white w-full justify-between">
      <h1 className="text-2xl">Himalayan Drumming Research Dashboard</h1>

      <Space className="float-right">
        {user?.name ? (
          <Dropdown arrow={false} menu={{ items: profileOptions }}>
            <div className="flex items-center gap-2">
              <span>{user.name}</span>
              <Avatar size="large" icon={<UserIcon />} className="border-white" />
            </div>
          </Dropdown>
        ) : (
          <Button href="/login" type="default">
            Login
          </Button>
        )}
      </Space>
    </Space>
  );
}
