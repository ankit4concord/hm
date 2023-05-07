import { Dimensions, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import Connector from './Connector'

const CONNECTOR_SIZE = 8
const CONNECTOR_HEIGHT_MIDDLES = 15
const connectors = [
  'tl',
  // 'tm',
  'tr',
  'mr',
  'br',
  // 'bm',
  'bl',
  'ml'
  // 'c',
]
let connectorsMap = {}
let minH = 50
let minW = 100
const AXIS_X = 'x'
const AXIS_Y = 'y'
let axis = 'all'
let isResizable = true
let limitation = {
  x: 0,
  y: 0,
  w: Dimensions.get('window').width,
  h: Dimensions.get('window').height
}

const renderConnectors = (width, height) => {
  return connectors.map((connectorType) => {
    return (
      <Connector
        key={connectorType}
        type={connectorType}
        size={CONNECTOR_SIZE}
        x={connectorsMap[connectorType].calculateX(width)}
        y={connectorsMap[connectorType].calculateY(height)}
        onStart={connectorsMap[connectorType].onStart}
        onMove={connectorsMap[connectorType].onMove}
        onEnd={connectorsMap[connectorType].onEnd}>
        {connectorType === 'mr' || connectorType === 'ml' ? (
          <View
            style={{
              width: CONNECTOR_SIZE,
              height: CONNECTOR_HEIGHT_MIDDLES,
              backgroundColor: 'white',
              borderWidth: 2,
              borderRadius: 50,
              borderColor: '#D9D9D9',
            }}
          />
        ) : (
          <View
            style={{
              width: CONNECTOR_SIZE,
              height: CONNECTOR_SIZE,
              backgroundColor: 'white',
              borderWidth: 2,
              borderRadius: 50,
              borderColor: '#D9D9D9'
            }}
          />
        )}
      </Connector>
    )
  })
}

const DragResizeBlock = ({
  children,
  isDisabled,
  boxHeight: height,
  setBoxHeight: setHeight,
  boxWidth: width,
  setBoxWidth: setWidth,
  setHeightWidthTextBox,
  selectedTextInside,
  renderedImageData,
  removeConnectors,
  setisSelected,
  isSelected,
  setTextHeight,
  textHeight
}) => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const onEnd = () => {
    setHeightWidthTextBox({
      height: height / renderedImageData?.multiplierHeight,
      width: width / renderedImageData?.multiplierWidth,
      itemKey: selectedTextInside
    })
    setisSelected(false)
  }

  const onStart = () => {
    setisSelected(true)
  }

  /**
   * CONNECTOR_TOP_LEFT
   */
  connectorsMap['tl'] = {
    calculateX: () => {
      return -8
    },
    calculateY: () => {
      return -5
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }
      const newX = x + coord[0]
      const newY = y + coord[1]
      const newW = x + width - newX
      const newH = y + height - newY

      if (newW >= minW && axis != AXIS_Y) {
        // if (limitation.x <= newX) {
        setWidth(newW)
        setX(newX)
        // }
      }

      if (newH >= minH && axis != AXIS_X) {
        // if (limitation.y <= newY) {
        setHeight(newH)
        setY(newY)
        // }
      }
    },
    onEnd: onEnd
  }

  connectorsMap['ml'] = {
    calculateX: () => {
      return -9
    },
    calculateY: () => {
      return height / 2 - 8
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }
      const newX = x + coord[0]
      const newW = x + width - newX
      let newH = newW - width

      if (newW >= minW && axis != AXIS_Y) {
        if (limitation.x <= newX) {
          setWidth(newW)
          setX(newX)
          setHeight(height - newH)
          setTextHeight(textHeight - newH)
        }
      }
    },
    onEnd: onEnd
  }

  connectorsMap['mr'] = {
    calculateX: () => {
      return width - 10
    },
    calculateY: () => {
      return height / 2 - 8
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }

      // const newX = x + coord[0]
      const newW = width + coord[0]
      let newH = newW - width

      if (newW >= minW && axis != AXIS_Y) {
        if (limitation.w >= x + newW) {
          setWidth(newW)
          // if (newW < width) {
          setHeight(height - newH)
          setTextHeight(textHeight - newH)
          // setX(newX)
          // }
        }
      }
    },
    onEnd: onEnd
  }

  /**
   * CONNECTOR_TOP_MIDDLE
   */
  connectorsMap['tm'] = {
    calculateX: (width) => {
      return width / 2 - CONNECTOR_SIZE / 2
    },
    calculateY: () => {
      return -8
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }

      const newY = y + coord[1]
      const newH = y + height - newY
      if (newH >= minH && axis != AXIS_X) {
        if (limitation.y <= newY) {
          setHeight(newH)
          setY(newY)
        }
      }
    },
    onEnd: onEnd
  }

  /**
   * Top right connector.
   */
  connectorsMap['tr'] = {
    calculateX: (width) => {
      return width - 12
    },
    calculateY: () => {
      return -5
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }
      const newY = y + coord[1]
      const newW = width + coord[0]
      const newH = y + height - newY

      if (newW >= minW && axis != AXIS_Y) {
        // if (limitation.w >= newW) {
        setWidth(newW)
        // }
      }

      if (newH >= minH && axis != AXIS_X) {
        // if (limitation.y <= newY) {
        setHeight(newH)
        setY(newY)
        // }
      }
    },
    onEnd: onEnd
  }

  /**
   * Bottom left connector.
   */
  connectorsMap['bl'] = {
    calculateX: () => {
      return -8
    },
    calculateY: (height) => {
      return height - CONNECTOR_SIZE
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }

      const newX = x + coord[0]
      const newW = x + width - newX
      const newH = height + coord[1]

      if (newW >= minW && axis != AXIS_Y) {
        if (limitation.x <= newX) {
          setWidth(newW)
          setX(newX)
        }
      }

      if (newH >= minH && axis != AXIS_X) {
        if (y + newH <= limitation.h) {
          setHeight(newH)
        }
      }
    },
    onEnd: onEnd
  }

  /**
   * Bottom middle connector.
   */
  connectorsMap['bm'] = {
    calculateX: (width) => {
      return width / 2 - CONNECTOR_SIZE / 2
    },
    calculateY: (height) => {
      return height - CONNECTOR_SIZE
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }
      const newH = height + coord[1]
      if (newH >= minH && axis != AXIS_X) {
        if (limitation.h >= y + newH) {
          setHeight(newH)
        }
      }
    },
    onEnd: onEnd
  }

  /**
   * Bottom right connector.
   */
  connectorsMap['br'] = {
    calculateX: (width) => {
      return width - 10
    },
    calculateY: (height) => {
      return height - CONNECTOR_SIZE
    },
    onStart: onStart,
    onMove: (coord) => {
      if (!isResizable) {
        return
      }

      const newW = width + coord[0]
      const newH = height + coord[1]

      if (newW >= minW && axis != AXIS_Y) {
        if (limitation.w >= x + newW) {
          setWidth(newW)
        }
      }

      if (newH >= minH && axis != AXIS_X) {
        if (limitation.h >= y + newH) {
          setHeight(newH)
        }
      }
    },
    onEnd: onEnd
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        padding: CONNECTOR_SIZE,
        borderWidth: isDisabled ? 0 : 1,
        borderStyle: 'solid',
        borderColor: '#604099'
      }}>
      <TouchableWithoutFeedback>
        <View
          style={{
            width: '100%',
            height: '100%'
          }}>
          {children}
        </View>
      </TouchableWithoutFeedback>
      {isDisabled || removeConnectors ? null : renderConnectors(width, height)}
    </View>
  )
}

export default DragResizeBlock
