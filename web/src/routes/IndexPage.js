import React from 'react';
import { connect } from 'dva';
import {Button, Card, Col, Divider, Layout, Row, Table} from "antd";
import * as moment from "moment";
import {routerRedux} from "dva/router";

class IndexPage extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loading: false,
      pagination: {
        current: 1,
        pageSize: 25,
        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        onChange: (page, pageSiz) => this.onPagination(page, pageSiz)
      }
    }
    this.columns = [
      {
        title: '组织代码',
        dataIndex: 'id',
      },
      {
        title: '企业名称',
        dataIndex: 'companyName',
      },
      {
        title: '企业类型',
        dataIndex: 'companyType',
      },
      {
        title: '企业性质',
        dataIndex: 'companyNature',
      },
      {
        title: '注册省份',
        dataIndex: 'province',
      },
      {
        title: '城市',
        dataIndex: 'city',
      },
      {
        title: '注册资金(万)',
        dataIndex: 'found',
      },
      {
        title: '成立日期',
        dataIndex: 'companyCreateDate',
        render: (val) => <span>{val && moment(val).format("YYYY-MM-DD")}</span>
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (val, record) => <span>
          <a onClick={
            () => {
              this.props.dispatch({type: 'bm/saveCurrentCompany', payload: record})
              this.props.dispatch(routerRedux.push('/projects'))
            }
          }>详情</a>
        </span>,
      }
    ]
    props.dispatch({
      type: 'bm/fetchCompanyCount',
    })
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'bm/fetchCompanies',
      payload: this.state.pagination
    })
  }
  onPagination(page, pageSiz) {
    this.state.pagination.current = page
    this.state.pagination.pageSize = pageSiz
    this.props.dispatch({
      type: 'bm/fetchCompanies',
      payload: this.state.pagination
    })
  }
  componentWillReceiveProps(nextProps, context) {
    this.state.pagination.total = nextProps.bm.companyCount
  }

  render() {
    return (
      <div style={{width: '60%', height: '100%', paddingTop: 16, marginBottom: 16}}>
        <Card bordered={true} style={{ width: '100%' }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Table columns={this.columns}
               rowKey={record => record.id}
               dataSource={this.props.bm.companies}
               pagination={this.state.pagination}
               loading={this.state.loading}
               size="small"/>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect(({ bm }) => ({
  bm,
}))(IndexPage);
