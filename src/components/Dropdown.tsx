import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { SelectCountry } from 'react-native-element-dropdown'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const localData = [
  {
    value: 'AL',
    lable: 'Alabama'
  },
  {
    value: 'AK',
    lable: 'Alaska'
  },
  {
    value: 'AZ',
    lable: 'Arizona'
  },
  {
    value: 'AR',
    lable: 'Arkansas'
  },
  {
    value: 'CA',
    lable: 'California'
  },
  {
    value: 'CO',
    lable: 'Colorado'
  },
  {
    value: 'CT',
    lable: 'Connecticut'
  },
  {
    value: 'DE',
    lable: 'Delaware'
  },
  {
    value: 'DC',
    lable: 'District Of Columbia'
  },
  {
    value: 'FL',
    lable: 'Florida'
  },
  {
    value: 'GA',
    lable: 'Georgia'
  },
  {
    value: 'HI',
    lable: 'Hawaii'
  },
  {
    value: 'ID',
    lable: 'Idaho'
  },
  {
    value: 'IL',
    lable: 'Illinois'
  },
  {
    value: 'IN',
    lable: 'Indiana'
  },
  {
    value: 'IA',
    lable: 'Iowa'
  },
  {
    value: 'KS',
    lable: 'Kansas'
  },
  {
    value: 'KY',
    lable: 'Kentucky'
  },
  {
    value: 'LA',
    lable: 'Louisiana'
  },
  {
    value: 'ME',
    lable: 'Maine'
  },
  {
    value: 'MD',
    lable: 'Maryland'
  },
  {
    value: 'MA',
    lable: 'Massachusetts'
  },
  {
    value: 'MI',
    lable: 'Michigan'
  },
  {
    value: 'MN',
    lable: 'Minnesota'
  },
  {
    value: 'MS',
    lable: 'Mississippi'
  },
  {
    value: 'MO',
    lable: 'Missouri'
  },
  {
    value: 'MT',
    lable: 'Montana'
  },
  {
    value: 'NE',
    lable: 'Nebraska'
  },
  {
    value: 'NV',
    lable: 'Nevada'
  },
  {
    value: 'NH',
    lable: 'New Hampshire'
  },
  {
    value: 'NJ',
    lable: 'New Jersey'
  },
  {
    value: 'NM',
    lable: 'New Mexico'
  },
  {
    value: 'NY',
    lable: 'New York'
  },
  {
    value: 'NC',
    lable: 'North Carolina'
  },
  {
    value: 'ND',
    lable: 'North Dakota'
  },
  {
    value: 'OH',
    lable: 'Ohio'
  },
  {
    value: 'OK',
    lable: 'Oklahoma'
  },
  {
    value: 'OR',
    lable: 'Oregon'
  },
  {
    value: 'PA',
    lable: 'Pennsylvania'
  },
  {
    value: 'RI',
    lable: 'Rhode Island'
  },
  {
    value: 'SC',
    lable: 'South Carolina'
  },
  {
    value: 'SD',
    lable: 'South Dakota'
  },
  {
    value: 'TN',
    lable: 'Tennessee'
  },
  {
    value: 'TX',
    lable: 'Texas'
  },
  {
    value: 'UT',
    lable: 'Utah'
  },
  {
    value: 'VT',
    lable: 'Vermont'
  },
  {
    value: 'VA',
    lable: 'Virginia'
  },
  {
    value: 'WA',
    lable: 'Washington'
  },
  {
    value: 'WV',
    lable: 'West Virginia'
  },
  {
    value: 'WI',
    lable: 'Wisconsin'
  },
  {
    value: 'WY',
    lable: 'Wyoming'
  }
]

export default function Dropdown({
  label,
  onChange,
  placeholder,
  value
}: {
  label: any
  onChange: any
  placeholder: any
  value: any
}): JSX.Element {
  const [country, setCountry] = useState('')

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <SelectCountry
        style={styles.dropdown}
        dropdownPosition={'top'}
        inverted={false}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        maxHeight={vh(250)}
        value={value || ''}
        data={localData}
        valueField="value"
        labelField="lable"
        placeholder={'State'}
        searchPlaceholder="Search..."
        onChange={(e) => {
          setCountry(e.value)
          onChange(e.value)
        }}
        imageField={''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: vh(8),
    backgroundColor: colors.inputBox,
    borderRadius: vw(10),
    paddingVertical: vh(9),
    padding: vw(15)
  },
  label: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14)
  },

  placeholderStyle: {
    fontSize: vw(14)
  },
  selectedTextStyle: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM
  }
})
