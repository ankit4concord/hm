import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const FooterInsiderPanel = (props: any) => {
  const { handleAddImage, handleAddText } = props
  return (
    <View style={styles.container}>
      <DropShadow style={styles.shadowBtn}>
        <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddImage}>
          <View style={styles.btnConatiner}>
            <CircleIcon
              name={'hm_Photo-thick'}
              circleColor={colors.hmPurpleBorder}
              circleSize={vw(35)}
              iconSize={vw(17)}
              iconColor={colors.hmPurple}
            />
            <Text style={styles.btnText}>Add Photos</Text>
          </View>
        </TouchableOpacity>
      </DropShadow>
      <DropShadow style={styles.shadowBtn}>
        <TouchableOpacity style={styles.addTxtBtn} onPress={handleAddText}>
          <View style={styles.btnConatiner}>
            <CircleIcon
              name={'hm_AddType-thick'}
              circleColor={colors.hmPurpleBorder}
              circleSize={vw(35)}
              iconSize={vw(13)}
              iconColor={colors.hmPurple}
            />
            <Text style={styles.btnText}>Add Text</Text>
          </View>
        </TouchableOpacity>
      </DropShadow>
    </View>
  )
}

export default FooterInsiderPanel
const styles = StyleSheet.create({
  shadowBtn: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  addPhotoBtn: {
    backgroundColor: colors.white,
    padding: vw(8),
    borderRadius: vw(30),
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    marginLeft: vw(10),
    paddingRight: vw(6),
    fontFamily: fonts.BOLD,
    fontSize: vw(14),
    lineHeight: vh(20)
  },
  addTxtBtn: {
    backgroundColor: colors.white,
    padding: vw(8),
    borderRadius: vw(30),
    marginLeft: vw(20),
    alignItems: 'center',
    justifyContent: 'center'
  }
})
