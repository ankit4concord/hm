import {
  DeliveryMethod,
  OrderStatus,
  Order,
  OrderItem,
  OrderViewModel,
  OrderItemViewModel,
  OrderAddressViewModel,
  OrderPaymentViewModel,
  OrderAdditionalChargesViewModel,
  OrderRelease,
  OrderReleaseItem,
  OrderReleaseViewModel,
  OrderReleaseItemViewModel,
  OrderBillingAddress
} from '@ecom/modals/interfaces'

const finishedStatus = ['Picked Up', 'Canceled', 'Delivered']

export const mapOrders = (orders: Order[]): OrderViewModel[] => {
  return orders.map((o) => {
    return mapOrder(o)
  })
}

export const mapOrderDetails = (
  order: Order,
  orderHistoryOrder?: OrderViewModel
): OrderViewModel => {
  const orderVM = mapOrder(order, orderHistoryOrder)
  orderVM.releases = mapReleases(order, orderVM)
  orderVM.unReleasedItems = orderVM.items.filter(
    (i) => !hasARelease(i.id, orderVM.releases || [])
  )
  return orderVM
}

const mapOrder = (
  order: Order,
  orderHistoryOrder?: OrderViewModel
): OrderViewModel => {
  const deliveryMethod = getOrderDeliveryMethod(order)
  const orderVM = {
    id: order.OrderId || '',
    date: order.CapturedDate || '',
    total: order.OrderTotal || 0,
    subTotal: order.OrderSubTotal || 0,
    taxes: order.TotalTaxes || 0,
    deliveryMethod,
    items: mapOrderItems(order, orderHistoryOrder),
    fulfillmentStatus: order.FulfillmentStatus,
    status: getOrderStatus(order, deliveryMethod),
    billingAddress: mapBillingAddress(order),
    paymentMethods: mapPaymentMethods(order),
    additionalCharges: mapAdditionalCharges(order),
    isFinished: false,
    unReleasedItems: []
  }

  orderVM.isFinished =
    finishedStatus.includes(orderVM.status) ||
    orderVM.fulfillmentStatus === 'Canceled'

  return orderVM
}

const mapOrderItems = (
  order: Order,
  orderHistoryOrder?: OrderViewModel
): OrderItemViewModel[] => {
  let orderItems: OrderItemViewModel[] = []

  if (order.OrderLine && order.OrderLine.length > 0) {
    orderItems = order.OrderLine.map((item) => {
      const ohItem = orderHistoryOrder?.items?.find(
        (ohi) => ohi.id === item.OrderLineId
      )

      const deliveryMethod: DeliveryMethod =
        item.DeliveryMethod?.DeliveryMethodId === 'PickUpAtStore'
          ? 'PickUpAtStore'
          : 'ShipToAddress'

      const orderItemVM = {
        id: item.OrderLineId || '',
        description: item.ItemDescription || '',
        imageURL: item.SmallImageURI || ohItem?.imageURL || '',
        price: item.UnitPrice || 0,
        total: item.OrderLineTotal || 0,
        status: getOrderItemStatus(item),
        deliveryDate: getItemDeliveryDate(item, deliveryMethod),
        deliveryMethod,
        isFinished: false,
        quantity: item.Quantity || 0,
        deliveryAddress: mapAddress(item.ShipToAddress)
      }

      orderItemVM.isFinished = finishedStatus.includes(orderItemVM.status)

      return orderItemVM
    })
  }

  return orderItems
}

const mapReleases = (
  order: Order,
  orderVM: OrderViewModel
): OrderReleaseViewModel[] => {
  let releases: OrderReleaseViewModel[] = []
  const orderReleases = filterOutCancelledReleases(order)
  if (orderReleases.length > 0) {
    releases = orderReleases.map((r) => {
      return {
        deliveryMethod:
          r.DeliveryMethodId === 'PickUpAtStore'
            ? 'PickUpAtStore'
            : 'ShipToAddress',
        shipMethod: r.ShipViaId || '',
        orderReleaseItems: mapReleaseItems(r, orderVM)
      }
    })
  }
  return releases
}

const mapReleaseItems = (
  release: OrderRelease,
  orderVM: OrderViewModel
): OrderReleaseItemViewModel[] => {
  let releaseItems: OrderReleaseItemViewModel[] = []
  if (release.ReleaseLine && release.ReleaseLine.length > 0) {
    releaseItems = release.ReleaseLine.map((r) => {
      return mapReleaseItem(r, orderVM)
    })
  }
  return releaseItems
}

const mapReleaseItem = (
  item: OrderReleaseItem,
  orderVM: OrderViewModel
): OrderReleaseItemViewModel => {
  return {
    orderItemID: item.OrderLineId || '',
    quantity: item.Quantity || 0,
    cancelledQuantity: item.CancelledQuantity || 0,
    itemDetails: orderVM.items.find((i) => i.id === item.OrderLineId)
  }
}

const getItemDeliveryDate = (
  item: OrderItem,
  deliveryMethod: DeliveryMethod
): string => {
  if (deliveryMethod === 'PickUpAtStore') {
    return ''
  }

  if (
    item.Allocation &&
    item.Allocation.length > 0 &&
    item.Allocation[0].EarliestDeliveryDate
  ) {
    return item.Allocation[0].EarliestDeliveryDate
  } else if (item.Extended?.SFCCEarliestDeliveryDate) {
    return item.Extended.SFCCEarliestDeliveryDate
  }

  return ''
}

const mapBillingAddress = (order: Order): OrderAddressViewModel | undefined => {
  if (
    !order?.Payment ||
    order.Payment.length === 0 ||
    !order.Payment[0].PaymentMethod ||
    order.Payment[0].PaymentMethod.length === 0
  ) {
    return undefined
  }

  return mapAddress(order.Payment[0].PaymentMethod[0].BillingAddress)
}

const mapAddress = (
  orderAddress?: OrderBillingAddress
): OrderAddressViewModel | undefined => {
  if (!orderAddress || !orderAddress.Address) {
    return undefined
  }

  const address = orderAddress.Address

  return {
    name: `${address.FirstName} ${address.LastName}`,
    line1: address.Address1 || '',
    line2: address.Address2 || '',
    city: address.City || '',
    state: address.State || '',
    zip: address.PostalCode || '',
    email: address.Email || '',
    phone: address.Phone || '',
    country: address.Country || ''
  }
}

const mapPaymentMethods = (order: Order): OrderPaymentViewModel[] => {
  let paymentMethods: OrderPaymentViewModel[] = []
  if (
    order?.Payment &&
    order.Payment.length > 0 &&
    order.Payment[0]?.PaymentMethod &&
    order.Payment[0].PaymentMethod.length > 0
  ) {
    const payments = order.Payment[0].PaymentMethod

    paymentMethods = payments.map((p) => {
      return {
        type: p.PaymentType?.PaymentTypeId || '',
        cardType: p.CardType?.CardTypeId || '',
        displayNumber: p.AccountDisplayNumber || '',
        chargeAmount: p.Amount || 0,
        expireMonth: p.CardExpiryMonth || '',
        expireYear: p.CardExpiryYear || '',
        email: p.BillingAddress?.Address?.Email || ''
      }
    })
  }

  return paymentMethods
}

const mapAdditionalCharges = (
  order: Order
): OrderAdditionalChargesViewModel[] => {
  let additionalCharges: OrderAdditionalChargesViewModel[] = []
  if (order.OrderChargeDetail && order.OrderChargeDetail.length > 0) {
    additionalCharges = order.OrderChargeDetail.map((ocd) => {
      return {
        label: ocd.ChargeDisplayName || '',
        total: ocd.ChargeTotal || 0
      }
    })
  }

  return additionalCharges
}

const getOrderDeliveryMethod = (order: Order): DeliveryMethod => {
  const orderItems = order.OrderLine || []
  let containsShip = orderItems.some(
    (o) => o.DeliveryMethod?.DeliveryMethodId !== 'PickUpAtStore'
  )

  let containsPickUp = orderItems.some(
    (o) => o.DeliveryMethod?.DeliveryMethodId === 'PickUpAtStore'
  )

  if (containsShip && containsPickUp) {
    return 'Mixed'
  }
  return containsPickUp ? 'PickUpAtStore' : 'ShipToAddress'
}

const getOrderStatus = (
  order: Order,
  deliveryMethod?: DeliveryMethod
): OrderStatus => {
  const dm = deliveryMethod || getOrderDeliveryMethod(order)
  const min = Number(order.MinFulfillmentStatusId) || 0
  const max = Number(order.MaxFulfillmentStatusId) || 0

  const containsPickUp = dm === 'PickUpAtStore' || dm === 'Mixed'
  const containsShip = dm === 'ShipToAddress' || dm === 'Mixed'

  const processingLevel = dm === 'ShipToAddress' ? 7000 : 3600

  if (min < processingLevel) {
    return 'Processing'
  }

  if (min === 9000) {
    return 'Canceled'
  }

  if (containsShip && min === 7500 && max >= 7500 && max <= 9000) {
    return 'Delivered'
  }

  if (containsPickUp) {
    if (min >= 3600 && min < 7000 && max >= 3600 && max <= 9000) {
      return 'Ready for pick up'
    } else if (min >= 7000 && max >= 7000 && max <= 9000) {
      return 'Picked Up'
    }
  } else if (min >= 7000 && max >= 7000 && max <= 9000) {
    return 'Shipped'
  }

  return 'Processing'
}

const getOrderItemStatus = (item: OrderItem): OrderStatus => {
  const min = Number(item.MinFulfillmentStatusId) || 0
  const max = Number(item.MaxFulfillmentStatusId) || 0
  const deliveryMethod =
    item?.DeliveryMethod?.DeliveryMethodId || 'ShipToAddress'
  const isShip = deliveryMethod === 'ShipToAddress'

  if (min >= 3600 && min < 7000) {
    return deliveryMethod === 'ShipToAddress'
      ? 'Ready for shipment'
      : 'Ready for pick up'
  }

  if (isShip && min >= 7000 && min < 7500) {
    return 'Shipped'
  }

  if (isShip && min >= 7500 && min < 8000) {
    return 'Delivered'
  }

  if (!isShip && min >= 7000 && min < 9000) {
    return 'Picked Up'
  }

  if (min === 9000 && max === 9000) {
    return 'Canceled'
  }

  return 'Processing'
}

const filterOutCancelledReleases = (order: Order): OrderRelease[] => {
  let filteredReleases: OrderRelease[] = []
  if (order && order.Release && order.Release.length > 0) {
    filteredReleases = order.Release.map((r) => {
      r.ReleaseLine = filterOutCancelledReleaseItems(r.ReleaseLine)
      return r
    }).filter((r) => (r.ReleaseLine || []).length > 0)
  }
  return filteredReleases
}

const filterOutCancelledReleaseItems = (
  releaseItems?: OrderReleaseItem[]
): OrderReleaseItem[] => {
  let filteredReleaseItems: OrderReleaseItem[] = []
  if (releaseItems && releaseItems.length > 0) {
    filteredReleaseItems = releaseItems.filter(
      (r) => (r.CancelledQuantity || 0) < (r.Quantity || 0)
    )
  }
  return filteredReleaseItems
}

const hasARelease = (
  id: string,
  releases: OrderReleaseViewModel[]
): boolean => {
  return (
    releases.findIndex(
      (r) => r.orderReleaseItems.findIndex((i) => i.orderItemID === id) !== -1
    ) !== -1
  )
}
