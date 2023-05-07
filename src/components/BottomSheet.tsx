import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import RBSheet from 'react-native-raw-bottom-sheet'
import colors from '@ecom/utils/colors'

const BottomSheet = (props: any) => {
  const { sheetRef, children } = props
  const [height, setHeight] = useState(0)

  let nHeight = height === 0 ? '100%' : height
  const updateHeight = (e: any) => {
    if (height === 0) {
      setHeight(e.nativeEvent.layout.height)
    }
  }

  useEffect(() => {}, [children])

  return (
    <RBSheet
      ref={sheetRef}
      onClose={() => {
        setHeight(0)
      }}
      customStyles={{
        container: { ...styles.container, height: nHeight }
      }}>
      <View style={styles.grayChip}>
        <View style={styles.bottomSheet} />
      </View>
      <View onLayout={updateHeight}>{children}</View>
    </RBSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20),
    backgroundColor: colors.white
  },
  grayChip: {
    paddingTop: vh(8),
    alignItems: 'center'
  },
  bottomSheet: {
    flex: 1,
    width: vw(60),
    borderBottomColor: colors.bgLightGray,
    borderBottomWidth: 4,
    borderRadius: 3
  }
})

export default BottomSheet
