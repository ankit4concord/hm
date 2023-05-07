import _ from 'lodash'

export const lowercaseKeys = (obj: any): any => {
  if (typeof obj !== 'object') {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(lowercaseKeys)
  }
  if (obj === null) {
    return null
  }
  const entries = Object.entries(obj)
  const mappedEntries = entries.map(
    ([k, v]) => [`${_.camelCase(k)}`, lowercaseKeys(v)] as const
  )
  return Object.fromEntries(mappedEntries)
}

export const isEmptyDeep = (
  mixedVar: any,
  emptyValues = [undefined, null, '']
) => {
  for (const val of emptyValues) {
    if (val === mixedVar) {
      return true
    }
  }
  if (typeof mixedVar === 'object') {
    for (const item of Object.values(mixedVar)) {
      if (!isEmptyDeep(item, emptyValues)) {
        return false
      }
    }
    return true
  }
  return false
}

export const minTwoDigits = (n: number | undefined) => {
  return n ? `${n < 10 ? '0' : ''}${n}` : ''
}
