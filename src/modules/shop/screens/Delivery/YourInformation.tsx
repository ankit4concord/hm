import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
// import CustomButton from '@ecom/components/CustomButton'
import CustomCheckbox from '@ecom/components/CustomCheckbox'
import CustomInputWithIcon from '@ecom/components/CustomInputWithIcon'
import CustomInputs from '@ecom/components/CustomInputs'
import ToggleButton from 'react-native-toggle-element'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { useState } from 'react'
import validateInput from '@ecom/components/ValidationInput'

export default function YourInformation() {
  const [isToggleSwitch, setIsToggleSwitch] = useState(false)
  const [hasErrors, setHasError] = useState(true)
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    email: '',
    lastName: '',
    name: ''
  })

  const areFormValuesEmpty = Object.values(formData).every(
    (value) => value == ''
  )

  const [empty, setEmpty] = useState(areFormValuesEmpty)
  const [errors, setErrors] = useState({})
  const handleChange = (type: any, value: any) => {
    setFormData({
      ...formData,
      [type]: value
    })
    setErrors({
      ...errors,
      [type]: validateInput(type, value, isToggleSwitch)
    })
  }

  const handleSubmit = () => {
    if (empty) {
      alert('Please fill all the feilds')
    }
    setHasError(false)
    setEmpty(false)
    for (const type in formData) {
      const error = validateInput(type, formData[type])
      if (error) {
        setErrors({
          ...errors,
          [type]: error
        })
        setHasError(true)
      } else {
        setErrors({
          ...errors,
          [type]: ''
        })
      }
    }
    if (!hasErrors) {
      alert('Sumited') // submit the form data
    }
  }

  const toggleSwitch = () =>
    setIsToggleSwitch((previousState) => !previousState)

  const onSuffixClick = () => setIsShowPassword(!isShowPassword)

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
        <ScrollView>
          <View style={styles.container}>
            <View>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Complete information</Text>
                <View>
                  {/* <Button
                    label="Sign In"
                    buttonStyle={styles.btn}
                    buttonColor={colors.darkPink}
                    icon={
                      <View style={{ paddingRight: vw(5) }}>
                        <Image
                          source={localImages.userImage}
                          style={styles.userImage}
                        />
                      </View>
                    }
                  /> */}
                </View>
              </View>
              <CustomInputs
                label="Recipient email address*"
                onChange={(value: any) => handleChange('email', value)}
                value={formData.email}
                error={errors.name}
                textStyle={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
              />
              <CustomInputs
                label="Your name*"
                onChange={(value: any) => handleChange('name', value)}
                value={formData.name}
                error={errors.name}
                textStyle={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
              />

              <View style={styles.toggle}>
                {/* <ToggleButton
                  value={isToggleSwitch}
                  onPress={() => toggleSwitch()}
                  thumbActiveComponent={
                    <Image
                      source={localImages.toggleRight}
                      style={{
                        width: vw(7),
                        height: vh(6),
                        resizeMode: 'contain'
                      }}
                    />
                  }
                  thumbInActiveComponent={
                    <Image
                      source={localImages.toggleCross}
                      style={{
                        width: vw(6),
                        height: vh(6),
                        resizeMode: 'contain'
                      }}
                    />
                  }
                  thumbButton={{
                    activeBackgroundColor: colors.white,
                    inActiveBackgroundColor: colors.white,
                    height: vh(20),
                    width: vw(20)
                  }}
                  trackBar={{
                    width: vw(42),
                    radius: vw(20),
                    activeBackgroundColor: colors.darkPink,
                    inActiveBackgroundColor: colors.darkPink
                  }}
                  trackBarStyle={{
                    width: vw(52),
                    height: vh(28),
                    paddingHorizontal: vw(10),
                    borderWidth: vw(5)
                  }}
                /> */}
                {/* <Switch
                trackColor={{
                  true: colors.secondary,
                  false: colors.secondary
                }}
                thumbColor={isToggleSwitch ? '#fff' : '#fff'}
                onValueChange={toggleSwitch}
                value={isToggleSwitch}
              /> */}
                <Text style={styles.toggelContainer}>
                  Register for an account?
                </Text>
              </View>
              {/* {isToggleSwitch && (
                <View>
                  <CustomInputs
                    label="Email address*"
                    onChange={(value: any) => handleChange('email', value)}
                    value={formData.email}
                    error={errors.email}
                    textStyle={undefined}
                    subLabel={undefined}
                    placeholder={undefined}
                    type={undefined}
                  />
                  <CustomInputWithIcon
                    label="Password*"
                    subLabel="min. 6 characters"
                    onChange={(value: any) => handleChange('password', value)}
                    value={formData.password}
                    error={errors.password}
                    type={isShowPassword ? 'text' : 'password'}
                    suffix={
                      <Image
                        style={styles.eyeImage}
                        source={localImages.eyeImage}
                      />
                    }
                    onSuffixClick={onSuffixClick}
                  />
                  <CustomCheckbox
                    check={true}
                    content={
                      <View style={styles.checkBoxContainer}>
                        <Text style={styles.noteTxt}>
                          By creating a Hallmark.com account, you agree to the
                          <Text style={styles.subNote}>{' Terms of Use '}</Text>
                          {'and '}
                          <Text style={styles.subNote}>
                            {'Privacy Policy. '}
                          </Text>
                          Hallmark and its companies can email you about special
                          offers and promotions. You can change your email
                          preferences at any time. For Crown Rewards, see
                          <Text style={styles.subNote}>
                            {' Program Information & Terms and Conditions.'}
                          </Text>
                        </Text>
                      </View>
                    }
                    isChecked={undefined}
                  />
                </View>
              )} */}

              <View>
                <Button
                  label="Sign up and Continue"
                  onPress={handleSubmit}
                  buttonColor={colors.hmPurple}
                  buttonStyle={undefined}
                  textStyle={undefined}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20),
    paddingBottom: vh(35),
    backgroundColor: 'red'
  },
  heading: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  headerContainer: {
    marginBottom: vh(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  btn: {
    padding: 15
  },
  userImage: {
    width: vw(12),
    height: vh(12),
    resizeMode: 'contain'
  },
  toggelContainer: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    marginLeft: vw(10)
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  eyeImage: { width: 30, height: 30, resizeMode: 'contain' },
  checkBoxContainer: { paddingRight: vw(20), paddingTop: vh(8) },
  noteTxt: { fontSize: vw(12), lineHeight: vh(18) },
  subNote: { fontFamily: fonts.BOLD, textDecorationLine: 'underline' }
})
