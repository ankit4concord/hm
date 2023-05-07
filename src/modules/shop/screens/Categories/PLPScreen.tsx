import { Animated, StyleSheet, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  getFilteredProductList,
  getProductList,
  resetFilterOnChangeTab
} from '../../action'
import { useDispatch, useSelector } from 'react-redux'

import PLPHeader from './PLPHeader'
import { ProductList } from '../Products/ProductList'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import { isEmpty } from 'lodash'
import { vh } from '@ecom/utils/dimension'

interface Props {
  route: any
  navigation: any
}

export function PLPScreen(props: Props) {
  let currentCategory = 'mobile-app-categories' //props?.route?.params?.id || categoryDetails.id

  const { isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const useHasChanged = (val: any) => {
    const prevVal = usePrevious(val)
    return prevVal !== val
  }

  const usePrevious = (value: any) => {
    const ref = useRef(isGuestMode)
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const isGuestModeChanged = useHasChanged(isGuestMode)
  const dragSearch = React.useRef(new Animated.Value(0)).current
  const dragSearch2 = React.useRef(new Animated.Value(0)).current
  const searchClampValue = Animated.diffClamp(dragSearch, 0, vh(150))
  const translateSearch = searchClampValue.interpolate({
    inputRange: [0, vh(150)],
    outputRange: [0, vh(-150)],
    extrapolate: 'clamp'
  })
  useEffect(() => {
    if (isGuestModeChanged) {
      dispatch(getProductList(currentCategory))
    }
  })

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
  //Set current index to 0 so All will be selected by default
  const [myIndex, setIndex] = React.useState(0)
  //Get category details and subCategories from param
  const [categoryDetails, setCategoryDetails] = useState(props.route.params)
  const [currentProductCategory, setCurrentProductCategory] = useState(
    categoryDetails.id
  )
  let subCategories = props.route.params.subCategories?.filter(
    (item: any) =>
      ((item?.hasOwnProperty('c_hideInMobileAppNav') &&
        !item?.c_hideInMobileAppNav) ||
        !item?.hasOwnProperty('c_hideInMobileAppNav')) &&
      ((item?.hasOwnProperty('c_hasProducts') && item?.c_hasProducts) ||
        !item?.hasOwnProperty('c_hasProducts'))
  )

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: categoryDetails.name
    })
    setCategoryDetails(props.route.params)
  }, [props.navigation])

  useEffect(() => {
    dispatch({
      type: actionNames.CATEGORY_INFO,
      payload: { plp_banner: '' }
    })
  }, [currentProductCategory])
  const { productlist, minPrice, maxPrice, sort } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )

  const dispatch = useDispatch()

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

    return unsubscribe
  }, [props?.navigation])

  const dataSource: any = []
  if (subCategories && subCategories.length > 0) {
    dataSource.push({ title: 'All', key: currentCategory, hasL4: false })

    subCategories.map((data: any) => {
      if (true) {
        dataSource.push({
          title: data.name,
          key: data.id,
          hasL4:
            data?.hasOwnProperty('subCategories') &&
            !isEmpty(data?.subCategories)
              ? true
              : false
        })
      }
    })
  }

  useEffect(() => {
    handleCategory()
  }, [props.route.params.selectedItem, props.route.params])

  const handleCategory = () => {
    props.navigation.setOptions({
      title: props.route.params.name
    })
    let categoriesFiltered = props.route.params.subCategories?.filter(
      (item: any) =>
        (item?.hasOwnProperty('c_hideInMobileMenu') &&
          !item?.c_hideInMobileMenu) ||
        !item?.hasOwnProperty('c_hideInMobileMenu')
    )
    dispatch(resetFilterOnChangeTab())
    if (props.route.params.from === 'redirect') {
      if (
        props?.route?.params?.selectedItem &&
        Object.values(props?.route?.params?.selectedItem)?.length > 0
      ) {
        if (
          props?.route?.params?.selectedItem?.hasOwnProperty(
            'c_hideInMobileMenu'
          ) &&
          props?.route?.params?.selectedItem?.c_hideInMobileMenu
        ) {
          categoriesFiltered?.length > 0 && setIndex(0)
        } else {
          let getIndex = props?.route?.params?.subCategories?.findIndex(
            (p: any) => p.name == props?.route?.params?.selectedItem?.name
          )

          setIndex(getIndex + 1)

          dispatch(getProductList(props.route.params.id))

          setCurrentProductCategory(props.route.params.id)
        }
      } else {
        categoriesFiltered?.length > 0 && setIndex(0)
        dispatch(getProductList('mobile-app-categories'))
      }
    } else {
      if (props.route.params.from !== 'redirect') {
        dispatch(resetFilterOnChangeTab())
        setCurrentProductCategory(props.route.params.id)
      }
      if (
        props?.route?.params?.selectedItem &&
        Object.values(props?.route?.params?.selectedItem)?.length > 0
      ) {
        if (
          props?.route?.params?.selectedItem?.hasOwnProperty(
            'c_hideInMobileMenu'
          ) &&
          props?.route?.params?.selectedItem?.c_hideInMobileMenu === true
        ) {
          categoriesFiltered?.length > 0 && setIndex(0)
          minPrice === '' && maxPrice === ''
            ? dispatch(getProductList(props.route.params.id))
            : dispatch(
                getFilteredProductList(
                  props.route.params.id,
                  sort?.value,
                  '',
                  {},
                  true
                )
              )
        } else {
          let getIndex = props.route.params.subCategories?.findIndex(
            (p: any) => p.id == props?.route?.params?.selectedItem?.id
          )

          setIndex(getIndex + 1)

          let current = getIndex

          if (subCategories?.length > 0) {
            minPrice === '' && maxPrice === ''
              ? dispatch(
                  getProductList(
                    subCategories[current]?.id ?? props.route.params.id
                  )
                )
              : dispatch(
                  getFilteredProductList(
                    subCategories[current]?.id ?? props.route.params.id,
                    sort?.value,
                    '',
                    {},
                    true
                  )
                )

            setCurrentProductCategory(
              subCategories[current]?.id ?? props.route.params.id
            )
          } else {
            minPrice === '' && maxPrice === ''
              ? dispatch(getProductList(props.route.params.id))
              : dispatch(
                  getFilteredProductList(
                    props.route.params.id,
                    sort?.value,
                    '',
                    {},
                    true
                  )
                )
            setCurrentProductCategory(props.route.params.id)
          }
        }
      } else {
        categoriesFiltered?.length > 0 && setIndex(0)

        minPrice === '' && maxPrice === ''
          ? dispatch(getProductList(props.route.params.id))
          : dispatch(
              getFilteredProductList(
                props.route.params.id,
                sort?.value,
                '',
                {},
                true
              )
            )
        setCurrentProductCategory(props.route.params.id)
      }
    }
  }

  return (
    <View style={styles.container}>
      <PLPHeader {...props} />

      <ProductList
        translate={translateSearch}
        params={props}
        {...props}
        productList={productlist}
        tabview={false}
        onScroll={onScroll}
        category={currentProductCategory}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    position: 'relative'
  }
})
