import { vh, vw } from '@ecom/utils/dimension'

import { IconNames } from '@ecom/utils/mockData'
import { Image } from 'react-native'
import NotifyModal from '@ecom/components/NotifyModal'
import React from 'react'
import SvgRender from '@ecom/components/SvgRender'
import colors from '@ecom/utils/colors'
import localImages from '@ecom/utils/localImages'

export default function DeliveryMadeAccount(props: any) {
  const onbtnOneClick = () => {
    props.closeBottomSheet(props.type)
  }
  return (
    <>
      <NotifyModal
        title="You’ve made an account!"
        subtitle="You can now start earning rewards and enjoy more features, like saving contacts."
        Icon={
          <Image
            source={localImages.achievement}
            style={{
              width: vw(236),
              height: vh(267),
              resizeMode: 'contain'
            }}
          />
        }
        btnLabelOne="Continue"
        onbtnOneClick={onbtnOneClick}
        isShowSingleButton={true}
        btnOneStyle={{ color: colors.secondary }}
      />
    </>
  )
}
