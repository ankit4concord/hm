import validateInput from '@ecom/components/ValidationInput'
import { ProfileAddress } from '@ecom/modals'

const validateEditDetails = (type: string, value: any) => {
  switch (type) {
    case 'firstName':
      return validateInput('name', value)
    case 'lastName':
      return validateInput('lastName', value)
    case 'email':
      return validateInput('email', value)
    case 'dateOfBirth':
      return validateBirthday(value?.day, value?.month)
    case 'address':
      return validateAddress(value)
    default:
      break
  }
  return null
}

const validateBirthday = (day?: number, month?: number) => {
  if (!day && !month) {
    return null
  }
  if (!day || !month) {
    return 'Please select both month and day'
  }
  return null
}

const validateStateCode = (stateCode?: string) => {
  if (!stateCode?.trim()) {
    return 'Please select a state'
  }
  return null
}

const validateZipCode = (zip?: string) => {
  if (!zip?.trim()) {
    return 'Please enter the zip code'
  }
  if (!/(^\d{5}$)|(^\d{9}$)/.test(zip)) {
    return 'Your zip code must be 5 or 9 digits'
  }
  return null
}

const validateAddress = (address?: ProfileAddress) => {
  const addressErrors: ProfileAddress = {}
  if (
    !address?.addressLine1 &&
    !address?.addressLine2 &&
    !address?.city &&
    !address?.stateCode &&
    !address?.zip
  ) {
    return addressErrors
  }

  addressErrors.addressLine1 =
    validateInput('addrLine1', address.addressLine1) || undefined

  addressErrors.city = validateInput('city', address.city) || undefined

  addressErrors.stateCode = validateStateCode(address.stateCode) || undefined

  addressErrors.zip = validateZipCode(address.zip) || undefined

  return addressErrors
}

export default validateEditDetails
