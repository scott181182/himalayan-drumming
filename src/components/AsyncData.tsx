import { Alert, Empty } from "antd";
import { LoaderIcon } from "lucide-react";

export interface AsyncDataProps<T> {
  data: T | undefined;
  loading?: boolean;
  error?: unknown;
  children: React.ReactNode | ((data: T) => React.ReactNode);
}
export function AsyncData<T>({ data, loading, error, children }: Readonly<AsyncDataProps<T>>) {
  if (loading) {
    return <LoaderIcon className="animate-spin" />;
  }
  if (error) {
    console.error(error);
    return <Alert type="error" title="An error has occurred" />;
  }

  if (!data) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Could not load data" />;
  }

  return typeof children === "function" ? children(data) : children;
}
