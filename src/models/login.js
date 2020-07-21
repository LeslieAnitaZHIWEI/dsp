import { stringify } from 'querystring';
import { router } from 'umi';
import { fakeAccountLogin,loginByUsername } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery,encryption } from '@/utils/utils';
import { message } from 'antd';
import { randomLenNum } from '@/utils/utils';
const Model = {
  namespace: 'login',
  state: {
    token:null,
    status: undefined,
    randomStr:'',
    randomStrSrc:''
  },
  effects: {
    *login({ payload }, { call, put }) {
      const user = encryption({
        data: payload,
        key: 'pamirpamirpamirp',
        param: ['password']
      });
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(loginByUsername, user);
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // }); // Login successfully
      
      
      yield put({
        type:'changeToken',
        payload:response.access_token
      })
      yield put({
        type:'refreshCode',
      })
      if (response.username) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      }
    },

    logout({ payload }, { call, put, select }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      
       put({
        type:'menu/clearMenu'
      })
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
    changeToken(state,{payload}){
      localStorage.setItem("putToken",payload)

      return {... state,token:payload}
    },
    refreshCode(state){
    var randomStr = randomLenNum(4, true);
    var randomStrSrc
    if (process.env.NODE_ENV !== 'production') {
      
        // src:`${window.location.origin}/code?randomStr=${randomStr}`
        randomStrSrc= `/api/code?randomStr=${randomStr}`
     
    } else {
      
      randomStrSrc= `/code?randomStr=${randomStr}`
     
    }
    return { ...state, randomStr: randomStr,randomStrSrc };

    }
  },
};
export default Model;
