import { Form, Row, Col,Input,InputNumber } from 'antd';
const Video = (prop) => {
  const {templateId} =prop
  var judge
  if(prop.tabKey=='3'){
    judge=true
  }else if(prop.tabKey=='0'&&(templateId==5||templateId==8||templateId==7||templateId==9)){
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
          name="iconUrl"
          rules={[{ required: judge, message: '请输入URL' }]}
        >
          <Input  placeholder="请输入URL" />
        </Form.Item>
  
        <Form.Item
          label="宽度"
          name="iconWidth"
          rules={[{ validator:butgetValidator },{ required: judge, message: '请输入宽度!' }]}
        >
          <Input  style={{ width: '200px' }} placeholder="请输入宽度" suffix="像素"/>
        </Form.Item>
  
        <Form.Item name="iconHeight" label="高度"
          rules={[{ validator: butgetValidator },{ required: judge, message: '请输入高度' }]}
          >
          <Input  style={{ width: '200px' }} placeholder="请输入高度" suffix="像素"/>

        </Form.Item>
  
      </div>
    );
  };
  
  export default Video