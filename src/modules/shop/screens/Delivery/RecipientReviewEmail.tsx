import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import CustomInputWithIcon from '@ecom/components/CustomInputWithIcon'
import { IconNames } from '@ecom/utils/mockData'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import SenderPreview from './component/SenderPreview'
import SvgRender from '@ecom/components/SvgRender'
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { useSelector } from 'react-redux'

export default function RecipientReviewEmail(props: any) {
  const onPressed = () => {
    props.closeBottomSheet(props?.type)
  }

  const onBackEdit = () => {
    props.onBackEdit()
  }
  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Text
              style={{
                fontFamily: fonts.MEDIUM,
                fontSize: vw(17),
                marginTop: vh(20),
                marginBottom: vh(10),
                textAlign: 'center'
              }}>
              Review Email
            </Text>
          </View>
          <View>
            <SenderPreview
              title="Recipient"
              subtitle={cardDeliveryData[1]?.formDetails?.recipientEmailAddress}
              icon={<SvgRender icon={IconNames.USER} />}
              editClicked={onBackEdit}
            />
          </View>

          <View style={{ paddingTop: vh(20) }}>
            <Button
              label="Continue"
              buttonColor={colors.hmPurple}
              onPress={onPressed}
              buttonStyle={styles.btn}
              textStyle={undefined}
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  noteContainer: {
    alignItems: 'center',
    marginTop: vh(10),
    marginBottom: vh(10)
  },
  note: {
    fontFamily: fonts.MEDIUM,
    alignItems: 'center',
    color: colors.hmPurple
  },
  btn: {
    padding: 20
  }
})
