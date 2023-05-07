import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import DeliveryHowItWorks from './component/DeliveryHowItWorks'
import RecipientEmail from './RecipientEmail'
import RecipientReviewEmail from './RecipientReviewEmail'
import { RootReducerModal } from '@ecom/modals'
import SenderEmailTextCard from '@ecom/components/SenderEmailTextCard'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { isEmpty } from 'lodash'
import { senderCardList } from '@ecom/utils/mockData'
import { updateDeliveryAsText } from '../../action'

const DGDeliveryMethod = (props: any) => {
  const [selectedChild, setSelectedChild] = useState()
  const dispatch = useDispatch()
  const { digitalDeliveryOptions } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  // const [deliveryOptionsData, setDeliveryOptionsData] = useState(
  //   digitalDeliveryOptions
  // )
  const onButtonPressed = (item: any) => {
    if (item.type === 'text') {
      ACPCore.trackAction('Send via text', {
        ...adobeReducerState,
        'cd.sendText': '1'
      })
      dispatch(updateDeliveryAsText())
      props.closeBottomSheet(props?.type)
    } else {
      ACPCore.trackAction('Send via email', {
        ...adobeReducerState,
        'cd.sendEmail': '1'
      })
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
          return <RecipientEmail {...props} />
        case 'text':
          return <DeliveryHowItWorks {...props} />
      }
    }
    return getContent()
  }

  // useEffect(() => {
  //   setDeliveryOptionsData(digitalDeliveryOptions)
  // }, [digitalDeliveryOptions])
  return (
    <>
      <ScrollView>
        <View>
          {selectedChild ? (
            selectedChild
          ) : (
            <View style={styles.container}>
              <Text style={styles.title}>Send It Your Way</Text>
              <View>
                {digitalDeliveryOptions?.length &&
                  digitalDeliveryOptions?.map((item: any, index: any) => {
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
export default DGDeliveryMethod

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
    color: 'white',
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
    padding: 10,
    borderRadius: 30,
    width: 120,
    height: 40,
    marginTop: 40,
    marginLeft: 78
  }
})
