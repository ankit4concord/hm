import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import { RootReducerModal } from '@ecom/modals'
import SenderCard from '@ecom/components/SenderCard'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const PODdeliveryMethod = (props: any) => {
  const { podDeliveryOptions } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )
  const [selectedDelivery, setSelectedDelivery] = useState(
    podDeliveryOptions?.options
  )

  const onClose = () => {
    const selectedMethod = selectedDelivery.filter((c) => c.isSelected)
    props.closeBottomSheet(props.type, selectedMethod)
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.header}>{podDeliveryOptions?.heading}</Text>
          <Text style={styles.subHeader}>{podDeliveryOptions?.message}</Text>
          <View>
            {podDeliveryOptions?.options &&
              podDeliveryOptions?.options.map((item: any, index: any) => {
                return (
                  <SenderCard
                    {...item}
                    key={index}
                    selected={index === 0 ? true : false}
                    cardColor={colors.hmPurplelight}
                    textColor={colors.hmPurple}
                  />
                )
              })}
          </View>

          <View>
            <Button
              label="Close"
              buttonStyle={styles.btn}
              onPress={onClose}
              textStyle={undefined}
              buttonColor={colors.hmPurple}
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default PODdeliveryMethod

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20)
  },
  btn: {
    padding: vw(20)
  },
  header: {
    fontSize: vw(16),
    lineHeight: vh(19),
    textAlign: 'center',
    fontFamily: fonts.MEDIUM,
    marginBottom: vh(3)
  },
  subHeader: {
    textAlign: 'center',
    marginBottom: vh(30),
    lineHeight: vh(15),
    fontSize: vw(14),
    fontFamily: fonts.REGULAR
  }
})
