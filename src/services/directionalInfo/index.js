import request from '@/utils/request';
import host from '../host'


/**
 * fenye
 * @param {*} params 
 */
export async function getDirectionalinfo(params) {
    return request(host+'/directionalinfo/page', {
      method: 'get',
      params: params,
    });
  }

  
 /**
 * 定向
 * @param {*} params 
 */
export async function getdirectionalinfoList(params) {
  return request(host+'/directionalinfo/privatePage', {
    method: 'get',
    params:params
  });
}
 
 export async function putDirectionalinfo(params) {
     return request(host+'/directionalinfo', {
       method: 'put',
       data: params,
     });
   }
   export async function updatePrivateDirectional(params) {
    return request(host+'/directionalinfo/updatePrivateDirectional', {
      method: 'put',
      data: params,
    });
  }

   
  /**
 * fenye
 * @param {*} params 
 */
export async function getDirectionalinfoById(params) {
    return request(host+'/directionalinfo/'+params.id, {
      method: 'get',
    });
  }

  export async function deleteDirectionalinfoById(params) {
    return request(host+'/directionalinfo/'+params.id, {
      method: 'delete',
    });
  }
  
    /**
 * fenye
 * @param {*} params 
 */
export async function addDirectionalinfo(params) {
  return request(host+'/directionalinfo', {
    method: 'post',
    data:params
  });
}

  