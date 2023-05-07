import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const PreviewHeader = (props: any) => {
  const {
    handleBackFromCustomisation,
    handleThirdIcon,
    activeHeaderOption,
    handleEditorClicked
  } = props
  const options = ['EDITOR', 'PREVIEW']

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: vw(60),
        marginBottom: vh(30),
        marginTop: vh(10)
      }}>
      <TouchableOpacity onPress={handleBackFromCustomisation}>
        <CircleIcon
          name={'hm_CloseLarge-thick'}
          circleColor={colors.white}
          circleSize={vw(45)}
          iconSize={vw(14)}
          iconColor={colors.txtBtnCancel}
          shadow={true}
        />
        <Text style={styles.previewTextStyle}>CANCEL</Text>
      </TouchableOpacity>
      {options.map((item) => (
        <TouchableOpacity
          onPress={item === 'PREVIEW' ? handleThirdIcon : handleEditorClicked}>
          <CircleIcon
            name={item === 'PREVIEW' ? 'hm_Preview-thick' : 'hm_Editor-thick'}
            circleColor={
              activeHeaderOption === item ? colors.darkPink : colors.white
            }
            iconColor={
              activeHeaderOption === item ? colors.white : colors.lightGray
            }
            circleSize={vw(45)}
            iconSize={vh(21)}
            shadow={activeHeaderOption === item ? false : true}
          />
          <Text
            style={{
              fontSize: vw(9),
              lineHeight: vh(10),
              fontFamily: fonts.BOLD,
              alignSelf: 'center',
              marginTop: vh(10),
              letterSpacing: vw(0.6),
              color:
                activeHeaderOption === item
                  ? colors.headerTxtColor
                  : colors.lightgray
            }}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default PreviewHeader
const styles = StyleSheet.create({
  topHeaderIcon: {
    width: vw(60),
    height: vh(60),
    resizeMode: 'contain'
  },
  activeStyles: {
    width: vw(57),
    height: vh(57),
    resizeMode: 'contain'
  },
  previewPink: {
    width: vw(40),
    height: vw(40),
    margin: vh(10),
    resizeMode: 'contain'
  },
  previewTextStyle: {
    fontSize: vw(9),
    lineHeight: vh(10),
    fontFamily: fonts.BOLD,
    color: colors.lightgray,
    alignSelf: 'center',
    marginTop: vh(10),
    letterSpacing: vw(0.6)
  }
})
