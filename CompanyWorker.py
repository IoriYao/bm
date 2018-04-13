import thread
import time

from CompanySpider import CompanySpider
from SqlWorker import SqlWorker

thread_count = 20


class CompanyWorker:
    def __init__(self):
        self.sqlWorker = SqlWorker('corp_details')
        records = self.sqlWorker.query(columns='id', condition='companyName is NULL', limit=10000)
        thread_group_count = len(records) / thread_count
        for i in range(0, len(records), thread_group_count if thread_group_count > 0 else len(records)):
            thread.start_new_thread(CompanyWorker.worker, (records[i: i + thread_group_count],))
        while thread_count != -1:
            print("------thread_group_count: %s" % thread_count)
            time.sleep(10)

    @staticmethod
    def worker(records):
        sql_worker = SqlWorker('corp_details')
        for item in records:
            print item
            spider = CompanySpider(item[0])
            sql_worker.save(condition="id='%s'" % item[0], record=spider.companyInfo)
        sql_worker.close()
        global thread_count
        thread_count = thread_count - 1
