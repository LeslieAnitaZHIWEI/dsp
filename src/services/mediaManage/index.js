
import request from '@/utils/request';
import host from '../host'


export async function getAdMedia(params) {
  console.log(params,'parma')
    return request(host+'/admedia/list', {
      method: 'get',
      params: params,
    });
  }
  export async function getListMediaByBlurry(params) {
    return request(host+'/admedia/listMediaByBlurry', {
      method: 'get',
      data: params,
    });
  }

  
  export async function getListSource(params) {
    return request(host+'/admedia/listSource', {
      method: 'get',
      data: params,
    });
  }
  export async function getAdindustrycategory(params) {
    return request(host+'/adindustrycategory', {
      method: 'get',
      data: params,
    });
  }
  export async function addAdmedia(params) {
    return request(host+'/admedia', {
      method: 'post',
      data: params,
    });
  }
  export async function editAdmedia(params) {
    return request(host+'/admedia', {
      method: 'put',
      data: params,
    });
  }
  export async function deleteAdmediaById(params) {
    const {id}=params
    return request(host+'/admedia/'+id, {
      method: 'delete',
      params: params,
    });
  }

  export async function getAdmediaById(params) {
    const {id}=params
    return request(host+'/admedia/'+id, {
      method: 'get',
      params: params,
    });
  }

