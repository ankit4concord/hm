import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const TertiaryMediumButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Medium"} buttonType={"Tertiary"} {...rest}>
            {children}
        </HMButton>
    );
};
