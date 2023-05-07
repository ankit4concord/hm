import React, { useCallback } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import BottomSheet from '@ecom/components/BottomSheet'
import { Linking } from 'react-native'
import NotifiyModal from '@ecom/components/NotifyModal'
import { PhotoLibrary } from '@ecom/assets/svg'

const ErrorLibraryComponent = ({ BSheetRef }: { BSheetRef: any }) => {
  const _openAppSetting = useCallback(async () => {
    await Linking.openSettings()
  }, [])
  return (
    <BottomSheet
      sheetRef={BSheetRef}
      children={
        <NotifiyModal
          title="Share your photo library"
          subtitle="Then you can upload and add photos, plus save them to your photo library."
          buttonLabel="Enable library access"
          onOkClick={_openAppSetting}
          isShowCancel={false}
          Icon={<PhotoLibrary height={vh(104)} width={vw(100)} />}
        />
      }
    />
  )
}

export default ErrorLibraryComponent
