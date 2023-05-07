import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const Description = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'Description'} {...props}>{children}</HMText>
  ); 
};

export { Description };
