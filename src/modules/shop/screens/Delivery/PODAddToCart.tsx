import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  addToCart,
  digitalSends,
  getDigitalDeliveryOptions,
  getPODDeliveryOptions
} from '../../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import BottomSheet from '@ecom/components/BottomSheet'
import Button from '@ecom/components/Button'
import CardInfo from '@ecom/components/CardInfo'
import DGDeliveryMethod from './DGDeliveryMethod'
import DeliveryMethod from './DeliveryMethod'
import DeliveryRecipient from './DeliveryRecipient'
import DeliveryYourAddress from './DeliveryYourAddress'
import Loader from '@ecom/components/Loader'
import PODdeliveryMethod from './PODdeliveryMethod'
import RecipientEmail from './RecipientEmail'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'

// import { useSelector } from 'react-redux'

export default function PODAddTOCart(props: any) {
  const BSheetRef = useRef(null)
  const dispatch = useDispatch()
  let cardType = ''
  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )

  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )

  if (selectedProductType == 'D') {
    cardType = 'DIGITAL'
  } else {
    cardType = 'POD'
  }

  const { isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  // const { pdpDetail } = useSelector(
  //   (state: RootReducerModal) => state.categoryReducer
  // )
  const [selectedChild, setSelectedChild] = useState()
  const [selectedType, setSelectedType] = useState()
  const [cardData, setCardData] = useState(cardDeliveryData)

  const bottomSheet = (type: any) => {
    if (type) {
      setSelectedType(type)
      const model = getModalContent(type)
      setSelectedChild(model)
    }
  }
  useEffect(() => {
    OpenBottomSheet()
  }, [selectedChild])

  useEffect(() => {
    if (selectedProductType == 'D') {
      dispatch(getDigitalDeliveryOptions())
    } else {
      dispatch(getPODDeliveryOptions())
    }
  }, [])

  const OpenBottomSheet = () => {
    if (BSheetRef.current != null) {
      BSheetRef.current.open()
    }
  }
  const CloseBottomSheet = (currentType: any, data: any) => {
    if (currentType) {
      cardData
        .filter((c) => c.type === currentType)
        .map((it: any) => {
          it.isCompleted = true
          switch (currentType) {
            case 'DeliveryYourAddress':
              it.Heading = 'Sender'
              it.Message = 'Joseph Smith'
              break
            case 'recipient':
              it.Heading = 'Recipient'
              it.Message = 'Laura Davis'
              break
            default:
              it.Heading = data && data[0] ? data[0].Heading : ''
              break
          }
        })

      setCardData([...cardData])
    }

    if (BSheetRef.current != null) {
      BSheetRef.current.close()
    }
  }

  const onPressed = () => {
    let checkSteps = cardData.find((c) => !c.isCompleted)
    if (checkSteps) {
      setSelectedType(checkSteps.type)
      bottomSheet(checkSteps.type)
    } else {
      if (cardType != 'DIGITAL') {
        dispatch(
          addToCart((res) => {
            console.log('response', res)
          })
        )
      } else {
        dispatch(
          digitalSends((res: any) => {
            if (res != '' || res != 500)
              if (cardData[1].type === 'TextDelivery')
                Linking.openURL(
                  `sms:&body=Send Card to your loved ones message ${res}`
                )

            navigate(screenNames.SUCCESS_DIGITAL_SEND)
            console.log('Instant send API CALL', res)
          })
        )
      }
    }
  }
  const onCardClick = () => {}

  const onEditClick = (type: any) => {
    if (type !== 'yourcard') {
      setSelectedType(type)
      bottomSheet(type)
    }
  }
  const onAddClick = (type: any) => {
    let checkSteps = cardData.find((c) => !c.isCompleted)
    if (checkSteps) {
      if (checkSteps.type === type) {
        setSelectedType(type)
        bottomSheet(type)
      } else {
        checkStepStatus()
      }
    }
  }
  const onInfoClick = (type: any) => {
    bottomSheet(type)
  }

  const checkStepStatus = () => {
    let checkSteps = cardData.find((c) => !c.isCompleted)
    if (checkSteps) {
      return checkSteps.buttonText
    } else if (cardType === 'DIGITAL') {
      return `Send ${
        cardData[1].type === 'TextDelivery' ? 'Text' : 'Email'
      } Now`
    } else {
      return 'Add to Bag'
    }
  }

  useEffect(() => {}, [selectedType])

  const getModalContent = (type: any) => {
    const getContent = () => {
      switch (type) {
        case 'yourcard':
          return <></>
        case 'DeliveryYourAddress':
          return (
            <DeliveryYourAddress
              type={type}
              closeBottomSheet={CloseBottomSheet}
            />
          )
        case 'delivery':
          return cardType === 'POD' ? (
            <PODdeliveryMethod
              type={type}
              closeBottomSheet={CloseBottomSheet}
            />
          ) : (
            <DGDeliveryMethod type={type} closeBottomSheet={CloseBottomSheet} />
          )
        case 'TextDelivery':
          return (
            <DGDeliveryMethod type={type} closeBottomSheet={CloseBottomSheet} />
          )

        case 'recipient':
          return (
            <DeliveryRecipient
              type={type}
              closeBottomSheet={CloseBottomSheet}
            />
          )
        case 'DeliveryEmailSenderAddress':
          return (
            <RecipientEmail type={type} closeBottomSheet={CloseBottomSheet} />
          )
        case 'DeliveryEmailReceiverAddress':
          return (
            <RecipientEmail type={type} closeBottomSheet={CloseBottomSheet} />
          )
        default:
          return <></>
      }
    }
    return <BottomSheet sheetRef={BSheetRef}>{getContent()}</BottomSheet>
  }

  useEffect(() => {
    setCardData(cardDeliveryData)
  }, [selectedType, cardDeliveryData])

  const { addtocartLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingTop: vh(20), paddingBottom: vh(10) }}>
        {!addtocartLoading && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {cardData &&
                cardData.map((item, index) => {
                  return (
                    <>
                      {item?.show && (
                        <CardInfo
                          idx={index + 1}
                          key={index * 2}
                          item={item}
                          onCard={onCardClick}
                          onEdit={onEditClick}
                          onAdd={onAddClick}
                          onInfo={onInfoClick}
                        />
                      )}
                    </>
                  )
                })}
            </View>
          </ScrollView>
        )}
        {addtocartLoading && <Loader />}
      </View>
      <View style={{ flex: 0.08 }}>
        <Button
          label={checkStepStatus()}
          onPress={onPressed}
          buttonColor={
            cardType === 'DIGITAL' && !cardData.find((c) => !c.isCompleted)
              ? colors.darkPink
              : colors.hmPurple
          }
          buttonStyle={undefined}
          textStyle={undefined}
        />
      </View>
      {selectedChild}
      <></>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: vw(20),
    paddingTop: vh(20),
    flex: 1
  }
})
