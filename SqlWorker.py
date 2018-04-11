import MySQLdb


class SqlWorker(object):

    @classmethod
    def map_to_sql(cls, map):
        ret = ''
        for key in map:
            if len(map[key]) > 0 and key != 'id':
                ret += " %s='%s'," % (key, map[key])
        return ret[0: len(ret) - 1]
