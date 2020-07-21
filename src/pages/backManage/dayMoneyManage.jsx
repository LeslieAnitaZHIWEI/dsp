import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Input, Button, Table, Modal, Row, Col, DatePicker } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
import { getFinancial,getListBill ,getDailyBill} from '@/services/checkday';
const { RangePicker } = DatePicker;
import moment from 'moment'
@connect(({ form }) => {
  return {};
})
class checkDay extends React.Component {
formRef=React.createRef()
formRefA=React.createRef()
constructor(props) {
    super(props);
    this.columns = [
      {
        title: '消费日期',
        dataIndex: 'consuDate',
        width: '30%',
        render: (text, record) => {
          return <span>{text.substring(0, 10)}</span>;
        },
      },
      {
        title: '消费金额（元）',
        dataIndex: 'consuAmount',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <Button type="link"  onClick={()=>this.lookDetail(record)}>{text.toFixed(2)}</Button>;
          } else {
            return text;
          }
        },
      },
  
    ];
    this.dayColumns=[{
        title: '成交平台',
        dataIndex: 'dealPlatform',
        render:(text)=>{
            switch(text){
                case 1:return 'FTX泛为';
                case 2:return '平台自有'
            }
        }
    },{
        title: '媒体',
        dataIndex: 'media',
    },{
        title: '广告位名称',
        dataIndex: 'adPositionName',
    },{
        title: '商户名称',
        dataIndex: 'company',
    },{
        title: '广告',
        dataIndex: 'adName',
    },{
        title: '报价',
        dataIndex: 'bidPrice',
        render:(text,record)=>{
            return text+'/CPM'
        }
    },{
        title: '实际成交价',
        dataIndex: 'winPrice',
        render:(text,record)=>{
            return text+'/CPM'
        }
    },{
        title: '成交时间',
        dataIndex: 'launchTime',
    }]
    this.state = {
      dataSource: [],
      pagination: {
        showQuickJumper: true,
        total: 500,
        pageSize: 10,
        current: 1,
        onChange: this.onChange,
        showTotal: this.showTotal,
      },
      dayDataSource:[],
      dayPagination: {
        showQuickJumper: true,
        total: 0,
        pageSize: 10,
        current: 1,
        onChange: this.dayonChange,
        showTotal: this.showTotal,
      },
      loading: false,
      addVisible: false,
      money: '',
      detailVis: false,
      consuDate:'',
      consuAmount:''
    };
  }

  componentDidMount() {
    window.onfocus = () => {
      console.log('聚焦');
      var pagination = {
        ...this.state.pagination,
        current: 1,
      };
      this.setState({
        pagination,
      });
    };
    this.getList();
  }
  getList = current => {
    let startDate=''
    let endDate=''
      if(this.formRef.current.getFieldsValue().status){
startDate=(this.formRef.current.getFieldsValue().status[0]||'')
       endDate=(this.formRef.current.getFieldsValue().status[1]||'')
      }
       
      if(startDate){
        startDate=startDate.format('YYYY-MM-DD')
        endDate=endDate.format('YYYY-MM-DD')
      }
    getListBill({ current,startDate,endDate }).then(({ data }) => {
      var dataSource = data.records.map((ele,i) => ({
        ...ele,
        key: i
      }));
      var pagination = {
        ...this.state.pagination,
        total: data.total,
        current: data.current,
      };
      this.setState({
        // money: data.data.balance.toFixed(2),
        dataSource: dataSource,
        pagination,
      });
    });
  };
  
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  onChange = pageNumber => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: pageNumber,
      },
    });
    console.log('Page: ', pageNumber);
    this.getList(pageNumber);
  };
  dayonChange= pageNumber => {
    this.setState({
      dayPagination: {
        ...this.state.dayPagination,
        current: pageNumber,
      },
    });
    this.getDailyBill(pageNumber);
  };
  showTotal(total) {
    return `共${total}条`;
  }
  componentWillReceiveProps(props) {
    console.log(props, 'props');
  }
  onFinish = values => {
    console.log('Finish:', values);
    this.getList()
  };
  lookDetail = (row) => {
    console.log('??',row)
    this.setState({
        consuAmount:row.consuAmount,
        consuDate:row.consuDate
    },()=>{
        this.getDailyBill()

    })
    
    this.setState({
      detailVis:true
    })
  };
  getDailyBill=(current)=>{
    let obj={
        adName:this.formRefA.current.getFieldsValue().adName||'',
        company:this.formRefA.current.getFieldsValue().company||'',
        consuDate:this.state.consuDate,
        current
      }
      getDailyBill({
  ...obj
      }).then(({data})=>{
        console.log(data)
        var dayPagination = {
          ...this.state.dayPagination,
          total: data.total,
          current: data.current,
        };
        this.setState({
          dayDataSource:data.records,
          dayPagination
        })
        
      })
  }
  search = () => {
    this.getDailyBill()
  };
  render() {
    const { dataSource,consuAmount,consuDate, pagination, money,dayPagination,dayDataSource } = this.state;
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        {/* <div style={{padding:'10px'}}>
    <h4>账户余额 :<span style={{fontSize:'18px',margin:'0 5px'}}>{money}</span>元</h4>
       </div> */}
        <div style={{ float: 'right', height: '40px' }}>
          <Form onFinish={this.onFinish} initialValues={{status:['','']}} ref={this.formRef} layout="inline" style={{ textAlign: 'right' }}>
            <Form.Item name="status" label="日期选择" rules={[]}>
              <RangePicker />
            </Form.Item>
            <Button className="greenButton" htmlType="submit">
              查询
            </Button>
          </Form>
        </div>
         <div style={{ clear: 'both' }}></div>
        <Table
          columns={this.columns}
          loading={this.state.loading}
          dataSource={dataSource}
          bordered
          pagination={pagination}
        />
        <Modal forceRender onCancel={()=>{this.setState({detailVis:false})}} title="查看日流水" width={980} footer={null} visible={this.state.detailVis}>
          <Form ref={this.formRefA}>
            <Row>
              <Col span={5}>
                <Form.Item label="消费日期">
                    {consuDate}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="消费金额">
                    {consuAmount}元
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="company" label="商户名称">
                  <Input style={{width:'150px'}}></Input>
                </Form.Item>
                
              </Col>
              <Col span={6}>
              <Form.Item name="adName" label="广告名称">
              <Input style={{width:'150px'}}></Input>

              </Form.Item>
                
              </Col>
              <Col span={2}>
              <Button className="greenButton" onClick={this.search.bind(this)}>
                  查询
                </Button>
              </Col>
            </Row>

          </Form>
          <Table
          columns={this.dayColumns}
          // loading={this.state.loading}
          dataSource={dayDataSource}
          bordered
          
          pagination={dayPagination}
        />
        </Modal> 
      </PageWrapper>
    );
  }
}
export default checkDay;
