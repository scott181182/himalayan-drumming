/* eslint-disable @next/next/no-img-element */
import { EditOutlined, FileImageOutlined } from "@ant-design/icons";
import { App, Button, DatePicker, Descriptions, Select, Space, Upload } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";

import { FileSelector } from "./FileSelector";
import cls from "./PersonDetail.module.scss";
import { EditableGraphQLInput } from "../EditableGraphQLInput";
import { PersonInVillageTable } from "../PersonInVillageTable";
import { useEnums } from "@/contexts/EnumContext";
import { UpdatePersonDocument, type PersonInContextFragment } from "@/generated/graphql";




export interface PersonDetailsProps {
    person: PersonInContextFragment
    onUpdate?: () => void;
}

export function PersonDetails({
    person,
    onUpdate,
}: PersonDetailsProps) {
    const { modal } = App.useApp();
    const { genderOptions, casteOptions } = useEnums();



    const editPicture = useCallback(() => {
        const uploadModal = modal.info({
            content: <Upload.Dragger
                method="PUT"
                action={`/api/people/${person.id}/avatar`}
                accept="image/*"
                name="image"
                multiple={false}
                onChange={(info) => {
                    if(info.file.status === "done") {
                        onUpdate?.();
                        uploadModal.destroy();
                    }
                }}
            >
                <p className="ant-upload-drag-icon">
                    <FileImageOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
        });
    }, [modal, onUpdate, person.id]);


    
    return <Space direction="vertical" className="overflow-y-auto">
        <div className={cls["person-picture-container"]}>
            <img src={person.avatarUrl ?? "/empty_person.webp"} alt={person.name + " profile picture"}/>
            <Button
                icon={<EditOutlined/>}
                onClick={editPicture}
            />
        </div>
        <Descriptions title={person.name} column={1}>
            <Descriptions.Item label="Parent">{person.parent?.name}</Descriptions.Item>
            <Descriptions.Item label="Birthdate">
                <EditableGraphQLInput
                    value={person.birthdate ? dayjs(person.birthdate) : undefined}
                    mutationDocument={UpdatePersonDocument}
                    onMutate={(value) => ({ personId: person.id, data: { birthdate: value ? value.toISOString().slice(0, 10) : null } })}
                    afterUpdate={onUpdate}

                    renderInput={(value, onChange) => <DatePicker
                        picker="date"
                        className="flex-grow"
                        value={value}
                        onChange={(d) => onChange(d ?? undefined)}
                    />}
                    renderValue={(value) => value ? value.toISOString().slice(0, 10) : ""}
                />
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
                <EditableGraphQLInput
                    value={person.gender ?? undefined}
                    mutationDocument={UpdatePersonDocument}
                    onMutate={(value) => ({ personId: person.id, data: { gender: value || null } })}
                    afterUpdate={onUpdate}
                    
                    renderInput={(value, onChange) => <Select
                        className="flex-grow"
                        value={value}
                        onChange={(g) => onChange(g)}
                        options={genderOptions}
                        allowClear
                    />}
                />    
            </Descriptions.Item>
            <Descriptions.Item label="Caste">
                <EditableGraphQLInput
                    value={person.caste ?? undefined}
                    mutationDocument={UpdatePersonDocument}
                    onMutate={(value) => ({ personId: person.id, data: { caste: value || null } })}
                    afterUpdate={onUpdate}
                    
                    renderInput={(value, onChange) => <Select
                        className="flex-grow"
                        value={value}
                        onChange={(c) => onChange(c)}
                        options={casteOptions}
                        allowClear
                    />}
                />    
            </Descriptions.Item>
            <Descriptions.Item label="Education">
                <EditableGraphQLInput
                    value={person.education ?? undefined}
                    mutationDocument={UpdatePersonDocument}
                    onMutate={(value) => ({ personId: person.id, data: { education: value } })}
                    afterUpdate={onUpdate}
                />
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
                <EditableGraphQLInput
                    value={person.notes ?? undefined}
                    mutationDocument={UpdatePersonDocument}
                    onMutate={(value) => ({ personId: person.id, data: { notes: value } })}
                    afterUpdate={onUpdate}
                />    
            </Descriptions.Item>
            <Descriptions.Item label="Associated Files">
                <FileSelector person={person}/>
            </Descriptions.Item>
        </Descriptions>
        <PersonInVillageTable
            peopleInVillage={person.villages}
            person={person}
        />
    </Space>;
}
