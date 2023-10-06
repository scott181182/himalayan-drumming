/* eslint-disable @next/next/no-img-element */
import { EditOutlined, FileImageOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { App, Button, Descriptions, Space, Upload } from "antd";
import { useCallback } from "react";

import cls from "./PersonDetail.module.scss";
import { useDashboardState } from "../../contexts/DashboardContext";
import { UpdatePersonDocument, type PersonInContextFragment } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";




export interface PersonDetailsProps {
    person: PersonInContextFragment
}

export function PersonDetails({
    person
}: PersonDetailsProps) {
    const { modal } = App.useApp();
    const handlePromise = usePromiseMessage();
    const { selectedFiles } = useDashboardState();
    const [updatePerson, { loading }] = useMutation(UpdatePersonDocument);

    const assignFiles = useCallback(() => {
        if(selectedFiles.length === 0) { return; }

        updatePerson({
            variables: {
                personId: person.id,
                data: {
                    files: {
                        connect: selectedFiles.map((f) => ({ id: f.id }))
                    }
                }
            }
        }).then(...handlePromise("Associated file(s)!", "Error associating files with person"));
    }, [handlePromise, person.id, selectedFiles, updatePerson]);

    const editPicture = useCallback(() => {
        modal.info({
            content: <Upload.Dragger
                method="PUT"
                action={`/api/people/${person.id}/avatar`}
                accept="image/*"
                name="image"
                multiple={false}
            >
                <p className="ant-upload-drag-icon">
                    <FileImageOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
        });
    }, [modal, person.id]);

    return <Space direction="vertical">
        <div className={cls["person-picture-container"]}>
            <img src={person.avatarUrl ?? "/empty_person.webp"} alt={person.name + " profile picture"}/>
            <Button
                icon={<EditOutlined/>}
                onClick={editPicture}
            />
        </div>
        <Descriptions title={person.name} column={1}>
            <Descriptions.Item label="Parent">{person.parent?.name}</Descriptions.Item>
            <Descriptions.Item label="Associated Files">{person.files.length}</Descriptions.Item>
        </Descriptions>
        <Space>
            <Button
                disabled={selectedFiles.length === 0}
                onClick={assignFiles}
                className="mx-8"
                loading={loading}
            >
                Associate File
            </Button>
        </Space>
    </Space>;
}
