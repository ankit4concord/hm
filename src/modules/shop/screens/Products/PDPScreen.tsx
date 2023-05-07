import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Image, StyleSheet, Text, View } from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/tracking'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import CustomButton from '@ecom/components/CustomButton'
import DropShadow from 'react-native-drop-shadow'
import Icon from '@ecom/components/Icon'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import { TouchableOpacity } from 'react-native-gesture-handler'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import screenTypes from '@ecom/utils/screenTypes'
import strings from '@ecom/utils/strings'

const PDPHeader = (props: any) => (
  <View style={styles.pdpHeaderContainer}>
    <TouchableOpacity
      style={{
        // flexDirection: 'row',
        // alignItems: 'center',
        paddingLeft: vw(20)
        // justifyContent: 'center'
      }}
      onPress={() => props.navigation.goBack()}>
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
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        marginRight: vw(60),
        justifyContent: 'center'
      }}>
      <Text style={styles.headerTxt}>Card Preview</Text>
    </View>
  </View>
)
export function PDPScreen(props: any) {
  const { pdpDetail } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const [carsouleImageData, setCarsouleImageData] = useState<any>([])
  const [imageData, setImageData] = useState<any>([])
  const { shopLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const corosalRef = createRef()
  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const { componentClicked } = useSelector(
    (state: RootReducerModal) => state.homeReducer
  )
  const { externalCampaignCode, icid } = useSelector(
    (state: RootReducerModal) => state.miscReducer
  )

  useEffect(() => {
    if (pdpDetail && pdpDetail?.c_imageUrls?.length > 0) {
      let imageData = pdpDetail?.c_imageUrls?.map((item: any) => {
        return { url: item }
      })
      setCarsouleImageData(imageData)
      setImageData(imageData)
    }
  }, [pdpDetail])

  useEffect(() => {
    if (appConfigValues?.adobe?.isAnalyticsEnabled && pdpDetail.name !== '') {
      const pageName = `Cards>Greeting Cards>${pdpDetail.name}`
      let pdpTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.pageType': screenTypes.PDP,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level1': pdpDetail.pdpLevel1,
        'cd.level2': pdpDetail.pdpLevel2,
        'cd.level3': pdpDetail.name
      }
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: pdpTrackObj
      })

      if (componentClicked) {
        pdpTrackObj['cd.trackAction'] = componentClicked
        dispatch({
          type: actionNames.HOME_REDUCER,
          payload: {
            componentClicked: ''
          }
        })
      }
      if (externalCampaignCode) {
        pdpTrackObj['cd.campaign'] = externalCampaignCode
        dispatch({
          type: actionNames.MISC_INFO,
          payload: { externalCampaignCode: undefined }
        })
      }
      if (icid) {
        pdpTrackObj['cd.icid'] = icid
        dispatch({
          type: actionNames.MISC_INFO,
          payload: { icid: undefined }
        })
      }

      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...pdpTrackObj
      })
    }
  }, [pdpDetail.name])

  return (
    <View style={styles.pdpContainer}>
      {shopLoading && <Loader />}

      {!shopLoading && (
        <>
          <PDPHeader {...props} />
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              {carsouleImageData &&
                !shopLoading &&
                carsouleImageData?.length > 0 && (
                  <Carousel
                    ref={corosalRef}
                    data={carsouleImageData}
                    renderItem={({ item }: any) => (
                      <DropShadow style={styles.dropShadow}>
                        <Image
                          source={{ uri: item.url }}
                          style={styles.imgCarousel}
                        />
                      </DropShadow>
                    )}
                    contentContainerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    containerCustomStyle={{
                      marginLeft: vw(10),
                      marginRight: vw(10),
                      paddingBottom: vh(5),
                      paddingTop: vh(5)
                    }}
                    sliderWidth={vw(screenWidth - 40)}
                    itemWidth={vw(screenWidth - 40)}
                    onSnapToItem={(index) => setActiveIndex(index)}
                  />
                )}
              {carsouleImageData && carsouleImageData?.length > 0 && (
                <Pagination
                  dotsLength={carsouleImageData?.length}
                  activeDotIndex={activeIndex}
                  dotStyle={styles.dotstyle}
                  inactiveDotStyle={styles.inactiveDot}
                  inactiveDotOpacity={1}
                  inactiveDotScale={1}
                  containerStyle={{
                    marginTop: vh(15),
                    paddingVertical: vh(5)
                  }}
                />
              )}
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: vh(20),
                marginHorizontal: vw(10)
              }}>
              <CustomButton
                extraStyle={styles.pdpFooterBtn}
                onPress={() => {
                  navigate(screenNames.DELIVERY_METHOD_SCREEN)
                }}
                label={`Choose Delivery Method`}
                labelExtraStyle={styles.btnTxt}
              />
            </View>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageContainer: {
    paddingVertical: vh(20),
    flex: 1
  },
  headerTxt: {
    fontSize: vw(16),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(40),
    letterSpacing: 0.03,
    textAlign: 'center'
  },
  btnTxt: {
    color: colors.white,
    fontSize: vw(16),
    textAlign: 'center',
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(19),
    letterSpacing: 0
  },
  pdpFooterBtn: {
    borderRadius: vw(30),
    width: '90%'
  },
  pdpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vh(20),
    paddingBottom: vh(20)
  },
  imgCarousel: {
    width: '95%',
    height: '100%',
    resizeMode: 'contain'
  },
  dotstyle: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    marginHorizontal: vw(-10),
    backgroundColor: colors.hmPurple
  },
  inactiveDot: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    backgroundColor: colors.hmPurplelight
  },
  pdpHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
