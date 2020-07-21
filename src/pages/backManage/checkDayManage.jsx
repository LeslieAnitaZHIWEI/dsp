import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, DatePicker, Form, Card, message } from 'antd';
import style from './style.less';
const EditableContext = React.createContext();
import { getFinancial,addFinancial } from '@/services/putinmanage';
import moment from 'moment';

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
var time=moment().format('YYYY-MM-DD')
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
      console.log(record, values);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  
    
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '广告名称',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: '商户名称',
        dataIndex: 'companyName',
        width: 140,
      },
      {
        title: '消费金额',
        dataIndex: 'consuAmount',
        editable: true,
        width: 140,
      },
      {
        title: '曝光数',
        dataIndex: 'adShow',
        editable: true,
        width: 140,
      },
      {
        title: '点击数',
        dataIndex: 'adClick',
        editable: true,
        width: 140,
      },
      
    ];
    this.state = {
      dataSource: [],
      count: 2,
      consuDate: time
    };
  }
  formAdd = React.createRef();

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };
  saveDayWater = () => {
    console.log(this.state.dataSource);
    addFinancial(this.state.dataSource).then(res=>{
      if(res.code==0){
        message.success('添加成功')
        setTimeout(() => {
          this.closePage();
        }, 1000);
      }else{
        message.warning(res.msg)

      }
    })
    
  };
  onChange = (date, dateString) => {
    this.setState({
      consuDate:date
    })
    this.getList(dateString)
  };
  componentDidMount() {
    this.formAdd.current.setFieldsValue({
      consuDate: moment()
    })
    this.getList(this.state.consuDate)
    
  }
  getList(consuDate){
    console.log(consuDate,'consuDate')
    getFinancial({
      consuDate
    }).then(({ data }) => {
      console.log(data);
      let dataSource = data.map(ele => {
        return {
          
          ...ele,
          key:ele.adId,
          consuAmount: 0,
          adClick: 0,
          adConversion: 0,
          adShow: 0,
          consuDate:moment(this.state.consuDate).format('YYYY-MM-DD HH:mm:ss'),
        };
      });
      this.setState({
        dataSource,
      });
    });
  }
  closePage = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Card title="添加日流水" className={style.cardCenter} style={{ width: 980 }}>
          <Form name="add" 
            
          
          ref={this.formAdd} onFinish={this.onFinish}>
            <Form.Item name="consuDate" label="消费日期" rules={[]}>
              <DatePicker onChange={this.onChange.bind(this)} />
            </Form.Item>
            <Form.Item name="password" label="消费明细" rules={[]}>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{
                  y:500
                }}
              />
            </Form.Item>
          </Form>
          <div className={style.makeCenter}>
            <Button
              onClick={() => {
                this.saveDayWater();
              }}
              style={{width:'130px'}}
              type="primary"
            >
              保存
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default EditableTable;
