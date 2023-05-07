import {
  FlatList,
  Image,
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

const ProductCarousel = (props: any) => {
  const item = props?.item
  const dispatch = useDispatch()
  const renderItem = ({ item }: { item: any }) => {
    return (
      <>
        {item?.product_id && (
          <TouchableOpacity
            style={{ marginRight: vw(15) }}
            onPress={() => {
              dispatch({
                type: actionNames.HOME_REDUCER,
                payload: {
                  componentClicked: 'ProductCarousel'
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
              {item?.orientation.toLowerCase() == 'vertical' ? (
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
    <>
      {item?.tiles?.length > 0 && (
        <View>
          {item?.title && (
            <Text style={styles.carouselTitle}>{item?.title}</Text>
          )}
          <FlatList
            data={item?.tiles}
            horizontal={true}
            contentContainerStyle={{
              paddingHorizontal: 20,
              alignItems: 'center'
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
        </View>
      )}
    </>
  )
}

export default ProductCarousel
const styles = StyleSheet.create({
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
    marginHorizontal: vw(20),
    textTransform: 'capitalize'
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
