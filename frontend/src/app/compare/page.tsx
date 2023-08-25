"use client";

import { useQuery } from "@apollo/client";
import { Layout } from "antd";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { AsyncData } from "@/components/AsyncData";
import { EnumProvider } from "@/components/EnumContext";
import { MediaPlayerRow } from "@/components/MediaPlayerRow";
import { GetFileEntriesDocument } from "@/generated/graphql";



const ComparePage: NextPage = () => {
    const params = useSearchParams();

    const fileIds = useMemo(() => {
        const q = params.getAll("files");
        return q.map((id) => id.split(",")).flat();
    }, [params]);

    const { data, loading, error } = useQuery(GetFileEntriesDocument, {
        variables: {
            where: {
                id: { in: fileIds }
            }
        }
    });


    return (
        <EnumProvider>
            <Layout className="h-full">
                <Layout.Content className="relative">
                    <AsyncData
                        data={data?.fileEntries}
                        loading={loading}
                        error={error}
                    >
                        {(files) => files.map((file) => <MediaPlayerRow key={file.id} src={file.url}/>)}
                    </AsyncData>
                </Layout.Content>
            </Layout>
        </EnumProvider>
    );
};
export default ComparePage;
