import { Animated, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import { Tip } from '@ecom/assets/svg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const ToolTip = (props) => {
  const visible = false
  const viewAnimation = useRef(null)
  // const [progress, setProgress] = useState(10)
  const [timer, setTimer] = useState(10)

  useEffect(() => {
    setTimeout(() => {
      if (timer < 100) {
        setTimer(timer + 10)
      }
    }, 1000)
  }, [timer])

  useEffect(() => {
    const Animation = async () => {
      if (visible) {
        // setShowView(true);
        // if (viewAnimation?.current) await viewAnimation?.current?.bounceIn(3400);
      } else {
        // if (viewAnimation?.current) await viewAnimation?.current?.bounceOut(3400);
        // setShowView(false);
      }
    }
    Animation()
  }, [visible, viewAnimation, props])

  return (
    <Animated.View
      style={[
        { zIndex: 9999999, margin: vw(40) },
        props?.from !== 'top' ? styles({}).box2 : styles({}).box
      ]}
      ref={viewAnimation}>
      {props?.type !== 'exceedPage' && (
        <>
          <View
            style={
              props?.from !== 'top'
                ? styles({}).triangleUp
                : styles({}).triangle
            }
          />
          <View
            style={
              props?.from !== 'top'
                ? styles({}).triangleDown
                : styles({}).triangle2
            }
          />
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={{ flex: 0.2}}>
          <Tip width={vw(40)} height={vw(40)} />
        </View>
        <View style={{ flex: 0.7, paddingRight: vw(30) }}>
          <Text
            style={{
              fontFamily: fonts.MEDIUM,
              fontSize: vw(14),
              lineHeight: vh(18),
              marginBottom: vh(4)
            }}>
            Design tip:
          </Text>
          <Text
            style={{
              fontFamily: fonts.REGULAR,
              fontSize: vw(14),
              lineHeight: vh(18)
            }}>
            {props?.message}
          </Text>
        </View>
        <View
          style={{
            flex: 0.1,
            resizeMode: 'contain',
            alignSelf: 'flex-start',
            paddingRight: vw(5)
          }}>
          <AnimatedCircularProgress
            size={vw(40)}
            width={vw(2)}
            resizeMode={'contain'}
            fill={timer}
            tintColor="#CE3B8C"
            backgroundColor="#0000001a"
            rotation={0}
            lineCap="round">
            {() => (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    props?.type === 'tooSmallToRead'
                      ? props?.setMaxLimitTextToolbar(false)
                      : props?.setShowBoxExceedToolbar(false)
                  }>
                  <CircleIcon
                    name={'hm_CloseLarge-thick'}
                    circleColor={colors.white}
                    circleSize={vw(36)}
                    iconSize={vw(11)}
                    circleStyle={{
                      borderWidth: 1,
                      borderColor: colors.graylight
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
        {/* <Icon name={'information-outline'} size={20} /> */}
        {/* <Text style={styles(props?.from).message}>{props?.message}</Text> */}
        {/* <Icon
          name={'close'}
          size={14}
          style={{ paddingBottom: props.from === 'home' ? 32 : 24 }}
        /> */}
      </View>
      {/* {props.from === "home"&&<View style={{backgroundColor:"#FFB600",width:8,height:8,borderRadius:8,bottom:vh(-20),right:28,position:"absolute"}}></View>} */}
    </Animated.View>
  )
}

export default ToolTip

const styles = (props) =>
  StyleSheet.create({
    box: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 4,
      backgroundColor: colors.white,
      position: 'absolute',
      right: -40,
      left: -40,
      borderColor: colors.white,
      borderRadius: vw(10),
      padding: vw(20),
      zIndex: 999999
    },
    triangle: {
      width: 10,
      height: 10,
      position: 'absolute',
      top: -10,
      right: '55%',
      borderLeftWidth: vw(10),
      borderLeftColor: 'transparent',
      borderRightWidth: vw(10),
      borderRightColor: 'transparent',
      borderBottomWidth: vw(10),
      borderBottomColor: colors.white
    },
    triangle2: {
      width: 10,
      height: 10,
      position: 'absolute',
      top: -10,
      right: '55%',
      borderLeftWidth: vw(9),
      borderLeftColor: 'transparent',
      borderRightWidth: vw(9),
      borderRightColor: 'transparent',
      borderBottomWidth: vw(9),
      borderBottomColor: colors.white
    },
    message: {
      maxWidth: props === 'home' ? vw(285) : vw(160),
      paddingHorizontal: 8,
      fontFamily: fonts.REGULAR,
      fontSize: vw(14),
      fontWeight: '400',
      lineHeight: vh(18),
      color: colors.appBlack
    },

    triangleDown: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 4,
      width: vw(16),
      height: vh(16),
      position: 'absolute',
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: vw(16),
      borderRightWidth: vw(16),
      borderBottomWidth: 0,
      borderLeftWidth: vw(16),
      borderTopColor: colors.white,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      bottom: vh(-16),
      right: '50%'
    },
    triangleUp: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 4,
      width: vw(16),
      height: vh(16),
      bottom: -10,
      right: '50%',
      position: 'absolute',
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderRightWidth: vw(16),
      borderBottomWidth: vw(16),
      borderLeftWidth: vw(16),
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderLeftColor: 'transparent'
    },
    box2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 4,
      backgroundColor: colors.white,
      position: 'absolute',
      right: -40,
      left: -40,
      borderColor: colors.white,
      borderRadius: vw(10),
      padding: vw(20)
    }
  })
