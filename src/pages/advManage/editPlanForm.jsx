import React from 'react';
import { Form, Card,message, Select, Input, Button,Switch, Table, Modal, Row, Col } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import {getAdplanById,editAdplan} from '@/services/adplan'
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
      items: [{key:0,name:'RTB'},{key:1,name:'PDB'},{key:2,name:'PD'},{key:3,name:'PA'}],
     
      editSwitch:false

    };
  }
  formEdit = React.createRef();

  closePage = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  componentDidMount(){
    getAdplanById({
      id:this.props.match.params.id
    }).then(({data})=>{
      console.log(data)
      this.setState({
        editSwitch:data.planStatus==1?true:false
      })
      this.formEdit.current.setFieldsValue({
        // planStatus:true,
        name:data.name,
        launchType:data.launchType.toString(),
        budgetAmount:data.budgetAmount
      })
    })
    

  }
  handleChange(value) {
    console.log(value);
  }
  changeEditSwitch= (checked) => {
    console.log(checked)
    this.setState({ editSwitch: checked });
  };
  onFinish=(values)=>{
    var dto={
      ...values,
      planStatus:this.state.editSwitch?1:0,
      id:this.props.match.params.id

    }
    console.log(dto)
    editAdplan({
      ...dto
    }).then((res)=>{
      
      if(res.code==0){
        message.success('修改成功')

      }else{
        message.warning(res.msg)
      }
    
    
    }).catch(res=>{
      console.log(res)
    })
    setTimeout(() => {
      this.closePage()
    }, 1000)
  }
  render() {
    const { items,editSwitch } = this.state;

    return (
      <div >
        <Card  title="编辑广告计划" className={styles.cardCenter} style={{ width: 600 }}>
        <Form name="edit" {...Formlayout} ref={this.formEdit} onFinish={this.onFinish} className="validator">
            <h3>基本信息</h3>
            <Form.Item name="name" label="计划名称" rules={[{ validator: nameValidator }]}>
              <Input size="large"  style={{ width: 380 }} placeholder="请输入广告计划名称" />
            </Form.Item>
            <Form.Item name="planStatus" label="启动状态" rules={[]}>
            <Switch
            checkedChildren="启用"
            unCheckedChildren="暂停"
            size="large"
            checked={ editSwitch}
            onClick={(value)=>this.changeEditSwitch(value)}
          />
            </Form.Item>
            <h3>投放信息</h3>
            <Form.Item name="launchType" label="投放方式" rules={[]}>
              <Select
                size="large"
                style={{ width: 240 }}
                placeholder="请选择投放方式"
                onChange={this.handleChange.bind(this)}
              >
                {items.map(item => (
                  <Option key={item.key}>{item.name}</Option>
                  
                ))}
              </Select>
            </Form.Item>
            <h3>预算和出价</h3>
            <Form.Item name="budgetAmount" label="日预算" rules={[{ validator: butgetValidator }]}>
              <Input size="large"
                style={{ width: 240 }}
                placeholder="请输入每日预算金额" suffix="元" />
            </Form.Item>
            <div className={styles.makeCenter}>
             
              <Button
                size="large"
                style={{width:'160px'}}
                type="primary"
                htmlType="submit"
              >
                保存
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
