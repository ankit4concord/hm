import React from 'react'
import SvgIcon from 'react-native-svg-icon'
import colors from '@ecom/utils/colors'
import svgs from './Svg' // point to your svgs.js wherever that may be
const LocalSvgIcon = (props: any) => <SvgIcon {...props} svgs={svgs} />
export default LocalSvgIcon
LocalSvgIcon.defaultProps = {
  stroke: colors.black,
  fill: 'transparent',
  strokeWidth: '2',
  viewBox: '0 0 26 26'
}
