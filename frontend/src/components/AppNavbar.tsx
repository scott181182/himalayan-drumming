import { UserOutlined } from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";
import { Avatar, Space } from "antd";



export function AppNavbar() {
    const { accounts } = useMsal();
    const user = accounts?.[0];

    return <Space className="text-white w-full justify-between">
        <h1 className="text-2xl">Himalayan Drumming Research Dashboard</h1>

        <Space className="float-right">
            {user?.name || "Unknown User"}
            {/* `leading-7` fixes the icon height to line up with username. */}
            <Avatar size="large" icon={<UserOutlined />} className="leading-7 border-white" />
        </Space>
    </Space>;
}
