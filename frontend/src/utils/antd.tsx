import { App } from "antd";
import type { JointContent } from "antd/es/message/interface";
import type { DefaultOptionType } from "antd/es/select";



export interface PromiseMessageOptions<T> {
    onSuccess?: (value: T) => void;
    onError?: (err: unknown) => void;
}
export type promiseMessageFn<T> = (
    successMessage: JointContent,
    errorMessage: JointContent,
    options?: PromiseMessageOptions<T>
) => [(value: T) => void, (err: unknown) => void];

export function usePromiseMessage<T>(): promiseMessageFn<T> {
    const { message } = App.useApp();

    return (successMessage, errorMessage, options) => {
        return [
            (value: T) => {
                message.success(successMessage);
                options?.onSuccess?.(value);
            },
            (err: unknown) => {
                console.error(err);
                message.error(errorMessage);
                options?.onError?.(err);
            }
        ];
    };
}

export function makeOptions(values: string[]): DefaultOptionType[] {
    return values.map((v) => ({ label: v, value: v }));
}
