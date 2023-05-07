import { DropDown, DropDownItem } from '@ecom/components/drop-down'
import { Description, LabelName } from '@ecom/components/typography'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import fonts from '@ecom/utils/fonts'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

interface BirthdayProps {
  day: number
  month: number
  error?: string
  onChange?: (month: string, day: string) => void
}

export const Birthday = (props: BirthdayProps) => {
  const { onChange } = props
  const [day, setDay] = useState(props.day?.toString() || '')
  const [month, setMonth] = useState(props.month?.toString() || '')
  const [hasError, setHasError] = useState(!!props.error)

  useEffect(() => {
    setDay(props.day.toString() || '')
  }, [props.day])

  useEffect(() => {
    setMonth(props.month?.toString() || '')
    setDays(getDaysByMonth(props.month.toString()))
  }, [props.month])

  useEffect(() => {
    setHasError(!!props.error)
  }, [props.error])

  const getDaysByMonth = (item?: string): DropDownItem[] => {
    const monthNum = Number(item) || 0
    let daysList: DropDownItem[] = []
    if (monthNum > 0) {
      daysList.push({ label: 'Day', value: '' })
      const daysArray = [...Array(new Date(2020, monthNum, 0).getDate()).keys()]
      daysList = [
        ...daysList,
        ...daysArray.map((num) => {
          const val = num + 1
          return { label: val.toString(), value: val.toString() }
        })
      ]
    }
    return daysList
  }

  const [days, setDays] = useState<DropDownItem[]>(
    getDaysByMonth(month?.toString())
  )

  const months = [
    { label: 'Month', value: '' },
    ...[...Array(12).keys()].map((num) => {
      const val = num + 1
      return { label: val.toString(), value: val.toString() }
    })
  ]

  const updateBirthDay = (dayValue: string) => {
    if (onChange) {
      onChange(month, dayValue)
    }
  }

  const updateBirthMonth = (monthValue: string) => {
    if (onChange) {
      onChange(monthValue, '')
    }
  }

  const onSetMonth = (item: DropDownItem) => {
    const { value = '' } = item
    onSetDay({ label: '', value: '' })
    setMonth(value)
    setDays(getDaysByMonth(value))
    updateBirthMonth(value)
  }

  const onSetDay = (item: DropDownItem) => {
    const { value = '' } = item
    setDay(value)
    updateBirthDay(value)
  }

  return (
    <View style={styles.container}>
      <LabelName style={styles.label}>Birthday</LabelName>
      <View style={styles.dropdownRow}>
        <DropDown
          items={months}
          setSelected={onSetMonth}
          placeholder={'Month'}
          style={styles.month}
          initialValue={month}
        />
        <DropDown
          items={days}
          setSelected={onSetDay}
          placeholder={'Day'}
          style={styles.day}
          initialValue={day}
        />
      </View>
      {hasError ? (
        <Description style={styles.error}>{props.error}</Description>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  dropdownRow: {
    flexDirection: 'row'
  },
  label: {
    fontFamily: fonts.REGULAR,
    paddingBottom: vh(8)
  },
  container: {
    marginBottom: vh(20)
  },
  month: {
    width: vw(125),
    marginRight: vw(20)
  },
  day: {
    width: vw(125)
  },
  error: {
    fontFamily: fonts.MEDIUM,
    marginTop: vh(8),
    color: colors.darkOrange
  }
})
