import React from 'react';
import styled from 'styled-components';

export const KeyColor = styled.span`
  color: black;
  width: 100%;
  height: 100%;
`;

export const BackgroundColor = styled.span`
  color: white;
  width: 100%;
  height: 100%;
`;

interface ColorProps {
  color?: string;
  children?: React.ReactNode;
}

const ColorComponent = styled.span``;

export const ColorGen = (props: ColorProps) => {
  return (
    <ColorComponent style={{ color: props.color }}>
      {props.children}
    </ColorComponent>
  );
};

export default {
  key: KeyColor,
  background: BackgroundColor,
  gen: ColorGen,
};
