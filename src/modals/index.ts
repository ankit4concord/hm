/* eslint-disable @typescript-eslint/lines-between-class-members */
import { CareCase, CareFile, OrderViewModel, Profile } from './interfaces'

import { ReactNode } from 'react'

export * from './interfaces'

class LoadersModal {
  authLoading: boolean = false
  shopLoading: boolean = false
  productLoading: boolean = false
  categoryLoading: boolean = false
  cartLoading: boolean = false
  addtocartLoading: boolean = false
  homeLoading: boolean = false
  customisationLoading: boolean = false
  addressLoading: boolean = false
  profileLoading: boolean = false
  orderHistoryLoading: boolean = false
  digitalSendLoading: boolean = false
}

class MessageModel {
  CareFileUploadSuccessMessage: boolean = false
  ProfileSignOutMessage: boolean = false
  ProfileChangePasswordMessage: boolean = false
  ProfileEditDetailsMessage: boolean = false
  ProfileDeleteAccountMessage: boolean = false
  PaymentDeleteSuccessMessage: boolean = false
  PaymentDeleteErrorMessage: boolean = false
}

class InternetStatusModel {
  isConnected: boolean = true
}

class LoadMoreModal {
  isProductLoadMore: boolean = false
}

class HomeContentSlots {}
class Category {
  id: string = ''
  description: string = ''
  image: string = ''
  name: string = ''
  subCategories: Array<Category> = []
}
class Product {
  id: string = ''
  image: string = ''
  index: number = 0
  name: string = ''
  orderable: boolean = false
  sku: string = ''
}

class Filter {}
class ActiveFilters {
  label: ReactNode
}
class Review {}
class SaveForLater {}
class YourOrder {}
class RecentlyViewedProduct {}
class SearchSuggestions {
  product: Object = {}
}

class HomeReducerModal {
  home_content_slots: Array<HomeContentSlots> = []
  authModal: boolean = false
  homePageDesignerData: Object = {}
  componentClicked: string = ''
}

class ImageInformationModal {
  alt: string = ''
  imageUrl: string = ''
}

class DetailImageModal {
  alt: string = ''
  url: string = ''
}
class CImageModal {
  detail: Array<DetailImageModal> = []
  largeRetina: Array<DetailImageModal> = []
  length: any
  map: any
}

class PDPModal {
  id: string = ''
  image: Array<ImageInformationModal> = []
  c_imageUrls: CImageModal = new CImageModal()
  isAvailable: boolean = false
  isClearance: number = 1
  isNew: boolean = false
  isShipToHome: boolean = false
  minOrderQuantity: number = 1
  name: string = ''
  orderable: boolean = false
  price: number = 0
  primaryCategoryId: string = ''
  shortDescription: string = ''
  stepQuantity: number = 0
  stock: number = 0
  type: string = ''
  brand: string = ''
  backgroundImageUrl: string = ''
  pdpLevel1: string = ''
  pdpLevel2: string = ''
}

class StoreLocator {}
class Recommended {}
class miniCartSuggestions {}

class CategoryReducerModal {
  categories?: Array<Category> = []
  category_banner?: string = ''
  plp_banner?: string = ''
  productlist?: Array<Product> = []
  productsCount?: number
  productReviews?: Array<Review> = []
  tempProductCount?: number
  filters?: Array<Filter> = []
  sort?: object = {}
  activeFilters?: Array<ActiveFilters> = []
  tempFilters?: Array<ActiveFilters> = []
  productsEnd?: number
  productsHasMore?: Boolean
  minPrice?: string = ''
  maxPrice?: string = ''
  pdpDetail: PDPModal = new PDPModal()
  searchSuggestions?: Array<SearchSuggestions> = []
  searchResults?: Array<Product> = []
  searchResultsCount?: number
  searchResultstempProductCount?: number
  searchResultEnd?: number
  searchResultHasMore?: Boolean
  searchResultFilters?: Array<Filter> = []
  searchResultSort?: object = {}
  searchResultActiveFilters?: Array<ActiveFilters> = []
  searchResultTempFilters?: Array<ActiveFilters> = []
  searchResultMinPrice?: string = ''
  searchResultMaxPrice?: string = ''
  searchTerm?: string = ''
  store: Array<StoreLocator> = []
  query: string = ''
  pdpRecommended?: Array<Recommended> = []
  recommended?: Array<Recommended> = []
  recentlyViewed?: Array<Recommended> = []
  miniCartSuggestions?: Array<miniCartSuggestions> = []
  quantity?: any
  quantityLimit?: any
  selectedProductType?: string = 'S'
  clpPageDesignerData?: Array<any> = []
}
class CustomisationReducerModal {
  customisationTemplateData?: any = {}
  backgroundImageUrl?: string
  editingMode?: Boolean
  localImageUrl?: string
  podDeliveryOptions?: any = {}
  customFabricObj?: any = {}
  digitalDeliveryOptions?: any = {}
  previewTemplate?: any = {}
  customFabricObjInitial?: any = {}
  personalizationStart?: any = {}
}

class DeliveryReducerModal {
  cardDeliveryData?: Array<any> = []
}
class BasketModal {
  basketId: string = ''
  orderTotal: number = 0
  productSubTotal: number = 0
  productTotal: number = 0
  couponItems?: []
  productItems?: []
  order_price_adjustments?: []
  summary: any
}
class CartReducerModal {
  basket?: BasketModal = new BasketModal()
  saveForLater?: Array<SaveForLater> = []
  currentSaveForLaterProduct?: object = {}
  currentRemovedProduct?: object = {}
  dwsid?: string
  checkoutURL?: string
  showUndo?: boolean = false
  paypalToken?: string
  paypalRequestID?: string
  paypalRequestToken?: string
  paypalCorrelationID?: string
  cardAddedToCart?: boolean = false
}

class AdobeReducerModal {
  'pageType': string
  'cd.pageName': string
  'cd.previousPageName': string
  'cd.level1': string
  'cd.level2': string
  'cd.level3': string
  'cd.hierarchy': string
  'cd.authenticatedStatus': string = 'not logged in'
  'cd.currency': string = 'USD'
  'cd.channel': string = 'app'
  'cd.mobileApp': string = '1'
  'cd.ecid': string
  '&&products': string
  'cd.experienceCloudID': string
  'cd.printOnDemandProjectID': string
  'cd.digitalDeliveryProjectID': string
}

class UserModal {
  c_defaultPostalCode?: any
  first_name: string = ''
  last_name: string = ''
  email: any
  dwsid?: string
  accountId?: string
  accessToken?: string
  jwt?: string
  jwt_refresh?: string
  jwt_expires?: string
  jwt_refresh_expires?: string
}

class AuthReducerModal {
  customerData?: { firstName?: string; lastName?: string }
  customerEmail?: string
  customerId?: string
  token?: string
  biometricEnabled: boolean = false
  disableBiometricModal: boolean = false
  temporarilyDisableBiometricModal: boolean = false
  uuid: string = ''
  isInstalled: boolean = false
  user: UserModal = new UserModal()
  isGuestMode: boolean = false
  defaultStore: any
  defaultStoreMile: any
  defaultStoreDetails: any
  isUserVisitHomeFirstTime: boolean = false
  isUserVisitSearchFirstTime: boolean = false
  isUserVisitedForYouFirstTime: boolean = false
  riskifiedToken?: string
  email: string = ''
  apns_token?: string
  notificationEmail?: string
  notificationPermission?: number
  updatedNotificationPermission?: number
  registeredForPush: boolean = false
  locationPermission?: string
  signUpDetails?: any
  addresses?: []
  contactus: boolean = false
  searchTerm?: any
  isCustomised: boolean = true
  isOnboarded: boolean = false
  profile: Profile = {}
}

class CareReducerModel {
  careCase: CareCase = {
    Category_2__c: 'Hallmark Cards Now',
    Origin: 'Web - Hallmark Cards Now'
  }
  caseID?: string
  caseNumber?: string
  files: CareFile[] = []
  finished: boolean = false
}

class OrderHistoryModel {
  total: number = 0
  page: number = 0
  orders: OrderViewModel[] = []
}

class ConfigReducerModal {
  appConfigValues?: any
}
class FavoriteCategoryReducerModal {
  favoriteCategories?: Array<Category> = []
  recentlyViewedProducts: Array<RecentlyViewedProduct> = []
  recentSearches?: Array<String> = []
}

class MiscReducerModal {
  navigationType?: string
  searchGrouping?: string
  searchResultsCount?: string
  searchQuery?: string
  autoPopulateSearch?: boolean = true
  priceType: string = 'regular'
  siteSection?: string
  categorySelected?: string
  externalCampaignCode?: string
  sfmcid?: string
  icid?: string
}

//Main ReducersModal Model
class RootReducerModal {
  globalLoaderReducer: LoadersModal = new LoadersModal()
  internetStatusReducer: InternetStatusModel = new InternetStatusModel()
  globalLoadMoreReducer: LoadMoreModal = new LoadMoreModal()
  homeReducer: HomeReducerModal = new HomeReducerModal()
  authReducer: AuthReducerModal = new AuthReducerModal()
  categoryReducer: CategoryReducerModal = new CategoryReducerModal()
  customisationReducer: CustomisationReducerModal =
    new CustomisationReducerModal()
  cartReducer: CartReducerModal = new CartReducerModal()
  deliveryReducer: DeliveryReducerModal = new DeliveryReducerModal()
  pdpDetail: PDPModal = new PDPModal()
  globalAdobeReducer: AdobeReducerModal = new AdobeReducerModal()
  configReducer: ConfigReducerModal = new ConfigReducerModal()
  miscReducer: MiscReducerModal = new MiscReducerModal()
  favoriteCategoryReducer: FavoriteCategoryReducerModal =
    new FavoriteCategoryReducerModal()
  globalMessageReducer: MessageModel = new MessageModel()
  careReducer: CareReducerModel = new CareReducerModel()
  orderHistoryReducer: OrderHistoryModel = new OrderHistoryModel()
}

export {
  RootReducerModal,
  LoadersModal,
  MessageModel,
  InternetStatusModel,
  HomeReducerModal,
  AuthReducerModal,
  CategoryReducerModal,
  CartReducerModal,
  LoadMoreModal,
  PDPModal,
  AdobeReducerModal,
  ConfigReducerModal,
  MiscReducerModal,
  CustomisationReducerModal,
  FavoriteCategoryReducerModal,
  DeliveryReducerModal,
  CareReducerModel,
  OrderHistoryModel
}
