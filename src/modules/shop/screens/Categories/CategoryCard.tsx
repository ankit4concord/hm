import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { Image } from 'react-native-elements/dist/image/Image'
import React from 'react'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { isEmpty } from 'lodash'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { useDispatch } from 'react-redux'

interface Props {
  navigation: any
  image: any
  name: any
  id: any
  subCategories: any
  c_imageUrls: any
}

export function CategoryCard(props: Props) {
  const dispatch = useDispatch()

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        if (!isEmpty(props?.subCategories)) {
          navigate(screenNames.SHOP_NAVIGATOR, {
            screen: screenNames.CLP_SCREEN,
            params: { from: 'shop', ...props }
          })
        } else {
          navigate(screenNames.SHOP_NAVIGATOR, {
            screen: screenNames.PLP,
            params: props
          })
        }
        dispatch({
          type: actionNames.MISC_INFO,
          payload: {
            navigationType: 'cat_nav',
            searchGrouping: undefined,
            siteSection: 'browse'
          }
        })
      }}>
      <View style={{ flex: 0.45 }}>
        <Image
          source={{ uri: props?.c_imageUrls?.medium }}
          style={styles.image}
        />
      </View>
      <View style={styles.categoryNameContainer}>
        <Text style={styles.categoryName}>{props.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.cardBackground,
    flexDirection: 'row',
    paddingVertical: vh(24),
    paddingHorizontal: vw(16),
    marginBottom: vh(16),
    flex: 1,
    borderRadius: vw(8)
  },
  categoryName: {
    textTransform: 'capitalize',
    fontSize: vw(22),
    letterSpacing: vw(0.8),
    lineHeight: vh(26.4),
    fontFamily: fonts.BOLD,
    fontWeight: '500'
  },
  categoryNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: vw(24),
    flexWrap: 'wrap',
    flex: 0.55
  },
  image: {
    height: vh(114),
    width: '100%',
    resizeMode: 'contain'
  }
})
