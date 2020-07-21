import React from 'react';
import { Form, message, Card, Select, Input, Button, Table, Modal, Row, Col } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { addAdplan } from '@/services/adplan';
import { router } from 'umi';
import {nameValidator,butgetValidator} from '@/utils/validator'

const Formlayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
class advForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { key: 0, name: 'RTB' },
        { key: 1, name: 'PDB' },
        { key: 2, name: 'PD' },
        { key: 3, name: 'PA' },
      ],
      close:false
    };
  }
  formRef = React.createRef();

  closePage = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  handleChange(value) {
    console.log(value);
  }
  onFinish = values => {
    console.log(values);
    addAdplan({
      ...values,
    }).then(res => {
      if(res.code==0){
        message.success('新增成功');
router.push({
        pathname: '/form/addAdv/-1',
        params: {
          planId: res.data.planId,
        },
      });
      }else{
        message.warning(res.msg)

      }
      
    });
    
  };
  saveClose(){
    this.formRef.current.validateFields()
    .then(values => {
      console.log(values)
      addAdplan({
        ...values,
      }).then(res => {
        if(res.code==0){
          setTimeout(() => {
            this.closePage()
          }, 1000);
          message.success('新增成功');
          

        }else{
          message.warning(res.msg)
        }
      });
    })
  }
  render() {
    const { items } = this.state;

    return (
      <div>
        <Card
          title="新建广告计划"
          className={styles.cardCenter + ' ' + 'validator'}
          style={{ width: 600 }}
        >
          <Form
            name="add"
            {...Formlayout}
            initialValues={{ launchType: '0' }}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Form.Item name="name" label="计划名称" rules={[{ validator: nameValidator },{required: true, message: '请输入广告计划名称' }]}>
              <Input size="large" style={{ width: 380 }} placeholder="请输入广告计划名称" />
            </Form.Item>
            <Form.Item name="launchType" label="投放方式" rules={[{required: true, message: '请选择投放方式' }]}>
              <Select
                size="large"
                style={{ width: 240 }}
                placeholder="请选择投放方式"
                onChange={this.handleChange.bind(this)}
              >
                {items.map(item => (
                  <Select.Option key={item.key}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="budgetAmount" label="日预算" rules={[{ validator: butgetValidator },{required: true, message: '请输入每日预算金额' }]}>
              <Input
                size="large"
                style={{ width: 240 }}
                placeholder="请输入每日预算金额"
                suffix="元"
              />
            </Form.Item>
            <div className={styles.makeCenter}>
              <Button size="large" type="primary" className={styles.rightFive} htmlType="submit">
                保存并新建广告
              </Button>
              <Button
                size="large"
                className={styles.rightFive}
                onClick={() => this.saveClose()}
              >
                保存并关闭
              </Button>
            </div>
          </Form>
        </Card>
        ,
      </div>
    );
  }
}
export default advForm;
