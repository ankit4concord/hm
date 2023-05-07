import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import { FlatList } from 'react-native-gesture-handler'
import { Icon } from '@ecom/components/icons'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

const AlbumListComponent = (props: any) => {
  const {
    albumsData,
    handleAlbumChange,
    recentData,
    totalPictures,
    updateRecent
  } = props?.route?.params
  return (
    <View style={{ padding: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: vw(30)
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.hmPurpleLightBackground,
            paddingHorizontal: vw(10),
            paddingVertical: vh(7),
            borderRadius: vw(20)
          }}
          onPress={() => props?.navigation?.goBack()}>
          <Text
            style={{
              fontFamily: fonts.BOLD,
              fontSize: vw(12)
            }}>
            Cancel
          </Text>
          <Icon
            name={'hm_CloseLarge-thick'}
            size={vw(8.5)}
            style={styles.back_icon}
          />
        </TouchableOpacity>
        <View style={{ alignSelf: 'center', flex: 0.7 }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.MEDIUM,
              fontSize: vw(16),
              color: colors.placeholderHomeScreen
            }}>
            Select Albums
          </Text>
        </View>
      </View>

      <FlatList
        data={albumsData}
        // stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <>
            <View>
              <TouchableOpacity
                onPress={() => {
                  handleAlbumChange('Recent Photos')
                  props?.navigation?.goBack()
                }}
                style={{
                  paddingVertical: vh(20),
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <Image
                  style={{
                    height: vw(80),
                    width: vw(80),
                    marginRight: vw(10),
                    borderRadius: vw(5)
                  }}
                  source={{ uri: recentData[0]?.node?.image?.uri }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: vw(16),
                      fontFamily: fonts.MEDIUM,
                      color: colors.placeholderHomeScreen
                    }}>
                    Recent
                  </Text>
                  <Text
                    style={{
                      fontSize: vw(14),
                      fontFamily: fonts.MEDIUM,
                      marginTop: vw(5),
                      color: colors.lightgray
                    }}>
                    {totalPictures}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                paddingBottom: vh(10),
                borderColor: colors.graylight
              }}>
              <Text
                style={{
                  fontFamily: fonts.MEDIUM,
                  color: colors.placeholderHomeScreen,
                  fontSize: vw(16)
                }}>
                My Albums
              </Text>
            </View>
          </>
        )}
        renderItem={(item: any) =>
          item.item ? (
            <TouchableOpacity
              onPress={() => {
                handleAlbumChange(item?.item?.label)
                props?.navigation?.goBack()
              }}
              style={{
                paddingVertical: vh(20),
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <Image
                style={{
                  height: vw(80),
                  width: vw(80),
                  marginRight: vw(10),
                  borderRadius: vw(5)
                }}
                source={{ uri: item?.item?.uri }}
              />
              <View>
                <Text style={{ fontSize: vw(15), fontFamily: fonts.MEDIUM }}>
                  {item?.item?.label}
                </Text>
                <Text
                  style={{
                    fontSize: vw(12),
                    fontFamily: fonts.REGULAR,
                    marginTop: vw(5)
                  }}>
                  {item?.item?.count}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null
        }></FlatList>
    </View>
  )
}

export default AlbumListComponent
const styles = StyleSheet.create({
  back_icon: {
    marginLeft: vw(4)
  }
})
