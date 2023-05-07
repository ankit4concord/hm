import { Divider } from '@ecom/components/divider'
import { Body, HeaderBody } from '@ecom/components/typography'
import { OrderAdditionalChargesViewModel, OrderViewModel } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import LocalizedStrings from 'react-native-localization'
import { PaymentMethod } from './payment-method'
import constant from '@ecom/utils/constant'

interface PaymentInformationProps {
  order?: OrderViewModel
}

export const PaymentInformation = (props: PaymentInformationProps) => {
  if (!props.order) {
    return null
  }

  const {
    total,
    subTotal,
    taxes,
    additionalCharges,
    paymentMethods,
    billingAddress
  } = props.order

  const renderSummary = () => {
    return (
      <>
        <View style={[styles.summaryLine, styles.firstSummaryLine]}>
          <HeaderBody style={styles.label}>{strings.subtotal}</HeaderBody>
          <HeaderBody>{constant.moneyFormatter.format(subTotal)}</HeaderBody>
        </View>
        {additionalCharges.map((ac, index) => {
          return renderAdditionalCharges(ac, index)
        })}
        <View style={styles.summaryLine}>
          <HeaderBody style={styles.label}>{strings.tax}</HeaderBody>
          <HeaderBody>{constant.moneyFormatter.format(taxes)}</HeaderBody>
        </View>
        <View style={styles.summaryLine}>
          <HeaderBody style={styles.label}>{strings.total}</HeaderBody>
          <HeaderBody>{constant.moneyFormatter.format(total)}</HeaderBody>
        </View>
      </>
    )
  }

  const renderAdditionalCharges = (
    charge: OrderAdditionalChargesViewModel,
    index: number
  ) => {
    return (
      <View style={styles.summaryLine} key={`addCharge-${index}`}>
        <HeaderBody style={styles.label}>{charge.label}</HeaderBody>
        <HeaderBody>{constant.moneyFormatter.format(charge.total)}</HeaderBody>
      </View>
    )
  }

  const renderBillingInfo = () => {
    if (!billingAddress) {
      return null
    }

    const formattedPhone = billingAddress.phone
      .replace(/\D+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

    return (
      <>
        <Body>{billingAddress.name}</Body>
        <Body>{billingAddress.line1}</Body>
        {billingAddress.line2 ? <Body>{billingAddress.line2}</Body> : null}
        <Body>{`${billingAddress.city}, ${billingAddress.state} ${billingAddress.zip}`}</Body>
        <Body>{billingAddress.email}</Body>
        <Body>{formattedPhone}</Body>
      </>
    )
  }

  return (
    <View>
      <Divider centerText={strings.paymentInfo} />
      <View style={styles.paymentContainer}>
        {renderSummary()}
        <HeaderBody>{strings.paymentInfo}</HeaderBody>
        {paymentMethods.map((p, i) => {
          return <PaymentMethod payment={p} key={`paymentMethod-${i}`} />
        })}
        <HeaderBody style={styles.billingInfo}>
          {strings.billingInfo}
        </HeaderBody>
        {renderBillingInfo()}
      </View>
    </View>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    paymentInfo: 'Payment information',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    billingInfo: 'Billing information',
    ccLine1: '{0} ending in {1}',
    ccLine2: 'Expiration date {0}/{1}',
    gcLine1: 'ending in {0}',
    gcLine2: '${0}'
  }
})

const styles = StyleSheet.create({
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vh(10)
  },
  label: {
    color: colors.grayText,
    width: '75%'
  },
  firstSummaryLine: {
    marginTop: vh(25)
  },
  paymentContainer: {
    marginTop: vh(10)
  },
  paymentIcon: {
    marginRight: vw(20)
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vh(10)
  },
  billingInfo: {
    marginTop: vh(25),
    marginBottom: vh(10)
  }
})
