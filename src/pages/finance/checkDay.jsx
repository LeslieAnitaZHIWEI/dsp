import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Input, Button, Table, Modal, Row, Col } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
import {getFinancial} from '@/services/checkday'

@connect(({form}) => {
  return { 
    
  };
})
class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '消费日期',
        dataIndex: 'consuDate',
        width: '30%',
        render: (text, record) => {
          
            return <span>{text.substring(0,10)}</span>;
          
        },
      },
      {
        title: '消费金额（元）',
        dataIndex: 'consuAmount',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      {
        title: '日终结余',
        dataIndex: 'balance',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      {
        title: '消费描述',
        dataIndex: 'operation',
        
      },
    ];
    this.state = {
      dataSource: [
        
      ],
      pagination: {
        showQuickJumper: true,
        total: 500,
        pageSize: 10,
        current:1,
        onChange: this.onChange,
        showTotal: this.showTotal,
      },
      loading: false,
      addVisible: false,
      money:''
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
      }; 
      this.getList()
  }
  getList=(current)=>{
    getFinancial({current}).then(({data})=>{
      var dataSource=data.data.page.records.map((ele,i)=>({
        ...ele,
        key:i
      }))
      var pagination= {
        ...this.state.pagination,
        total: data.total,
        current:data.current
      }
      console.log(dataSource)
      this.setState({
          money:data.data.balance.toFixed(2),
          dataSource:dataSource,
        pagination
      })
    })
  }
  onFinish = values => {
    console.log('Finish:', values);
  };
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
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
    const { dataSource, pagination,money } = this.state;
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
       <div style={{padding:'10px'}}>
    <h4>账户余额 :<span style={{fontSize:'18px',margin:'0 5px'}}>{money}</span>元</h4>
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
