export interface Profile {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  nickname?: string
  uid?: string
  crNumber?: number
  cid?: number
  dateOfBirth?: ProfileDOB
  gender?: 'm' | 'f' | null
  address?: ProfileAddress
  optIns?: ProfileOptIns
  socialProviders?: string[]
  loginProvider?: string
  optLastUpdatedDate?: string
  paymentMethods?: PaymentMethods[]
}

export interface ProfileDOB {
  day?: number
  month?: number
}

export interface ProfileOptIns {
  postalOptIn?: boolean
  postalSubsidiariesOptIn?: boolean
  postalThirdPartyOptIn?: boolean
  globalOptIn?: boolean
}

export interface ProfileAddress {
  addressLine1?: string
  addressLine2?: string
  city?: string
  stateCode?: string
  countryCode?: string
  zip?: string
}

export interface PaymentMethods {
  UUID: string
  lastFour: string
  preferred: boolean
  expirationMonth: number
  expirationYear: number
  cardType: string
}

export interface ChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ErrorResponse {
  code: number
  field?: string
  parentField?: string
  message?: string
  data?: any
}

export interface CareCase
  extends CareMessage,
    CareInformation,
    CareDeviceDetails {
  Category_2__c: string
  Origin: string
}

export interface CareMessage {
  Topic_2__c?: string
  Order_Number__c?: string
  Description?: string
  Type_2__c?: string
  Supplied_Crown_Rewards_Number__c?: string
}

export interface CareInformation {
  Supplied_First_Name__c?: string
  Supplied_Last_Name__c?: string
  SuppliedEmail?: string
  SuppliedPhone?: string
  Supplied_Postal_Code__c?: string
}

export interface CareDeviceDetails {
  Screen_Size__c?: string
  Operating_System__c?: string
  Mobile_Device__c?: string
  Mobile_App_Version__c?: string
}

export interface CareFile {
  fileSize: number
  fileName: string
  uri: string
  type: string
  showUploadBar: boolean
  uploadProgress: number
  uploadMessage?: string
  uploadMessageError: boolean
}

export type DeliveryMethod = 'PickUpAtStore' | 'ShipToAddress' | 'Mixed'

export type OrderStatus =
  | 'Processing'
  | 'Canceled'
  | 'Ready for pick up'
  | 'Delivered'
  | 'Picked Up'
  | 'Shipped'
  | 'Ready for shipment'

export interface Order {
  CapturedDate?: string
  OrderTotal?: number
  OrderSubTotal?: number
  OrderId?: string
  OrderLine?: OrderItem[]
  Release?: OrderRelease[]
  TotalTaxes?: number
  OrderChargeDetail?: OrderChargeDetail[]
  Payment?: OrderPayment[]
  FulfillmentStatus?: string
  MinFulfillmentStatusId?: string
  MaxFulfillmentStatusId?: string
  orderStatus?: OrderStatus
}

export interface OrderItem {
  Quantity?: number
  UnitPrice?: number
  OrderLineTotal?: number
  SmallImageURI?: string
  ItemDescription?: string
  OrderLineId?: string
  MinFulfillmentStatusId?: string
  MaxFulfillmentStatusId?: string
  DeliveryMethod?: OrderDeliveryMethod
  Allocation?: OrderAllocation[]
  Extended?: OrderExtended
  orderStatus?: OrderStatus
  ShipToAddress?: OrderBillingAddress
}

export interface OrderRelease {
  DeliveryMethodId?: string
  ShipViaId?: string
  ReleaseLine?: OrderReleaseItem[]
}

export interface OrderReleaseItem {
  OrderLineId?: string
  CancelledQuantity?: number
  Quantity?: number
}

export interface OrderAllocation {
  EarliestDeliveryDate?: string
  ShipFromLocationId?: string
}

export interface OrderExtended {
  SFCCReqShipDate?: string
  IsShipToStore?: boolean
  KOCMembershipId?: string
  SFCCLatestDeliveryDate?: string
  SFCCEarliestDeliveryDate?: string
}

export interface OrderDeliveryMethod {
  DeliveryMethodId?: string //PickUpAtStore | ShipToAddress
}

export interface OrderChargeDetail {
  ChargeTotal?: number
  ChargeDisplayName?: string
  ChargeType?: OrderChargeDetailType
}

export interface OrderChargeDetailType {
  ChargeTypeId?: string
}

export interface OrderPayment {
  PaymentMethod?: OrderPaymentMethod[]
}

export interface OrderPaymentMethod {
  PaymentType?: OrderPaymentType
  CardType?: OrderPaymentCardType
  Amount?: number
  CardExpiryYear?: string
  CardExpiryMonth?: string
  AccountDisplayNumber?: string
  BillingAddress?: OrderBillingAddress
}

export interface OrderPaymentType {
  PaymentTypeId?: string
}

export interface OrderPaymentCardType {
  CardTypeId?: string
}
export interface OrderBillingAddress {
  Address?: OrderAddress
}

export interface OrderAddress {
  FirstName?: string
  LastName?: string
  Address1?: string
  Address2?: string
  City?: string
  State?: string
  PostalCode?: string
  Phone?: string
  Email?: string
  Country?: string
}

export interface OrderViewModel {
  id: string
  date: string
  items: OrderItemViewModel[]
  releases?: OrderReleaseViewModel[]
  unReleasedItems: OrderItemViewModel[]
  fulfillmentStatus?: string
  status: OrderStatus
  subTotal: number
  taxes: number
  total: number
  additionalCharges: OrderAdditionalChargesViewModel[]
  paymentMethods: OrderPaymentViewModel[]
  billingAddress?: OrderAddressViewModel
  deliveryMethod: DeliveryMethod
  isFinished: boolean
}

export interface OrderReleaseViewModel {
  deliveryMethod: DeliveryMethod
  shipMethod: string
  orderReleaseItems: OrderReleaseItemViewModel[]
}

export interface OrderReleaseItemViewModel {
  quantity: number
  cancelledQuantity: number
  orderItemID: string
  itemDetails?: OrderItemViewModel
}

export interface OrderAdditionalChargesViewModel {
  label: string
  total: number
}

export interface OrderAddressViewModel {
  name: string
  line1: string
  line2: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  country: string
}

export interface OrderPaymentViewModel {
  type: string
  cardType?: string
  displayNumber?: string
  chargeAmount?: number
  expireMonth?: string
  expireYear?: string
  email?: string
}

export interface OrderItemViewModel {
  id: string
  description: string
  imageURL: string
  price: number
  total: number
  status: OrderStatus
  deliveryDate: string
  deliveryMethod: DeliveryMethod
  isFinished: boolean
  quantity: number
  deliveryAddress?: OrderAddressViewModel
}
