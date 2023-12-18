/* eslint-disable @next/next/no-img-element */
import { Descriptions, Space } from "antd";
import { useMemo } from "react";

import { EditableGraphQLInput } from "../EditableGraphQLInput";
import { PersonInVillageTable } from "../PersonInVillageTable";
import { UpdateVillageDocument, type VillageInContextFragment } from "@/generated/graphql";
import { formatLatLng } from "@/utils/location";



const villageFields: [keyof VillageInContextFragment, string][] = [
    ["divinities", "Divinities"],
    ["temples", "Temples"],
    ["rituals", "Rituals"],
    ["notes", "Notes"],
];


export interface VillageDetailsProps {
    village: VillageInContextFragment
    onUpdate?: () => void;
}

export function VillageDetails({
    village,
    onUpdate,
}: VillageDetailsProps) {
    // const { modal } = App.useApp();
    // const handlePromise = usePromiseMessage();
    // const [updateVillage, { loading }] = useMutation(UpdateVillageDocument);

    const villageItems = useMemo(() => villageFields.map(([field, title]) => (
        <Descriptions.Item label={title} key={field}>
            <EditableGraphQLInput
                value={village[field] ?? undefined}
                mutationDocument={UpdateVillageDocument}
                onMutate={(value) => ({ villageId: village.id, data: { [field]: value } })}
                afterUpdate={onUpdate}
            />
        </Descriptions.Item>
    )), [onUpdate, village]);


    
    return <Space direction="vertical" className="overflow-y-auto">
        <Descriptions title={village.name} column={1}>
            {villageItems}
            {/* TODO: file selector */}
            {/* <Descriptions.Item label="Associated Files">
                <FileSelector village={village}/>
            </Descriptions.Item> */}
            <Descriptions.Item label="Location">
                {formatLatLng(village.location.latitude, village.location.longitude)}
            </Descriptions.Item>
        </Descriptions>
        <PersonInVillageTable
            peopleInVillage={village.people}
            village={village}
        />
    </Space>;
}
