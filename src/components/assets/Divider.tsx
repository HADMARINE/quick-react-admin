import React from 'react';
import styled from 'styled-components';

interface Props {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
}

const DividerGenerator = styled.div`
  ${(props: Props) => `
    background-color: ${props.color || 'white'};
  width: ${props.width || 0};
  height: ${props.height || 0};
`}
`;
export default function Divider(props: Props) {
  return <DividerGenerator {...props} />;
}
