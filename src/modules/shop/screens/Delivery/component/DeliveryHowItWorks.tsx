import { Image, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import { IconNames } from '@ecom/utils/mockData'
import React from 'react'
import SvgRender from '@ecom/components/SvgRender'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { updateDeliveryAsText } from '@ecom/modules/shop/action'
import { useDispatch } from 'react-redux'

const DeliveryHowItWorks = (props: any) => {
  const onbtnclick = () => {
    props?.onButtonPress(props)
  }
  const dispatch = useDispatch()
  return (
    <>
      <View style={styles.container}>
        <View>
          <Image
            source={localImages.howItWorks}
            style={{ width: vw(222), height: vh(261), resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            You chose send via text!Here's how it works.
          </Text>
          <Text style={[styles.subTitle]}>
            You can send the text after checkout, and you will always be able to
            re-send it, you'll find it under the My Account tab.
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            label="Go Back"
            buttonColor="transparent"
            textStyle={styles.btnTxt}
            buttonStyle={styles.btnCancel}
            onPress={() => {
              props?.closeBottomSheet(props?.type)
            }}
          />
          <Button
            label="Okay!"
            buttonColor={colors.hmPurple}
            buttonStyle={styles.btnOk}
            textStyle={styles.btnOkTxt}
            onPress={() => {
              dispatch(updateDeliveryAsText())
              props?.closeBottomSheet('TextDelivery')
            }}
          />
        </View>
      </View>
    </>
  )
}

export default DeliveryHowItWorks
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vh(10)
  },
  buttonWrapper: {
    flexDirection: 'row',
    paddingHorizontal: vw(20)
  },
  contentWrapper: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: vw(15),
    margin: 20
  },

  title: {
    textAlign: 'center',
    fontSize: vw(14),
    lineHeight: vh(18),
    marginBottom: vh(3),
    color: colors.black,
    fontFamily: fonts.MEDIUM
  },
  subTitle: {
    textAlign: 'center',
    fontSize: vw(14),
    lineHeight: vh(20),
    color: colors.black,
    marginBottom: vh(20),
    fontFamily: fonts.REGULAR
  },
  btnCancel: {
    flex: 0.5,
    borderWidth: 2,
    borderColor: colors.black,
    marginRight: vw(20),
    borderRadius: vw(30)
  },
  btnTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.black,
    fontSize: vw(16),
    lineHeight: vh(19),
    padding: vh(18)
  },
  btnOk: {
    flex: 0.4,
    borderRadius: vw(30)
    // paddingVertical: vh(20)
  },
  btnOkTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    padding: vh(18)
  }
})
