import {
  DeliveryDGcard,
  DeliveryMethodCard,
  EmailDeliveryCard,
  SenderRecipientItem,
  TextDeliveryCard
} from '@ecom/modules/shop/screens/Delivery/component'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from './icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import { Icon } from './icons'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

export default function CardInfo(props: any) {
  let {
    title = '',
    subtitle = '',
    customStyle = {},
    type,
    isCompleted,
    buttonText,
    back
  } = props.item
  let content = <></>
  const navigation = useNavigation()
  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )
  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  let cardSenderData: any = {}
  let cardRecipientData: any = {}
  if (cardDeliveryData) {
    cardSenderData = cardDeliveryData[2]?.formDetails
    cardRecipientData = cardDeliveryData[3]?.formDetails
  }
  const addressLine2 = cardSenderData?.addrLine2
    ? `\n${cardSenderData?.addrLine2}`
    : ``
  const rAddressLine2 = cardRecipientData?.addrLine2
    ? `\n${cardRecipientData?.addrLine2}`
    : ``
  if (cardDeliveryData) cardRecipientData = cardDeliveryData[3]?.formDetails

  const senderAddress = `${
    cardSenderData?.name.charAt(0).toUpperCase() +
    cardSenderData?.name?.slice(1)
  } ${
    cardSenderData?.lastName.charAt(0).toUpperCase() +
    cardSenderData?.lastName?.slice(1)
  } \n${cardSenderData?.addrLine1} ${addressLine2 ?? addressLine2} \n${
    cardSenderData?.city
  }, ${cardSenderData?.state} ${cardSenderData?.zipCode}`

  const recipientAddress = `${
    cardRecipientData?.name.charAt(0).toUpperCase() +
    cardRecipientData?.name?.slice(1)
  } ${
    cardRecipientData?.lastName.charAt(0).toUpperCase() +
    cardRecipientData?.lastName?.slice(1)
  } \n${cardRecipientData?.addrLine1} ${rAddressLine2 ?? rAddressLine2} \n${
    cardSenderData?.city
  }, ${cardRecipientData?.state} ${cardRecipientData?.zipCode}`
  switch (type) {
    case 'delivery':
      if (selectedProductType == 'D') {
        // content = <EmailDeliveryCard />
        content = <></>
      } else {
        content = (
          <DeliveryMethodCard
            title={'More shipping options available in checkout.'}
            ETA={'Arrives 11.10 - 11.17'}
          />
        )
      }
      break
    case 'deliveryChange':
      if (selectedProductType == 'D') {
        content = <></>
      } else {
        content = (
          <DeliveryMethodCard
            title={'More shipping options available in checkout.'}
            ETA={'Arrives 11.10 - 11.17'}
          />
        )
      }
      break
    case 'TextDelivery':
      content = <></>

      break
    case 'DeliveryYourAddress':
      title = 'Sender'
      subtitle = cardSenderData?.name
        ? `${cardSenderData?.name} ${cardSenderData?.lastName}`
        : ``

      content = <SenderRecipientItem content={senderAddress} />
      break
    case 'recipient':
      title = 'Recipient'
      subtitle = cardRecipientData?.name
        ? `${cardRecipientData?.name} ${cardRecipientData?.lastName}`
        : ``
      content = <SenderRecipientItem content={recipientAddress} />
      break
    case 'yourcard':
      content = <DeliveryDGcard />
      break
    case 'DeliveryEmailSenderAddress':
      title = 'Sender'
      subtitle = cardDeliveryData
        ? `${cardDeliveryData[1]?.formDetails?.senderFirstName} ${cardDeliveryData[1]?.formDetails?.senderLastName}`
        : ''
      break
    case 'DeliveryEmailReceiverAddress':
      title = 'Recipient'
      subtitle = cardDeliveryData
        ? cardDeliveryData[1]?.formDetails?.recipientEmailAddress
        : ''
      break
    default:
      content = <DeliveryDGcard />
      break
  }
  let Step = ({ indicator, isComplete }: any) => {
    return (
      <View
        style={{
          backgroundColor: colors.hmPurpleBorder,
          borderRadius: vw(20),
          width: vw(36),
          height: vw(36),
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {isComplete ? (
          <CircleIcon
            name={'hm_Check-thick'}
            circleColor={colors.darkPink}
            circleSize={vw(36)}
            iconSize={vw(15)}
            iconColor={colors.white}
          />
        ) : (
          <Text style={styles.indicator}>{indicator}</Text>
        )}
      </View>
    )
  }

  const cardClicked = () => {
    props.onCard(type)
  }
  const editClicked = () => {
    props.onEdit(type)
  }

  const addClicked = () => {
    props.onAdd(type)
  }
  const infoClicked = () => {
    props.onInfo(type)
  }
  const getIconType = () => {
    if (type === 'delivery' && subtitle !== 'Send via email' && isCompleted) {
      return (
        <TouchableOpacity style={styles.icon} onPress={infoClicked}>
          <CircleIcon
            name={'hm_QuestionMark-thin'}
            circleColor={colors.white}
            circleSize={vw(24)}
            iconSize={vw(11)}
            iconColor={colors.blackText}
            circleStyle={{
              borderWidth: 1,
              borderColor: colors.graylight
            }}
          />
        </TouchableOpacity>
      )
    } else {
      if (isCompleted) {
        return (
          <TouchableOpacity style={styles.icon} onPress={editClicked}>
            <CircleIcon
              name={'hm_EditText-thin'}
              circleColor={colors.graylight}
              circleSize={vw(25)}
              iconSize={vw(11)}
              iconColor={colors.black}
            />
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity style={styles.icon} onPress={addClicked}>
            <CircleIcon
              name={'hm_Add-thick'}
              circleColor={colors.darkPink}
              circleSize={vw(24)}
              iconSize={vh(10)}
              iconColor={colors.white}
            />
          </TouchableOpacity>
        )
      }
    }
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View>
            <View style={styles.backArrow}>
              {back && props.idx === 1 && (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CircleIcon
                      name={'hm_ArrowBack-thick'}
                      circleColor={colors.white}
                      circleSize={vw(36)}
                      iconSize={vw(18)}
                      circleStyle={{
                        borderWidth: 1,
                        borderColor: colors.graylight
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.stapper}>
              <Step
                key={props.idx + 1}
                index={props.idx}
                indicator={props.idx}
                isComplete={isCompleted}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <DropShadow style={styles.shadowContainer}>
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={cardClicked}
                style={customStyle}>
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => {
                      isCompleted ? editClicked() : addClicked()
                    }}>
                    <View style={styles.header}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          alignItems: 'center'
                        }}>
                        {(type === 'DeliveryYourAddress' ||
                          type === 'recipient' ||
                          type === 'DeliveryEmailSenderAddress' ||
                          type === 'DeliveryEmailReceiverAddress') &&
                          isCompleted && (
                            <View style={styles.subTextContainer}>
                              <Text style={styles.subTxt}>
                                {subtitle
                                  ? subtitle.charAt(0)?.toUpperCase()
                                  : 'A'}
                              </Text>
                            </View>
                          )}
                        <View
                          style={{
                            flex: 0.9,
                            justifyContent: 'center'
                          }}>
                          {subtitle?.length > 0 && isCompleted ? (
                            <>
                              <Text style={styles.title}>{title}</Text>
                              <Text style={styles.subTitle}>{subtitle}</Text>
                            </>
                          ) : (
                            <>
                              <Text style={styles.noTitle}>{buttonText}</Text>
                            </>
                          )}
                        </View>
                      </View>
                      <View>{getIconType()}</View>
                    </View>

                    {isCompleted && (
                      <View>
                        {content.type !== React.Fragment && (
                          <>
                            <View style={styles.partOfContainer} />
                            <View style={styles.body}>{content}</View>
                          </>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableHighlight>
            </DropShadow>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    paddingVertical: vh(5),
    justifyContent: 'center'
    // borderLeftWidth: 2
  },
  backArrow: {
    flex: 0.1,
    paddingRight: vw(20),
    alignItems: 'center',
    justifyContent: 'center'
  },
  stapper: {
    flex: 1,
    paddingRight: vw(20),
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: vw(10)
  },
  partOfContainer: {
    height: vh(2),
    backgroundColor: colors.lightpurple
  },
  title: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(14),
    letterSpacing: -0.03,
    paddingRight: vw(10),
    flexWrap: 'wrap'
  },
  subTitle: {
    flexWrap: 'wrap',
    fontFamily: fonts.MEDIUM,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontSize: vw(14),
    lineHeight: vh(17),
    letterSpacing: vw(-0.03),
    paddingRight: vw(10)
  },
  header: {
    padding: vw(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  indicator: {
    color: colors.hmPurple,
    fontSize: vw(14),
    lineHeight: vh(18)
  },
  backIcon: {
    width: vw(36),
    height: vh(36),
    resizeMode: 'contain'
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  body: {
    padding: vw(10)
  },
  noTitle: {
    fontFamily: fonts.MEDIUM,
    alignItems: 'center',
    fontSize: vw(14),
    lineHeight: vh(17),
    letterSpacing: vw(-0.03)
  },
  subTextContainer: {
    backgroundColor: colors.blue,
    borderWidth: vw(2),
    borderColor: colors.white,
    borderRadius: vw(20),
    width: vw(36),
    height: vw(36),
    marginRight: vw(10),
    alignItems: 'center',
    justifyContent: 'center'
    // resizeMode: 'contain'
  },
  subTxt: {
    color: colors.white,
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    alignItems: 'center',
    justifyContent: 'center'
  }
})
