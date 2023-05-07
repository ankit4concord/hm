import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const PrimaryMediumButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Medium"} buttonType={"Primary"} {...rest}>
            {children}
        </HMButton>
    );
};
