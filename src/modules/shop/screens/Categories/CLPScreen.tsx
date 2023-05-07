import { StyleSheet, View } from 'react-native'

import CategoryHeader from './CategoryHeader'
import Loader from '@ecom/components/Loader'
import PageDesignerComponents from '@ecom/components/PageDesignerComponents'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import { ScrollView } from 'react-native-gesture-handler'
import colors from '@ecom/utils/colors'
import { useSelector } from 'react-redux'
import { vw } from '@ecom/utils/dimension'

export function CLPScreen() {
  const { clpPageDesignerData } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const { categoryLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )

  return (
    <>
      {categoryLoading ? (
        <Loader />
      ) : clpPageDesignerData?.length ? (
        <View style={styles.mainContainer}>
          <CategoryHeader />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20 }}>
            <PageDesignerComponents item={clpPageDesignerData} />
          </ScrollView>
        </View>
      ) : (
        <></>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: vw(20)
  }
})
