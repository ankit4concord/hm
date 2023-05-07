import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const SecondarySmallButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Small"} buttonType={"Secondary"} {...rest}>
            {children}
        </HMButton>
    );
};
