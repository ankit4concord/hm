import React from 'react';
import {HMText, TypographyProps } from "./hm-text";

const HeaderBigOnboarding = (props: TypographyProps) => {
  const { children } = props;
  return (
    <HMText textType={'HeaderBigOnboarding'} {...props}>{children}</HMText>
  ); 
};

export { HeaderBigOnboarding };
