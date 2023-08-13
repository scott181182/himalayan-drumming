"use client";

import { useMutation } from "@apollo/client";
import { App, Button, Form, Input, Modal, Tooltip } from "antd";
import { useCallback, useState } from "react";

import { useDashboardState } from "@/components/DashboardContext";
import { CreateVillageDocument, GetAllVillagesDocument } from "@/generated/graphql";
import { selectedLocationToInput } from "@/utils/location";



interface FormValues {
    name: string;
}

export function AddVillageButton() {
    const [createVillageMutation] = useMutation(CreateVillageDocument, {
        refetchQueries: [ GetAllVillagesDocument ]
    });
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();
    const { selectedLocation } = useDashboardState();

    const [open, setOpen] = useState(false);

    const openModal = useCallback(() => setOpen(true), [setOpen]);
    const closeModal = useCallback(() => setOpen(false), [setOpen]);

    const createVillage = useCallback(() => {
        if(!selectedLocation) {
            console.log(selectedLocation);
            message.warning("Could not find selected point on map. Please select another coordinate and try again.");
            return;
        }
        const data = form.getFieldsValue();
        createVillageMutation({
            variables: {
                data: {
                    ...data,
                    location: selectedLocationToInput(selectedLocation)
                }
            }
        })
            .then(() => { message.success(`Created ${data.name}!`); })
            .catch((err) => {
                message.error("Failed to create village, please try again");
                console.error(err);
            })
            .then(() => setOpen(false));
    }, [createVillageMutation, form, message, selectedLocation]);

    const btn = <Button onClick={openModal} disabled={!selectedLocation}>
        Add Village
    </Button>;

    return <>
        {selectedLocation ?
            btn :
            <Tooltip title="A location must be selected to create a village">
                {btn}
            </Tooltip>
        }
        <Modal
            title="Create Village"
            open={open}
            onCancel={closeModal}
            onOk={createVillage}
        >
            <Form form={form}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </>;
}
