import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import CustomInputs from '@ecom/components/CustomInputs'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export default function Recipient() {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Text style={styles.header}>Recipient Information</Text>
            </View>
            <View>
              <CustomInputs
                label="First name*"
                onChange={undefined}
                textStyle={undefined}
                value={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                error={undefined}
              />
              <CustomInputs
                label="Last name*"
                onChange={undefined}
                textStyle={undefined}
                value={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                error={undefined}
              />
              <CustomInputs
                label="Email address*"
                onChange={undefined}
                textStyle={undefined}
                value={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
                error={undefined}
              />
            </View>
            <View style={styles.noteContainer}>
              <Text style={styles.note}>
                Make an account to save this contact
              </Text>
            </View>
            <View>
              <Button
                label="Continue"
                buttonColor={colors.hmPurple}
                buttonStyle={undefined}
                textStyle={undefined}
                onPress={undefined}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20
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
  topContainer: {
    margin: 0,
    backgroundColor: colors.white,
    flexDirection: 'column',
    borderTopLeftRadius: vw(25),
    borderTopRightRadius: vw(25)
  },
  header: {
    fontFamily: fonts.BOLD,
    fontSize: vw(17),
    marginTop: vh(20),
    marginBottom: vh(10),
    textAlign: 'center'
  }
})
