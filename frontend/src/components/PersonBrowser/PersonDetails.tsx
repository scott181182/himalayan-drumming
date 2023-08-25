/* eslint-disable @next/next/no-img-element */
import { useMutation } from "@apollo/client";
import { Button, Descriptions, Space } from "antd";
import { useCallback } from "react";

import { useDashboardState } from "../DashboardContext";
import { UpdatePersonDocument, type PersonInContextFragment } from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";



export interface PersonDetailsProps {
    person: PersonInContextFragment
}

export function PersonDetails({
    person
}: PersonDetailsProps) {
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

    return <Space direction="vertical">
        <img src="/empty_person.webp" alt={person.name + " profile picture"}/>
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
