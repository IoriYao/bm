import MySQLdb

from logs import log


class SqlWorker(object):
    db = None
    cursor = None

    def __init__(self, table):
        self.table = table
        self.sqlCount = 0
        self.connect()

    def connect(self):
        self.db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo')
        self.db.set_character_set('utf8')
        self.cursor = self.db.cursor()

    def save(self, record, condition=None):
        if condition is None:
            sql = "insert into %s set %s ON DUPLICATE KEY UPDATE %s;" \
                  % (self.table, self.__map_to_sql(record), self.__map_to_sql(record))
        else:
            sql = "update %s set %s  where %s" % (self.table, self.__map_to_sql(record), condition)
        log(sql)
        try:
            self.cursor.execute(sql)
            self.sqlCount += 1
        except Exception, e:
            log('-------------------------------------')
            print e
            self.cursor.close()
            self.connect()
            self.cursor = self.db.cursor()
            return
        log(self.sqlCount)
        if self.sqlCount % 10 == 0:
            self.db.commit()
            self.cursor.close()
            self.cursor = self.db.cursor()

    def query(self, columns, condition, limit=1000):
        sql = "select %s  from %s where %s limit %s;" % (columns, self.table, condition, limit)
        log(sql)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def query_all(self, columns, limit=10000):
        sql = "select %s  from %s limit %s;" % (columns, self.table, limit)
        log(sql)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def close(self):
        self.cursor.close()
        self.db.commit()
        self.db.close()

    @staticmethod
    def __map_to_sql(info):
        ret = ''
        for key in info:
            if len(info[key]) > 0 and key != 'id':
                ret += " %s='%s'," % (key, info[key].replace("'", "\\'").replace("\\", "\\\\"))
        return ret[0: len(ret) - 1]
