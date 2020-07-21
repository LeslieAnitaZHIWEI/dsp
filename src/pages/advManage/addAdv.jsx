import React from 'react';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  Form,
  Card,
  Checkbox,
  Tabs,
  Select,
  Input,
  Button,
  Switch,
  message,
  TimePicker,
  Row,
  Table,
  Modal,
  DatePicker,
  Col,
} from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { butgetValidator, nameValidator } from '@/utils/validator';
import { getAdMedia } from '@/services/mediaManage';

import { router } from 'umi';
const { TabPane } = Tabs;
import moment from 'moment';
const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
import {
  getAllAdplan,
  addInfo,
  getAdInfoById,
  getAdInfoDTOList,
  getDirectionalInfoDTOList,
  editAdinfo,
  getAdposition,
  getAdpositionQuery,
} from '@/services/adplan';
const plainOptions = [
  { label: '其他', value: '0' },
  { label: '视频贴⽚', value: '1' },
  { label: '视频暂停', value: '2' },
  { label: '视频⻆标', value: '3' },
  { label: '视频悬浮', value: '4' },
  { label: '横幅⼴告', value: '5' },
  { label: '开屏⼴告', value: '6' },
  { label: '插屏⼴告', value: '7' },
  { label: '信息流⼴告', value: '8' },
  { label: '⽂字链⼴告', value: '11' },
];
function disabledDate(current) {
  // Can not select days before today and today
  return (
    current <
    moment()
      .add(-1, 'days')
      .endOf('day')
  );
}

@connect(({ user, demand, adjust }) => {
  return {
    currentUser: user.currentUser,
    selectedTags: demand.selectedTags,
    selectedTagsCrowd: demand.selectedTagsCrowd,
    cAdData: adjust.cAdData,
  };
})
class advForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['jack', 'lucy'],
      editSwitch: true,
      completeChecked: false,
      tabKey: '1',
      planList: [],
      advList: [],
      directList: [],
      unable: false,
      packSizeUnable: false,
      cardTitle: '新增广告',
      launchDateType: '0',
      launchTimeType: '0',
      finalLaunchType: '0',
      yygg: false,
      directionalInfo: [],
      packId: '',
      adPlace: false,
      group1: [],
      group2: [],
      mediaValue: [],
      selectOption: [],
      adData: [],
      cAdData: [],
      basePriceMax: '',
      basePriceMin: '',
      adLoading: false,
    };
    this.adPositionValidator = (rule, value, callback) => {
      if (this.state.cAdData.length == 0 ) {
        callback('请选择广告位');
      } else {
        callback();
      }
    };
    this.chooseTagValidator = (rule, value, callback) => {
      if (this.props.selectedTags.length == 0 && this.state.tabKey == '1') {
        callback('请选择标签');
      } else {
        callback();
      }
    };
    this.chooseTagValidator2 = (rule, value, callback) => {
      if (this.props.selectedTagsCrowd.length == 0 && this.state.tabKey == '2') {
        callback('请选择标签');
      } else {
        callback();
      }
    };
  }
  formRef = React.createRef();
  clickButton = React.createRef();

  componentDidMount() {
    getAdMedia({
      media: '',
    }).then(({ data }) => {
      let selectOption = [];
      data.forEach(item => {
        item.mediaList.forEach(ele => {
          selectOption.push(ele);
        });
      });
      this.setState({
        selectOption,
      });
    });
    const id = this.props.match.params.id;
    if (this.props.location.params) {
      this.formRef.current.setFieldsValue({
        planId: this.props.location.params.planId,
      });
    }
    if (id != -1) {
      this.setState({
        cardTitle: '编辑广告',
      });
      getAdInfoById({
        id,
      }).then(({ data }) => {
        let cAdData = data.adPositionDetails||[];
        this.setState({
          directionalInfo: data.directionalInfo,
          packId: data.packId,
          cAdData,
        });
        if (data.directionalInfo.packSize === null) {
          this.setState({
            packSizeUnable: false,
          });
        } else {
          this.setState({
            packSizeUnable: true,
          });
        }
        this.setAllFiled(data);
        if (this.props.location.obj) {
          this.setAllFiled(JSON.parse(this.props.location.obj));
        }
        // let fieldvalue = {};
        // for (let i in data) {
        //   if (data[i]) {
        //     fieldvalue[i] = data[i].toString();
        //   }
        // }
        // if(data.adStatus==4){
        //   this.setState({
        //     unable:true,
        //     completeChecked:true
        //   })
        // }
        // if(data.adStatus==3){
        //   this.setState({
        //     editSwitch:false
        //   })
        // }
        // this.formRef.current.setFieldsValue({
        //   ...fieldvalue,
        //   adType: fieldvalue.adType.split(','),
        //   planId:data.planId
        // });
        // this.props.dispatch({
        //   type: 'demand/setSelectedTags',
        //   payload: JSON.parse(data['directionalInfo'].tagIds),
        // });
      });
    } else {
      if (this.props.location.obj) {
        this.setAllFiled(JSON.parse(this.props.location.obj));
      }
    }
   
    getAllAdplan().then(({ data }) => {
      this.setState({
        planList: data || [],
      });
    });
    getAdInfoDTOList().then(({ data }) => {
      this.setState({
        advList: data || [],
      });
    });
    getDirectionalInfoDTOList().then(({ data }) => {
      this.setState({
        directList: data || [],
      });
    });
  }
  basePriceMaxchange = e => {
    e.persist();
    this.setState({
      basePriceMax: e.target.value,
    });
  };
  basePriceMinchange = e => {
    e.persist();
    this.setState({
      basePriceMin: e.target.value,
    });
  };
  setAllFiled(data) {
    let fieldvalue = {};
    for (let i in data) {
      if (data[i] && i != 'launchDateTime' && i != 'launchTimeTime') {
        fieldvalue[i] = data[i].toString();
      }
    }
    if (data.cAdData) {
      this.props.dispatch({
        type: 'adjust/addToSelect',
        cAdData: data.cAdData,
      });
      this.setState({
        cAdData: data.cAdData,
      });
    }
    if (data.adStatus == 4) {
      this.setState({
        unable: true,
        completeChecked: true,
      });
    }
    if (data.adStatus == 3) {
      this.setState({
        editSwitch: false,
      });
    }

    this.setState(
      {
        launchDateType: fieldvalue.launchDateType,
        launchTimeType: fieldvalue.launchTimeType,
        finalLaunchType: fieldvalue.finalLaunchType,
      },
      () => {

        this.formRef.current.setFieldsValue({
          ...fieldvalue,
          // adType: fieldvalue.adType.split(','),
          planId: data.planId,
          deeplinkUrl: data.deeplinkUrl,
        });
        if (data.launchDateTime) {
          this.formRef.current.setFieldsValue({
            launchDateTime: [moment(data.launchDateTime[0]), moment(data.launchDateTime[1])],
            // launchDateTime:fieldvalue.launchDateTime?[moment(fieldvalue.launchDateTime.split(',')[0]).format('YYYY-MM-DD'),moment(fieldvalue.launchDateTime.split(',')[1]).format('YYYY-MM-DD')]:'',
          });
        }
        if (data.launchTimeTime) {
          this.formRef.current.setFieldsValue({
            launchTimeTime: [moment(data.launchTimeTime[0]), moment(data.launchTimeTime[1])],
          });
        }
        if (data.launchEndDate) {
          this.formRef.current.setFieldsValue({
            launchDateTime: [moment(data.launchStartDate), moment(data.launchEndDate)],
          });
        }
        if (data.launchEndTime) {
          this.formRef.current.setFieldsValue({
            launchTimeTime: [
              moment('2020-1-1 ' + data.launchStartTime),
              moment('2020-1-1 ' + data.launchEndTime),
            ],
          });
        }
      },
    );

    if (data['directionalInfo']) {
      this.props.dispatch({
        type: 'demand/setAll',
        payload: JSON.parse(data['directionalInfo'].tagIds),
      });
    }
  }
  closePage = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  onCheckboxChange = values => {
    this.setState({
      completeChecked: values.target.checked,
    });
  };
  handleChange(value) {
    this.setState({
      launchDateType: value,
    });
  }
  handleChange2(value) {
    this.setState({
      launchTimeType: value,
    });
  }

  changeEditSwitch = checked => {
    this.setState({ editSwitch: checked });
  };
  callback = key => {
    this.setState({
      tabKey: key.toString(),
    });
  };

  deleteRow = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demand/deleteSelectTag',
      payload: record,
    });
  };
  deleteRow2 = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demand/deleteSelectedTagsCrowd',
      payload: record,
    });
  };
  copyToAdd() {
    this.setState({ tabKey: '1' });
    this.props.dispatch({
      type: 'demand/addToSelect',
    });
  }
  directChange(value) {
    let directList = this.state.directList.filter(ele => ele.name == value);

    // directList.map(ele=>({
    //   ...ele,
    //   key:ele.tagId
    // }))
    this.props.dispatch({
      type: 'demand/setDirectSelectedTags',
      payload: JSON.parse(directList[0].tagIds),
    });
  }
  onFinish = values => {

    const { editSwitch, completeChecked } = this.state;
    const {
      finalLaunchType,
      impTracking,
      clickTracking,
      finalLaunchUrl,
      deeplinkUrl,
      name,
      planId,
      launchDateType,
      bidPrice,
      launchTimeType,
      payType,
      launchDateTime,
      launchTimeTime,
    } = values;
    var dto = {
      name,
      planId,
      launchDateType,
      launchTimeType,
      payType,
      bidPrice,
      finalLaunchType,
      finalLaunchUrl,
      deeplinkUrl,
      // adType: values.adType.join(','),
      impTracking,
      clickTracking,
      packId: this.state.packId,
    };
    if (launchDateType == 1) {
      dto.launchStartDate = launchDateTime[0].format('YYYY-MM-DD');
      dto.launchEndDate = launchDateTime[1].format('YYYY-MM-DD');
    }
    if (launchTimeType == 1) {
      dto.launchStartTime = launchTimeTime[0].format('HH:mm:ss');
      dto.launchEndTime = launchTimeTime[1].format('HH:mm:ss');
    }
    let adPositionIds = [];
    this.state.cAdData.forEach(ele => {
      adPositionIds.push(ele.id);
    });
    if (this.props.match.params.id != -1 && this.props.match.params.id) {
      dto.adStatus = 1;
      if (editSwitch == false) {
        dto.adStatus = 3;
      }
      if (completeChecked == true) {
        dto.adStatus = 4;
      }
      dto.id = this.props.match.params.id;
      editAdinfo({
        adInfo: dto,
        tagIds: JSON.stringify(this.getTagList()),
        adPositionIds,
        adPositionInfo: null,
      }).then(res => {
        if (res.data.code == 0) {
          message.success('修改成功');
          router.push({
            pathname: '/form/addCreativity/-1',
            params: {
              planId: res.data.data,
            },
          });
        } else {
          message.warning(res.data.msg);
        }
      });
    } else {
      addInfo({
        adInfo: dto,
        tagIds: JSON.stringify(this.getTagList()),
        adPositionIds,
        adPositionInfo: null,
      }).then(res => {
        if (res.data.code == 0) {
          message.success('新增成功');
          router.push({
            pathname: '/form/addCreativity/-1',
            params: {
              planId: res.data.data,
            },
          });
        } else {
          message.warning(res.data.msg);
        }
      });
    }
  };
  getTagList() {
    var tagList;
    if (this.state.tabKey == '1') {
      tagList = this.props.selectedTags.map(item => {
        if (item.tag == '产品关键词' || item.tag == '地理位置'||item.tag=='品牌偏好-自定义') {
          return {
            predictNum: item.predictNum,
            tagInfo: item.tagInfo || '',
            tagName: item.tag + item.tagName,
            tag: item.tag,
          };
        } else {
          return {
            predictNum: item.predictNum,
            tagInfo: item.tagInfo || '',
            tagName: item.tagName,
            tag: item.tag,
          };
        }
      });
    } else {
      tagList = this.props.selectedTagsCrowd.map(item => {
        if (item.tag == '产品关键词' || item.tag == '地理位置'||item.tag=='品牌偏好-自定义') {
          return {
            predictNum: item.predictNum,
            tagInfo: item.tagInfo || '',
            tagName: item.tag + item.tagName,
            tag: item.tag,
          };
        } else {
          return {
            predictNum: item.predictNum,
            tagInfo: item.tagInfo || '',
            tagName: item.tagName,
            tag: item.tag,
          };
        }
      });
    }
    return tagList;
  }
  saveClose() {
    this.formRef.current.validateFields().then(values => {
      const { editSwitch, completeChecked } = this.state;
      const {
        finalLaunchType,
        impTracking,
        clickTracking,
        finalLaunchUrl,
        deeplinkUrl,
        name,
        planId,
        launchDateType,
        bidPrice,
        launchTimeType,
        payType,
        launchDateTime,
        launchTimeTime,
      } = values;
      var dto = {
        name,
        planId,
        launchDateType,
        launchTimeType,
        payType,
        deeplinkUrl,
        bidPrice,
        finalLaunchType,
        finalLaunchUrl,
        // adType: values.adType.join(','),
        impTracking,
        clickTracking,
        packId: this.state.packId,
      };
      if (launchDateType == 1) {
        dto.launchStartDate = launchDateTime[0].format('YYYY-MM-DD');
        dto.launchEndDate = launchDateTime[1].format('YYYY-MM-DD');
      }
      if (launchTimeType == 1) {
        dto.launchStartTime = launchTimeTime[0].format('HH:mm:ss');
        dto.launchEndTime = launchTimeTime[1].format('HH:mm:ss');
      }
      let adPositionIds = [];
      this.state.cAdData.forEach(ele => {
        adPositionIds.push(ele.id);
      });
      if (this.props.match.params.id != -1 && this.props.match.params.id) {
        dto.adStatus = 1;
        if (editSwitch == false) {
          dto.adStatus = 3;
        }
        if (completeChecked == true) {
          dto.adStatus = 4;
        }
        dto.id = this.props.match.params.id;

        var tagIds = JSON.stringify(this.getTagList());
        if (this.state.packSizeUnable) {
          tagIds = this.state.directionalInfo.tagIds;
        }

        editAdinfo({
          adInfo: dto,
          tagIds,
          adPositionIds,
          adPositionInfo: null,
        }).then(res => {
          if (res.code == 0) {
            message.success('修改成功');

            setTimeout(() => {
              this.closePage();
            }, 1000);
          } else {
            message.warning(res.msg);
          }
        });
      } else {
        addInfo({
          adInfo: dto,
          tagIds: JSON.stringify(this.getTagList()),
          adPositionIds,
          adPositionInfo: null,
        }).then(res => {
          if (res.data.code == 0) {
            message.success('新增成功');
            setTimeout(() => {
              this.closePage();
            }, 1000);
          } else {
            message.warning(res.data.msg);
          }
        });
      }
    });
  }
  finalLaChange(value) {
    this.setState({
      finalLaunchType: value,
    });
  }
  handleSearch = value => {
    // this.fetch(value, data => this.setState({ selectOption:data }));
    getAdMedia({
      media: value || '',
    }).then(({ data }) => {
      let selectOption = [];
      data.forEach(item => {
        item.mediaList.forEach(ele => {
          selectOption.push(ele);
        });
      });
      this.setState({ selectOption });

      // this.setState({
      //   selectOption
      // })
    });
  };
  yygg(value) {
    let advList = this.state.advList.filter(ele => ele.name == value);
    // directList.map(ele=>({
    //   ...ele,
    //   key:ele.tagId
    // }))
    if (advList.length != 0) {
      this.props.dispatch({
        type: 'demand/setAll',
        payload: JSON.parse(advList[0].tagIds),
      });

      setTimeout(() => {
        this.formRef.current.validateFields(['choosed']);
      }, 300);
    }
  }
  mediaHandleChange = value => {
    this.setState({
      mediaValue: value,
    });
  };
  newDirectChange(value) {
    this.setState({
      yygg: true,
    });
  }
  openAdPlace = () => {
    this.setState({
      adPlace: true,
    });
  };
  onCheckGorupChange = e => {
    this.setState({
      group1: e,
    });
  };
  onCheckGorupChange2 = e => {
    this.setState({
      group2: e,
    });
  };
  chooseAllAd = () => {
    const { dispatch } = this.props;
    var adData = this.state.adData;
    dispatch({
      type: 'adjust/addToSelect',
      cAdData: adData,
    });
    this.setState({
      cAdData: adData,
    });
  };
  chooseAd = record => {
    const { dispatch } = this.props;
    var cAdData = [...this.state.cAdData];
    var judge = true;
    cAdData.forEach(item => {
      if (item.id == record.id) {
        judge = false;
      }
    });
    if (judge) {
      cAdData.push(record);
    }

    dispatch({
      type: 'adjust/addToSelect',
      cAdData: cAdData,
    });
    this.setState({
      cAdData,
    });
  };
  deleteAd = record => {
    var arr = this.state.cAdData.filter(ele => ele.id != record.id);
    this.setState({
      cAdData: arr,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'adjust/addToSelect',
      cAdData: arr,
    });
  };
  deleteAll = () => {
    this.setState({
      cAdData: [],
    });
    this.props.dispatch({ type: 'adjust/deleteAll' });
  };
  searchAdList = () => {
    const { group1, group2, mediaValue, basePriceMax, basePriceMin } = this.state;
    if (group1.length == 0 || group2.length == 0) {
      message.warning('请先勾选投放平台和广告类型');
    } else {
      this.setState({
        adLoading: true,
      });
      getAdpositionQuery({
        adType: group2,
        platform: group1,
        advisePriceMax: basePriceMax,
        advisePriceMin: basePriceMin,
        media: mediaValue,
      }).then(({ data }) => {
        this.setState({
          adData: data,
          adLoading: false,
        });
      });
    }
  };
  render() {
    const {
      items,
      unable,
      packSizeUnable,
      cardTitle,
      editSwitch,
      planList,
      advList,
      directList,
      completeChecked,
      adData,
      cAdData,
    } = this.state;
    const { selectedTags, selectedTagsCrowd } = this.props;
    const listItems = selectedTags.map(demand => (
      <Row key={demand.name} style={{ lineHeight: '40px' }}>
        <Col style={{ lineHeight: '40px' }} span={16}>
          {/* <DisplayRow name={demand.tag} area={areaString}></DisplayRow> */}
          <b>{demand.tag}</b>
          {console.log(demand, 'demanddemanddemand')}
          {demand.tag == '地理位置' ? demand.tagName : ''}
          {demand.tag == '产品关键词' ? demand.tagName : ''}
          {demand.tag.indexOf('品牌') != -1 ? demand.tagName : ''}

          {demand.categoryId == 0 ? demand.tagName : ''}
        </Col>

        <Col span={4}>
          <Button
            style={{ color: 'red' }}
            type="link"
            size="small"
            disabled={unable || packSizeUnable}
            onClick={() => this.deleteRow(demand)}
            shape="circle"
            icon={<CloseOutlined />}
          />
        </Col>
      </Row>
    ));
    const listItemsCrowd = selectedTagsCrowd.map(demand => (
      <Row key={demand.tagId}>
        <Col style={{ lineHeight: '40px' }} span={16}>
          {/* <DisplayRow name={demand.tag} area={areaString}></DisplayRow> */}
          <b>{demand.tag}</b>
          {demand.tag == '地理位置' ? demand.tagName : ''}
          {demand.tag == '产品关键词' ? demand.tagName : ''}
          {demand.tag.indexOf('品牌') != -1 ? demand.tagName : ''}
          {demand.categoryId == 0 ? demand.tagName : ''}
        </Col>

        <Col span={4}>
          <Button
            style={{ color: 'red' }}
            type="link"
            size="small"
            disabled={unable || packSizeUnable}
            onClick={() => this.deleteRow2(demand)}
            shape="circle"
            icon={<CloseOutlined />}
          />
        </Col>
      </Row>
    ));
    const selectChildren = this.state.selectOption.map(item => {
      return <Option key={item.name}>{item.name}</Option>;
    });
    const seletctTitle = () => {
      return <Button onClick={() => this.chooseAllAd()}>--></Button>;
    };
    const adColumns = [
      {
        title: '媒体',
        dataIndex: 'media',
        width:100
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
        width:100,
        render:(text,record)=>{
          return text+'/CPM'
      }

      },
      {
        title: '素材要求',
        dataIndex: 'sourceRequire',
        render: (text, record) => {
          let source = JSON.parse(text);
          console.log(source,'????');
          let str = '';
          source.forEach(item => {
            console.log(item.type==1)
            if (item.type == 0) {
              console.log(item.amount,'item.amount')
              str += '图片 ' + item.size + '*'+item.amount + '  ';
            }
            if (item.type == 1) {
              str += '视频 ' + item.size + '*'+item.amount + '  ';
              console.log(str,'str呢')
            }
            if (item.type == 2) {
              str += 'ICON ' + item.size + '*'+item.amount + '  ';
            }
          });
          console.log(str,'????');

          return str;
        },
        width:200

      },

      {
        title: seletctTitle,
        key: 'action',
        render: (text, record) => <Button onClick={() => this.chooseAd(record)}>-></Button>,
        width:100

      },
    ];
    const kongbai=()=>{
      return (<div style={{height:'32px'}}>　</div>)
    }
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
        width:100,
        render:(text,record)=>{
          return text+'/CPM'
      }

      },
      {
        title: '素材要求',
        dataIndex: 'sourceRequire',
        render: (text, record) => {
          let source = JSON.parse(text);
          console.log(source);
          let str = '';
          source.forEach(item => {
            if (item.type == 0) {
              str += '图片 ' + item.size + '*'+item.amount + '  ';
            }
            if (item.type == 1) {
              str += '视频 ' + item.size + '*'+item.amount + '  ';
            }
            if (item.type ==2) {
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
        <Card
          title={cardTitle}
          className={styles.cardCenter + ' ' + styles.addadv}
          style={{ width: 900 }}
        >
          <Form
            initialValues={{
              finalLaunchType: '0',
              payType: '1',
              launchDateType: '0',
              launchTimeType: '0',
              adType: [],
            }}
            name="edit"
            {...Formlayout}
            ref={this.formRef}
            onFinish={this.onFinish}
            className="validator"
          >
            <h3>基本信息</h3>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="广告名称"
                  rules={[
                    { validator: nameValidator },
                    { required: true, message: '请输入计划名称' },
                  ]}
                >
                  <Input placeholder="请输入计划名称" disabled={unable} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="planId"
                  label="所属计划"
                  rules={[{ required: true, message: '请选择所属计划' }]}
                >
                  <Select disabled={unable} style={{ width: 200 }} placeholder="请选择广告计划">
                    {planList.map(ele => {
                      return (
                        <Option key={ele.id} value={ele.id}>
                          {ele.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {this.props.match.params.id != -1 && (
              <Row>
                <Col span={12}>
                  <Form.Item name="plan" label="开启状态" rules={[]}>
                    <Switch
                      checkedChildren="启用"
                      unCheckedChildren="暂停"
                      disabled={unable}
                      checked={editSwitch}
                      onClick={value => this.changeEditSwitch(value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="remember" label="完成状态" rules={[]}>
                    <Checkbox
                      disabled={unable}
                      checked={completeChecked}
                      onChange={this.onCheckboxChange.bind(this)}
                    >
                      设置为已完成
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <h3>投放信息</h3>
            <Row>
              <Col span={6}>
                <Form.Item
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  name="launchDateType"
                  label="投放日期"
                  rules={[]}
                >
                  <Select
                    disabled={unable}
                    onChange={this.handleChange.bind(this)}
                    style={{ width: 130 }}
                  >
                    <Option value="0">从今日起长期</Option>
                    <Option value="1">指定日期段</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ paddingLeft: '24px' }}>
                {this.state.launchDateType == 1 ? (
                  <Form.Item
                    name="launchDateTime"
                    disabled={unable}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    label=""
                    rules={[{ required: true, message: '请选择投放日期' }]}
                  >
                    <DatePicker.RangePicker
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                    ></DatePicker.RangePicker>
                  </Form.Item>
                ) : (
                  ''
                )}
              </Col>
              <Col span={6}>
                <Form.Item
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  name="launchTimeType"
                  label="投放时段"
                  rules={[]}
                >
                  <Select
                    disabled={unable}
                    onChange={this.handleChange2.bind(this)}
                    style={{ width: 100 }}
                  >
                    <Option value="0">不限</Option>
                    <Option value="1">指定时间</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5} style={{}}>
                {this.state.launchTimeType == 1 ? (
                  <Form.Item
                    name="launchTimeTime"
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    disabled={unable}
                    label=""
                    rules={[{ required: true, message: '请选择投放时段' }]}
                  >
                    <TimePicker.RangePicker></TimePicker.RangePicker>
                  </Form.Item>
                ) : (
                  ''
                )}
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ position: 'relative' }}>
                <Form.Item
                  name="payType"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 8 }}
                  label="出价"
                  rules={[
                    { validator: butgetValidator },
                    { required: true, message: '请选择出价' },
                  ]}
                >
                  <Select disabled={unable} style={{ width: 120 }}>
                    {/* <Option value="0">CPC</Option> */}
                    <Option value="1">CPM</Option>
                    {/* <Option value="2">CPA</Option> */}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="bidPrice"
                  style={{ position: 'absolute', left: 230, top: 0 }}
                  label=""
                  rules={[
                    { validator: butgetValidator },
                    { required: true, message: '请输入出价' },
                  ]}
                >
                  <Input
                    style={{ width: '200px' }}
                    disabled={unable}
                    placeholder="请输入出价"
                    suffix="元"
                  />
                </Form.Item>
              </Col>
            </Row>
            <h3>落地信息</h3>
            <Row>
              <Col span={24} style={{ position: 'relative' }}>
                <Form.Item
                  name="finalLaunchType"
                  label="落地方式"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 8 }}
                  rules={[]}
                >
                  <Select
                    disabled={unable}
                    onChange={this.finalLaChange.bind(this)}
                    style={{ width: 120 }}
                  >
                    <Option value="0">WEB打开</Option>
                    <Option value="1">下载</Option>
                    <Option value="2">DEEPLINK</Option>
                  </Select>
                </Form.Item>
                {this.state.finalLaunchType == '2' && (
                  <Form.Item
                    name="deeplinkUrl"
                    style={{ position: 'absolute', left: 230, top: 0 }}
                    label="DEEPLINK地址"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 8 }}
                    rules={[{ required: true, message: '请输入DEEPLINK地址' }]}
                  >
                    <Input
                      style={{ width: '356px' }}
                      disabled={unable}
                      placeholder="请输入DEEPLINK地址"
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="finalLaunchUrl"
                  labelCol={{ span: 3 }}
                  label="落地页地址"
                  rules={[{ required: true, message: '请输入落地页地址' }]}
                >
                  <Input disabled={unable} placeholder="请输入落地页地址" />
                </Form.Item>
              </Col>
            </Row>
            <h3>广告位</h3>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 3 }}
                  name="adType"
                  label="广告位"
                  rules={[{ validator:this.adPositionValidator }]}
                >
                  {/* <Checkbox.Group
                    style={{ width: '552px' }}
                    disabled={unable}
                    options={plainOptions}
                  /> */}
                  {this.state.cAdData.length == 0 && (
                    <Button type="link" onClick={this.openAdPlace}>
                      广告位管理
                    </Button>
                  )}
                  {this.state.cAdData.length != 0 && (
                    <div>
                      共选择{' '}
                      <Button type="link" onClick={this.openAdPlace}>
                        {this.state.cAdData.length}
                      </Button>
                      个广告位
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <h3>用户定向</h3>
            <Tabs
              onChange={this.callback}
              activeKey={this.state.tabKey}
              type="card"
              className={styles.flexflex}
            >
              <TabPane tab="新建定向" key="1">
                <Card>
                  <Button
                    type="link"
                    onClick={this.newDirectChange.bind(this)}
                    size="small"
                    disabled={unable || packSizeUnable}
                  >
                    从已有广告中复制
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      var obj = this.formRef.current.getFieldsValue();
                      obj.cAdData = this.state.cAdData;
                      router.push({
                        pathname: '/advManage/chooseTag',

                        cId: this.props.match.params.id,
                        obj: JSON.stringify(obj, null, 2),
                      });
                    }}
                    disabled={unable || packSizeUnable}
                  >
                    自选标签
                  </Button>
                  {this.state.yygg && (
                    <Form.Item name="yygg" labelCol={{ span: 3 }} label="已有广告" rules={[]}>
                      <Select
                        style={{ width: 230 }}
                        onChange={this.yygg.bind(this)}
                        placeholder="请选择已有广告"
                        disabled={unable || packSizeUnable}
                        ref={this.clickButton}
                      >
                        {advList.map(ele => {
                          return (
                            <Option key={ele.id} value={ele.name}>
                              {ele.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  )}
                  <Form.Item
                    name="choosed"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    label="已选标签"
                    rules={[{ validator: this.chooseTagValidator }]}
                  >
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                      {/* <Col span={4}>{selectedTags.length>0&&<span>且</span>} </Col> */}

                      <Col span={20}>{listItems}</Col>
                    </Row>
                  </Form.Item>
                </Card>
              </TabPane>
              <TabPane tab="选择已有人群包" key="2">
                <Card>
                  <Form.Item name="yyrqb" labelCol={{ span: 3 }} label="已有人群包" rules={[]}>
                    <Select
                      style={{ width: 230 }}
                      placeholder="请选择已有人群包"
                      onChange={this.directChange.bind(this)}
                      disabled={unable || packSizeUnable}
                    >
                      {directList.map((ele, i) => {
                        return (
                          <Option key={ele.name} value={ele.name}>
                            {ele.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="choosed2"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    label="已选标签"
                    rules={[{ validator: this.chooseTagValidator2 }]}
                  >
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                      {/* <Col span={4}>{selectedTags.length>0&&<span>且</span>} </Col> */}

                      <Col span={20}>{listItemsCrowd}</Col>
                    </Row>
                  </Form.Item>
                  <Button
                    type="link"
                    onClick={() => {
                      this.copyToAdd();
                    }}
                    size="small"
                    disabled={unable || packSizeUnable}
                  >
                    复制当前已选标签至新建
                  </Button>
                </Card>
              </TabPane>
            </Tabs>
            <h3 style={{ marginTop: '10px' }}>广告监测</h3>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="impTracking"
                  labelCol={{ span: 3 }}
                  label="展示监测地址"
                  rules={[]}
                >
                  <Input disabled={unable} placeholder="请输入URL" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="clickTracking"
                  labelCol={{ span: 3 }}
                  label="点击监测地址"
                  rules={[]}
                >
                  <Input disabled={unable} placeholder="请输入URL" />
                </Form.Item>
              </Col>
            </Row>
            <div className={styles.makeCenter}>
              {this.props.match.params.id != -1 && (
                <Button
                  size="large"
                  type="primary"
                  className={styles.rightFive}
                  onClick={() => this.saveClose()}
                >
                  保存
                </Button>
              )}
              {this.props.match.params.id == -1 && (
                <div>
                  <Button
                    size="large"
                    type="primary"
                    className={styles.rightFive}
                    htmlType="submit"
                  >
                    保存并新建创意
                  </Button>
                  <Button
                    size="large"
                    className={styles.rightFive}
                    onClick={() => this.saveClose()}
                  >
                    保存并关闭
                  </Button>
                </div>
              )}
            </div>
          </Form>
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
                    this.setState({
                      adPlace: false,
                      basePriceMax: '',
                      basePriceMin: '',
                      mediaValue: [],
                      adData: [],
                      group1: [],
                      group2: [],
                    });
                  }}
                  type="danger"
                >
                  关闭
                </Button>
              </div>,
            ]}
          >
            <Form initialValues={{ tfpt: '1' }}>
              <Form.Item name="tfpt" labelCol={{ md: 2,xxl:1 }} label="投放平台" rules={[]}>
                <div>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    value={this.state.group1}
                    onChange={this.onCheckGorupChange}
                  >
                    <Checkbox value="1">IOS 平台</Checkbox>
                    <Checkbox value="2">安卓平台</Checkbox>
                  </Checkbox.Group>
                </div>
              </Form.Item>

              <Form.Item name="ff" labelCol={{ md: 2,xxl:1 }} label="广告类型" rules={[]}>
                <div>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    value={this.state.group2}
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
                  <Form.Item name="media" labelCol={{ md: 6,xxl:4 }} label="媒体" rules={[]}>
                    <div>
                      {' '}
                      <Select
                        mode="multiple"
                        style={{ width: '250px' }}
                        placeholder=""
                        onChange={this.mediaHandleChange}
                        value={this.state.mediaValue}
                        onSearch={this.handleSearch}
                        showSearch
                        filterOption={false}
                      >
                        {selectChildren}
                      </Select>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="tfpt" labelCol={{ span: 4 }} label="建议出价" rules={[]}>
                    <div>
                      <Input
                        style={{ width: '50px', marginRight: '5px' }}
                        value={this.state.basePriceMin}
                        onChange={this.basePriceMinchange.bind(this)}
                        />
                      --
                      <Input
                        style={{ width: '50px', marginLeft: '5px' }}
                        value={this.state.basePriceMax}
                        onChange={this.basePriceMaxchange.bind(this)}
                        />
                      　{' '}
                      <Button className="greenButton" onClick={this.searchAdList.bind(this)}>
                        查询
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ padding: '20px 20px' }}>
                <Col span={12} >
                  <h3>广告位列表</h3>
                  <Table
                    columns={adColumns}
                    loading={this.state.adLoading}
                    scroll={{ x: 600 }}
                    dataSource={adData}
                    style={{ marginRight: '20px' }}
                  />
                </Col>

                <Col span={12}>
                  <Row>
                    <Col span={12}>
                      已选中 <span style={{ color: 'red' }}>{this.state.cAdData.length}</span>{' '}
                      个广告位
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Button onClick={() => this.deleteAll()}>清空</Button>
                    </Col>
                  </Row>
                  <Table columns={cAdColumns} scroll={{ x: 600 }} dataSource={cAdData} />
                </Col>
              </Row>
            </Form>
          </Modal>
        </Card>
        ,
      </div>
    );
  }
}
export default advForm;
