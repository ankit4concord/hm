import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from './Button'
import { CustomLabelWithIcon } from './CustomLabelWithIcon'
import { Icon } from './icons'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export default function SenderEmailTextCard(props: any) {
  const {
    heading,
    message,
    imageURL,
    bottomText2,
    bottomText1,
    onButtonPress,
    buttonTextPrefix
  } = props

  const onbtnclick = () => {
    onButtonPress(props)
  }
  return (
    <>
      <ScrollView>
        <TouchableOpacity>
          <View>
            <View style={[styles.container]}>
              <View style={styles.header}>
                <View style={styles.Textbox}>
                  <Text
                    style={[styles.title, { color: colors.deliveryBottomTxt }]}>
                    {heading}
                  </Text>
                  <Text style={styles.message}>{message}</Text>
                  <View>
                    <Button
                      label={buttonTextPrefix}
                      buttonStyle={styles.button}
                      textStyle={
                        props?.type === 'email' ? styles.text : styles.pinkText
                      }
                      onPress={onbtnclick}
                      buttonColor={
                        props?.type === 'email' ? colors.darkPink : colors.white
                      }
                    />
                  </View>
                </View>
                <View style={styles.Iconbox}>
                  <Image
                    source={{ uri: imageURL }}
                    style={{
                      width: vw(100),
                      height: vw(100),
                      resizeMode: 'contain'
                    }}
                  />
                </View>
              </View>
              <View style={styles.divider} />
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <CustomLabelWithIcon
                    style={[
                      styles.listLabel,
                      { color: colors.deliveryBottomTxt }
                    ]}
                    label={bottomText1}
                    isIcon={
                      <Icon
                        name={'hm_Check-thick'}
                        size={vw(15)}
                        style={styles.rightIcon}
                      />
                    }
                  />
                  <CustomLabelWithIcon
                    style={[
                      styles.listLabel,
                      { color: colors.deliveryBottomTxt }
                    ]}
                    label={bottomText2}
                    isIcon={
                      <Icon
                        name={'hm_Check-thick'}
                        size={vw(15)}
                        style={styles.rightIcon}
                      />
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: vh(10),
    borderRadius: vw(15),
    padding: vw(20),
    backgroundColor: colors.backgroundBox
  },
  header: {
    flexDirection: 'row'
  },
  Textbox: {
    flex: 1
  },
  Iconbox: {
    justifyContent: 'center'
  },
  title: {
    fontFamily: fonts.MEDIUM,
    color: colors.deliveryBottomTxt,
    fontSize: vw(14),
    lineHeight: vh(20)
  },
  listLabel: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    color: colors.secondary,
    paddingRight: vw(20),
    paddingLeft: vw(5),
    lineHeight: vh(16)
  },
  button: {
    width: vw(135),
    paddingVertical: vw(12)
  },
  text: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14)
  },
  pinkText: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    color: colors.darkPink
  },
  divider: {
    borderColor: colors.hmPurpleBorder,
    borderWidth: 1,
    marginTop: vh(10),
    marginBottom: vh(10)
  },
  message: {
    color: colors.deliveryBottomTxt,
    paddingTop: vh(10),
    paddingBottom: vh(40),
    fontSize: vw(12),
    lineHeight: vh(16)
  },
  rightIcon: {
    // width: vw(15),
    // height: vh(15),
    // resizeMode: 'contain',
    color: colors.deliveryBottomTxt,
    marginRight: vw(4)
  }
})
