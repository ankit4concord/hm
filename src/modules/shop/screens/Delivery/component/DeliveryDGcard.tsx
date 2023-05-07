import { Image, ScrollView, Text, View } from 'react-native'

import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import localImages from '@ecom/utils/localImages'
import { useSelector } from 'react-redux'
import { vh } from '@ecom/utils/dimension'

export default function DeliveryDGcard() {
  const { previewTemplate } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )
  return (
    <>
      <ScrollView>
        <View>
          <Image
            style={{ height: vh(400), width: '100%', resizeMode: 'contain' }}
            source={{
              uri: previewTemplate?.length > 0 ? previewTemplate[0] : ''
            }}
          />
        </View>
      </ScrollView>
    </>
  )
}
