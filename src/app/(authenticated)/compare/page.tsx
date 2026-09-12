"use client";

import { useQuery } from "@apollo/client/react";
import { Layout } from "antd";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { AsyncData } from "@/components/AsyncData";
import { MediaPlayerRow } from "@/components/MediaPlayerRow";
import { EnumProvider } from "@/contexts/EnumContext";
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
        id: { in: fileIds },
      },
    },
  });

  return (
    <EnumProvider>
      <Layout className="h-full">
        <Layout.Content className="relative flex flex-col gap-4 py-4">
          <AsyncData data={data?.fileEntries} loading={loading} error={error}>
            {(files) =>
              files.map((file) => (
                <MediaPlayerRow
                  title={file.name}
                  key={file.id}
                  src={file.url}
                  gutter={24}
                  mediaColProps={{
                    xs: { span: 12 },
                    md: { span: 10 },
                  }}
                  waveformColProps={{
                    xs: { span: 12 },
                    md: { span: 10 },
                  }}
                />
              ))
            }
          </AsyncData>
        </Layout.Content>
      </Layout>
    </EnumProvider>
  );
};
export default ComparePage;
