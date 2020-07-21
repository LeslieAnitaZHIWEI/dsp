import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Input, Button, Table, Modal, Row, Col } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
import {getDirectionalinfo,
  deleteDirectionalinfoById} from '@/services/directionalInfo'
  import { ExclamationCircleOutlined } from '@ant-design/icons';

@connect(({form}) => {
  return { 
    
  };
})
class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '人群包名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
       
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '人群包描述',
        dataIndex: 'tagIds',
        render:(text,record)=>{
          var str=''
          if(JSON.parse(text).length>1){
            JSON.parse(text).forEach((ele,i,arr)=>{
              if(i!=arr.length-1){
                str+=ele.tagName+'、'

              }else{
                str+=ele.tagName

              }
            })
            if(str.length>15){
              str=str.substring(0,15)+'...'
            }
            return str
          }else {
            if(JSON.parse(text)[0].tagName.length>15){
            return JSON.parse(text)[0].tagName.substring(0,15)+'...'
            
            }else{
              return JSON.parse(text)[0].tagName

            }
            
          }
           
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) =>
        <div style={{width:'128px'}}>
        <Button onClick={() => this.handleEdit(record)}>编辑</Button>
        <Button type="danger" onClick={() => this.handleDelete(record.key)}>
          删除
        </Button>
      </div>,
        width:150

      },

    ];
    this.state = {
      dataSource: [
        
      ],
      pagination: {
        showQuickJumper: true,
        total: 500,
        current:1,
        pageSize: 10,
        onChange: this.onChange,
        showTotal: this.showTotal,
      },
      loading: false,
      addVisible: false,
    };
  }
  handleEdit= record => {
    

    router.push({
      pathname:'/advManage/chooseTag',
       params:{
        record
       }
    })
  };
  componentDidMount() {
    window.onfocus= ()=>{
      console.log('聚焦')
      var pagination= {
        ...this.state.pagination,
        current: 1
      }
      this.setState({
        pagination
      })
     this.getList()
    }; 
     this.getList()
  }
  getList=(current)=>{
    getDirectionalinfo({current}).then(({data})=>{
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
  }
  onFinish = values => {
    console.log('Finish:', values);
    var dto={
      name:values.name||'',
    }
    getDirectionalinfo({
...dto
    }).then(({data})=>{
      var arr = data.records.map((item) => {
        return {
          ...item,
          key: item.id,
        };
      });
      var pagination= {
        ...this.state.pagination,
        total: data.total,
        current:data.current
      }
      this.setState({
        dataSource:arr,
        pagination
      })
    })
  };
  handleDelete = id => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '请确定是否删除该定向人群？',
      okText: '确认',
      cancelText: '取消',
      onOk:()=> {
        deleteDirectionalinfoById({
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
    
   
  
   onChange=(pageNumber) =>{
    this.setState({
      pagination:{
        ...this.state.pagination,
        current:pageNumber
      }
    })
    this.getList(pageNumber)
    console.log('Page: ', pageNumber);
  }
  showTotal(total) {
    return `共${total}条`;
  }
  componentWillReceiveProps(props){
    console.log(props,'props')
  }
  render() {
    const { dataSource, pagination } = this.state;
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        <div style={{ overflow: 'hidden' }}>
          <Form name="search" layout="inline" className={styles.form} onFinish={this.onFinish}>
            <Form.Item name="name" label="人群包名称" rules={[]}>
              <Input size="large" placeholder="请输入人群包名称" />
            </Form.Item>

            <Form.Item shouldUpdate={true}>
              <Button size="large" type="primary" className={styles.rightFive+' greenButton'} htmlType="submit">
                查询
              </Button>
              <Button
                size="large"
                onClick={() => {
                  // router.push('/advForm')
                  this.props.dispatch({
                    type:'demand/deleteAll'
                  })
                  router.push({pathname:'/advManage/chooseTag',params:{
                    record:{
                      tagIds:'[]'
                    },
                    add:true
                  }});
                }}
                type="primary"
                htmlType="submit"
              >
                新增
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
        
      </PageWrapper>
    );
  }
}
export default advPlan;
