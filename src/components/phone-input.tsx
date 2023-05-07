import { FloatingTextInput, FloatingTextInputProps } from './CustomInput'
import React, { useEffect, useState } from 'react'

const formatPhoneNumber = (text: string, previousText: string) => {
  if (!text) return text
  const deleting = previousText && previousText.length > text.length
  if (deleting) {
    return text
  }
  let cleaned = text.replace(/\D/g, '')
  let match = null

  if (cleaned.length > 0 && cleaned.length < 3) {
    return `(${cleaned}`
  } else if (cleaned.length === 3) {
    return `(${cleaned}) `
  } else if (cleaned.length > 3 && cleaned.length < 6) {
    match = cleaned.match(/(\d{3})(\d{1,3})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}`
    }
  } else if (cleaned.length === 6) {
    match = cleaned.match(/(\d{3})(\d{3})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-`
    }
  } else if (cleaned.length > 6 && cleaned.length < 10) {
    match = cleaned.match(/(\d{3})(\d{3})(\d+)$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  } else if (cleaned.length >= 10) {
    match = cleaned.match(/(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  }

  return text
}

export const PhoneInput = React.forwardRef(
  (props: FloatingTextInputProps, ref: any) => {
    const { value, onChangeText, ...rest } = props
    const [maskedValue, setMaskedValue] = useState(
      formatPhoneNumber(value, value)
    )

    useEffect(() => {
      setMaskedValue(formatPhoneNumber(value, value))
    }, [value])

    const onChange = (type: any, text: string) => {
      if (onChangeText) {
        const formattedNum = formatPhoneNumber(text, maskedValue)
        const cleaned = formattedNum.replace(/\D/g, '')
        onChangeText(type, cleaned)
        setMaskedValue(formattedNum)
      }
    }

    return (
      <FloatingTextInput
        {...rest}
        ref={ref}
        onChangeText={onChange}
        value={maskedValue}
      />
    )
  }
)
