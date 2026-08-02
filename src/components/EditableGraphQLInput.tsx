import type { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { App, Input } from "antd";
import clsx from "clsx";
import { CheckIcon, XIcon, PencilIcon, LoaderIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useCallback, useState } from "react";

export interface EditableGraphQLInputProps<QRes, QVar extends OperationVariables, T = string> {
  value?: T | undefined;

  mutationDocument: TypedDocumentNode<QRes, QVar>;
  onMutate: (value: T | undefined) => QVar;
  afterUpdate?: (res: QRes) => void;

  renderInput?: (value: T | undefined, onChange: (value: T | undefined) => void) => ReactElement;
  renderValue?: (value: T | undefined) => ReactNode;
}

// oxlint-disable-next-line max-lines-per-function
export function EditableGraphQLInput<QRes, QVar extends OperationVariables, T = string>({
  value,

  mutationDocument,
  onMutate,
  afterUpdate,

  renderInput,
  renderValue,
}: Readonly<EditableGraphQLInputProps<QRes, QVar, T>>) {
  const { message } = App.useApp();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState<T | undefined>(value);

  const [mutate, { loading }] = useMutation(mutationDocument, {
    onCompleted: (res) => {
      afterUpdate?.(res);
      setEditing(false);
    },
    onError: (err) => {
      console.error(err);
      message.error("Failed to update field, please try again");
    },
  });

  const onSubmit = useCallback(() => {
    void mutate({ variables: onMutate(inputValue) });
  }, [mutate, onMutate, inputValue]);

  if (editing) {
    return (
      <div className="w-full flex gap-x-2 items-center">
        {renderInput ? (
          renderInput(inputValue, setInputValue)
        ) : (
          <Input
            className="flex-grow"
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion - If `renderInput` isn't defined, then T is a string.
            value={inputValue as string}
            onChange={(ev) => {
              // oxlint-disable-next-line typescript/no-unsafe-type-assertion
              setInputValue(ev.target.value as T);
            }}
          />
        )}
        {loading ? (
          <LoaderIcon />
        ) : (
          <CheckIcon className="cursor-pointer hover:text-black" onClick={onSubmit} />
        )}
        <XIcon
          className={clsx("cursor-pointer hover:text-black", { disabled: loading })}
          onClick={() => {
            setEditing(false);
          }}
        />
      </div>
    );
  }
  return (
    <div className="w-full flex">
      {/* oxlint-disable-next-line typescript/no-unsafe-type-assertion - If `renderInput` isn't defined, then T is a string. */}
      <span className="grow">{renderValue ? renderValue(value) : (value as string)}</span>
      <PencilIcon
        className="cursor-pointer hover:text-black"
        onClick={() => {
          setEditing(true);
        }}
      />
    </div>
  );
}
