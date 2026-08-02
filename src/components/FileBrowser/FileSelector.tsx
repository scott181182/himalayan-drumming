import { useApolloClient, useQuery } from "@apollo/client/react";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { XIcon } from "lucide-react";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { ReactElement } from "react";
import { useCallback, useMemo } from "react";

import { useDashboardDispatch } from "@/contexts/DashboardContext";
import type { FileEntryBasicFragment } from "@/generated/graphql";
import {
  AssociateFilesDocument,
  DisassociateFilesDocument,
  GetFileEntriesDocument,
} from "@/generated/graphql";
import { usePromiseMessage } from "@/utils/antd";
import { uniqByFilter } from "@/utils/array";

// oxlint-disable-next-line import/max-dependencies
import cls from "./FileSelector.module.css";

function makeCustomFileTag(setSelectedFilesById: (fileIds: string[]) => void) {
  return function CustomFileTage({ label, onClose, value }: CustomTagProps): ReactElement {
    return (
      <span
        className={`ant-select-selection-item ${cls.fileTag}`}
        title={typeof label === "string" ? label : "Unknown"}
      >
        {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events jsx-a11y/no-static-element-interactions */}
        <span
          className="ant-select-selection-item-content"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            setSelectedFilesById([value]);
          }}
        >
          {label}
        </span>
        {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events jsx-a11y/no-static-element-interactions */}
        <span className="ant-select-selection-item-remove" onClick={onClose}>
          <XIcon />
        </span>
      </span>
    );
  };
}

export interface FileSelectorProps {
  file: FileEntryBasicFragment;
}

// oxlint-disable-next-line max-lines-per-function
export function FileSelector({ file }: FileSelectorProps) {
  const { updateFile, setSelectedFilesById } = useDashboardDispatch();
  const handlePromise = usePromiseMessage();
  const apollo = useApolloClient();

  const {
    data: fileEntries,
    loading: filesLoading,
    refetch,
  } = useQuery(GetFileEntriesDocument, {
    variables: {
      skip: 0,
      take: 10,
    },
  });

  const fileOptions = useMemo<DefaultOptionType[]>(
    () =>
      [...(fileEntries?.fileEntries ?? []), ...(file.associatedFiles ?? [])]
        .map((f) => ({
          label: f.name,
          value: f.id,
        }))
        .filter(uniqByFilter("value")),
    [fileEntries?.fileEntries, file.associatedFiles],
  );

  const onAssociate = useCallback(
    (file2Id: string) => {
      void apollo
        .mutate({
          mutation: AssociateFilesDocument,
          variables: {
            file1Id: file.id,
            file2Id,
          },
        })
        .then((res) => {
          res.data?.associateFiles?.forEach(updateFile);
        })
        .then(...handlePromise("Files Associated", "Error associating files"));
    },
    [apollo, file.id, handlePromise, updateFile],
  );
  const onDisassociate = useCallback(
    (file2Id: string) => {
      void apollo
        .mutate({
          mutation: DisassociateFilesDocument,
          variables: {
            file1Id: file.id,
            file2Id,
          },
        })
        .then((res) => {
          res.data?.disassociateFiles?.forEach(updateFile);
        })
        .then(...handlePromise("Files Disassociated", "Error disassociating file"));
    },
    [apollo, file.id, handlePromise, updateFile],
  );

  const onSearch = useCallback(
    (text: string) => {
      console.log(text);
      void refetch({ where: { name: { contains: text } } });
    },
    [refetch],
  );

  return (
    <Select
      className="w-full"
      value={file.associatedFiles.map((f) => f.id)}
      options={fileOptions}
      showSearch={{ filterOption: false, onSearch }}
      mode="tags"

      loading={filesLoading}
      tagRender={makeCustomFileTag(setSelectedFilesById)}

      onSelect={onAssociate}
      onDeselect={onDisassociate}
    />
  );
}
