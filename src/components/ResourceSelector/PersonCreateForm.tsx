"use client";

import { useMutation } from "@apollo/client";
import { App, Form, Input } from "antd";
import { useCallback } from "react";

import { CreatePersonDocument, GetAllPeopleDocument } from "@/generated/graphql";



interface FormValues {
    name: string;
}

export interface PersonCreateFormProps {
    beforeSubmit?: (data: FormValues) => void | Promise<void>;
    afterSubmit?: (err?: unknown) => void;
}
export type PersonCreateFormHookTuple = [JSX.Element, () => void];

export function usePersonCreateForm({
    beforeSubmit,
    afterSubmit,
}: PersonCreateFormProps): PersonCreateFormHookTuple {
    const [createPersonMutation] = useMutation(CreatePersonDocument, {
        refetchQueries: [ GetAllPeopleDocument ]
    });
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();

    const createPerson = useCallback(async () => {
        const data = form.getFieldsValue();

        try {
            // Allow the `beforeSubmit` hook to throw an error to avoid submitting the form.
            const res = beforeSubmit?.(data);
            if(res instanceof Promise) { await res; }

            createPersonMutation({
                variables: { data }
            })
                .then(() => {
                    message.success(`Created ${data.name}!`);
                    afterSubmit?.();
                })
                .catch((err) => {
                    message.error("Failed to create person, please try again");
                    console.error(err);
                    afterSubmit?.(err);
                });
        } catch(err) {
            console.error("There was an error thrown by the `beforeSubmit` hook:");
            console.error(err);
        }
    }, [afterSubmit, beforeSubmit, createPersonMutation, form, message]);

    const formElement = <Form form={form}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input/>
        </Form.Item>
    </Form>;

    return [formElement, createPerson];
}
