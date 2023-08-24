import { App } from "antd";
import type { JointContent } from "antd/es/message/interface";
import { DefaultOptionType } from "antd/es/select";



export interface PromiseMessageOptions {
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
}
export type promiseMessageFn = (
    successMessage: JointContent,
    errorMessage: JointContent,
    options?: PromiseMessageOptions
) => [() => void, (err: unknown) => void];

export function usePromiseMessage(): promiseMessageFn {
    const { message } = App.useApp();

    return (successMessage, errorMessage, options) => {
        return [
            () => {
                message.success(successMessage);
                options?.onSuccess?.();
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
