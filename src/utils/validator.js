export const nameValidator = (rule, value, callback) => {
    if(value){
      if (value.length >= 50) {
        callback('50个字以内');
      } else {
        callback();
      }
    }else{
      callback();
    } 
    
  };
  export const nameValidator50 = (rule, value, callback) => {
    if(value){
      if (value.length >= 50) {
        callback('50个字以内');
      } else {
        callback();
      }
    }else{
      callback();
    } 
    
  };
 export const butgetValidator = (rule, value) => {
    // var reg = /^\d+(\.\d{0,2})?$/;
    // if (reg.test(value)) {
    //   callback();
    // } else {
    //   callback('只支持数字');
    // }
 console.log(value)
      var reg = /^\d+(\.\d{0,2})?$/;
    if (reg.test(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject('只支持数字');
    }
   
  };
  
  