import { Icon } from '@ecom/components/icons'
import {
  HeaderBody,
  HeaderSmallTight,
  HeaderSmallTightBold
} from '@ecom/components/typography'
import { OrderItemViewModel } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import localImages from '@ecom/utils/localImages'
import moment from 'moment'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Divider } from 'react-native-elements'
import LocalizedStrings from 'react-native-localization'
import constant from '@ecom/utils/constant'

interface OrderLineItemProps {
  item: OrderItemViewModel
  renderDivider: boolean
  index: number
  orderIsFinished: boolean
}

export const OrderLineItem = (props: OrderLineItemProps) => {
  const { item, renderDivider, index, orderIsFinished } = props
  const orderTotal = constant.moneyFormatter.format(item.price)
  const imageSource = item.imageURL
    ? { uri: item.imageURL }
    : localImages.noImage
  const isShip = item.deliveryMethod === 'ShipToAddress'

  const dayOfWeek = item.deliveryDate
    ? moment(item.deliveryDate).format('ddd')
    : ''
  const monthDay = item.deliveryDate
    ? moment(item.deliveryDate).format('MM/DD')
    : ''

  let statusMessage = isShip
    ? strings.formatString(strings.arrives, dayOfWeek)
    : strings.pickup

  return (
    <View key={`orderItem-${index}`}>
      <View style={styles.orderContent}>
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
        </View>
        <View style={styles.itemTextContainer}>
          <View>
            <HeaderBody>{item.description}</HeaderBody>
          </View>
          <HeaderSmallTight style={styles.itemPrice}>
            {orderTotal}
          </HeaderSmallTight>
          {!item.isFinished && !orderIsFinished ? (
            <View
              style={[
                styles.statusContainer,
                isShip ? styles.statusContainerShip : {}
              ]}>
              <Icon
                name={'hm_Check-thick'}
                color={colors.greenText}
                style={styles.icon}
              />
              <HeaderSmallTight style={styles.status}>
                {statusMessage}
              </HeaderSmallTight>
              {isShip ? (
                <HeaderSmallTightBold style={styles.status}>
                  {monthDay}
                </HeaderSmallTightBold>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
      {renderDivider ? <Divider /> : null}
    </View>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    arrives: 'Arrives: {0} ',
    pickup: 'Pick up as soon as today'
  }
})

const styles = StyleSheet.create({
  image: {
    height: vw(100),
    width: vw(100)
  },
  imageContainer: {
    width: vw(120)
  },
  itemTextContainer: {
    flexShrink: 1
  },
  orderContent: {
    marginVertical: vh(20),
    marginHorizontal: vw(20),
    flexDirection: 'row'
  },
  itemPrice: {
    color: colors.grayText,
    marginTop: vh(5)
  },
  statusContainer: {
    backgroundColor: colors.greenBG,
    flexDirection: 'row',
    padding: vw(10),
    borderRadius: vw(25),
    marginTop: vh(15)
  },
  statusContainerShip: {
    width: '85%',
    minWidth: '85%'
  },
  icon: {
    marginRight: vw(5)
  },
  status: {
    color: colors.greenText
  }
})
