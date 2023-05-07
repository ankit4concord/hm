import { Divider } from '@ecom/components/divider'
import { Icon } from '@ecom/components/icons'
import { HeaderBody, LabelButton } from '@ecom/components/typography'
import { OrderViewModel } from '@ecom/modals'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import { vh, vw } from '@ecom/utils/dimension'
import { StackNavigationProp } from '@react-navigation/stack'
import moment from 'moment'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import LocalizedStrings from 'react-native-localization'
import { OrderLineItem } from './order-line-item'

interface OrderHistoryItemProps {
  order: OrderViewModel
  index: number
  navigation: StackNavigationProp<
    AccountStackParamList,
    'AccountOrderHistory',
    undefined
  >
}

export const OrderHistoryItem = (props: OrderHistoryItemProps) => {
  const { order, index, navigation } = props
  const orderDate = order.date ? moment(order.date).format('MMMM DD, YYYY') : ''
  const orderTotal = constant.moneyFormatter.format(order.total)

  const goToDetails = () => {
    if (order.id) {
      navigation.navigate('AccountOrderDetails', { orderID: order.id })
    }
  }

  const renderHeader = () => {
    return (
      <View style={styles.orderHeader}>
        <HeaderBody>{orderDate}</HeaderBody>
        <View style={styles.totalContainer}>
          <HeaderBody style={styles.total}>{strings.total}</HeaderBody>
          <HeaderBody>{orderTotal}</HeaderBody>
        </View>
      </View>
    )
  }

  const renderLineItems = () => {
    return order.items.map((i, itemIndex) => {
      const lengthUpTo3 = order.items.length >= 3 ? 3 : order.items.length

      const renderDivider =
        !(itemIndex === lengthUpTo3 - 1) || order.items.length > 3

      return itemIndex <= 2 ? (
        <OrderLineItem
          item={i}
          index={itemIndex}
          renderDivider={renderDivider}
          orderIsFinished={order.isFinished}
          key={`OrderLineItem-${itemIndex}`}
        />
      ) : null
    })
  }

  const renderFooter = () => {
    return order.items.length > 3 ? (
      <Pressable style={styles.moreItemsContainer} onPress={goToDetails}>
        <LabelButton style={styles.moreItems}>
          {strings.formatString(strings.items, order.items.length - 3)}
        </LabelButton>
      </Pressable>
    ) : null
  }

  const renderOrder = () => {
    return (
      <View style={styles.card}>
        <Pressable style={styles.orderDetails} onPress={goToDetails}>
          <HeaderBody>{strings.seeOrderDetails}</HeaderBody>
          <Icon name={'hm_ChevronRight-thick'} />
        </Pressable>
        <Divider />
        {renderLineItems()}
        {renderFooter()}
      </View>
    )
  }

  return order.items.length > 0 ? (
    <View style={styles.order} key={`orderHistory-${index}`}>
      {renderHeader()}
      <Divider style={styles.divider} />
      {renderOrder()}
    </View>
  ) : null
}

const strings = new LocalizedStrings({
  'en-us': {
    total: 'Total',
    seeOrderDetails: 'View order Details',
    items: '{0} MORE ITEM(S)'
  }
})

const styles = StyleSheet.create({
  total: {
    color: colors.grayText,
    marginRight: vw(10)
  },
  totalContainer: {
    flexDirection: 'row'
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vh(5)
  },
  divider: {
    marginBottom: vh(10)
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: vw(10),
    shadowOffset: { width: 0, height: vh(2) },
    shadowOpacity: 0.1,
    shadowRadius: vw(8)
  },
  orderDetails: {
    marginHorizontal: vw(20),
    marginVertical: vh(20),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  order: {
    marginBottom: vh(40)
  },
  moreItems: {
    color: colors.grayText,
    alignSelf: 'center'
  },
  moreItemsContainer: {
    marginVertical: vh(20),
    marginHorizontal: vw(20)
  }
})
