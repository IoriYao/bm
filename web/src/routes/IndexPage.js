import React from 'react';
import { connect } from 'dva';
import {Button, Card, Col, Divider, Layout, Row, Table, Select, Input, InputNumber} from "antd";
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
        onChange: (page, pageSiz) => this.onPagination(page, pageSiz),
      },
      roadType: 0,
      roadLevel: 70,
      roadMaterial: 0,
      roadLen: 0,
    }
    this.columns = [
      {
        title: '企业名称',
        dataIndex: 'companyName',
      },
      {
        title: '公路长度(km)',
        dataIndex: 'totalLen',
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
      type: 'bm/queryCompanyByType',
      payload: {
        companyFilters: this.props.bm.companyFilters,
        pagination: this.state.pagination,
        roadType: this.state.roadType,
        roadLevel: this.state.roadLevel,
        roadMaterial: this.state.roadMaterial,
        roadLen: this.state.roadLen,
      }
    })
  }

  renderFilters() {
    let { bm: { companyFilters }, dispatch} = this.props
    let filterColumns = companyFilters.map((filter, i) => {
      let types
      return <Col span={12} style={{display: 'flex', paddingLeft: i%2 * 12}} key={i}>
        <Select style={{ flex: 3, marginRight: 5 }} value={companyFilters[i].name} onChange={value => {
          companyFilters[i].name = value
          dispatch({type: 'bm/saveCompanyFilter', payload: companyFilters})
        }}>
          {IndexPage.filters.map((filterItem, index) => {
            if (filterItem.name === filter.name) types = IndexPage.filterTypes[filterItem.type]
            return <Select.Option value={filterItem.name} key={index}>{filterItem.name}</Select.Option>
          })}
        </Select>
        <Input.Group  style={{ flex: 7 }} compact>
          <Select style={{ width: '30%' }} value={companyFilters[i].operator} onChange={value => {
            companyFilters[i].operator = value
            dispatch({type: 'bm/saveCompanyFilter', payload: companyFilters})
          }}>
            {types.map((filterItem, index) =>
              <Select.Option value={filterItem.operator}  key={index}>{filterItem.name}</Select.Option>)}
          </Select>
          <Input style={{ width: '58%' }} onChange={event => {
            companyFilters[i].value = event.target.value
            dispatch({type: 'bm/saveCompanyFilter', payload: companyFilters})
          }}/>
          <Button style={{ width: '12%' }} type="danger" icon='close'
                  onClick={() => {
                    if (companyFilters.length < 2) return
                    companyFilters.splice(i, 1)
                    dispatch({type: 'bm/saveCompanyFilter', payload: companyFilters})
                  }}/>
        </Input.Group>
      </Col>
    })
    let rows = []
    for (let i = 0; i < filterColumns.length; i += 2) {
      rows.push(<Row key={i} style={{marginTop: 12}}>
        {filterColumns[i]}
        {i + 1 < filterColumns.length ? filterColumns[i + 1] : null}
      </Row>)
    }
    return rows
  }

  render() {
    let { bm: { companyFilters, companyCount }, dispatch} = this.props
    return (
      <div style={{width: '80%', height: '100%', paddingTop: 16, marginBottom: 16}}>
        <Card title="条件查询" bordered={true} style={{ width: '100%', marginBottom: 16 }}>
          <Row>
            <Col span={8} style={{paddingRight: 8}}>
              <Input
                addonBefore={
                  <Select defaultValue="0"
                          style={{width: '100'}}
                          onChange={value => this.setState({roadType: value})}>
                    <Select.Option value="0">公路</Select.Option>
                    <Select.Option value="1" disabled>桥梁</Select.Option>
                    <Select.Option value="2" disabled>隧道</Select.Option>
                  </Select>
                }
                type='number'
                style={{width: '100%'}}
                addonAfter="km"
                onChange={event => this.setState({roadLen: event.target.value})}/>
            </Col>
            <Col span={8}
                 style={{display: 'flex', alignItems: 'center', paddingLeft: 8, paddingRight: 8}}>
              <span>等级要求：</span>
              <Select defaultValue="70" style={{ flex: 1 }}
                      onChange={value => this.setState({roadLevel: value})}>
                <Select.Option value="100">高速公路</Select.Option>
                <Select.Option value="90">一级公路及以上</Select.Option>
                <Select.Option value="80">二级公路及以上</Select.Option>
                <Select.Option value="70">三级公路及以上</Select.Option>
                <Select.Option value="60">四级公路及以上</Select.Option>
                <Select.Option value="50">无要求</Select.Option>
              </Select>
            </Col>
            <Col span={8} style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>公路类型：</span>
              <Select defaultValue="0" style={{ flex: 1 }}
                      onChange={value => this.setState({roadMaterial: value})}>
                <Select.Option value="0">沥青路</Select.Option>
                <Select.Option value="1">水泥路</Select.Option>
              </Select>
            </Col>
          </Row>
          {this.renderFilters()}
          <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
            <Button icon="plus" type="primary" onClick={() => {
              companyFilters.push({ name: '注册省份', operator: '=', value: ''})
              dispatch({type: 'bm/saveCompanyFilter', payload: companyFilters})
            }}>添加查询条件</Button>
            <Button type="primary"
                    onClick={() => {
                      this.state.pagination.current = 1
                      dispatch({
                        type: 'bm/queryCompanyByType',
                        payload: {
                          companyFilters,
                          roadType: this.state.roadType,
                          roadLevel: this.state.roadLevel,
                          roadMaterial: this.state.roadMaterial,
                          roadLen: this.state.roadLen,
                          pagination: this.state.pagination,
                        }
                      })
                    }}>查询</Button>
          </div>
        </Card>
        <Table columns={this.columns}
               rowKey={record => record.id}
               dataSource={this.props.bm.companies}
               pagination={{
                 ...this.state.pagination,
                 total: companyCount
               }}
               loading={this.state.loading}
               size="small"/>
      </div>
    );
  }
}

IndexPage.propTypes = {
};
IndexPage.filterTypes = {
  number: [
    { name: "大于", operator: '>' },
    { name: "小于", operator: '<' },
    { name: "等于", operator: '=' },
    { name: "不等于", operator: '<>' },
  ],
  text: [
    { name: "包含", operator: 'contains' },
    { name: "等于", operator: '=' },
  ],
}
IndexPage.filters = [
  { name: '注册省份', type: 'text'},
  { name: '注册城市', type: 'text'},
  { name: '注册资金(万元)', type: 'number'},
  { name: '企业类型', type: 'text'},
  { name: '企业性质', type: 'text'},
]

IndexPage.attrMap = {
  "注册省份": "province",
  "注册城市": "city",
  "曾用名称": "nameUsedBefore",
  "行政主管部门": "parentDepart",
  "营业执照注册号": "licenceId",
  "注册资金(万元)": "found",
  "企业类型": "companyType",
  "企业性质": "companyNature",
  "营业执照注册日期": "licenceRegisterDate",
  "成立日期": "companyCreateDate",
  "法定代表人": "corporationPerson",
  "法定代表人职称": "corporationTitle",
  "企业负责人": "leader",
  "企业负责人职称": "leaderTitle",
  "技术负责人": "technologyLeader",
  "技术负责人职称": "techLeaderTitle",
  "统一社会信用代码": "creditCode",
}

export default connect(({ bm }) => ({
  bm,
}))(IndexPage);
