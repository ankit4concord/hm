import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { getOrder } from '../actions'
import {
  ErrorResponse,
  OrderViewModel,
  OrderReleaseItemViewModel,
  OrderReleaseViewModel,
  OrderItemViewModel,
  DeliveryMethod
} from '@ecom/modals/interfaces'
import { RootReducerModal } from '@ecom/modals'
import Loader from '@ecom/components/Loader'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import {
  HeaderBody,
  HeaderSmallTight,
  HeaderSmallTightBold
} from '@ecom/components/typography'
import fonts from '@ecom/utils/fonts'
import LocalizedStrings from 'react-native-localization'
import moment from 'moment'
import { Divider } from '@ecom/components/divider'
import { PaymentInformation } from './components/payment-information'
import { PrimaryLargeButton } from '@ecom/components/buttons'
import localImages from '@ecom/utils/localImages'
import constant from '@ecom/utils/constant'
import { Icon } from '@ecom/components/icons'

type OrderDetailsProps = StackScreenProps<
  AccountStackParamList,
  'AccountOrderDetails'
>

export const OrderDetails = (props: OrderDetailsProps) => {
  const dispatch = useDispatch()
  const { orderID } = props.route.params
  const { navigation } = props

  const { orderHistoryLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )

  const [order, setOrder] = useState<OrderViewModel>()

  const handleResponse = useCallback((res: ErrorResponse) => {
    if (res.code === 200 && res.data) {
      handleSuccess(res.data as OrderViewModel)
    } else {
      handleError(res)
    }
  }, [])

  useEffect(() => {
    dispatch(getOrder(orderID, handleResponse))
  }, [dispatch, handleResponse, orderID])

  const handleSuccess = (o: OrderViewModel) => {
    setOrder(o)
  }

  const handleError = (err: ErrorResponse) => {
    console.log(err)
  }

  const renderHeader = useCallback(() => {
    const total = order?.items.length || 0
    const date = order?.date ? moment(order.date).format('MMMM DD') : ''
    return (
      <View>
        <Text style={styles.headerTitleText}>
          {date
            ? strings.formatString(strings.title, date)
            : strings.defaultTitle}
        </Text>
        {total > 0 ? (
          <HeaderSmallTight style={styles.headerSubText}>{`${total} item${
            total > 1 ? 's' : ''
          }`}</HeaderSmallTight>
        ) : null}
      </View>
    )
  }, [order])

  useEffect(() => {
    navigation.setOptions({ headerTitle: renderHeader })
  }, [navigation, order, renderHeader])

  const renderItemsOrdered = () => {
    if (!order) {
      return null
    }

    return (
      <View>
        <Divider centerText={strings.itemsOrdered} />
        {order.releases && order.releases.length > 0
          ? order.releases.map((r, index) => {
              return renderRelease(r, index)
            })
          : null}
      </View>
    )
  }

  const renderRelease = (release: OrderReleaseViewModel, index: number) => {
    const header =
      release.deliveryMethod === 'PickUpAtStore'
        ? strings.pickUp
        : strings.formatString(strings.shipment, index + 1)
    return (
      <View style={styles.releaseContainer} key={`release-${index}`}>
        <View style={styles.orderHeader}>
          <HeaderBody>{header}</HeaderBody>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.card}>
          {release.orderReleaseItems.map((item, itemIndex) =>
            renderReleaseItem(
              item,
              itemIndex,
              release.shipMethod,
              release.deliveryMethod,
              itemIndex < release.orderReleaseItems.length - 1
            )
          )}
        </View>
      </View>
    )
  }

  const renderUnreleased = (orders: OrderItemViewModel[], type: string) => {
    if (!orders || orders.length === 0) {
      return null
    }

    return (
      <View style={styles.releaseContainer}>
        <View style={styles.orderHeader}>
          <HeaderBody>{type}</HeaderBody>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.card}>
          {orders.map((item, itemIndex) =>
            renderUnreleasedItem(item, itemIndex, itemIndex < orders.length - 1)
          )}
        </View>
      </View>
    )
  }

  const renderUnreleasedItem = (
    item: OrderItemViewModel,
    index: number,
    renderDivider: boolean
  ) => {
    const imageSource = item.imageURL
      ? { uri: item.imageURL }
      : localImages.noImage
    return (
      <View key={`releaseItem-${index}`}>
        <View style={styles.orderContent}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <View style={styles.itemTextContainer}>
            <View style={styles.descriptionContainer}>
              <HeaderBody>{item.description}</HeaderBody>
            </View>
            <View>
              <View style={styles.releaseItemRow}>
                <HeaderSmallTight>{strings.price}</HeaderSmallTight>
                <HeaderSmallTight>
                  {constant.moneyFormatter.format(item.price)}
                </HeaderSmallTight>
              </View>
            </View>
          </View>
        </View>
        {renderDivider ? <Divider style={styles.divider} /> : null}
      </View>
    )
  }

  const renderReleaseItem = (
    item: OrderReleaseItemViewModel,
    index: number,
    shipMethod: string,
    deliveryMethod: DeliveryMethod,
    renderDivider: boolean
  ) => {
    if (!item.itemDetails) {
      return null
    }

    const { itemDetails } = item

    const imageSource = itemDetails.imageURL
      ? { uri: itemDetails.imageURL }
      : localImages.noImage

    const totalPrice =
      itemDetails.quantity === 0
        ? 0
        : (itemDetails.total / itemDetails.quantity) * item.quantity

    const { deliveryAddress: address } = itemDetails
    const isShip = deliveryMethod === 'ShipToAddress'
    const dayOfWeek = itemDetails.deliveryDate
      ? moment(itemDetails.deliveryDate).format('ddd')
      : ''
    const monthDay = itemDetails.deliveryDate
      ? moment(itemDetails.deliveryDate).format('MM/DD')
      : ''

    let statusMessage = isShip
      ? strings.formatString(strings.arrives, dayOfWeek)
      : strings.pickup

    return (
      <View key={`releaseItem-${index}`}>
        <View style={styles.orderContent}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <View style={styles.itemTextContainer}>
            <View style={styles.descriptionContainer}>
              <HeaderBody>{itemDetails.description}</HeaderBody>
            </View>
            {!itemDetails.isFinished && !order?.isFinished ? (
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
            <View>
              <View style={styles.releaseItemRow}>
                <HeaderSmallTight>{strings.quantity}</HeaderSmallTight>
                <HeaderSmallTight>{item.quantity}</HeaderSmallTight>
              </View>
              <View style={styles.releaseItemRow}>
                <HeaderSmallTight>{strings.price}</HeaderSmallTight>
                <HeaderSmallTight>
                  {constant.moneyFormatter.format(itemDetails.price)}
                </HeaderSmallTight>
              </View>
              <View style={styles.releaseItemRow}>
                <HeaderSmallTight>{strings.total}</HeaderSmallTight>
                <HeaderSmallTight>
                  {constant.moneyFormatter.format(totalPrice)}
                </HeaderSmallTight>
              </View>
            </View>
            {shipMethod ? (
              <View>
                <HeaderSmallTightBold style={styles.shipMethod}>
                  {strings.shipMethod}
                </HeaderSmallTightBold>
                <HeaderSmallTight>{shipMethod}</HeaderSmallTight>
              </View>
            ) : null}
            {address ? (
              <View>
                <HeaderSmallTightBold style={styles.shipMethod}>
                  {strings.recipient}
                </HeaderSmallTightBold>
                <View>
                  <HeaderSmallTight>{address.name}</HeaderSmallTight>
                  <HeaderSmallTight>{address.line1}</HeaderSmallTight>
                  {address.line2 ? (
                    <HeaderSmallTight>{address.line2}</HeaderSmallTight>
                  ) : null}
                  <HeaderSmallTight>{`${address.city}, ${address.state} ${address.zip}`}</HeaderSmallTight>
                  <HeaderSmallTight>{address.country}</HeaderSmallTight>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        {renderDivider ? <Divider style={styles.divider} /> : null}
      </View>
    )
  }

  const renderSummary = () => {
    if (!order) {
      return null
    }

    const { total, date, id, status } = order
    const formattedDate = date ? moment(date).format('MMM DD, YYYY') : ''

    return (
      <View style={styles.summaryContainer}>
        <Divider centerText={strings.summary} />
        <View style={[styles.summaryLine, styles.firstSummaryLine]}>
          <HeaderBody style={styles.label}>{strings.orderDate}</HeaderBody>
          <HeaderBody>{formattedDate}</HeaderBody>
        </View>
        <View style={styles.summaryLine}>
          <HeaderBody style={styles.label}>{strings.orderNumber}</HeaderBody>
          <HeaderBody>{id}</HeaderBody>
        </View>
        <View style={styles.summaryLine}>
          <HeaderBody style={styles.label}>{strings.status}</HeaderBody>
          <HeaderBody>{status}</HeaderBody>
        </View>
        <View style={styles.summaryLine}>
          <HeaderBody style={styles.label}>{strings.total}</HeaderBody>
          <HeaderBody>{constant.moneyFormatter.format(total)}</HeaderBody>
        </View>
      </View>
    )
  }

  const goBack = () => {
    navigation.goBack()
  }

  const unreleasedItems = order?.unReleasedItems || []

  const unreleased = unreleasedItems.filter((r) => r.status !== 'Canceled')
  const canceled = unreleasedItems.filter((r) => r.status === 'Canceled')

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {renderItemsOrdered()}
        {renderUnreleased(unreleased, strings.unreleased)}
        {renderUnreleased(canceled, strings.canceled)}
        {renderSummary()}
        <PaymentInformation order={order} />
        {order ? (
          <PrimaryLargeButton onPress={goBack} style={styles.backButton}>
            {strings.back}
          </PrimaryLargeButton>
        ) : null}
      </ScrollView>
      {orderHistoryLoading ? <Loader /> : null}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    defaultTitle: 'Order Details',
    title: 'Order Of {0}',
    itemsOrdered: 'Items ordered',
    summary: 'Summary',
    paymentInfo: 'Payment information',
    orderDate: 'Order date',
    orderNumber: 'Order number',
    status: 'Status',
    total: 'Total',
    back: 'Back to orders',
    shipment: 'Shipment {0}',
    pickUp: 'Pick up in store',
    quantity: 'Quantity',
    price: 'Price',
    shipMethod: 'Shipping method',
    recipient: 'Recipient address',
    unreleased: 'Unshipped',
    canceled: 'Canceled',
    arrives: 'Arrives: {0} ',
    pickup: 'Pick up as soon as today'
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
    paddingBottom: vh(100),
    flexDirection: 'column',
    flexGrow: 1
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
  summaryContainer: {
    marginTop: vh(20),
    marginBottom: vh(40)
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vh(10)
  },
  label: {
    color: colors.grayText
  },
  firstSummaryLine: {
    marginTop: vh(25)
  },
  backButton: {
    marginTop: vh(40),
    marginBottom: vh(20),
    width: '50%',
    alignSelf: 'center'
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: vw(10),
    shadowOffset: { width: 0, height: vh(2) },
    shadowOpacity: 0.1,
    shadowRadius: vw(8),
    marginTop: 15
  },
  orderContent: {
    marginVertical: vh(20),
    marginHorizontal: vw(20),
    flexDirection: 'row'
  },
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
  orderHeader: {
    flexDirection: 'row',
    marginBottom: vh(5)
  },
  divider: {
    marginBottom: vh(10)
  },
  releaseContainer: {
    marginTop: vh(20)
  },
  releaseItemRow: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between'
  },
  descriptionContainer: {
    marginBottom: vh(10)
  },
  shipMethod: {
    marginTop: vh(15)
  },
  icon: {
    marginRight: vw(5)
  },
  status: {
    color: colors.greenText
  },
  statusContainer: {
    backgroundColor: colors.greenBG,
    flexDirection: 'row',
    padding: vw(10),
    borderRadius: vw(10),
    marginTop: vh(5),
    marginBottom: vh(15)
  },
  statusContainerShip: {
    width: '85%',
    minWidth: '85%'
  }
})
