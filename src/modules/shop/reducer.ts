import {
  CartReducerModal,
  CategoryReducerModal,
  CustomisationReducerModal,
  DeliveryReducerModal
} from '../../modals'

import ActionNames from '../../utils/actionNames'
import _ from 'lodash'
import { generateCanvasJSONUtil } from './canvasConversion'

export const categoryReducer = (
  state = new CategoryReducerModal(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.CATEGORY_INFO:
      return { ...state, ...action.payload }
    case ActionNames.PRODUCTLIST_INFO:
      return { ...state, ...action.payload }
    case ActionNames.PRODUCTS_COUNT:
      return { ...state, ...action.payload }
    case ActionNames.FILTER_INFO:
      return { ...state, ...action.payload }
    case ActionNames.ACTIVE_FILTERS:
      return { ...state, ...action.payload }
    case ActionNames.PDP_DETAIL:
      return { ...state, ...action.payload }

    case ActionNames.SEARCH_SUGGESTIONS:
      return { ...state, ...action.payload }
    case ActionNames.PRODUCT_SEARCH_RESULTS:
      return { ...state, ...action.payload }
    case ActionNames.PRODUCT_SEARCH_RESULTS_COUNT:
      return { ...state, ...action.payload }
    case ActionNames.ACTIVE_SEARCH_FILTERS:
      return { ...state, ...action.payload }
    case ActionNames.QUANTITY:
      return { ...state, ...action.payload }
    case ActionNames.UPDATE_PRODUCT_TYPE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const customisationReducer = (
  state = new CustomisationReducerModal(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.CUSTOMISATION_STATE:
      return { ...state, ...action.payload }
    case ActionNames.POD_DELIVERY_OPTIONS:
      return { ...state, ...action.payload }
    case ActionNames.DIGITAL_DELIVERY_OPTIONS:
      return { ...state, ...action.payload }
    case ActionNames.UPDATE_IMAGE:
      let newState = _.cloneDeep(state)
      let userDefinedData = false
      if (
        newState.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId] === undefined
      ) {
        userDefinedData = true
        const nameOfImage = generateCanvasJSONUtil.addImage({
          faceId: action.payload.faceId + 1,
          photoZoneId: action.payload.photozoneId,
          userDefined: userDefinedData,
          objectId: action.payload.imageId,

          config: {
            ...action.payload.imageData,
            multiplierX: action.payload.multiplierX,
            multiplierY: action.payload.multiplierY,
            insideWidth: action.payload.insideWidth
          }
        })
        newState.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones.push({
          ...action.payload.imageDimensions,
          image: {
            ...action.payload.imageData,
            imageId: action.payload.imageId,
            photoTrayId: action.payload.photoTrayId,
            sliderIndex: action.payload.sliderIndex,
            name: nameOfImage
          },
          userDefined: true
        })
      } else {
        const nameOfImage = generateCanvasJSONUtil.addImage({
          faceId: action.payload.faceId + 1,
          photoZoneId: action.payload.photozoneId,
          userDefined: userDefinedData,
          objectId: action.payload.imageId,
          config: {
            ...action.payload.imageData,
            insideWidth: action.payload.insideWidth
          }
        })
        newState.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId].image = {
          ...action.payload.imageData,
          imageId: action.payload.imageId,
          photoTrayId: action.payload.photoTrayId,
          sliderIndex: action.payload.sliderIndex,
          name: nameOfImage
        }
      }
      console.log('READ DATA=', generateCanvasJSONUtil.getProjectData())

      return newState

    case ActionNames.DELETE_IMAGE:
      let updatedState = _.cloneDeep(state)
      if (
        !updatedState.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.itemIndex].userDefined
      ) {
        delete updatedState.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.itemIndex].image
      } else {
        updatedState.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.itemIndex].deleted = true
      }
      return updatedState

    case ActionNames.ADD_TEXT:
      let clonedState = _.cloneDeep(state)
      clonedState.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts.push(action.payload.newText)
      return clonedState

    case ActionNames.UPDATE_INSIDE_TEXT:
      let data = _.cloneDeep(state)
      let newTextData = {
        ...data.customFabricObj.variables.template_data.faces[
          action.payload.sliderIndex
        ].texts[action.payload.selectedTextInside],
        [action.payload.property]: action.payload.value
      }
      data.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts[action.payload.selectedTextInside] = newTextData
      return data

    case ActionNames.ADD_SLIDER_INDEXES:
      let cloneData = _.cloneDeep(state)
      let newTexts = []
      action.payload.allTexts.map((item) => {
        return (
          item.userDefined === undefined &&
          newTexts.push({
            ...item,
            sliderIndex:
              item.left * action.payload.mutiplierWidth <=
              action.payload.screenWidth
                ? 1
                : 2
          })
        )
      })
      cloneData.customFabricObj.variables.template_data.faces[
        action.payload.faceID
      ].texts = newTexts
      return cloneData

    case ActionNames.UPDATE_TEXT_POSITION:
      let oldData = _.cloneDeep(state)
      let newData = {
        ...oldData.customFabricObj.variables.template_data.faces[
          action.payload.sliderIndex
        ].texts[action.payload.itemKey],
        translateX: action.payload.translateX,
        translateY: action.payload.translateY
      }
      oldData.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts[action.payload.itemKey] = newData
      return oldData

    case ActionNames.SET_HEIGHT_WIDTH_TEXTBOX:
      let deepData = _.cloneDeep(state)
      let newData1 = {
        ...deepData.customFabricObj.variables.template_data.faces[
          action.payload.sliderIndex
        ].texts[action.payload.itemKey],
        height: action.payload.height,
        width: action.payload.width
      }
      deepData.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts[action.payload.itemKey] = newData1
      return deepData

    case ActionNames.FIT_LOCAL_TEXT_TO_FABRIC_OBJ:
      let cloneData1 = _.cloneDeep(state)
      let newTexts1 = []
      cloneData1.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts.map((item, index) => {
        return newTexts1.push({
          ...item,
          text: action.payload.allTextsArr[index]
        })
      })
      cloneData1.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts = newTexts1
      return cloneData1

    case ActionNames.DELETE_INSIDE_TEXT:
      let deepCLoneState = _.cloneDeep(state)
      deepCLoneState.customFabricObj.variables.template_data.faces[
        action.payload.sliderIndex
      ].texts[action.payload.itemIndex].isDeleted = true
      return deepCLoneState

    case ActionNames.DISCARD_TEXT_EDITING:
      let CLonedState = _.cloneDeep(state)
      if (
        CLonedState?.customFabricObj?.variables?.template_data?.faces[
          action?.payload?.sliderIndex
        ]
      ) {
        CLonedState.customFabricObj.variables.template_data.faces[
          action.payload.sliderIndex
        ].texts = action.payload.backupTexts
      }

      return CLonedState

    case ActionNames.UPDATE_PAN:
      let newStatePan = _.cloneDeep(state)
      action.payload.sliderIndex =
        action.payload.sliderIndex > 1 ? 1 : action.payload.sliderIndex
      if (
        newStatePan?.customFabricObj?.variables?.template_data?.faces[
          action.payload.sliderIndex
        ].photoZones[action.payload.activeIndex]
      ) {
        let newData = {
          ...newStatePan.customFabricObj.variables.template_data.faces[
            action.payload.sliderIndex
          ].photoZones[action.payload.activeIndex].image,
          left: action.payload.pos[action.payload.activeIndex]?.x,
          top: action.payload.pos[action.payload.activeIndex]?.y
        }
        newStatePan.customFabricObj.variables.template_data.faces[
          action.payload.sliderIndex
        ].photoZones[action.payload.activeIndex].image = newData
      } else {
        newStatePan.customFabricObj.variables.template_data.faces[
          action.payload.sliderIndex
        ].photoZones[action.payload.activeIndex].image = [
          ...action.payload.imageData,
          {
            left: action.payload.pos[action.payload.activeIndex]?.x,
            top: action.payload.pos[action.payload.activeIndex]?.y
          }
        ]
      }
      generateCanvasJSONUtil.applyPan({
        faceId: action.payload.sliderIndex + 1,
        type: 'image',
        objectName:
          newStatePan?.customFabricObj?.variables?.template_data?.faces[
            action.payload.sliderIndex
          ].photoZones[action.payload.activeIndex].image.name,
        objectIndex: action.payload.activeIndex,
        translateX: action.payload.pos[action.payload.activeIndex]?.x,
        translateY: action.payload.pos[action.payload.activeIndex]?.y,
        multiplierX: action.payload.multiplierX,
        multiplierY: action.payload.multiplierY
      })
      console.log('READ DATA', generateCanvasJSONUtil.getProjectData())

      return newStatePan

    case ActionNames.UPDATE_IMAGE_ROTATION:
      let newStateRotation = _.cloneDeep(state)

      if (
        newStateRotation.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId]
      ) {
        let newData = {
          ...newStateRotation.customFabricObj.variables.template_data.faces[
            action.payload.faceId
          ].photoZones[action.payload.photozoneId].image,
          angle: action.payload.angle
        }
        newStateRotation.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId].image = newData
      } else {
        newStateRotation.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId].image = [
          ...action.payload.imageData,
          {
            angle: action.payload.angle
          }
        ]
      }

      console.log('READ DATA', generateCanvasJSONUtil.getProjectData())

      return newStateRotation

    case ActionNames.UPDATE_IMAGE_CROP:
      let newStateCrop = _.cloneDeep(state)

      if (
        newStateCrop.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId]
      ) {
        let newData = {
          ...newStateCrop.customFabricObj.variables.template_data.faces[
            action.payload.faceId
          ].photoZones[action.payload.photozoneId].image,
          uri: action.payload.image_url,
          sourceVersionId: action.payload.sourceVersionId,
          localUrl: action.payload.image_url
        }
        newStateCrop.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId].image = newData
      }
      return newStateCrop

    case ActionNames.PREVIEW_TEMPLATE:
      return { ...state, ...action.payload }

    case ActionNames.UPDATE_IMAGE_SCALE:
      let newStateScale = _.cloneDeep(state)
      let newDataScale = {
        ...newStateScale.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId]?.image,
        scaleX: action.payload.scaleX
          ? action.payload.scaleX
          : newStateScale.customFabricObj.variables.template_data.faces[
              action.payload.faceId
            ].photoZones[action.payload.photozoneId]?.image?.scaleX,
        scaleY: action.payload.scaleY
          ? action.payload.scaleY
          : newStateScale.customFabricObj.variables.template_data.faces[
              action.payload.faceId
            ].photoZones[action.payload.photozoneId]?.image?.scaleY,
        scale: action.payload.scale
      }
      if (
        newStateScale.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId]
      ) {
        newStateScale.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId].image = newDataScale
        console.log('Object for Scale', {
          faceId: action.payload.faceId + 1,
          type: 'image',
          objectName:
            newStateScale.customFabricObj.variables.template_data.faces[
              action.payload.faceId
            ].photoZones[action.payload.photozoneId].image.name,
          objectIndex: action.payload.photozoneId,
          scaleX: action.payload.scaleX
            ? action.payload.scaleX
            : newStateScale.customFabricObj.variables.template_data.faces[
                action.payload.faceId
              ].photoZones[action.payload.photozoneId]?.image?.scaleX,
          scaleY: action.payload.scaleY
            ? action.payload.scaleY
            : newStateScale.customFabricObj.variables.template_data.faces[
                action.payload.faceId
              ].photoZones[action.payload.photozoneId]?.image?.scaleY
        })
      }
      console.log(
        'payload==',
        action.payload.sliderIndex,
        action.payload.insideWidth
      )

      if (action.payload.sliderIndex == 2 && action.payload.insideWidth) {
        newStateScale.customFabricObj.variables.template_data.faces[
          action.payload.faceId
        ].photoZones[action.payload.photozoneId].image.insideWidth =
          action.payload.insideWidth
      }
      console.log('READ DATA', generateCanvasJSONUtil.getProjectData())
      return newStateScale
    case ActionNames.RESET_CUSTOMISATION_STATE:
      return { ...action.payload }
    case ActionNames.SAVE_PERSONALIZATION:
      return { ...state, ...action.payload }
    case ActionNames.CUSTOMIZATION_INITIAL_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const cartReducer = (state = new CartReducerModal(), action: any) => {
  switch (action.type) {
    case ActionNames.BASKET_INFO:
      return { ...state, ...action.payload }
    case ActionNames.SESSION:
      return { ...state, ...action.payload }
    case ActionNames.SHOW_UNDO:
      return { ...action.payload }
    default:
      return { ...state }
  }
}

export const deliveryReducer = (
  state = new DeliveryReducerModal(),
  action: any
) => {
  let newState = _.cloneDeep(state)

  switch (action.type) {
    case ActionNames.DIGITAL_CARD_STATE:
      return { ...state, ...action.payload }
    case ActionNames.POD_CARD_STATE:
      return { ...state, ...action.payload }
    case ActionNames.UPDATE_SENDER_ADDRESS:
      // newState?.cardDeliveryData[2]?.isCompleted = true
      // newState?.cardDeliveryData[2]?.isCompleted = true
      let newData = {
        ...newState?.cardDeliveryData[2],
        isCompleted: true,
        formDetails: action?.payload.formDetails
      }
      newState.cardDeliveryData[2] = newData
      return newState
    case ActionNames.UPDATE_RECIPIENT_ADDRESS:
      let newDataRecipient = {
        ...newState?.cardDeliveryData[3],
        isCompleted: true,
        formDetails: action?.payload.formDetails
      }
      newState.cardDeliveryData[3] = newDataRecipient
      return newState
    case ActionNames.UPDATE_RECIPIENT_EMAIL_ADDRESS:
      let newDataEmailRecipient = {
        ...newState?.cardDeliveryData[1],
        isCompleted: true,
        subtitle: 'Send via email',
        type: 'delivery',
        formDetails: action?.payload.formDetails
      }
      newState.cardDeliveryData[1] = newDataEmailRecipient

      let newDataEmailSenderDetail = {
        ...newState?.cardDeliveryData[2],
        isCompleted: true,
        show: true
      }
      newState.cardDeliveryData[2] = newDataEmailSenderDetail

      let newDataEmailReceiverDetail = {
        ...newState?.cardDeliveryData[3],
        isCompleted: true,
        show: true
      }
      newState.cardDeliveryData[3] = newDataEmailReceiverDetail
      return newState
    case ActionNames.UPDATE_TEXT_DELIVERY:
      let newDataTextRecipient = {
        ...newState?.cardDeliveryData[1],
        isCompleted: true,
        subtitle: 'Send via text',
        type: 'TextDelivery'
      }
      newState.cardDeliveryData[1] = newDataTextRecipient

      if (newState?.cardDeliveryData[2]) {
        let newDataEmailSenderDetail = {
          ...newState?.cardDeliveryData[2],
          isCompleted: true,
          show: false
        }
        newState.cardDeliveryData[2] = newDataEmailSenderDetail
        let newDataEmailReceiverDetail = {
          ...newState?.cardDeliveryData[3],
          isCompleted: true,
          show: false
        }
        newState.cardDeliveryData[3] = newDataEmailReceiverDetail
      }

      return newState

    default:
      return state
  }
}
