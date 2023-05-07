import {
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import actionNames from '@ecom/utils/actionNames'
import fonts from '@ecom/utils/fonts'
import strings from '@ecom/utils/strings'
import { useDispatch } from 'react-redux'

const Banner = (props: any) => {
  const item = props?.item
  const dispatch = useDispatch()

  const navigateToScreen = () => {
    dispatch({
      type: actionNames.HOME_REDUCER,
      payload: {
        componentClicked: 'Banner'
      }
    })
    if (item?.cta.startsWith(strings.scheme)) {
      if (item?.icid) {
        dispatch({
          type: actionNames.MISC_INFO,
          payload: {
            icid: item?.icid
          }
        })
      }
      Linking.openURL(item?.cta)
    } else {
      console.log('*** No Deeplink')
    }
  }

  return (
    <>
      {item?.image && (
        <TouchableOpacity
          style={{}}
          key={props?.content?.index}
          activeOpacity={0.95}
          disabled={false}
          onPress={() => navigateToScreen()}>
          <View>
            <DropShadow style={[styles.bannerImageContainer]}>
              <ImageBackground
                style={styles.imagesBackground}
                source={{
                  uri: item.image
                }}>
                {item?.eyebrow_text?.label?.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: vh(15),
                      backgroundColor: 'white',
                      paddingHorizontal: vw(7),
                      paddingVertical: vh(4),
                      borderRadius: vw(6)
                    }}>
                    <Text
                      style={{
                        color: item?.eyebrow_text?.fontColor,
                        fontSize: vw(item?.eyebrow_text?.fontSize),
                        textAlign: 'center',
                        fontFamily: fonts.REGULAR
                      }}>
                      {item?.eyebrow_text?.label}
                    </Text>
                  </View>
                )}
                <View style={styles.txtContainer}>
                  {item?.title?.label?.length > 0 && (
                    <Text
                      style={{
                        color: item?.title?.fontColor,
                        fontSize: vw(item?.title?.fontSize),
                        textAlign: 'center',
                        fontFamily: fonts.BOLD
                      }}>
                      {item?.title?.label}
                    </Text>
                  )}
                  {item?.sub_title?.label?.length > 0 && (
                    <Text
                      style={{
                        color: item?.sub_title?.fontColor,
                        fontSize: vw(item?.sub_title?.fontSize),
                        textAlign: 'center',
                        fontFamily: fonts.MEDIUM,
                        marginTop: vh(8)
                      }}>
                      {item?.sub_title?.label}
                    </Text>
                  )}
                </View>
              </ImageBackground>
            </DropShadow>
          </View>
        </TouchableOpacity>
      )}
    </>
  )
}

export default Banner
const styles = StyleSheet.create({
  bannerImageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginHorizontal: vw(20)
  },
  imagesBackground: {
    width: '100%',
    height: vh(230),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: vw(8),
    position: 'relative'
  },
  txtContainer: {
    padding: vw(20)
  }
})
