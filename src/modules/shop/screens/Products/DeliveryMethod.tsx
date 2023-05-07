import { CircleIcon, Icon } from '@ecom/components/icons'
import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/analytics'
import { RootReducerModal } from '@ecom/modals'
import { TouchableOpacity } from 'react-native-gesture-handler'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import strings from '@ecom/utils/strings'
import { updateProductType } from '../../action'
import { useIsFocused } from '@react-navigation/native'

const DeliveryMethod = (props: any) => {
  const { pdpDetail } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  useEffect(() => {
    // The screen is focused
    if (
      appConfigValues?.adobe?.isAnalyticsEnabled &&
      isFocused &&
      pdpDetail?.variations?.length
    ) {
      const pageName = `${adobeReducerState['cd.level1']}>${adobeReducerState['cd.level2']}>${strings.ChooseDeliveryOption}`
      let deliveryTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level3': strings.ChooseDeliveryOption
      }
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: deliveryTrackObj
      })
      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...deliveryTrackObj,
        'cd.trackAction': strings.ChooseDeliveryOption
      })
    }
  }, [isFocused])

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            // navigate(screenNames.SHOP_NAVIGATOR, {
            //   screen: screenNames.PLP,
            //   params: { from: 'redirect', category: 'mobile-app-categories' }
            // })
            props?.navigation.goBack()
          }>
          <CircleIcon
            name={'hm_ArrowBack-thick'}
            circleColor={colors.white}
            circleSize={vw(36)}
            iconSize={vw(18)}
            circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
          />
        </TouchableOpacity>
        <View style={styles.deliveryHeader}>
          <Text style={styles.deliveryHeaderTxt}>Choose Delivery Option</Text>
        </View>
      </View>
      <View
        style={{
          padding: vw(20),
          marginTop: vh(20)
        }}>
        {pdpDetail?.variations?.length ? (
          <>
            {pdpDetail?.variations.map((variation: any) => (
              <>
                {variation?.attributes?.customizationProductTypeCode === 'S' ? (
                  <View style={styles.containerContaint}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.containtHead}>
                          {variation?.heading}
                        </Text>
                        <Text style={styles.subTxt}>{variation?.message}</Text>

                        <TouchableOpacity
                          onPress={() => {
                            dispatch(
                              updateProductType(
                                variation?.attributes
                                  ?.customizationProductTypeCode
                              )
                            )
                            navigate(screenNames.LOAD_TEMPLATE, {
                              product_id: variation?.id,
                              editing: 'false',
                              trackAction: 'Mail Delivery',
                              productType: 'Photo Card',
                              productString: `${pdpDetail?.name};${variation?.id};1;${variation?.price}`
                            })
                          }}
                          style={styles.cardPriceBtn}>
                          <Text
                            style={
                              styles.cardPriceBtnTxt
                            }>{`Card - $${variation?.price}`}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.imageContainer}>
                        <View style={styles.imgInsideContainer}>
                          <Image
                            source={{ uri: variation?.imageURL }}
                            style={styles.mailDeliveryImage}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.borderBottom}></View>
                    <View style={styles.footerContainer}>
                      <View style={styles.footerContaint}>
                        <Icon
                          name={'hm_Check-thick'}
                          size={vw(10)}
                          style={styles.rightIcon}
                          color={colors.hmPurple}
                        />
                        <Text style={styles.footerTxt}>
                          {variation?.heading}
                        </Text>
                      </View>
                      <View style={styles.footerContaint}>
                        <Icon
                          name={'hm_Check-thick'}
                          size={vw(10)}
                          style={styles.rightIcon}
                          color={colors.hmPurple}
                        />
                        <Text style={styles.footerTxt}>
                          {variation?.arrival_dates}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.containerContaintPink}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.containtHeadTxt}>
                          Send instantly
                        </Text>
                        <Text style={styles.subText}>{variation?.message}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(
                              updateProductType(
                                variation?.attributes
                                  ?.customizationProductTypeCode
                              )
                            )
                            navigate(screenNames.LOAD_TEMPLATE, {
                              product_id: variation?.id,
                              editing: 'false',
                              trackAction: 'Digital Delivery',
                              productType: 'Digital Card',
                              productString: `${pdpDetail?.name};${variation?.id};1;${variation?.price}`
                            })
                          }}
                          style={styles.digitalDeliveryBtn}>
                          {/* <Text
                            style={
                              styles.label
                            }>{`Digital Delivery - $${variation?.price}`}</Text> */}
                          <Text
                            style={
                              styles.label
                            }>{`Digital Delivery - Free`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.previewBtnContainer}
                          onPress={() => {
                            dispatch(
                              updateProductType(
                                variation?.attributes
                                  ?.customizationProductTypeCode
                              )
                            )
                            let previewTrackObj: AdobeObj = {
                              'cd.pageName': `${adobeReducerState['cd.level1']}>${adobeReducerState['cd.level2']}>${strings.AnimationPreview}`,
                              'cd.previousPageName':
                                adobeReducerState['cd.pageName'],
                              'cd.level3': strings.AnimationPreview
                            }
                            dispatch({
                              type: actionNames.TRACK_STATE,
                              payload: previewTrackObj
                            })
                            ACPCore.trackState(previewTrackObj['cd.pageName'], {
                              ...adobeReducerState,
                              ...previewTrackObj,
                              'cd.previewTemplate': '1',
                              'cd.trackAction': 'Preview Animation'
                            })
                            navigate(screenNames.ANIMATION_PREVIEW_SCREEN, {
                              product_id: variation?.id,
                              productString: `${pdpDetail?.name};${variation?.id};1;${variation?.price}`
                            })
                          }}>
                          <Icon
                            name={'hm_Play-thick'}
                            size={vw(11)}
                            color={colors.deliveryBottomTxt}
                          />
                          <Text style={styles.previewBtnTxt}>
                            Preview Animation
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.imageContainer}>
                        <View style={styles.imgInsideContainer}>
                          <Image
                            source={{ uri: variation?.imageURL }}
                            style={styles.instantDeliveryImage}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.borderBottom}></View>
                    <View style={styles.footerContainer}>
                      <View style={styles.footerContaint}>
                        <Icon
                          name={'hm_Check-thick'}
                          size={vw(10)}
                          style={styles.rightIcon}
                          color={colors.rightRed}
                        />
                        <Text style={styles.deliveryBottomTxt}>
                          Sent via email or text
                        </Text>
                      </View>
                      <View style={styles.footerContaint}>
                        <Icon
                          name={'hm_Check-thick'}
                          size={vw(10)}
                          style={styles.rightIcon}
                          color={colors.rightRed}
                        />
                        <Text style={styles.deliveryBottomTxt}>
                          Arrives instantly
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </>
            ))}
          </>
        ) : (
          <></>
        )}
        {/* <View style={styles.containerContaint}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0.6 }}>
              <Text style={styles.containtHead}>Send by mail</Text>
              <Text style={styles.subTxt}>
                We’ll mail your card for free after you personalize it!
              </Text>

              <TouchableOpacity
                onPress={() => navigate(screenNames.LOAD_TEMPLATE)}
                style={styles.cardPriceBtn}>
                <Text style={styles.cardPriceBtnTxt}>Card - $4.99</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.4, justifyContent: 'flex-start' }}>
              <Image
                source={localImages.mail_delivery_method}
                style={styles.mailDeliveryImage}
              />
            </View>
          </View>
          <View style={styles.borderBottom}></View>
          <View style={styles.footerContainer}>
            <View style={styles.footerContaint}>
              <Image source={localImages.rightblue} style={styles.rightIcon} />
              <Text style={styles.footerTxt}>Free shipping</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={localImages.rightblue} style={styles.rightIcon} />
              <Text style={styles.footerTxt}>Arrives 10/11 - 10/17 </Text>
            </View>
          </View>
        </View>

        <View style={styles.containerContaintPink}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0.6 }}>
              <Text style={styles.containtHeadTxt}>Send instantly</Text>
              <Text style={styles.subText}>
                Your recipient gets a link to your creation instantly via text
                or email.
              </Text>
              <TouchableOpacity
                onPress={() => navigate(screenNames.LOAD_TEMPLATE)}
                style={styles.digitalDeliveryBtn}>
                <Text style={styles.label}>Digital Delivery - $1.99</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewBtnContainer}
                onPress={() => navigate(screenNames.ANIMATION_PREVIEW_SCREEN)}>
                <Image
                  source={localImages.playarrow}
                  style={styles.playarrow}
                />
                <Text style={styles.previewBtnTxt}>Preview Animation</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={localImages.instant_delivery_method}
                style={styles.instantDeliveryImage}
              />
            </View>
          </View>
          <View style={styles.borderBottom}></View>
          <View style={styles.footerContainer}>
            <View style={styles.footerContaint}>
              <Image source={localImages.rightred} style={styles.rightIcon} />
              <Text style={styles.deliveryBottomTxt}>
                Sent via email or text
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={localImages.rightred} style={styles.rightIcon} />
              <Text style={styles.deliveryBottomTxt}>Arrives instantly</Text>
            </View>
          </View>
        </View> */}
      </View>
    </View>
  )
}

export default DeliveryMethod
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: vw(20),
    marginVertical: vh(20),
    alignItems: 'center'
    // justifyContent: 'center'
  },
  deliveryHeaderTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.defaultTextcolor
  },

  deliveryHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.9
  },
  containerContaint: {
    backgroundColor: colors.hmPurpleLightBackground,
    padding: vw(20),
    marginBottom: vh(20),
    borderRadius: vw(10)
  },
  containtHead: {
    paddingBottom: vh(9),
    color: colors.hmPurple,
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(20)
  },
  subTxt: {
    paddingBottom: vh(16),
    color: colors.hmPurple,
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(16)
  },
  borderBottom: {
    borderBottomColor: colors.hmPurpleBorder,
    borderBottomWidth: 1,
    marginTop: vh(14)
  },
  footerContainer: {
    flexDirection: 'row',
    paddingTop: vh(13)
  },
  footerContaint: {
    flexDirection: 'row',
    marginRight: vw(15),
    alignItems: 'center'
  },
  rightIcon: {
    marginRight: vw(8.5)
    // alignItems: 'center',
    // justifyContent: 'center'
    // width: vw(15),
    // height: vh(15),
    // resizeMode: 'contain'
  },
  footerTxt: {
    fontSize: vw(12),
    color: colors.hmPurple,
    lineHeight: vh(16),
    fontFamily: fonts.MEDIUM
  },
  containerContaintPink: {
    backgroundColor: colors.pinkLightBackground,
    padding: vw(20),
    borderRadius: vw(10)
  },
  containtHeadTxt: {
    paddingBottom: vh(9),
    color: colors.deliveryHeadTxt,
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(20)
  },
  subText: {
    paddingBottom: vh(12),
    paddingRight: vw(5),
    color: colors.deliveryHeadTxt,
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(16)
  },
  label: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(17),
    color: colors.white,
    letterSpacing: 0
  },
  previewBtnContainer: {
    borderRadius: vw(50),
    paddingVertical: vh(12),
    paddingHorizontal: vw(15),
    width: 'auto',
    height: 'auto',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vh(10),
    flexWrap: 'wrap'
  },
  previewBtnTxt: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(17),
    letterSpacing: 0,
    color: colors.deliveryBottomTxt,
    marginLeft: vw(9)
  },
  deliveryBottomTxt: {
    fontSize: vw(12),
    color: colors.deliveryBottomTxt,
    lineHeight: vh(16),
    fontFamily: fonts.MEDIUM
  },
  instantDeliveryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgInsideContainer: {
    width: vw(130),
    height: vh(130),
    alignItems: 'center',
    justifyContent: 'center'
  },
  mailDeliveryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  digitalDeliveryBtn: {
    borderRadius: vw(50),
    paddingVertical: vh(12),
    paddingHorizontal: vw(10),
    backgroundColor: '#CE3B8C',
    alignSelf: 'flex-start',
    height: 'auto',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardPriceBtn: {
    borderRadius: vw(50),
    padding: vw(12),
    alignSelf: 'flex-start',
    height: 'auto',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.hmPurple
  },
  cardPriceBtnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(17),
    color: colors.white
  }
})
