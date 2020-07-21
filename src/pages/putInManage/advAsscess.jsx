import PageWrapper from '../pageWrapper';
import React from 'react';
import { getCN } from '@/utils/utils';
import { Form, Input, Button, Table, Pagination } from 'antd';
import styles from './style.less';
import { getADEffectassess } from '@/services/putinmanage';
class advPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '广告名称',
        dataIndex: 'adName',
        width: '30%',
        editable: true,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'adShow',
      },
      {
        title: '累计展示效果',
        colSpan: 2,
        dataIndex: 'cps',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'adClick',
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'ctr',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      {
        title: '累计点击效果',
        colSpan: 3,
        dataIndex: 'cpc',
        render: (text, record) => {
          if (!isNaN(text)) {
            return <span>{text.toFixed(2)}</span>;
          } else {
            return text;
          }
        },
      },
      
      
    ];
    this.state = {
      dataSource: [],
      pagination: {
        showQuickJumper: true,
        total: 0,
        pageSize: 20,
        current:1,
        onChange: this.onChange,
        showTotal: this.showTotal,
      },
      loading: false,
    };
  }

  componentDidMount() {
    this.getList()
  }
  getList=()=>{
    var current=this.state.pagination.current
    getADEffectassess({
      current
    }).then(({ data }) => {
      console.log(data, 'getADEffectassess');
      let arr = [];
      let dataSource = data.records.forEach((item, index) => {
        arr.push({
          key: item.adName,
          adName: item.adName,
          totalCost: item.totalCost,
          adShow: '曝光量',
          cps: '千次曝光成本',
          adClick: '点击数',
          ctr: '点击率',
          cpc: '点击成本',
          
        });
        arr.push(item);
      });
      var pagination= {
        ...this.state.pagination,
        total: data.total*2,
        current:data.current
      }
      this.setState({
        dataSource: arr,
        pagination
      });
    });
  }
  onFinish = values => {
    console.log('Finish:', values);

    console.log('Finish:', values);
    var dto = {
      adName: values.adName || '',
    };
    getADEffectassess({
      ...dto,
    }).then(({ data }) => {
      let arr = [];
      let dataSource = data.records.forEach((item, index) => {
        arr.push({
          key: item.adName,
          adName: item.adName,
          totalCost: item.totalCost,
          adShow: '曝光量',
          cps: '千次曝光成本',
          adClick: '点击数',
          ctr: '点击率',
          cpc: '点击成本',
          
        });
        arr.push(item);
      });
      var pagination= {
        ...this.state.pagination,
        total: data.total*2,
        current:data.current
      }
      this.setState({
        dataSource: arr,
        pagination
      });
    });
  };
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
   onChange=(pageNumber) =>{
    this.setState({
      pagination:{
        ...this.state.pagination,
        current:pageNumber
      }
    },()=>{
      this.getList()
    })
    console.log('Page: ', pageNumber);
  }
  showTotal(total) {
    return `共${total/2}条`;
  }
  render() {
    const { dataSource, pagination } = this.state;
    return (
      <PageWrapper title={getCN(this.props.match.path)}>
        <div style={{ overflow: 'hidden' }}>
          <Form name="search" layout="inline" className={styles.form} onFinish={this.onFinish}>
            <Form.Item name="adName" label="广告名称" rules={[]}>
              <Input size="large" placeholder="请输入广告名称" />
            </Form.Item>

            <Form.Item shouldUpdate={true}>
              <Button size="large"  type="primary" className={styles.rightFive+' greenButton'} htmlType="submit">
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
      </PageWrapper>
    );
  }
}
export default advPlan;
