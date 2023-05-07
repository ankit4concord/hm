import React from 'react'
import { SvgXml } from 'react-native-svg'
import { svgIconsList } from '@ecom/utils/mockData'

export default function SvgRender(props: any) {
  const svgData = `${svgIconsList[props.icon]}`
  const SvgImage = () => (svgData ? <SvgXml xml={svgData} /> : <></>)
  return <SvgImage />
}
