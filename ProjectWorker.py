import thread
import time

from ProjectSpider import ProjectSpider
from SqlWorker import SqlWorker

thread_count = 20


class ProjectWorker:
    def __init__(self):
        self.sqlWorker = SqlWorker('corp_proj')
        records = self.sqlWorker.query(columns='id,corpid,proj_id,proj_type',
                                       condition='projectName is NULL', limit=10000)
        print len(records)
        global thread_count
        if len(records) > 20:
            thread_group_count = len(records) / thread_count
        else:
            thread_count = 1
            thread_group_count = len(records)

        for i in range(0, len(records), thread_group_count if thread_group_count > 0 else len(records)):
            thread.start_new_thread(ProjectWorker.worker, (records[i: i + thread_group_count],))
        while thread_count > -10:
            print("------thread_group_count: %s" % thread_count)
            time.sleep(10)

    @staticmethod
    def worker(records):
        sql_worker = SqlWorker('corp_proj')
        for item in records:
            print item
            spider = ProjectSpider(item[1], item[2])
            sql_worker.save(condition="id='%s'" % item[0], record=spider.projectInfo)
        sql_worker.close()
        global thread_count
        thread_count = thread_count - 1
