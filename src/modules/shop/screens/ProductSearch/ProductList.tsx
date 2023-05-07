import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { EmptySearch } from '@ecom/assets/svg'
// import { FlatList } from 'react-native-gesture-handler'
import InlineLoader from '@ecom/components/InlineLoader'
import PLPProductTile from '../Categories/PLPProductTile'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { getMoreSearchResults } from '../../action'
import localImages from '@ecom/utils/localImages'
import { useRoute } from '@react-navigation/native'

export function ProductList(props: any) {
  const route = useRoute()
  const dispatch = useDispatch()
  const { searchResults, searchResultHasMore, searchResultEnd } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const { productLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { isProductLoadMore } = useSelector(
    (state: RootReducerModal) => state.globalLoadMoreReducer
  )
  const handleLoadMore = () => {
    if (searchResultHasMore) {
      dispatch(
        getMoreSearchResults(route?.params?.name, searchResultEnd, 10, true)
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
    <View style={styles.listContainer}>
      {productLoading && (
        <View style={styles.inlineLoaderContainer}>
          <InlineLoader />
        </View>
      )}
      {!productLoading && searchResults && searchResults?.length === 0 && (
        <View style={styles.noSearchResultContainer}>
          <EmptySearch style={styles.noResultImage} />
          <Text style={styles.noSearchResultText}>
            Can't find any results for {route?.params?.name}.
          </Text>
          <Text style={styles.noSearchResultSubText}>
            Try another search term.
          </Text>
        </View>
      )}
      {!productLoading && searchResults && searchResults?.length > 0 && (
        <Animated.FlatList
          numColumns={2}
          contentContainerStyle={[
            {
              paddingBottom: vh(searchResults?.length > 2 ? 150 : 264)
            },
            searchResults?.length === 0 && styles.centerEmptySet
          ]}
          data={searchResults}
          disableVirtualization={false}
          showsVerticalScrollIndicator={false}
          renderItem={(item: any) => <PLPProductTile {...item} />}
          onEndReachedThreshold={0.3}
          onEndReached={handleLoadMore}
          ListFooterComponent={footerComponent}
          scrollEventThrottle={16}
        />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: vw(16)
  },
  // NoProductText: {
  //   position: 'absolute',
  //   paddingBottom: screenHeight * 0.1,
  // },
  centerEmptySet: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noResultImage: {
    marginBottom: vh(20)
  },
  noSearchResultContainer: {
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noSearchResultText: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    marginBottom: vh(3)
  },
  noSearchResultSubText: {
    color: colors.grayTxt,
    fontSize: vw(14)
  },
  inlineLoaderContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
