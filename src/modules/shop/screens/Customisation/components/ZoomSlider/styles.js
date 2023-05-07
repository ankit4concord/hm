import { screenWidth, vw } from '@ecom/utils/dimension'

import { StyleSheet } from 'react-native'
import fonts from '@ecom/utils/fonts'

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'black',
    width: vw(8),
    height: vh(8),
    borderRadius: vw(50)
  },
  vertical_line: {
    backgroundColor: 'black',
    marginTop: 'auto',
    marginBottom: 'auto'
    // position:"relative"
  },
  zoom_slider: {
    // flex: 1,
    width: screenWidth,
    marginTop: vh(50),
    position: 'absolute'
    // height:50,
    // borderWidth:1,
    // justifyContent:"center",
    // alignItems:"center",
    // backgroundColor:'red'
  },
  slider_lines: {
    flexDirection: 'row'
    // borderWidth: 1,
    // flex: 1
    // left: 45,
  },
  percentage_wrapper: {
    flex: 1,
    alignItems: 'center'
    // top: 370,
    // top: "3%",
  },
  percentage_view: {
    height: vw(43),
    width: vw(43),
    borderRadius: vw(22),
    borderWidth: vw(1),
    borderColor: '#0000001A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  percentage: {
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM
  }
})

export default styles
