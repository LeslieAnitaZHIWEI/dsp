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
  Checkbox,
  Tree,
  Cascader,
  Select,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './style.less';
import {
  getAdMedia,
  getListSource,
  getAdindustrycategory,
  addAdmedia,
  editAdmedia,
  deleteAdmediaById,
  getAdmediaById,
} from '@/services/mediaManage';
import {
  addAdposition,
  getAdposition,
  editAdposition,
  getAdpositionById,
  deleteAdposition,
  hasPuttingAd
} from '@/services/adplan';
const butgetValidator = (rule, value) => {
  
    var reg = /^[0-9]\d*$/;
    if (reg.test(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject('只支持整数');
    }
  
};
const limit5MValidator = (rule, value) => {
  
  if ((value)<=5*1024) {
    return Promise.resolve();
  } else {
    return Promise.reject('不能大于5MB');
  }

};
const numberValidator=(rule,value)=>{
  var reg = /^\d+$|^\d+\.\d+$/g
  if (reg.test(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject('只支持数字');
  }
}
const { Search } = Input;
import { ideaList } from '@/utils/dictionaries';
import { budgetTypeList } from '@/utils/dictionaries';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const x = 3;
const y = 2;
const z = 1;
const gData = [];
function displayRender(label) {
  return label[label.length - 1];
}
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

const dataList = [];

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

//可编辑
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
        <div>
          {dataIndex == 'size' && (
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
          )}
          {dataIndex == 'duration' && (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[]}
            >
              {inputNode}
            </Form.Item>
          )}
          {dataIndex =='fileSize' && (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[{ validator:butgetValidator },
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
                {
                  validator:limit5MValidator
                }
              ]}
            >
              {inputNode}
            </Form.Item>
          )}
          { dataIndex =='amount' && (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[{ validator:butgetValidator },
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
              ]}
            >
              {inputNode}
            </Form.Item>
          )}
          
          {dataIndex == 'type' && (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[
                {
                  required: true,
                  message: `请选择 ${title}!`,
                },
              ]}
            >
              <Select style={{ width: 105 }}>
                <Option key={0} value={0}>
                  图片
                </Option>
                <Option key={1} value={1}>
                  视频
                </Option>
                <Option key={2} value={2}>
                  ICON
                </Option>
              </Select>
            </Form.Item>
          )}
          {dataIndex == 'fileType' && (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[
                {
                  required: true,
                  message: `请选择 ${title}!`,
                },
              ]}
            >
              <Select style={{ width: 90 }} mode="multiple">
                <Option key={0} value={'jpg'}>
                  JPG
                </Option>
                <Option key={1} value={'png'}>
                  PNG
                </Option>
                <Option key={2} value={'gif'}>
                  GIF
                </Option>
                <Option key={3} value={'mp4'}>
                  MP4
                </Option>
              </Select>
            </Form.Item>
          )}
        </div>
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
        title: '媒体',
        dataIndex: 'media',
      },

      {
        title: '平台',
        dataIndex: 'platform',
        render(text, record) {
          if (text == 1) {
            return 'IOS';
          } else {
            return '安卓';
          }
        },
      },

      {
        title: '广告位名称',
        dataIndex: 'name',
      },

      {
        title: '广告类型',
        dataIndex: 'adPositionType',
        render(text, record) {
          return ideaList[text];
        },
      },

      {
        title: '底价',
        dataIndex: 'basePrice',
        render(text, record) {
          return 'CPM ' + text.toFixed(2);
        },
      },

      {
        title: '素材要求',
        dataIndex: 'sourceRequire',
        render: (text, record) => {
          let source = JSON.parse(text);

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
      },

      {
        title: '操作',
        dataIndex: 'key',
        render: (value, row, index) => {
          const obj = {
            children: (
              <div style={{ width: '130px' }}>
                <Button onClick={() => this.handleEdit(row)}>编辑</Button>
                <Button type="danger" onClick={() => this.handleDelete(row)}>删除</Button>
              </div>
            ),
            props: {},
          };
          return obj;
        },
        width: 100,
      },
    ];
    this.columns2 = [
      {
        title: '素材类型',
        dataIndex: 'type',
        width: 105,
        editable: true,
        render(text, record) {
          switch (text) {
            case 0:
              return '图片';
            case 1:
              return '视频';
            case 2:
              return 'ICON';
          }
        },
      },
      {
        title: '尺寸',
        dataIndex: 'size',
        width: '15%',
        editable: true,
      },
      {
        title: '数量',
        dataIndex: 'amount',
        editable: true,
        width: 80,
      },
      {
        title: '文件类型',
        dataIndex: 'fileType',
        editable: true,
        width: 120,
        render(text, record) {
          var str = '';
          switch (text) {
            case '0':
              return 'JPG';
            case '1':
              return 'PNG';
            case '2':
              return 'GIF';
            case '3':
              return 'MP4';
            default:
              console.log(text, 'text');
              if (typeof text == 'string') {
                text.split(',').forEach(item => {
                  console.log('!!!!', item);
                  if (item === 0||item =='jpg') {
                    str += 'JPG,';
                  }
                  if (item == 1||item =='png') {
                    str += 'PNG,';
                  }
                  if (item == 2||item =='gif') {
                    str += 'GIF,';
                  }
                  if (item == 3||item =='mp4') {
                    str += 'MP4,';
                  }
                  // return str
                });
                str = str.substr(0, str.length - 1);
              }
              return str;
          }
        },
      },
      {
        title: '大小(K)',
        dataIndex: 'fileSize',
        editable: true,
      },
      {
        title: '视频时长',
        dataIndex: 'duration',
        editable: true,
      },
      {
        title: '管理',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <a
                href="javascript:;"
                onClick={() => this.save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                保存
              </a>
              <a href="javascript:;" onClick={() => this.cancel(record)}>
                取消
              </a>
            </span>
          ) : (
            <span>
 <a disabled={this.state.editingKey !== ''} onClick={() => this.edit(record)}>
              编辑
            </a> {' '}
            <a disabled={this.state.editingKey !== ''} onClick={() => this.deleteSc(record)}>
              删除
            </a>
            </span>
           
          );
        },
        width: 100,
      },
    ];
    this.state = {
      dataSource: [],
      data: [],
      pagination: {
        
        total: 500,
        pageSize: 10,
        current: 1,
        onChange:this.pageOnChange,
        showTotal:this.showTotal
      },
      loading: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      addAdjVis: false,
      addMedVis: false,
      addAdjTitle: '添加广告位',
      addMedTitle: '添加媒体',
      editingKey: '',
      materialData: [],
      category: [],
      dataList: [],
      listSource: [],
      adindustrycategory: [],
      chooseId: '',
      basePriceMax: '',
      basePriceMin: '',
      selectedKeys: [],
      selectOption: [],
      maxCtr: 0,
      minCtr: 0,
      count: 999,
      editJudge: false,
      editId: '',
    };
  }
  formRef = React.createRef();
  formEdit = React.createRef();
  formRefA = React.createRef();
  formRefB = React.createRef();

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
      this.getList();
    };
    this.getList();
    this.getCategory();
    this.getAdMediaList()
    getListSource().then(({ data }) => {
      console.log(data, 'getListSource');
      this.setState({
        listSource: data,
      });
    });
    getAdindustrycategory().then(({ data }) => {
      let adindustrycategory = data.map(item => {
        item.children = item.children.map(ele => {
          return {
            title: ele.title,
            key: ele.key,
            value: ele.value,
          };
        });
        return item;
      });
      this.setState({
        adindustrycategory,
      });
    });
  }
  getAdMediaList=()=>{
    getAdMedia({
      media: '',
    }).then(({ data }) => {
      console.log(data, 'getAdMedia');
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
  }
  pageOnChange=(value)=>{
    console.log(value)
    let {pagination}=this.state
    pagination={
      ...pagination,
      current:value
    }
    this.setState({
      pagination
    },()=>{
      this.getList()
    })
  }
  handleDelete = row => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '请确认是否删除该广告位？广告位已被选中投放推广时，广告位将无法删除',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteAdposition({
          id: row.id,
        }).then(res => {
          if (res.status == 500) {
            res.json().then(res => {
              console.log(res, 'dfsfasd');
              message.error(res.msg);
            });
          } else {
            message.success('删除成功');
            this.getList();
          }
          
        });
      },
      onCancel: () => {},
    });
  };
  getCategory = value => {
    getAdMedia({
      media: value || '',
    }).then(({ data }) => {
      console.log(data);
      let category = data.map(item => {
        var obj = {
          title: item.source,
          key: item.sourceId.toString(),
        };
        if (item.mediaList) {
          obj.children = item.mediaList.map((tag, b) => {
            return {
              title: tag.name,
              key: item.sourceId + '-' + tag.id,
            };
          });
        }
        return obj;
      });
      this.setState({
        category: category,
      });
      this.generateList(category);
    });
  };
  generateList = data => {
    var dataList = [...this.state.dataList];
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title });
      this.setState({
        dataList,
      });
      if (node.children) {
        this.generateList(node.children);
      }
    }
  };
  showTotal(total) {
    return `共${total}条`;
  }
  getList = () => {
    let adPositionType = this.formRefA.current.getFieldsValue().type;
    let media = this.formRefA.current.getFieldsValue().creatorName;
    const { basePriceMax, basePriceMin } = this.state;
    getAdposition({
      adPositionType,
      media,
      basePriceMax,
      basePriceMin,
      current:this.state.pagination.current
    }).then(({ data }) => {
      var pagination = {
        ...this.state.pagination,
        total: data.total,
        current: data.current,
      };
      var dataSource=data.records.map(item=>({
        key:item.id,
        ...item
      }))
      this.setState({
        dataSource,
        pagination,
      });
    });
  };
  onExpand = expandedKeys => {
    console.log(expandedKeys, 'expandedKeysexpandedKeys');
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    console.log(this.state.dataList, ' this.state.dataList');
    this.getCategory(value);

    const expandedKeys = this.state.dataList
      .map(item => {
        console.log(item);
        if (item.title.indexOf(value) > -1) {
          console.log('item.title.indexOf(v', getParentKey(item.key, this.state.category));
          return getParentKey(item.key, this.state.category);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    console.log(expandedKeys, value);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  addAdj() {
    this.setState({
      addAdjVis: true,
      addAdjTitle:'添加广告位'
    });
  }

  isEditing = record => record.key === this.state.editingKey;

  edit = record => {
    // source.forEach(item=>{
    if (record.fileType&&record.fileType.indexOf(',') != -1) {
      record.fileType = record.fileType.split(',');
    }
    this.formEdit.current.setFieldsValue({ ...record });

    // })
    this.setState({
      editingKey: record.key,
    });
  };

  cancel = record => {
    const {materialData}=this.state
    if(record.key>998){
      this.formEdit.current.resetFields()
      materialData.pop()
    }else{
      record.fileType = record.fileType.toString();
      console.log(record,'recordrecordrecord')
      this.formEdit.current.resetFields()
    }
   
    console.log(materialData,'materialDatamaterialData')
    this.setState({
      editingKey: '',
      materialData
    });
    console.log(materialData,'materialData')
  };
  deleteSc=(record)=>{
    var materialData=this.state.materialData
    materialData=materialData.filter(item=>item.key!=record.key)
    this.setState({
      materialData
    })
  }
  delete = record => {
    const id = this.state.chooseId;
    if (id) {
      Modal.confirm({
        title: '确认',
        icon: <ExclamationCircleOutlined />,
        content: '请确认是否删除该媒体',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteAdmediaById({
            id,
          }).then(res => {
            if (res.code == 0) {
              message.success('删除成功');
            }

            this.getCategory();
          });
        },
        onCancel: () => {},
      });
    } else {
      message.warning('未选择媒体');
    }
  };

  save = async key => {
    try {
      const row = await this.formEdit.current.validateFields();
      const newData = [...this.state.materialData];
      const index = newData.findIndex(item => key === item.key);
      console.log(key, row);
      if (typeof row.fileType == 'object') {
        row.fileType = row.fileType.toString();
      }
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
          materialData: newData,
          editingKey: '',
        });
      this.formEdit.current.resetFields()

      } else {
        newData.push(row);
        this.setState({
          materialData: newData,
          editingKey: '',
        });
      this.formEdit.current.resetFields()

      }
      // putEffectassess({
      //   ...record,
      //   ...row,
      // }).then(res => {
      //   if(res.code==0){
      //     message.success('修改成功');

      //   }else{
      //     message.warning(res.msg)
      //   }
      // });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  addMedia = values => {
    if (this.state.addMedTitle == '添加媒体') {
      addAdmedia({
        source: values.source,
        name: values.name,
        industryId: values.industryId[1],
      }).then(res => {
        this.successMess(res);
        this.setState({
          addMedVis: false,
        });

        this.getCategory();
      });
    } else {
      editAdmedia({
        source: values.source,
        name: values.name,
        industryId: values.industryId[1],
        id: this.state.editId,
      }).then(res => {
        message.success('修改成功');
        this.setState({
          addMedVis: false,
        });
        this.getCategory();
      });
    }
  };
  addAj = values => {
    console.log(values);
   
    const { minCtr, maxCtr, editJudge, editId } = this.state;
    let adMaterialList = this.state.materialData;
    adMaterialList.forEach(item => {
      item.fileType = item.fileType.toString();
    });
    if (values.acceptDeeplink.length == 0) {
      values.acceptDeeplink = 0;
    } else {
      values.acceptDeeplink = 1;
    }
    let obj = {
      ...values,
      maxCtr,
      minCtr,
      adMaterialList,
    };
    if (editJudge) {
      obj.id = editId;
      hasPuttingAd({
        id:editId
      }).then(res=>{
        console.log(res)
        if(!res.data){
          editAdposition({
            ...obj,
          }).then(res => {
            if (res.status == 500) {
              res.json().then(res => {
                console.log(res, 'dfsfasd');
                message.error(res.msg);
              });
            } else {
              let {data}=res
              console.log(data);
              this.editMess(data);
        this.formRefB.current.resetFields();
    
              this.setState({
                addAdjVis: false,
                materialData:[]
              });
              this.getList();
            }
          });
        }else{
          Modal.confirm({
            title: '确认',
            icon: <ExclamationCircleOutlined />,
            content: '发现素材要求内容变更，当前广告位已被选中进行投放推广，将对广告创意素材造成影响，需重新上传新的素材，原创意素材将无法使用，请慎重操作！',
            okText: '确认',
            cancelText: '取消',
            onOk:()=> {
              editAdposition({
                ...obj,
              }).then(res => {
                if (res.status == 500) {
                  res.json().then(res => {
                    console.log(res, 'dfsfasd');
                    message.error(res.msg);
                  });
                } else {
                  let {data}=res
                  console.log(data);
                  this.editMess(data);
            this.formRefB.current.resetFields();
        
                  this.setState({
                    addAdjVis: false,
                    materialData:[]
                  });
                  this.getList();
                }
              });

            },
            onCancel:()=> {
              this.setState({
                addAdjVis:false

              })
            },
          });
          
        }
      })
      
    } else {
      addAdposition({
        ...obj,
      }).then(res => {
        if (res.status == 500) {
          console.log('可以吗啊啊', res);
          res.json().then(res => {
            console.log(res, 'dfsfasd');
            message.error(res.msg);
          });
        } else {
          let {data}=res
          console.log(data);
          this.successMess(data);
    this.formRefB.current.resetFields();

          this.setState({
            addAdjVis: false,
            materialData:[]
          });
          this.getList();
        }
      });
    }
  };
  clearAdj = () => {
    this.setState({ addAdjVis: false, maxCtr: 0, minCtr: 0 ,materialData:[],editJudge:false});
    this.formRefB.current.resetFields();
    this.getAdMediaList()
  };
  successMess(res) {
    if (res == true) {
      message.success('添加成功');
    }
  }
  editMess(res) {
    if (res == true) {
      message.success('修改成功');
    }
  }
  onSelect = (selectedKeys, e) => {
    console.log(selectedKeys, e);
    this.setState({
      selectedKeys,
    });
    console.log(this.getChooseId(selectedKeys));
    this.setState({
      chooseId: this.getChooseId(selectedKeys),
    });
    if (e.node.key.indexOf('-') != -1) {
      this.formRefA.current.setFieldsValue({
        creatorName: e.selectedNodes[0].title.props.children[2],
      });
    }
    this.getList();
  };
  getChooseId = value => {
    if (value[0].indexOf('-') != -1) {
      return value[0].substr(value[0].indexOf('-') + 1);
    } else {
      return null;
    }
  };
  editMedia = () => {
    if (this.state.chooseId) {
      getAdmediaById({
        id: this.state.chooseId,
      }).then(({ data }) => {
        const { industryId, id, name, source, industryParentId } = data;
        this.setState({
          addMedVis: true,
          addMedTitle: '编辑媒体',
          editId: id,
        });
        console.log(this.formRef, industryParentId + '-' + industryId);
        this.formRef.current.setFieldsValue({
          industryId: [industryParentId, industryId],
          name,
          source,
        });
        console.log(this.formRef.current.getFieldsValue());
      });
    } else {
      message.warning('未选择媒体');
    }
  };
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
  resetSearch=()=>{
    this.formRefA.current.resetFields()
    this.setState({
      basePriceMax:'',
      basePriceMin:''
    })
  }
  searchAd = () => {
    var pagination=this.state.pagination
    this.setState({
      // expandedKeys:[],
      selectedKeys: [],
      pagination:{
        ...pagination,
        current: 1,
      }
    },()=>{
      this.getList();

    });
  };
  maxCtrChange = e => {
    e.persist();
    console.log(e);
    this.setState({
      maxCtr: e.target.value,
    });
  };
  minCtrChange = value => {
    this.setState({
      minCtr: e.target.value,
    });
  };
  handleAdd = () => {
    const { count, materialData } = this.state;
    const newData = {
      key: count,
      amount: '',
      fileSize: ``,
      fileType:undefined,
      size: ``,
      type: ``,
    };

    this.setState({
      materialData: [...materialData, newData],
      editingKey: count,
      count: count + 1,
    });
  };
  handleEdit = row => {
    console.log(row);
    this.setState({
      addAdjVis: true,
      editJudge: true,
      addAdjTitle:'编辑广告位',
      editId: row.id,
    });
    getAdpositionById({
      id: row.id,
    }).then(({ data }) => {
      console.log(data);
      if (data.acceptDeeplink == 0) {
        console.log('>>>>>.');
        this.formRefB.current.setFieldsValue({
          acceptDeeplink: [],
        });
      } else {
        this.formRefB.current.setFieldsValue({
          acceptDeeplink: ['acceptDeeplink'],
        });
      }
      delete data.acceptDeeplink;
      this.formRefB.current.setFieldsValue({
        ...data,
      });
      this.formRefB.current.setFieldsValue({
        mediaId:(data.mediaId).toString()
      });
      
      this.setState({
        minCtr: data.minCtr,
        maxCtr: data.maxCtr,
      });
      let source = JSON.parse(data.sourceRequire);
      source=source.map((item,index)=>{
        return {
          ...item,
          key:index
        }
      })
      this.setState({
        materialData: source,
      });
    });
  };
  fetch = (value, callback) => {
    console.log(value);
  };
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
      console.log(selectOption, 'selectOption');
      this.setState({ selectOption });

      // this.setState({
      //   selectOption
      // })
    });
  };
  changePrice = e => {
    e.persist();
    console.log(e.target.value);
    this.formRefB.current.setFieldsValue({
      advisePrice: (e.target.value * 1.1).toFixed(1),
    });
  };
  render() {
    const {
      searchValue,
      expandedKeys,
      autoExpandParent,
      pagination,
      dataSource,
      addAdjTitle,
      addMedTitle,
      addAdjVis,
      addMedVis,
    } = this.state;
    const priceValidator = (rule, value) => {
  
      console.log(this.formRefB.current.getFieldsValue(),'this.formRefB.current.getFieldsValue()')
      if ((value)>=this.formRefB.current.getFieldsValue().basePrice) {
        return Promise.resolve();
      } else {
        return Promise.reject('出价不得低于底价');
      }
    
  };
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    const mergedColumns = this.columns2.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const selectChildren = this.state.selectOption.map(item => {
      return <Option key={item.id.toString()}>{item.name}</Option>;
    });
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        <div style={{ overflow: 'hidden' }}>
          <Row>
            <Col span={6}>
              <div style={{ display: 'flex' }}>
                <Search
                  style={{ marginBottom: 8 }}
                  placeholder="请输入媒体名称"
                  onChange={this.onChange}
                />
                <Button onClick={() => this.setState({ addMedVis: true })}>
                  <PlusOutlined />
                </Button>
                <Button onClick={() => this.editMedia()}>
                  <EditOutlined />
                </Button>
                <Button onClick={() => this.delete()}>
                  <DeleteOutlined />
                </Button>
              </div>
              <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect.bind(this)}
                treeData={loop(this.state.category)}
                selectedKeys={this.state.selectedKeys}
                height={633}
              />
            </Col>
            <Col span={18}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '70px' }}>
                  <Form
                    name="search"
                    initialValues={{ status: '', type: '' }}
                    layout="inline"
                    className={styles.form}
                    onFinish={this.onFinish}
                    ref={this.formRefA}
                  >
                    <Form.Item name="type" label="广告类型" rules={[]}>
                      <Select size="large" style={{ width: 150 }}>
                        <Option value="">全部广告</Option>
                        <Option value="0">原生广告</Option>
                        <Option value="1">横幅广告</Option>
                        <Option value="2">开屏广告</Option>
                        <Option value="3">视频广告</Option>
                        <Option value="4">插屏广告</Option>
                        <Option value="5">激励视频广告</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="creatorName" label="媒体名称" rules={[]}>
                      <Input size="large" placeholder="请输入媒体名称" />
                    </Form.Item>
                    <Form.Item name="adName" label="底价" rules={[]}>
                      <div>
                        <Input
                          size="large"
                          onChange={this.basePriceMinchange.bind(this)}
                          value={this.state.basePriceMin}
                          style={{ width: '50px' }}
                        />
                        --
                        <Input
                          size="large"
                          onChange={this.basePriceMaxchange.bind(this)}
                          value={this.state.basePriceMax}
                          style={{ width: '50px' }}
                        />
                      </div>
                    </Form.Item>
                  </Form>
                </div>
                <div style={{ float: 'right', overflow: 'hidden', paddingBottom: '10px' }}>
                  <Button
                    size="large"
                    type="primary"
                    className={styles.rightFive + ' greenButton'}
                    onClick={this.searchAd.bind(this)}
                  >
                    查询
                  </Button>
                  <Button size="large" className={styles.rightFive} onClick={()=>this.resetSearch()}>
                    重置
                  </Button>
                  <Button
                    size="large"
                    onClick={this.addAdj.bind(this)}
                    type="primary"
                    className={styles.rightFive}
                    htmlType="submit"
                  >
                    新增
                  </Button>
                </div>
              </div>
              <div style={{ clear: 'both' }}></div>
              <Table
                columns={this.columns}
                className="smallTable"
                loading={this.state.loading}
                dataSource={dataSource}
                bordered
                pagination={pagination}
              />
            </Col>
          </Row>
        </div>
        <Modal
          title={addMedTitle}
          onCancel={() => {
            this.setState({ addMedVis: false });
            this.formRef.current.resetFields();
          }}
          visible={addMedVis}
          width={980}
          footer={null}
          maskClosable={false}
          className="validator"
        >
          <Form onFinish={this.addMedia.bind(this)} ref={this.formRef}>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="媒体名称"
                  rules={[{ required: true, message: '请输入媒体名称' }]}
                >
                  <Input placeholder="请输入媒体名称" />
                </Form.Item>
              </Col>
              <Col span={11} offset={1}>
                <Form.Item
                  name="source"
                  label="来源"
                  rules={[{ required: true, message: '请选择来源类型' }]}
                >
                  <Select style={{ width: 200 }} placeholder="请选择来源类型">
                    {this.state.listSource.map(item => {
                      return (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="industryId"
                  label="行业分类"
                  rules={[{ required: true, message: '请选择行业分类进行查询' }]}
                >
                  {/* <Select style={{ width: 200 }} >
                  {this.state.adindustrycategory.map(item=>{
                    return  <OptGroup label={item.title}>
                      {item.children.map(ele=>{
                        return <Option value={ele.id}>{ele.title}</Option>
                      })}
                    </OptGroup>
                  })}
   
  </Select> */}
                  <Cascader
                    fieldNames={{ label: 'title' }}
                    options={this.state.adindustrycategory}
                    expandTrigger="hover"
                    displayRender={displayRender}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal
          title={addAdjTitle}
          onCancel={() => this.clearAdj()}
          visible={addAdjVis}
          width={980}
          footer={null}
          maskClosable={false}
          className="validator"
        >
          <Form
            ref={this.formRefB}
            initialValues={{ acceptDeeplink: [],dar:0,dau:0, downloadType: 0, launchType: 0 }}
            labelCol={{ span: 7 }}
            onFinish={this.addAj.bind(this)}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="mediaId"
                  label="媒体信息"
                  rules={[{ required: true, message: '请输入媒体信息进行查询' }]}
                >
                  <Select
                    style={{ width: '200px' }}
                    placeholder="请输入媒体信息进行查询"
                    onSearch={this.handleSearch}
                    showSearch
                    filterOption={false}
                  >
                    {selectChildren}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="platform"
                  label="平台"
                  rules={[{ required: true, message: '请选择平台类型' }]}
                >
                  <Select style={{ width: 200 }} placeholder="请选择平台类型">
                    <Option key={1} value={1}>
                      IOS
                    </Option>
                    <Option key={2} value={2}>
                      安卓
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="广告位名称"
                  rules={[{ required: true, message: '请输入广告位名称' }]}
                >
                  <Input placeholder="请输入广告位名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="adPositionKey"
                  label="广告位ID/KEY"
                  rules={[{ required: true, message: '请输入广告位ID/KEY' }]}
                >
                  <Input placeholder="请输入广告位ID/KEY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="launchType"
                  label="投放方式"
                  rules={[{ required: true, message: '请选择投放方式' }]}
                >
                  <Select style={{ width: 200 }} placeholder="请选择投放方式">
                    <Option key={0} value={0}>
                      RTB
                    </Option>
                    <Option key={1} value={1}>
                      PDB
                    </Option>
                    <Option key={2} value={2}>
                      PB
                    </Option>
                    <Option key={3} value={3}>
                      PA
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="adPositionType"
                  label="广告位类型"
                  rules={[{ required: true, message: '请选择广告位类型' }]}
                >
                  <Select style={{ width: 200 }} placeholder="请选择广告位类型">
                    <Option value={0}>原生广告</Option>
                    <Option value={1}>横幅广告</Option>
                    <Option value={2}>开屏广告</Option>
                    <Option value={3}>视频广告</Option>
                    <Option value={4}>插屏广告</Option>
                    <Option value={5}>激励视频广告</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="basePrice"
                  label="底价"
                  rules={[{validator:numberValidator},{ required: true, message: '请输入底价' }]}
                >
                  <Input style={{width:'200px'}} onChange={this.changePrice.bind(this)} placeholder="请输入底价" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="advisePrice"
                  label="建议出价"
                  rules={[{validator:numberValidator},{validator:priceValidator},{ required: true, message: '请输入建议出价' }]}
                >
                  <Input style={{width:'200px'}} placeholder="请输入建议出价" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="downloadType" label="下载类型" rules={[]}>
                  <Select style={{ width: 200 }} placeholder="请选择下载类型">
                    <Option value={0}>无</Option>
                    <Option value={1}>直接下载</Option>
                    <Option value={2}>不支持下载</Option>
                    <Option value={3}>静默下载</Option>
                    <Option value={4}>提示下载</Option>
                    <Option value={5}>跳转APPSTORE</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="acceptDeeplink" label="deeplink支持">
                  <Checkbox.Group>
                    <Checkbox value="acceptDeeplink">支持</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={6} offset={2}>
                <Form.Item name="planId" label="预估CTR" style={{marginLeft:'-15px'}}>
                  <Input
                    size="large"
                    value={this.state.maxCtr}
                    onChange={this.maxCtrChange.bind(this)}
                    style={{ width: '48px' }}
                    
                  />
                  　
                  <Input
                    size="large"
                    value={this.state.minCtr}
                    onChange={this.minCtrChange.bind(this)}
                    style={{ width: '48px' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dar" rules={[{validator:butgetValidator}]} label="日均请求(W)">
                  <Input placeholder="请输入日均请求" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dau"  rules={[{validator:butgetValidator}]} label="日活跃(W)">
                  <Input placeholder="请输入日活跃数" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="launchExplain"
                  label="投放说明"
                  rules={[{ required: true, message: '请输入投放说明' }]}
                >
                  <TextArea placeholder="请输入投放说明" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="startExplain" label="起拍说明">
                  <TextArea placeholder="请输入起拍说明" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="planId"
                  label="素材要求"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <Button
                      onClick={this.handleAdd.bind(this)}
                      type="primary"
                      style={{
                        marginBottom: 16,
                        float: 'right',
                      }}
                    >
                      新增
                    </Button>
                  </div>
                  <Form ref={this.formEdit} name="editform" component={false}>
                    <Table
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      bordered
                      dataSource={this.state.materialData}
                      columns={mergedColumns}
                      rowClassName="editable-row"
                      pagination={false}
                    />
                  </Form>
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>
        </Modal>
      </PageWrapper>
    );
  }
}
export default advPlan;
