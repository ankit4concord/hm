import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import appConfigValues from '@ecom/utils/appConfigValues.json'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'

const CategoryTile = (props: any) => {
  const { item, index } = props
  return (
    <DropShadow
      style={[
        styles.images,
        { margin: vw(10) },
        index % 2 != 0 ? { marginRight: 0 } : { marginLeft: 0 }
      ]}>
      <TouchableOpacity
        onPress={() => {
          navigate(screenNames.SHOP_NAVIGATOR, {
            screen: screenNames.PLP,
            params: { from: 'redirect', ...item }
          })
        }}>
        <ImageBackground
          imageStyle={{ borderRadius: 8 }}
          style={{
            width: '100%',
            aspectRatio: 1
          }}
          source={{ uri: item?.image }}>
          <Text style={styles.title}>{item?.categoryLabel}</Text>
          <View style={styles.txtContainer}>
            <Text style={styles.cardsCount}>{item?.cardCount}</Text>
            <Text style={styles.cardsTxt}>
              {appConfigValues?.screen_content?.clp.cards_text}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </DropShadow>
  )
}

export default CategoryTile
const styles = StyleSheet.create({
  images: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5
  },
  title: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    color: colors.white,
    marginTop: vh(17),
    marginLeft: vw(18)
  },
  txtContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: 0
  },
  cardsCount: {
    fontSize: vw(10),
    fontFamily: fonts.REGULAR,
    color: colors.white,
    marginLeft: vw(13),
    fontVariant: ['lining-nums']
  },
  cardsTxt: {
    fontSize: vw(10),
    fontFamily: fonts.REGULAR,
    color: colors.white,
    marginLeft: vw(2)
  }
})
