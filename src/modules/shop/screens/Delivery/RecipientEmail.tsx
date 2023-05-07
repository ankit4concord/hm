import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React, { useState } from 'react'
import {
  updateRecipientAddress,
  updateRecipientEmailAddress
} from '../../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import CustomInputs from '@ecom/components/CustomInputs'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import validateInput from '@ecom/components/ValidationInput'

export default function RecipientEmail(props: any) {
  const dispatch = useDispatch()
  // const onPressed = () => {
  //   props.submit()
  // }
  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )
  const { user } = useSelector((state: RootReducerModal) => state.authReducer)
  console.log(user, 'profile')
  let previousData = cardDeliveryData?.filter((d) => d.type === 'delivery')
  const formDetailsState = previousData[0]?.formDetails
    ? previousData[0]?.formDetails
    : {
        recipientEmailAddress: '',
        recipientFirstName: '',
        recipientLastName: '',
        senderFirstName: user?.first_name ? user?.first_name : '',
        senderLastName: user?.last_name ? user?.last_name : ''
        // senderLastName: ''
      }
  const [formData, setFormData] = useState(formDetailsState)

  const [errors, setErrors] = useState({})

  const handleChange = (type: any, value: any) => {
    setFormData({
      ...formData,
      [type]: value
    })
    setErrors({
      ...errors,
      [type]: validateInput(type, value)
    })
  }

  const handlecCloseBottomSheet = () => {
    console.log('handlecCloseBottomSheet 1')
    props?.closeBottomSheet(props.type)
    console.log('handlecCloseBottomSheet 2')
  }

  const handleSubmit = () => {
    let errorData = {
      ...errors
    }
    for (const type in formData) {
      errorData = {
        ...errorData,
        [type]: validateInput(type, formData[type])
      }
      setErrors(errorData)
    }
    let errorsArr = Object.values(errorData)
    if (errorsArr.filter((d) => d != null).length == 0) {
      dispatch(updateRecipientEmailAddress(formData, handlecCloseBottomSheet))
      // props?.submit()
      // props?.closeBottomSheet(props.type)
    }
  }

  // const [hasErrors, setHasError] = useState(true)
  // const [formData, setFormData] = useState({
  //   email: '',
  //   name: ''
  // })
  // const areFormValuesEmpty = Object.values(formData).every(
  //   (value) => value == ''
  // )
  // const [empty, setEmpty] = useState(areFormValuesEmpty)
  // const [errors, setErrors] = useState({})
  // const onPressed = () => {
  //   if (empty) {
  //     alert('Please fill all the feilds')
  //   }
  //   setHasError(false)
  //   setEmpty(false)
  //   for (const type in formData) {
  //     const error = validateInput(type, formData[type])
  //     if (error) {
  //       setErrors({
  //         ...errors,
  //         [type]: error
  //       })
  //       setHasError(true)
  //     } else {
  //       setErrors({
  //         ...errors,
  //         [type]: ''
  //       })
  //     }
  //   }
  //   if (!hasErrors) {
  //     alert('Sumited') // submit the form data
  //   }
  //   props.submit()
  // }
  // const handleChange = (type: any, value: any) => {
  //   setFormData({
  //     ...formData,
  //     [type]: value
  //   })
  //   setErrors({
  //     ...errors,
  //     [type]: validateInput(type, value)
  //   })
  // }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.MEDIUM,
              fontSize: vw(17),
              marginBottom: vh(30)
            }}>
            Complete information
          </Text>
        </View>
        <View>
          <CustomInputs
            label="Recipient email address*"
            onChange={(value: any) =>
              handleChange('recipientEmailAddress', value)
            }
            value={formData?.recipientEmailAddress.toLowerCase()}
            error={errors?.recipientEmailAddress}
            textStyle={undefined}
            subLabel={undefined}
            placeholder={undefined}
            type={undefined}
          />
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <CustomInputs
                label="Recipient first name*"
                onChange={(value: any) =>
                  handleChange('recipientFirstName', value)
                }
                value={formData?.recipientFirstName}
                error={errors?.recipientFirstName}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                textStyle={undefined}
              />
            </View>
            <View style={styles.box}>
              <CustomInputs
                label="Recipient last name*"
                onChange={(value: any) =>
                  handleChange('recipientLastName', value)
                }
                value={formData?.recipientLastName}
                error={errors?.recipientLastName}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                textStyle={undefined}
              />
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <CustomInputs
                label="Your first name*"
                onChange={(value: any) =>
                  handleChange('senderFirstName', value)
                }
                value={formData?.senderFirstName}
                error={errors?.senderFirstName}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                textStyle={undefined}
              />
            </View>
            <View style={styles.box}>
              <CustomInputs
                label="Your last name*"
                onChange={(value: any) => handleChange('senderLastName', value)}
                value={formData?.senderLastName}
                error={errors?.senderLastName}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                textStyle={undefined}
              />
            </View>
          </View>
        </View>
        <View style={{ marginTop: vh(20) }}>
          <Button
            label="Continue"
            buttonColor={colors.hmPurple}
            onPress={handleSubmit}
            // onPress={onPressed}
            buttonStyle={styles.btn}
            textStyle={undefined}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: vw(20)
  },
  btn: {
    padding: vw(20)
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    flex: 0.49
  }
})
