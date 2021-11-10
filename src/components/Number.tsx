import React from 'react';

import { Flex } from './assets/Wrapper';
import { Column, Input } from 'react-rainbow-components';
import { ContainerBase } from '..';

type Props = ContainerBase<number>;

const NumberContainer = (props: Props) => {
  return props.isChanging ? (
    <Flex width={'70%'} horizontal flex={1}>
      <Input
        onChange={(e) => {
          if (isNaN(e.target.value as any)) {
            return;
          }
          props.onChange(e);
        }}
        value={props.value}
        variant={'default'}
        style={{ flex: 1 }}
        error={props.error || undefined}
      />
    </Flex>
  ) : (
    <Column
      sortable={props.sortable || true}
      header={props.title}
      field={props.key}
    />
  );
};

export default NumberContainer;
