import React from 'react';
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
import { getAdInfoById, addInfo } from '@/services/adplan';
import {
  launchTypeList,
  payTypeList,
  finalTypeList,
  adTypeList,
  budgetTypeList,
} from '@/utils/dictionaries';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
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
function getCheckList(value) {
  if (value) {
    return value.split(',').map(ele => {
      return (
        <Checkbox style={{ lineHeight: '40px' }} defaultChecked key={ele} disabled>
          {adTypeList[ele]}
        </Checkbox>
      );
    });
  } else {
    return '';
  }
}

@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
class advForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['jack', 'lucy'],
      editSwitch: false,
      dataSource: [
        {
          totalCost: 0,
          adShow: 0,
          cps: 0,
          adClick: 0,
          ctr: 0,
          cpc: 0,
          adConversion: 0,
          cvr: 0,
          cpa: 0,
        },
      ],
      name: '　',
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
        directionalInfo: {
          packSize: '',
          tagIds: '',
        },
        planStatus: '',
        impTracking: '',
        clickTracking: '',
      },
      cAdData: [],
      adPlace: false,
    };
    this.columns = [
      {
        title: '累计花费',
        dataIndex: 'totalCost',
      },
      {
        title: '曝光量',
        dataIndex: 'adShow',
      },
      {
        title: '千次曝光成本',
        dataIndex: 'cps',
      },
      {
        title: '点击数',
        dataIndex: 'adClick',
      },
      {
        title: '点击率',
        dataIndex: 'ctr',
      },
      {
        title: '点击成本',
        dataIndex: 'cpc',
      },
    ];
  }
  formRef = React.createRef();
  componentDidMount() {
    getAdInfoById({
      id: this.props.match.params.id,
    }).then(({ data }) => {
      console.log(data);
      let cAdData = data.adPositionDetails;

      this.setState({
        advInfo: data,
        name: data.name,
        cAdData,
      });
      if (data.effectAssessDTO) {
        let dataSource = [data.effectAssessDTO].map((ele, index) => {
          return {
            ...ele,
            key: index,
          };
        });
        this.setState({
          dataSource: dataSource,
        });
      }
    });
  }
  openAdPlace = () => {
    this.setState({
      adPlace: true,
    });
  };
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
  };
  render() {
    const { items, editSwitch, dataSource, advInfo, name, cAdData } = this.state;
    const kongbai=()=>{
      return (<div style={{height:'32px'}}>　</div>)
    }
    const adColumns = [
      {
        title: '媒体',
        dataIndex: 'media',
        width: 100,
      },
      {
        title: '平台',
        dataIndex: 'platform',
        render: (text, record) => {
          switch (text) {
            case 1:
              return 'IOS';
            case 2:
              return '安卓';
          }
        },
        width: 100,
      },
      {
        title: '广告位名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '广告类型',
        dataIndex: 'adPositionType',
        render: (text, record) => {
          switch (text) {
            case 0:
              return '原生广告';
            case 1:
              return '横幅广告';
            case 2:
              return '开屏广告';
            case 3:
              return '视频广告';
            case 4:
              return '插屏广告';
            case 5:
              return '激励视频广告';
          }
        },
        width: 100,
      },
      {
        title: '建议出价',
        dataIndex: 'advisePrice',
        width: 100,
        render: (text, record) => {
          return text + '/CPM';
        },
      },
      {
        title: '素材要求',
        dataIndex: 'sourceRequire',
        render: (text, record) => {
          let source = JSON.parse(text);
          console.log(source, '????');
          let str = '';
          source.forEach(item => {
            console.log(item.type == 1);
            if (item.type == 0) {
              str += '图片 ' + item.size + '*'+item.amount + '  ';
            }
            if (item.type == 1) {
              str += '视频 ' + item.size + '*'+item.amount + '  ';
              console.log(str, 'str呢');
            }
            if (item.type == 2) {
              str += 'ICON ' + item.size + '*'+item.amount + '  ';
            }
          });
          console.log(str, '????');

          return str;
        },
        width: 200,
      },

      {
        title: kongbai,
        key: 'action',
        render: (text, record) => <Button onClick={() => this.chooseAd(record)}>-></Button>,
        width: 100,
      },
    ];
    
    const cAdColumns = [
      {
        title: '媒体',
        dataIndex: 'media',
        width:100
      },

      {
        title: '广告位名称',
        dataIndex: 'name',
        width:200
      },
      {
        title: '广告类型',
        dataIndex: 'adPositionType',
        render: (text, record) => {
          switch (text) {
            case 0:
              return '原生广告';
            case 1:
              return '横幅广告';
            case 2:
              return '开屏广告';
            case 3:
              return '视频广告';
            case 4:
              return '插屏广告';
            case 5:
              return '激励视频广告';
          }
        },
        width:100
      },
      {
        title: '建议出价',
        dataIndex: 'advisePrice',
        render: (text, record) => {
          return text + '/CPM';
        },
      },
      {
        title: '素材要求',
        dataIndex: 'sourceRequire',
        render: (text, record) => {
          let source = JSON.parse(text);
          console.log(source);
          let str = '';
          source.forEach(item => {
            if (item.type == '0') {
              str += '图片 ' + item.size + '*'+item.amount + '  ';
            }
            if (item.type == '1') {
              str += '视频 ' + item.size + '*'+item.amount + '  ';
            }
            if (item.type == '2') {
              str += 'ICON ' + item.size + '*'+item.amount + '  ';
            }
          });
          return str;
        },
        width:200
      },
      {
        title: kongbai,
        key: 'action',
        render: (text, record) => (
          <Button
            disabled
            onClick={() => {
              this.deleteAd(record);
            }}
          >
            <DeleteOutlined />
          </Button>
        ),
        width:100
      },
    ];
    return (
      <div>
        <Modal
          visible={this.state.adPlace}
          title="定向广告位"
          width={'90%'}
          className="adModal"
          closable={false}
          footer={[
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() => {
                  this.setState({ adPlace: false });
                }}
                type="danger"
              >
                关闭
              </Button>
            </div>,
          ]}
        >
          <Form initialValues={{ tfpt: '1' }}>
            <Form.Item name="tfpt" labelCol={{  md: 2,xxl:1 }} label="投放平台" rules={[]}>
              <div>
                <Checkbox.Group
                  style={{ width: '100%' }}
                  value={this.state.group1}
                  onChange={this.onCheckGorupChange}
                  disabled
                >
                  <Checkbox value="1">IOS平台</Checkbox>
                  <Checkbox value="2">安卓平台</Checkbox>
                </Checkbox.Group>
              </div>
            </Form.Item>

            <Form.Item name="ff" labelCol={{  md: 2,xxl:1}} label="广告类型" rules={[]}>
              <div>
                <Checkbox.Group
                  style={{ width: '100%' }}
                  value={this.state.group2}
                  disabled
                  onChange={this.onCheckGorupChange2}
                >
                  <Row>
                    <Checkbox value="0">原生广告</Checkbox>
                    <Checkbox value="1">横幅广告</Checkbox>
                    <Checkbox value="2">开屏广告</Checkbox>
                    <Checkbox value="3">视频广告</Checkbox>
                    <Checkbox value="4">插屏广告</Checkbox>
                    <Checkbox value="5">激励视频广告</Checkbox>
                  </Row>
                </Checkbox.Group>
              </div>
            </Form.Item>
            <Row>
              <Col md={8} xxl={6}>
                <Form.Item name="media" labelCol={{  md: 6,xxl:4  }} label="媒体" rules={[]}>
                  <div>
                    {' '}
                    <Select
                      mode="multiple"
                      style={{ width: '250px' }}
                      placeholder=""
                      onChange={this.mediaHandleChange}
                      value={[]}
                      disabled
                    >
                      {/* {selectChildren} */}
                    </Select>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="tfpt" labelCol={{ span: 4 }} label="建议出价" rules={[]}>
                  <div>
                    <Input disabled style={{ width: '50px' }} value={this.state.basePriceMax} />
                    --
                    <Input disabled style={{ width: '50px' }} value={this.state.basePriceMin} />
                    　 <Button disabled>查询</Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ padding: '20px 20px' }}>
              <Col span={12}>
                <h3>广告位列表</h3>
                <Table
                  scroll={{ x: 600 }}
                  pagination={false}
                  columns={adColumns}
                  dataSource={[]}
                  style={{ marginRight: '20px' }}
                />
              </Col>

              <Col span={12}>
                <Row>
                  <Col span={12}>
                    已选中{' '}
                    <span style={{ color: 'red' }}>
                      {this.state.cAdData ? this.state.cAdData.length : 0}
                    </span>{' '}
                    个广告位
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Button disabled onClick={() => this.deleteAll()}>
                      清空
                    </Button>
                  </Col>
                </Row>
                <Table scroll={{ x: 600 }} columns={cAdColumns} dataSource={cAdData} />
              </Col>
            </Row>
          </Form>
        </Modal>
        <Card title={name} className={styles.cardCenter} style={{ width: 900 }}>
          <Form
            name="edit"
            className="checkboxW"
            {...Formlayout}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <h3>计划信息</h3>{' '}
            <Row>
              <Col span={8}>
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
            <h3>广告信息</h3>
            <a
              onClick={() => {
                const w = window.open('about:blank');

                w.location.href = '/form/addAdv/' + this.props.match.params.id;
              }}
              style={{ position: 'absolute', right: 20, top: 170 }}
            >
              编辑广告信息
            </a>
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
            </Row>
            <h3>落地信息</h3>
            <Row>
              <Col span={12}>
                <Form.Item name="password" label="落地方式" rules={[]}>
                  {advInfo.finalLaunchType != null ? finalTypeList[advInfo.finalLaunchType] : ''}　
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="password" label="落地页地址" rules={[]}>
                  {advInfo.finalLaunchUrl}
                </Form.Item>
              </Col>
              {advInfo.finalLaunchType == 2 && (
                <Col span={12}>
                  <Form.Item name="password" label="DEEPLINK地址" rules={[]}>
                    {advInfo.finalLaunchType == 2 ? advInfo.deeplinkUrl : ''}
                  </Form.Item>
                </Col>
              )}
            </Row>
            <h3>广告位</h3>
            <Row>
              <Col span={24}>
                <Form.Item labelCol={{ span: 3 }} name="password" label="广告位" rules={[]}>
                  {/* <div  style={{width:'552px'}}>
                   {getCheckList(advInfo.adType)}
                     </div>    */}
                  {this.state.cAdData
                    ? this.state.cAdData.length == 0 && (
                        <Button type="link" onClick={this.openAdPlace}>
                          广告位管理
                        </Button>
                      )
                    : ''}
                  {/* {this.state.cAdData
                    ? this.state.cAdData.length != 0 && ( */}
                        <div>
                          共选择{' '}
                          <Button type="link" onClick={this.openAdPlace}>
                            {this.state.cAdData?this.state.cAdData.length:0}
                          </Button>
                          个广告位
                        </div>
                       {/* )
                     : ''} */}
                </Form.Item>
              </Col>
            </Row>
            <h3>用户定向</h3>
            <Row>
              <Col span={12}>
                <Form.Item name="password" label="用户定向" rules={[]}>
                  {/* {advInfo.directionalInfo.packSize?advInfo.directionalInfo.packSize+'人':'计算中'} */}
                  {advInfo.directionalInfo.packSize && (
                    <b>{advInfo.directionalInfo.packSize + '人'}</b>
                  )}
                  {!advInfo.directionalInfo.packSize && '计算中'}
                </Form.Item>
              </Col>
              <Col span={12} style={{ marginLeft: '-200px' }}>
                <Form.Item name="aa" label="定向描述" rules={[]}>
                  <div
                    style={{ lineHeight: '40px' }}
                    dangerouslySetInnerHTML={{
                      __html: advInfo.directionalInfo.tagIds
                        ? parseStr(advInfo.directionalInfo.tagIds)
                            .split('\n')
                            .join('<br>')
                        : '-',
                    }}
                  ></div>
                </Form.Item>
              </Col>
            </Row>
            <h3>广告监测</h3>
            <Row>
              <Col span={24}>
                <Form.Item name="password" labelCol={{ span: 4 }} label="展示监测地址" rules={[]}>
                  {advInfo.impTracking ? advInfo.impTracking : '--'}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="password" labelCol={{ span: 4 }} label="点击监测地址" rules={[]}>
                  {advInfo.clickTracking ? advInfo.clickTracking : '--'}
                </Form.Item>
              </Col>
            </Row>
            <h3 style={{ marginTop: '10px' }}>推广效果</h3>
            <Table
              columns={this.columns}
              dataSource={dataSource}
              bordered
              className="makecellCenter"
              pagination={false}
            />
          </Form>
        </Card>
        ,
      </div>
    );
  }
}
export default advForm;
