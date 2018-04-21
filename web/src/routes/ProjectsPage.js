import React from 'react';
import { connect } from 'dva';
import {Button, Card, Col, Divider, Layout, Row, Table} from "antd";
import * as moment from "moment";

class ProjectsPage extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loading: false,
      iframeHeigh: 0,
      iframeWidth: 0,
      filters: {},
      corpId: props.location.search.split('=')[1]
    }
    this.columns = [
      {
        title: '工程名称',
        dataIndex: 'projectName',
        width: 360
      },
      {
        title: '省份',
        dataIndex: 'province',
      },
      {
        title: '合同价(万元)',
        dataIndex: 'orderAmount',
        sorter: true,
      },
      {
        title: '路基(km)',
        dataIndex: 'roadBedLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : '0' }</span>,
        sorter: true,
      },
      {
        title: '路面(km)',
        dataIndex: 'roadLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : '0' }</span>,
        sorter: true,
      },
      {
        title: '桥(km)',
        dataIndex: 'largeBridgeLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : '0' }</span>,
        sorter: true,
      },
      {
        title: '隧道(km)',
        dataIndex: 'tunnelLen',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : '0' }</span>,
        sorter: true,
      },
      {
        title: '海拔高度(km)',
        dataIndex: 'altitude',
        render: (val) => <span>{val ? (parseInt(val) / 1000) : '0' }</span>,
        sorter: true,
      },
      {
        title: '项目经理',
        dataIndex: 'projManager',
      },
      {
        title: '项目总工',
        dataIndex: 'projEngneer',
      },
      {
        title: '交工日期',
        dataIndex: 'endDate',
        render: (val) => <span>{val && moment(val).format("YYYY-MM-DD")}</span>
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (val, record) => <span>
          <a href={`http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingShow.do?nodeType=MAINPRJ&pageType=2&corpCode=${
            record.corpId}&keyWord=${record.projId}`} target="_blank">详情</a>
        </span>,
      }
    ]
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'bm/fetchProjects',
      payload: {
        companyId: this.state.corpId
      }
    })
  }
  handleTableChange(pagination, filters, sorter) {
    this.setState({
      filters: filters,
      sorter: sorter
    })
  }

  render() {
    let { bm: { projects, company, credits } } = this.props
    if (projects[this.state.corpId]) {
      this.columns[1].filters = []
      let temp = []
      projects[this.state.corpId].forEach(proj => {
        if (proj.province && -1 === temp.indexOf(proj.province)) {
          temp.push(proj.province)
          this.columns[1].filters.push({ text: proj.province, value: proj.province })
        }
      })
    }
    let displayProjects = projects[this.state.corpId]
    if (this.state.filters.province && this.state.filters.province.length > 0) {
      displayProjects
        = projects[this.state.corpId].filter(proj => -1 !== this.state.filters.province.indexOf(proj.province))
    }
    if (this.state.sorter) {
      let sorter = this.state.sorter
      displayProjects.sort((a, b) => this.sort(a[sorter.field], b[sorter.field], sorter.order))
    }
    let companyInfoColumns = [];
    for (let key in ProjectsPage.attrMap) {
      companyInfoColumns.push([
        <Col style={{textAlign: 'right', paddingRight: 16, fontWeight: 'bold'}} span={4} key={key}>{`${key}: `}</Col>
        , <Col span={8} key={company[ProjectsPage.attrMap[key]]}>{company[ProjectsPage.attrMap[key]]}</Col>])
    }
    let companyInfoRows = []
    for (let i = 0; i < companyInfoColumns.length; i += 2) {
      companyInfoRows.push(<Row key={i} style={{marginBottom: 12}}>
        {companyInfoColumns[i]}
        {i + 1 < companyInfoColumns.length ? companyInfoColumns[i + 1] : undefined}
      </Row>)
    }
    return (
      <div style={{paddingTop: 16, marginLeft: 32, marginRight: 32}}>
        <Card style={{ marginBottom: 16 }}>
          <a href={`http://glxy.mot.gov.cn/BM/CptInfoAction_base.do?corpCode=${this.state.corpId}`}
             style={{fontSize: '1.1em'}}
             target="_blank">{company.companyName}</a>
          <Divider style={{marginTop: 12}}/>
          {companyInfoRows}
        </Card>
        <Table style={{width: '100%', marginBottom: 16}}
               title={() => '信用等级'}
               columns={credits.columns}
               rowKey={record => record.year}
               bordered={true}
               pagination={false}
               dataSource={credits.data}
               loading={false}
               size='small'/>
        <Table style={{width: '100%'}}
               title={() => '项目列表'}
               columns={this.columns}
               rowKey={record => record.projId}
               pagination={false}
               dataSource={displayProjects}
               onChange={(pagination, filters, sorter) => this.handleTableChange(pagination, filters, sorter)}
               loading={false}
               size='small'/>
        <div>
          <a style={{float: 'right', marginTop: 12, marginBottom: 18}}
             href={`http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingQuery.do?corpCode=${this.state.corpId}&nodeType=MAINPRJ`} target="_blank">原始项目列表</a></div>
      </div>
    );
  }

  sort(a, b, order) {
    if (parseFloat(a) > parseFloat(b)) {
      return order === 'ascend' ? -1 : 1
    } else if (parseFloat(a) === parseFloat(b)) {
      return 0
    } else return order === 'ascend' ? 1 : -1
  }
}
ProjectsPage.propTypes = {
};
ProjectsPage.attrMap = {
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
}))(ProjectsPage);
