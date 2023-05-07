import { FlatList, Image, Linking, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import actionNames from '@ecom/utils/actionNames'
import appConfigValues from '@ecom/utils/appConfigValues.json'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import strings from '@ecom/utils/strings'
import { useDispatch } from 'react-redux'

const CategoryCarousel = (props: any) => {
  const dispatch = useDispatch()
  const item = props.item
  const renderItem = ({ item }: { item: any; index: any }) => {
    return (
      <>
        {item?.product_id && (
          <TouchableOpacity
            style={{ marginRight: vw(15) }}
            onPress={() => {
              dispatch({
                type: actionNames.HOME_REDUCER,
                payload: {
                  componentClicked: 'CategoryCarousel'
                }
              })
              if (item?.icid) {
                dispatch({
                  type: actionNames.MISC_INFO,
                  payload: {
                    icid: item?.icid
                  }
                })
              }
              Linking.openURL(`${strings.scheme}product/${item.product_id}`)
            }}>
            <DropShadow style={styles.images}>
              {item?.orientation?.toLowerCase() == 'vertical' ? (
                <Image
                  style={styles.carouselImagesVertical}
                  source={{
                    uri: item.product_image
                  }}
                />
              ) : (
                <Image
                  style={styles.carouselImagesHorizontal}
                  source={{
                    uri: item.product_image
                  }}
                />
              )}
            </DropShadow>
          </TouchableOpacity>
        )}
      </>
    )
  }
  return (
    <View>
      <View style={styles.carouselContainer}>
        {item?.title && <Text style={styles.carouselTitle}>{item?.title}</Text>}
        {item?.All && (
          <TouchableOpacity
            onPress={() => {
              dispatch({
                type: actionNames.HOME_REDUCER,
                payload: {
                  componentClicked: 'CategoryCarousel'
                }
              })
              navigate(screenNames.SHOP_NAVIGATOR, {
                screen: screenNames.PLP,
                params: { from: 'home', id: item?.categoryId, categoryLabel: item?.categoryLabel }
              })
            }}>
            <Text style={styles.carouselTitleAll}>
              {appConfigValues?.screen_content?.homepage.all_text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={item?.tiles}
        contentContainerStyle={{
          paddingHorizontal: vw(20),
          alignItems: 'center'
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  )
}

export default CategoryCarousel
const styles = StyleSheet.create({
  carouselContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: vw(20)
  },
  images: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  carouselTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    letterSpacing: vw(-0.02),
    marginBottom: vh(5),
    textTransform: 'capitalize'
  },
  carouselTitleAll: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    color: colors.grayTxt,
    marginBottom: vh(5)
  },
  carouselImagesVertical: {
    resizeMode: 'contain',
    width: vw(120),
    height: vh(175)
  },
  carouselImagesHorizontal: {
    resizeMode: 'contain',
    height: vh(127),
    maxHeight: vh(175),
    width: vw(183)
  }
})
