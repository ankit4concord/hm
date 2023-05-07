import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { Body, HeaderSmallTight, LabelName } from '@ecom/components/typography'
import LocalizedStrings from 'react-native-localization'
import fonts from '@ecom/utils/fonts'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders } from '../actions'
import {
  OrderHistoryModel,
  OrderViewModel,
  RootReducerModal
} from '@ecom/modals'
import { OrderHistoryItem } from './components/order-history-item'
import Loader from '@ecom/components/Loader'
import { ShoppingBag } from '@ecom/assets/svg'
import { PrimaryLargeButton } from '@ecom/components/buttons'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'

type OrderHistoryProps = StackScreenProps<
  AccountStackParamList,
  'AccountOrderHistory'
>

const keyExtractor = (item: OrderViewModel, index: number) =>
  item.id || `OH-${index}`

export const OrderHistory = ({ navigation }: OrderHistoryProps) => {
  const dispatch = useDispatch()
  const orderHistory = useSelector(
    (state: RootReducerModal) => state.orderHistoryReducer
  )

  const { orderHistoryLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )

  const [orders, setOrders] = useState<OrderHistoryModel>(
    new OrderHistoryModel()
  )
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    dispatch(getOrders(false, finishedLoading))
  }, [dispatch])

  const finishedLoading = (finished: boolean) => {
    setLoaded(finished)
  }

  useEffect(() => {
    setOrders(orderHistory)
  }, [orderHistory])

  const renderHeader = useCallback(() => {
    const { total } = orders
    return (
      <View>
        <Text style={styles.headerTitleText}>{strings.title}</Text>
        {total > 0 ? (
          <HeaderSmallTight style={styles.headerSubText}>{`${total} order${
            total > 1 ? 's' : ''
          }`}</HeaderSmallTight>
        ) : null}
      </View>
    )
  }, [orders])

  const renderOrder: ListRenderItem<OrderViewModel> = ({
    item,
    index
  }: ListRenderItemInfo<OrderViewModel>) => {
    return (
      <OrderHistoryItem order={item} index={index} navigation={navigation} />
    )
  }

  const onDiscover = () => {
    navigate(screenNames.SHOP_NAVIGATOR, {
      screen: screenNames.SHOP_SCREEN
    })
  }

  const renderEmpty = () => {
    return loaded ? (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContentContainer}>
          <ShoppingBag style={styles.image} />
          <LabelName>{strings.emptyHeader}</LabelName>
          <Body>{strings.emptyText}</Body>
        </View>
        <PrimaryLargeButton style={styles.button} onPress={onDiscover}>
          {strings.discover}
        </PrimaryLargeButton>
      </View>
    ) : null
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: renderHeader })
  }, [navigation, orders, renderHeader])

  const listStyle = [
    styles.content,
    orders?.orders?.length > 0 ? styles.listContent : {}
  ]

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={listStyle}
        data={orders.orders}
        keyExtractor={keyExtractor}
        renderItem={renderOrder}
        onEndReached={() => {
          dispatch(getOrders(true, finishedLoading))
        }}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listEmptyStyle}
      />
      {orderHistoryLoading ? <Loader /> : null}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    title: 'Orders',
    emptyHeader: "You haven't placed any orders yet.",
    emptyText:
      "Find a card you like in one of the categories below, or go to 'Discover' for more categories.",
    discover: 'Discover Cards'
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pageBackground,
    flex: 1
  },
  content: {
    marginHorizontal: vw(20),
    marginTop: vh(20),
    flexDirection: 'column',
    flexGrow: 1
  },
  listContent: {
    paddingBottom: vh(100)
  },
  headerTitleText: {
    fontFamily: fonts.BOLD,
    fontSize: vw(16),
    lineHeight: vh(19.2),
    color: colors.blackText
  },
  headerSubText: {
    color: colors.grayText
  },
  emptyContainer: {
    flex: 1
  },
  emptyContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  listEmptyStyle: {
    flexGrow: 1
  },
  button: {
    marginBottom: vh(25)
  },
  image: {
    marginBottom: vh(30)
  }
})
