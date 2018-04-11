import MySQLdb

from CompanySpider import CompanySpider
from SqlWorker import SqlWorker

db = MySQLdb.connect('127.0.0.1', 'root', '123123', 'demo')
db.set_character_set('utf8')
cursor = db.cursor()


class CompanyWorker:
    def __init__(self):
        cursor.execute("select id from corp_details;")
        records = cursor.fetchall()
        for item in records:
            print item
            spider = CompanySpider(item[0])
            sql = "update corp_details set %s  where id='%s'" % (SqlWorker.map_to_sql(spider.companyInfo), item[0])
            print sql
            cursor.execute(sql)
        db.commit()
        db.close()
