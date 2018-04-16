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
      iframeWidth: 0
    }
    this.columns = [
      {
        title: '工程名称',
        dataIndex: 'projectName',
      },
      {
        title: '类型',
        dataIndex: 'projectType',
      },
      {
        title: '合同价(万元)',
        dataIndex: 'orderAmount',
      },
      {
        title: '技术等级',
        dataIndex: 'techLevel',
      },
      {
        title: '省份',
        dataIndex: 'province',
      },
      {
        title: '开工日期',
        dataIndex: 'startDate',
        render: (val) => <span>{val && moment(val).format("YYYY-MM-DD")}</span>
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
            record.corpid}&keyWord=${record.proj_id}`} target="_blank">详情</a>
        </span>,
      }
    ]
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'bm/fetchProjects',
      payload: {
        companyId: this.props.bm.currentCompany.companyId
      }
    })
  }

  render() {
    let { bm: { projects, currentCompany}} = this.props
    let companyInfoColumns = [];
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
    }
    return (
      <div style={{height: '100%', paddingTop: 16}}>
        <iframe src={`http://glxy.mot.gov.cn/BM/CptInfoAction_base.do?corpCode=${currentCompany.companyId}`}
                style={{width: '100%', height: this.state.iframeHeigh, border: 'none'}}
                ref={ref => this.iframe = ref}
                onLoad={() => {
                  this.setState({
                    iframeHeigh: this.iframe.contentDocument.body.scrollHeight,
                    iframeWidth: this.iframe.contentDocument.body.scrollWidth,
                  })
                  let btn = this.iframe.contentDocument.getElementsByName('BtnQuery')[0]
                  btn.parentNode.removeChild( btn )
                }}/>
        <Table style={{width: '100%'}}
               columns={this.columns}
               rowKey={record => record.proj_id}
               pagination={false}
               dataSource={projects[currentCompany.companyId]}
               loading={false}
               size="small"/>
        <div>
          <a style={{float: 'right', marginTop: 12, marginBottom: 18}}
             href={`http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingQuery.do?corpCode=${currentCompany.companyId}&nodeType=MAINPRJ`} target="_blank">原始项目列表</a></div>
      </div>
    );
  }
}
ProjectsPage.propTypes = {
};

export default connect(({ bm }) => ({
  bm,
}))(ProjectsPage);
