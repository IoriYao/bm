import MySQLdb

from ProjectSpider import ProjectSpider
from SqlWorker import SqlWorker

db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo')
db.set_character_set('utf8')
cursor = db.cursor()


class ProjectWorker:
    def __init__(self):
        cursor.execute("select corpid,proj_id,proj_type  from corp_proj;")
        records = cursor.fetchall()
        for item in records:
            print item
            spider = ProjectSpider(item[0], item[1])
            sql = "update corp_details set %s  where id='%s'" % (SqlWorker.map_to_sql(spider.projectInfo), item[0])
            print sql
            # cursor.execute(sql)
        db.commit()
        db.close()
