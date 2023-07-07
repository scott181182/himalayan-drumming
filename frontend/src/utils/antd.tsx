import { App } from "antd";
import type { JointContent } from "antd/es/message/interface";



export type promiseMessageFn = (successMessage: JointContent, errorMessage: JointContent) => [() => void, (err: unknown) => void];

export function usePromiseMessage(): promiseMessageFn {
    const { message } = App.useApp();

    return (successMessage, errorMessage) => {
        return [
            () => message.success(successMessage),
            (err: unknown) => {
                console.error(err);
                message.error(errorMessage);
            }
        ];
    };
}
