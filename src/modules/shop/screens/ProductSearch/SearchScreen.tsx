import * as navigationRef from '@ecom/utils/navigationService'

import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//Custom Imports
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import CustomSearchBar from '@ecom/components/SearchBar'
import Icon from '@ecom/components/Icon'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import appConfigValues from '@ecom/utils/appConfigValues.json'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { getProductSearchResults } from '@ecom/modules/shop/action'
import { isEmpty } from 'lodash'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'

interface Props {
  navigation: any
  from: string
}

export function SearchScreen(props: Props) {
  const searchRef = useRef(null)
  const dispatch = useDispatch()
  const { searchSuggestions, query } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )

  const handleRedirection = async (query: any, title: any) => {
    dispatch(getProductSearchResults(query))
    navigationRef.navigate(screenNames.SEARCH_RESULT_SCREEN, {
      name: query,
      title
    })
    // dispatch(
    //   getCategoryRedirect(query?.toLowerCase(), (res: any) => {
    //     if (res) {
    //       if (res?.status === 'fail') {
    //         dispatch(getProductSearchResults(query))
    //         props?.list
    //           ? navigationRef.navigate(screenNames.SEARCH_LIST_RESULT_SCREEN, {
    //               params: { from: props?.from, ...props },
    //             })
    //           : navigationRef.navigate(screenNames.SEARCH_RESULT_SCREEN, {
    //               name: query,
    //             })
    //       } else if (res?.status === 'success') {
    //         if (res?.redirection == 'CLP') {
    //           if (!isEmpty(res?.categoryObj?.subCategories)) {
    //             props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
    //               screen: screenNames.CLP_SCREEN,
    //               params: { from: 'search', ...res?.categoryObj },
    //             })
    //           } else {
    //             dispatch(getProductSearchResults(query))
    //             props?.list
    //               ? navigationRef.navigate(
    //                   screenNames.SEARCH_LIST_RESULT_SCREEN,
    //                   {
    //                     params: { from: props?.from, ...props },
    //                   }
    //                 )
    //               : navigationRef.navigate(screenNames.SEARCH_RESULT_SCREEN, {
    //                   name: query,
    //                 })
    //           }
    //         }
    //         if (res?.redirection == 'PLP') {
    //           navigationRef.navigate(screenNames.SHOP_NAVIGATOR, {
    //             screen: screenNames.PLP,
    //             params: { from: 'search', ...res.categoryObj },
    //           })
    //         }
    //         if (res?.redirection == 'PLP1') {
    //           navigationRef.navigate(screenNames.SHOP_NAVIGATOR, {
    //             screen: screenNames.PLP,
    //             params: {
    //               from: 'search',
    //               ...res.parentCategoryObj,
    //               selectedItem: { ...res.categoryObj },
    //             },
    //           })
    //         }
    //         if (res?.redirection == 'PLPRedirect') {
    //           navigationRef.navigate(screenNames.SHOP_NAVIGATOR, {
    //             screen: screenNames.PLP,
    //             params: { from: 'redirect', ...res.categoryObj },
    //           })
    //         }
    //       } else {
    //         navigationRef.navigate(screenNames.SHOP_NAVIGATOR, {
    //           screen: screenNames.PLP,
    //           params: {
    //             from: 'search',
    //             ...{
    //               id: query?.toLowerCase(),
    //               name: query?.toLowerCase(),
    //               subCategories: [],
    //             },
    //           },
    //         })
    //       }
    //     } else {
    //       navigationRef.navigate(screenNames.SHOP_NAVIGATOR, {
    //         screen: screenNames.PLP,
    //         params: {
    //           from: 'search',
    //           ...{
    //             id: query?.toLowerCase(),
    //             name: query?.toLowerCase(),
    //             subCategories: [],
    //           },
    //         },
    //       })
    //     }
    //   })
    // )
  }

  //render trending,recent searches
  const RenderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.searchTypeAheadContent}
        activeOpacity={0.7}
        onPress={() => {
          handleRedirection(
            item?.hasOwnProperty('q') ? item?.q : item,
            item?.hasOwnProperty('dq') ? item?.dq : item
          )
        }}>
        <Text style={styles.searchTypeAheadContentTxt}>{item?.dq}</Text>
        {/* <Icon name={localImages.right_arrow} style={styles.arrowIcon} /> */}
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setTimeout(() => {
        ClearSuggestions()
      }, 200)
    })
    return unsubscribe
  }, [props.navigation])

  //clear suggestions
  const ClearSuggestions = () => {
    dispatch({
      type: actionNames.SEARCH_SUGGESTIONS,
      payload: {
        searchSuggestions: [],
        query: ''
      }
    })
    dispatch({
      type: actionNames.PRODUCT_SEARCH_RESULTS,
      payload: {
        searchResults: []
      }
    })
    dispatch({
      type: actionNames.PRODUCT_SEARCH_RESULTS_COUNT,
      payload: {
        searchResultsCount: 0
      }
    })
    dispatch({
      type: actionNames.ACTIVE_SEARCH_FILTERS,
      payload: {
        searchResultActiveFilters: [],
        searchResultTempFilters: []
      }
    })
  }

  //clear query on blur
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      dispatch({
        type: actionNames.SEARCH_SUGGESTIONS,
        payload: {
          query: ''
        }
      })
    })
    return unsubscribe
  }, [props.navigation])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      searchRef?.current?.focus()
    })
    return unsubscribe
  }, [props.navigation])

  return (
    <TouchableWithoutFeedback accessible={false}>
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: vh(14)
          }}>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 16, right: 8 }}
            style={{
              paddingRight: vw(24),
              paddingLeft: vw(2)
            }}
            onPress={() => {
              props.navigation.goBack()
              // if (!isEmpty(searchTerm)) handleRedirection(searchTerm)
              // ClearSuggestions();
              dispatch({
                type: actionNames.SEARCH_SUGGESTIONS,
                payload: {
                  searchSuggestions: [],
                  query: ''
                }
              })
            }}>
            <CircleIcon
              name={'hm_CloseLarge-thick'}
              circleColor={colors.white}
              circleSize={vw(36)}
              iconSize={vw(11)}
              circleStyle={{
                borderWidth: 1,
                borderColor: colors.graylight
              }}
            />
          </TouchableOpacity>
          <Text style={styles.titleTxt}>
            {appConfigValues?.screen_content?.search?.search_page_title}
          </Text>
        </View>
        <CustomSearchBar
          forwadedRef={searchRef}
          navigation={props.navigation}
        />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          onScroll={() => Keyboard.dismiss()}>
          {!isEmpty(searchSuggestions) &&
            !isEmpty(query) &&
            query?.length >= 3 && (
              <View style={{ paddingTop: vh(24) }}>
                <View style={styles.searchTypeAheadHeaderContainer}>
                  <Text style={styles.searchTypeAheadHeader}>
                    {
                      appConfigValues?.screen_content?.search
                        ?.search_page_loading_text
                    }
                  </Text>
                </View>
                <FlatList
                  keyboardShouldPersistTaps={'always'}
                  data={searchSuggestions?.slice(0, 3)}
                  renderItem={({ item }) => (
                    <>
                      <RenderItem item={item} type="popular" />
                    </>
                  )}
                  keyExtractor={(index) => index.toString()}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: vw(20),
    backgroundColor: colors.graybackground,
    marginTop: vh(50)
  },
  listContainer: {
    flexDirection: 'row',
    marginTop: vw(24),
    flex: 1,
    width: '100%',
    justifyContent: 'space-between'
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: vw(14),
    lineHeight: vw(16.8),
    fontWeight: '400',
    fontFamily: fonts.REGULAR
  },
  Title: {
    fontSize: vw(17),
    lineHeight: vw(20.4),
    fontWeight: '500',
    fontFamily: fonts.MEDIUM
  },
  triangleUp: {
    width: vw(10),
    height: vh(10),
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: vw(10),
    borderBottomWidth: vw(10),
    borderLeftWidth: vw(10),
    borderBottomColor: 'white',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent'
  },
  categoryTitle: {
    fontWeight: '700',
    fontFamily: fonts.MEDIUM,
    fontSize: vw(15)
  },
  titleTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  searchTypeAheadContainer: {},
  searchTypeAheadHeader: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(14),
    color: colors.placeHolderTxt
  },
  searchTypeAheadContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vh(20),
    borderBottomColor: colors.graylight,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  searchTypeAheadContentTxt: {
    textTransform: 'capitalize',
    fontSize: vw(16),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(19),
    letterSpacing: vw(-0.03),
    color: 'black'
  },
  arrowIcon: {
    width: vw(5),
    height: vh(10),
    resizeMode: 'contain',
    marginRight: vw(5)
  },
  searchTypeAheadHeaderContainer: {
    paddingBottom: vh(6),
    borderBottomColor: colors.graylight,
    borderBottomWidth: 1
  }
})
