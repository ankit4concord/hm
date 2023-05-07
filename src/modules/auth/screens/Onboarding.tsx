import Carousel, { Pagination } from 'react-native-snap-carousel'
import { GetStarted, PrintOrDigital } from '@ecom/assets/svg'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/tracking'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import Lottie from 'lottie-react-native'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { loginAsGuest } from '../action'
import screenNames from '@ecom/utils/screenNames'
import screenTypes from '@ecom/utils/screenTypes'
import { useIsFocused } from '@react-navigation/native'

const Onboarding = (props: any) => {
  const corosalRef = createRef()
  const [activeIndex, setActiveIndex] = useState(0)
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
    if (appConfigValues?.adobe?.isAnalyticsEnabled && isFocused) {
      const level2 = 'Photo Cards'
      let onboardingTrackObj: AdobeObj = {
        'cd.pageName': `${screenTypes.ONBOARDING}>${level2}`,
        'cd.pageType': screenTypes.ONBOARDING,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level1': screenTypes.ONBOARDING,
        'cd.level2': level2,
        'cd.level3': ''
      }
      ACPCore.trackState(onboardingTrackObj['cd.pageName'], {
        ...adobeReducerState,
        ...onboardingTrackObj
      })
    }
  }, [isFocused])

  const snapItemCallback = (index: any) => {
    setActiveIndex(index)
    if (appConfigValues?.adobe?.isAnalyticsEnabled) {
      let level2 = ''
      switch (index) {
        case 0:
          level2 = 'Photo Cards'
          break
        case 1:
          level2 = 'Personalize It'
          break
        case 2:
          level2 = 'Delivered Your Way'
          break
        case 3:
          level2 = 'Welcome'
          break
      }
      let onboardingTrackObj: AdobeObj = {
        'cd.pageName': `${screenTypes.ONBOARDING}>${level2}`,
        'cd.pageType': screenTypes.ONBOARDING,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level1': screenTypes.ONBOARDING,
        'cd.level2': level2,
        'cd.level3': ''
      }
      ACPCore.trackState(onboardingTrackObj['cd.pageName'], {
        ...adobeReducerState,
        ...onboardingTrackObj
      })
    }
  }

  const _renderItem = ({ item, index }: any) => {
    return (
      <View style={styles.topContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.iconClose}
              onPress={() => {
                dispatch(loginAsGuest(() => {}))
                props.navigation.reset({
                  index: 1,
                  routes: [{ name: screenNames.BOTTOM_TAB }]
                })
              }}>
              <CircleIcon
                name={'hm_CloseLarge-thick'}
                circleColor={colors.white}
                circleSize={vw(36)}
                iconSize={vw(11)}
                circleStyle={{
                  borderWidth: 1,
                  borderColor: colors.graylight
                }}
              />
            </TouchableOpacity>

            {index == 0 ? (
              <View style={styles.logoContainer}>
                <Image
                  source={localImages.hallmark_logo_white}
                  style={styles.logoHm}
                />
              </View>
            ) : (
              <View style={styles.logoContainer}>
                <Image
                  source={localImages.hallmark_logo}
                  style={styles.logoHm}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.signinContainer}
              onPress={() =>
                props.navigation.replace(screenNames.AUTH_NAVIGATOR, {
                  screen: screenNames.LOGIN
                })
              }>
              <View style={styles.btnContainer}>
                <Text style={styles.btnSignInTxt}>Sign In</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {index == 0 && (
            <View
              style={{
                flex: 1
              }}>
              <ImageBackground
                resizeMode="stretch"
                style={styles.screensCarousel}
                source={localImages.onboarding1}>
                <View
                  style={{
                    // flex: 1,
                    paddingTop: vh(220),
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Lottie
                    source={localImages.onboarding}
                    autoPlay
                    loop
                    style={{ width: '100%' }}
                  />
                </View>
              </ImageBackground>
              <View style={styles.bottomContainer}>
                <Text style={styles.onbordingTitle1}>Photo Cards</Text>
                <Text style={styles.onbordingSubTitle1}>
                  For all of life’s special moments.
                </Text>
              </View>
            </View>
          )}

          {index == 1 && (
            <View
              style={{
                flex: 1
              }}>
              <ImageBackground
                resizeMode="stretch"
                style={styles.screensCarouselNext}
                source={localImages.onboarding2}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Lottie
                    source={localImages.onboarding2Lottie}
                    autoPlay
                    loop
                    style={{ width: '100%' }}
                  />
                </View>
              </ImageBackground>
              <View style={styles.bottomContainer}>
                <Text style={styles.onbordingTitle2}>Personalize it</Text>
                <Text style={styles.onbordingSubTitle1}>
                  Add your own words and photos.
                </Text>
              </View>
            </View>
          )}

          {index == 2 && (
            <View
              style={{
                flex: 1
              }}>
              <ImageBackground
                resizeMode="stretch"
                style={styles.screensCarouselNext3}
                source={localImages.onboarding3}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <PrintOrDigital height="100%" width="100%" />
                </View>
              </ImageBackground>
              <View style={styles.bottomContainer}>
                <Text style={styles.onbordingTitle3}>Delivered Your Way</Text>
                <Text style={styles.onbordingSubTitle3}>
                  Mail it to them—no postage required—or send for free by email
                  or text.
                </Text>
                {/* <Text style={styles.subtitl}> in the mail.</Text> */}
              </View>
            </View>
          )}

          {index == 3 && (
            <View
              style={{
                flex: 1
              }}>
              <ImageBackground
                resizeMode="stretch"
                style={styles.screensCarouselNext4}
                source={localImages.onboarding4}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <GetStarted
                    height={vh(300)}
                    width={vw(200)}
                    style={
                      {
                        // marginTop: vh(70)
                      }
                    }
                  />
                </View>
              </ImageBackground>
              <View style={styles.bottomWelcome}>
                <View style={styles.carouselContainerStyle}>
                  <Text style={styles.onbordingTitle4}>Welcome!</Text>
                  <Text style={styles.txt}>Get the most out of the app.</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.replace(screenNames.AUTH_NAVIGATOR, {
                      screen: screenNames.LOGIN,
                      params: { to: 1 }
                    })
                  }>
                  <View style={styles.bottomWelcomeContainer}>
                    <Text style={styles.btnTxt}>Create an Account</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.txtReady}>Ready to dive right in?</Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      loginAsGuest(() => {
                        props.navigation.reset({
                          index: 1,
                          routes: [{ name: screenNames.BOTTOM_TAB }]
                        })
                      })
                    )
                  }}>
                  <View style={styles.btnSkip}>
                    <Text style={styles.btnTxt}>Skip & Continue</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white, paddingBottom: vh(30) }}>
      <Carousel
        data={[0, 1, 2, 3]}
        ref={corosalRef}
        renderItem={_renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        contentContainerStyle={styles.carouselContainerStyle}
        inactiveSlideShift={0}
        onSnapToItem={(index) => snapItemCallback(index)}
        useScrollView={true}
      />
      <View style={styles.carouselContent}>
        {activeIndex != 0 ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              corosalRef.current.snapToPrev()
            }}>
            <CircleIcon
              name={'hm_ArrowBack-thick'}
              circleColor={colors.white}
              circleSize={vw(36)}
              iconSize={vw(18)}
              circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 0.1 }}></View>
        )}

        <View style={styles.paginationContainer}>
          <Pagination
            dotsLength={4}
            activeDotIndex={activeIndex}
            dotStyle={styles.dots}
            inactiveDotStyle={{ backgroundColor: colors.hmPurplelight }}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
            containerStyle={{
              paddingVertical: 0
            }}
          />
        </View>
        {activeIndex != 3 ? (
          <TouchableOpacity
            style={{ flex: 0.1 }}
            onPress={() => {
              corosalRef.current.snapToNext()
            }}>
            <CircleIcon
              name={'hm_ArrowForward-thick'}
              circleColor={colors.white}
              circleSize={vw(36)}
              iconSize={vw(18)}
              circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 0.1 }}></View>
        )}
      </View>
    </View>
  )
}

export default Onboarding

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative'
  },
  onbordingTitle1: {
    fontSize: vw(32),
    lineHeight: vh(36),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.MEDIUM,
    paddingBottom: vh(6)
  },
  onbordingSubTitle1: {
    fontSize: vw(14),
    lineHeight: vh(18),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.REGULAR,
    alignSelf: 'center'
  },
  onbordingTitle2: {
    fontSize: vw(32),
    lineHeight: vh(36),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.MEDIUM,
    paddingBottom: vh(10)
  },
  onbordingTitle3: {
    fontSize: vw(32),
    lineHeight: vh(36),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.MEDIUM,
    paddingBottom: vh(11)
  },
  onbordingTitle4: {
    fontSize: vw(32),
    lineHeight: vh(36),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.MEDIUM,
    paddingBottom: vh(24)
  },

  onbordingSubTitle3: {
    fontSize: vw(14),
    lineHeight: vh(18),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.REGULAR,
    alignSelf: 'center',
    paddingHorizontal: vw(60),
    textAlign: 'center'
  },
  container: {
    position: 'absolute',
    zIndex: 1,
    top: vh(50),
    left: vw(20),
    right: vw(20)
  },
  logoHm: {
    width: vw(100),
    height: vh(38),
    resizeMode: 'contain'
  },
  btnContainer: {
    backgroundColor: colors.white,
    paddingVertical: vh(12),
    paddingHorizontal: vw(14),
    borderRadius: vw(40)
  },
  btnSignInTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.txtBtnCancel,
    fontSize: vw(14),
    lineHeight: vh(17)
  },
  screensCarousel: {
    paddingTop: vh(100),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.7
  },
  screensCarouselNext: {
    paddingTop: vh(100),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.7
  },
  screensCarouselNext3: {
    paddingTop: vh(100),
    flex: 0.7
  },
  bottomContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  screensCarouselNext4: {
    paddingTop: vh(100),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5
  },
  bottomWelcome: {
    flex: 0.5,
    justifyContent: 'center',
    padding: vw(20)
  },
  txt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(18),
    paddingBottom: vh(8),
    color: colors.placeholderHomeScreen
  },
  txtReady: {
    fontFamily: fonts.REGULAR,
    paddingTop: vh(16),
    fontSize: vw(14),
    lineHeight: vh(18),
    paddingBottom: vh(8),
    textAlign: 'center',
    color: colors.placeholderHomeScreen
  },
  carouselContainerStyle: { alignItems: 'center', justifyContent: 'center' },
  carouselContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: vw(20)
  },
  iconContainer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  paginationContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dots: {
    width: vw(10),
    height: vh(10),
    borderRadius: vw(50),
    backgroundColor: colors.hmPurple,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomWelcomeContainer: {
    backgroundColor: colors.darkPink,
    paddingVertical: vh(18),
    alignItems: 'center',
    borderRadius: vw(30)
  },
  btnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.white
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnSkip: {
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(30)
  },
  logoContainer: {
    alignSelf: 'center',
    flex: 0.4,
    alignItems: 'center'
  },
  iconClose: { alignSelf: 'center', flex: 0.3 },
  signinContainer: { alignSelf: 'center', flex: 0.3, alignItems: 'flex-end' }
})
