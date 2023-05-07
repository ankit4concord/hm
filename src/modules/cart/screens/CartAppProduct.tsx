import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import { Icon } from '@ecom/components/icons'
import Loader from '@ecom/components/Loader'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { useSelector } from 'react-redux'

const CartAppProduct = (props: any) => {
  const {
    productName,
    c_imageUrls,
    c_pills,
    c_deliveryCharge,
    c_pricing,
    itemId,
    deliveryType,
    c_arrivesInfo,
    productId,
    c_projectID
  } = props?.item?.item
  const { cartLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  return (
    <View style={styles.container}>
      {cartLoading && <Loader />}

      <View style={styles.containerTitle}>
        {deliveryType == 'Text' || deliveryType == 'Email' ? (
          <View style={styles.digitalTitleContainer}>
            <Text style={styles.digitalTitle}>{c_pills}</Text>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{c_pills}</Text>
          </View>
        )}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => {
              navigate(screenNames.SHOP_NAVIGATOR, {
                screen: screenNames.LOAD_TEMPLATE,
                params: {
                  product_id: productId,
                  editing: 'true',
                  project_id: c_projectID
                }
              })
            }}>
            <CircleIcon
              name={'hm_EditText-thin'}
              circleColor={colors.white}
              circleSize={vw(30)}
              iconSize={vw(12)}
              shadow={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props?.receiveItemId(itemId)
              props?.BSheetRef?.current?.open()
            }}>
            <CircleIcon
              name={'hm_Delete-thin'}
              circleColor={colors.white}
              circleSize={vw(30)}
              iconSize={vw(12)}
              shadow={true}
              circleStyle={{ marginLeft: vw(10) }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <DropShadow style={styles.shadowContainer}>
          <Image
            source={{
              uri: c_imageUrls
            }}
            style={styles.img}
          />
        </DropShadow>
        <View style={styles.detailContainer}>
          <Text style={styles.productName}>{productName}</Text>
          <View style={styles.subTxtContainers}>
            <Text style={styles.txtSubject}>Delivery</Text>
            <Text style={styles.txt}>{c_deliveryCharge}</Text>
          </View>
          <View style={styles.TxtContainers}>
            <Text style={styles.txtSubArrive}>Arrives</Text>
            <View style={{ flex: 0.7 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <View>
                  <Text style={styles.txtArrivesOptions}>
                    {c_arrivesInfo
                      ? c_arrivesInfo
                      : deliveryType === 'Text'
                      ? 'After Payment'
                      : ' Instant Delivery'}
                  </Text>
                  {deliveryType != 'Text' && deliveryType != 'Email' && (
                    <Text style={styles.optionTxt}>
                      More shipping options during checkout
                    </Text>
                  )}
                </View>

                {(deliveryType == 'Text' || deliveryType == 'Email') && (
                  <TouchableOpacity>
                    <CircleIcon
                      name={'hm_QuestionMark-thin'}
                      circleColor={colors.white}
                      circleSize={vw(24)}
                      iconSize={vw(11)}
                      iconColor={colors.blackText}
                      circleStyle={{
                        borderWidth: 1,
                        borderColor: colors.graylight,
                        top: vh(-2),
                        marginLeft: vw(2)
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={styles.subTxt}>
            <Text style={styles.txtSubject}>Price</Text>
            <Text style={styles.txt}>${c_pricing?.StandardPrice}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default CartAppProduct
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vh(15)
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  digitalTitleContainer: {
    backgroundColor: colors.lightgraybox,
    borderRadius: vw(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vh(10),
    paddingVertical: vh(6),
    paddingHorizontal: vw(10)
  },

  digitalTitle: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(14),
    color: colors.deliveryBottomTxt
  },
  titleContainer: {
    backgroundColor: colors.hmPurpleBorder,
    borderRadius: vw(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vh(10),
    paddingVertical: vh(6),
    paddingHorizontal: vw(10)
  },
  title: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(14),
    color: colors.hmPurple
  },
  txtSubject: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtSubArrive: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.3
  },
  txtArrives: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03)
  },
  txtArrivesOptions: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.7
  },
  cardDetails: {
    flexDirection: 'row',
    flex: 0.5
  },
  detailContainer: {
    flex: 1,
    marginLeft: vw(13)
  },
  productName: {
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(17),
    fontSize: vw(14),
    marginBottom: vh(20)
  },
  subTxtContainers: {
    flexDirection: 'row',
    flex: 0.3,
    marginBottom: vh(10)
  },
  TxtContainers: {
    flexDirection: 'row',
    flex: 0.3
  },
  subTxt: {
    flexDirection: 'row',
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vh(20)
  },
  img: {
    marginBottom: vh(20),
    width: vw(100),
    height: vh(100),
    resizeMode: 'contain'
  },
  icon: {},
  iconNtxt: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: vh(10)
  },
  optionTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03),
    color: colors.grayTxt,
    marginBottom: vh(10)
  },
  rbSheet: {
    borderRadius: vw(15),
    padding: vw(40)
  },
  sheetContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  binImg: {
    width: vw(85),
    height: vh(113),
    resizeMode: 'contain',
    marginBottom: vh(45)
  },

  deleteText: {
    fontSize: vw(14),
    lineHeight: vh(18),
    fontFamily: fonts.MEDIUM
  },
  sheetbtnContainer: {
    flexDirection: 'row',
    marginTop: vh(77),
    paddingHorizontal: vw(20)
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: colors.black,
    marginRight: vw(20),
    paddingHorizontal: vw(25),
    paddingVertical: vh(18)
  },
  deletebtn: {
    borderWidth: 2,
    borderColor: colors.hmPurple,
    paddingHorizontal: vw(25),
    paddingVertical: vh(18)
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  deleteBtnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  cancelBtnTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.black,
    fontSize: vw(16),
    lineHeight: vh(19)
  }
})
