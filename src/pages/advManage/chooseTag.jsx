import React from 'react';
import {  areaPredictNum, addDsdemand, dsproductkeyword } from '@/services/demand';
import { getDstag} from '@/services/adplan';
import router from 'umi/router';
            import { CloseOutlined } from '@ant-design/icons';
            import {putDirectionalinfo,addDirectionalinfo} from '@/services/directionalInfo'
import {
  Table,
  TreeSelect,
  Radio,
  Layout,
  Upload,
  Row,
  Col,
  Card,
  Drawer,
  Form,
  Select,
  Modal,
  Button,
  Tree,
  Input,
  Spin,
  message,
} from 'antd';
import style from './vStyle.less';
import { connect } from 'dva';
const { Option } = Select;
import area from '@/utils/area';
const { TreeNode } = Tree;
const { Search, TextArea } = Input;
const x = 3;
const y = 2;
const z = 1;
const gData = [];
const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

var areaSelect = area.options.map((item, a) => {
  const newObj = {
    title: item.label,
    value: item.label,
    pinyin: item.pinyin,
    key: 0 + '-' + a,
  };
  if (item.children.length != 0) {
    newObj.children = [].concat(
      item.children.map((tag, b) => {
        return {
          title: tag.label,
          value: tag.value,
          pinyin: tag.pinyin,
          key: 0 + '-' + a + '-' + b,
        };
      }),
    );
  }
  return newObj;
});
console.log(areaSelect, 'areaSelect');
function DisplayRow(props) {
  const name = props.name;
  if (name == '地理位置') {
    return (
      <span>
        {name}包含{props.area}
      </span>
    );
  } else {
    return name;
  }
}

@connect(redux => {
  console.log(redux, 'redux');
  return {
    demandData: redux.demand.demandData,
    dstagcategory: redux.demand.dstagcategory,
    selectedTags: redux.demand.selectedTags,
    tagRowNum: redux.demand.tagRowNum,
    areaString: redux.demand.areaString,
    keywordList: redux.demand.keywordList,
    demandSaveOrUpdateDTO: redux.demand.demandSaveOrUpdateDTO,
    selectedTagsCrowd: redux.demand.selectedTagsCrowd,
  };
})
class choseTag extends React.Component {
  constructor(props) {
    super(props);
  }
  formRefA = React.createRef();
  formRefB = React.createRef();
  formRefC = React.createRef();
  formRefD = React.createRef();
  componentWillMount() {
    console.log(this.props, 'prop');
    var dataList = [];
    const { dispatch } = this.props;
    if (this.props.location.query.chooseId) {
      this.setState({
        Sk: [this.props.location.query.chooseId],
      });
      this.initSelectKey(this.props.location.query.chooseId);
    }

    const { dstagcategory } = this.props;

    dispatch({
      type: 'demand/getCategory',
    });
    // }).then(_ => {

    this.generateList2(areaSelect, dataList);
    console.log(dataList, 'dataListdataList');
    this.setState({
      dataList: dataList,
    });

    console.log(dstagcategory, 'dstagcategory');
    if(this.props.location.params){
    var tagIds=this.props.location.params.record.tagIds
    if(tagIds){
      this.props.dispatch({
        type: 'demand/deleteAll'
      });
      
        
        this.props.dispatch({
          type: 'demand/setAll',
          payload: JSON.parse(tagIds),
        });
    }
  }
    // });
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
  componentDidMount() {
    console.log(this.props,'rrrrrrrrrrrrrr');
    // this.formRef.current.setFieldsValue({
    //   areaValue: undefined,
    // });
    if(document.body.clientWidth>1600){
      this.setState({
        textareaHeight:40
      })
    }
  }
  componentDidUpdate() {
    const { dstagcategory } = this.props;
    if (!this.props.location.query.chooseId && this.state.Sk.length == 0) {
      if (dstagcategory.length != 0) {
        if (dstagcategory[0].children.length != 0) {
          if (dstagcategory[0].children[0].children.length != 0) {
            this.setState({
              Sk: [dstagcategory[0].children[0].children[0].id.toString()],
            });
            this.initSelectKey(dstagcategory[0].children[0].children[0].id.toString());
          } else {
            console.log('有吗');
            this.setState({
              Sk: [dstagcategory[0].children[0].id.toString()],
              Sk: [dstagcategory[0].children[0].id.toString()],
            });
            this.initSelectKey(dstagcategory[0].children[0].id.toString());
          }
        } else {
          this.setState({
            Sk: [dstagcategory[0].id.toString()],
          });
          this.initSelectKey(dstagcategory[0].id.toString());
        }
      }
    }
  }
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    dataList: [],
    dataSource: [],
    tagVisible: false,
    areaVisible: false,
    brandVisible:false,
    savePelpleVisible: false,
    areaValue: undefined,
    tableLoading: false,
    selectedRowKeys: [],
    projectVisible: false,
    areaObj: {},
    brandObj:{},
    proObj: {},
    predictNum: 0,
    spinningLoading: false,
    keywordsOpt: [],
    keywordValue: '',
    keywordListArr: [],
    value3: '近30天',
    selectedKeys: [],
    Sk: [],
    addTagVisible: false,
    tagList:[],
    textareaHeight:22
  };
  generateList2 = (data, list) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { title, key, parentId, value } = node;
      list.push({ key, title, parentId: parentId, value });
      if (node.children) {
        this.generateList2(node.children, list);
      }
    }
  };
  formatTypeTree(data, level = 1) {
    return data.map(item => {
      const newData = {
        key: item.id.toString(),
        title: item.name,
        projectId: item.projectId,
        parentId: item.parentId,
        level,
      };

      if (item.childList.length !== 0) {
        newData.children = this.formatTypeTree(item.childList, level + 1);
      } else {
        newData.children = [];
      }

      if (item.userTagList.length !== 0) {
        newData.children = newData.children.concat(
          item.userTagList.map(tag => {
            return {
              key: tag.id.toString(),
              title: tag.name,
              projectId: tag.projectId,
              parentId: item.id,
              /** 这里的 isLeaf 是没有子 */
              isLeaf: true,
              version: tag.version,
            };
          }),
        );
      }

      return newData;
    });
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onSelect = (cloumn, e) => {
    console.log(cloumn, e);
    if(cloumn.length!=0){
      this.setState({
      Sk: cloumn,
    });
    if (!e.node.children) {
      this.setState({
        tableLoading: true,
        selectedRowKeys: [],
      });
      this.initSelectKey(cloumn.toString());
    }
    }
    
  };
  initSelectKey = key => {
    getDstag({
      categoryId: key.toString(),
    }).then(({ data }) => {
      console.log(data, 'datadatadatadatadata');
      var arr = data.map((item, index) => {
        return {
          ...item,
          key: item.id,
        };
      });
      this.setState({
        dataSource: arr,
      });
      this.setState({
        tableLoading: false,
      });
      this.initTable();
    });
  };
  initTable = () => {
    const { selectedTags } = this.props;
    let arr = [];
    console.log(this.state.dataSource,'selectedTagsselectedTagsselectedTags')
    selectedTags.forEach(ele => {
      this.state.dataSource.forEach((item) => {
        if (ele.tag == item.tag) {
          arr.push(item.id);
        }
      });
    });
    console.log(arr,'selectedTagsselectedTagsselectedTags')
    // if(this.state.dataSource.length==1){
    //   console.log('11')
    //   this.setState({
    //     selectedRowKeys: Number(arr.toString()),
    //   },()=>{
    //     console.log(this.state.selectedRowKeys)
    //   });
    // }else{
      this.setState({
      selectedRowKeys: arr,
    // },()=>{
    //   console.log(this.state.selectedRowKeys)
    });
    // }
    
  };
  onSearch = e => {
    // const { value } = e.target;

    const { dstagcategory } = this.props;
    this.setState({
      tableLoading: true,
      selectedRowKeys: [],
    });
    console.log('search', e);
    getDstag({
      tag: e,
    }).then(({ data }) => {
      this.setState({
        tableLoading: false,
      });
      let arr=data.map(item=>({
        ...item,
        key:item.id
      }))
      this.setState({
        dataSource: arr,
      },()=>{
        this.initTable();

      });
      
    });
  };
  showDrawer = name => {
    switch (name) {
      case 'area':
        this.setState({
          areaVisible: true,
        });
        break;
      case 'project':
        this.setState({
          projectVisible: true,
        });

        break;
      case 'tag':
        console.log(33);
        this.setState({
          tagVisible: true,
        });
        break;
    }
  };
  closeTag = () => {
    this.setState({
      tagVisible: false,
    });
    this.initTable();
  };
  onClose = name => {
    const { selectedTags } = this.props;

    switch (name) {
      case 'area':
        let areaIndex = -1;
        let arr = [];
        this.state.dataSource.forEach((item, index) => {
          if (item.tag == '地理位置') {
            areaIndex = index;
          }
        });
        arr = selectedTags.filter(ele => ele != areaIndex);
        this.setState({
          areaVisible: false,
          selectedRowKeys: arr,
        });
        this.initTable();

        break;
        case 'brand':
           let brandIndex = -1;
        let brandarr = [];
        this.state.dataSource.forEach((item, index) => {
          if (item.tag == '地理位置') {
            brandIndex = index;
          }
        });
        brandarr = selectedTags.filter(ele => ele != brandIndex);
        this.setState({
          brandVisible: false,
          selectedRowKeys: brandarr,
        });
        this.initTable();
        this.formRefD.current.resetFields()
      case 'project':
        let projectIndex = -1;
        let projectarr = [];
        this.state.dataSource.forEach((item, index) => {
          if (item.tag == '产品关键词') {
            projectIndex = index;
          }
        });
        projectarr = selectedTags.filter(ele => ele != projectIndex);
        console.log(projectarr, '消失的狗');
        this.setState({
          projectVisible: false,
          selectedRowKeys: projectarr,
          keywordListArr: [],
        });
        this.initTable();
        this.props.dispatch({
          type: 'demand/setKeywordList',
          payload: '',
        });
        // this.props.form.setFieldsValue({
        //   keywordList: '',
        // });
        break;
      case 'tag':
        var tagList = this.props.selectedTags.map(item => {
          console.log(item.tag.indexOf('品牌偏好'))
          console.log(item.tag + item.tagName)
          if (item.tag == '产品关键词' || item.tag == '地理位置'|| item.tag=='品牌偏好-自定义') {
            return {
              predictNum: item.predictNum,
              tagInfo: item.tagInfo || '',
              tagName: item.tag + item.tagName,
              tag:item.tag
            };
          } else {
            return {
              predictNum: item.predictNum,
              tagInfo: item.tagInfo || '',
              tagName: item.tagName,
              tag:item.tag
            };
          }
        });
        this.setState({
          savePelpleVisible : true,
          tagList})
        // var dto = {
        //   ...this.props.demandSaveOrUpdateDTO,
        //   tagList,
        // };
        // if (Object.keys(this.props.demandSaveOrUpdateDTO).length == 0) {
        //   router.push({ pathname: '/addDemand', add: true, tagDto: tagList });
        //   return false;
        // }
        // if (dto.id) {
        //   addDsdemand(dto).then(res => {
        //     if (res.code == 0) {
        //       message.success('修改成功');
        //       router.push({ pathname: '/demandManage', remark: 'update' });
        //     }
        //   });
        // } else {
          // addDsdemand({
          //   tagIds:tagList
          // }).then(res => {
          //   if (res.code == 0) {
          //     message.success('新增成功');

          //     // router.push({ pathname: '/demandManage', remark: 'update' });
          //   }
          // });
        // }
        // this.props.dispatch({
        //   type: 'demand/deleteAll',
        //   payload: '',
        // });
        // this.setState({
        //   tagVisible: false,
        // });
        break;
    }
  };
  onSelectChange = value => {
    console.log(value);
    var arr = value;
    value.forEach((item, index) => {
      areaSelect.forEach(ele => {
        if (item == ele.title) {
          ele.children.forEach(mm => {
            arr.push(mm.value);
          });
        }
      });
    });
    arr = arr.filter(function(current) {
      return !/^[\u4e00-\u9fa5]+$/.test(current);
    });
    arr.forEach((ant, index) => {
      arr[index] = parseInt(arr[index]);
    });
    console.log(arr, 'arrValue');
    this.setState({ areaValue: arr, spinningLoading: true });
    if (arr.length == 0) {
      this.setState({
        predictNum: 0,
        spinningLoading: false,
      });
      return;
    }
    areaPredictNum(arr).then(({ data }) => {
      console.log(data);

      if (data) {
        this.setState({
          predictNum: data,
          spinningLoading: false,
        });
      } else {
        this.setState({
          predictNum: 0,
          spinningLoading: false,
        });
      }
    });
  };
  deleteRow = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demand/deleteSelectTag',
      payload: record,
    });
  };
  setBrand=value=>{
    const { dispatch } = this.props;
    const {  brandObj } = this.state;
    console.log(value)
    var brand=value.brand
    console.log(brand.indexOf('\n'))

    if(brand.indexOf('\n')!=-1){
     brand= brand.replace(/\n/g,'、')
    }
    dispatch({
      type:'demand/setBrand',
      brand
    })
    dispatch({
      type: 'demand/setSelectedTags',
      payload: [brandObj],
    });
    this.setState({
      brandVisible:false
    })
  }
  setArea = area => {
    const { dispatch } = this.props;
    const { areaValue, areaObj } = this.state;
    console.log(this.formRefB, 'formRefBformRefB');
    this.formRefB.current.validateFields(['areaValue']).then(values => {
      console.log(values);

      console.log(areaValue);
      let arr = [];
      this.state.dataList.forEach(ant => [
        areaValue.forEach(hel => {
          if (ant.value == hel) {
            arr.push(ant.title);
          }
        }),
      ]);
      areaObj.predictNum = this.state.predictNum;
      dispatch({
        type: 'demand/setAreaString',
        payload: arr.join('、'),
      });

      dispatch({
        type: 'demand/setSelectedTags',
        payload: [areaObj],
      });

      this.setState({
        areaVisible: false,
      });
    });
  };
  setProject = () => {
    const { dispatch } = this.props;
    const { proObj } = this.state;

    this.formRefC.current.validateFields(['keywordList']).then(values => {
      dispatch({
        type: 'demand/setSelectedTags',
        payload: [proObj],
      });

      this.setState({
        projectVisible: false,
      });
    });
  };
  addKeyword = () => {
    let keyword = this.state.keywordValue;
    const { dispatch } = this.props;
    this.setState({
      keywordValue: '',
    });
    if (keyword) {
      this.state.keywordListArr.push(keyword);
      let arr = Array.from(new Set(this.state.keywordListArr));
      var keywordList = arr.join('\n');
      var num = 0;
      this.state.keywordsOpt.forEach(item => {
        arr.forEach(ele => {
          if (item.keyword == ele) {
            num += item.predictNum;
          }
        });
      });
      this.setState({
        keywordListArr: arr,
      });

      console.log(num, 'numnum');
      dispatch({
        type: 'demand/setKeywordList',
        payload: keywordList,
      });
      dispatch({
        type: 'demand/setKeywordNum',
        payload: num,
      });
    }
  };
  onTextAreaChange = value => {};
  handleSelect = value => {
    console.log(value); // { key: "lucy", label: "Lucy (101)" }
    this.setState({
      keywordValue: value,
    });
  };
  handleSearch = value => {
    if (value) {
      this.setState({
        keywordValue: value,
      });
    }
  };
  onChange3 = value => {
    console.log(value.target.value);
    this.setState({
      value3: value.target.value,
    });
    this.props.dispatch({
      type: 'demand/settagInfo',
      payload: value.target.value,
    });
  };
  showModal = () => {
    this.setState({
      addTagVisible: true,
    });
  };
  handleOk = e => {
    console.log(e);
    this.formRefA.current.validateFields(['custom']).then(values => {
      console.log(values);
      this.props.dispatch({
        type: 'demand/setSelectedTags',
        payload: [
          {
            tag: values.custom + ' (自定义标签)',
            predictNum: 0,
          },
        ],
      });
    });
    this.setState({
      addTagVisible: false,
    });
  };
  handleSaveOk = e => {
    console.log('ok',e);
    
    this.setState({
      savePelpleVisible : false})
  };
  handleSaveCancel = e => {
    this.setState({
      savePelpleVisible : false})
    console.log('handleSaveCancel');
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      addTagVisible: false,
    });
  };
  clearProvince = () => {
    this.formRefB.current.setFieldsValue({
      areaValue: undefined,
    });
    this.onSelectChange([]);
  };
  removeKeyword = keyword => {
    console.log(keyword);
    var arr = this.state.keywordListArr;
    arr = arr.filter(item => item != keyword);
    this.setState({
      keywordListArr: arr,
    });
  };
  getTagList() {
    var tagList;
    
      tagList = this.props.selectedTags.map(item => {
        if (item.tag == '产品关键词' || item.tag == '地理位置'||  item.tag=='品牌偏好-自定义') {
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
    
    return tagList;
  }
  addDirectionalinfo= values => {
    addDirectionalinfo({
      ...values,
      tagIds: JSON.stringify(this.getTagList()),
      type:0
    }).then(res=>{
      console.log(res)
      if(res.code==0){
        message.success(res.data)
      router.push('/dierctManage/crowdPackage')
    }else{
        message.warning(res.msg)
      }
    })

          // console.log(values)
  }
  onFinish = values => {
    console.log('Finish:', values);
    addDsdemand({
      tagIds:JSON.stringify(this.state.tagList),
      name:values.peopleName
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        message.success(res.data);

        router.push({ pathname: '/advManage/advManage', remark: 'update' });
      }else{
        message.warning(res.msg)
      }
    });
  };
  putDirectionalinfo=()=>{
    var tagList = this.props.selectedTags.map(item => {
      if (item.tag == '产品关键词' || item.tag == '地理位置'|| item.tag == '品牌偏好-自定义') {
        return {
          predictNum: item.predictNum,
          tagInfo: item.tagInfo || '',
          tagName: item.tag + item.tagName,
          tag:item.tag
        };
      } else {
        return {
          predictNum: item.predictNum,
          tagInfo: item.tagInfo || '',
          tagName: item.tagName,
          tag:item.tag
        };
      }
    });
    putDirectionalinfo({
      tagIds:JSON.stringify(tagList),
      id:this.props.location.params.record.id
    }).then(res=>{
      console.log(res,'putDirectionalinfo')
      if(res.code==0){
        message.success("编辑成功")
      }else{
        message.warning(res.msg)
      }
      router.push('/dierctManage/crowdPackage')
    })
  }
  render() {
    const { dstagcategory, selectedTags, selectedTagsCrowd, areaString } = this.props;
    const {
      selectedRowKeys,
      tableLoading,
      areaValue,
      dataSource,
      searchValue,
      expandedKeys,
      autoExpandParent,
      predictNum,
      spinningLoading,
      selectedKeys,
      Sk,
    } = this.state;
    const columns = [
      {
        title: <b>标签</b>,
        dataIndex: 'tag',
        key: 'tag',
      },
      {
        title: <b>描述</b>,
        dataIndex: 'remark',
        key: 'remark',
      },
      // {
      //   title: <b>预估人数</b>,
      //   dataIndex: 'predictNum',
      //   key: 'predictNum',
      //   render: text => {
      //     if (text == -1) {
      //       return '';
      //     } else {
      //       return text;
      //     }
      //   },
      // },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        const { dispatch } = this.props;
        console.log(
          `selectedRowKeys:`,
          'selectedRows: ',
          record,
          selected,
          selectedRows,
          nativeEvent,
          window.event.clientX,
          window.event.clientY,
        );
        delete record.tagName
        console.log(document.getElementById('selected').getBoundingClientRect());
        if (selected) {
          const arriveX = document.getElementById('selected').getBoundingClientRect().x + 35 + 'px';
          const arriveY = document.getElementById('selected').getBoundingClientRect().y + 35 + 'px';
          var nowX = window.event.clientX - 5 + 'px';
          var nowY = window.event.clientY - 5 + 'px';
          let ele = document.createElement('div');
          ele.className = 'redBall';
          ele.style.top = nowY;
          ele.style.left = nowX;
          document.styleSheets[0].insertRule(
            `@keyframes hor-animation {from {left: ${nowX}} to {left: ${arriveX}}}`,
            0,
          );
          document.styleSheets[0].insertRule(
            `@keyframes ver-animation {from {top: ${nowY}} to {top:  ${arriveY}}}`,
            0,
          );
          document.querySelector('.ant-card-body').appendChild(ele);
          setTimeout(function() {
            document.styleSheets[0].deleteRule(
              `@keyframes hor-animation {from {left: ${nowX}} to {left: ${arriveX}}}`,
              0,
            );
            document.styleSheets[0].deleteRule(
              `@keyframes ver-animation {from {top: ${nowY}} to {top:  ${arriveY}}}`,
              0,
            );
            document.querySelector('.ant-card-body').removeChild(ele);
          }, 300);
          if (record.tag == '地理位置') {
            this.setState({
              areaVisible: true,
              areaObj: record,
            });
          }else if (record.tag == '品牌偏好-自定义') {
            this.setState({
              brandVisible: true,
              brandObj:record
            });
          }
          else if (record.tag == '产品关键词') {
            this.setState({
              projectVisible: true,
              proObj: record,
            });
            dsproductkeyword({}).then(({ data }) => {
              console.log(data);
              this.setState({
                keywordsOpt: data,
              });
            });
          } else {
            selectedRows.forEach(ant => {
              console.log(ant,'ant')
              if (ant.predictNum == -1) {
                ant.predictNum = null;
              }
            });

            dispatch({
              type: 'demand/setSelectedTags',
              payload: selectedRows,
            });
          }
        } else {
          dispatch({
            type: 'demand/deleteSelectTag',
            payload: record,
          });
        }
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const options = this.state.keywordsOpt.map(d => (
      <Option key={d.id} value={d.keyword}>
        {d.keyword}
      </Option>
    ));
    const listItems = selectedTags.map(demand => (
      <Row key={demand.tag}>
        <Col style={{ lineHeight: '24px' }} span={12}>
          {/* <DisplayRow name={demand.tag} area={areaString}></DisplayRow> */}
          <b>{demand.tag}</b>
          {demand.tag == '地理位置' ? demand.tagName : ''}
          {demand.tag == '产品关键词' ? demand.tagName : ''}
          {demand.tag.indexOf('品牌') != -1 ? demand.tagName : ''}
          {demand.categoryId == 0 ? demand.tagName : ''}
        </Col>
        <Col style={{ lineHeight: '24px' }} span={7} offset={1}>
          {/* {demand.predictNum} */}
        </Col>
        <Col span={4}>
          <Button
            style={{ color: 'red' }}
            type="link"
            size="small"
            onClick={() => this.deleteRow(demand)}
            shape="circle"
            icon={<CloseOutlined />}
          />
        </Col>
      </Row>
    ));

    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });

    return (
      <Card>
        <Row>
          <Col span={5}>
            <Search
              style={{ marginBottom: 8 }}
              placeholder="请输入标签名称"
              onSearch={this.onSearch}
            />
            {Sk.length != 0 && (
              <Tree
                // onExpand={this.onExpand}
                // expandedKeys={expandedKeys}
                // autoExpandParent={autoExpandParent}
                onSelect={this.onSelect}
                defaultSelectedKeys={this.state.selectedKeys}
                defaultExpandAll={true}
                height={503}
                selectedKeys={this.state.Sk}
                // autoExpandParent={true}
              >
                {loop(dstagcategory)}
              </Tree>
            )}
          </Col>
          <Col span={18} offset={1} className={style.noAllCheck}>
           
            <Table
              loading={tableLoading}
              rowSelection={rowSelection}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              scroll={{y:480}}
            />
            <div style={{textAlign:'center',marginTop:'10px'}}>
           {!this.props.location.params && <div><Button
              type="primary"
              onClick={()=>{
                router.push({pathname:'/form/addAdv/'+this.props.location.cId,
              obj:this.props.location.obj})
              }}
            >
              确认选择
            </Button>
            <Button style={{marginLeft:'5px'}} key="back" onClick={()=>{
                router.push({pathname:'/form/addAdv/'+this.props.location.cId,
                obj:this.props.location.obj})
                
                }}>
                取消
              </Button></div> 
            
            }
            {this.props.location.params&&!this.props.location.params.add && <div><Button
              type="primary"
              onClick={()=>{
                this.putDirectionalinfo()
              }}
            >
              保存
            </Button>
            <Button style={{marginLeft:'5px'}} key="back" onClick={()=>{
              router.push({pathname:'/dierctManage/crowdPackage'})
              
              }}>
              取消
            </Button></div>}
            </div>
          </Col>
        </Row>
        <Modal
          visible={this.state.addTagVisible}
          onOk={this.handleOk}
          okText="保存"
          closable={false}
          width={400}
          cancelText="关闭"
          footer={[
            <Button
              style={{ textAlign: 'center' }}
              key="submit"
              type="primary"
              onClick={this.handleOk}
            >
              保存
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              关闭
            </Button>,
          ]}
          onCancel={this.handleCancel}
        >
          <h2 style={{ textAlign: 'center', fontWeight: 700 }}>添加自定义标签</h2>
          <Form
            layout="inline"
            ref={this.formRefA}
            initialValues={{ custom: '' }}
            name="tag"
            onFinish={this.onFinish}
          >
            <Form.Item label="标签名称" name="custom">
              <Input style={{ width: '240px' }} />
            </Form.Item>
          </Form>
        </Modal>
        <div id="selected" className={style.selected} onClick={() => this.showDrawer('tag')}>
          已选标签
          <span style={{ color: 'red' }}>{selectedTags.length + ' '}</span>个
        </div>
        <div className={style.redBall}></div>

        <Drawer
          title="已选标签"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.tagVisible}
        >
          <Row className={style.selectedL}>
            <Col span={4}></Col>

            <Col span={10}>
              <b>标签名称</b>
            </Col>
            {/* <Col offset={1} span={9}>
              <b>预估人数</b>
            </Col> */}
          </Row>
          <Row style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            {/* <Col span={4}>{selectedTags.length>0&&<span>且</span>} </Col> */}
            <Col span={4}></Col>
            <Col span={20}>{listItems}</Col>
          </Row>
          <div className={style.selectedB}>
            <Row>
              <Col span={14}>
                {/* <b>预估人数</b>
                <div>{tagRowNum}人</div> */}
              </Col>
              {this.props.location.params && <Col span={10}>
               <Button type="primary" onClick={() => this.onClose('tag')}>
                  保存为人群包
                </Button>

               
                <Button type="link" onClick={() => this.closeTag()}>
                  关闭
                </Button>
              </Col> }
             {!this.props.location.params &&  <Col span={4} offset={6}>
              <Button type="link" onClick={() => this.closeTag()}>
                  关闭
                  </Button>
              </Col> }
            </Row>
          </div>
          <Modal
            visible={this.state.savePelpleVisible}
            okText="保存"
            closable={false}
            width={400}
            cancelText="关闭"
            footer={null}
            onCancel={this.handleSaveCancel}
          >
            
            <Form
              layout="inline"
              ref={this.formRefA}
              initialValues={{ custom: '' }}
              name="tag"
              onFinish={this.addDirectionalinfo}
              
            >
              <Form.Item label="人群包名称" name="name">
                <Input style={{ width: '240px' }} />
              </Form.Item>
              <div style={{ width:'150px',margin:'0 auto' }}><Button
                
                key="submit"
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>,
              <Button key="back" onClick={this.handleSaveCancel}>
                关闭
              </Button></div>
              
            
            </Form>
          </Modal>
        </Drawer>
        <Drawer
          title="品牌偏好-自定义"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.brandVisible}
          className="brand"
        >
          <Form labelAlign="right" onFinish={this.setBrand.bind(this)} ref={this.formRefD} name="formRefD">
            <Form.Item
              key={1}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label=""
              name="brand"
              className={style.flexflex}
              rules={[{ required: true, message: '请填写品牌' }]}
            >
          <textarea  cols="70" style={{margin:'40px 20px 0px'}} rows={this.state.textareaHeight}></textarea>

            </Form.Item>
          
          <div className={style.selectedB}>
            <Row justify="center" type="flex">
              <Col span={10}>
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  htmlType="submit"
                  // onClick={() => this.setBrand()}
                >
                  确认
                </Button>
                <Button onClick={() => this.onClose('brand')}>返回</Button>
              </Col>
            </Row>
          </div>
          </Form>
        </Drawer>
        <Drawer
          title="地理位置"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.areaVisible}
          className="drawer"
        >
          <Form labelAlign="right" ref={this.formRefB} name="formRefB">
            <Form.Item
              key={1}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="包含省份/城市"
              name="areaValue"
              className={style.flexflex}
              rules={[{ required: true, message: '请选择省份' }]}
            >
              <TreeSelect
                style={{ width: '260px' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={areaSelect}
                placeholder="支持中文搜索"
                multiple
                maxTagCount={4}
                showCheckedStrategy="SHOW_PARENT"
                showSearch={true}
                treeCheckable
                onChange={this.onSelectChange}
              />
            </Form.Item>
            <Button
              onClick={() => this.clearProvince()}
              style={{ position: 'absolute', right: '4px', top: '58px' }}
            >
              清除条件
            </Button>
            {/* <Form.Item
              key={2}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="预估人数"
            >
              {spinningLoading && <Spin size="small"></Spin>}
              {!spinningLoading && (
                <span>
                  <span style={{ color: 'red' }}>{predictNum + ' '}</span>
                  <span>人</span>
                </span>
              )}
            </Form.Item> */}
          </Form>
          <div className={style.selectedB}>
            <Row justify="center" type="flex">
              <Col span={10}>
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  onClick={() => this.setArea()}
                >
                  确认选择
                </Button>
                <Button onClick={() => this.onClose('area')}>返回</Button>
              </Col>
            </Row>
          </div>
        </Drawer>
        <Drawer
          title="产品关键词"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.projectVisible}
        >
          <Form labelAlign="right" ref={this.formRefC} name="formRefC" onFinish={this.onFinish}>
            <Form.Item
              key={1}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="时间范围"
            >
              <Radio.Group value={this.state.value3} onChange={this.onChange3} buttonStyle="solid">
                <Radio.Button value="近30天">近30天</Radio.Button>
                <Radio.Button value="近60天">近60天</Radio.Button>
                <Radio.Button value="近90天">近90天</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              key={2}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="搜索关键词"
              name="s"
            >
              <div style={{display:'flex'}}>
                <Select
                  value={this.state.keywordValue}
                  onSelect={this.handleSelect.bind(this)}
                  style={{ width: 160 }}
                  // showSearch
                  // onSearch={this.handleSearch}
                >
                  {options}
                </Select>
                <Button type="primary" onClick={() => this.addKeyword()}>
                  添加
                </Button>
              </div>
              
            </Form.Item>
            <Form.Item
              key={3}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="产品关键词列表"
              style={{ position: 'relative' }}
            >
              {this.state.keywordListArr.length == 0 && '--'}
              {this.state.keywordListArr.map(ele => {
                return (
                  <div key={ele} style={{lineHeight:'40px'}}>
                    {ele}
                    <Button
                      style={{ color: 'red',position:'absolute',left:'200px' }}
                      type="link"
                      size="small"
                      onClick={() => this.removeKeyword(ele)}
                      shape="circle"
                      icon={<CloseOutlined />}
                    />
                  </div>
                );
              })}
            </Form.Item>
            <Form.Item
              key={3}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="产品关键词个数："
              style={{ position: 'relative' }}
            >
              <div>
                <b style={{ color: 'red' }}>{this.state.keywordListArr.length}</b>
              </div>
            </Form.Item>
          </Form>
          <div className={style.selectedB}>
            <Row justify="center" type="flex">
              <Col span={10}>
                <Button
                  type="primary"
                  style={{ marginRight: '10px' }}
                  onClick={() => this.setProject()}
                >
                  确认选择
                </Button>
                <Button onClick={() => this.onClose('project')}>返回</Button>
              </Col>
            </Row>
          </div>
        </Drawer>
      </Card>
    );
  }
}
export default choseTag;
