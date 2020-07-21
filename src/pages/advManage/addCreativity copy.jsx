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
} from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { router } from 'umi';
const { TabPane } = Tabs;
const { TextArea } = Input;
import VideoForm from './video';
import ImageForm from './image';
import IconForm from './icon';
import { listAdNameAndId } from '@/services/adplan';
import {  addAdidea,putAdidea ,getAdideaById} from '@/services/adidea';
import {nameValidator50} from '@/utils/validator'
const Formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
@connect(({ user, demand }) => {
  return {
    currentUser: user.currentUser,
    selectedTags: demand.selectedTags,
    selectedTagsCrowd: demand.selectedTagsCrowd,
  };
})
class addCreativity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['jack', 'lucy'],
      editSwitch: false,
      tabKey: '2',
      advList: [],
      templateId: '2',
      cardTitle:'新增创意'
    };
  }
  formRef = React.createRef();
  closePage = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  componentDidMount() {
    if(this.props.location.params){
      this.formRef.current.setFieldsValue({
        adId:this.props.location.params.planId
      })
    }
    listAdNameAndId().then(({ data }) => {
      console.log(data, 'getAdInfoDTOList');
      this.setState({
        advList: data || [],
      });
    });
    const id = this.props.match.params.id;
    if(id!=-1){
      getAdideaById({
        id
      }).then(({data})=>{
        console.log(data)
        this.formRef.current.setFieldsValue({
          templateName: data.templateName,
          templateTitle: data.templateTitle,
          adId: data.adId,
        });
        this.setState({
          tabKey:data.adIdeaType.toString(),
          cardTitle:'编辑创意'
        })
        if(data.adIdeaType==2){
          
          this.formRef.current.setFieldsValue({
            videoTime: data.video.time,
            videoHeight: data.video.height,
            videoUrl: data.video.url,
            videoWidth: data.video.width,
          });
        }
        if(data.adIdeaType==3){
         
          this.formRef.current.setFieldsValue({
           iconHeight: data.icon.height,
           iconUrl: data.icon.url,
           iconWidth: data.icon.width,
          });
        }
        if(data.adIdeaType==1){
         
          this.formRef.current.setFieldsValue({
            imageHeight0: data.images[0].height,
            imageUrl0: data.images[0].url,
            imageWidth0: data.images[0].width,
           })
        }
        if(data.adIdeaType==0){
          this.formRef.current.setFieldsValue({

templateId:data.templateId.toString()
          })
          this.setState({
templateId:data.templateId.toString()

          })
          if(data.templateId==2){
            this.formRef.current.setFieldsValue({
              imageHeight1: data.images[0].height,
              imageUrl1: data.images[0].url,
              imageWidth1: data.images[0].width,
              adTitle:data.adTitle,
              adDesc:data.adDesc
             })
          }
          if(data.templateId==5){
            this.formRef.current.setFieldsValue({
              imageHeight1: data.images[0].height,
              imageUrl1: data.images[0].url,
              imageWidth1: data.images[0].width,
              imageHeight2: data.images[1].height,
              imageUrl2: data.images[1].url,
              imageWidth2: data.images[1].width,
              imageHeight3: data.images[2].height,
              imageUrl3: data.images[2].url,
              imageWidth3: data.images[2].width,
              adTitle:data.adTitle,
              adDesc:data.adDesc
             })
          }
          if(data.templateId==6){
            this.formRef.current.setFieldsValue({
              imageHeight1: data.images[0].height,
              imageUrl1: data.images[0].url,
              imageWidth1: data.images[0].width,
              videoTime: data.video.time,
              videoHeight: data.video.height,
              videoUrl: data.video.url,
              videoWidth: data.video.width,
              adTitle:data.adTitle,
              adDesc:data.adDesc
             })
          }
          if(data.templateId==7){
            this.formRef.current.setFieldsValue({
              imageHeight1: data.images[0].height,
              imageUrl1: data.images[0].url,
              imageWidth1: data.images[0].width,
              iconHeight: data.icon.height,
              iconUrl: data.icon.url,
              iconWidth: data.icon.width,
              adTitle:data.adTitle,
              adDesc:data.adDesc
             })
          }
          if(data.templateId==8){
            this.formRef.current.setFieldsValue({
              videoTime: data.video.time,
              videoHeight: data.video.height,
              videoUrl: data.video.url,
              videoWidth: data.video.width,
              imageHeight1: data.images[0].height,
              imageUrl1: data.images[0].url,
              imageWidth1: data.images[0].width,
              iconHeight: data.icon.height,
              iconUrl: data.icon.url,
              iconWidth: data.icon.width,
              adTitle:data.adTitle,
              adDesc:data.adDesc
             })
          }
          if(data.templateId==9){
            this.formRef.current.setFieldsValue({
             
              imageHeight1: data.images[0].height,
              imageUrl1: data.images[0].url,
              imageWidth1: data.images[0].width,
              imageHeight2: data.images[1].height,
              imageUrl2: data.images[1].url,
              imageWidth2: data.images[1].width,
              imageHeight3: data.images[2].height,
              imageUrl3: data.images[2].url,
              imageWidth3: data.images[2].width,
              iconHeight: data.icon.height,
              iconUrl: data.icon.url,
              iconWidth: data.icon.width,
              adTitle:data.adTitle,
              adDesc:data.adDesc
             })
          }
        }
       
      })
    }
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
  onFinish = values => {
    // window.opener = null;
    // window.open('', '_self');
    // window.close();
    const { tabKey } = this.state;
    console.log(values);
    let dto = {
      templateName: values.templateName,
      adId: values.adId,
      templateTitle: values.templateTitle,
      templateId: '',
      adIdeaType:tabKey
    };
    switch (tabKey) {
      case '2':
        var video = {
          height: values.videoHeight,
          time: values.videoTime,
          url: values.videoUrl,
          width: values.videoWidth,
        };
        dto.video = video;
        break;
      case '1':
        var images = {
          height: values.imageHeight0,
          url: values.imageUrl0,
          width: values.imageWidth0,
        };
        dto.images = [images];
        break;
      case '0':
        const {templateId}=this.state
        dto.templateId=templateId
        if(templateId==2){
          var images = {
            height: values.imageHeight1,
            url: values.imageUrl1,
            width: values.imageWidth1,
          };
        
          dto.images=[images]
          dto.adTitle=values.adTitle
          dto.adDesc=values.adDesc
        }
        if(templateId==5){
          var images1 = {
            height: values.imageHeight1,
            url: values.imageUrl1,
            width: values.imageWidth1,
          };
          var images2 = {
            height: values.imageHeight2,
            url: values.imageUrl2,
            width: values.imageWidth2,
          };
          var images3 = {
            height: values.imageHeight3,
            url: values.imageUrl3,
            width: values.imageWidth3,
          };
         
          dto.images=[images1,images2,images3]
          dto.adTitle=values.adTitle
          dto.adDesc=values.adDesc
        }
        if(templateId==6){
          var images1 = {
            height: values.imageHeight1,
            url: values.imageUrl1,
            width: values.imageWidth1,
          };
          var video = {
            height: values.videoHeight,
            time: values.videoTime,
            url: values.videoUrl,
            width: values.videoWidth,
          };
         
          dto.images=[images1,images2,images3]
          dto.adTitle=values.adTitle
        dto.video = video;

        }
        if(templateId==7){
          var images1 = {
            height: values.imageHeight1,
            url: values.imageUrl1,
            width: values.imageWidth1,
          };
          var icon = {
            height: values.iconHeight,
            url: values.iconUrl,
            width: values.iconWidth,
          };
          dto.icon = icon;
  
          
          dto.images=[images1]
          dto.adTitle=values.adTitle
          dto.adDesc=values.adDesc
        }
        if(templateId==8){
          var images1 = {
            height: values.imageHeight1,
            url: values.imageUrl1,
            width: values.imageWidth1,
          };
          var icon = {
            height: values.iconHeight,
            url: values.iconUrl,
            width: values.iconWidth,
          };
          var video = {
            height: values.videoHeight,
            time: values.videoTime,
            url: values.videoUrl,
            width: values.videoWidth,
          };
          dto.icon = icon;
  
          
          dto.images=[images1]
          dto.adTitle=values.adTitle
          dto.adDesc=values.adDesc
        dto.video = video;

        }
        if(templateId==9){
            var images1 = {
              height: values.imageHeight1,
              url: values.imageUrl1,
              width: values.imageWidth1,
            };
            var images2 = {
              height: values.imageHeight2,
              url: values.imageUrl2,
              width: values.imageWidth2,
            };
            var images3 = {
              height: values.imageHeight3,
              url: values.imageUrl3,
              width: values.imageWidth3,
            };
            var icon = {
              height: values.iconHeight,
              url: values.iconUrl,
              width: values.iconWidth,
            };
          dto.icon = icon;
          dto.images=[images1,images2,images3]
            dto.adTitle=values.adTitle
            dto.adDesc=values.adDesc
          

        }
        break;
      case '3':
        var icon = {
          height: values.iconHeight,
          url: values.iconUrl,
          width: values.iconWidth,
        };
        dto.icon = icon;

        break;
    }
      console.log(dto)
    if(this.props.match.params.id!=-1){
      dto.id=this.props.match.params.id
      if(dto.images){
        dto.images=dto.images.filter(item=>item!=null)

      }
      putAdidea({
        ...dto,
      }).then(res=>{
        if(res.code==0){
          message.success('修改成功');
          setTimeout(() => {
            this.closePage();
          }, 1000);
        }else{
          message.warning(res.msg)
        }
      })
      
    }else{
       addAdidea({
      ...dto,
    }).then(res=>{
      if(res.code==0){
        message.success('新增成功');
        setTimeout(() => {
          this.closePage();
        }, 1000);
      }else{
        message.warning(res.msg)
      }
    })
    }
   
  };
  
  handleChange(value) {
    this.formRef.current.resetFields(['adTitle','adDesc','iconUrl','iconWidth','iconHeight','videoTime','videoHeight','videoUrl','videoWidth','imageUrl1','imageWidth1','imageHeight1','imageUrl2','imageWidth2','imageHeight2','imageUrl3','imageWidth3','imageHeight3'])
    this.setState({
      templateId: value,
    });

  }
  callback = key => {
    console.log(key);

    this.setState({
      tabKey: key,
    });
    if (key != 1) {
      // this.formRef.current.setFieldsValue({
      //   videoTime: '',
      //   videoHeight: '',
      //   videoUrl: '',
      //   videoWidth: '',
      // });
      this.formRef.current.resetFields(['videoTime','videoHeight','videoUrl','videoWidth'])
    }
    if (key != 2) {
      // this.formRef.current.setFieldsValue({
      //   imageUrl0: '',
      //   imageWidth0: '',
      //   imageHeight0: '',
      // });
      this.formRef.current.resetFields(['imageUrl0','imageWidth0','imageHeight0'])

    }
    if(key!=0){
      this.formRef.current.resetFields(['iconUrl','adTitle','adDesc','iconWidth','iconHeight','imageUrl2','imageWidth2','imageHeight2','imageUrl1','imageWidth1','imageHeight1','imageUrl3','imageWidth3','imageHeight3','videoTime','videoHeight','videoUrl','videoWidth'])

    }
    if (key != 4) {
      // this.formRef.current.setFieldsValue({
      //   iconUrl: '',
      //   iconWidth: '',
      //   iconHeight: '',
      // });
    this.formRef.current.resetFields(['iconUrl','iconWidth','iconHeight'])
  }
  };

  render() {
    const { items, editSwitch, advList,templateId ,cardTitle} = this.state;
    const { selectedTags, selectedTagsCrowd } = this.props;

    return (
      <div>
        <Card title={cardTitle} className={styles.cardCenter} style={{ width: 900 }}>
          <Form
            initialValues={{ templateId: '2', remember: 'lucy', checkAdv: ['信息流广告', 'Pear'] }}
            name="edit"
            {...Formlayout}
            ref={this.formRef}
            onFinish={this.onFinish}
            className={styles.removeP+' '+'validator'}
          >
            <h3>基本信息</h3>

            <Row>
              <Col span={12}>
                <Form.Item name="templateName" label="创意名称" rules={[{validator:nameValidator50},{required: true, message: '请输入创意名称' }]}>
                  <Input placeholder="请输入创意名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="adId" label="所属广告" rules={[{required: true, message: '请选择所属广告' }]}>
                  <Select style={{ width: 200 }} placeholder="请选择所属广告">
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
                <Form.Item name="templateTitle" label="创意标题" rules={[{validator:nameValidator50},{required: true, message: '请输入创意标题' }]}>
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
                className={styles.flexflex}
              >
                <TabPane tab="视频" key="2">
                  <Card>
                    <VideoForm tabKey={this.state.tabKey} templateId={this.state.templateId}/>
                  </Card>
                </TabPane>
                <TabPane tab="图片" key="1">
                  <Card>
                    <ImageForm number={0}  tabKey={this.state.tabKey}/>
                  </Card>
                </TabPane>
                <TabPane tab="原生" key="0">
                  <Card>
                    <Form.Item name="templateId" label="原生类型" rules={[]}>
                      <Select style={{ width: 200 }} onChange={this.handleChange.bind(this)}>
                        <Option value="2">⼀图+标题+描述</Option>
                        <Option value="5">三图+Icon+标题+描述</Option>
                        <Option value="6">视频+图⽚+标题</Option>
                        <Option value="7">⼀图+Icon+标题+描述</Option>
                        <Option value="8">视频+图⽚+Icon+标题+描述</Option>
                        <Option value="9">三图+Icon+标题+描述</Option>
                      </Select>
                    </Form.Item>
                    <Row>
                      <Col span={24}>
                        <Form.Item name="adTitle" label="标题" rules={[{ required:this.state.tabKey==0? true:false,max:50, message: '请输入标题且不超过50字' }]}>
                          <Input placeholder="请输入标题" />
                        </Form.Item>
                      </Col>
                    </Row>
                    {(templateId!=6) &&<Row>
                      <Col span={24}>
                        <Form.Item name="adDesc" label="描述" rules={[{ required:this.state.tabKey==0? true:false,max:100, message: '请输入描述且不超过100字' }]}>
                          <TextArea placeholder="请输入描述" />
                        </Form.Item>
                      </Col>
                    </Row>}
                    <Row>
                      <Col span={12}>
                        <Card title="图片">
                          <ImageForm number={1} tabKey={this.state.tabKey}> </ImageForm>
                        </Card>
                      </Col>
                      {(templateId==5||templateId==9) && <Col span={12}>
                        <Card title="图片">
                          <ImageForm number={2} tabKey={this.state.tabKey}> </ImageForm>
                        </Card>
                      </Col>}
                      {(templateId==5||templateId==9) &&  <Col span={12}>
                        <Card title="图片">
                          <ImageForm number={3} tabKey={this.state.tabKey}> </ImageForm>
                        </Card>
                      </Col>}
                      {(templateId==6||templateId==8) &&  <Col span={12}>
                        <Card title="视频" className={styles.videoP}>
                    <VideoForm  tabKey={this.state.tabKey} templateId={this.state.templateId}/>
                          
                        </Card>
                      </Col>}
                      {(templateId==5||templateId==8||templateId==7||templateId==9) &&   <Col span={12}>
                        <Card title="ICON">
                    <IconForm  tabKey={this.state.tabKey}  templateId={this.state.templateId}/>
                          
                        </Card>
                      </Col>}
                    </Row>

                  
                  </Card>
                </TabPane>
                <TabPane tab="ICON" key="3">
                  <Card>
                    <IconForm  tabKey={this.state.tabKey}  templateId={this.state.templateId}></IconForm>
                  </Card>
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
