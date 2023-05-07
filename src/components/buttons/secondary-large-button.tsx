import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const SecondaryLargeButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Large"} buttonType={"Secondary"} {...rest}>
            {children}
        </HMButton>
    );
};
