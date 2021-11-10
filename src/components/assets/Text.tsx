import styled, { StyledComponent } from 'styled-components';
import React from 'react';

// Interface & types
type StyledComponentType = StyledComponent<any, any, Record<string, any>>;

interface BoldType {
  color: StyledComponentType;
  default: StyledComponentType;
}
interface TextProps {
  children?: React.ReactNode;
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  lineHeight?: number;
  textAlign?: React.CSSProperties['textAlign'] | string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  fitParent?: boolean;
}
// Styles + Components

export const HugeText: StyledComponentType = styled.p`
  font-size: 200px;
  font-weight: ${(props: any): number =>
    props.fontWeight ? props.fontWeight : 900};
  word-break: keep-all;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 150px;
  }
`;

export const Title: StyledComponentType = styled.p`
  font-size: 70px;
  font-weight: ${(props: any): number =>
    props.fontWeight ? props.fontWeight : 900};
  word-break: keep-all;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 25px;
  }
`;

export const SubTitle: StyledComponentType = styled.p`
  font-size: 35px;
  font-weight: ${(props: any): number =>
    props.fontWeight ? props.fontWeight : 500};
  word-break: keep-all;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 18px;
    font-weight: 900;
  }
`;

export const Bold: BoldType = {
  color: styled.span`
    color: #ea5550;
    font-weight: 900;
    margin: 0;
  `,
  default: styled.span`
    font-weight: 900;
    margin: 0;
  `,
};

export const Paragraph: StyledComponentType = styled.p`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.8;
  word-break: keep-all;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SmallText: StyledComponentType = styled.p`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  word-break: keep-all;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
  }
  @media screen and (max-height: 670px) {
    font-size: 12px;
    line-height: 1.4;
  }
`;

export const Text = (props: TextProps) => {
  // eslint-disable-next-line no-underscore-dangle
  const textStyle: React.CSSProperties = {
    wordBreak: 'keep-all',
    fontWeight: props.fontWeight || 500,
    fontSize: props.fontSize || '14px',
    lineHeight: props.lineHeight || 1.8,
    textAlign: props.textAlign as any,
    width: props.width,
    height: props.height,
    fontFamily: props.fontFamily,
    alignItems: props.textAlign,
    display: 'flex',
    textDecoration: 'none',
  };

  if (props.fitParent) {
    textStyle.width = '100%';
    textStyle.height = '100%';
  }

  return <div style={{ ...textStyle, ...props.style }}>{props.children}</div>;
};

export default { Title, SubTitle, Paragraph, Bold, HugeText, SmallText };
