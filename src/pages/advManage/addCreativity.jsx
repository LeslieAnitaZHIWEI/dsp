import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import {
  Form,
  Card,
  Checkbox,
  Tabs,
  Select,
  Input,
  Button,
  message,
  Table,
  Modal,
  Row,
  Col,
  Upload,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
const { TabPane } = Tabs;
const { TextArea } = Input;
import UploadC from './uploadC';
import ImageForm from './image';
import IconForm from './icon';
import { listAdNameAndId } from '@/services/adplan';
import {
  addAdidea,
  putAdidea,
  getAdideaById,
  getAdMaterialRequire,
  getAdMaterialRequireByAdId,
} from '@/services/adidea';
import { nameValidator50 } from '@/utils/validator';

message.config({
  top: 200,
  duration: 2,
  maxCount: 3,
});
const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
@connect(({ user, demand, adjust }) => {
  return {
    currentUser: user.currentUser,
    selectedTags: demand.selectedTags,
    selectedTagsCrowd: demand.selectedTagsCrowd,
    images: adjust.images,
    icons: adjust.icons,
    videos: adjust.videos,
  };
})
class addCreativity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['jack', 'lucy'],
      editSwitch: false,
      tabKey: '0',
      advList: [],
      cardTitle: '新增创意',
      images: [],
      singleImage: {},
      videos: [],
      singleVideo: {},
      fileList: [],
      videoData: [],
      imageData: [],
      iconData: [],
      selectAdId: -1,
      amountTotal: 0,
    };
  }
  formRef = React.createRef();
  closePage = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  componentDidMount() {
    if (this.props.location.params) {
      console.log('走这1')

      var adId = this.props.location.params.planId;
      this.formRef.current.setFieldsValue({
        adId,
      });
      this.selectChange(adId)
    }
    listAdNameAndId().then(({ data }) => {
      this.setState({
        advList: data || [],
      });
    });
    const id = this.props.match.params.id;
    if (id != -1) {
      console.log('走这2')
      getAdideaById({
        id,
      }).then(({ data }) => {
        var bigData = data;
        this.formRef.current.setFieldsValue({
          templateName: data.templateName,
          templateTitle: data.templateTitle,
          adId: data.adId,
        });
        this.setState({
          tabKey: data.adIdeaType.toString(),
          cardTitle: '编辑创意',
        });

        this.setState({
          selectAdId: data.adId,
        });
        getAdMaterialRequire({
          adId: data.adId,
          adPositionType: data.adIdeaType,
        }).then(({ data }) => {
          if (data) {
            this.dealTabData(data);
          }

          if (bigData.images.length!=0) {
            var imageData = this.state.imageData;
            let images = [];
            bigData.images.forEach(item => {
              var size = item.width + '*' + item.height;
              imageData.forEach((ele, i) => {
                if (size == ele.size) {
                  imageData[i].url = item.url;
                  images.push(imageData[i]);
                }
              });
            });
            this.setState({
              imageData,
            });
            this.props.dispatch({
              type: 'adjust/addImages',
              images: images,
            });
          }
          if (Object.keys(bigData.icon).length!=0) {
            var iconData = this.state.iconData;
            [bigData.icon].forEach(item => {
              var size = item.width + '*' + item.height;
              iconData.forEach((ele, i) => {
                if (size == ele.size) {
                  iconData[i].url = item.url;
                }
              });
            });
            this.setState({
              iconData,
            });
            this.props.dispatch({
              type: 'adjust/addIcons',
              icons: iconData,
            });
          }
          if (bigData.videos.length!=0) {
            var videoData = this.state.videoData;
            bigData.videos.forEach(item => {
              var size = item.width + '*' + item.height;
              videoData.forEach((ele, i) => {
                if (size == ele.size) {
                  videoData[i].url = item.url;
                }
              });
            });
            this.setState({
              videoData,
            });
            this.props.dispatch({
              type: 'adjust/addVideos',
              videos: videoData,
            });
          }
        });

        let arr = [];
        //   if(data.videos){
        //     data.videos.forEach((ele,index)=>{
        //       arr.push({
        //         name:ele.,
        //         uid:'videos_'+index,
        //        url:ele.url,
        //         status: 'done',
        //       })
        //     })
        //   }
        //   this.setState({

        //     fileList:arr

        // });
      });
    }
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
  callback = value => {
    getAdMaterialRequire({
      adId: this.state.selectAdId,
      adPositionType: value,
    }).then(({ data }) => {
      if (data) {
        this.dealTabData(data);
      }
    });
    this.setState({
      tabKey: value,
      images: [],
      videos: [],
      fileList: [],
    });
  };
  dealTabData(value) {
    var videoData = [];
    var imageData = [];
    var iconData = [];
    var amountTotal = 0;
    value.forEach(ele => {
      JSON.parse(ele.sourceRequire).forEach(item => {
        amountTotal += item.amount;
        if (item.amount != 1) {
          for (var i = 0; i < item.amount; i++) {
            if (item.type == 0) {
              imageData.push({
                adPositionId: ele.adPositionId,
                ...item,
              });
            }
            if (item.type == 1) {
              videoData.push({
                adPositionId: ele.adPositionId,
                ...item,
              });
            }
            if (item.type == 2) {
              iconData.push({
                adPositionId: ele.adPositionId,
                ...item,
              });
            }
          }
        } else {
          if (item.type == 0) {
            imageData.push({
              adPositionId: ele.adPositionId,
              ...item,
            });
          }
          if (item.type == 1) {
            videoData.push({
              adPositionId: ele.adPositionId,
              ...item,
            });
          }
          if (item.type == 2) {
            iconData.push({
              adPositionId: ele.adPositionId,
              ...item,
            });
          }
        }
      });
    });
    this.setState({
      videoData,
      imageData,
      iconData,
      amountTotal,
    });
  }
  onFinish = values => {
    // window.opener = null;
    // window.open('', '_self');
    // window.close();
    const { tabKey } = this.state;
    let dto = {
      templateName: values.templateName,
      adId: values.adId,
      templateTitle: values.templateTitle,
      adIdeaType: tabKey,
    };
    const { images, videos, icons } = this.props;
    var total = images.length + videos.length;
    if (icons.length != 0) {
      total++;
    }
    if (this.state.amountTotal <= total) {
      if (this.props.match.params.id != -1) {
        dto.id = this.props.match.params.id;
        dto.images = images;
        dto.videos = videos;
        dto.icons = icons.length != 0 ? icons[0] : null;

        putAdidea({
          ...dto,
        }).then(res => {
          if (res.status == 500) {
            res.json().then(response => {

              message.warning(response.msg);
            });
          } else {
            if (res.code == 0) {
              message.success('修改成功');
              setTimeout(() => {
                this.closePage();
              }, 1000);
            } else {
              message.warning(res.msg);
            }
          }
        });
      } else {
        dto.images = images;
        dto.videos = videos;

        dto.icons = icons.length != 0 ? icons[0] : null;
        addAdidea({
          ...dto,
        }).then(res => {
          if (res.status == 500) {
            res.json().then(response => {

              message.warning(response.msg);
            });
          } else {
            if (res.code == 0) {
              message.success('新增成功');
              setTimeout(() => {
                this.closePage();
              }, 1000);
            } else {
              message.warning(res.msg);
            }
          }
        });
      }
    } else {
      message.error('请上传完整');
    }
  };

  beforeUpload = (file, pxD) => {
    var that = this;
    const isJpgOrPng = file.type === 'image/jpeg';

    const isVideo = file.type === 'video/mp4';
    if (!isJpgOrPng && !isVideo) {
      message.error('只能上传 jpg/mp4 文件，且不超过 5MB!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('不超过 5MB!');
    }
    const url = URL.createObjectURL(file);

    if (isJpgOrPng && isLt5M) {
      const image = new Image();
      image.onload = function() {
        let width = this.width;
        let height = this.height;
        that.setState({
          singleImage: {
            width,
            height,
          },
        });
      };
      image.src = url;
    }
    if (isVideo) {
      const video = document.createElement('video');
      video.onloadedmetadata = evt => {
        URL.revokeObjectURL(url);
        let width = video.videoWidth;
        let height = video.videoHeight;
        let time = video.duration;
        that.setState({
          singleVideo: {
            width,
            height,
            time,
          },
        });
      };
      video.src = url;
      video.load();
    }

    return (isJpgOrPng && isLt5M) || (isVideo && isLt5M);
  };
  uploadChange = file => {
    let fileList = [...file.fileList];
    this.setState({ fileList: [...fileList] });
    if (file.file.response && file.file.response.code == 0) {
      // fileList = fileList.reverse();
      // fileList = fileList.slice(-1);
      // fileList = fileList.reverse();

      let images = this.state.images;
      let videos = this.state.videos;
      if (file.file.type === 'image/jpeg') {
        images.push({
          ...this.state.singleImage,
          url: file.file.response.data.fileUrl,
          uid: file.file.uid,
        });
        this.setState({
          images,
        });
      } else {
        videos.push({
          ...this.state.singleVideo,
          url: file.file.response.data.fileUrl,
          uid: file.file.uid,
        });
        this.setState({
          videos,
        });
      }
      this.setState({ fileList: [...fileList] });
    }
    //     if (file.file.response && file.file.response.code != 0) {
    // fileList = fileList.reverse();
    //       fileList = fileList.slice(-1);
    //       fileList = fileList.reverse();
    //       this.setState({ fileList: [...fileList] });
    //     }
    if (!file.file.status) {
      if (fileList.length == 1) {
        fileList = [];
      } else {
        fileList = fileList.slice(0, fileList.length - 1);
      }

      this.setState({ fileList: [...fileList] });
    }

  };
  onRemove = file => {
    let images = [];
    let videos = [];
    if (file.type === 'image/jpeg') {
      images = this.state.images.filter(item => item.url != file.uid);
      this.setState({
        images,
      });
    } else {
      videos = this.state.videos.filter(item => item.url != file.uid);
      this.setState({
        videos,
      });
    }
  };
  selectChange(value) {
    this.setState({
      selectAdId: value,
    });
    getAdMaterialRequireByAdId({
      adId: value,
    }).then(({ data }) => {
      if (data.types.length != 0) {
        this.setState({
          tabKey: data.types[0].toString(),
        });
      }
      getAdMaterialRequire({
        adId: value,
        adPositionType: data.types.length != 0 ? data.types[0].toString() : this.state.tabKey,
      }).then(({ data }) => {
        if (data) {
          this.dealTabData(data);
        }
        this.setState({});
      });
    });
  }
  render() {
    const { items, editSwitch, advList, cardTitle } = this.state;
    const { selectedTags, selectedTagsCrowd } = this.props;
    const cardContent = (
      <div>
        {this.state.videoData.length == 0 &&
          this.state.imageData.length == 0 &&
          this.state.iconData.length == 0 && <div style={{ padding: '20px' }}>无素材要求</div>}
        {this.state.videoData.length != 0 && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100px' }}>视频尺寸</div>
            <Row style={{ width: '100%' }}>
              {this.state.videoData.map(ant => {
                return (
                  <Col style={{ padding: '0 10px 10px' }} span={8}>
                    <UploadC pxD={JSON.stringify(ant)}></UploadC>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
        {this.state.imageData.length != 0 && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100px' }}>图片尺寸</div>
            <Row style={{ width: '100%' }}>
              {this.state.imageData.map(ant => {
                return (
                  <Col style={{ padding: '0 10px 10px' }} span={8}>
                    <UploadC pxD={JSON.stringify(ant)}></UploadC>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
        {this.state.iconData.length != 0 && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100px' }}>ICON尺寸</div>
            <Row style={{ width: '100%' }}>
              {this.state.iconData.map(ant => {
                return (
                  <Col style={{ padding: '0 10px 10px' }} span={8}>
                    <UploadC pxD={JSON.stringify(ant)}></UploadC>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
      </div>
    );
    return (
      <div>
        <Card title={cardTitle} className={styles.cardCenter + ' tabWidth'} style={{ width: 900 }}>
          <Form
            initialValues={{ remember: 'lucy', checkAdv: ['信息流广告', 'Pear'] }}
            name="edit"
            {...Formlayout}
            ref={this.formRef}
            onFinish={this.onFinish}
            className={styles.removeP + ' ' + 'validator'}
          >
            <h3>基本信息</h3>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="templateName"
                  label="创意名称"
                  rules={[
                    { validator: nameValidator50 },
                    { required: true, message: '请输入创意名称' },
                  ]}
                >
                  <Input placeholder="请输入创意名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="adId"
                  label="所属广告"
                  rules={[{ required: true, message: '请选择所属广告' }]}
                >
                  <Select
                    style={{ width: 200 }}
                    onChange={this.selectChange.bind(this)}
                    placeholder="请选择所属广告"
                  >
                    {advList.map(ele => {
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
            <Row>
              <Col span={12}>
                <Form.Item
                  name="templateTitle"
                  label="创意标题"
                  rules={[
                    { validator: nameValidator50 },
                    { required: true, message: '请输入创意标题' },
                  ]}
                >
                  <Input placeholder="请输入创意标题" />
                </Form.Item>
              </Col>
            </Row>

            <h3>创意内容</h3>
            <Form.Item
              name="cynr"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 18 }}
              label="创意内容"
              rules={[]}
            >
              <Tabs
                onChange={this.callback}
                activeKey={this.state.tabKey}
                type="card"
                size="large"
                className={styles.flexflex}
              >
                <TabPane tab="原生" key="0">
                  <Card style={{ textAlign: 'center' }}>
                    {/* <Dragger
                      action="/dsp/adidea/upload"
                      onChange={this.uploadChange}
                      name="multipartFile"
                      // fileList={this.state.fileList}
                      beforeUpload={(value)=>this.beforeUpload(value,'dddd')}
                      onRemove={this.onRemove}
                      headers={{
                        Authorization: 'Bearer ' + window.localStorage.getItem('putToken'),
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                      <p className="ant-upload-hint">只能上传 jpg/mp4 文件，且不超过 5000kb</p>
                    </Dragger> */}
                    {cardContent}
                  </Card>
                </TabPane>
                <TabPane tab="横幅" key="1">
                  <Card style={{ textAlign: 'center' }}>{cardContent}</Card>
                </TabPane>
                <TabPane tab="开屏" key="2">
                  <Card style={{ textAlign: 'center' }}>{cardContent}</Card>
                </TabPane>
                <TabPane tab="视频" key="3">
                  <Card style={{ textAlign: 'center' }}>{cardContent}</Card>
                </TabPane>
                <TabPane tab="插屏" key="4">
                  <Card style={{ textAlign: 'center' }}>{cardContent}</Card>
                </TabPane>
                <TabPane tab="激励视频" key="5">
                  <Card style={{ textAlign: 'center' }}>{cardContent}</Card>
                </TabPane>
              </Tabs>
            </Form.Item>
            <div className={styles.makeCenter}>
              <Button size="large" className={styles.rightFive} type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>
        </Card>
        ,
      </div>
    );
  }
}
export default addCreativity;
