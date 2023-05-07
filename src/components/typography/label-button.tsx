import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const LabelButton = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'LabelButton'} {...props}>{children}</HMText>
  ); 
};

export { LabelButton };
