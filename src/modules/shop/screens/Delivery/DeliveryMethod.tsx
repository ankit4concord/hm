import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import SenderCard from '@ecom/components/SenderCard'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { useSelector } from 'react-redux'

export default function DeliveryMethod() {
  const { digitalDeliveryOptions } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Choose delivery method</Text>
          </View>
          <View>
            {digitalDeliveryOptions &&
              digitalDeliveryOptions?.map((item: any, index: any) => {
                return (
                  <SenderCard
                    key={index}
                    title={item.title}
                    subtitle={item.subtitle}
                    highlights={item.highlights}
                    buttonText={item.buttonText}
                    cardColor={colors.lightpink}
                    textColor={colors.secondary}
                  />
                )
              })}
          </View>
          <Text style={styles.costTxt}>*Your carrier costs apply.</Text>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: vw(10),
    marginRight: vw(10)
  },
  buttonText: {
    color: colors.white,
    marginLeft: vw(5),
    fontSize: vw(15)
  },
  buttonEmail: {
    backgroundColor: colors.darkPink,
    padding: 10,
    borderRadius: vw(30),
    width: vw(130),
    height: vh(40),
    marginTop: vh(40),
    marginLeft: vw(35)
  },
  buttonSendText: {
    backgroundColor: colors.darkPink,
    padding: 10,
    borderRadius: vw(30),
    width: vw(120),
    height: vh(40),
    marginTop: vh(40),
    marginLeft: vw(78)
  },
  costTxt: { textAlign: 'center', color: colors.gray },
  headerContainer: {
    margin: 0,
    backgroundColor: colors.white,
    flexDirection: 'column',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  header: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(17),
    marginTop: vh(20),
    marginBottom: vh(10),
    textAlign: 'center'
  }
})
