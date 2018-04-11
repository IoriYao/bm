# -*- coding: utf-8 -*-
from HtmlSpider import HtmlSpider

attrMap = {
    "组织机构代码:": "id",
    "企业名称:": "companyName",
    "注册省份:": "province",
    "注册城市:": "city",
    "曾用名称:": "nameUsedBefore",
    "行政主管部门:": "parentDepart",
    "营业执照注册号:": "licenceId",
    "注册资金(万元):": "found",
    "企业类型:": "companyType",
    "企业性质:": "companyNature",
    "营业执照注册日期:": "licenceRegisterDate",
    "成立日期:": "companyCreateDate",
    "法定代表人:": "corporationPerson",
    "法定代表人职称:": "corporationTitle",
    "企业负责人:": "leader",
    "企业负责人职称:": "leaderTitle",
    "技术负责人:": "technologyLeader",
    "技术负责人职称:": "techLeaderTitle",
    "统一社会信用代码:": "creditCode",
    # "营业范围:": "businessScope",
    # "资产构成情况及投资关联企业情况:": "assetInfo",
}


class CompanySpider(HtmlSpider):
    def __init__(self, company_id):
        super(CompanySpider, self).__init__("http://glxy.mot.gov.cn/BM/CptInfoAction_base.do?corpCode=%s" % company_id)
        company_info_table = self.html_doc.find(class_="infogrid")
        self.companyInfo = {}
        for tr in company_info_table.find_all("tr"):
            tds = tr.find_all("td")
            for index in range(len(tds)):
                if index % 2 == 0:
                    try:
                        self.companyInfo[attrMap[tds[index].get_text().strip().encode("utf-8")]]\
                            = tds[index + 1].get_text().strip()
                    except:
                        continue
        # print self.companyInfo

