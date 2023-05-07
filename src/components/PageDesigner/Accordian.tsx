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
import { Icon } from '../icons'
import React from 'react'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import strings from '@ecom/utils/strings'
import { useDispatch } from 'react-redux'

const Accordian = (props: any) => {
  const { item } = props
  const dispatch = useDispatch()

  const AccordianData = item?.tiles
  return (
    <View>
      {AccordianData.map((accordian: any, index: any) => {
        const navigateToScreen = () => {
          dispatch({
            type: actionNames.HOME_REDUCER,
            payload: {
              componentClicked: 'Accordian'
            }
          })
          if (accordian?.cta?.startsWith(strings.scheme)) {
            if (accordian?.icid) {
              dispatch({
                type: actionNames.MISC_INFO,
                payload: {
                  icid: accordian?.icid
                }
              })
            }
            Linking.openURL(accordian?.cta)
          } else {
            console.log('*** No Deeplink')
          }
        }
        return accordian?.image && accordian?.title ? (
          <TouchableOpacity
            onPress={() => navigateToScreen()}
            style={index === 0 ? styles.firstAccordian : styles.accordian}
            key={`accordian-${index}`}>
            <View style={styles.imagesContainer}>
              <DropShadow style={styles.imgContainer}>
                <Image
                  source={{ uri: accordian?.image }}
                  style={styles.accordianImage}
                />
              </DropShadow>
              <Text style={styles.accordianTitle}>{accordian?.title}</Text>
            </View>
            <View>
              <Icon
                name={'hm_ChevronRight-thick'}
                size={vh(15)}
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>
        ) : null
      })}
    </View>
  )
}
const styles = StyleSheet.create({
  arrowIcon: {
    marginRight: vw(5)
  },
  firstAccordian: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: vw(20),
    justifyContent: 'space-between',
    borderColor: colors.graylight,
    paddingVertical: vh(15)
  },
  accordian: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: vw(1),
    marginHorizontal: vw(20),
    justifyContent: 'space-between',
    borderColor: colors.graylight,
    paddingVertical: vh(15)
  },
  accordianTitle: { fontFamily: fonts.MEDIUM, fontSize: vw(16) },
  accordianImage: {
    width: vw(30),
    height: vw(30),
    resizeMode: 'contain',
    marginRight: vw(12),
    borderRadius: vw(15),
    borderWidth: vw(2),
    borderColor: colors.white
  },
  imgContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.9
  }
})

export default Accordian
