import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import {
  Form,
  Card,
  Checkbox,
  Tabs,
  Select,
  Input,
  Button,
  Switch,
  Table,
  Modal,
  Row,
  Col,
} from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
const { TabPane } = Tabs;
const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const plainOptions = ['信息流广告', 'Pear', 'Orange'];
@connect(({ user, demand }) => {
  return {
    currentUser: user.currentUser,
    selectedTags: demand.selectedTags,
    selectedTagsCrowd:demand.selectedTagsCrowd
  };
})
class editAdv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['jack', 'lucy'],
      editSwitch: false,
      tabKey:"1",
      completeChecked:false
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
    // console.log(form.getFieldValue('password'))
    console.log(this.formRef.current.getFieldValue('password'));
  }
  changeEditSwitch = checked => {
    console.log(checked);
    this.setState({ editSwitch: checked });
  };
  callback = key => {
    console.log(key);
    this.setState({
      tabKey:key.toString()
    })
  };
  
  deleteRow = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demand/deleteSelectTag',
      payload: record,
    });
  };
  copyToAdd(){
    this.setState({tabKey:'1'});
    this.props.dispatch({
      type:'demand/addToSelect'
    })
  }
  changeEditSwitch= (checked) => {
    console.log(checked)
    this.setState({ editSwitch: checked });
  };
  onCheckboxChange=(values)=>{
    console.log(values.target.checked)
    this.setState({
      completeChecked:values.target.checked
    })
  }
  render() {
    const { items, editSwitch,completeChecked } = this.state;
    const { selectedTags,selectedTagsCrowd } = this.props;
    const listItems = selectedTags.map(demand => (
      <Row key={demand.id}>
        <Col style={{ lineHeight: '40px' }} span={12}>
          {/* <DisplayRow name={demand.tag} area={areaString}></DisplayRow> */}
          <b>{demand.tag}</b>
          {demand.tag == '地理位置' ? demand.tagName : ''}
          {demand.tag == '产品关键词' ? demand.tagName : ''}
          {demand.categoryId == 0 ? demand.tagName : ''}
        </Col>

        <Col span={4}>
          <Button
            style={{ color: 'red' }}
            type="link"
            size="small"
            onClick={() => this.deleteRow(demand)}
            shape="circle"
            icon={<CloseOutlined />}
          />
        </Col>
      </Row>
    ));
    const listItemsCrowd = selectedTagsCrowd.map(demand => (
      <Row key={demand.id}>
        <Col style={{ lineHeight: '40px' }} span={12}>
          {/* <DisplayRow name={demand.tag} area={areaString}></DisplayRow> */}
          <b>{demand.tag}</b>
          {demand.tag == '地理位置' ? demand.tagName : ''}
          {demand.tag == '产品关键词' ? demand.tagName : ''}
          {demand.categoryId == 0 ? demand.tagName : ''}
        </Col>

        <Col span={4}>
          <Button
            style={{ color: 'red' }}
            type="link"
            size="small"
            onClick={() => this.deleteRow(demand)}
            shape="circle"
            icon={<CloseOutlined />}
          />
        </Col>
      </Row>
    ));
    
    return (
      <div>
        <Card title="编辑广告" className={styles.cardCenter} style={{ width: 900 }}>
          <Form
            initialValues={{ remember: 'lucy', checkAdv: ['信息流广告', 'Pear'] }}
            name="edit"
            {...Formlayout}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <h3>基本信息</h3>

            <Row>
              <Col span={12}>
                <Form.Item name="plan" label="广告名称" rules={[]}>
                  <Input placeholder="请输入计划名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="remember" label="所属计划" rules={[]}>
                  <Select style={{ width: 200 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name="plan" label="开启状态" rules={[]}>
                <Switch
            checkedChildren="启用"
            unCheckedChildren="暂停"
            checked={ editSwitch}
            onClick={(value)=>this.changeEditSwitch(value)}
          />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="remember" label="完成状态" rules={[]}>
                <Checkbox checked={completeChecked} onChange={this.onCheckboxChange.bind(this)}>设置为已完成</Checkbox>
                </Form.Item>
              </Col>
            </Row>
           

            <h3>投放信息</h3>
            <Row>
              <Col span={12}>
                <Form.Item name="remember" label="所属计划" rules={[]}>
                  <Select style={{ width: 200 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="remember" label="所属计划" rules={[]}>
                  <Select style={{ width: 200 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ position: 'relative' }}>
                <Form.Item
                  name="remember"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 8 }}
                  label="出价"
                  rules={[]}
                >
                  <Select style={{ width: 120 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="bbb"
                  style={{ position: 'absolute', left: 230, top: 4 }}
                  label=""
                  rules={[]}
                >
                  <Input placeholder="请输入每日预算金额" suffix="元" />
                </Form.Item>
              </Col>
            </Row>
            <h3>落地信息</h3>
            <Row>
              <Col span={12}>
                <Form.Item name="password" label="落地方式" rules={[]}>
                  <Select style={{ width: 120 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="password" labelCol={{ span: 3 }} label="落地页地址" rules={[]}>
                  <Input placeholder="请输入落地页地址" />
                </Form.Item>
              </Col>
            </Row>
            <h3>广告位</h3>
            <Row>
              <Col span={24}>
                <Form.Item labelCol={{ span: 3 }} name="checkAdv" label="广告类型" rules={[]}>
                  <Checkbox.Group options={plainOptions} />
                </Form.Item>
              </Col>
            </Row>
            <h3>用户定向</h3>
            <Tabs onChange={this.callback} activeKey={this.state.tabKey} type="card" className={styles.flexflex}>
              <TabPane tab="新建定向" key="1">
                <Card>
                  <Button type="link" size="small">
                    从已有广告中复制
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      router.push('/advManage/chooseTag');
                    }}
                  >
                    自选标签
                  </Button>
                  <Form.Item name="password" labelCol={{ span: 3 }} label="已有广告" rules={[]}>
                    <Select style={{ width: 120 }}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="password"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    label="已选标签"
                    rules={[]}
                  >
                    <Row style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      {/* <Col span={4}>{selectedTags.length>0&&<span>且</span>} </Col> */}

                      <Col span={20}>{listItems}</Col>
                    </Row>
                  </Form.Item>
                </Card>
              </TabPane>
              <TabPane tab="选择已有人群包" key="2">
                <Card>
                  <Form.Item name="password" labelCol={{ span: 3 }} label="已有人群包" rules={[]}>
                    <Select style={{ width: 120 }}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="password"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    label="已选标签"
                    rules={[]}
                  >
                    <Row style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      {/* <Col span={4}>{selectedTags.length>0&&<span>且</span>} </Col> */}

                      <Col span={20}>{listItemsCrowd}</Col>
                    </Row>
                  </Form.Item>
                  <Button type="link" onClick={()=>{this.copyToAdd()}} size="small">
                    复制当前已选标签至新建
                  </Button>
                </Card>
              </TabPane>
            </Tabs>
            <div className={styles.makeCenter}>
            <Button
                size="large"
                className={styles.rightFive}
                onClick={() => this.setState({ addVisible: false })}
                type="primary"
                htmlType="submit"
              >
                保存并关闭
              </Button>
              <Button size="large" className={styles.rightFive} htmlType="submit">
                保存并编辑创意
              </Button>
              
            </div>
          </Form>
        </Card>
        ,
      </div>
    );
  }
}
export default editAdv;
