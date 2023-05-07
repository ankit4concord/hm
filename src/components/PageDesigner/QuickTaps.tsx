import { FlatList, Image, Linking, StyleSheet, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import { Text } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import strings from '@ecom/utils/strings'
import { useDispatch } from 'react-redux'

const Tap = (props: any) => {
  const { item, dispatch } = props
  const navigateToScreen = () => {
    dispatch({
      type: actionNames.HOME_REDUCER,
      payload: {
        componentClicked: 'QuickTaps'
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
      {item?.title && item?.image ? (
        <TouchableOpacity
          style={styles.quickTapContainer}
          onPress={() => navigateToScreen()}>
          <DropShadow style={styles.quickTapImgContainer}>
            <Image source={{ uri: item?.image }} style={styles.quickTapImg} />
          </DropShadow>
          <Text style={styles.quickTapTxt}>{item?.title}</Text>
        </TouchableOpacity>
      ) : null}
    </>
  )
}
const QuickTaps = (props: any) => {
  const { item } = props
  const dispatch = useDispatch()

  return (
    <View>
      {item?.carrouselTitle?.length > 0 ? (
        <Text style={styles.quickTapTitle}>{item?.carrouselTitle}</Text>
      ) : null}
      <FlatList
        data={item.tiles}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Tap {...props} item={item} dispatch={dispatch} />
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  )
}

export default QuickTaps
const styles = StyleSheet.create({
  quickTapImg: {
    height: vw(70),
    width: vw(70),
    resizeMode: 'contain',
    borderColor: colors.white,
    borderWidth: vh(3),
    borderRadius: vw(35)
  },
  quickTapContainer: {
    marginRight: vh(15),
    maxWidth: vw(80),
    alignItems: 'center'
  },
  quickTapImgContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  quickTapTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(14),
    letterSpacing: vw(-0.03),
    color: colors.grayTxt,
    marginTop: vh(10),
    textAlign: 'center'
  },
  quickTapTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    letterSpacing: vw(-0.02),
    marginBottom: vh(15),
    marginHorizontal: vw(20),
    textTransform: 'capitalize'
  }
})
