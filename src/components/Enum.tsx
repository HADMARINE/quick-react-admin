import React from 'react';
import { Flex } from './assets/Wrapper';
import { ContainerBase } from '..';
import { Badge, Column, Option, Picklist } from 'react-rainbow-components';

export interface Props extends ContainerBase<string> {
  fontSize?: string;
  fontWeight?: number;
  choices: string[];
}

const badgeStyles = { color: 'black', marginLeft: '0.5rem' };
const StatusBadge = ({ value }: any) => (
  <Badge label={value} variant="lightest" style={badgeStyles} />
);

const EnumContainer = (props: Props) => {
  return props.isChanging ? (
    <Flex horizontal flex={1}>
      <Picklist
        style={{ flex: 1 }}
        value={
          props.value &&
          ({
            name: props.value,
            label: `${props.value[0].toUpperCase()}${props.value.slice(1)}`,
          } as any)
        }
        onChange={(_value) => {
          props.onChange({ target: { value: _value.label } } as any);
        }}>
        {props.choices.map((v) => (
          <Option
            key={`Picklist_item_${v}`}
            label={`${v[0].toUpperCase()}${v.slice(1)}`}
            name={v}
          />
        ))}
      </Picklist>
    </Flex>
  ) : (
    <Column
      header={props.title}
      field={props.key}
      component={StatusBadge}
      sortable={props.sortable || true}
    />
  );
};

export default EnumContainer;
