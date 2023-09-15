import type { OperationVariables, TypedDocumentNode} from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { Alert, Input, Modal, Select, Table } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import type { ColumnFilterItem, ColumnsType, FilterValue, TablePaginationConfig } from "antd/es/table/interface";
import type { Key, ReactNode} from "react";
import { useCallback, useMemo, useState } from "react";



/**
 * Base Column Definition for the Resource Selector Table.
 * Mimics what Ant Design wants from a table, with _some_ added typing.
 */
export interface ResourceSelectorColumnBase<V> {
    title: string;
    key?: string;
    dataIndex?: keyof V & string;
    // Using any here to mimic the rc-table interface.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, record: V, index: number) => ReactNode;
}
/**
 * Full Column Definition for the Resource Selector Table.
 * These fields are specific to the Resource Selector, and will be removed
 * before passing column definitions to the Ant Design table.
 */
export interface ResourceSelectorColumn<V> extends ResourceSelectorColumnBase<V> {
    filterOptions?: Omit<ColumnFilterItem, "children">[] | ((values: V[]) => Omit<ColumnFilterItem, "children">[]);
}
export type ResourceSelectorColumns<V> = ResourceSelectorColumn<V>[];



/**
 * Takes the custom column definitions for a Resource Selector and transforms it into
 * Ant Design Table column definitions.
 *
 * This currently just resolves filter logic.
 *
 * @param columns Resource Selector column definitions
 * @param data The current data in the table, to base filters on currently visible records
 * @returns Column definitions for an Ant Design Table
 *
 * @todo allow filter values to be based on an asynchronous operation, like fetching enum values from the server.
 */
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



export interface ResourceSelectorProps<V, QRes, QVar extends OperationVariables> {
    /** The value of this input */
    value?: V;
    /** Callback for when the user selects a new value. */
    onChange?: (value?: V) => void;
    /** The field on `V` that uniquely identifies a resource record. */
    recordKey: keyof V;

    /** The GraphQL Document Node that the selector will use to fetch resources to pick from. */
    queryDocumentNode: TypedDocumentNode<QRes, QVar>;
    /** A function that takes the raw query result and returns an array of values to choose from. */
    queryMap: (res: QRes) => V[];

    /** A function that returns whatever should be rendered in this input after a value is selected. */
    renderValue: (value: V) => ReactNode;

    /** Columns definitions for the table that resource options will be displayed in. */
    columns: ResourceSelectorColumns<V>;
    /** Optional styling to apply to the `<Select>` input. */
    className?: string;

    /**
     * A function that, given currently applied filters and searches,
     * returns the query variables that will return the desired records.
     */
    onQuery: (filters: Record<string, FilterValue | null>, search?: string) => QVar



    // TODO: add pagination support. With some extra assumptions about QRes we could build the `skip` and `take` here.
    // onQuery: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, search?: string) => QVar

    // TODO: the following:
    /**
     * If you don't want the whole object to be the `value` of this input, pass in `valueMap`.
     * This functions takes what would otherwise be the value of this input, and maps it to another value.
     *
     * @example If you only need the `id` field of a resource, you could pass the following:
     * ```tsx
     * valueMap={(res) => res.id}
     * ```
     */
    // valueMap?: (value: V) => T;
}

export function ResourceSelector<V extends object, QRes, QVar extends OperationVariables>({
    value, onChange: _onChange,
    queryDocumentNode,
    queryMap, onQuery,
    renderValue,
    columns, recordKey,
    className
}: ResourceSelectorProps<V, QRes, QVar>) {
    ///////////////////////////////////////////////////
    //   Fields for the Resource Selector <Select>   //
    ///////////////////////////////////////////////////

    /** The current value for the `<Select>` component that is rendered outside the modal. */
    const selectValue = useMemo<Key | undefined>(() => value ? value[recordKey] as Key : undefined, [value, recordKey]);
    /**
     * The current options for the `<Select>` component that is rendered outside the modal.
     * This is just computed to be the current value so we can render it nicely.
     */
    const selectOptions = useMemo<DefaultOptionType[]>(() => {
        if(!value) { return []; }
        return [
            { label: renderValue(value), value: value[recordKey] as Key }
        ];
    }, [recordKey, renderValue, value]);



    /////////////////////////////////////////////////
    //   Fields for the Resource Selection Modal   //
    /////////////////////////////////////////////////

    /** Tracks the open state of the Modal that contains most of the resource selector */
    const [modalOpen, setModalOpen] = useState(false);
    /** The currently selected table row/record. */
    const [selectedValue, setSelectedValue] = useState<V | undefined>(value);
    /** The value currently being searched, set by the `<Input.Search>` component. */
    const [searchValue, setSearchValue] = useState<string | undefined>();
    /** The filters on the table, set by the table's `onChange` function. */
    const [filterValue, setFilterValue] = useState<Record<string, FilterValue | null>>({});

    /**
     * The GraphQL query that fetches all the data!
     *
     * This is lazy primarily so we don't fetch data until the user clicks on the selector.
     */
    const [ fetchData, { data, loading, error }] = useLazyQuery(queryDocumentNode, {
        variables: onQuery(filterValue, searchValue)
    });

    /** An onClick handler for the table rows, so users don't have to click right on the radio button. */
    const onRow = useCallback((row: V) => ({
        onClick: () => { setSelectedValue?.(row); }
    }), []);
    /** Memoized dataSource that extracts the records from the query data. */
    const dataSource = useMemo(() => data ? queryMap(data) : undefined, [data, queryMap]);
    /** Memoized Ant Design Table column definitions, from our custom column definitions. */
    const tableColumns = useMemo(() => transformColumns(columns, dataSource ?? []), [columns, dataSource]);



    /** Opens the modal, reseting some values in the meantime. */
    const openModal = useCallback(() => {
        setModalOpen(true);
        setSelectedValue(value);
        setSearchValue(undefined);
        fetchData();
    }, [fetchData, value]);

    /** Actual `onChange` listener. Calls the passed in `onChange` function and closes the modal. */
    const onChange = useCallback((value?: V) => {
        _onChange?.(value);
        setModalOpen(false);
    }, [_onChange]);

    /**
     * When the user executes a search (by pressing "enter" or clicking the search button), updates `searchValue`.
     * This will trigger the LazyQuery to fire with the updated search value.
     */
    const onSearch = useCallback((search: string) => {
        // Add logic operator to convert "" to `undefined`;
        const actualSearch = search || undefined;
        setSearchValue(actualSearch);
    }, []);
    /**
     * When the user changes a filter with the table, updates `filterValue`.
     * This will trigger the LazyQuery to fire with the updated filters.
     *
     * @todo support pagination and sort ordering
     */
    const onTableChange = useCallback((_pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
        setFilterValue(filters);
    }, []);


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
                    selectedRowKeys: selectedValue ? [ selectedValue[recordKey] as Key ] : []
                }}
                rowKey={recordKey}
            />
        </Modal>
    </>;
}
