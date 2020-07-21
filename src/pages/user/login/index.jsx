import { UserOutlined, LockOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Form, Input, Button, Icon } from 'antd';
import React, { useState, Component } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import LoginFrom from './components/Login';
import styles from './style.less';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

class Login extends Component {
  state = {
    // randomStr: '',
    src:'',
    codeValue:''
  }
  componentWillMount(){
    this.props.dispatch({
      type:'login/refreshCode'
    })
    // this.refreshCode()
  }
  
  refreshCode() {
    this.props.dispatch({
      type:'login/refreshCode'
    })
    // if (process.env.NODE_ENV !== 'production') {
    //   this.setState({
    //     // src:`${window.location.origin}/code?randomStr=${randomStr}`
    //     src: `/api/code?randomStr=${this.props.randomStr}`,
    //   });
    // } else {
    //   this.setState({
    //     src: `/code?randomStr=${this.props.randomStr}`,
    //   });
    // }
  }
  handleSubmit = values => {
    const { dispatch } = this.props;
    
    values={
      ...values,
      randomStr:this.props.randomStr

    }
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
    // this.refreshCode()

    this.setState({
      codeValue:''
    })
  };
  inputChange=(e)=>{
    e.persist();

    console.log(e)
    this.setState({
      codeValue:e.target.value
    })
  }
  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  render() {
    const {src,randomStr ,codeValue} =this.state
    return (
      <div className={styles.main}>
        <div className={styles.title}>流量管家</div>
        <Form name="basic" ref={this.loginRef} onFinish={this.handleSubmit} onFinishFailed={this.onFinishFailed}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input size="large" 
              placeholder="请输入用户名称" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入登录密码' }]}
          >
            <Input.Password placeholder="请输入登录密码" size="large" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="code" rules= {[{ required: true, message: '请输入验证码' }]}>
          
            <div>
            <Input
              type="code"
              name="code"
              allowClear="true"
              placeholder="请输入验证码"
              size="middle"
              value={codeValue}
              onChange={this.inputChange.bind(this)}
              style={{width:'220px'}}
              /> <img
              src={this.props.randomStrSrc}
              style={{height:'35px'}}
              
              onClick={()=>this.refreshCode()} /></div>
          
        </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  randomStr:login.randomStr,
  randomStrSrc:login.randomStrSrc
}))(Login);
