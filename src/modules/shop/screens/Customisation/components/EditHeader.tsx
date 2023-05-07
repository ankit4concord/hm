import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

const EditHeader = (props: any) => {
  const {
    title,
    handleBackFromCustomisation,
    handleThirdIcon,
    selectedTextInside,
    saveTextChanges,
    discardTextEditing
  } = props

  //   const navigation = () => {
  //     if (isOpen) {
  //       actionSheetRef.current.hide();
  //     } else {
  //       actionSheetRef.current.show();
  //       dispatch({ type: "IS_PHOTOEDIT_MODE", payload: false });
  //     }
  //   };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btncontainer}
        onPress={() => {
          handleBackFromCustomisation()
          if (selectedTextInside !== null) {
            discardTextEditing()
          }
        }}>
        <CircleIcon
          name={'hm_ArrowBack-thick'}
          circleColor={colors.white}
          circleSize={vw(45)}
          iconSize={vw(18)}
          iconColor={colors.txtBtnCancel}
          shadow={true}
          // circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
        />
        <Text style={styles.previewTextStyle}>BACK</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.btncontainer}
        onPress={() =>
          selectedTextInside !== null ? saveTextChanges() : handleThirdIcon()
        }>
        <CircleIcon
          name={'hm_Check-thick'}
          circleColor={colors.white}
          circleSize={vw(45)}
          iconSize={vw(14)}
          iconColor={colors.txtBtnCancel}
          shadow={true}
          // circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
        />
        <Text style={styles.previewTextStyle}>DONE</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditHeader
const styles = StyleSheet.create({
  btncontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'row',
    marginBottom: vh(30),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  previewTextStyle: {
    fontSize: vw(9),
    color: colors.lightGray,
    alignSelf: 'center',
    marginTop: vh(10),
    lineHeight: vh(10),
    fontFamily: fonts.BOLD,
    letterSpacing: vw(0.6)
  },
  title: {
    fontFamily: fonts.BOLD,
    fontSize: vw(16),
    lineHeight: vh(20),
    marginBottom: vh(15),
    color: colors.placeholderHomeScreen
  }
})
