import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import CheckBox from '@react-native-community/checkbox'
import Icon from '@ecom/components/Icon'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { useSelector } from 'react-redux'

export const SearchSortFilter = ({
  item,
  searchResultSortEnable,
  setsearchResultSortEnabled
}: any) => {
  return (
    <View
      style={[
        styles.rowContainer,
        {
          marginTop: vh(16),
          display: 'flex',
          marginBottom: vh(1)
        }
      ]}>
      <TouchableHighlight
        underlayColor={colors?.white}
        onPress={() => setsearchResultSortEnabled(item)}>
        <Text
          style={[styles.optionTxt, { marginLeft: vw(4) }]}
          onPress={() => setsearchResultSortEnabled(item)}>
          {item?.label?.replace('Price:', '')}
        </Text>
      </TouchableHighlight>
      <TouchableOpacity
        onPress={() => setsearchResultSortEnabled(item)}
        activeOpacity={0.6}
        style={{ alignSelf: 'flex-end' }}>
        <Icon
          name={
            searchResultSortEnable?.label == item?.label
              ? localImages.radio_selected
              : localImages.radio_unselected
          }
          style={styles.radioIcon}
        />
      </TouchableOpacity>
    </View>
  )
}
export const SearchOptionsFilter = ({
  item,
  selected,
  getValue,
  isClearAll,
  setIsClearAll,
  setSelected
}: any) => {
  const [check, setCheck] = useState(false)
  const { searchResultTempFilters } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  useEffect(() => {
    if (searchResultTempFilters?.length > 0) {
      setCheck(
        searchResultTempFilters?.filter((el) => el.value === item.value)
          .length > 0
      )
    }
  }, [])
  useEffect(() => {
    if (selected?.length > 0) {
      setCheck(
        searchResultTempFilters?.filter((el) => el.value === item.value)
          .length > 0
      )
    }
    setSelected(searchResultTempFilters)
  }, [searchResultTempFilters])

  useEffect(() => {
    if (isClearAll) {
      setCheck(false)
      setIsClearAll(false)
    }
  }, [isClearAll])
  return (
    <View
      style={[
        styles.rowContainer,
        {
          alignItems: 'center',
          marginTop: vw(16)
        }
      ]}>
      <TouchableHighlight
        underlayColor={colors?.white}
        onPress={() => {
          setCheck(!check)
          getValue(
            item,
            !selected.filter((e) => e.label === item.label).length > 0
          )
        }}>
        <Text style={styles.optionTxt}>
          {item.label} ({item.count})
        </Text>
      </TouchableHighlight>
      <CheckBox
        disabled={false}
        style={{
          width: 20,
          height: 20,
          borderWidth: 1,
          borderColor: '#DFDFDF',
          borderRadius: 3
        }}
        value={check}
        boxType="square"
        tintColor={'#F8F8F8'}
        onCheckColor={'#fff'}
        onFillColor={colors.green}
        onTintColor={'transparent'}
        animationDuration={0.1}
        onValueChange={(newValue) => {
          setCheck(newValue)
          getValue(
            item,
            !selected.filter((e) => e.label === item.label).length > 0
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minWidth: vw(60),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vh(16)
  },
  filtersetContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enableCheckbox: {
    marginLeft: vw(8),
    alignSelf: 'flex-end'
  },
  optionTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03),
    backgroundColor: 'white',
    fontVariant: ['lining-nums']
  },
  filterContainer: {
    borderBottomWidth: vw(0.5),
    borderColor: colors.lightGray,
    paddingVertical: vh(20)
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heading: {
    fontFamily: fonts.BOLD,
    fontSize: vw(22)
  },
  boldTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(15),
    marginLeft: vw(8),
    textAlign: 'center'
  },
  priceInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: vh(8),
    paddingTop: vh(16)
  },
  listName: {
    fontSize: vw(15),
    fontFamily: fonts.REGULAR,
    color: colors.darkGray,
    lineHeight: vh(18),
    fontWeight: '400'
  },
  priceButtonContainer: {
    borderRadius: vh(8),
    borderColor: colors.tertiaryBtnBorder,
    backgroundColor: colors.white,
    borderWidth: 2,
    width: vw(200),
    paddingHorizontal: vw(16),
    shadowColor: colors.shadow,
    shadowOffset: { width: -0, height: 1 },
    shadowRadius: vw(6),
    paddingVertical: vh(8),
    height: vh(44),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vh(16)
  },
  priceButtonLabel: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(16),
    fontWeight: '500',
    color: colors.primaryBtnBackground
  },
  colorCircle: {
    width: vw(34),
    height: vw(34),
    borderRadius: vw(17),
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteColor: {
    width: vw(34),
    height: vw(34),
    borderRadius: vw(17),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1
  },
  colorContainer: {
    alignContent: 'center',
    textAlign: 'center',
    marginVertical: vh(15),
    width: vw(60)
  },
  multicolor: {
    width: vw(30),
    height: vw(30),
    borderRadius: vw(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioIcon: {
    width: vw(20),
    height: vw(20)
  }
})
