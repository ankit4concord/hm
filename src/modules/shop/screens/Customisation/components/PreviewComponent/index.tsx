import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { DeliveryReducerModal, RootReducerModal } from '@ecom/modals'
import React, { createRef, useState } from 'react'
// import UnityView, { UnityModule } from 'react-native-unity-view'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import Button from '@ecom/components/Button'
import DropShadow from 'react-native-drop-shadow'
import { Icon } from '@ecom/components/icons'
import LinearGradient from 'react-native-linear-gradient'
import Loader from '@ecom/components/Loader'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { useSelector } from 'react-redux'

export default function LoadPreview({}) {
  const { previewTemplate, customisationTemplateData, personalizationStart } =
    useSelector((state: RootReducerModal) => state.customisationReducer)
  const { isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const { customisationLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const corosalRef = createRef()
  const [activeIndex, setActiveIndex] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )
  let cardRecipientAddId = cardDeliveryData[3]?.formDetails?.ra_id
  let cardSenderAddId = cardDeliveryData[3]?.formDetails?.sa_id

  let submit_button_label = 'Add Sending Info'

  if (selectedProductType === 'S') {
    submit_button_label = 'Start Addressing'
    if (cardRecipientAddId) {
      submit_button_label = 'Update Design'
    } else if (cardSenderAddId) {
      submit_button_label = 'Update Design'
    }
  }

  const closeNavigation = () => {
    navigate(screenNames.BOTTOM_TAB, {
      screen: screenNames.ACCOUNT_NAVIGATOR
    })
  }

  // const loadUnityModule = (projectData: any) => {
  //   UnityModule.postMessage(
  //     'DataReceiver',
  //     'LoadCustomizedDataFromURL',
  //     JSON.stringify(projectData)
  //   )
  //   UnityModule.addStringMessageListener((eventName) => {
  //     console.log(`Animation complete - ${eventName}`)
  //   })
  // }

  const showAnimation = () => {
    setShowPreview(false)
    ACPCore.trackAction('Preview Customization', {
      ...adobeReducerState,
      'cd.previewCustomization': '1',
      'cd.trackAction': 'Preview Customization'
    })
    const projectData = {
      projectId: customisationTemplateData?.project_id,
      templateType: 'portrait',
      previewMode: false,
      showCoverPreview: true,
      showReplayButton: true,
      cardPanelData: [
        {
          index: 0,
          panelUrl: previewTemplate[0]
        },
        {
          index: 1,
          panelUrl: previewTemplate[1]
        }
      ]
    }
    // loadUnityModule(projectData)
  }
  return (
    <>
      <SafeAreaView style={styles.container}>
        {customisationLoading && <Loader />}
        {showPreview ? (
          <>
            {selectedProductType !== 'S' && (
              <TouchableOpacity
                onPress={() => showAnimation()}
                style={{
                  position: 'absolute',
                  top: 0,
                  zIndex: 9999,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: screenWidth
                }}>
                <DropShadow
                  style={{
                    borderRadius: vw(50),
                    backgroundColor: colors.white,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: vw(15),
                    paddingVertical: vh(11),
                    flexDirection: 'row'
                  }}>
                  <Icon
                    name={'hm_Play-thick'}
                    size={vw(11)}
                    color={colors.grayText}
                    style={{ alignSelf: 'center', justifyContent: 'center' }}
                  />
                  <Text
                    style={{
                      paddingLeft: vw(8),
                      fontSize: vw(14),
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: colors.grayText,
                      fontFamily: fonts.BOLD
                    }}>
                    Play Animation
                  </Text>
                </DropShadow>
              </TouchableOpacity>
            )}
            <View style={styles.subContainerView}>
              <Carousel
                data={[0, 1, 2]}
                ref={corosalRef}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                onSnapToItem={(index) => setActiveIndex(index)}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      {!imageLoaded ? (
                        <View
                          style={{
                            alignSelf: 'center',
                            marginVertical: '50%'
                          }}>
                          <Image
                            onLoad={() => setImageLoaded(true)}
                            source={localImages.inAppLoaderPreview}
                            style={{
                              width: vw(116),
                              height: vw(116),
                              resizeMode: 'contain'
                            }}
                          />
                        </View>
                      ) : (
                        <View style={styles.carouselContainer}>
                          {index == 0 &&
                            previewTemplate &&
                            previewTemplate[0] && (
                              <ImageBackground
                                resizeMode="contain"
                                style={styles.previewImg}
                                source={{
                                  uri: previewTemplate[0]
                                }}>
                                {/* {sliderIndex === 1 && (
                               
                                )} */}
                              </ImageBackground>
                            )}
                          {index == 1 &&
                            previewTemplate &&
                            previewTemplate[1] && (
                              <View
                                style={{
                                  width: '200%',
                                  height: '100%',
                                  position: 'relative',
                                  marginLeft: activeIndex == 1 ? '10%' : '30%'
                                }}>
                                <ImageBackground
                                  resizeMode="contain"
                                  style={[
                                    styles.previewImg,
                                    {
                                      position: 'absolute',
                                      top: 0,
                                      left: vw(160),
                                      bottom: 0,
                                      right: 0
                                    }
                                  ]}
                                  source={{
                                    uri: previewTemplate[1]
                                  }}>
                                  <View
                                    style={{
                                      borderRightWidth: 1,
                                      borderRightColor: 'rgba(0,0,0,0.4)',
                                      height: '99.8%',
                                      zIndex: 11,
                                      position: 'relative'
                                    }}>
                                    <LinearGradient
                                      style={{
                                        width: vw(20),
                                        right: -20.7,
                                        height: '100%',
                                        zIndex: 1,
                                        position: 'absolute'
                                      }}
                                      start={{ x: 0, y: 0 }}
                                      end={{ x: 1, y: 0 }}
                                      colors={[
                                        'rgba(233, 233, 233, 1)',
                                        'rgba(255, 255, 255, 1)'
                                      ]}
                                      pointerEvents={'none'}
                                    />
                                    <LinearGradient
                                      style={{
                                        width: vw(20),
                                        height: '100%',
                                        zIndex: 1,
                                        right: 0,
                                        position: 'absolute'
                                      }}
                                      start={{ x: 0, y: 0 }}
                                      end={{ x: 1, y: 0 }}
                                      colors={['transparent']}
                                      pointerEvents={'none'}
                                    />
                                  </View>
                                </ImageBackground>
                              </View>
                            )}
                        </View>
                      )}
                    </>
                  )
                }}
                contentContainerStyle={styles.subContainerView}
                inactiveSlideShift={0}
                useScrollView={true}
              />
            </View>
            <View style={styles.paginationContainer}>
              <Pagination
                dotsLength={3}
                activeDotIndex={activeIndex}
                dotStyle={styles.dotStyle}
                inactiveDotStyle={styles.inactiveDotStyle}
                inactiveDotOpacity={1}
                inactiveDotScale={1}
              />
              {activeIndex == 0 ? (
                <View style={{ position: 'absolute', right: 0 }}>
                  <TouchableOpacity
                    style={styles.insideContainer}
                    onPress={() => {
                      corosalRef.current.snapToNext()
                    }}>
                    <Text style={styles.insideText}>Inside</Text>
                    <Icon
                      name={'hm_ChevronRight-thick'}
                      size={vh(12)}
                      color={colors.hmPurple}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={{ position: 'absolute', left: 15 }}>
                    <TouchableOpacity
                      style={{
                        display: 'flex',
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: vw(20),
                        marginVertical: vh(20)
                      }}
                      onPress={() => {
                        corosalRef.current.snapToPrev()
                      }}>
                      <Icon
                        name={'hm_ChevronLeft-thick'}
                        size={vh(12)}
                        color={colors.hmPurple}
                      />
                      <Text style={styles.insideText}>
                        {activeIndex == 1 ? 'Cover' : 'Left page'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {activeIndex == 1 && (
                    <View style={{ position: 'absolute', right: 0 }}>
                      <TouchableOpacity
                        style={{
                          display: 'flex',
                          alignSelf: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginHorizontal: vw(20),
                          marginVertical: vh(20)
                        }}
                        onPress={() => {
                          corosalRef.current.snapToNext()
                        }}>
                        <Text style={styles.insideText}>Right page</Text>
                        <Icon
                          name={'hm_ChevronRight-thick'}
                          size={vh(12)}
                          color={colors.hmPurple}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            {/* <UnityView
              style={{ flex: 0.9 }}
              onMessage={(event) => console.log(`OnUnityMessage: ${event}`)}
            /> */}
          </View>
        )}
        <View style={styles.btnContainer}>
          <Button
            label={`${submit_button_label}`}
            buttonColor={colors.hmPurple}
            textStyle={{ fontFamily: fonts.MEDIUM, color: colors.white }}
            buttonStyle={{}}
            onPress={() => {
              if (!isGuestMode) {
                navigate(screenNames.POD_ADDTOCART, {
                  customizationType: selectedProductType
                })
              } else {
                // navigate(screenNames.AUTH_NAVIGATOR, {

                //   screen: screenNames.LOGIN,
                //   params: { from: 'DigitalSend' }
                // })
                navigate(screenNames.AUTH_NAVIGATOR, {
                  screen: screenNames.LOGIN,
                  params: { to: 4, from: 'DigitalCheckout' }
                })
              }
            }}
          />
        </View>
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    paddingVertical: vh(20),
    position: 'relative',
    width: screenWidth - 0
  },
  subContainerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // overflow: 'hidden'
  },
  previewImg: {
    flex: 1,
    width: '100%',
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative'
  },
  dotStyle: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    marginHorizontal: vw(-10),
    backgroundColor: colors.hmPurple
  },
  inactiveDotStyle: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    backgroundColor: colors.hmPurplelight
  },
  btnContainer: {
    flex: 0.1,
    marginHorizontal: vw(35),
    marginBottom: vw(10)
  },
  insideText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: vw(14),
    lineHeight: vh(17),
    fontFamily: fonts.MEDIUM,
    color: colors.hmPurple,
    marginRight: vw(4),
    marginLeft: vw(4)
  },
  insideContainer: {
    display: 'flex',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: vw(20),
    marginVertical: vh(20)
  },

  imgContainer: {
    flex: 1
  }
})
