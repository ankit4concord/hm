import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import Icon from '@ecom/components/Icon'
import LinearGradient from 'react-native-linear-gradient'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import { addSearchResultFilters } from '../../action'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'

const ProductSearchHeader = (props: any) => {
  const { searchResultsCount, maxPrice, minPrice, searchResultActiveFilters } =
    useSelector((state: RootReducerModal) => state.categoryReducer)
  const dispatch = useDispatch()
  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 0.9
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.pop(2)
          }}>
          <View>
            <CircleIcon
              name={'hm_ArrowBack-thick'}
              circleColor={colors.white}
              circleSize={vw(36)}
              iconSize={vw(18)}
              circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.details}>
          {searchResultActiveFilters?.length > 0 ? (
            <ScrollView
              horizontal={true}
              style={{ flexDirection: 'row', marginTop: vh(4) }}
              showsHorizontalScrollIndicator={false}>
              {searchResultActiveFilters.map((data) => (
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      addSearchResultFilters(
                        data,
                        false,
                        props?.route?.params?.name,
                        true
                      )
                    )
                  }
                  style={styles.filterChip}>
                  <CircleIcon
                    name={'hm_CloseLarge-thick'}
                    circleColor={colors.crossBackGreen}
                    circleSize={vw(20)}
                    iconSize={vh(6)}
                    iconColor={colors.white}
                  />

                  <Text style={styles.filterChipTxt}>{data.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              <Text style={styles.categoryName}>
                Results for {props?.route?.params?.title}
              </Text>
              {searchResultsCount &&
              searchResultsCount <= 1 &&
              searchResultActiveFilters?.length == 0 &&
              maxPrice?.length == 0 &&
              minPrice?.length == 0 ? (
                <Text style={styles.productCount}>Cards</Text>
              ) : (
                <Text style={styles.productCount}>
                  {searchResultsCount} Cards
                </Text>
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.icons}>
        <LinearGradient
          style={{
            position: 'absolute',
            bottom: 0,
            top: 4,
            width: vw(50),
            height: vh(32),
            right: vw(83),
            zIndex: 111
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            'rgba(248, 245, 252, 0.05)',
            'rgba(248, 245, 252, 0.1)',
            'rgba(248, 245, 252, 0.4)',
            'rgba(248, 245, 252, 0.6)',
            'rgba(248, 245, 252, 0.8)',
            'rgba(248, 245, 252, 1)'
          ]}
          pointerEvents={'none'}
        />
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.search}
            onPress={() => {
              props.navigation.navigate(screenNames.SEARCH_SCREEN, {
                params: { from: props?.from }
              })
            }}>
            {/* <Icon
              name={localImages.search_icon}
              resizeMode="contain"
              style={styles.search_icon}
            /> */}
            <CircleIcon
              name={'hm_Search-thick'}
              circleColor={colors.hmPurple}
              circleSize={vw(36)}
              iconSize={vw(12)}
              iconColor={colors.white}
            />
          </TouchableOpacity>
          <View style={styles.filter}>
            <TouchableOpacity
              disabled={searchResultsCount > 0 ? false : true}
              onPress={() => {
                props.navigation.navigate(screenNames.SEARCH_FILTER_MODAl, {
                  propsData: props.route.params,
                  category: props?.route?.params?.name,
                  name: props?.route?.params?.name
                })
              }}>
              {/* onPress={() => {
                  props.navigation.navigate(screenNames.FILTER_MODAl, {
                    propsData: props.route.params,
                    category: 'mobile-app-categories',
                    // category: subCategories[myIndex - 1]?.id,
                  })
                }}> */}
              <CircleIcon
                name={'hm_Filter-thick'}
                circleColor={colors.hmPurple}
                circleSize={vw(36)}
                iconSize={vw(12)}
                iconColor={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProductSearchHeader
const styles = StyleSheet.create({
  container: {
    marginTop: vh(53),
    marginBottom: vh(34),
    marginHorizontal: vh(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icons: {
    alignItems: 'flex-end',
    display: 'flex',
    flex: 0.3
  },
  details: {
    marginLeft: vw(14),
    flex: 1
  },
  iconContainer: {
    flexDirection: 'row'
  },
  search: {},
  filter: {
    marginLeft: vw(10)
  },
  search_icon: { width: vw(36), height: vw(36) },
  categoryName: {
    fontSize: vw(16),
    lineHeight: vh(19),
    letterSpacing: 0.03,
    fontFamily: fonts.MEDIUM,
    textTransform: 'capitalize'
  },
  productCount: {
    fontSize: vw(12),
    lineHeight: vh(14),
    letterSpacing: 0.03,
    color: colors.grayTxt,
    fontFamily: fonts.MEDIUM,
    fontVariant: ['lining-nums']
  },
  filterChip: {
    backgroundColor: colors.hmPurple,
    borderRadius: vw(20),
    paddingVertical: vh(8),
    paddingRight: vw(10),
    paddingLeft: vw(8),
    marginRight: vw(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterChipTxt: {
    color: colors.white,
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM,
    marginLeft: vw(5)
  }
})
