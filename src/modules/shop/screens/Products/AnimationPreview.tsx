import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useCallback, useEffect } from 'react'
// import UnityView, { UnityModule, MessageHandler } from 'react-native-unity-view'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/analytics'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { initialiseTemplate } from '../../action'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'
import strings from '@ecom/utils/strings'

// import { addEventListener } from '@react-native-community/netinfo'

function AnimationPreview(props: any) {
  const dispatch = useDispatch()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  const { productLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )

  const handleAnimationConfirmation = (handler: any) => {
    console.log(handler.name) // the message name
    console.log(handler.data) // the message data
  }

  // const loadUnityModule = (projectData: any) => {
  //   UnityModule.postMessage(
  //     'DataReceiver',
  //     'LoadCustomizedDataFromURL',
  //     JSON.stringify(projectData)
  //   )
  // }

  useEffect(() => {
    if (props?.route?.params?.product_id) {
      dispatch(
        initialiseTemplate(
          {
            product_id: props?.route?.params?.product_id,
            product_type_code: 'P',
            trackAction: props?.route?.params?.trackAction,
            productType: props?.route?.params?.productType,
            productString: props?.route?.params?.productString,
            source: 'AnimationPreview'
          },
          (res: any) => {
            if (res !== 'error') {
              let projectId = res?.project_id
              let panel1Url =
                res?.variables?.template_data?.Faces[0]?.PreviewUrl
              let panel2Url =
                res?.variables?.template_data?.Faces[1]?.PreviewUrl
              const projectData = {
                projectId: projectId,
                templateType: 'portrait',
                previewMode: false,
                showCoverPreview: true,
                showReplayButton: true,
                cardPanelData: [
                  {
                    index: 0,
                    panelUrl: panel1Url
                  },
                  {
                    index: 1,
                    panelUrl: panel2Url
                  }
                ]
              }
              // loadUnityModule(projectData)
            }
          }
        )
      )
    }
  }, [props?.route?.params?.product_id])

  return (
    <>
      {!productLoading ? (
        <>
          <View style={styles.container}>
            <View style={styles.containerHeader}>
              <TouchableOpacity onPress={() => props?.navigation?.goBack()}>
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
              <View style={styles.header}>
                <Text style={styles.headerTxt}>Animation Preview</Text>
              </View>
            </View>
            <View style={styles.imgContainer}>
              {/* <Image source={localImages.plp_img1} style={styles.images} /> */}
              {/* <UnityView 
                style={{ flex: 1 }}
                onUnityMessage={handleAnimationConfirmation}
              /> */}
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.footerContainer}
              onPress={() => {
                props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
                  screen: screenNames.LOAD_TEMPLATE,
                  params: {
                    product_id: props?.route?.params?.product_id,
                    trackAction: 'Personalize',
                    productType: 'Digital Card',
                    productString: props?.route?.params?.productString
                  }
                })
              }}>
              <Text style={styles.btnText}>Personalize It</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default AnimationPreview
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh(30)
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.9
  },
  headerTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.defaultTextcolor
  },
  btnText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  footerContainer: {
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(30),
    marginBottom: vh(30),
    marginHorizontal: vw(20)
  },
  imgContainer: {
    flex: 0.9
  },
  images: {
    width: '100%',
    height: '100%'
  }
})
