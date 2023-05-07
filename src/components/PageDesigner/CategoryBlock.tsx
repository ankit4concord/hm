import { FlatList, StyleSheet } from 'react-native'

import CategoryTile from '@ecom/modules/shop/screens/Categories/CategoryTile'
import React from 'react'
import { vw } from '@ecom/utils/dimension'

const CategoryBlock = (props: any) => {
  return (
    <>
      {props?.item?.tiles?.length && (
        <FlatList
          numColumns={2}
          data={props?.item?.tiles}
          renderItem={CategoryTile}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
          columnWrapperStyle={styles.row}
          scrollEnabled={true}
          keyExtractor={(index) => index.toString()}
        />
      )}
    </>
  )
}

export default CategoryBlock
const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: vw(20)
  }
})
