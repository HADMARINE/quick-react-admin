import React from 'react';
import styled from 'styled-components';

interface Props {
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: number;
  onClick?: ReactTypes.onClick<HTMLButtonElement>;
  props?: Record<string, any>;
  variant?:
    | 'primary'
    | 'primary-inversed'
    | 'secondary'
    | 'gray'
    | 'violet'
    | 'transparent'
    | 'black';
  color?: string;
  flex?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  raw?: boolean;
  disabled?: boolean;
  href?: string;
}

const theme = {
  primary: `color: white; background-color: black;`,
  'primary-inversed': `color: black; background-color: white;`,
  secondary: 'color: gray; background-color: white;',
  gray: 'color: white; background-color: #363636;',
  violet: 'color:white; background-color: #520092;',
  black: 'color:white; background-color:black',
  transparent: 'background: none; color: white;',
  disabled: 'background:gray; color: white; cursor: not-allowed;',
};

const ButtonGenerator = styled.button`
  ${(props: Props) => `
   background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  ${
    props.raw
      ? ''
      : `width: ${props.width || '400px'};
height: ${props.height || '70px'};
font-size: ${props.fontSize || '20px'};
font-weight: ${props.fontWeight || 500};
${theme[props.disabled ? 'disabled' : props.variant || 'primary']}`
  };
  border-radius: 3px;
  padding: 0;
  margin: 5px 0;
  flex: ${props.flex || ''};
  ${props.color ? `color: ${props.color}` : ``};
  border: none;
  :hover {
    cursor: pointer;
  }
`}
`;

export default function Button(_props: Props) {
  const { props, ...__props } = _props;
  return <ButtonGenerator {...__props} {...props}></ButtonGenerator>;
}
