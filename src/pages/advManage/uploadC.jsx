import { Upload, Tag, message, Button } from 'antd';
const { Dragger } = Upload;
import { InboxOutlined, CloseOutlined } from '@ant-design/icons';
import style from './style.less';
import React from 'react';
import { connect } from 'dva';

@connect(({ adjust }) => {
  return {
    images: adjust.images,
    videos: adjust.videos,
    icons: adjust.icons,
  };
})
class UploadC extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.pxD, 'pxdddd');
    this.state = {
      fileList: [],
      images: [],
      singleImage: {},
      videos: [],
      singleVideo: {},
      singleIcons: {},
      fileList: [],
      url: null,
      once:true
    };
  }
  componentDidMount() {
    console.log(JSON.parse(this.props.pxD),'JSON.parse(this.props.pxD).url')
    
  }
  componentWillReceiveProps(value){
    console.log(value,'componentWillReceiveProps')
    if(this.state.once){
      if(JSON.parse(value.pxD).url){
      this.setState({
        url:JSON.parse(value.pxD).url,
        once:false
      })
    }
    }
    
  }
  beforeUpload = file => {
    return new Promise(resolve => {
      var that = this;
      console.log(this.state.url, 'this.state.url');
      var pxD=JSON.parse(this.props.pxD)
      console.log(pxD, 'this.state.urldfasdf');
      var fileType = pxD.fileType;
      var fileSize = pxD.fileSize;
      var type = pxD.type;
      var size = pxD.size.split('*');
      var duration=pxD.duration
      var isJpgOrPng;
      var chicun = true;
      var judge = false;
      if (type == 0 || type == 2) {
        const isJpg = file.type === 'image/jpeg'; //0
        const isPng = file.type === 'image/png'; //1
        const isGif = file.type === 'image/gif'; //2
        var arr = fileType.split(',');
        if (arr.length == 1) {
          if (fileType.indexOf('jpg') != -1) {
            isJpgOrPng = isJpg;
          }
          if (fileType.indexOf('gif') != -1) {
            isJpgOrPng = isGif;
          }
          if (fileType.indexOf('png') != -1) {
            isJpgOrPng = isPng;
          }
        } else if (arr.length == 2) {
          if (fileType.indexOf('jpg') != -1 && fileType.indexOf('gif') != -1) {
            isJpgOrPng = isJpg || isGif;
          }
          if (fileType.indexOf('png') != -1 && fileType.indexOf('gif') != -1) {
            isJpgOrPng = isPng || isGif;
          }
          if (fileType.indexOf('jpg') != -1 && fileType.indexOf('png') != -1) {
            isJpgOrPng = isJpg || isPng;
          }
        } else {
          isJpgOrPng = isJpg || isGif || isPng;
        }
        if (!isJpgOrPng) {
          message.error('只能上传 ' + fileType + ' 文件');
          return false;
        }
      }

      const isVideo = file.type === 'video/mp4';
      if (JSON.parse(this.props.pxD).type == 1) {
        if (!isVideo) {
          message.error('只能上传 mp4 文件');
          return false;
        }
      }

      const isLt5M = file.size / 1024 < fileSize;
      if (!isLt5M) {
        message.error('不超过 ' + fileSize + 'KB!');
      }
      console.log(file);
      const url = URL.createObjectURL(file);

      if (isJpgOrPng && isLt5M && type == 0) {
        const image = new Image();
        image.onload = function() {
          let width = this.width;
          let height = this.height;
          if (size[0] != width) {
            message.error('尺寸不合格');
            chicun = false;
          } else if (size[1] != height) {
            message.error('尺寸不合格');
            chicun = false;
          } else {
            that.setState({
              singleImage: {
                width,
                height,
              },
            });
            resolve(file);
          }
          
          judge = true;
        };
        image.src = url;
      }
      if (isJpgOrPng && isLt5M && type == 2) {
        const image = new Image();
        image.onload = function() {
          let width = this.width;
          let height = this.height;
          if (size[0] != width) {
            message.error('尺寸不合格');
            chicun = false;
          } else if (size[1] != height) {
            message.error('尺寸不合格');
            chicun = false;
          } else {
            that.setState({
              singleIcons: {
                width,
                height,
              },
            });
            resolve(file);
          }
         
        };
        image.src = url;
      }
      if (isVideo && isLt5M) {
        const video = document.createElement('video');
        video.onloadedmetadata = evt => {
          URL.revokeObjectURL(url);
          let width = video.videoWidth;
          let height = video.videoHeight;
          let time = video.duration;
          if (size[0] != width) {
            message.error('尺寸不合格');
            chicun = false;
          } else if (size[1] != height) {
            message.error('尺寸不合格');
            chicun = false;
          } else if(duration<time){
            message.error('视频时长过大');
            chicun = false;

          }
          else {
            that.setState({
              singleVideo: {
                width,
                height,
                time
              },
            });
            resolve(file);
          }
         
        };
        video.src = url;
        video.load();
      }
      // if (judge) {
      //   return (isJpgOrPng && isLt5M && chicun) || (isVideo && isLt5M && chicun);
      // } else {
      //   return false;
      // }
    });
  };
  uploadChange = file => {
    let fileList = [...file.fileList];
    console.log(file, '几次');
    this.setState({ fileList: [...fileList] });
    const type = JSON.parse(this.props.pxD).type;
    const adPositionId = JSON.parse(this.props.pxD).adPositionId;
    if (file.file.response && file.file.response.code == 0) {
      // fileList = fileList.reverse();
      // fileList = fileList.slice(-1);
      // fileList = fileList.reverse();
      let images = this.props.images;
      console.log(images, 'prop里面的images');
      let videos = this.props.videos;
      let icons = this.props.icons;
      this.setState({
        url: file.file.response.data.fileUrl,
      });
      if (type == '0') {
        
        images.push({
          ...this.state.singleImage,
          url: file.file.response.data.fileUrl,
          // uid: file.file.uid,
          adPositionId,
        });
        this.props.dispatch({
          type: 'adjust/addImages',
          images,
        });
        // this.setState({
        //   images,
        // });
      } else if (type == '1') {
        videos.push({
          ...this.state.singleVideo,
          url: file.file.response.data.fileUrl,
          // uid: file.file.uid,
          adPositionId,
        });
        this.props.dispatch({
          type: 'adjust/addVideos',
          videos,
        });
        // this.setState({
        //   videos,
        // });
      } else {
        icons.push({
          ...this.state.singleIcons,
          url: file.file.response.data.fileUrl,
          // uid: file.file.uid,
          adPositionId,
        });
        this.props.dispatch({
          type: 'adjust/addIcons',
          icons,
        });
      }
      console.log(icons, 'prop里面的iiconss');
      
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

    console.log(this.state.singleImage, 'this.state.singleImage');
    console.log(this.state.singleVideo);
  };
  removeUp() {
    console.log(this.props.images,'dddddddddddd')
    this.props.dispatch({
      type:'adjust/filterAll',
      url:this.state.url
    })
    this.setState({
      url:null,
      fileList:[]
    });
  }
  render() {
    return (
      <div>
        <Tag className="tagC">{JSON.parse(this.props.pxD).size}</Tag>
        {!this.state.url && (
          <Dragger
            action="/dsp2/adidea/upload"
            onChange={this.uploadChange}
            name="multipartFile"
            fileList={this.state.fileList}
            beforeUpload={value => this.beforeUpload(value, 'dddd')}
            onRemove={this.onRemove}
            headers={{
              Authorization: 'Bearer ' + window.localStorage.getItem('putToken'),
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            {/* <p className="ant-upload-text">点击或拖拽文件到此区域上传</p> */}
            <p className="ant-upload-hint">
              只能上传 {JSON.parse(this.props.pxD).fileType} 文件，且不超过{' '}
              {JSON.parse(this.props.pxD).fileSize}kb
            </p>
          </Dragger>
        )}
        {(JSON.parse(this.props.pxD).type == '0'||JSON.parse(this.props.pxD).type == '2') && (this.state.url ) && (
          <div style={{ position: 'relative' }}>
            <img
              src={this.state.url}
              style={{ width: '180px', height: '150px' }}
            ></img>
            <Button
              onClick={() => this.removeUp()}
              size="small"
              style={{ position: 'absolute', right: '-16px', top: '-22px' }}
              shape="circle"
              icon={<CloseOutlined />}
            />
          </div>
        )}
        {JSON.parse(this.props.pxD).type == '1' && (this.state.url ) && (
          <div style={{ position: 'relative' }}>
             <video src={this.state.url } style={{width:'180px',height:'150px'}}  controls>
          </video>　
           
            <Button
              onClick={() => this.removeUp()}
              size="small"
              style={{ position: 'absolute', right: '-16px', top: '-22px' }}
              shape="circle"
              icon={<CloseOutlined />}
            />
          </div>
        )}
      </div>
    );
  }
}

export default UploadC;
