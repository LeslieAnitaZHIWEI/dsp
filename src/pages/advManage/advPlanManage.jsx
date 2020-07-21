import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Switch, Select, Modal, Input, Button, Divider, Table, Pagination } from 'antd';
import styles from './style.less';
import {getAdPlanList,editStatus,deleteAdplan} from '@/services/adplan'
import {budgetTypeList} from '@/utils/dictionaries'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import router from 'umi/router';
const Formlayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
@connect(({user,menu}) => {
  return { 
    currentUser:user.currentUser,
    menu:menu.menu
  };
})
class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '计划名称',
        dataIndex: 'name',
        editable: true,
        render: (text, record) => (
         <Button title={text} onClick={()=>{const w=window.open('about:blank');
          
         w.location.href="/form/viewPlanForm/"+record.id}} type="link">{text.length>20?text.substring(0,19)+'...':text}</Button>
        ),
       

      },
      {
        title: '投放方式',
        dataIndex: 'launchType',
        render: (text, record) => {
          
            switch (text) {
              case 0:
                return 'RTB';
                case 1:
                  return 'PDB';
                  case 2:
                return 'PD';
                case 3:
                return 'PA';
            }
          
         },
         width:150
      },
      {
        title: '状态',
        dataIndex: 'planStatus',
        render: (text, record) => (
          <div
          name={record.id}
          >
          <Switch
            checkedChildren="启用"
            unCheckedChildren="暂停"
            // onChange={this.SwitchChange}
            onClick={this.swichConfirm}
            checked	={text == 1 ? true : false}
          /></div>
        ),
        width:120

      },
      {
        title: '预算金额(元）',
        dataIndex: 'budgetAmount',
        render: (text, record) => (
          <span>
            {text}{' '+budgetTypeList[record.budgetType]}
          </span>
        ),
        width:200

        
      },
      {
        title: '累计花费',
        dataIndex: 'totalCost',
        render: (text, record) => (
          <span>
            {text==0?'':text}
          </span>
        ),

      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <div style={{width:'128px'}}>
            <Button onClick={() => this.handleEdit(record.key)}>编辑</Button>
            <Button type="danger" onClick={() => this.handleDelete(text)}>
              删除
            </Button>
          </div>
        ),
        width:150
      

      },
    ];
    this.state = {
      dataSource: [
       
      ],
      pagination: {
        showQuickJumper: true,
        current:1,
        total: 500,
        pageSize: 10,
        onChange: this.onChange,
        showTotal: this.showTotal,
        current:1
      },
      loading: false,
      items: [{key:0,name:'RTB'},{key:1,name:'PDB'},{key:2,name:'PD'},{key:3,name:'PA'}],
      selectValue: [],
      addVisible: false,
      editVisible:false,
      editSwitch:false
    };
  }
  formRef = React.createRef();
  // formAdd = React.createRef();
  // formEdit = React.createRef();
  componentWillMount(){
    console.log(this.props.menu,'currentUsersss')
    if(this.props.menu.length==1){
      router.push("/backManage/putInResult")
    }
    
   this.getList()
  }
  componentWillReceiveProps(value){
      console.log(value,'currentUsersssss')
      if(value.menu.length==1){
      router.push("/backManage/putInResult")
    }
  }
  getList(current){
    getAdPlanList({
      current
    }).then(({data})=>{
      console.log(data)
      if(data){
        var dataSource=data.records.map(ele=>({
          ...ele,
          key:ele.id
        }))
        var pagination= {
          ...this.state.pagination,
          total: data.total,
          current:data.current
        }
        this.setState({
          dataSource:dataSource,
          pagination
        })
      }
     
    })
  }
  componentDidMount() {
    console.log(this.formRef,'formRefformRefformRefformRef')
    window.onfocus= ()=>{
      // console.log('聚焦',this.formRef.current.getFieldsValue())
      var pagination= {
        ...this.state.pagination,
        current: 1
      }
      this.setState({
        pagination
      })
   this.getList(this.state.pagination.current)

      }; 
  }
  SwitchChange=(value,e)=>{
    e.persist();
    let id
   if(e.target.parentNode.tagName=='DIV'){
    id=e.target.parentNode.getAttribute('name')

   }else{
      id=e.target.parentNode.parentNode.getAttribute('name')

   }
   console.log(id)
   
    editStatus({
      status:value?1:0,
      id:id
    }).then(({data})=>{
      console.log(data)
    })
  }
  swichConfirm=(value,e)=>{
    e.persist();
    let id
   if(e.target.parentNode.tagName=='DIV'){
    id=e.target.parentNode.getAttribute('name')

   }else{
      id=e.target.parentNode.parentNode.getAttribute('name')

   }
   console.log(value)
   if(value){
      editStatus({
    status:value?1:0,
    id:id
  }).then(({data})=>{
    console.log(data)
    this.getList()
    
  })
   }else{
Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '确定暂停该广告计划？暂停该计划的同时，将会中止该计划下的全部广告的投放！请确认是否暂停？',
      okText: '确认',
      cancelText: '取消',
      onOk:()=> {
        editStatus({
          status:value?1:0,
          id:id
        }).then(({data})=>{
          console.log(data)
        this.getList()
      })
      },
      onCancel:()=> {
        this.getList()
      },
    });
   }
  
    
  }
  onFinish = values => {
    console.log('Finish:', values);
    var dto={
      name:values.name||'',
      launchType:values.launchType!=undefined?values.launchType:''
    }
    getAdPlanList({
...dto
    }).then(({data})=>{
      console.log(data)
      var dataSource=data.records.map(ele=>({
        ...ele,
        key:ele.id
      }))
      var pagination= {
        ...this.state.pagination,
        total: data.total,
        current:data.current
      }
      this.setState({
        dataSource:dataSource,
        pagination
      })
    })
  };
  handleDelete = id => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除该广告计划？删除该计划的同时，将删除该计划下的所有广告及创意！且删除操作不可撤回！请再次确认删除该计划',
      okText: '确认',
      cancelText: '取消',
      onOk:()=> {
        deleteAdplan({
          id:id
        }).then(({data})=>{
          console.log(data)
        this.getList()
      })
      },
      onCancel:()=> {
      },
    });
  };
  handleEdit= key => {
    const w=window.open('about:blank');
    
      w.location.href="/form/editPlanForm/"+key
    console.log(key)
  };
   onChange=(pageNumber) =>{
    console.log('Page: ', pageNumber);
    this.setState({
      pagination:{
        ...this.state.pagination,
        current:pageNumber
      }
    })
    this.getList(pageNumber)
  }
  showTotal(total) {
    return `共${total}条`;
  }
  checkAll() {
    console.log(this.formAdd);
    this.formRef.current.setFieldsValue({ password: this.state.items });
  }
  uncheckAll() {
    this.formRef.current.setFieldsValue({ password: [] });
  }
  handleChange(value) {
    console.log(value);
    // console.log(form.getFieldValue('password'))
    console.log(this.formRef.current.getFieldValue('password'));
  }
  handleOk = () => {
    setTimeout(() => {
      this.setState({ addVisible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ addVisible: false,editVisible:false });
  };
  changeEditSwitch= (checked) => {
    console.log(checked)
    this.setState({ editSwitch: checked });
  };
  render() {
    const { dataSource, pagination, items, selectValue,editSwitch } = this.state;
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        <div style={{ overflow: 'hidden' }}>
          <Form
            name="search"
            ref={this.formRef}
            layout="inline"
            className={styles.form}
            onFinish={this.onFinish}
          >
            <Form.Item name="name" label="计划名称" rules={[]}>
              <Input size="large" placeholder="请输入计划名称" />
            </Form.Item>
            <Form.Item name="launchType" label="状态" rules={[]}>
              <Select
                size="large"
                // mode="multiple"
                style={{ width: 240 }}
                placeholder="请选择投放方式"
                onChange={this.handleChange.bind(this)}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    {/* <Divider style={{ margin: '4px 0' }} />
                    <Button onClick={this.checkAll.bind(this)}>全部选择</Button>
                    <Button onClick={this.uncheckAll.bind(this)}>全部取消</Button> */}
                  </div>
                )}
              >
                {items.map(item => (
                  <Select.Option key={item.key}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              <Button size="large"  className={styles.rightFive+' '+'greenButton'} htmlType="submit">
                查询
              </Button>
              <Button
                size="large"
                onClick={() => {
                  const w=window.open('about:blank');
                  w.location.href="/form/advPlanForm"
                }}
                type="primary"
              >
                添加
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Table
          columns={this.columns}
          loading={this.state.loading}
          dataSource={dataSource}
          bordered
          pagination={pagination}
        />
        {/* <Modal
          title="新建广告计划"
          visible={this.state.addVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form name="add" {...Formlayout} ref={this.formAdd} onFinish={this.onFinish}>
            <Form.Item name="plan" label="计划名称" rules={[]}>
              <Input size="large" placeholder="请输入广告计划名称" />
            </Form.Item>
            <Form.Item name="password" label="投放方式" rules={[]}>
              <Select
                size="large"
                style={{ width: 240 }}
                placeholder="请选择投放方式"
                onChange={this.handleChange.bind(this)}
              >
                {items.map(item => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="yusuan" label="日预算" rules={[]}>
              <Input size="large" placeholder="请输入每日预算金额" suffix="元" />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              <Button size="large" type="primary" className={styles.rightFive} htmlType="submit">
                保存并新建广告
              </Button>
              <Button
                size="large"
                className={styles.rightFive}
                onClick={() => this.setState({ addVisible: false })}
                type="primary"
                htmlType="submit"
              >
                保存并关闭
              </Button>
              <Button
                size="large"
                onClick={() => this.setState({ addVisible: false })}
                type="primary"
                htmlType="submit"
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal> */}
        {/* <Modal
          title="编辑广告计划"
          visible={this.state.editVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form name="edit" {...Formlayout} ref={this.formEdit} onFinish={this.onFinish}>
            <h3>基本信息</h3>
            <Form.Item name="plan" label="计划名称" rules={[]}>
              <Input size="large" placeholder="请输入广告计划名称" />
            </Form.Item>
            <Form.Item name="status" label="计划名称" rules={[]}>
            <Switch
            checkedChildren="启用"
            unCheckedChildren="暂停"
            checked={ editSwitch}
            onClick={(value)=>this.changeEditSwitch(value)}
          />
            </Form.Item>
            <h3>投放信息</h3>
            <Form.Item name="password" label="投放方式" rules={[]}>
              <Select
                size="large"
                style={{ width: 240 }}
                placeholder="请选择投放方式"
                onChange={this.handleChange.bind(this)}
              >
                {items.map(item => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
            <h3>预算和出价</h3>
            <Form.Item name="yusuan" label="日预算" rules={[]}>
              <Input size="large" placeholder="请输入每日预算金额" suffix="元" />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
             
              <Button
                size="large"
                className={styles.rightFive}
                onClick={() => this.setState({ editVisible: false })}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              <Button
                size="large"
                onClick={() => this.setState({ editVisible: false })}
                type="primary"
                htmlType="submit"
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal> */}
      </PageWrapper>
    );
  }
}
export default advPlan;
