# coding=utf-8
import re

from SqlWorker import SqlWorker

__author__ = 'afnan'


class RoadInfoWorker:

    def __init__(self):
        pass

    def computeRoadInfo(self):
        pass

    def compute_bridge_info(self):
        sqlWorker = SqlWorker('corp_details')
        records = sqlWorker.query_all(columns='id', limit=100)
        for companyInfo in records:
            pro_sql_worker = SqlWorker('corp_proj')
            project_list = pro_sql_worker.query(columns='projectQuantities',
                                                condition='corpid=\'%s\'and projectQuantities like \'%%大桥%%\'' %
                                                          companyInfo[0])
            for project_info in project_list:
                m = re.search(ur"特?大桥.*?长?约?\d+\.?\d*[m米]", project_info[0].decode('utf-8'), flags=re.U)
                # print project_info[0].decode('utf-8')
                print m.group(0) if m is not None else m
                # if :
                #     print m
                #     print m[0].encode('utf8')

    def computelTunnelInfo(self):
        pass
