import { Form, Row, Col, Input } from 'antd';

const Video = props => {
  var judge;
  console.log(props, 'nnnn');
  if (props.tabKey == '1' && props.number == 0) {
    judge = true;
  } else if (props.tabKey == '0' && props.number != 0) {
    judge = true;
  } else {
    judge = false;
  }
  console.log(judge, 'nnnn');
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
    <div>
      <Form.Item
        label="地址"
        name={'imageUrl' + props.number}
        rules={[{ required: judge, message: '请输入URL' }]}
      >
        <Input placeholder="请输入URL" />
      </Form.Item>

      <Form.Item
        label="宽度"
        name={'imageWidth' + props.number}
        rules={[{ validator: butgetValidator }, { required: judge, message: '请输入宽度' }]}
      >
        <Input style={{ width: '200px' }} placeholder="请输入宽度" suffix="像素" />
      </Form.Item>

      <Form.Item
        name={'imageHeight' + props.number}
        label="高度"
        rules={[{ validator: butgetValidator }, { required: judge, message: '请输入高度' }]}
      >
        <Input style={{ width: '200px' }} placeholder="请输入高度" suffix="像素" />
      </Form.Item>
    </div>
  );
};

export default Video;
