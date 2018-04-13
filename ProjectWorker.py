from ProjectSpider import ProjectSpider
from SqlWorker import SqlWorker


class ProjectWorker:
    def __init__(self):
        self.sqlWorker = SqlWorker('corp_proj')
        records = self.sqlWorker.query(columns='id,corpid,proj_id,proj_type',
                                       condition='projectName is NULL')
        for item in records:
            print item
            spider = ProjectSpider(item[1], item[2])
            self.sqlWorker.save(condition="id='%s'" % item[0], record=spider.projectInfo)
