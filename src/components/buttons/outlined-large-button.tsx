import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const OutlinedLargeButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Large"} buttonType={"Outlined"} {...rest}>
            {children}
        </HMButton>
    );
};
