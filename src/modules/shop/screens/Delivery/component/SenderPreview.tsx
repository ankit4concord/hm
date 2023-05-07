import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import { IconNames } from '@ecom/utils/mockData'
import React from 'react'
import SvgRender from '@ecom/components/SvgRender'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

const SenderPreview = (props: any) => {
  const { title, subtitle, icon, editClicked } = props
  return (
    <>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              {icon && (
                // <Image style={styles.image} source={localImages.profile} />
                <></>
              )}
              <View>
                {title && <Text style={styles.title}>{title}</Text>}
                {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
              </View>
            </View>
            <View style={styles.roundedEdit}>
              <TouchableOpacity style={styles.Icon} onPress={editClicked}>
                <CircleIcon
                  name={'hm_EditText-thin'}
                  circleColor={colors.graylight}
                  circleSize={vw(25)}
                  iconSize={vw(11)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
export default SenderPreview

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    marginVertical: vh(30)
  },
  Icon: {
    width: vw(30),
    height: vh(30),
    resizeMode: 'contain'
  },
  imageContainer: { flexDirection: 'row' },
  image: { width: vw(40), height: vh(40), marginRight: vw(10) },
  title: { color: colors.title },
  subTitle: { fontFamily: fonts.MEDIUM },
  roundedEdit: { alignSelf: 'center', paddingRight: vw(15) }
})
