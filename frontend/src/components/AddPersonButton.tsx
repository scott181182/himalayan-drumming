"use client";

import { useMutation } from "@apollo/client";
import { App, Button, Form, Input, Modal } from "antd";
import { useCallback, useState } from "react";

import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { CreatePersonDocument } from "@/generated/graphql";



interface FormValues {
    name: string;
}

export function AddPersonButton() {
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();
    const { updatePerson } = useDashboardDispatch();

    const [createPersonMutation] = useMutation(CreatePersonDocument, {
        onCompleted: (data) => updatePerson(data.createPerson)
    });
    const [open, setOpen] = useState(false);

    const openModal = useCallback(() => setOpen(true), [setOpen]);
    const closeModal = useCallback(() => setOpen(false), [setOpen]);

    const createPerson = useCallback(() => {
        const data = form.getFieldsValue();
        createPersonMutation({
            variables: { data }
        })
            .then(() => { message.success(`Created ${data.name}!`); })
            .catch((err) => {
                message.error("Failed to create person, please try again");
                console.error(err);
            })
            .then(() => setOpen(false));
    }, [createPersonMutation, form, message]);

    return <>
        <Button onClick={openModal}>
            Add Person
        </Button>
        <Modal
            title="Create Person"
            open={open}
            onCancel={closeModal}
            onOk={createPerson}
        >
            <Form form={form}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </>;
}
