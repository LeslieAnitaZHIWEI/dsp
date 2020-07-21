import request from '@/utils/request';
const scope = 'server'
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function  loginByUsername ({username, password, code, randomStr})  {
  const grant_type = 'password'
  return request(
     '/auth/oauth/token',{
    headers: {
      isToken: 'true',
      'TENANT_ID': '1',
      'Authorization': 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}
