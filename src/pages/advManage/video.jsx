import { Form, Row, Col,Input } from 'antd';

const Video = (prop) => {
    console.log(prop,'videoprop')
    var judge
    if(prop.tabKey=='2'){
      judge=true
    }else if(prop.tabKey=='0'&&(prop.templateId==6||prop.templateId==8)){
      judge=true

    }else{
      judge=false
    }
    const butgetValidator = (rule, value) => {
      if (judge) {
        var reg = /^[1-9]\d*$/;
        if (reg.test(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject('只支持正整数');
        }
      } else {
        return Promise.resolve();
      }
    };
    return (
      <div
       
      >
        <Form.Item
          label="地址"
          name="videoUrl"
          rules={[{ required: judge, message: '请输入URL' }]}
        >
          <Input  placeholder="请输入URL"/>
        </Form.Item>
  
        <Form.Item
          label="宽度"
          name="videoWidth"
          rules={[{ validator: butgetValidator },{ required: judge, message: '请输入宽度' }]}
        >
          <Input  style={{ width: '200px' }} placeholder="请输入宽度" suffix="像素"/>
        </Form.Item>
  
        <Form.Item name="videoHeight" label="高度"
          rules={[{ validator: butgetValidator },{ required: judge, message: '请输入高度' }]}
          >
          <Input  style={{ width: '200px' }} placeholder="请输入高度" suffix="像素"/>

        </Form.Item>
  
        <Form.Item  name="videoTime" label="时长"
          rules={[{ validator: butgetValidator },{ required: judge, message: '请输入时长' }]}
          >
          <Input  style={{ width: '200px' }} placeholder="请输入时长" suffix="秒"/>
          
        </Form.Item>
      </div>
    );
  };
  
  export default Video