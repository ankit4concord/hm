import { StyleSheet, View } from 'react-native'

import Loader from '@ecom/components/Loader'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import { WebView } from 'react-native-webview'
import constant from '@ecom/utils/constant'
import { useSelector } from 'react-redux'
import { vh } from '@ecom/utils/dimension'

interface Props {
  route: any
  navigation: any
  token: string
}

export function PaypalPaymentScreen(props: Props) {
  const [paypalLoading, setPaypalLoading] = React.useState(true)
  const { paypalToken } = useSelector(
    (state: RootReducerModal) => state.cartReducer
  )
  const hideSpinner = () => {
    setPaypalLoading(false)
  }

  return (
    <View style={{ flex: 1, marginTop: 20, marginBottom: vh(20) }}>
      <WebView
        bounces={false}
        injectedJavaScript={constant?.InjectedScript}
        onMessage={() => {}}
        onLoad={() => hideSpinner()}
        style={{ flex: 1 }}
        source={{
          uri: `https://www.sandbox.paypal.com/cgibin/webscr?cmd=_express-checkout&token=${
            paypalToken ? paypalToken : props.token
          }`
        }}
      />
      {paypalLoading && (
        <View style={styles.loader}>
          <Loader />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
})
