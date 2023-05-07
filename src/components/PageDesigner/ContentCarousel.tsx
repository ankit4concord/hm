import {
  FlatList,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import actionNames from '@ecom/utils/actionNames'
import fonts from '@ecom/utils/fonts'
import strings from '@ecom/utils/strings'
import { useDispatch } from 'react-redux'

const RenderItem = (props: any) => {
  const { item, dispatch } = props
  const navigateToScreen = () => {
    dispatch({
      type: actionNames.HOME_REDUCER,
      payload: {
        componentClicked: 'ContentCarousel'
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
        <TouchableOpacity onPress={() => navigateToScreen()}>
          <DropShadow style={[styles.images]}>
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
                {item?.title?.label && (
                  <Text
                    style={{
                      color: item.title.fontColor,
                      fontSize: vw(item.title.fontSize),
                      textAlign: 'center',
                      fontFamily: fonts.BOLD
                    }}>
                    {item.title.label}
                  </Text>
                )}
                {item?.sub_title?.label && (
                  <Text
                    style={{
                      color: item.sub_title.fontColor,
                      fontSize: vw(item.sub_title.fontSize),
                      textAlign: 'center',
                      fontFamily: fonts.MEDIUM,
                      marginTop: vh(8)
                    }}>
                    {item.sub_title.label}
                  </Text>
                )}
              </View>
            </ImageBackground>
          </DropShadow>
        </TouchableOpacity>
      )}
    </>
  )
}
const ContentCarousel = (props: any) => {
  const item = props?.item
  const dispatch = useDispatch()
  return (
    <>
      {item?.tiles?.length > 0 && (
        <View>
          <View style={styles.carouselContainer}>
            {item?.carrouselTitle && (
              <Text style={styles.carouselTitle}>{item?.carrouselTitle}</Text>
            )}
          </View>
          <FlatList
            data={item?.tiles}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <RenderItem {...props} item={item} dispatch={dispatch} />
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>
      )}
    </>
  )
}

export default ContentCarousel
const styles = StyleSheet.create({
  images: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginRight: vw(20)
  },
  imagesBackground: {
    width: vw(287),
    height: vw(160),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  carouselContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: vw(20)
  },
  carouselTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    letterSpacing: vw(-0.02),
    marginBottom: vh(5),
    textTransform: 'capitalize'
  },

  txtContainer: {
    padding: vw(20)
  }
})
