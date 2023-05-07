import React from "react";
import { HMButton, HMButtonProps } from "./hm-button";

export const PrimaryLargeButton = (props: HMButtonProps) => {
    const { children, ...rest } = props;

    return (
        <HMButton buttonSize={"Large"} buttonType={"Primary"} {...rest}>
            {children}
        </HMButton>
    );
};
