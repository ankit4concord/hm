import { CircleIcon, Icon } from '@ecom/components/icons'
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const CartWebProduct = (props: any) => {
  const {
    productName,
    c_imageUrls,
    itemId,
    c_pills,
    c_deliveryCharge,
    c_pricing,
    c_totalPrice,
    c_arrivesInfo,
    quantity
  } = props?.item?.item

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>{c_pills}</Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.dev.hallmark.com/shopping-cart')
            }>
            <DropShadow style={styles.shadowBtn}>
              <View style={styles.modifyBtnContainer}>
                <Text style={styles.modifyBtnTxt}>Modify</Text>
                <Icon name={'hm_Arrow-thin'} size={vw(10)} />
              </View>
            </DropShadow>
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
              circleStyle={{ marginLeft: vw(7) }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <View style={styles.conent}>
          <DropShadow style={styles.shadowContainer}>
            <Image
              source={{
                uri: c_imageUrls
              }}
              style={styles.productImg}
            />
          </DropShadow>
          <View style={styles.priceTxt}>
            <Text style={styles.productName}>{productName}</Text>
            <View style={styles.subject}>
              <Text style={styles.txtSubject}>Delivery</Text>
              <Text style={styles.txt}>{c_deliveryCharge}</Text>
            </View>
            <View style={styles.arriveSubject}>
              <Text style={styles.arrivetxtSubject}>Arrives</Text>
              <View style={{ flex: 0.7 }}>
                <Text style={styles.arriveTxt}>{c_arrivesInfo}</Text>
                <Text style={styles.changeShipTxt}>Change shipping at</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.hallmark.com')}>
                  <Text style={styles.linkTxt}>Hallmark.com</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.subject}>
              <Text style={styles.txtSubject}>Quantity</Text>
              <Text style={styles.txt}>{quantity}</Text>
            </View>
            <View style={styles.subject}>
              <Text style={styles.txtSubject}>Price</Text>
              <Text style={styles.txt}>${c_pricing?.StandardPrice}</Text>
            </View>
            <View style={styles.subject}>
              <Text style={styles.txtSubject}>Total</Text>
              <Text style={styles.txt}>${c_totalPrice}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CartWebProduct
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vh(15),
    alignItems: 'center'
  },
  header: {
    paddingVertical: vh(6),
    paddingHorizontal: vw(10),
    backgroundColor: colors.hmPurpleBorder,
    borderRadius: vw(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(14),
    letterSpacing: vw(-0.03),
    color: colors.hmPurple
  },
  titleContainer: {
    backgroundColor: colors.lightgraybox,
    borderRadius: vw(10),
    justifyContent: 'center'
  },
  title: {
    fontSize: vw(14),
    paddingHorizontal: vw(10)
  },
  txtSubject: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.3
  },
  arrivetxtSubject: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.3
  },
  txt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03),
    flex: 0.7
  },
  arriveTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(15),
    letterSpacing: vw(-0.03)
  },
  discriptionTxt: {
    fontSize: vw(12),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03),
    marginLeft: vw(10),
    color: colors.grayTxt
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shadowBtn: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  modifyBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vh(10),
    paddingHorizontal: vw(14),
    backgroundColor: colors.white,
    borderRadius: vw(60),
    justifyContent: 'center'
  },
  modifyBtnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    marginRight: vw(7),
    justifyContent: 'center',
    alignItems: 'center'
  },
  priceContainer: {
    marginBottom: vh(20)
  },
  conent: {
    flexDirection: 'row',
    flex: 0.5
  },
  productImg: {
    width: vw(100),
    height: vh(106)
  },
  priceTxt: {
    flex: 1,
    marginLeft: vw(13)
  },
  subject: {
    flexDirection: 'row',
    marginBottom: vh(12)
  },
  arriveSubject: {
    marginBottom: vh(12),
    flexDirection: 'row'
  },
  linkTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03),
    color: colors.grayTxt,
    textDecorationLine: 'underline'
  },
  changeShipTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03),
    color: colors.grayTxt
  },
  productName: {
    fontFamily: fonts.MEDIUM,
    marginBottom: vh(20),
    lineHeight: vh(17),
    fontSize: vw(14)
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4
  }
})
