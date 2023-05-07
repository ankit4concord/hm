import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import Image from 'react-native-image-progress'
import React from 'react'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getPDPdetails } from '../../action'
import localImages from '@ecom/utils/localImages'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { useDispatch } from 'react-redux'

const PLPProductTile = (props: any) => {
  const { item, index } = props
  const dispatch = useDispatch()
  return (
    <>
      <DropShadow
        style={[
          styles.images,
          {
            marginHorizontal: vw(10)
          },
          index % 2 != 0 ? { marginRight: 0 } : { marginLeft: 0 }
        ]}>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            dispatch(getPDPdetails(item.sku))
            navigate(screenNames.SHOP_NAVIGATOR, {
              screen: screenNames.PDP_SCREEN,
              params: {
                from: 'search',
                product: {
                  item: {
                    id: item.sku
                  }
                }
              }
            })
          }}>
          <Image
            imageStyle={{ resizeMode: 'contain' }}
            style={[
              item?.orientation?.toLowerCase() === 'vertical'
                ? {
                    maxWidth: '100%',
                    width: '100%',
                    aspectRatio: 1,
                    backgroundColor: 'transparent'
                  }
                : {
                    width: '100%',
                    aspectRatio: 1
                  }
            ]}
            indicator={() => (
              <Image
                imageStyle={{
                  resizemode: 'contain',
                  alignSelf: 'center',
                  width: vw(30),
                  height: vw(30)
                }}
                source={localImages.inAppLoaderPreview}
                style={{}}
              />
            )}
            source={{
              uri: item?.image
            }}
          />
        </TouchableOpacity>
      </DropShadow>
    </>
  )
}

export default PLPProductTile
const styles = StyleSheet.create({
  images: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
    marginBottom: vh(30),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
  }
})
