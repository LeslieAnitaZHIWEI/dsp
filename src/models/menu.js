import {getMenu} from '@/services/menu'
import { router } from 'umi';
const Model = {
    namespace: 'menu',
    state: {
      menu:[]
    },
    effects: {
        *menu({ payload }, { call, put }) {
            const menu=yield call(getMenu,{})
        yield put({
          type:'changeMenu',
          payload:menu
        })
        }
    },
    reducers: {
        changeMenu(state,{payload}){
            var indexS=-1
            let menu=[]
            payload.data.map ((item,index)=>{
                // if(item.name=="首页"){
                //     indexS=index
                // }
                if(item.path=='/form'||item.path=='/advManage'||item.path=='/putInManage'||item.path=='/backManage'||item.path=='/dierctManage'||item.path=='/finance'){
                  menu.push( {
                  path:item.path,
                  name:item.name,
                  icon:item.icon,
                  children: item.children ?  (item.children).map((item)=>({
                    path:item.path,
                    name:item.name,
                    icon:item.icon,
                  })) : [] 
                })
                }
              
            })
            // if(indexS!=-1){
            //     var m=menu.splice(indexS,1)
            //     menu.unshift(m[0])
            // }
           
            return {...state,menu:menu}
          },
          clearMenu(state,{payload}){
            return {
              ...state,
              menu:[]
            }
          }
    }


}
export default Model;
