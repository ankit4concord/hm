import { Linking, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import Icon from '@ecom/components/Icon'
import LinearGradient from 'react-native-linear-gradient'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import strings from '@ecom/utils/strings'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const CategoryHeader = (props: any) => {
  const dispatch = useDispatch()
  const { clpPageDesignerData } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )

  let notificationChipData = clpPageDesignerData?.filter(
    (data) => data.type === 'quick_pills'
  )
  if (notificationChipData && notificationChipData[0]?.data?.tiles?.length)
    notificationChipData = notificationChipData[0]?.data?.tiles
  return (
    <View style={styles.container}>
      <View style={styles.filterChipContainer}>
        <ScrollView
          horizontal={true}
          style={{ flexDirection: 'row' }}
          showsHorizontalScrollIndicator={false}>
          {notificationChipData?.map((notification) => {
            const navigateToScreen = () => {
              dispatch({
                type: actionNames.HOME_REDUCER,
                payload: {
                  componentClicked: 'QuickPills'
                }
              })
              if (notification?.cta?.startsWith(strings.scheme)) {
                Linking.openURL(notification?.cta)
              } else {
                console.log('*** No Deeplink')
              }
            }
            return (
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => navigateToScreen()}>
                <Text style={styles.filterChipTxt}>{notification.header} </Text>
                <Text style={styles.filterChipDate}>
                  {notification.subtitle}{' '}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      <LinearGradient
        style={{
          position: 'absolute',
          bottom: 0,
          width: vw(100),
          height: vh(37),
          right: vw(34)
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          'rgba(248, 245, 252, 0.05)',
          'rgba(248, 245, 252, 0.1)',
          'rgba(248, 245, 252, 0.4)',
          'rgba(248, 245, 252, 0.6)',
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 1)'
        ]}
        pointerEvents={'none'}
      />
      <View style={styles.icons}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              navigate(screenNames.SEARCH_SCREEN, {
                params: { from: props?.from }
              })
            }}>
            <CircleIcon
              name={'hm_Search-thick'}
              circleColor={colors.hmPurple}
              circleSize={vw(36)}
              iconSize={vw(12)}
              iconColor={colors.white}
            />
            {/* <Icon name={localImages.search_icon} style={styles.search_icon} /> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CategoryHeader
const styles = StyleSheet.create({
  container: {
    marginTop: vh(50),
    marginBottom: vh(34),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: vw(20)
  },
  icons: {
    alignItems: 'flex-end',
    display: 'flex',
    flex: 0.1
  },

  iconContainer: {
    flexDirection: 'row'
  },

  search_icon: {
    width: vw(36),
    height: vh(36),
    resizeMode: 'contain'
  },

  filterChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.pillsBorderColor,
    borderRadius: vw(20),
    paddingVertical: vh(13),
    paddingRight: vw(5),
    paddingLeft: vw(12),
    marginRight: vw(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterChipTxt: {
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM,
    marginRight: vw(5)
  },

  filterChipDate: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    color: colors.pillsDateColor,
    fontVariant: ['lining-nums']
  },
  filterChipContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0.9
  }
})
