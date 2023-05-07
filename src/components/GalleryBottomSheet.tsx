import { StyleSheet, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import RBSheet from 'react-native-raw-bottom-sheet'
import React from 'react'
import colors from '@ecom/utils/colors'

const GalleryBottomSheet = (props: any) => {
  const { sheetRef, children } = props
  return (
    <RBSheet
      ref={sheetRef}
      customStyles={{ container: styles.container }}
      closeOnPressMask={false}>
      <View
        style={{
          paddingTop: vh(8)
        }}>
        <View
          style={{
            width: vw(60),
            borderBottomColor: colors.bgLightGray,
            borderBottomWidth: 4,
            borderRadius: 3
          }}
        />
      </View>
      {children}
    </RBSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default GalleryBottomSheet
