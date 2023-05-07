import validateInput from '@ecom/components/ValidationInput'

const validateCareInformation = (type: string, value: any) => {
  switch (type) {
    case 'Supplied_First_Name__c':
      return validateInput('name', value)
    case 'Supplied_Last_Name__c':
      return validateInput('lastName', value)
    case 'SuppliedEmail':
      return validateInput('email', value)
    case 'Supplied_Postal_Code__c':
      return validateZipCode(value)
    case 'SuppliedPhone':
      return validatePhone(value)
    default:
      break
  }
  return null
}

const validateZipCode = (zip?: string) => {
  if (!zip?.trim()) {
    return null
  }
  if (!/(^\d{5}$)|(^\d{9}$)/.test(zip)) {
    return 'Your zip code must be 5 or 9 digits'
  }
  return null
}

const validatePhone = (phone?: string) => {
  if (!phone?.trim()) {
    return null
  }
  if (!/(^\d{10}$)/.test(phone)) {
    return 'Your phone must be 10 digits'
  }
  return null
}

export default validateCareInformation
