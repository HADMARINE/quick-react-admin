import React from 'react';

// * Types

interface FlexProps {
  left?: boolean;
  right?: boolean;
  center?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  flex?: number | string;
  horizontal?: boolean;
  vertical?: boolean;
  fit?: boolean;
  onClick?: ReactTypes.onClick<HTMLDivElement>;
  height?: string;
  width?: string;
  fitParent?: boolean;
}

interface FlexSpacerProps {
  flex?: number | string;
}

interface FlexHorizontalProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// * Middleware functions

const justifyDirection = (props: FlexProps) => {
  if (props.left) return 'flex-start';
  else if (props.right) return 'flex-end';
  else if (props.center) return 'center';
  return '';
};

const flexDirection = (props: FlexProps) => {
  if (props.horizontal) return 'row';
  else if (props.vertical) return 'column';
};

// * Components

export const Flex = (props: FlexProps) => {
  const FlexStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: justifyDirection(props),
    flexDirection: flexDirection(props),
    alignItems: 'center',
    flex: props.flex,
    height: props.height,
    width: props.width,
    ...props.style,
  };

  if (props.fit) {
    FlexStyle.height = '100vh';
  }

  if (props.fitParent) {
    FlexStyle.width = '100%';
    FlexStyle.height = '100%';
  }

  return (
    <div style={FlexStyle} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export const FlexSpacer = (props: FlexSpacerProps) => {
  return <div style={{ flex: props.flex || 1 }} />;
};

export const FlexHorizontal = (props: FlexHorizontalProps) => {
  const FlexHorizontalStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...props.style,
  };
  return <div style={FlexHorizontalStyle}>{props.children}</div>;
};

export default { Flex, FlexSpacer, FlexHorizontal };
