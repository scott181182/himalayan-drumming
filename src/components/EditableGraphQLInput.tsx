import { CheckOutlined, CloseOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation, type OperationVariables, type TypedDocumentNode } from "@apollo/client";
import { App, Input } from "antd";
import type { ReactElement, ReactNode} from "react";
import { useCallback, useState } from "react";


export interface EditableGraphQLInputProps<QRes, QVar extends OperationVariables, T = string> {
    value?: T | undefined;

    mutationDocument: TypedDocumentNode<QRes, QVar>;
    onMutate: (value: T | undefined) => QVar;
    afterUpdate?: (res: QRes) => void;

    renderInput?: (value: T | undefined, onChange: (value: T | undefined) => void) => ReactElement,
    renderValue?: (value: T | undefined) => ReactNode
}

export function EditableGraphQLInput<QRes, QVar extends OperationVariables, T = string>({
    value,

    mutationDocument,
    onMutate,
    afterUpdate,

    renderInput,
    renderValue
}: EditableGraphQLInputProps<QRes, QVar, T>) {
    const { message } = App.useApp();

    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState<T | undefined>(value);

    const [ mutate, { loading } ] = useMutation(mutationDocument);

    const onSubmit = useCallback(() => {
        mutate({
            variables: onMutate(inputValue),
            onCompleted: (res) => {
                afterUpdate?.(res);
                setEditing(false);
            },
            onError: (err) => {
                console.error(err);
                message.error("Failed to update field, please try again");
            }
        });
    }, [afterUpdate, inputValue, message, mutate, onMutate]);


    if(editing) {
        return <div className="w-full flex gap-x-2 items-center">
            {renderInput ?
                renderInput(inputValue, setInputValue) :
                <Input
                    className="flex-grow"
                    value={inputValue as string}
                    onChange={(ev) => setInputValue(ev.target.value as T)}
                />
            }
            {loading ?
                <LoadingOutlined/> :
                <CheckOutlined
                    className="cursor-pointer hover:text-black"
                    onClick={onSubmit}
                />
            }
            <CloseOutlined
                className="cursor-pointer hover:text-black"
                onClick={() => setEditing(false)}
                disabled={loading}
            />
        </div>;
    } else {
        return <div className="w-full flex">
            <span className="flex-grow">{renderValue ? renderValue(value) : value as string}</span>
            <EditOutlined
                className="cursor-pointer hover:text-black"
                onClick={() => setEditing(true)}
            />
        </div>;
    }
}