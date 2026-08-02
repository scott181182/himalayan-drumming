"use client";

import { useMutation } from "@apollo/client/react";
import { App, Button, Form, Input, Modal } from "antd";
import { useCallback, useState } from "react";

import { CreatePersonDocument, GetAllPeopleDocument } from "@/generated/graphql";

interface FormValues {
  name: string;
}

// oxlint-disable-next-line max-lines-per-function
export function AddPersonButton() {
  const [createPersonMutation] = useMutation(CreatePersonDocument, {
    refetchQueries: [GetAllPeopleDocument],
  });
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const createPerson = useCallback(() => {
    const data = form.getFieldsValue();
    createPersonMutation({ variables: { data } })
      // oxlint-disable-next-line promise/always-return
      .then(() => {
        message.success(`Created ${data.name}!`);
      })
      .catch((err) => {
        message.error("Failed to create person, please try again");
        console.error(err);
      })
      .finally(() => {
        setOpen(false);
      });
  }, [createPersonMutation, form, message]);

  return (
    <>
      <Button onClick={openModal}>Add Person</Button>
      <Modal title="Create Person" open={open} onCancel={closeModal} onOk={createPerson}>
        <Form form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
