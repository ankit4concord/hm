import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const LabelName = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'LabelName'} {...props}>{children}</HMText>
  ); 
};

export { LabelName };
