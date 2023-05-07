import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const HeaderBig = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'HeaderBig'} {...props}>{children}</HMText>
  ); 
};

export { HeaderBig };
