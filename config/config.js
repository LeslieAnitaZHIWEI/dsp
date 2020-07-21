import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      // component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/form',
      component: '../layouts/BlankLayout',
      authority: ['admin', 'user'],
      routes: [
       
        {
          path: '/form/advPlanForm',
          name: 'advPlanForm',
          component: './advManage/advPlanForm',
        },
        {
          path: '/form/editPlanForm/:id',
          name: 'editPlanForm',
          component: './advManage/editPlanForm',
        },
        {
          path: '/form/viewPlanForm/:id',
          name: 'viewPlanForm',
          component: './advManage/viewPlanForm',
        },
        {
          path: '/form/viewAdvForm/:id',
          name: 'viewAdvForm',
          component: './advManage/viewAdvForm',
        },
        
        {
          path: '/form/addAdv/:id',
          name: 'addAdv',
          component: './advManage/addAdv',
        },
        {
          path: '/form/addCreativity/:id',
          name: 'addCreativity',
          component: './advManage/addCreativity',
        },
        
        {
          path: '/form/editAdv',
          name: 'editAdv',
          component: './advManage/editAdv',
        },
        {
          path: '/form/checkDayManage',
          name: 'checkDayManage',
          component: './backManage/checkDayManage',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/advManage/advPlanManage'
            },
            // {
            //   path: '/welcome',
            //   name: 'welcome',
            //   // icon: 'smile',
            //   component: './Welcome',
            // },
            {
              path: '/advManage',
              name: 'advManage',
              routes: [
                {
                  path: '/advManage/advPlanManage',
                  name: 'advPlanManage',
                  component: './advManage/advPlanManage',
                },
                {
                  path: '/advManage/advManage',
                  name: 'advManage',
                  component: './advManage/advManage',
                },
                {
                  path: '/advManage/advCreativity',
                  name: 'advCreativity',
                  component: './advManage/advCreativity',
                },
                {
                  path: '/advManage/chooseTag',
                  name: 'chooseTag',
                  hideInMenu:true,
                  component: './advManage/chooseTag',
                  
                }
              ],
            },
            {
              path: '/putInManage',
              name: 'putInManage',
              routes: [
                {
                  path: '/putInManage/advPlanAsscess',
                  name: 'advPlanAsscess',
                  component: './putInManage/advPlanAsscess',
                },
                {
                  path: '/putInManage/advAsscess',
                  name: 'advAsscess',
                  component: './putInManage/advAsscess',
                },
              ],
            },
            {
              path:'/backManage',
              name:'backManage',
              routes:[
                {
                  path: '/backManage/putInResult',
                  name: 'putInResult',
                  component: './backManage/putInResult',
                },
                {
                  path: '/backManage/orientManage',
                  name: 'orientManage',
                  component: './backManage/orientManage',
                },
                {
                  path: '/backManage/mediaManage',
                  name: 'mediaManage',
                  component: './backManage/mediaManage',
                },
                {
                  path:`/backManage/dayMoneyManage`,
                  name:'dayMoneyManage',
                  component:'./backManage/dayMoneyManage'
                }

                
              ]
            },
            {
              path:'/dierctManage',
              name:'dierctManage',
              routes:[
                {
                  path: '/dierctManage/crowdPackage',
                  name: 'crowdPackage',
                  component: './dierctManage/crowdPackage',
                }
              ]
            },
            {
              path:'/finance',
              name:'finance',
              routes:[
                {
                  path: '/finance/checkDay',
                  name: 'checkDay',
                  component: './finance/checkDay',
                }
              ]
            },
            {
              path: '/admin',
              name: 'admin',
              // icon: 'crown',
              // component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Admin',
                  authority: ['admin'],
                },
              ],
            },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              component: './404',
            },
          ],
        },

        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
};
