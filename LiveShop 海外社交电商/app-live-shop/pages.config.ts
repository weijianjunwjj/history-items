import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'LiveShop',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-sel.png',
        pagePath: 'pages/index/index',
        text: 'HOME',
      },
      {
        iconPath: 'static/tabbar/community.png',
        selectedIconPath: 'static/tabbar/community-sel.png',
        pagePath: 'pages/community/community',
        text: 'COMMUNITY',
      },
      {
        iconPath: 'static/tabbar/shop.png',
        selectedIconPath: 'static/tabbar/shop-sel.png',
        pagePath: 'pages/shop/shop',
        text: 'STORE',
      },
      {
        iconPath: 'static/tabbar/my.png',
        selectedIconPath: 'static/tabbar/my-sel.png',
        pagePath: 'pages/my/my',
        text: 'CENTER',
      },
    ],
  },
  subPackages: [
    {
      root: 'devTools/page',
      name: 'devToolsPage',
      pages: [
        {
          path: 'index',
          style: {
            navigationStyle: 'custom',
            // #ifdef APP-PLUS
            softinputMode: 'adjustResize',
            backgroundColor: 'transparent',
            animationDuration: 1,
            animationType: 'none',
            popGesture: 'none',
            bounce: 'none',
            titleNView: false,
            // #endif
          },
        },
      ],
    },
  ],
})
