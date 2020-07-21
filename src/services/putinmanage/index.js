import request from '@/utils/request';
import host from '../host'


/**
 * fenye
 * @param {*} params 
 */
export async function getEffectassess(params) {
    return request(host+'/effectassess/adPlan', {
      method: 'get',
      params: params,
    });
  }

  /**
 * fenye
 * @param {*} params 
 */
export async function getADEffectassess(params) {
    return request(host+'/effectassess/ad', {
      method: 'get',
      params: params,
    });
  }


  /**
 * 后台管理分页
 * @param {*} params 
 */
export async function getEffectassessPage(params) {
  return request(host+'/effectassess/page', {
    method: 'get',
    params: params,
  });
}

  /**
 * cha 详情
 * @param {*} params 
 */
export async function getEffectassessById(params) {
  return request(host+'/effectassess/'+params.id, {
    method: 'get',
  });
}
 /**
 * cha 详情lie表
 * @param {*} params 
 */
export async function getEffectassessList(params) {
  return request(host+'/effectassess/list', {
    method: 'get',
    params:params
  });
}
  

 /**
 * 修改
 * @param {*} params 
 */
export async function putEffectassess(params) {
  return request(host+'/effectassess/', {
    method: 'put',
    data:params
  });
}




/**
 * 修改
 * @param {*} params 
 */
export async function deleteEffectassess(params) {
  return request(host+'/effectassess/', {
    method: 'delete',
    params:params
  });
}


  /**
 * 新增日流水
 * @param {*} params 
 */
export async function addFinancial(params) {
  return request(host+'/financial', {
    method: 'post',
    data: params,
  });
}

  /**
 * cai务分页
 * @param {*} params 
 */
export async function getFinancial(params) {
  return request(host+'/financial/added', {
    method: 'get',
    params: params,
  });
}


