import React from 'react';
import colors from '@ecom/utils/colors';
import { icons, IconKeys } from './svg-icons-list';

interface SVGIconProps {
    name: string;
    size: number;
    style?: any;
    color?: string;
    fill?: string;
    fillSecondary?: string;
};

export const SVGIcon = ({name, size, style, color = colors.blackText, fill, fillSecondary}: SVGIconProps) => {
    const IconComponent = (icons as any)[name];
    if (!IconComponent) {
        console.warn(`Icon name: ${name} not found`);
        return null;
    }

    return <IconComponent width={size} height={size} style={[style, { color }]} fill={fill} fillSecondary={fillSecondary} />;
};

export const SVGIconKeys = IconKeys;
