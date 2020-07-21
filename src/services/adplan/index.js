import request from '@/utils/request';
import host from '../host'


/**
 * 新增广告计划
 * @param {*} params 
 */
export async function addAdplan(params) {
    return request(host+'/adplan', {
      method: 'post',
      data: params,
    });
  }

  /**
 * 修改广告计划
 * @param {*} params 
 */
export async function editAdplan(params) {
    return request(host+'/adplan', {
      method: 'put',
      data: params,
    });
  }
   /**
 * 通过id查询
 * @param {*} params 
 */
export async function getAdplanById(params) {
    const {id}=params
    return request(host+'/adplan/'+id, {
      method: 'get',
      params: params,
    });
  }

     /**
 * 通过id删除广告计划
 * @param {*} params 
 */
export async function deleteAdplan(params) {
    const {id}=params
    return request(host+'/adplan/'+id, {
      method: 'delete',
      data: params,
    });
  }

       /**
 * 通过id删除广告计划
 * @param {*} params 
 */
export async function deleteAdinfo(params) {
  const {id}=params
  return request(host+'/adinfo/'+id, {
    method: 'delete',
    data: params,
  });
}
       /**
 * 查看所有广告计划
 * @param {*} params 
 */
export async function getAllAdplan(params) {
    return request(host+'/adplan/getAll', {
      method: 'get',
      params: params,
    });
  }
         /**
 * 是否存在计划名称
 * @param {*} params 
 */
export async function hasPlanName(params) {
    return request(host+'/adplan/hasPlanName', {
      method: 'get',
      params: params,
    });
  }

           /**
 * 分页查询广告计划列表
 * @param {*} params 
 */
export async function getAdPlanList(params) {
    return request(host+'/adplan/page', {
      method: 'get',
      params: params,
    });
  }

    /**
 * 
修改广告计划状态
 * @param {*} params 
 */
export async function editStatus(params) {
    return request(host+'/adplan/status', {
      method: 'put',
      params: params,
    });
  }

     /**
 * 通过id查询
 * @param {*} params 
 */
export async function getAdInfoById(params) {
  const {id}=params
  return request(host+'/adinfo/'+id, {
    method: 'get',
    params: params,
  });
}

     /**
 * 新增
 * @param {*} params 
 */
export async function addInfo(params) {
  const {id}=params
  return request(host+'/adinfo/', {
    method: 'post',
    data: params,
  });
}
     /**
 * info分页
 * @param {*} params 
 */
export async function getAdInfoList(params) {
  return request(host+'/adinfo/page', {
    method: 'get',
    params: params,
  });
}

     /**
 * 广告名称和列表
 * @param {*} params 
 */
export async function getAdInfoDTOList(params) {
  return request(host+'/adinfo/getAdInfoDTOList', {
    method: 'get',
    params: params,
  });
}

export async function listAdNameAndId(params) {
  return request(host+'/adinfo/listAdNameAndId', {
    method: 'get',
    params: params,
  });
}

     /**
 * 人群名称和列表
 * @param {*} params 
 */
export async function getDirectionalInfoDTOList(params) {
  return request(host+'/directionalinfo/getDirectionalInfoDTOList', {
    method: 'get',
    params: params,
  });
}


     /**
 * 标签分类
 * @param {*} params 
 */
export async function getCategory(params) {
  return request(host+'/dstagcategory/tree', {
    method: 'get',
    params: params,
  });
}


     /**
 * 标签分类
 * @param {*} params 
 */
export async function getDstag(params) {
  return request(host+'/dsTag/list', {
    method: 'get',
    params: params,
  });
}

  /**
 * 修改广告
 * @param {*} params 
 */
export async function editAdinfo(params) {
  return request(host+'/adinfo', {
    method: 'put',
    data: params,
  });
}

    /**
 * 广告位
 * @param {*} params 
 */
export async function getAdposition(params) {
  return request(host+'/adposition/page', {
    method: 'get',
    params: params,
  });
}
export async function deleteAdposition(params) {
  const {id}=params
  return request(host+'/adposition/'+id, {
    method: 'delete',
    params: params,
  });
}


   /**
 * 广告位
 * @param {*} params 
 */
export async function getAdpositionQuery(params) {
  return request(host+'/adposition/query', {
    method: 'post',
    data: params,
  });
}

export async function addAdposition(params) {
  return request(host+'/adposition', {
    method: 'post',
    data: params,
  });
}
export async function hasPuttingAd(params) {
 
  return request(host+'/adposition/hasPuttingAd', {
    method: 'get',
    params: params,
  });
}


export async function editAdposition(params) {
  return request(host+'/adposition', {
    method: 'put',
    data: params,
  });
}


export async function getAdpositionById(params) {
  const {id}=params
  return request(host+'/adposition/'+id, {
    method: 'get',
    params: params,
  });
}
//