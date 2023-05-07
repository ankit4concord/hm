import {
  Circle,
  Defs,
  Ellipse,
  G,
  Mask,
  Path,
  Polygon,
  Rect,
  Use
} from 'react-native-svg'

import React from 'react'

export default {
  HomeHouseIcon: {
    svg: (
      <Path d="M11.815 1.391l-10 7.402A2.02 2.02 0 001 10.416v13.57C1 25.098 1.895 26 3 26h20c1.105 0 2-.902 2-2.014v-13.57c0-.64-.303-1.243-.815-1.623l-10-7.402a1.99 1.99 0 00-2.37 0z" />
    ),
    viewBox: '0 0 26 26',
    style: 'fill:black;',
    fillRule: 'evenodd'
  },
  heartIcon: {
    svg: (
      <Path d="M12.21 5.566c-1.147-1.478-2.872-2.358-4.627-2.534-1.667-.166-3.371.306-4.612 1.552a6.759 6.759 0 00-1.97 4.743 6.76 6.76 0 001.913 4.766l10.138 10.31L23.14 14.036A6.755 6.755 0 0025 9.292a6.758 6.758 0 00-1.971-4.708C21.79 3.34 20.085 2.87 18.416 3.035c-1.755.176-3.48 1.054-4.626 2.53A6.454 6.454 0 0013 6.884a6.474 6.474 0 00-.79-1.317z" />
    ),
    style: 'stroke:currentColor',
    viewBox: '0 0 26 26',
    strokeWidth: '2',
    fill: 'none'
  },
  accountIcon: {
    svg: (
      <G>
        <Path
          d="M1.421 25.005c-.297-.55-.421-1.41-.421-2.758C1 18.404 4.848 16 12.515 16 20.182 16 24 18.404 24 22.247c0 1.343-.123 2.202-.418 2.752"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path d="M12.5 2l.297.005c1.476.053 2.81.503 3.766 1.352.902.801 1.437 1.96 1.437 3.42 0 1.757-.736 3.753-1.893 5.25-.95 1.227-2.196 2.155-3.607 2.155-1.41 0-2.658-.928-3.607-2.156C7.736 10.53 7 8.534 7 6.778c0-1.46.535-2.62 1.437-3.421C9.456 2.45 10.907 2 12.5 2h0z" />
      </G>
    ),
    viewBox: '0 0 26 26',
    style: 'stroke:currentColor',
    strokeWidth: '2',
    fill: 'none'
  },
  shopIcon: {
    svg: (
      <G>
        <Path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 10.88c.04-1.5-.06-2.43-.3-2.81-.37-.58-.28-.8-.28-1.56C4.42 4.35 6.97 3 12.05 3s7.6 1.35 7.6 3.51c0 .76-.08 1.24-.27 1.55-.25.39-.35 1.32-.31 2.81"
        />
        <Rect width="16.42" height="3.94" x="3.82" y="15.38" rx="1.34" />
        <Rect width="2.35" height="1.69" x="16.72" y="19.31" rx=".84" />
        <Rect width="2.35" height="1.69" x="5" y="19.31" rx=".84" />
        <Ellipse cx="19.65" cy="13.13" rx="2.35" ry="2.25" />
        <Ellipse cx="4.35" cy="13.13" rx="2.35" ry="2.25" />
      </G>
    ),
    fill: 'none',
    fillRule: 'evenodd',
    viewBox: '0 0 26 26',
    strokeWidth: '2',
    style: 'stroke:currentColor;'
  },
  basketIcon: {
    svg: (
      <G>
        <Circle cx="10.091" cy="24.091" r="1.091" />
        <Circle cx="22.091" cy="24.091" r="1.091" />
        <Path d="M1 1h4.364l2.923 14.729a2.186 2.186 0 002.182 1.77h10.604a2.186 2.186 0 002.182-1.77L25 6.499H6.455" />
      </G>
    ),
    viewBox: '0 0 26 26',
    style: 'stroke:currentColor',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '2'
  },
  magnifierIcon: {
    svg: (
      <G
        style="stroke:currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2">
        <G transform="translate(1 1)">
          <Circle cx="10.7" cy="10.7" r="10.7" />
          <Path d="M24 24l-5.8-5.8" />
        </G>
      </G>
    ),
    viewBox: '0 0 26 26'
  },
  barcodeScanIcon: {
    svg: (
      <Path
        style="stroke:currentColor;"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6.226 7v9.637M10.036 7v4.819M13.845 7v4.819M10.036 15.674v.963M13.845 15.674v.963M17.655 7v9.637M6.762 2H2v4.819M17.179 2h4.762v4.819M6.762 22H2v-4.819M17.238 22H22v-4.819"
      />
    ),
    viewBox: '0 0 24 24'
  },
  menuIcon: {
    svg: (
      <Path
        style="stroke:currentColor;"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-width="2"
        d="M1.575 16.5h21.85M1.575 8.5h21.85"
      />
    ),
    viewBox: '0 0 25 25'
  },
  arrowLeftIcon: {
    svg: <Path d="M25 13H1m12 12L1 13 13 1" />,
    viewBox: '0 0 26 26',
    fill: 'none',
    strokeLinecap: 'round',
    style: 'stroke:currentColor;',
    strokeLinejoin: 'round',
    strokeWidth: '2'
  },
  arrowRightIcon: {
    svg: (
      <Path
        d="M25 13H1M13 25l12-12L13 1"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="current"
      />
    )
  },
  sortFilterIcon: {
    svg: (
      <G
        style="stroke:currentColor;"
        stroke="current"
        fill="current"
        fill-rule="evenodd"
        stroke-width="2">
        <Path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.294 3v3.325M16.706 3v8.075M7.294 13.925v7.6M16.706 18.675v2.85"
        />
        <Ellipse cx="7.294" cy="10.125" rx="3.294" ry="3.325" />
        <Ellipse cx="16.706" cy="14.875" rx="3.294" ry="3.325" />
      </G>
    ),
    viewBox: '0 0 24 24'
  },
  starFillIcon: {
    svg: (
      <Path
        style="stroke:currentColor; fill:currentColor;"
        stroke-width="2"
        d="M13 2l3.708 7.57L25 10.79l-6 5.89L20.416 25 13 21.07 5.584 25 7 16.68l-6-5.889L9.292 9.57z"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    ),
    style: 'fill:black;stroke:black',
    fillRule: 'evenodd',
    viewBox: '0 0 26 26'
  },
  circleCheckIcon: {
    svg: (
      <G
        style="stroke:currentColor;"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round">
        <Path d="M19 9l-7.865 8.892L6 12.832" />
        <Circle cx="13" cy="13" r="12" />
      </G>
    ),
    viewBox: '0 0 26 26'
  },
  eyeOpenIcon: {
    svg: (
      <G
        fill="none"
        fill-rule="evenodd"
        stroke="currentColor"
        stroke-width="2"
        transform="translate(2 6)">
        <Path d="M4 2C5.6.5 7.7 0 10 0s4.3.6 6 2c1.9 1.2 3.2 2.9 4 5a10.7 10.7 0 01-10 7c-2.2 0-4.3-.6-6-2C2 10.9.7 9.2 0 7c.8-2.1 2.1-3.8 4-5z" />
        <Circle cx="10" cy="7" r="3" />
      </G>
    ),
    viewBox: '0 0 24 24'
  },
  eyeClosedIcon: {
    svg: (
      <G
        fill="none"
        fill-rule="evenodd"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2">
        <G transform="translate(2 6)">
          <Path d="M4 2C5.6.5 7.7 0 10 0s4.3.6 6 2c1.9 1.2 3.2 2.9 4 5a10.7 10.7 0 01-10 7c-2.2 0-4.3-.6-6-2C2 10.9.7 9.2 0 7c.8-2.1 2.1-3.8 4-5z" />
          <Circle cx="10" cy="7" r="3" />
        </G>
        <Path d="M20 5L4 21" />
      </G>
    ),
    viewBox: '0 0 24 24'
  },
  closeIcon: {
    svg: (
      <Path
        d="M25 1L1 25M1 1l24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="stroke:currentColor;"
        stroke-width="2"
      />
    ),
    viewBox: '0 0 26 26'
  },
  mapPinIcon: {
    svg: (
      <Path
        d="M13.5 1c5.2 0 9.5 4.4 9.5 9.8 0 7-7.9 13-9.3 14l-.1.1-.1.1h-.1l-.1-.2c-1.4-1-9.3-7-9.3-14C4 5.4 8.3 1 13.5 1zm0 5.4a4.2 4.2 0 100 8.4 4.2 4.2 0 000-8.4z"
        style="stroke:currentColor;"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    ),
    viewBox: '0 0 26 26'
  },
  locationIcon: {
    svg: (
      <G fill="none" fill-rule="evenodd">
        <Circle cx="12" cy="12" r="8" stroke="#007694" stroke-width="2" />
        <Path
          stroke="#007694"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 2v3m0 14v3M2 12h3m14 0h3"
        />
        <Circle cx="12" cy="12" r="4" fill="#007694" />
      </G>
    )
  },
  lockIcon: {
    svg: (
      <G fill="none" fill-rule="evenodd">
        <Path
          stroke="white"
          stroke-width="1"
          d="M7.3 12V6.4C7.3 3 10 1 13 1s5.8 2 5.8 5.4V12"
        />
        <Path
          stroke="white"
          stroke-width="1"
          d="M5 13.7v9.6c0 1 .8 1.7 1.7 1.7h12.6c1 0 1.7-.8 1.7-1.7v-9.6c0-1-.8-1.7-1.7-1.7H6.7c-1 0-1.7.8-1.7 1.7z"
        />
        <Path
          stroke="white"
          stroke-width="1"
          d="M12.3 18.4c0 1.7-.3 2.4.7 2.4s.8-1 .8-2.4c0 0 .7-.5.7-1.5s-.8-1.5-1.5-1.5c-.8 0-1.5.5-1.5 1.5s.8 1.5.8 1.5z"
        />
      </G>
    )
  },
  storeIcon: {
    svg: (
      <G>
        <Defs>
          <Path
            d="M6.26164065,4.4408921e-15 C6.16932577,0.425944037 6.120426,0.87064706 6.120426,1.32802318 C6.120426,5.11329465 9.892386,9.17079917 10.9485348,10.2327091 L11.077626,10.3611124 C11.169426,10.4513659 11.220426,10.4990615 11.220426,10.4990615 C11.220426,10.4990615 11.271426,10.4513659 11.363226,10.3611124 L11.4923172,10.2327091 C12.548466,9.17079917 16.320426,5.11329465 16.320426,1.32802318 C16.320426,0.876702663 16.2728125,0.437721883 16.1828552,0.0169281888 C17.7657944,0.182059627 19,1.5204828 19,3.14717013 L19,15.4219816 C19,17.1600206 17.591041,18.5689795 15.8530021,18.5689795 L3.14699793,18.5689795 C1.40895897,18.5689795 -2.31240824e-16,17.1600206 0,15.4219816 L0,3.14717013 C-6.56937595e-16,1.40913117 1.40895897,0.000172205236 3.14699793,0.000172205236 Z"
            id="path-1"></Path>
        </Defs>
        <G
          id="Product-Details"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd">
          <G id="In-Store-Map">
            <Circle id="Oval" fill="#FFFFFF" cx="16" cy="16" r="16"></Circle>
            <G id="Group" transform="translate(4.000000, 4.000000)">
              <G id="Group-7" transform="translate(2.500000, 1.000000)">
                <G id="Group-4" transform="translate(0.000000, 3.431020)">
                  <Mask id="mask-2" fill="white">
                    <Use href="#path-1"></Use>
                  </Mask>
                  <G id="Combined-Shape"></G>
                  <G mask="url(#mask-2)">
                    <G transform="translate(0.000000, 0.000172)">
                      <Rect
                        id="Rectangle"
                        fill="#C2C6C9"
                        x="0"
                        y="14.0707733"
                        width="6.60869565"
                        height="4.4211446"></Rect>
                      <Rect
                        id="Rectangle-Copy-11"
                        fill="#C2C6C9"
                        x="8.98369565"
                        y="6.18960245"
                        width="4.13043478"
                        height="12.3792049"></Rect>
                      <Rect
                        id="Rectangle-Copy-12"
                        fill="#C2C6C9"
                        x="14.0434783"
                        y="6.18960245"
                        width="4.95652174"
                        height="3.53691568"></Rect>
                      <Rect
                        id="Rectangle-Copy-15"
                        fill="#C2C6C9"
                        x="0"
                        y="0"
                        width="3.30434783"
                        height="3.53691568"></Rect>
                      <Rect
                        id="Rectangle-Copy-16"
                        fill="#C2C6C9"
                        x="4.09601449"
                        y="0"
                        width="3.30434783"
                        height="3.53691568"></Rect>
                      <Rect
                        id="Rectangle-Copy-18"
                        fill="#C3C3C3"
                        x="13.2173913"
                        y="0"
                        width="2.47826087"
                        height="3.53691568"></Rect>
                      <Rect
                        id="Rectangle-Copy-19"
                        fill="#C2C6C9"
                        x="16.5217391"
                        y="0"
                        width="2.47826087"
                        height="3.53691568"></Rect>
                      <Polygon
                        id="Rectangle-Copy-17"
                        fill="#C3C3C3"
                        points="9.08695652 0 12.3913043 0 12.3913043 4.77483617 10.0782609 4.77483617 9.08695652 3.71376147"></Polygon>
                      <Rect
                        id="Rectangle-Copy-13"
                        fill="#C2C6C9"
                        x="13.9059227"
                        y="10.6107471"
                        width="4.95652174"
                        height="3.53691568"></Rect>
                      <Rect
                        id="Rectangle-Copy-14"
                        fill="#C2C6C9"
                        x="13.9059227"
                        y="14.9550022"
                        width="4.95652174"
                        height="3.53691568"></Rect>
                      <Polygon
                        id="Rectangle-Copy-10"
                        fill="#C2C6C9"
                        points="0 6.18960245 5.19254658 6.18960245 6.60869565 7.21852337 6.60869565 13.2634338 0 13.2634338"></Polygon>
                    </G>
                  </G>
                </G>
                <G
                  id="Group-3"
                  transform="translate(6.900000, 0.000000)"
                  fill="#0098BD">
                  <Path
                    d="M4.35416667,0 C6.75890649,0 8.70833333,2.16311596 8.70833333,4.83145474 C8.70833333,8.4258704 4.72455892,12.5421461 4.37814375,12.8932884 L4.35416667,12.9174312 L4.35416667,12.9174312 L4.33018958,12.8932884 C3.98377442,12.5421461 0,8.4258704 0,4.83145474 C0,2.16311596 1.94942684,0 4.35416667,0 Z M4.35416667,2.21441678 C3.2611031,2.21441678 2.375,3.11806224 2.375,4.2327654 C2.375,5.34746856 3.2611031,6.25111402 4.35416667,6.25111402 C5.44723023,6.25111402 6.33333333,5.34746856 6.33333333,4.2327654 C6.33333333,3.11806224 5.44723023,2.21441678 4.35416667,2.21441678 Z"
                    id="Combined-Shape"></Path>
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    ),
    viewBox: '0 0 32 32'
  },
  mobileIcon: {
    svg: (
      <G fill="none" fill-rule="evenodd">
        <Rect
          width="13.7"
          height="20"
          x="5"
          y="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          rx="1.6"
        />
        <Circle cx="12" cy="18" r="1.5" fill="currentColor" />
      </G>
    )
  },
  questionIcon: {
    svg: (
      <G
        transform="translate(1 1)"
        style="stroke:currentColor;"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round">
        <Circle cx="12" cy="12" r="12"></Circle>
        <Path
          d="M8.508 8.4a3.6 3.6 0 016.996 1.2c0 2.4-3.6 3.6-3.6 5 M12 18h.012"
          stroke-width="3"
        />
        <Circle cx="12" cy="18.5" r="0.8" fill="currentColor" />
      </G>
    )
  },
  chatIcon: {
    svg: (
      <G
        style="stroke:currentColor;"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round">
        <Path d="M19 12.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L1 22l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5h0z" />
        <Path d="M16 19.733c1.125.554 1.567.6 2.667.6a5.587 5.587 0 002.533-.6L25 21l-1.267-3.8a5.587 5.587 0 00.6-2.533A5.667 5.667 0 0021.2 9.6a5.364 5.364 0 00-2.533-.6" />
      </G>
    )
  },
  warningIcon: {
    svg: (
      <G
        stroke="#000"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round">
        <Path
          d="M6.8 1.2L1.5 10a1.2 1.2 0 001 1.8h10.6a1.2 1.2 0 001-1.8L9 1.2a1.2 1.2 0 00-2.1 0z"
          fill="#FF0"></Path>
        <Path stroke-width="2" d="M7.8 4.4v2.4M7.8 9.3h0"></Path>
      </G>
    ),
    viewBox: '0 0 26 26'
  },
  awardIcon: {
    svg: (
      <G
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        transform="translate(5.5 1.2)">
        <Circle cx="7.5" cy="7.5" r="7.5" />
        <Path d="M3.4 13.8l-1.3 9.8 5.4-3.2 5.4 3.2-1.3-9.8" />
      </G>
    )
  },
  detailsIcon: {
    svg: (
      <Path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6.7 6.7H25V24H6.7zM1 4.8V25M6.7 1H24"
      />
    )
  },
  moreActionIcon: {
    svg: (
      <Path
        style="fill:currentColor;"
        d="M13 20a3 3 0 110 6 3 3 0 010-6zm0-10a3 3 0 110 6 3 3 0 010-6zm0-10a3 3 0 110 6 3 3 0 010-6z"
        fill-rule="evenodd"
      />
    )
  },
  deleteIcon: {
    svg: (
      <G
        fill="none"
        fill-rule="evenodd"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="2">
        <Path d="M5.1 9.1h12.8l-1.2 12.6H6.3z" />
        <Path stroke-linecap="round" d="M8.2 5.2V3h6.7v2.2M3 5.7h17.1" />
      </G>
    )
  },
  externalIcon: {
    svg: (
      <G
        fill="none"
        fill-rule="evenodd"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2">
        <Path d="m20 4.4-8.3 8.3" />

        <Path
          stroke-linejoin="round"
          d="m11.6 3.9 9-.2v9.1M6.9 5.5H3.4v12.9c0 1.2 1 2.2 2.2 2.2H19v-3.3"
        />
      </G>
    )
  },
  editIcon: {
    svg: (
      <G fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2">
        <Path
          stroke-linejoin="round"
          d="M15 6.5 17.5 4l2.8 3-2.5 2.4-10.2 10-3.8 1L5 16.5z"
        />
        <Path d="M14.6 7 17 9.6" />
      </G>
    )
  },
  alertIcon: {
    svg: (
      <G
        stroke="currentColor"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round">
        <Path
          stroke-width="2"
          d="M11 3.1L1.3 19.6c-.4.7-.4 1.6 0 2.3.4.8 1.2 1.2 2 1.2h19.4c.8 0 1.6-.4 2-1.2.4-.7.4-1.6 0-2.3L15 3.1a2.3 2.3 0 00-4 0z"
        />
        <Path stroke-width="3" d="M13 8.9v6.2m0 5.3h0" />
        <Circle cx="13" cy="19" r="0.5" fill="currentColor" />
      </G>
    )
  }
}
