import React from 'react';
import { connect } from 'dva';
import {Button, Card, Col, Divider, Layout, Row, Table, Select, Input, InputNumber, DatePicker} from "antd";
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
      roadType: '0',
      roadLevel: '-1',
      roadMaterial: '-1',
      tunnelLen: 0,
      bridgeLen: 0,
      roadLen: 0,
      altitude: 0,
      cptLevel: '-1',
      cptType: '-1',
    }
    this.columns = [
      {
        title: '企业名称',
        dataIndex: 'companyName',
      },
      {
        title: '公路总长度(km)',
        dataIndex: 'totalLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : 0 }</span>
      },
      {
        title: '大桥总长度(km)',
        dataIndex: 'totalLargeBridgeLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : 0 }</span>
      },
      {
        title: '隧道总长度(km)',
        dataIndex: 'totalTunnelLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : 0 }</span>
      },
      {
        title: '企业性质',
        dataIndex: 'companyNature',
      },
      {
        title: '城市',
        dataIndex: 'city',
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
  }
  componentDidMount() {
    this.queryCompany()
  }
  onPagination(page, pageSiz) {
    this.state.pagination.current = page
    this.state.pagination.pageSize = pageSiz
    this.queryCompany()
  }

  queryCompany() {
    let { dispatch, bm: { companyFilters } } = this.props
    dispatch({
      type: 'bm/queryCompanyByType',
      payload: {
        companyFilters: companyFilters,
        pagination: this.state.pagination,
        roadType: this.state.roadType,
        roadLevel: this.state.roadLevel,
        roadMaterial: this.state.roadMaterial,
        roadLen: this.state.roadLen,
        bridgeLen: this.state.bridgeLen,
        tunnelLen: this.state.tunnelLen,
        altitude: this.state.altitude,
        endDate: this.state.endDate && this.state.endDate.format('YYYY-MM-DD'),
        cptName: this.state.cptName,
        cptType: this.state.cptType,
        cptLevel: this.state.cptLevel
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
          <Input style={{ width: '58%' }}
                 value={companyFilters[i].value || ''}
                 onChange={event => {
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
      rows.push(<Row key={i} style={{marginBottom: 12}}>
        {filterColumns[i]}
        {i + 1 < filterColumns.length ? filterColumns[i + 1] : null}
      </Row>)
    }
    return rows
  }

  render() {
    let { bm: { companyFilters, companyCount }, dispatch} = this.props
    return (
      <div style={{minWidth: 968, height: '100%', paddingTop: 16, marginBottom: 16}}>
        <Card bordered={true} style={{ width: '100%', marginBottom: 16 }}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{whiteSpace: 'nowrap', marginRight: 12, fontWeight: 'bold'}}>项目筛选条件</div>
            <Divider/>
          </div>
          <Row>
            <Col span={6} style={{paddingBottom: 8, display: 'flex', paddingLeft: 8, alignItems: 'center'}}>
              <span>公路总长：</span>
              <Input
                type='number'
                style={{flex: 7}}
                addonAfter="km"
                value={this.state.roadLen}
                onChange={event => this.setState({roadLen: event.target.value})}/>
            </Col>
            <Col span={6} style={{paddingBottom: 8, display: 'flex', paddingLeft: 8, alignItems: 'center'}}>
              <span>桥梁总长：</span>
              <Input
                type='number'
                style={{flex: 7}}
                addonAfter="km"
                value={this.state.bridgeLen}
                onChange={event => this.setState({bridgeLen: event.target.value})}/>
            </Col>
            <Col span={6} style={{paddingBottom: 8, display: 'flex', paddingLeft: 8, alignItems: 'center'}}>
              <span>隧道总长：</span>
              <Input
                type='number'
                style={{flex: 7}}
                addonAfter="km"
                value={this.state.tunnelLen}
                onChange={event => this.setState({tunnelLen: event.target.value})}/>
            </Col>
            <Col span={6} style={{paddingBottom: 8, display: 'flex', paddingLeft: 8, alignItems: 'center'}}>
              <span>海拔要求：</span>
              <Input
                type='number'
                style={{flex: 7}}
                addonAfter="km"
                value={this.state.altitude}
                onChange={event => this.setState({altitude: event.target.value})}/>
            </Col>
          </Row>
          <Row>
            <Col span={8}
                 style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>等级要求：</span>
              <Select defaultValue="-1" style={{ flex: 1 }}
                      value={this.state.roadLevel}
                      onChange={value => this.setState({roadLevel: value})}>
                <Select.Option value="100">高速公路</Select.Option>
                <Select.Option value="90">一级公路及以上</Select.Option>
                <Select.Option value="80">二级公路及以上</Select.Option>
                <Select.Option value="70">三级公路及以上</Select.Option>
                <Select.Option value="60">四级公路及以上</Select.Option>
                <Select.Option value="-1">无要求</Select.Option>
              </Select>
            </Col>
            <Col span={8} style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>公路类型：</span>
              <Select defaultValue="-1" style={{ flex: 1 }}
                      value={this.state.roadMaterial}
                      onChange={value => this.setState({roadMaterial: value})}>
                <Select.Option value="0">沥青路</Select.Option>
                <Select.Option value="1">水泥路</Select.Option>
                <Select.Option value="-1">无要求</Select.Option>
              </Select>
            </Col>
            <Col span={8} style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>交工日期：</span>
              <DatePicker style={{flex: 1}}
                          value={this.state.endDate}
                          onChange={date => this.setState({endDate: date})} />
            </Col>
          </Row>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 18}}>
            <div style={{whiteSpace: 'nowrap', marginRight: 12, fontWeight: 'bold'}}>资质筛选条件</div>
            <Divider/>
          </div>
          <Row>
            <Col span={8}
                 style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>资质名称：</span>
              <Select style={{ flex: 1 }}
                      value={this.state.cptName}
                      onChange={value => this.setState({cptName: value})}>
                {
                  IndexPage.CptTitles.map((title, i) =>
                    <Select.Option value={title} key={i}>{title}</Select.Option>)
                }
              </Select>
            </Col>
            <Col span={8}
                 style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>资质类型：</span>
              <Select defaultValue="-1" style={{ flex: 1 }}
                      value={this.state.cptType}
                      onChange={value => this.setState({cptType: value})}>
                <Select.Option value="总承包">总承包</Select.Option>
                <Select.Option value="专业承包">专业承包</Select.Option>
                <Select.Option value="-1">无要求</Select.Option>
              </Select>
            </Col>
            <Col span={8}
                 style={{display: 'flex', alignItems: 'center', paddingLeft: 8}}>
              <span>资质级别：</span>
              <Select defaultValue="-1" style={{ flex: 1 }}
                      value={this.state.cptLevel}
                      onChange={value => this.setState({cptLevel: value})}>
                <Select.Option value="100">特级</Select.Option>
                <Select.Option value="90">一级</Select.Option>
                <Select.Option value="80">二级</Select.Option>
                <Select.Option value="70">三级</Select.Option>
                <Select.Option value="60">不分等级</Select.Option>
                <Select.Option value="-1">无要求</Select.Option>
              </Select>
            </Col>
          </Row>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 18}}>
            <div style={{whiteSpace: 'nowrap', marginRight: 12, fontWeight: 'bold'}}>基本属性筛选</div>
            <Divider/>
          </div>
          {this.renderFilters()}
          <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <Button icon="plus" type="primary" onClick={() => {
              companyFilters.push({ name: '企业名称', operator: '=', value: ''})
              dispatch({type: 'bm/saveCompanyFilter', payload: companyFilters})
            }}>添加筛选条件</Button>
            <Button type="primary"
                    onClick={() => {
                      this.state.pagination.current = 1
                      this.queryCompany()
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
  { name: '企业名称', type: 'text'},
  { name: '注册省份', type: 'text'},
  { name: '注册城市', type: 'text'},
  { name: '注册资金(万元)', type: 'number'},
  { name: '企业类型', type: 'text'},
  { name: '企业性质', type: 'text'},
]

IndexPage.attrMap = {
  "企业名称": "companyName",
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

IndexPage.CptTitles = [ '爆破与拆除工程', '城市轨道交通工程', '城市及道路照明工程', '城市园林绿化工程', '堤防工程', '公路工程',
  '地基基础工程', '地基与基础工程', '电力工程', '电力工程施工', '电子与智能化工程', '防腐保温工程', '防腐保温专业承包', '防水防腐保温工程',
  '房屋建筑工程', '附着升降脚手架金属门窗工程', '工程设计', '管道工程', '港航设备安装及水上交管工程', '钢结构工程', '古建筑工程',
  '港口与海岸工程', '港口与航道工程', '环保工程', '航道工程', '化工石油工程', '河湖治理工程', '河湖整治工程', '混凝土预制构件',
  '海洋石油工程', '机场场道', '机电安装', '机电工程', '机电设备安装工程', '计算机信息系统集成企业', '建筑防水工程', '建筑工程',
  '建筑机电安装工程', '建筑幕墙工程', '建筑业企业', '建筑智能化工程', '建筑装修装饰工程', '矿山工程', '路基', '路面', '炉窑工程',
  '模板脚手架', '桥梁工程', '起重设备安装工程', '输变电工程', '送变电工程', '隧道工程', '水工大坝工程', '水工金属结构制作与安装工程',
  '水工建筑物基础处理工程', '施工劳务企业资质', '水工隧洞工程', '施工总承包', '水利水电', '水上交通', '石油化工', '市政工程', '市政公用',
  '通航建筑工程', '铁路电气化', '铁路电务', '铁路工程', '铁路铺轨架梁', '土石方工程', '通信工程', '体育场地设施', '特种工程',
  '特种结构补强', '特种专业', '消防设施', '预拌混凝土', '预拌商品混凝土', '冶金工程', '冶炼工程', '园林古建筑工程', '预应力工程',
  '营业执照',
]

export default connect(({ bm }) => ({
  bm,
}))(IndexPage);
