import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch,menu } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    // if(menu.length==0){
      dispatch({
        type:"menu/menu"
      })
    // }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    console.log(currentUser,'currentUser')
    const isLogin = currentUser && currentUser.sysUser.userId;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      // return <Redirect to={`/user/login?${queryString}`} />;
      return <Redirect to={`/user/login`} />;
    }

    return children;
  }
}

export default connect(({ user, loading,menu }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['user/fetchCurrent'],
  menu:menu.menu
}))(SecurityLayout);
