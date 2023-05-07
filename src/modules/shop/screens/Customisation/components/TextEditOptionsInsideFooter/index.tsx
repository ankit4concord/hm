import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import EditorOptions from './editorOptions'
import { Icon } from '@ecom/components/icons'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

const TextEditOptionsInsideFooter = ({
  editTextInside,
  allTexts,
  isEditMode,
  activeEditMenu,
  setActiveEditMenu,
  editOptions,
  selectedTextInside,
  setIsClickedOnText
}: any) => {
  let iconVisible: any

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: vw(20),
        justifyContent: 'center',
        marginBottom: vh(15)
      }}>
      {editOptions?.map((editType: any) => {
        return (
          editType === activeEditMenu && (
            <EditorOptions
              functionality={editType}
              editTextInside={editTextInside}
              elements={allTexts}
              isEditMode={isEditMode}
              key={`${editType}`}
              selectedTextInside={selectedTextInside}
            />
          )
        )
      })}
      <DropShadow style={styles.shadowContainer}>
        <View
          style={{
            backgroundColor: colors.white,
            padding: vw(10),
            borderRadius: vw(25),
            flexDirection: 'row'
          }}>
          {editOptions?.map((editType: any, i: any) => {
            let iconColor =
              editType === activeEditMenu
                ? colors.hmPurple
                : colors.headerTxtColor
            switch (editType) {
              case 'text':
                iconVisible = (
                  <Icon
                    name={`hm_Keyboard-thin`}
                    size={vw(26)}
                    color={iconColor}
                  />
                )
                break
              case 'font':
                iconVisible = (
                  <Icon name={`hm_Font-thin`} size={vh(38)} color={iconColor} />
                )
                break
              case 'size':
                iconVisible = (
                  <Icon
                    name={`hm_FontSize-thin`}
                    size={vw(20)}
                    color={iconColor}
                  />
                )
                break
              case 'align':
                iconVisible = (
                  <Icon
                    name={`hm_Align-thin`}
                    size={vw(20)}
                    color={iconColor}
                  />
                )
                break
            }
            return (
              <>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%'
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveEditMenu(editType)
                      setIsClickedOnText(true)
                      setTimeout(() => {
                        setIsClickedOnText(false)
                      }, 100)
                    }}
                    key={`${editType}${i}`}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        height: vh(45)
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1
                        }}>
                        {editType === 'color' ? (
                          <View
                            style={{
                              backgroundColor:
                                allTexts[selectedTextInside]?.textColor ||
                                '#00000080',
                              height: vw(20),
                              width: vw(20),
                              borderRadius: vw(30),
                              alignSelf: 'center',
                              justifyContent: 'center'
                            }}
                          />
                        ) : (
                          iconVisible
                        )}
                      </View>

                      <View>
                        <Text
                          style={{
                            color:
                              activeEditMenu === editType &&
                              activeEditMenu !== 'text'
                                ? colors.hmPurple
                                : '#282828',
                            textTransform: 'uppercase',
                            fontSize: vw(9),
                            fontFamily: fonts.REGULAR,
                            lineHeight: vh(10)
                          }}>
                          {editType}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )
          })}
        </View>
      </DropShadow>
    </View>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
})

export default TextEditOptionsInsideFooter
