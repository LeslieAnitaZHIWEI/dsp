import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Table,
  Modal,
  Row,
  Col,
  message,
} from 'antd';
import moment from 'moment';
import styles from './style.less';
import {
  getEffectassessPage,
  getEffectassessById,
  getEffectassessList,
  putEffectassess,
  deleteEffectassess,
} from '@/services/putinmanage';
import { launchTypeList, payTypeList, finalTypeList, adTypeList } from '@/utils/dictionaries';
import {budgetTypeList} from '@/utils/dictionaries'
import { getFinancial ,getDailyBill} from '@/services/checkday';

const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '广告名称',
        dataIndex: 'adName',
        editable: true,
        render: (value, row, index) => {
          const obj = {
          children: <div style={{textAlign:'center'}} title={value}>{value.length>7?value.substring(0,7)+'...':value}</div> ,
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '商户名称',
        dataIndex: 'businessName',
        width: '30%',
        editable: true,
       
        render: (value, row, index) => {
          const obj = {
          children:<span title={value}>{value.length>7?value.substring(0,7)+'...':value}</span> ,
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '累计花费',
        dataIndex: 'totalCost',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'adShow',
      },
      {
        title: '累计展示效果',
        colSpan: 2,
        dataIndex: 'cps',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'adClick',
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'ctr',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      {
        title: '累计点击效果',
        colSpan: 3,
        dataIndex: 'cpc',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      // {
      //   title: '',
      //   colSpan: 0,
      //   dataIndex: 'adConversion',
      // },
      // {
      //   title: '',
      //   colSpan: 0,
      //   dataIndex: 'cvr',
      //   render: (text, record) => {
      //     if (!isNaN(text)) {
      //       return <span>{text.toFixed(2)}</span>;
      //     } else {
      //       return text;
      //     }
      //   },
      // },
      // {
      //   title: '累计转化效果',
      //   colSpan: 3,
      //   dataIndex: 'cpa',
      //   render: (text, record) => {
      //     if (!isNaN(text)) {
      //       return <span>{text.toFixed(2)}</span>;
      //     } else {
      //       return text;
      //     }
      //   },
      // },

      {
        title: '操作',
        dataIndex: 'key',
        render: (value, row, index) => {
          const obj = {
            children: (
              <div style={{ width: '97px' }}>
                <Button size="small" type="primary" onClick={() => this.handleEdit(row)}>编辑</Button>
                <Button size="small" onClick={() => this.handleSee(row)}>查看</Button>
              </div>
            ),
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
        width:150

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
    this.columns2 = [
      {
        title: '消费日期',
        dataIndex: 'recordDay',
        width: '25%',
        render:(value)=>{
        return <span>{moment(value).format('YYYY-MM-DD')}</span>
        }
      },
      {
        title: '消费金额',
        dataIndex: 'totalCost',
        width: '15%',
        editable: true,
        render:(value,record)=>{
          return <Button type="link" disabled={record.origin!=0} onClick={()=>{this.lookDetail(record)}}>{value}</Button>
          }
      },
      {
        title: '曝光数',
        dataIndex: 'adShow',
        editable: true,
      },
      {
        title: '点击数',
        dataIndex: 'adClick',
        editable: true,
      },
      // {
      //   title: '转化数',
      //   dataIndex: 'adConversion',
      //   editable: true,
      // },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <Button
                type="link"
                onClick={() => this.save(record)}
                style={{
                  marginRight: 8,
                  padding: 0,
                }}
              >
                保存
              </Button>
              <Button
                style={{
                  padding: 0,
                }}
                type="link"
                onClick={() => this.cancel()}
              >
                取消
              </Button>
            </span>
          ) : (
            <span>
              <Button
                type="link"
                disabled={this.state.editingKey !== ''||record.origin==0}
                onClick={() => this.edit(record)}
              >
                编辑
              </Button>
              <Button
                type="link"
                disabled={this.state.editingKey !== ''||record.origin==0}
                onClick={() => this.delete(record)}
              >
                删除
              </Button>
            </span>
          );
        },
      },
    ];
    this.state = {
      dataSource: [],
      data: [],
      pagination: {
        showQuickJumper: true,
        total: 500,
        pageSize: 20,
        current:1,
        onChange: this.onChange,
        showTotal: this.showTotal,
      },
      loading: false,
      savePelpleVisible: false,
      editingKey: '',
      advInfo: {
        launchDateType: 0,
        launchStartDate: '',
        launchEndDate: '',
        launchTimeType: 0,
        launchStartTime: '',
        launchEndTime: '',
        bidPrice: '',
        payType: '',
        finalLaunchType: '',
        finalLaunchUrl: '',
        adType: '',
        adList: [],
        launchType: '',
        budgetAmount: '',
        impTracking: '',
        budgetType: '',

        packSize: '',
        tagIds: '',

        planStatus: '',
        impTracking: '',
        clickTracking: '',
        businessName: '',
        cpa: '',
        cpc: '',
        cps: '',
        ctr: '',
        cvr: '',
      },
      id:'',
      DatePickerValue:'',
      pagination2:{ total: 500,
        pageSize: 10,
        onChange: this.onChange2,
        showTotal: this.showTotal,},
      detailVis: false,
      dayDataSource:[],
      dayPagination: {
        showQuickJumper: true,
        total: 0,
        pageSize: 10,
        current: 1,
        onChange: this.dayonChange,
        showTotal: this.showTotal,
      },
      consuDate:''
    };
  }
  formRef = React.createRef();
  formEdit = React.createRef();

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
  onChange2=(pageNumber) =>{
    console.log('Page: ', pageNumber);
    this.getEffectassessList('',pageNumber)
  }
  showTotal(total) {
    return `共${total}条`;
  }
  lookDetail=(row)=>{
    console.log(row,'roorwww')
    this.setState({detailVis:true,consuDate:row.recordDay},()=>{
      this.getDailyBill(1)
    })
   
    
    
  }
  getDailyBill=(current)=>{
    let obj={
      adName:this.state.advInfo.adName,
      company:this.state.advInfo.businessName,
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
  getList=(current)=>{
    getEffectassessPage({
      current
    }).then(({ data }) => {
      console.log(data, 'getEffectassessPage');
      let arr = [];
      let dataSource = data.records.forEach((item, index) => {
        arr.push({
          key: item.adId,
          adName:item.adName,
          businessName: item.businessName,
          totalCost: item.totalCost,
          adShow: '曝光量',
          cps: '千次曝光成本',
          adClick: '点击数',
          ctr: '点击率',
          cpc: '点击成本',
         
        });
        arr.push(item);
      });
      console.log(arr,'arrrr')

      var pagination= {
        ...this.state.pagination,
        total: data.total,
        current:data.current
      }
      this.setState({
        dataSource: arr,
        pagination
      });
    });
    
  }
  onFinish = values => {
    console.log('Finish:', values);
    var dto = {
      adName: values.adName || '',
      businessName: values.businessName || '',
    };
    getEffectassessPage({
      ...dto,
    }).then(({ data }) => {
      let arr = [];
      let dataSource = data.records.forEach((item, index) => {
        arr.push({
          key: item.adId,
          adName:item.adName,
          businessName: item.businessName,
          totalCost: item.totalCost,
          adShow: '曝光量',
          cps: '千次曝光成本',
          adClick: '点击数',
          ctr: '点击率',
          cpc: '点击成本',
         
        });
        arr.push(item);
      });
      var pagination= {
        ...this.state.pagination,
        total: data.total,
        current:data.current
      }
      this.setState({
        dataSource: arr,
        pagination
      });
    });
  };
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  handleEdit = key => {
    var judge = true;
    this.columns2.forEach(ele => {
      if (ele.dataIndex == 'operation') {
        judge = false;
      }
    });
    if (judge) {
      this.columns2.push({
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <Button
                type="link"
                onClick={() => this.save(record)}
                style={{
                  marginRight: 8,
                  padding: 0,
                }}
              >
                保存
              </Button>
              <Button
                style={{
                  padding: 0,
                }}
                type="link"
                onClick={() => this.cancel()}
              >
                取消
              </Button>
            </span>
          ) : (
            <span>
              <Button
                type="link"
                disabled={this.state.editingKey !== ''||record.origin==0}
                onClick={() => this.edit(record)}
              >
                编辑
              </Button>
              <Button
                type="link"
                disabled={this.state.editingKey !== ''||record.origin==0}
                onClick={() => this.delete(record)}
              >
                删除
              </Button>
            </span>
          );
        },
      });
    }
    console.log('编辑', key);
    this.setState({
      id:key.key
    },()=>{
    this.getEffectassessList();

    })
    getEffectassessById({
      id: key.key,
    }).then(({ data }) => {
      console.log(data, 'getEffectassessById');
      this.setState({
        advInfo: data,
        savePelpleVisible: true,
      });
    });
  };
  handleSee = (key) => {
    this.setState({
      id:key.key
    },()=>{
      this.getEffectassessList();

    })
    getEffectassessById({
      id: key.key,
    }).then(({ data }) => {
      console.log(data, 'getEffectassessById');
      this.setState({
        advInfo: data,
        savePelpleVisible: true,
      });
    });
    var columns2 = this.columns2.filter(item => item.dataIndex != 'operation');

    this.columns2 = columns2;

  };
  getEffectassessList(queryDate,current) {
    getEffectassessList({
      current,
      adId: this.state.id,
      queryDate: queryDate == '' ? undefined : queryDate,
    }).then(({ data }) => {
      console.log(data, 'getEffectassessList');
      let arr = data.records.map((ele, index) => {
        return {
          ...ele,
          key: index,
        };
      });
      this.setState({
        pagination2:{
          ...this.state.pagination2,
          total:data.total
        }
      })
      this.setState({
        data: arr,
      });
    });
  }
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
  dayonChange= pageNumber => {
    this.setState({
      dayPagination: {
        ...this.state.dayPagination,
        current: pageNumber,
      },
    });
    this.getDailyBill(pageNumber);
  };
  onDateChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      DatePickerValue:date
    })
    
    this.getEffectassessList(dateString);
  };
  showTotal(total) {
    return `共${total}条`;
  }

  //编辑
  isEditing = record => record.key === this.state.editingKey;

  edit = record => {
    this.formEdit.current.setFieldsValue({ ...record });
    this.setState({
      editingKey: record.key,
    });
  };

  cancel = () => {
    this.setState({
      editingKey: '',
    });
  };
  delete = record => {
    deleteEffectassess({
      ...record,
    }).then(({ data }) => {
      console.log(data);
      this.getEffectassessList();
    });
  };

  save = async record => {
    const { key } = record;
    try {
      const row = await this.formEdit.current.validateFields();
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      console.log(record);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
          data: newData,
          editingKey: '',
        });
      } else {
        newData.push(row);
        this.setState({
          data: newData,
          editingKey: '',
        });
      }
      putEffectassess({
        ...record,
        ...row,
      }).then(res => {
        if(res.code==0){
          message.success('修改成功');

        }else{
          message.warning(res.msg)
        }
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  render() {
    const { dataSource, pagination, data, advInfo,dayDataSource,dayPagination } = this.state;
    const mergedColumns = this.columns2.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          inputType:
            col.dataIndex === 'totalCost' || 'adClick' || 'adConversion' || 'adShow'
              ? 'number'
              : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        <div style={{ overflow: 'hidden' }}>
          <Form name="search" layout="inline" className={styles.form} onFinish={this.onFinish}>
            <Form.Item name="businessName" label="商户名称" rules={[]}>
              <Input size="large" placeholder="请输入商户名称" />
            </Form.Item>{' '}
            <Form.Item name="adName" label="广告名称" rules={[]}>
              <Input size="large" placeholder="请输入广告名称" />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              <Button size="large" style={{backgroundColor:'rgb(26, 188, 156)',
    borderColor:'rgb(26, 188, 256)',
    color:'white'}} type="primary" className={styles.rightFive} htmlType="submit">
                查询
              </Button>
              <Button
                size="large"
                onClick={() => {
                  // router.push('/advForm')
                  console.log(this.props);
                  const w = window.open('about:blank');
                  w.location.href = '/form/checkDayManage';
                }}
                type="primary"
                htmlType="submit"
              >
                新增日流水
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Table
          columns={this.columns}
          className='smallTable'
          loading={this.state.loading}
          dataSource={dataSource}
          bordered
          pagination={pagination}
        />

<Modal zIndex={99999} forceRender onCancel={()=>{this.setState({detailVis:false})}} title="查看日流水" width={980} footer={null} visible={this.state.detailVis}>
          
          <Table
          columns={this.dayColumns}
          // loading={this.state.loading}
          dataSource={dayDataSource}
          bordered
          
          pagination={dayPagination}
        />
        </Modal> 

        <Modal
          visible={this.state.savePelpleVisible}
          title={advInfo.adName}
         
          closable={false}
          width={880}
          footer={null}
        >
          <Form name="edit" {...Formlayout} ref={this.formRef} onFinish={this.onFinish}>
            <h3>计划信息</h3>{' '}
            <Row>
              <Col span={7} offset={1}>
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="启动状态" rules={[]}>
                 
                  {advInfo.adStatus == 3 ? '已暂停' :'已开启'}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="plan" label="预算" rules={[]}>
                {budgetTypeList[advInfo.budgetType]} <b>{advInfo.budgetAmount}</b>  元/天

                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="plan" label="投放方式" rules={[]}>
                  {advInfo.budgetType !== '' ? launchTypeList[advInfo.budgetType] : ''}
                </Form.Item>
              </Col>
            </Row>
            <h3>广告基本信息</h3>
            <Row>
              <Col span={12}>
                <Form.Item name="password" label="投放日期" rules={[]}>
                  {advInfo.launchDateType == 1
                    ? '指定日期段 ' + advInfo.launchStartDate + '-' + advInfo.launchEndDate
                    : '今日起长期'}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="password" label="投放时段" rules={[]}>
                  {advInfo.launchTimeType == 1
                    ? '指定时间段 ' + advInfo.launchStartTime + '-' + advInfo.launchEndTime
                    : '不限时段'}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name="password" label="出价" rules={[]}>
                  {advInfo.payType !== null
                    ? payTypeList[advInfo.payType] +' '+ advInfo.bidPrice + '元'
                    : ''}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="password" label="商户名称" rules={[]}>
                  {advInfo.businessName}
                </Form.Item>
              </Col>
            </Row>
            <h3>用户定向</h3>
            <Row>
              <Col span={12}>
                <Form.Item name="password" label="人群包信息" rules={[]}>
                <span style={{fontWeight:700}}> {advInfo.packSize?advInfo.packSize:0+' '}</span> 人　(IMEI号)
                </Form.Item>
              </Col>
            </Row>
            <h3>投放结果</h3>
            <Row>
              <Col span={7} offset={1}>
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计花费" rules={[]}>
                <b>{advInfo.totalCost}</b>  元
                </Form.Item>
              </Col>
              <Col span={8}></Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={7} offset={1}>
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计曝光次数" rules={[]}>
              <b>{(advInfo.adShow/1000)}</b>    千次
                </Form.Item>
              </Col>
              <Col span={8}>
                {' '}
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计曝光成本" rules={[]}>
               {advInfo.cps?advInfo.cps.toFixed(2):advInfo.cps}    元/千次
                </Form.Item>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={7} offset={1}>
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计点击次数" rules={[]}>
                <b>{advInfo.adClick}</b>   次
                </Form.Item>
              </Col>
              <Col span={8}>
                {' '}
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计点击成本" rules={[]}>
                  {advInfo.cpc?advInfo.cpc.toFixed(2):advInfo.cpc} 元
                </Form.Item>
              </Col>
              <Col span={8}>
                {' '}
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计点击率" rules={[]}>
                  {advInfo.ctr?advInfo.ctr.toFixed(2):advInfo.ctr} %
                </Form.Item>
              </Col>
            </Row>
            {/* <Row>
              <Col span={7} offset={1}>
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计转化次数" rules={[]}>
                <b>{advInfo.adConversion} </b>  次
                </Form.Item>
              </Col>
              <Col span={8}>
                {' '}
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计转化成本" rules={[]}>
                  {advInfo.cpa?advInfo.cpa.toFixed(2):advInfo.cpa} 元
                </Form.Item>
              </Col>
              <Col span={8}>
                {' '}
                <Form.Item name="plan" labelCol={8} wrapperCol={16} label="累计转化率" rules={[]}>
                  {advInfo.cvr?advInfo.cvr.toFixed(2):advInfo.cvr} %
                </Form.Item>
              </Col>
            </Row> */}
            <div style={{ textAlign: 'right', padding: '5px' }}>
              选择日期查询　
              <DatePicker value={this.state.DatePickerValue} onChange={this.onDateChange.bind(this)} />
            </div>
            <Form ref={this.formEdit} name="editform" component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                columns={mergedColumns}
                dataSource={data}
                bordered
                pagination={this.state.pagination2}
              />
            </Form>
          </Form>
          <div className={styles.makeCenter} style={{ paddingTop: '8px' }}>
            <Button onClick={() => {this.setState({ savePelpleVisible: false,DatePickerValue:'' }) 
          this.cancel()}}>关闭</Button>
          </div>
        </Modal>
      </PageWrapper>
    );
  }
}
export default advPlan;
