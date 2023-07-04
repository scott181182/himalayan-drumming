import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Empty } from "antd";



export interface AsyncDataProps<T> {
    data: T | undefined;
    loading?: boolean;
    error?: unknown;
    children: React.ReactNode | ((data: T) => React.ReactNode);
}
export function AsyncData<T>({
    data,
    loading,
    error,
    children
}: AsyncDataProps<T>) {


    if(loading) {
        return <LoadingOutlined spin/>;
    }
    if(error) {
        console.error(error);
        return <Alert
            type="error"
            message="An error has occurred"
        />;
    }

    if(!data) {
        return <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Could not load data"
        />;
    }

    return typeof children === "function" ? children(data) : children;
}
