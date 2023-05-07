import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { Icon } from '@ecom/components/icons'
import React from 'react'
import colors from '@ecom/utils/colors'

const ImageEditor = (props: any) => {
  const { setActiveEditorOption, activeEditorOption } = props
  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1)
  }
  const editOptions = ['rotate', 'zoom', 'crop']

  return (
    <View style={styles.footerBtns}>
      {editOptions.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            {
              alignItems: 'center',
              justifyContent: 'space-between',
              height: vh(40),
              width: '20%'
            }
          ]}
          onPress={() => setActiveEditorOption(item)}>
          <Icon
            name={`hm_${capitalize(item)}-thin`}
            size={vw(20)}
            style={{
              color:
                activeEditorOption !== item ? colors.appBlack : colors.hmPurple
            }}
          />
          <Text
            style={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: vw(10),
              color:
                activeEditorOption === item ? colors.hmPurple : colors.appBlack
            }}>
            {item.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default ImageEditor
const styles = StyleSheet.create({
  footerBtns: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: vw(25),
    borderColor: 'transparent',
    backgroundColor: colors.white,
    padding: vw(10)
  }
})
