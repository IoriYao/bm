import sys

reload(sys)
sys.setdefaultencoding('utf8')
# companySpider = CompanySpider("70913213-1")
# from CompanyWorker import CompanyWorker
#
# companyWorker = CompanyWorker()
# from ProjectSpider import ProjectSpider
#
# companySpider = ProjectSpider("00159831-5", '8a8181494d1ee9d8014d2c27f497113b')
# from ProjectWorker import ProjectWorker
#
# companyWorker = ProjectWorker()
from RoadInfoWorker import RoadInfoWorker

roadInfoWorker = RoadInfoWorker()

roadInfoWorker.compute_bridge_info()


