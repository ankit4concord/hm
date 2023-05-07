import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CustomLabelWithIcon } from './CustomLabelWithIcon'
import { Icon } from '@ecom/components/icons'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

// import { Icon } from './icons'

export default function SenderCard(props: any) {
  const { heading, message, bottomText1, bottomText2, imageURL, selected } =
    props

  return (
    <>
      <ScrollView>
        <View
          style={[
            styles.container,
            {
              backgroundColor: selected
                ? colors.hmPurplelight
                : colors.hmPurpleBorder
            }
          ]}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.TopContainer}>
              <View>
                <Text style={styles.title}>{heading}</Text>
              </View>
              <View>
                <Text style={styles.message}>{message}</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageURL }} style={styles.image} />
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <View>
              {bottomText1 && (
                <CustomLabelWithIcon
                  style={styles.listLabel}
                  label={bottomText1}
                  isIcon={
                    <Icon
                      name={'hm_Check-thick'}
                      size={vw(10)}
                      style={styles.rightIcon}
                      color={colors.hmPurple}
                    />
                  }
                />
              )}
              {bottomText2 && (
                <CustomLabelWithIcon
                  style={[
                    styles.listLabel,
                    selected ? { opacity: 1 } : { opacity: 0.5 }
                  ]}
                  label={bottomText2}
                  isIcon={
                    <Icon
                      name={'hm_Check-thick'}
                      size={vw(10)}
                      style={styles.rightIcon}
                      color={selected ? colors.hmPurple : '#60409980'}
                    />
                  }
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: vh(10),
    borderRadius: vw(15),
    padding: vw(18)
  },
  TopContainer: {
    flex: 0.9
  },
  imageContainer: {
    flex: 0.1,
    alignItems: 'center'
  },
  title: {
    fontFamily: fonts.BOLD,
    lineHeight: vh(20),
    marginBottom: vh(5),
    fontSize: vw(14),
    color: colors.hmPurple
  },
  listLabel: {
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM,
    color: colors.hmPurple,
    marginLeft: vw(8),
    marginBottom: vh(8)
  },
  message: {
    color: colors.hmPurple,
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(16)
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: vh(30),
    alignItems: 'center'
  },
  image: {
    width: vw(20),
    height: vh(20),
    resizeMode: 'contain'
  },
  rightIcon: {
    top: vh(2)
  }
})
