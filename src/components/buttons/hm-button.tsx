import { Header, HeaderSmall, LabelName } from '@ecom/components/typography'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { Icon } from '../icons'
import React from 'react'
import colors from '@ecom/utils/colors'

export interface HMButtonProps {
  buttonType?: 'Primary' | 'Secondary' | 'Tertiary' | 'Outlined'
  buttonSize?: 'Large' | 'Medium' | 'Small'
  children?: string | React.ReactChild | React.ReactChild[]
  disabled?: boolean
  loading?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  textContainerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  icon?: string
  iconType?: 'Left' | 'Right' | 'Standalone'
  iconSize?: number
  iconColor?: string
  useDisabledStyle?: boolean
}

export const HMButton = ({
  buttonType = 'Primary',
  buttonSize = 'Large',
  children,
  disabled = false,
  loading = false,
  onPress,
  style,
  textContainerStyle,
  textStyle,
  useDisabledStyle = false,
  icon,
  iconType,
  iconSize,
  iconColor
}: HMButtonProps) => {
  const typeStyle = buttonTypeStyles[buttonType]
  const sizeStyle = buttonSizeStyles[buttonSize]
  const Text = textComponents[buttonSize]

  const isDisabled = useDisabledStyle && disabled

  const containerStyle = [sizeStyle.container, typeStyle.container, style]
  const joinedTextContainerStyle = [sizeStyle.textContainer, textContainerStyle]

  const textMargin =
    iconType === 'Left' ? sizeStyle.textLeftMargin : sizeStyle.textRightMargin
  const joinedTextStyle = [
    sizeStyle.text,
    typeStyle.text,
    iconType !== undefined ? textMargin : {},
    textStyle
  ]

  const buttonClick = () => {
    if (!disabled && !loading && onPress) {
      onPress()
    }
  }

  const renderInner = () => {
    const iconHeight = iconSize || sizeStyle.icon.fontSize
    const iColor = iconColor || typeStyle.text.color

    const TextComponent = children ? (
      <Text
        allowFontScaling={false}
        maxFontSizeMultiplier={1}
        style={joinedTextStyle}
        key={'buttonText'}>
        {children}
      </Text>
    ) : undefined

    const IconComponent = icon ? (
      <Icon
        size={iconHeight}
        name={icon || ''}
        allowFontScaling={false}
        color={iColor}
        key={'buttonIcon'}
        style={{ color: iColor }}
      />
    ) : undefined

    const firstComponent = iconType === 'Left' ? IconComponent : TextComponent
    const secondComponent = iconType === 'Right' ? IconComponent : TextComponent

    const iconAndText = iconType
      ? [firstComponent, secondComponent]
      : firstComponent

    return (
      <View style={joinedTextContainerStyle}>
        {iconType === 'Standalone' ? IconComponent : iconAndText}
      </View>
    )
  }

  return (
    <View style={[{ opacity: isDisabled ? 0.4 : 1 }, containerStyle]}>
      <TouchableOpacity
        onPress={buttonClick}
        disabled={disabled || loading}
        style={[containerStyle, styles.touchable]}>
        {renderInner()}
      </TouchableOpacity>
    </View>
  )
}

const textComponents = {
  Large: Header,
  Medium: LabelName,
  Small: HeaderSmall
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    borderWidth: 0,
    margin: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginStart: 0,
    marginEnd: 0
  }
})

const buttonTypeStyles = {
  Primary: StyleSheet.create({
    container: {
      backgroundColor: colors.hmPurple
    },
    text: {
      color: colors.white
    }
  }),
  Secondary: StyleSheet.create({
    container: {
      backgroundColor: colors.darkPink
    },
    text: {
      color: colors.white
    }
  }),
  Tertiary: StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      shadowRadius: vw(8),
      shadowOffset: { width: 0, height: vh(2) },
      shadowOpacity: 0.1
    },
    text: {
      color: colors.blackText
    }
  }),
  Outlined: StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: colors.blackText
    },
    text: {
      color: colors.blackText
    }
  })
}

const buttonSizeStyles = {
  Large: StyleSheet.create({
    container: {
      borderRadius: vw(30),
      height: vh(55),
      alignItems: 'center'
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    text: {
      textAlign: 'center'
    },
    textLeftMargin: {
      marginLeft: 8
    },
    textRightMargin: {
      marginRight: 8
    },
    icon: {
      fontSize: vw(16)
    }
  }),
  Medium: StyleSheet.create({
    container: {
      borderRadius: vw(50),
      height: vh(40),
      alignItems: 'center'
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    text: {
      textAlign: 'center'
    },
    textLeftMargin: {
      marginLeft: 8
    },
    textRightMargin: {
      marginRight: 8
    },
    icon: {
      fontSize: vw(14)
    }
  }),
  Small: StyleSheet.create({
    container: {
      borderRadius: vw(20),
      height: vh(36),
      alignItems: 'center'
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    text: {
      textAlign: 'center'
    },
    textLeftMargin: {
      marginLeft: 8
    },
    textRightMargin: {
      marginRight: 8
    },
    icon: {
      fontSize: vw(12)
    }
  })
}
