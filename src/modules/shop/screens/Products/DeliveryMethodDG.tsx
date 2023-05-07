import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DeliveryHowItWorks from '../Delivery/component/DeliveryHowItWorks'
import RecipientEmail from './RecipientEmail'
import RecipientReviewEmail from '../Delivery/RecipientReviewEmail'
import { RootReducerModal } from '@ecom/modals'
import SenderEmailTextCard from '@ecom/components/SenderEmailTextCard'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { senderCardList } from '@ecom/utils/mockData'
import { useSelector } from 'react-redux'

const DeliveryMethod = (props: any) => {
  const [selectedChild, setSelectedChild] = useState()
  const onButtonPressed = (item: any) => {
    if (item.type) {
      const model = getModalContent(item.type)
      setSelectedChild(model)
    }
  }

  const onSubmit = () => {
    const reviewEmail = <RecipientReviewEmail {...props} />
    setSelectedChild(reviewEmail)
  }
  const getModalContent = (type: any) => {
    const getContent = () => {
      switch (type) {
        case 'email':
          return <RecipientEmail submit={onSubmit} />
        case 'text':
          return <DeliveryHowItWorks />
      }
    }
    return getContent()
  }
  const { digitalDeliveryOptions } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )

  return (
    <>
      <ScrollView>
        <View>
          {selectedChild ? (
            selectedChild
          ) : (
            <View style={styles.container}>
              <Text style={styles.title}>Choose delivery method</Text>
              <View>
                {senderCardList &&
                  senderCardList.map((item, index) => {
                    return (
                      <SenderEmailTextCard
                        {...item}
                        key={index}
                        cardColor={colors.lightpink}
                        textColor={colors.deliveryHeadTxt}
                        onButtonPress={onButtonPressed}
                      />
                    )
                  })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  )
}
export default DeliveryMethod

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(17),
    marginTop: vh(20),
    marginBottom: vh(20),
    textAlign: 'center'
  },
  buttonText: {
    color: colors.white,
    marginLeft: vw(5),
    fontSize: vw(15)
  },
  buttonEmail: {
    backgroundColor: colors.darkPink,
    padding: vw(10),
    borderRadius: vw(30),
    width: vw(130),
    height: vh(40),
    marginTop: vh(40),
    marginLeft: vw(35)
  },
  buttonSendText: {
    backgroundColor: '#CE3B8C',
    padding: vw(10),
    borderRadius: vw(30),
    width: vw(120),
    height: vh(40),
    marginTop: vh(40),
    marginLeft: vw(78)
  }
})
