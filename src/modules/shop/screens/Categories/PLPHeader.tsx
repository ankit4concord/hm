import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import Icon from '@ecom/components/Icon'
import LinearGradient from 'react-native-linear-gradient'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import { addFilters } from '../../action'
import appConfigValues from '@ecom/utils/appConfigValues.json'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'

const PLPHeader = (props: any) => {
  const { productlist, productsCount, activeFilters, maxPrice, minPrice } =
    useSelector((state: RootReducerModal) => state.categoryReducer)
  const dispatch = useDispatch()
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => {
            if (props?.route?.params?.from === 'customization') {
              props?.navigation.reset({
                index: 0,
                routes: [{ name: screenNames.SHOP_NAVIGATOR }]
              })
            } else {
              props?.navigation?.goBack()
            }
          }}>
          <CircleIcon
            name={'hm_ArrowBack-thick'}
            circleColor={colors.white}
            circleSize={vw(36)}
            iconSize={vw(18)}
            circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
          />
        </TouchableOpacity>

        <View style={styles.details}>
          {activeFilters?.length > 0 ? (
            <ScrollView
              horizontal={true}
              style={{ flexDirection: 'row' }}
              showsHorizontalScrollIndicator={false}>
              {activeFilters.map((data) => (
                <View style={styles.filterChip}>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(
                        addFilters(data, false, 'mobile-app-categories', true)
                      )
                    }>
                    <CircleIcon
                      name={'hm_CloseLarge-thick'}
                      circleColor={colors.crossBackGreen}
                      circleSize={vw(20)}
                      iconSize={vh(6)}
                      iconColor={colors.white}
                    />
                  </TouchableOpacity>
                  <Text style={styles.filterChipTxt}>{data.label}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <>
              <Text style={styles.categoryName}>
                {props?.route?.params?.categoryLabel
                  ? props?.route?.params?.categoryLabel
                  : 'Friendship'}
              </Text>
              {productlist?.length === 0 ? (
                <Text style={styles.productCount}>
                  {appConfigValues?.screen_content?.plp?.empty_card_text}
                </Text>
              ) : productsCount &&
                productsCount <= 1 &&
                activeFilters?.length == 0 &&
                maxPrice?.length == 0 &&
                minPrice?.length == 0 ? (
                <Text style={styles.productCount}>
                  {' '}
                  {appConfigValues?.screen_content?.plp?.cards_text_capitalized}
                </Text>
              ) : (
                <Text style={styles.productCount}>
                  {productsCount}{' '}
                  {appConfigValues?.screen_content?.plp.cards_text_capitalized}
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
            top: 0,
            width: vw(50),
            height: vh(37),
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
            onPress={() => {
              props.navigation.navigate(screenNames.SEARCH_SCREEN, {
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
          <View style={styles.filter}>
            <TouchableOpacity
              onPress={() => {
                productlist?.length > 0
                  ? props.navigation.navigate(screenNames.FILTER_MODAl, {
                      propsData: props.route.params,
                      category: 'mobile-app-categories'
                      // category: subCategories[myIndex - 1]?.id,
                    })
                  : ''
              }}>
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

export default PLPHeader
const styles = StyleSheet.create({
  container: {
    marginTop: vh(53),
    paddingBottom: vh(24),
    marginHorizontal: vh(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0.9
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
  filter: {
    marginLeft: vw(10)
  },
  search_icon: { width: vw(36), height: vw(36), resizeMode: 'contain' },
  categoryName: {
    fontSize: vw(16),
    lineHeight: vh(19),
    letterSpacing: 0.03,
    fontFamily: fonts.MEDIUM
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
