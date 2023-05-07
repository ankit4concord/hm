import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { screenHeight, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import InlineLoader from '@ecom/components/InlineLoader'
import Loader from '@ecom/components/Loader'
import PLPProductTile from '../Categories/PLPProductTile'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { getMoreProducts } from '../../action'

export function ProductList(props: any) {
  const dispatch = useDispatch()
  const { productlist, productsCount, productsHasMore, productsEnd } =
    useSelector((state: RootReducerModal) => state.categoryReducer)
  const { productLoading, addtocartLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { isProductLoadMore } = useSelector(
    (state: RootReducerModal) => state.globalLoadMoreReducer
  )

  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const handleLoadMore = () => {
    if (!isProductLoadMore && productsHasMore) {
      dispatch(
        getMoreProducts(
          // props.category ? props.category : props.route.params.id,
          'mobile-app-categories',
          productsEnd,
          10,
          true
        )
      )
    }
  }
  const footerComponent = () => {
    if (isProductLoadMore) {
      return <ActivityIndicator size="large" color={colors.bgLightGray} />
    } else {
      return <></>
    }
  }
  return (
    <SafeAreaView>
      {addtocartLoading && <Loader />}

      <View style={styles.listContainer}>
        {productLoading ? (
          <View
            style={{
              height: '90%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <InlineLoader />
          </View>
        ) : null}
        {!productLoading && (
          <>
            <Animated.FlatList
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                {
                  paddingTop: 10,
                  paddingBottom: vh(productlist?.length > 2 ? 150 : 264)
                },
                productlist?.length === 0 && styles.centerEmptySet
              ]}
              numColumns={2}
              data={productsCount > 0 ? productlist : []}
              disableVirtualization={false}
              showsVerticalScrollIndicator={false}
              renderItem={(item: any) => <PLPProductTile {...item} />}
              ListEmptyComponent={() => (
                <View style={styles.NoProductText}>
                  <Text>
                    {appConfigValues?.screen_content?.shop?.productlist_no_item}
                  </Text>
                </View>
              )}
              onEndReachedThreshold={0.3}
              onEndReached={handleLoadMore}
              ListFooterComponent={footerComponent}
              onScroll={props?.onScroll}
              scrollEventThrottle={16}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: vw(20)
  },
  productsCount: {
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: fonts.REGULAR,
    fontSize: vw(15),
    lineHeight: vh(18),
    color: colors.black
  },
  productCountFilter: {
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: fonts.REGULAR,
    fontSize: vw(15),
    lineHeight: vh(18),
    color: colors.black
  },
  ProductList: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  NoProductText: {
    paddingTop: screenHeight * 0.2,
    alignSelf: 'center'
  },
  activeFilterLabel: {
    fontWeight: '400',
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(16),
    color: colors.primaryBtnBackground,
    paddingRight: vw(9)
  },
  activeFilterCapsule: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingVertical: vh(6),
    paddingHorizontal: vw(16),
    marginHorizontal: vh(4),
    borderWidth: 2,
    borderColor: colors.primaryBtnBackground,
    borderRadius: vw(35)
  },
  inActiveFilterCapsule: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingVertical: vh(6),
    paddingHorizontal: vw(16),
    marginHorizontal: vw(4),
    borderWidth: 2,
    borderColor: colors.tertiaryBtnBorder,
    borderRadius: vw(35)
  },
  activeFiltersContainerTabView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vh(24),
    marginBottom: vh(16)
  },
  activeFiltersContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: vh(8),
    marginTop: vh(8)
  },
  centerEmptySet: {
    height: '100%',
    alignItems: 'center'
    // justifyContent: 'center',
  },
  footerLoadmoreText: {
    textAlign: 'center',
    fontFamily: fonts.REGULAR,
    fontWeight: '400',
    fontSize: vw(15),
    lineHeight: vh(18),
    color: colors.appBlack
  },
  store: {
    fontSize: vw(13),
    fontFamily: fonts.REGULAR,
    lineHeight: vh(15.6),
    fontWeight: '400',
    color: colors.linkColor,
    textDecorationLine: 'underline',
    letterSpacing: vw(0.2),
    textAlign: 'center'
  },
  topContainer: {
    paddingTop: vh(32),
    paddingBottom: vh(24)
  }
})
