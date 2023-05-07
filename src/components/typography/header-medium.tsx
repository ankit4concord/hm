import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const HeaderMedium = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'HeaderMedium'} {...props}>{children}</HMText>
  ); 
};

export { HeaderMedium };
