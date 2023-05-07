import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { OptionsFilter, SortFilter } from './FilterSet'
import React, { createRef, useEffect, useState } from 'react'
import {
  addFilters,
  clearActiveFilters,
  getFilteredProductList,
  setFilteredData
} from '../../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import CustomButton from '@ecom/components/CustomButton'
import { Icon } from '@ecom/components/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import _ from 'lodash'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

interface FiltersModalProps {
  navigation: any
  route: any
}

export function FiltersModal(props: FiltersModalProps) {
  const dispatch = useDispatch()
  const {
    filters,
    tempProductCount,
    sort,
    tempFilters,
    minPrice,
    maxPrice,
    activeFilters
  } = useSelector((state: RootReducerModal) => state.categoryReducer)
  const { shopLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const [showSort, setSort] = useState(false)
  const [isClearAll, setIsClearAll] = useState(false)
  const [sortEnable, setSortEnabled] = useState<any>(
    (sort && Object.values(sort)?.length) > 0 ? sort : filters?.sort[0]
  )
  const minRef = createRef()
  const maxRef = createRef()
  const [show, setShow] = useState()
  useEffect(() => {
    if (sortEnable?.label) {
      dispatch(
        getFilteredProductList(
          props?.route?.params?.category ?? props?.route?.params?.propsData?.id,
          sortEnable.value,
          'sort',
          sortEnable
        )
      )
    }
  }, [sortEnable])

  useEffect(() => {}, [])
  useEffect(() => {}, [isClearAll])

  return (
    <View style={{ marginTop: 20, marginBottom: vh(-10) }}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={{
            display: 'flex',
            alignSelf: 'flex-start'
          }}
          onPress={() => {
            if (activeFilters?.length > 0) {
              if (_.isEqual(tempFilters, activeFilters))
                props.navigation.goBack()
              else {
                dispatch({
                  type: actionNames.PRODUCTLIST_INFO,
                  payload: {
                    tempFilters: activeFilters
                  }
                })
                props.navigation.goBack()
              }
            } else {
              dispatch(
                clearActiveFilters(
                  props?.route?.params?.category ??
                    props?.route?.params?.propsData?.id
                )
              )
              props.navigation.goBack()
            }
          }}>
          <CircleIcon
            name={'hm_CloseLarge-thick'}
            circleColor={colors.white}
            circleSize={vw(36)}
            iconSize={vw(11)}
            circleStyle={{
              borderWidth: 1,
              borderColor: colors.graylight
            }}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.rowContainer,
            {
              paddingHorizontal: vw(20),
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row'
            }
          ]}>
          <Text style={styles.heading}>Filter </Text>
          <Text style={styles.results}>
            (
            {tempProductCount === 0 || tempProductCount === 1
              ? `${tempProductCount} Result`
              : `${tempProductCount} Results`}
            )
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {tempFilters?.length > 0 && (
          <View style={styles.tempFilters}>
            <Text style={styles.selectedFilters}>Selected filters:</Text>
            <FlatList
              data={tempFilters}
              horizontal={true}
              style={{}}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }: any) => (
                <View style={styles.filterChip}>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(
                        addFilters(item, false, 'mobile-app-categories', false)
                      )
                    }>
                    <CircleIcon
                      name={'hm_CloseLarge-thick'}
                      circleColor={colors.crossBackGreen}
                      circleSize={vw(20)}
                      iconSize={vh(6)}
                      iconColor={colors.white}
                    />
                  </TouchableOpacity>
                  <Text style={styles.filterChipTxt}>{item.label}</Text>
                </View>
              )}
            />
          </View>
        )}
        <KeyboardAwareScrollView
          contentContainerStyle={
            tempFilters?.length > 0
              ? { paddingBottom: vh(290) }
              : { paddingBottom: vh(140) }
          }
          style={[
            {
              height: '90%',
              backgroundColor: 'white',
              marginTop: vh(20)
            }
          ]}>
          <View style={styles.container}>
            <FlatList
              data={filters?.filters}
              scrollEnabled={false}
              keyExtractor={(index) => index.toString()}
              showsVerticalScrollIndicator={true}
              contentInset={{ top: 0 }}
              // contentContainerStyle={{ paddingBottom: vh(220) }}
              renderItem={({ item }: any) => {
                return item?.options && item?.options.length > 0 ? (
                  <FilterBoxRender
                    item={item}
                    isClearAll={isClearAll}
                    setIsClearAll={setIsClearAll}
                    minRef={minRef}
                    maxRef={maxRef}
                    show={show}
                    setShow={setShow}
                    subcat={
                      props?.route?.params?.category ??
                      props?.route?.params?.propsData?.id
                    }
                  />
                ) : (
                  <></>
                )
              }}
            />
          </View>
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSort(!showSort)}
              style={styles.rowContainer}>
              <View style={styles.sortTxt}>
                <Text style={styles.optionTxt}>Sort</Text>
                <View style={{ marginRight: vw(37) }}></View>
                <Text style={styles.boldTxt}>{sortEnable?.label ?? ''}</Text>
              </View>
              {showSort ? (
                <Icon name={'hm_ChevronUp-thick'} size={vh(15)} />
              ) : (
                <Icon name={'hm_ChevronDown-thick'} size={vh(15)} />
              )}
            </TouchableOpacity>
            {showSort && (
              <FlatList
                data={filters?.sort}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(index) => index.toString()}
                renderItem={({ item }: any) => (
                  <SortFilter
                    item={item}
                    isClearAll={isClearAll}
                    setIsClearAll={setIsClearAll}
                    minRef={minRef}
                    maxRef={maxRef}
                    subcat={
                      props?.route?.params?.category ??
                      props?.route?.params?.propsData?.id
                    }
                    sortEnable={sortEnable}
                    setSortEnabled={(val: any) => {
                      setSortEnabled(val)
                    }}
                  />
                )}
              />
            )}
          </View>
          {shopLoading && <Loader />}
        </KeyboardAwareScrollView>
      </View>
      <View
        style={[
          styles.footerComponent,
          tempFilters?.length > 0 ? { bottom: vh(70) } : { bottom: 0 }
        ]}>
        {tempFilters?.length > 0 ||
        minPrice?.length > 0 ||
        maxPrice?.length > 0 ? (
          <TouchableOpacity
            style={styles.clearAllContainer}
            onPress={() => {
              Keyboard.dismiss()
              setSortEnabled(filters?.sort[0])
              dispatch(
                clearActiveFilters(
                  props?.route?.params?.category ??
                    props?.route?.params?.propsData?.id
                )
              )
              setIsClearAll(true)
              maxRef?.current?.blur()
            }}>
            <Text style={styles.clearAllTxt}>Clear all</Text>
            <Icon
              name={'hm_CloseLarge-thick'}
              size={vh(7)}
              color={colors.lightgray}
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.clearAllContainer}></View>
        )}
        <View style={styles.filterBtnContainer}>
          <CustomButton
            disabled={tempProductCount > 0 ? false : true}
            extraStyle={
              tempProductCount > 0
                ? styles.modalFooterButtonContainer
                : styles.modalFooterDisabledButtonContainer
            }
            label={
              tempProductCount === 0 || tempProductCount === 1
                ? `See ${tempProductCount} results`
                : `See ${tempProductCount} results`
            }
            labelExtraStyle={styles.filterBtnTxt}
            onPress={() => {
              dispatch(
                setFilteredData(sortEnable, () => {
                  props.navigation.goBack()
                })
              )
            }}
          />
        </View>
      </View>
    </View>
  )
}

const FilterBoxRender = ({
  item,
  isClearAll,
  setIsClearAll,
  subcat,
  maxRef,
  minRef,
  show,
  setShow
}: any) => {
  const dispatch = useDispatch()
  const { activeFilters, minPrice, maxPrice, sort } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const { isConnected } = useSelector(
    (state: RootReducerModal) => state.internetStatusReducer
  )

  const [selected, setSelected] = useState([])
  const [min, setMin] = useState(minPrice ?? '')
  const [max, setMax] = useState(maxPrice ?? '')
  useEffect(() => {
    if (isClearAll) {
      setSelected([])
      setMax('')
      setMin('')
      setIsClearAll(false)
    }
  }, [isClearAll])

  useEffect(() => {
    if (activeFilters?.length > 0) {
      setSelected(
        item?.options.filter((el: any) => {
          activeFilters?.some((i: any) => i.value === el.value)
        })
      )
    }
  }, [])

  if (
    item.label === 'Category' ||
    item.value == 'cgid' ||
    item.label === 'Price'
  ) {
    return <></>
  } else {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (show === item.label) setShow(false)
            else setShow(item.label)
          }}
          style={styles.rowContainer}>
          <View style={styles.options}>
            <Text style={{ ...styles.optionTxt }}>{`${item.label}  `}</Text>
            {show != item.label ? (
              <Icon name={'hm_ChevronDown-thick'} size={vh(15)} />
            ) : (
              <Icon name={'hm_ChevronUp-thick'} size={vh(15)} />
            )}
          </View>
        </TouchableOpacity>
        <ScrollView
          style={{ maxHeight: vh(100) }}
          showsVerticalScrollIndicator={false}>
          {show == item.label &&
            item?.options &&
            item?.options?.length > 0 &&
            item.options.map((rowData: any) => {
              return (
                <OptionsFilter
                  item={rowData}
                  selected={selected}
                  isClearAll={isClearAll}
                  setIsClearAll={setIsClearAll}
                  setSelected={setSelected}
                  getValue={(val: any, check: boolean) => {
                    if (isConnected) {
                      dispatch(addFilters({ ...val, cat: item }, check, subcat))
                      let taskArray = null
                      if (check) {
                        taskArray = {
                          ...val
                        }
                        setSelected([...selected, taskArray])
                      } else {
                        let selectedFilters = selected
                        const select = selectedFilters.filter(
                          (item: any) => item.label !== val.label
                        )
                        setSelected(select)
                      }
                    }
                  }}
                />
              )
            })}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: vw(20),
    alignItems: 'center'
  },
  container: {
    flex: 1,
    paddingHorizontal: vw(20),
    backgroundColor: colors.white
  },
  enableCheckbox: {
    marginRight: vw(8)
  },
  optionTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    letterSpacing: vw(-0.03)
  },

  filterContainer: {
    borderBottomWidth: vw(1),
    borderColor: colors.graylight,
    paddingTop: vh(25),
    paddingBottom: vh(21)
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  heading: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.defaultTextcolor,
    backgroundColor: 'white',
    textAlign: 'center'
  },
  boldTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(16),
    marginBottom: vw(2),
    textAlign: 'center',
    color: colors.grayTxt
  },
  priceInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: vh(16)
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
    borderColor: colors.linkColor,
    backgroundColor: colors.white,
    borderWidth: 1,
    width: vh(172),
    height: vh(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vh(16)
  },
  priceButtonLabel: {
    fontSize: vw(15),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    letterSpacing: 0.8,
    fontWeight: '500',
    color: colors.hmPurple
  },
  colorCircle: {
    width: vw(34),
    height: vw(34),
    borderRadius: vw(17),
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vh(15),
    width: vw(60)
  },
  footerComponent: {
    position: 'absolute',
    paddingTop: vh(40),
    paddingBottom: vh(45),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 20
  },
  modalFooterButtonContainer: {
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(17),
    paddingHorizontal: vh(25),
    borderRadius: vw(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  modalFooterDisabledButtonContainer: {
    paddingHorizontal: vw(25),
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(17),
    borderRadius: vw(30),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.41,
    width: '92%'
  },
  selectedFiltersContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: vw(8)
  },

  results: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    fontVariant: ['lining-nums'],
    // lineHeight: vh(19),
    marginLeft: vw(3),
    color: '#16161680'
  },
  tempFilters: { marginHorizontal: vh(20), marginTop: vh(14) },
  filterChip: {
    backgroundColor: colors.hmPurple,
    borderRadius: vw(20),
    paddingVertical: vh(8),
    paddingRight: vw(10),
    paddingLeft: vw(8),
    marginRight: vw(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterChipTxt: {
    color: colors.white,
    marginLeft: vw(5)
  },

  clearAllContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  filterBtnContainer: {
    flex: 1
  },
  filterBtnTxt: {
    fontSize: vw(16),
    // lineHeight: vh(15),
    letterSpacing: vw(-0.02),
    fontVariant: ['lining-nums']
  },
  // clearIcon: {
  //   marginLeft: vw(12),
  //   width: vw(8),
  //   height: vh(8)
  // },
  clearAllTxt: {
    color: colors.grayTxt,
    fontSize: vw(14),
    fontWeight: '500',
    letterSpacing: vw(-0.03),
    alignItems: 'center'
  },
  selectedFilters: {
    marginBottom: vh(11),
    fontSize: vw(12),
    lineHeight: vh(14),
    letterSpacing: vw(-0.03),
    color: colors.grayTxt,
    fontFamily: fonts.MEDIUM
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center'
  },
  sortTxt: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  clearIcon: {
    marginLeft: vw(12)
  }
})
