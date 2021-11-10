import React from 'react';
import { Flex } from './assets/Wrapper';

interface Props {
  flex?: number;
  customProcessor?: React.ReactNode;
}

export default (props: Props) => {
  <Flex flex={props.flex || 1} horizontal center>
    [...]
  </Flex>;
};
