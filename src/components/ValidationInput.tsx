const validateInput = (type: any, value: any) => {
  const nameRegexp = /^[a-zA-Z\s&'-]*$/

  switch (type) {
    case 'email':
      if (!value?.trim()) {
        return 'Please enter email address'
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return 'Please enter a valid email address'
      }
      break
    case 'password':
      if (value?.length < 8) {
        return 'Your password needs at least 8 characters. Try typing a longer password.'
      }
      break
    case 'name':
      if (!value?.trim()) {
        return 'Please enter first name'
      }
      if (value?.length < 2 || value?.length > 15)
        return 'Please enter from 2 up to 15 characters.'
      if (!value?.match(nameRegexp)) return 'No special characters, please.'
      break
    case 'lastName':
      if (!value?.trim()) {
        return 'Please enter last name'
      }
      if (value?.length < 2 || value?.length > 20)
        return 'Please enter from 2 up to 20 characters.'
      if (!value?.match(nameRegexp)) return 'No special characters, please.'
      break
    case 'addrLine1':
      if (!value?.trim()) {
        return 'Please enter address line 1'
      }
      if (value?.length < 1 || value?.length > 55)
        return 'Please enter from 1 up to 55 characters.'
      break
    case 'addrLine2':
      if (value?.length > 0) {
        if (value?.length < 1 || value?.length > 50)
          return 'Please enter from 1 up to 50 characters.'
      }
      break
    case 'city':
      if (!value?.trim()) {
        return 'Please enter city'
      }
      if (value?.length < 2 || value?.length > 26)
        return 'Please enter from 2 up to 26 characters.'
      break
    case 'state':
      if (!value?.trim() || value == '') {
        return 'Please enter state'
      } else if (value === 'State') {
        return 'Please enter state'
      }
      break
    case 'zipCode':
      if (!value?.trim()) {
        return 'Please enter zipcode'
      }
      if (value?.length != 5) {
        return 'Please enter a valid 5-digit ZIP code.'
      }

      break

    case 'number':
      if (!/^\d+$/.test(value)) {
        return 'Please enter valid number'
      }
      break
    case 'address':
      if (!/^[a-zA-Z0-9., ]+$/.test(value)) {
        return 'Please enter address'
      }
      break
    case 'senderFirstName':
      if (!value?.trim()) {
        return 'Please enter sender first name'
      }
      if (value?.length < 2 || value?.length > 15)
        return 'Please enter from 2 up to 15 characters.'
      if (!value?.match(nameRegexp)) return 'No special characters, please.'
      break
    case 'senderLastName':
      if (!value?.trim()) {
        return 'Please enter sender last name'
      }
      if (value?.length < 2 || value?.length > 20)
        return 'Please enter from 2 up to 20 characters.'
      if (!value?.match(nameRegexp)) return 'No special characters, please.'

      break
    case 'recipientFirstName':
      if (!value?.trim()) {
        return 'Please enter a recipient first name'
      }
      if (value?.length < 2 || value?.length > 15)
        return 'Please enter from 2 up to 15 characters.'
      if (!value?.match(nameRegexp)) return 'No special characters, please.'
      break
    case 'recipientLastName':
      if (!value?.trim()) {
        return 'Please enter a recipient last name'
      }
      if (value?.length < 2 || value?.length > 20)
        return 'Please enter from 2 up to 20 characters.'
      if (!value?.match(nameRegexp)) return 'No special characters, please.'

      break
    case 'recipientEmailAddress':
      if (!value?.trim()) {
        return 'Please enter Recipient email address'
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return 'Please enter valid Recipient email address'
      }
      break
    default:
      break
  }

  return null
}

export default validateInput
