import { CreatePersonDocument, GetAllPeopleDocument } from "@/generated/graphql";
import { useMutation } from "@apollo/client";
import { App, Button, Form, Input, Modal } from "antd";
import { useCallback, useState } from "react";



interface FormValues {
    name: string;
}

export function AddPersonButton() {
    const [createPersonMutation] = useMutation(CreatePersonDocument, {
        refetchQueries: [ GetAllPeopleDocument ]
    });
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();

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
                message.error(`Failed to create person, please try again`);
                console.error(err);
            })
            .then(() => setOpen(false));
    }, []);

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
    </>
}
