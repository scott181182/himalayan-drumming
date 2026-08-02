// oxlint-disable next/no-img-element
import { App, Button, DatePicker, Descriptions, Select, Space, Upload } from "antd";
import dayjs from "dayjs";
import { PencilIcon, FileImageIcon } from "lucide-react";
import { useCallback } from "react";

import { EditableGraphQLInput } from "../EditableGraphQLInput";
import { PersonInVillageTable } from "../PersonInVillageTable";
import { FileSelector } from "./FileSelector";
import { useEnums } from "@/contexts/EnumContext";
import { UpdatePersonDocument, type PersonInContextFragment } from "@/generated/graphql";

import cls from "./PersonDetail.module.css";

export interface PersonDetailsProps {
  person: PersonInContextFragment;
  onUpdate?: () => void;
}

// oxlint-disable-next-line max-lines-per-function
export function PersonDetails({ person, onUpdate }: Readonly<PersonDetailsProps>) {
  const { modal } = App.useApp();
  const { genderOptions, casteOptions } = useEnums();

  const editPicture = useCallback(() => {
    const uploadModal = modal.info({
      content: (
        <Upload.Dragger
          method="PUT"
          action={`/api/avatars/${person.id}`}
          accept="image/*"
          name="image"
          multiple={false}
          onChange={(info) => {
            if (info.file.status === "done") {
              onUpdate?.();
              uploadModal.destroy();
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <FileImageIcon />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Upload.Dragger>
      ),
    });
  }, [modal, onUpdate, person.id]);

  return (
    <Space orientation="vertical" className="overflow-y-auto">
      <div className={cls["person-picture-container"]}>
        <img
          src={person.avatarUrl ?? "/empty_person.webp"}
          alt={person.name + " profile picture"}
        />
        <Button icon={<PencilIcon />} onClick={editPicture} />
      </div>
      <Descriptions title={person.name} column={1}>
        <Descriptions.Item label="Parent">{person.parent?.name}</Descriptions.Item>
        <Descriptions.Item label="Birthdate">
          <EditableGraphQLInput
            value={person.birthdate ? dayjs(person.birthdate) : undefined}
            mutationDocument={UpdatePersonDocument}
            onMutate={(value) => ({
              personId: person.id,
              data: { birthdate: value ? { set: value.toISOString().slice(0, 10) } : null },
            })}
            afterUpdate={onUpdate}

            renderInput={(value, onChange) => (
              <DatePicker
                picker="date"
                className="grow"
                value={value}
                onChange={(d) => {
                  onChange(d ?? undefined);
                }}
              />
            )}
            renderValue={(value) => (value ? value.toISOString().slice(0, 10) : "")}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          <EditableGraphQLInput
            value={person.gender ?? undefined}
            mutationDocument={UpdatePersonDocument}
            onMutate={(value) => ({
              personId: person.id,
              data: { genderRef: value ? { connect: { name: value } } : { disconnect: true } },
            })}
            afterUpdate={onUpdate}

            renderInput={(value, onChange) => (
              <Select
                className="grow"
                value={value}
                onChange={(g) => {
                  onChange(g);
                }}
                options={genderOptions}
                allowClear
              />
            )}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Caste">
          <EditableGraphQLInput
            value={person.caste ?? undefined}
            mutationDocument={UpdatePersonDocument}
            onMutate={(value) => ({
              personId: person.id,
              data: { casteRef: value ? { connect: { name: value } } : { disconnect: true } },
            })}
            afterUpdate={onUpdate}

            renderInput={(value, onChange) => (
              <Select
                className="grow"
                value={value}
                onChange={(c) => {
                  onChange(c);
                }}
                options={casteOptions}
                allowClear
              />
            )}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Education">
          <EditableGraphQLInput
            value={person.education ?? undefined}
            mutationDocument={UpdatePersonDocument}
            onMutate={(value) => ({
              personId: person.id,
              data: { education: value ? { set: value } : null },
            })}
            afterUpdate={onUpdate}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Notes">
          <EditableGraphQLInput
            value={person.notes ?? undefined}
            mutationDocument={UpdatePersonDocument}
            onMutate={(value) => ({
              personId: person.id,
              data: { notes: value ? { set: value } : null },
            })}
            afterUpdate={onUpdate}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Associated Files">
          <FileSelector person={person} />
        </Descriptions.Item>
      </Descriptions>
      <PersonInVillageTable peopleInVillage={person.villages} person={person} />
    </Space>
  );
}
