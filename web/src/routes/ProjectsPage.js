import React from 'react';
import { connect } from 'dva';
import {Button, Col, Divider, Layout, Row, Table} from "antd";
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
        width: 420
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
        dataIndex: 'roadBaseLen',
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
    let { bm: { projects } } = this.props
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
    /*let companyInfoColumns = [];
    for (let key in ProjectsPage.attrMap) {
      companyInfoColumns.push([
        <Col style={{textAlign: 'right'}}span={6} key={key}>{key}</Col>, <Col span={6} key={key}>{currentCompany[ProjectsPage.attrMap[key]]}</Col>])
    }
    let companyInfoRows = []
    for (let i = 0; i < companyInfoColumns.length; i += 2) {
      companyInfoRows.push(<Row key={i}>
        {companyInfoColumns[i]}
        {i + 1 < companyInfoColumns.length ? companyInfoColumns[i + 1] : undefined}
      </Row>)
    }*/
    return (
      <div style={{paddingTop: 16, marginLeft: 32, marginRight: 32}}>
        <iframe src={`http://glxy.mot.gov.cn/BM/CptInfoAction_base.do?corpCode=${this.state.corpId}`}
                        style={{width: '100%', height: this.state.iframeHeigh, border: 'none'}}
                        ref={ref => this.iframe = ref}
                        onLoad={() => {
                          let btn = this.iframe.contentDocument.getElementsByName('BtnQuery')[0]
                          btn && btn.parentNode.removeChild( btn )
                          setTimeout(() =>
                            this.setState({
                              iframeHeigh: this.iframe.contentDocument.body.scrollHeight,
                              iframeWidth: this.iframe.contentDocument.body.scrollWidth,
                            })
                          ), 1000}
                        }/>
        <Table style={{width: '100%'}}
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

export default connect(({ bm }) => ({
  bm,
}))(ProjectsPage);
