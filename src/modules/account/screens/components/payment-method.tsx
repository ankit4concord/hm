import { Icon } from '@ecom/components/icons'
import { Body } from '@ecom/components/typography'
import { OrderPaymentViewModel } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import { vh, vw } from '@ecom/utils/dimension'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import LocalizedStrings from 'react-native-localization'

interface CCProps {
  icon: string
  prettyString: string
}

const CC_MAP: Map<string, CCProps> = new Map([
  ['discover', { icon: 'cc_discover_svg', prettyString: 'Discover' }],
  ['americanexpress', { icon: 'cc_amex_svg', prettyString: 'AMEX' }],
  ['visa', { icon: 'cc_visa_svg', prettyString: 'Visa' }],
  ['mastercard', { icon: 'cc_mastercard_svg', prettyString: 'Mastercard' }]
])

const genericCard: CCProps = {
  icon: 'cc_generic_svg',
  prettyString: ''
}

interface PaymentMethodProps {
  payment?: OrderPaymentViewModel
}

export const PaymentMethod = (props: PaymentMethodProps) => {
  const { payment } = props
  if (!payment) {
    return null
  }

  const cardType = payment.cardType || ''
  const displayNum = payment.displayNumber || ''
  const amount = payment.chargeAmount || 0
  const email = payment.email || ''
  const month = payment.expireMonth || ''
  const year = payment.expireYear || ''

  let icon = genericCard.icon
  let line1 = ''
  let line2 = ''

  switch (payment.type) {
    case 'Credit Card':
      const truncatedYear = year.length === 4 ? year.slice(-2) : year
      const cc = CC_MAP.get(cardType.toLowerCase()) || {
        ...genericCard,
        ...{ prettyString: cardType }
      }
      icon = cc.icon
      line1 = strings.formatString(
        strings.ccLine1,
        cc.prettyString,
        displayNum
      ) as string
      line2 = strings.formatString(
        strings.ccLine2,
        month,
        truncatedYear
      ) as string
      break
    case 'Gift Card':
      icon = 'gift_card_svg'
      line1 = displayNum
        ? (strings.formatString(strings.gcLine1, displayNum) as string)
        : ''
      line2 = constant.moneyFormatter.format(amount)
      break
    case 'PayPal':
      icon = 'paypal_svg'
      line1 = email
      line2 = constant.moneyFormatter.format(amount)
      break
    default:
      return null
  }

  return (
    <View style={styles.paymentMethodContainer}>
      <View style={styles.paymentIcon}>
        <Icon
          name={icon}
          size={vw(35)}
          color={colors.hmPurple}
          fill={colors.white}
        />
      </View>
      <View>
        <Body>{line1}</Body>
        <Body>{line2}</Body>
      </View>
    </View>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    ccLine1: '{0} ending in {1}',
    ccLine2: 'Expiration date {0}/{1}',
    gcLine1: 'ending in {0}',
    gcLine2: '${0}'
  }
})

const styles = StyleSheet.create({
  paymentIcon: {
    marginRight: vw(20)
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vh(10)
  }
})
