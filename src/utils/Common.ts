import axios, { AxiosInstance } from 'axios'

const FINAL_API_URL = 'https://mobileapi.dev.hallmark.com/api/v1'
// const FINAL_API_URL = 'https://hmpoc.concordusa.com/api/v1'
const FINAL_WEBVIEW_URL = ''
const FINAL_DW_URL = ''
const FINAL_PAYPAL_CHECKOUT_URL =
  'https://www.dev.hallmark.com/on/demandware.store/Sites-HallmarkUS-Site/default/PayPalIntegration-ProcessPayPal'
const FINAL_CHECKOUT_BILLING_URL = 'https://www.dev.hallmark.com/billing'
const FINAL_CHECKOUT_REGISTER_URL = 'https://www.dev.hallmark.com/registerflow'
const MAPS_GEO_KEY = ''
const PRIVACY_POLICY_URL = 'https://www.hallmark.com/privacy/'
const TERMS_OF_USE_URL = 'https://www.hallmark.com/terms-of-use/'
const CA_PRIVACY_POLICY_URL = 'https://www.hallmark.com/privacy-notice/'
const CR_TC_URL =
  'https://www.hallmark.com/crown-rewards/crown-rewards-terms-conditions/'
const CA_DO_NOT_SELL_URL =
  'https://care.hallmark.com/s/ccpa-form?actionType=Do-Not-Sell-My-Personal-Information-or-Share-for-Cross-Contextual-Behavioral-Advertising-California'

const CARE_FAQ_URL = 'https://care.hallmark.com/s/'
const CARE_PHONE_NUMBER = '18004255627'
const $http: AxiosInstance = axios.create({
  baseURL: FINAL_API_URL,
  timeout: 30000,
  headers: {
    Authorization: '12345',
    idToken: 'aWvmeVF59Zv7MKZh'
  }
})

const $customisationHttp: AxiosInstance = axios.create({
  baseURL: 'https://services.dev.hallmark.com/customization/',
  timeout: 30000,
  headers: {
    authorization: '',
    idToken: ''
  }
})

const setAuthorizationToken = (token: string) => {
  if (token) {
    $http.defaults.headers.authorization = `Bearer ${token}`
  }
}

const setBearerToken = (token: string) => {
  if (token) {
    $customisationHttp.defaults.headers.authorization = `Bearer ${token}`
  }
}
const setAwsToken = (token: string) => {
  if (token) {
    $http.defaults.headers.identityToken = token
  }
}
const setCustomerId = (customerId: string) => {
  if (customerId) {
    $http.defaults.headers.customerId = customerId
  }
}

const showSnackbar = () => {
  // Snackbar.show({
  //   text: title,
  //   duration: 4000,
  //   action: {
  //     onPress: undefined,
  //     textColor: colors.black,
  //     text: 'close',
  //   },
  //   textColor: colors.white,
  //   backgroundColor: color || colors.black,
  // })
}

export default {
  axiosInstance: $http,
  custmisationAxiosInstance: $customisationHttp,
  setAuthorizationToken,
  showSnackbar,
  FINAL_API_URL,
  FINAL_WEBVIEW_URL,
  FINAL_DW_URL,
  FINAL_PAYPAL_CHECKOUT_URL,
  FINAL_CHECKOUT_BILLING_URL,
  FINAL_CHECKOUT_REGISTER_URL,
  MAPS_GEO_KEY,
  setAwsToken,
  setBearerToken,
  setCustomerId,
  PRIVACY_POLICY_URL,
  CA_DO_NOT_SELL_URL,
  CA_PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  CR_TC_URL,
  CARE_FAQ_URL,
  CARE_PHONE_NUMBER
}
