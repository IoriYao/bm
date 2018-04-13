from CompanySpider import CompanySpider
from SqlWorker import SqlWorker


class CompanyWorker:
    def __init__(self):
        self.sqlWorker = SqlWorker('corp_details')
        records = self.sqlWorker.query(columns='id', condition='companyName is NULL')
        for item in records:
            print item
            spider = CompanySpider(item[0])
            self.sqlWorker.save(condition="id='%s'" % item[0], record=spider.companyInfo)
