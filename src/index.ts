/* eslint-disable id-blacklist */
import React from 'react';
import DateTimeContainer from './components/DateTime';
import EnumContainer from './components/Enum';
import MarkdownContainer from './components/Markdown';
import NumberContainer from './components/Number';
import StringContainer from './components/String';
import _AdminTable, { Props as AdminTableProps } from './AdminTable';

export type ContainerBase<T> = PreferencesContainerBase &
  ExclusiveContainerBase<T>;

export type PreferencesContainerBase = Partial<{
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title: string;
  sortable: boolean;
  editable: boolean;
  verifier?: (value: any) => string | undefined;
}>;

// this type must include only controlling vars
export type ExclusiveContainerBase<T> = {
  isChanging: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  value?: T;
  key?: string;
  error?: string | undefined;
};

export type ContainerTypes =
  | 'string'
  | 'enum'
  | 'datetime'
  | 'number'
  | 'markdown';

export type AdminTableGetApi<T> = (props: {
  skip: number;
  limit: number;
  order?: { target: string; direction: 'asc' | 'desc' };
  query?: Record<string, any>;
}) => Promise<
  {
    result: boolean;
    data: T[];
  } & Partial<{
    length: number;
  }>
>;

export function AdminTableGetApiDataProcessor<T extends Record<string, any>>(
  props: T,
): ThenArgRecursive<ReturnType<AdminTableGetApi<T>>> {
  return {
    result: props.result,
    data: props.data.data,
    length: props.data.length,
  };
}

export function containerFactory<T>(
  container: (arg0: T) => JSX.Element,
  type: ContainerTypes,
) {
  type CType = T extends ContainerBase<any> ? T['value'] : any;
  return (pref: Omit<T, keyof ExclusiveContainerBase<CType>>) => {
    return {
      func: (ctrl: ExclusiveContainerBase<CType>) => {
        return container(Object.assign(pref, ctrl) as any);
      },
      pref: Object.assign(pref, { containerType: type }),
    };
  };
}

export const DataTypes = {
  string: containerFactory(StringContainer, 'string'),
  enum: containerFactory(EnumContainer, 'enum'),
  dateTime: containerFactory(DateTimeContainer, 'datetime'),
  number: containerFactory(NumberContainer, 'number'),
  markdown: containerFactory(MarkdownContainer, 'markdown'),
};

export const AdminTable = _AdminTable;

export type AdminTablePatchApi = Exclude<
  AdminTableProps<any>['patchApi'],
  undefined
>;

export type AdminTableDeleteApi = Exclude<
  AdminTableProps<any>['deleteApi'],
  undefined
>;

export type AdminTablePostApi = Exclude<
  AdminTableProps<any>['postApi'],
  undefined
>;
