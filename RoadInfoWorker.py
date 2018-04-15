# coding=utf-8
from SqlWorker import SqlWorker

__author__ = 'afnan'


class RoadInfoWorker:

    def __init__(self):
        pass

    def computeRoadInfo(self):
        pass

    def computeBridgeInfo(self):
        pass

    def computelTunnelInfo(self):
        sqlWorker = SqlWorker('corp_proj')
        records = sqlWorker.query(columns='id, projectQuantities', condition='projectQuantities is not NULL', limit=1000)
        for projectInfo in records:
            if projectInfo[1].find(u'大桥') != -1 or projectInfo[1].find(u'特大桥') != -1:
                print "%d: %s" % (projectInfo[0], projectInfo[1])