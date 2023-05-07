import { StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const NotifiyModal = (props: any) => {
  const {
    title,
    subtitle,
    Icon,
    buttonLabel,
    onOkClick,
    onCancel,
    isShowCancel
  } = props

  return (
    <View style={styles.container}>
      <View>{Icon}</View>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.subTitle]}>{subtitle}</Text>
      </View>
      <View style={styles.buttonWrapper}>
        {isShowCancel && (
          <Button
            label="Cancel"
            buttonColor="transparent"
            textStyle={{ fontFamily: fonts.MEDIUM, color: colors.black }}
            buttonStyle={styles.btnCancel}
            onPress={onCancel}
          />
        )}
        <Button
          label={buttonLabel}
          buttonColor={colors.hmPurple}
          buttonStyle={styles.btnOk}
          textStyle={{ fontFamily: fonts.MEDIUM }}
          onPress={onOkClick}
        />
      </View>
    </View>
  )
}

export default NotifiyModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: vw(10)
  },
  contentWrapper: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: vw(15),
    marginTop: vh(10),
    marginBottom: vh(10)
  },
  box: {
    width: '50%',
    padding: vw(10)
  },
  title: {
    textAlign: 'center',
    fontSize: vw(14),
    lineHeight: vh(18),
    marginBottom: vh(3),
    color: colors.black,
    fontFamily: fonts.MEDIUM
  },
  subTitle: {
    textAlign: 'center',
    fontSize: vw(14),
    lineHeight: vh(20),
    color: colors.black,
    marginBottom: vh(20),
    fontFamily: fonts.REGULAR
  },
  btnCancel: {
    width: 'auto',
    borderWidth: 2,
    borderColor: colors.black,
    padding: vw(10),
    marginBottom: vh(20)
  },
  btnOk: {
    width: 'auto',
    paddingVertical: vh(17.5),
    paddingHorizontal: vw(25)
  }
})
