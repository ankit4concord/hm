import { StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from './icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import Icon from './Icon'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'
import { useSelector } from 'react-redux'

const HomePageSearchBar = (props: any) => {
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  return (
    <DropShadow style={styles.searchBarShadow}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate(screenNames.SEARCH_SCREEN, {
            params: { from: props?.from }
          })
        }}>
        <View style={styles.searchContainer}>
          <Text style={styles.placeholderTxt}>
            {appConfigValues?.screen_content?.homepage?.home_search_placeholder}
          </Text>
          <CircleIcon
            name={'hm_Search-thick'}
            circleColor={colors.hmPurple}
            circleSize={vw(36)}
            iconSize={vw(12)}
            iconColor={colors.white}
          />
        </View>
      </TouchableOpacity>
    </DropShadow>
  )
}
export default HomePageSearchBar

const styles = StyleSheet.create({
  searchBarShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: vw(20)
  },
  searchContainer: {
    borderWidth: vw(2),
    borderRadius: vw(40),
    backgroundColor: colors.white,
    borderColor: colors.borderSearchBar,
    paddingVertical: vh(10),
    paddingLeft: vw(20),
    paddingRight: vw(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  placeholderTxt: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    color: colors.placeholderHomeScreen
  }
})
