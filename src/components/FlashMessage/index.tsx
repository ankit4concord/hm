import FlashMessage, {
  DefaultFlash,
  FlashMessageTransition,
  hideMessage,
  positionStyle,
  renderFlashMessageIcon,
  showMessage
} from './FlashMessage'
import {
  getFlashMessageStatusBarHeight,
  styleWithInset
} from './FlashMessageWrapper'

import FlashMessageManager from './FlashMessageManager'

export {
  FlashMessageManager,
  DefaultFlash,
  styleWithInset,
  getFlashMessageStatusBarHeight,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon
}

export default FlashMessage
