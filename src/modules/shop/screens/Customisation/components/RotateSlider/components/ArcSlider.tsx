import { useEffect, useRef, useState } from 'react'

import ArcSliderBase from './ArcSliderBase'
import React from 'react'
import colors from '@ecom/utils/colors'
import { scaleLinear } from 'd3-scale'
import { vw } from '@ecom/utils/dimension'

const ArcSlider = ({ onChange, degree }: any) => {
  const [value, setValue] = useState(50)
  let draggingRef = useRef(false)

  const minAngle = 140,
    maxAngle = 220

  let angles = [(minAngle * 100) / 360, (maxAngle * 100) / 360]
  let degrees = [-180, 180]

  const scale = scaleLinear().domain(angles).range(degrees)
  const scaleR = scaleLinear().domain(degrees).range(angles)

  let updateValue = (val: any) => {
    draggingRef.current = true
    setValue(val)
    let deg = Math.round(scale(val) * -1)
    onChange(deg)
  }
  let onEnd = (val) => {
    draggingRef.current = false
  }

  useEffect(() => {
    if (draggingRef.current) return
    setValue(scaleR(degree * -1))
  }, [degree])

  return (
    <ArcSliderBase
      value={value}
      onChange={updateValue}
      onEnd={onEnd}
      minAngle={minAngle}
      maxAngle={maxAngle}
      trackRadius={vw(240)}
      thumbRadius={vw(5)}
      thumbColor={'black'}
      trackWidth={vw(400)}
      trackColor={'transparent'}
      trackTintColor={'transparent'}
      // trackTintColor={'#fff'}
      fillColor={'transparent'}
    />
  )
}
export default ArcSlider
