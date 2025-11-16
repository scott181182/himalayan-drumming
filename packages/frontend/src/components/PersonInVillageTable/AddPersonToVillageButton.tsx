import { useMutation } from "@apollo/client";
import { App, Button, Form, Input, Modal } from "antd";
import { useCallback, useState } from "react";

import type { PersonSelectorValue } from "../ResourceSelector/PersonSelector";
import { PersonSelector } from "../ResourceSelector/PersonSelector";
import { useDashboardDispatch } from "@/contexts/DashboardContext";
import { UpdateVillageDocument, type VillageInContextFragment } from "@/generated/graphql";



export interface AddPersonToVillageFormValues {
    person: PersonSelectorValue;
    description?: string;
}

export interface AddPersonToVillageButtonProps {
    village: VillageInContextFragment;
    onSubmit?: () => void;
}

export function AddPersonToVillageButton({
    village,
    onSubmit
}: AddPersonToVillageButtonProps) {
    const { refetchResources } = useDashboardDispatch();
    const { message } = App.useApp();
    const [form] = Form.useForm<AddPersonToVillageFormValues>();
    const [open, setOpen] = useState(false);
    
    const [updateVillageMutation] = useMutation(UpdateVillageDocument);

    const openModal = useCallback(() => setOpen(true), [setOpen]);
    const closeModal = useCallback(() => setOpen(false), [setOpen]);
    
    const addPerson = useCallback(() => {
        const data = form.getFieldsValue();
        
        updateVillageMutation({
            variables: {
                villageId: village.id,
                data: {
                    people: {
                        create: {
                            personId: data.person.id,
                            description: data.description
                        }
                    }
                }
            }
        })
            .then(() => refetchResources({
                villageIds: [ village.id ],
                personIds: [ data.person.id ]
            }))
            .then(() => {
                message.success(`Added ${data.person.name} to village!`);
                onSubmit?.();
            })
            .catch((err) => {
                message.error("Failed to add person, please try again");
                console.error(err);
            })
            .then(() => setOpen(false));
    }, [form, message, onSubmit, refetchResources, updateVillageMutation, village.id]);

    return <>
        <Button onClick={openModal}>
            Add Person
        </Button>
        <Modal
            title="Add Person"
            open={open}
            onCancel={closeModal}
            onOk={addPerson}
        >
            <Form
                form={form}
            >
                <Form.Item
                    label="Person"
                    name="person"
                    rules={[ 
                        { required: true, message: "Person is required" }
                    ]}
                >
                    <PersonSelector/>
                </Form.Item>
                <Form.Item
                    label="Relation"
                    name="description"
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </>;
}