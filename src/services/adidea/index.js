import request from '@/utils/request';
import host from '../host'


/**
 * fenye
 * @param {*} params 
 */
export async function getAdidea(params) {
    return request(host+'/adidea/page', {
      method: 'get',
      params: params,
    });
  }
   /**
 * 通过id查询
 * @param {*} params 
 */
export async function getAdideaById(params) {
    const {id}=params
    return request(host+'/adidea/'+id, {
      method: 'get',
      params: params,
    });
  }
  export async function getAdMaterialRequire(params) {
    return request(host+'/adidea/getAdMaterialRequire', {
      method: 'get',
      params: params,
    });
  }
  export async function getAdMaterialRequireByAdId(params) {
    return request(host+'/adidea/getAdMaterialRequireByAdId', {
      method: 'get',
      params: params,
    });
  }
  
   /**
 * 新增
 * @param {*} params 
 */
export async function addAdidea(params) {
    return request(host+'/adidea', {
      method: 'post',
      data: params,
    });
  }
  export async function deleteAdideaById(params) {
    const {id}=params
    return request(host+'/adidea/'+id, {
      method: 'delete',
      params: params,
    });
  }
     /**
 * 新增
 * @param {*} params 
 */
export async function putAdidea(params) {
    return request(host+'/adidea', {
      method: 'put',
      data: params,
    });
  }