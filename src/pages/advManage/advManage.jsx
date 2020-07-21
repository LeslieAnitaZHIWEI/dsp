import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Input, Button, Table, Modal, Row, Col } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
import {getAdInfoList} from '@/services/adplan'
import {statusList,isUploadList,payTypeList} from '@/utils/dictionaries'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {deleteAdinfo} from '@/services/adplan'

@connect(({form}) => {
  return { 
    
  };
})
class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '广告名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
        render: (text, record) => (
          <Button onClick={()=>{const w=window.open('about:blank');
          w.location.href="/form/viewAdvForm/"+record.id}} type="link"  title={text}>{text.length>20?text.substring(0,19)+'...':text}</Button>
         ),
         
      },
      {
        title: '所属计划',
        dataIndex: 'planName',
      },
      {
        title: '出价',
        dataIndex: 'bidPrice',
        render: (text, record) => (
          <span>
           {payTypeList[record.payType]+' '} {text}
          </span>
        ),
      },
      {
        title: '广告类型',
        dataIndex: 'adTypeStr',
        render: (text, record) =>
        (
         <span title={text}>{text.length>9?text.substring(0,9)+'...':text}</span>
       ) 
      },
      {
        title: '状态',
        dataIndex: 'adStatus',
        render: (text, record) =>
           (
            <span>{statusList[text]}</span>
          ) 
      },
      {
        title: '定向人群',
        dataIndex: 'packSize',
        render: (text, record) =>
           (
            <span>{text==null?'计算中':text}</span>
          ) 
      },
      {
        title: '累计花费',
        dataIndex: 'cumulative',
      },
      {
        title: '创意',
        dataIndex: 'isUpload',
        render: (text, record) =>
        (
         <span>{isUploadList[text]}</span>
       ) 
      },
    
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <div style={{width:'128px'}}>
            <Button onClick={() => this.handleEdit(record.key)}>编辑</Button>
            <Button type="danger" onClick={() => this.handleDelete(record.key)}>
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
    getAdInfoList({current}).then(({data})=>{
      console.log(data,'getAdInfoList')
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
    getAdInfoList({
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
  handleEdit= key => {
    const w=window.open('about:blank');
    
      w.location.href="/form/addAdv/"+key
    console.log(key)
  };
  handleDelete = id => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除该广告计划请确认是否删除？删除广告将同时删除其下的广告创意，且无法撤销恢复!请再次确认',
      okText: '确认',
      cancelText: '取消',
      onOk:()=> {
        deleteAdinfo({
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
    console.log('Page: ', pageNumber);
    this.getList(pageNumber)

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
            <Form.Item name="name" label="广告名称" rules={[]}>
              <Input size="large" placeholder="请输入广告名称" />
            </Form.Item>

            <Form.Item shouldUpdate={true}>
              <Button size="large" type="primary" className={styles.rightFive+' '+'greenButton'} htmlType="submit">
                查询
              </Button>
              <Button
                size="large"
                onClick={() => {
                  // router.push('/advForm')
                  console.log(this.props)
                  const w=window.open('about:blank');
                  w.location.href="/form/addAdv/-1"
                }}
                type="primary"
                htmlType="submit"
              >
                新增广告
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
