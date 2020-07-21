import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  Modal,
  Col,
  Row,
  Card,
  Upload,
  InputNumber,
  message,
} from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
import {
  getdirectionalinfoList,
  getDirectionalinfoById,
  updatePrivateDirectional,
} from '@/services/directionalInfo';
import { launchTypeList, payTypeList, finalTypeList, budgetTypeList } from '@/utils/dictionaries';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function parseStr(value) {
  if (!value) {
    return '';
  }
  value = JSON.parse(value);
  var str = '';
  value.forEach(ele => {
    str += ele.tagName + '   ' + '\n';
  });
  return str;
}

@connect(({ form }) => {
  return {};
})
class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '广告名称',
        dataIndex: 'adName',
        width: '30%',
        editable: true,
      },
      {
        title: '商户名称',
        dataIndex: 'creatorName',
      },
      // {
      //   title: '预估设备数',
      //   dataIndex: 'predictSize',
      // },
      {
        title: '广告状态',
        dataIndex: 'adStatus',
        render: text => {
          switch (text) {
            case -1:
              return '已保存';
            case 0:
              return '已提交';
            case 1:
              return '待投放';
            case 2:
              return '投放中';
            case 3:
              return '已暂停';
            case 4:
              return '已完成';
          }
        },
      },
      {
        title: '定向用户',
        dataIndex: 'packSize',
        render: text => {
          if (text == null) {
            return '待处理';
          }
          return text;
        },
      },
      {
        title: '最近一次编辑时间',
        dataIndex: 'updateTime',
      },

      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <div>
            <Button onClick={() => this.handleEdit(record)}>
              编辑
            </Button>
          </div>
        ),
        width:150

      },
    ];
    this.state = {
      dataSource: [],
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
      advInfo: {},
      visible: false,
      dataAddress: '',
      InputNumberJudge: true,
      id: '',
      fileList:[]
    };
  }
  formRef = React.createRef();
  formRefA= React.createRef();
  uploadChange = file => {
    let fileList = [...file.fileList];
    fileList = fileList.slice(-1);
    this.setState({ fileList: [...fileList] });
    console.log(file)
    
    if (file.file.response) {
      console.log(file.file.response.data, 'fffff');
      this.setState({
        dataAddress: file.file.response.data.path,
        fileName:file.file.name
      });
      this.formRef.current.setFieldsValue({
        packSize: file.file.response.data.imeiNumber,
      });
    }
    if(file.fileList.length==0){
      this.setState({
        fileName:'',
        dataAddress:''
      });
      this.formRef.current.setFieldsValue({
        packSize: 0
      });
    }
  };
  changeInputNumberJudge = () => {
    this.setState({
      InputNumberJudge: false,
    });
  };
  handleEdit = record => {
    this.setState({
      id: record.id,
      InputNumberJudge: true,
      fileName:record.fileName
      
    });
    if(record.fileName){
    this.setState({
      
      fileList:[{
              name:record.fileName,
              uid:record.id,
             url:'',
              status: 'done',
            }] 
          })
            }

    getDirectionalinfoById({
      id: record.id,
    }).then(({ data }) => {
      console.log(data);
      this.setState({
        visible: true,
        advInfo: data,
      });
      this.formRef.current.setFieldsValue({
        packSize: data.packSize,
      });
    });
  };
  componentDidMount() {
    window.onfocus = ()=> {
      console.log('聚焦');
     
    };
    this.getList();
  }
  getList = current => {
    let obj=this.formRefA.current.getFieldsValue()
    getdirectionalinfoList({ current,...obj }).then(({ data }) => {
      var dataSource = data.records.map(ele => ({
        ...ele,
        key: ele.id,
      }));
      var pagination = {
        ...this.state.pagination,
        total: data.total,
      };
      this.setState({
        dataSource: dataSource,
        pagination,
      });
    });
  };
  updatePrivateDirectional = value => {
    const { dataAddress, id,fileName } = this.state;
    console.log(value);
    updatePrivateDirectional({
      fileName,
      dataAddress,
      packSize: value.packSize,
      id,
    }).then(res => {
      if (res.code == 0) {
        message.success(res.data);
        this.setState({
          visible: false,
        });
        this.setState({
          dataAddress: '',
          fileList:[]
        })
        this.formRef.current.setFieldsValue({
          packSize: '',
        });
        this.getList()
      } else {
        message.warning(res.msg);
      }
    });
  };

  onFinish = values => {
    console.log('Finish:', values);

    getdirectionalinfoList({
      ...values,
    }).then(({ data }) => {
      console.log(data);
      var arr = data.records.map(item => {
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
    });
  };
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  onChange = pageNumber => {

    this.getList(pageNumber);
    this.setState({
      pagination:{
        ...this.state.pagination,
        current:pageNumber
      }
    })
    console.log('Page: ', pageNumber);
  };
  showTotal(total) {
    return `共${total}条`;
  }
  componentWillReceiveProps(props) {
    console.log(props, 'props');
  }
  render() {
    const { dataSource, pagination, advInfo, visible, InputNumberJudge } = this.state;
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        <div style={{ overflow: 'hidden' }}>
          <Form
            name="search"
            initialValues={{ status: '0' }}
            layout="inline"
            className={styles.form}
            onFinish={this.onFinish}
            ref={this.formRefA}
          >
            <Form.Item name="status" label="定向用户" rules={[]}>
              <Select style={{ width: 200 }}>
                <Option value="0">全部</Option>
                <Option value="1">待处理</Option>
                <Option value="2">已处理</Option>
              </Select>
            </Form.Item>
            <Form.Item name="creatorName" label="商户名称" rules={[]}>
              <Input size="large" placeholder="请输入商户名称" />
            </Form.Item>
            <Form.Item name="adName" label="广告名称" rules={[]}>
              <Input size="large" placeholder="请输入广告名称" />
            </Form.Item>

            <Form.Item shouldUpdate={true}>
              <Button size="large" type="primary" className={styles.rightFive+' greenButton'} htmlType="submit">
                查询
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
        <Modal
          className="oriModal validator"
          width={940}
          title={advInfo.adName}
          visible={visible}
          footer={null}
          closable={false}
        >
          <Card title={name} className={styles.cardCenter} style={{ width: '900px' }}>
            <Form
              name="edit"
              {...Formlayout}
              ref={this.formRef}
              onFinish={this.updatePrivateDirectional}
            >
              <h3>计划信息</h3>{' '}
              <Row>
                <Col span={7} offset={1}>
                  <Form.Item name="plan" label="启动状态" rules={[]}>
                    {advInfo.planStatus == 1 ? '已开启' : ''}
                    {advInfo.planStatus == 0 ? '已关闭' : ''}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="plan" label="预算" rules={[]}>
                    {budgetTypeList[advInfo.budgetType]} <b>{advInfo.budgetAmount}</b> 元/天
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
                      ? payTypeList[advInfo.payType] + ' ' + advInfo.bidPrice + '元'
                      : ''}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="password" label="商户名称" rules={[]}>
                    {advInfo.creatorName}
                  </Form.Item>
                </Col>
              </Row>
              <h3>用户定向</h3>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="password"
                    label="定向用户状态"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    rules={[]}
                  >
                  <span style={{ color: 'red' }}>  {advInfo.packSize == null ? '待处理' : ''}
                  </span>  <span style={{ color: 'red' }}>
                      {' '}
                      {advInfo.packSize != null ? advInfo.packSize : ''}
                    </span>
                    {advInfo.packSize != null ? '人' : ''}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="aaa"
                    label="标签"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    rules={[]}
                  >
                    <div
                      style={{ lineHeight: '40px' }}
                      dangerouslySetInnerHTML={{
                        __html: advInfo.tagIds
                          ? parseStr(advInfo.tagIds)
                              .split('\n')
                              .join('<br>')
                          : '-',
                      }}
                    ></div>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="password" labelCol={{ span: 3 }} label="人群包上传" rules={[]}>
                    <Dragger
                      onChange={this.uploadChange}
                      fileList={this.state.fileList}
                      action="/dsp2/directionalinfo/uploadDirectional"
                      headers={{
                        Authorization: 'Bearer ' + window.localStorage.getItem('putToken'),
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                      <p className="ant-upload-hint">
                        只能上传一个 txt文件，且不超过 10000kb 文群包内容为imei号，加密为imei_md5
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col span={12} style={{ position: 'relative' }}>
                  <Form.Item
                    name="packSize"
                    label="实际设备数"
                    rules={[{ required: true, message: '请输入实际设备数' }]}
                  >
                    <InputNumber disabled={InputNumberJudge} style={{ width: '150px' }} />
                  </Form.Item>
                  <Button
                    style={{ position: 'absolute', top: '4px', left: '260px' }}
                    onClick={this.changeInputNumberJudge}
                  >
                    手动编辑
                  </Button>
                </Col>
                {/* <Col span={7} offset={5}>
                  <Form.Item
                    name="s"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 15 }}
                    label="预估设备数"
                    rules={[]}
                  >
                    <b>{advInfo.predictSize}</b> 个
                  </Form.Item>
                </Col> */}
              </Row>
              <div className={styles.makeCenter}>
                <Button className={styles.rightFive} htmlType="submit" type="primary">
                  保存
                </Button>
                <Button onClick={() => {this.setState({ visible: false })
             this.setState({
              dataAddress: '',
              fileList:[]
            }); }}>关闭</Button>
              </div>
            </Form>
          </Card>
        </Modal>
      </PageWrapper>
    );
  }
}
export default advPlan;
