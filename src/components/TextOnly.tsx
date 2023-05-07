import { FlatList, StyleSheet, View } from 'react-native'

import React from 'react'
import TextItem from './TextItem'
import { vh } from '../utils/dimension'

const TextOnly = ({ content }: any) => {
  return (
    <View style={styles.textView}>
      <FlatList
        data={content.text_only.text}
        renderItem={({ item }) => <TextItem content={item} />}
        keyExtractor={(id) => id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textView: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: vh(10),
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default TextOnly
