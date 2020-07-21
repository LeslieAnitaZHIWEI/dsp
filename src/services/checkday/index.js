import request from '@/utils/request';
import host from '../host'


/**
 * fenye
 * @param {*} params 
 */
export async function getFinancial(params) {
    return request(host+'/financial/page', {
      method: 'get',
      params: params,
    });
  }
  
 export async function getDailyBill(params) {
     return request(host+'/financial/dailyBill', {
       method: 'get',
       params: params,
     });
   }

   export async function getListBill(params) {
    return request(host+'/financial/listBill', {
      method: 'get',
      params: params,
    });
  }

