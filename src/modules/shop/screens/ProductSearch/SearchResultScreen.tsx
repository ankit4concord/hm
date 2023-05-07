import { Animated, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'

import { ProductList } from './ProductList'
import ProductSearchHeader from './ProductSearchHeader'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { getProductSearchResults } from '../../action'
import { useDispatch } from 'react-redux'
import { useRoute } from '@react-navigation/native'

interface Props {
  route: any
  navigation: any
}

export function SearchResultScreen(props: Props) {
  const dispatch = useDispatch()
  const route = useRoute()

  useEffect(() => {
    dispatch({
      type: actionNames.SEARCH_SUGGESTIONS,
      payload: {
        searchTerm: props?.route?.params?.name
      }
    })
    // dispatch(saveRecentSearches(props?.route?.params?.name?.toLowerCase()))
  }, [route])

  useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      const e = {
        nativeEvent: {
          contentInset: {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
          },
          contentOffset: {
            x: 0,
            y: 0
          },
          contentSize: {
            height: 2286.333251953125,
            width: 358
          },
          layoutMeasurement: {
            height: 912,
            width: 358
          },
          zoomScale: 1
        }
      }
      onScroll(e)
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [props?.navigation])

  const dragSearch = React.useRef(new Animated.Value(0)).current
  const dragSearch2 = React.useRef(new Animated.Value(0)).current

  const onScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y

    if (
      y >= 0 &&
      y <=
        e.nativeEvent.contentSize.height -
          e.nativeEvent.layoutMeasurement.height
    ) {
      dragSearch.setValue(y)
    }

    const x = e.nativeEvent.contentOffset.y

    if (
      x >= 0 &&
      x <=
        e.nativeEvent.contentSize.height -
          e.nativeEvent.layoutMeasurement.height
    ) {
      dragSearch2.setValue(x)
    }
  }

  return (
    <View style={styles.container}>
      <ProductSearchHeader {...props} />

      <View>
        <ProductList
          onScroll={onScroll}
          searchTerm={props?.route?.params?.name}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  filter: {
    marginLeft: vw(20),
    width: vw(25),
    height: vw(25)
  },
  searchbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: vh(24),
    paddingRight: vh(18),
    paddingTop: vh(112),
    paddingBottom: vh(8),

    zIndex: 1,
    backgroundColor: 'white'
  },
  searchText: {
    fontSize: vw(15),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    fontWeight: '500'
  },
  itemCount: {
    fontSize: vw(15),
    fontFamily: fonts.REGULAR,
    lineHeight: vh(18),
    fontWeight: '400'
  },
  store: {
    fontSize: vw(13),
    fontFamily: fonts.REGULAR,
    lineHeight: vh(15.6),
    fontWeight: '400',
    color: colors.linkColor,
    letterSpacing: vw(0.2),
    textAlign: 'center'
  },
  productsCount: {
    textAlign: 'center',
    paddingLeft: vw(8),
    fontWeight: '400',
    fontFamily: fonts.REGULAR,
    fontSize: vw(15),
    lineHeight: vh(18),
    color: colors.black,
    paddingVertical: vh(16)
  },
  productCountFilter: {
    textAlign: 'center',
    paddingLeft: vw(8),
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  activeFilterLabel: {
    fontWeight: '400',
    fontFamily: fonts.REGULAR,
    fontSize: vw(15),
    lineHeight: vh(18),
    color: colors.black,
    paddingLeft: vw(8)
  },
  activeFilterCapsule: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#D6F1F9',
    borderRadius: vw(4),
    alignSelf: 'flex-start',
    paddingVertical: vh(4),
    paddingHorizontal: vw(8),
    marginHorizontal: vw(4)
  },
  activeFiltersContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: vh(24)
  },
  header: {
    paddingTop: vh(56),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: vw(24),
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
  },
  headerTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(25),
    fontWeight: '500',
    lineHeight: vh(30),
    letterSpacing: vw(0.8),
    maxWidth: vw(screenWidth * 0.75)
  }
})
