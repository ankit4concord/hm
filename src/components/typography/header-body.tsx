import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const HeaderBody = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'HeaderBody'} {...props}>{children}</HMText>
  ); 
};

export { HeaderBody };
