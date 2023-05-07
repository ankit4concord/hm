import Accordian from './PageDesigner/Accordian'
import Banner from './PageDesigner/Banner'
import CategoryBlock from './PageDesigner/CategoryBlock'
import CategoryCarousel from './PageDesigner/CategoryCarousel'
import ContentCarousel from './PageDesigner/ContentCarousel'
import ProductCarousel from './PageDesigner/ProductCarousel'
import QuickTaps from './PageDesigner/QuickTaps'
import React from 'react'
import { View } from 'react-native'
import { vh } from '@ecom/utils/dimension'

const PageDesignerComponents = (props: any) => {
  const { item } = props
  return (
    <>
      {item &&
        item?.length &&
        item?.map((data: any, index: number) => {
          if (data?.type === 'banner')
            return (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <Banner item={data?.data} />
              </View>
            )
          else if (data?.type === 'category_carrousel')
            return (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <CategoryCarousel item={data?.data} />
              </View>
            )
          else if (data?.type === 'product_carrousel')
            return (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <ProductCarousel item={data?.data} />
              </View>
            )
          else if (data?.type === 'content_carrousel') {
            return data?.data?.tiles?.length > 0 ? (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <ContentCarousel item={data?.data} />
              </View>
            ) : null
          } else if (data?.type === 'accordion')
            return (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <Accordian item={data?.data} />
              </View>
            )
          else if (data?.type === 'quick_taps')
            return (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <QuickTaps item={data?.data} />
              </View>
            )
          else if (data?.type === 'category_block')
            return (
              <View
                style={{ marginBottom: vh(30) }}
                key={`${data?.type}-${index}`}>
                <CategoryBlock item={data?.data} />
              </View>
            )
        })}
    </>
  )
}

export default PageDesignerComponents
