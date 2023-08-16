import type { OperationVariables, TypedDocumentNode} from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { Alert, Input, Modal, Select, Table } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import type { ColumnFilterItem, ColumnsType, FilterValue, TablePaginationConfig } from "antd/es/table/interface";
import type { Key, ReactNode} from "react";
import { useCallback, useMemo, useState } from "react";



export interface ResourceSelectorColumnBase<V> {
    title: string;
    key?: string;
    dataIndex?: keyof V & string;
    // Using any here to mimic the rc-table interface.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, record: V, index: number) => ReactNode;
}
export interface ResourceSelectorColumn<V> extends ResourceSelectorColumnBase<V> {
    filterOptions?: Omit<ColumnFilterItem, "children">[] | ((values: V[]) => Omit<ColumnFilterItem, "children">[]);
}
export type ResourceSelectorColumns<V> = ResourceSelectorColumn<V>[];



function transformColumns<T>(columns: ResourceSelectorColumns<T>, data: T[]): ColumnsType<T> {
    return columns.map((colDef) => {
        const { filterOptions, ...column } = colDef;
        return {
            ...column,
            filters: typeof filterOptions === "function" ?
                filterOptions(data) :
                filterOptions
        };
    });
}



export interface SelectorProps<V, QRes, QVar extends OperationVariables, T=V> {
    value?: V;
    onChange?: (value?: T) => void;

    queryDocumentNode: TypedDocumentNode<QRes, QVar>;
    queryMap: (res: QRes) => V[];

    renderValue: (value: V) => ReactNode;
    // keyFn: (value: V) => Key;
    valueMap?: (value: V) => T;
    columns: ResourceSelectorColumns<V>;
    className?: string;
    recordKey: keyof V;

    onQuery: (filters: Record<string, FilterValue | null>, search?: string) => QVar
    // onQuery: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, search?: string) => QVar
}

export function ResourceSelector<V extends object, QRes, QVar extends OperationVariables>({
    value, onChange: _onChange,
    queryDocumentNode,
    queryMap, onQuery,
    valueMap, renderValue,
    columns, recordKey,
    className
}: SelectorProps<V, QRes, QVar>) {
    const [modalOpen, setModalOpen] = useState(false);

    const selectValue = useMemo<Key | undefined>(() => value ? value[recordKey] : undefined, [value, recordKey]);
    const selectOptions = useMemo<DefaultOptionType[]>(() => {
        if(!value) { return []; }
        return [
            { label: renderValue(value), value: value[recordKey] }
        ];
    }, [recordKey, renderValue, value]);

    // Fields for the modal form
    const [selectedValue, setSelectedValue] = useState<V | undefined>(value);
    const [searchValue, setSearchValue] = useState<string | undefined>();
    const [filterValue, setFilterValue] = useState<Record<string, FilterValue | null>>({});
    const [ fetchData, { data, loading, error }] = useLazyQuery(queryDocumentNode, {
        variables: onQuery(filterValue, searchValue)
    });


    const onRow = useCallback((row: V) => ({
        onClick: () => { setSelectedValue?.(row); }
    }), []);
    const dataSource = useMemo(() => data ? queryMap(data) : undefined, [data, queryMap]);
    const tableColumns = useMemo(() => transformColumns(columns, dataSource ?? []), [columns, dataSource]);




    const openModal = useCallback(() => {
        setModalOpen(true);
        setSelectedValue(value);
        setSearchValue(undefined);
        fetchData();
    }, [fetchData, value]);

    const onChange = useCallback((value?: V) => {
        if(value === undefined) {
            _onChange?.(undefined);
        } else {
            _onChange?.(valueMap ? valueMap(value) : value);
        }
        setModalOpen(false);
    }, [_onChange, valueMap]);

    const updateQuery = useCallback((filters: Record<string, FilterValue | null>, search: string | undefined) => {
        fetchData({ variables: onQuery(filters, search) });
    }, [fetchData, onQuery]);
    const onSearch = useCallback((search: string) => {
        // Add logic operator to convert "" to `undefined`;
        const actualSearch = search || undefined;
        setSearchValue(actualSearch);
        updateQuery(filterValue, actualSearch);
    }, [filterValue, updateQuery]);
    const onTableChange = useCallback((_pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
        setFilterValue(filters);
        updateQuery(filters, searchValue);
    }, [searchValue, updateQuery]);


    return <>
        <Select
            open={false}
            onClick={openModal}
            placeholder="Please select a value"

            value={selectValue}
            options={selectOptions}
            className={className}
        />
        <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            maskClosable
            onOk={() => onChange(selectedValue)}
            title="Select Person"
        >
            <Input.Search onSearch={onSearch} className="my-4" placeholder="Search resources"/>
            {error && <Alert type="error" description="There was an error fetching data. Please try again!"/>}
            <Table
                dataSource={dataSource}
                columns={tableColumns}
                onChange={onTableChange}
                loading={loading}

                bordered
                expandable={{
                    // This is to avoid the table thinking that a record's children make this a tree structure.
                    childrenColumnName: "_children"
                }}

                rowClassName="cursor-pointer"
                onRow={onRow}
                rowSelection={{
                    type: "radio",
                    onChange: (_, selectedValues) => setSelectedValue(selectedValues[0]),
                    selectedRowKeys: selectedValue ? [ selectedValue[recordKey] ] : []
                }}
                rowKey={recordKey}

            />
        </Modal>
    </>;
}
