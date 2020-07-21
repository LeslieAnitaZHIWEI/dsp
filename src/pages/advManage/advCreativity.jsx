import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Input, Button, Table, Modal, Row, Col } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
import {getAdidea,getAdideaById,deleteAdideaById} from '@/services/adidea'
import {ideaList} from '@/utils/dictionaries'
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
        title: '创意',
        dataIndex: 'templateTitle',
        width: '200',
        editable: true,
        render: (text, record) =>
        
      {
        if(!record.url){
          return text
        }else{
          if(record.url.indexOf('mp4')!=-1){
            return <div style={{display:'flex'}}>
              <video src={record.url} style={{width:'200px',height:'100px'}}  controls>
            </video>　
           <div style={{display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth:'100px',
      textAlign: 'justify'}} title={text}>{text.length>20?text.substring(0,19)+'...':text}</div>
  
            </div> 
          }else{
            return <div style={{display:'flex'}}>
             <img src={record.url} style={{width:'200px',height:'100px'}}></img>　
             <div style={{display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth:'100px',
  
      textAlign: 'justify'}} title={text}>{text.length>20?text.substring(0,19)+'...':text}</div>
  
            </div>
          }
        }
        }
        
        
      },
      {
        title: '创意名称',
        dataIndex: 'templateName',
        render: (text, record) =>
        (
         <div style={{}} title={text}>{text.length>20?text.substring(0,19)+'...':text}</div>
       ) ,
       width: '130',

      },
      {
        title: '所属广告',
        dataIndex: 'adName',
        render: (text, record) =>
        (
          <span title={text}>{text.length>10?text.substring(0,9)+'...':text}</span>

       ) ,
      },
      {
        title: '类型',
        dataIndex: 'adIdeaType',
        render: (text, record) =>
        (
         <div style={{}}>{ideaList[text]}</div>
       ) 
      },
      {
        title: '高度',
        dataIndex: 'height',
        render: (text, record) =>
        (
         <div style={{width:'40px'}}>{text}</div>
       ) ,
       width:40
      },
      {
        title: '宽度',
        dataIndex: 'width',
        render: (text, record) =>
        (
         <div style={{width:'40px'}}>{text}</div>
       ) ,
       width:40

      },
      {
        title: '历时(秒)',
        dataIndex: 'time',
      },
     
    
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <div style={{width:'128px'}}>
            <Button onClick={() => this.handleEdit(record.id)}>编辑</Button>
            <Button type="danger" onClick={() => this.handleDelete(record.id)}>
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
      },
      loading: false,
      addVisible: false,
    };
  }

  componentDidMount() {
   this.getList()

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
    
   
  }
  getList=(current)=>{
    getAdidea({current}).then(({data})=>{
      console.log(data,'getAdidea')
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
    getAdidea({
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
      content: '请确定是否删除该广告创意？',
      okText: '确认',
      cancelText: '取消',
      onOk:()=> {
        deleteAdideaById({
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
  handleEdit=key=>{
    const w=window.open('about:blank');
    w.location.href="/form/addCreativity/"+key
  }
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
            <Form.Item name="name" label="创意名称" rules={[]}>
              <Input size="large" placeholder="请输入创意名称" />
            </Form.Item>

            <Form.Item shouldUpdate={true}>
              <Button size="large" type="primary" className={styles.rightFive+' greenButton'} htmlType="submit">
                查询
              </Button>
              <Button
                size="large"
                onClick={() => {
                  // router.push('/advForm')
                  console.log(this.props)
                  const w=window.open('about:blank');
                  w.location.href="/form/addCreativity/-1"
                }}
                type="primary"
                htmlType="submit"
              >
                新增创意
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
