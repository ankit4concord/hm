import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import Button from '@ecom/components/Button'
import CustomInputs from '@ecom/components/CustomInputs'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { vh } from '@ecom/utils/dimension'

const UpdateInformation = () => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
        <ScrollView>
          <View style={styles.container}>
            <View>
              <View style={styles.topContainer}>
                <TouchableOpacity>
                  <Text style={styles.nameEdit}>Edit your name</Text>
                </TouchableOpacity>
              </View>
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
              <View>
                <Button
                  label="Sign up and Continue"
                  buttonColor={colors.hmPurple}
                  onPress={undefined}
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
export default UpdateInformation

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  nameEdit: {
    fontFamily: fonts.BOLD
  },
  topContainer: {
    flex: 1,
    marginTop: vh(20),
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
