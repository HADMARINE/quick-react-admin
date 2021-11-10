import React from 'react';
import { Flex } from './assets/Wrapper';
import { ContainerBase } from '..';
import Img from './assets/Img';
import { Column, FileSelector } from 'react-rainbow-components';

type Props = ContainerBase<any>;

const ImageContainer = (props: Props) => {
  return props.isChanging ? (
    <Flex width={'70%'} horizontal flex={1}>
      <Img src={props.value} />
      <FileSelector
        label={'Image Selector'}
        placeholder={'Select image'}
        onChange={(e) => {
          props.onChange({ target: { value: e.item(0) } } as any);
        }}
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

export default ImageContainer;
