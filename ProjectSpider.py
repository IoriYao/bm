# -*- coding: utf-8 -*-
from HtmlSpider import HtmlSpider

attr_map = {
    "工程名称:": "projectName",
    "项目类型:": "projectType",
    "合同价(万元):": "orderAmount",
    "结算价(万元):": "finalAmount",
    "技术等级:": "techLevel",
    "合同段名称:": "contractSegmentName",
    "开工日期:": "startDate",
    "交工日期:": "endDate",
    "竣工日期:": "completeDate",
    "建设状态:": "constructionState",
    "合同段开始桩号:": "startSegment",
    "合同段结束桩号:": "endSegment",
    "质量评定情况:": "quality",
    "所在省份:": "province",
    "项目代码:": "code",
    "主要工程量:": "projectQuantities",
}
base_url = "http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingShow.do?nodeType=MAINPRJ&pageType=2&corpCode=%s&keyWord=%s"


class ProjectSpider(HtmlSpider):
    def __init__(self, company_id, project_id):
        super(ProjectSpider, self).__init__(base_url % (company_id, project_id))
        company_info_table = self.html_doc.find(class_="infogrid")
        self.projectInfo = {}
        for tr in company_info_table.find_all("tr"):
            tds = tr.find_all("td")
            for index in range(len(tds)):
                if index % 2 == 0:
                    try:
                        self.projectInfo[attr_map[tds[index].get_text().strip().encode("utf-8")]] \
                            = tds[index + 1].get_text().strip()
                    except:
                        continue
        self.print_dict(self.projectInfo)
