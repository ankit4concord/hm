import {
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import React from 'react'
import LocalizedStrings from 'react-native-localization'
import { HeaderBold } from '@ecom/components/typography'
import { vh, vw } from '@ecom/utils/dimension'
import { Divider } from '@ecom/components/divider'
import colors from '@ecom/utils/colors'
import Common from '@ecom/utils/Common'
import { Icon } from '@ecom/components/icons'

export const PrivacyPolicy = () => {
  const privacy = () => {
    Linking.openURL(Common.PRIVACY_POLICY_URL)
  }

  const caPrivacy = () => {
    Linking.openURL(Common.CA_PRIVACY_POLICY_URL)
  }
  const caDoNotSell = () => {
    Linking.openURL(Common.CA_DO_NOT_SELL_URL)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Divider />
        <TouchableOpacity style={styles.rowContainer} onPress={privacy}>
          <HeaderBold>{strings.privacy}</HeaderBold>
          <Icon name={'hm_ChevronRight-thick'} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.rowContainer} onPress={caPrivacy}>
          <HeaderBold>{strings.caPrivacy}</HeaderBold>
          <Icon name={'hm_ChevronRight-thick'} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.rowContainer} onPress={caDoNotSell}>
          <HeaderBold>{strings.caDoNotSell}</HeaderBold>
          <Icon name={'hm_ChevronRight-thick'} />
        </TouchableOpacity>
        <Divider />
      </View>
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    privacy: 'Privacy Policy',
    caPrivacy: 'CA Privacy Notice',
    caDoNotSell: 'CA Do Not Sell/Share'
  }
})

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.pageBackground,
    flex: 1
  },
  container: {
    marginHorizontal: vw(20),
    marginTop: vh(75)
  },
  rowContainer: {
    paddingVertical: vh(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
