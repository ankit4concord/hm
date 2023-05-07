import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const SecondaryMediumButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Medium"} buttonType={"Secondary"} {...rest}>
            {children}
        </HMButton>
    );
};
