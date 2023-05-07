import { Animated, ViewPropTypes } from 'react-native'
import React, { PureComponent } from 'react'

import PropTypes from 'prop-types'

export default class AnimatedHideView extends PureComponent {
  static defaultProps = {
    duration: 10,
    animate: true,
    unmountOnHide: false,
    style: {}
  }

  constructor(props) {
    super(props)
    this.opacity = new Animated.Value(props.visible ? 1 : 0)
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.animate()
    }
  }

  animate = () => {
    const { animate, duration, visible } = this.props

    Animated.timing(this.opacity, {
      toValue: visible ? 0 : 1,
      duration: animate ? 500 : 0,
      useNativeDriver: true,
    }).start()
  }

  render() {
    const { unmountOnHide, visible, style, children, ...otherProps } =
      this.props

    const renderStyle = {
      opacity: this.opacity,
      zIndex: visible ? 1 : 0,
    }

    const pointerEvents = visible ? 'auto' : 'none'

    if (unmountOnHide && !visible) {
      return null
    }

    return (
      <Animated.View
        pointerEvents={pointerEvents}
        style={[renderStyle, style]}
        {...otherProps}>
        {children}
      </Animated.View>
    )
  }
}
