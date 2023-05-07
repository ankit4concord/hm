import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const OutlinedSmallButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Small"} buttonType={"Outlined"} {...rest}>
            {children}
        </HMButton>
    );
};
