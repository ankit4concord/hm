import * as navigationRef from '@ecom/utils/navigationService'

import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import {
  getProductSearchResults,
  productSuggestions
} from '@ecom/modules/shop/action'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from './icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import Icon from './Icon'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { isEmpty } from 'lodash'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'
import { useDispatch } from 'react-redux'
import { useRoute } from '@react-navigation/native'

function CustomSearchBar(props: any) {
  const route = useRoute()
  const dispatch = useDispatch()
  const [focus, setFocus] = useState(false)
  const [query, setQuery] = useState('')
  const handleQuery = (text: string) => {
    setQuery(text)
    if (text && text.length > 2) {
      dispatch(productSuggestions(text))
    }
    dispatch({
      type: actionNames.SEARCH_SUGGESTIONS,
      payload: {
        query: text
      }
    })
  }

  const handleSearch = () => {
    if (!isEmpty(query)) {
      dispatch(getProductSearchResults(query))
      props?.list
        ? navigationRef.navigate(screenNames.SEARCH_LIST_RESULT_SCREEN, {
            params: { from: props?.from, ...props }
          })
        : navigationRef.navigate(screenNames.SEARCH_RESULT_SCREEN, {
            name: query,
            title: query
          })
    }
  }

  return (
    <DropShadow style={styles.searchBarShadow}>
      <View style={styles.searchContainer}>
        <TextInput
          ref={props.forwadedRef}
          placeholderTextColor={colors.placeholderHomeScreen}
          onFocus={() => {
            setFocus(true)
            if (route.name !== 'Search Screen') {
              navigationRef.navigate(screenNames.SEARCH_SCREEN, {
                params: { from: props?.from }
              })
            }
          }}
          keyboardType="default"
          returnKeyType="search"
          placeholder={'Search by occasion'}
          onChangeText={(text) => handleQuery(text)}
          value={query}
          maxLength={150}
          style={styles.searchbarPlaceHolder}
          onSubmitEditing={() => handleSearch()}
        />

        {isEmpty(query) ? (
          <CircleIcon
            name={'hm_Search-thick'}
            circleColor={colors.iconBackground}
            circleSize={vw(36)}
            iconSize={vw(12)}
            iconColor={colors.black}
          />
        ) : (
          <TouchableOpacity onPress={() => handleSearch()}>
            <CircleIcon
              name={'hm_Search-thick'}
              circleColor={colors.hmPurple}
              circleSize={vw(36)}
              iconSize={vw(12)}
              iconColor={colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
    </DropShadow>
  )
}
export default CustomSearchBar

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textinput: {
    height: vh(60),
    borderWidth: vw(2),
    flex: 1,
    borderRadius: vw(30),
    backgroundColor: colors.white,
    borderColor: colors.borderSearchBar
  },
  searchBarShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.15,
    shadowRadius: 10
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

  searchbarPlaceHolder: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    width: '85%',
    height: vh(40)
  }
})
