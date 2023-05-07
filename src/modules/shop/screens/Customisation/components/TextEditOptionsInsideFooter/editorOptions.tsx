import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
// import AlignRightIcon from 'react-native-vector-icons/Feather'
import React, { useEffect } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons'
import colors from '@ecom/utils/colors'
import config from './config.json'
import fontFamilies from '@ecom/utils/fontFamilies'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

export default function EditorOptions(props: any) {
  const {
    editTextInside,
    functionality,
    elements,
    isEditMode,
    selectedTextInside
  } = props

  useEffect(() => {
    let targetIndex = fontFamilies.findIndex(
      (obj) => elements[selectedTextInside]?.fontId === obj?.id
    )

    if (targetIndex !== -1) {
      let target = fontFamilies.splice(targetIndex, 1)[0]
      fontFamilies.unshift(target)
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <View>
        {functionality === 'font' && (
          <View style={{ flexDirection: 'row' }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={fontFamilies}
              renderItem={({ item }) => {
                return (
                  <View style={styles.fontContainer}>
                    <Text
                      style={{
                        paddingVertical: vh(30),
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: vh(22),
                        lineHeight: vh(15),
                        fontFamily: item.postScriptKey
                      }}
                      onPress={() => {
                        editTextInside({
                          editType: 'fontId',
                          value: item?.id
                        })
                      }}>
                      {item.name}
                    </Text>
                    {elements[selectedTextInside]?.fontId === item?.id ? (
                      <CircleIcon
                        name={'hm_Check-thick'}
                        circleColor={colors.green}
                        circleSize={vw(20)}
                        iconSize={vw(10)}
                        iconColor={colors.white}
                      />
                    ) : null}
                  </View>
                )
              }}
            />
          </View>
        )}
      </View>

      {functionality === 'size' && (
        <View style={styles.sizeContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={config.sizes}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    editTextInside({
                      editType: 'fontSize',
                      value: item.size - 0
                    })
                  }}>
                  <View
                    style={{
                      width: vh(48),
                      height: vh(48),
                      borderRadius: vw(30),
                      borderWidth: vw(2),
                      borderColor: colors.graylight,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginRight: vw(12),
                      backgroundColor:
                        elements[selectedTextInside]?.fontSize ===
                        item?.size - 0
                          ? colors.hmPurple
                          : '#fff'
                    }}>
                    <Text
                      style={{
                        fontSize: vw(14),
                        lineHeight: vh(18),
                        fontFamily: fonts.MEDIUM,
                        textAlign: 'center',
                        justifyContent: 'center',
                        color:
                          elements[selectedTextInside]?.fontSize ===
                          item?.size - 0
                            ? 'white'
                            : 'black'
                      }}>
                      {item.size}{' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      )}

      {functionality === 'color' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center'
            // backgroundColor: 'pink'
          }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={config.colors}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    editTextInside({ editType: 'textColor', value: item })
                  }}>
                  <View
                    style={{
                      width: vw(46),
                      height: vw(46),
                      backgroundColor: item,
                      borderRadius: vw(30),
                      marginRight: vw(12),
                      borderWidth:
                        elements[selectedTextInside]?.textColor === item
                          ? vw(3)
                          : 0,
                      borderColor: colors.white
                    }}>
                    {elements[selectedTextInside]?.textColor === item && (
                      <View style={styles.dot} />
                    )}
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      )}

      {functionality === 'align' && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch'
          }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={config.alignments}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    editTextInside({ editType: 'textAlign', value: item })
                  }>
                  <View style={styles.align}>
                    {console.log(
                      item,
                      `hm_Align${
                        item.charAt(0).toUpperCase() + item?.slice(1)
                      }-thick`
                    )}
                    <CircleIcon
                      name={`hm_Align${
                        item.charAt(0).toUpperCase() + item?.slice(1)
                      }-thick`}
                      circleColor={
                        elements[selectedTextInside]?.textAlign === item
                          ? colors.hmPurple
                          : colors.white
                      }
                      circleSize={vw(46)}
                      iconSize={vw(25)}
                      iconColor={
                        elements[selectedTextInside]?.textAlign === item
                          ? colors.white
                          : colors.hmPurple
                      }
                      circleStyle={{
                        borderWidth: 1,
                        borderColor: colors.graylight
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  fontContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: vw(21)
  },

  sizeContainer: {
    flexDirection: 'row'
  },
  dot: {
    width: vw(6),
    height: vw(6),
    borderRadius: vw(20),
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginTop: '42%'
  },
  align: {
    marginRight: vw(12)
  }
})
