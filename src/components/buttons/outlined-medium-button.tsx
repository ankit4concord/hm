import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const OutlinedMediumButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Medium"} buttonType={"Outlined"} {...rest}>
            {children}
        </HMButton>
    );
};
