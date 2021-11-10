import React from 'react';

interface ImgProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  objectFit?: React.CSSProperties['objectFit'];
  onClick?: ReactTypes.onClick<any>;
  children?: React.ReactNode;
  className?: string;
  props?: Record<string, any>;
}

export default function Img(props: ImgProps) {
  const ImageStyle: React.CSSProperties = {
    objectFit: props.objectFit || 'contain',
    cursor: props.onClick && 'pointer',
    ...props.style,
  };
  return (
    <img
      src={props.src}
      alt={props.alt || 'IMAGE'}
      width={props.width}
      height={props.height}
      style={ImageStyle}
      className={props.className}
      onClick={props.onClick}
      {...props.props}>
      {props.children}
    </img>
  );
}
