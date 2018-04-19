# coding=utf-8
import urllib2
import sys

reload(sys)
sys.setdefaultencoding('utf-8')


def gettype( level):
    table = {
        u'特级': 100,
        u'不分等级': 100,
        u'一级': 90,
        u'二级': 80,
        u'三级': 70,
        u'': 0
    }
    if not level in table:
        level = u""
    return table[level]

if __name__ == "__main__":
    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo', charset="utf8")
    cursor = db.cursor()

    sql = 'select id,cptlevel from corp_cpt;'
    # sql = 'select id,corpid,proj_id,proj_desc from corp_proj where id >= 56;'
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            row_id = row[0]
            teclevel = row[1]
            try:
                enum = gettype(teclevel)
            except:
                print row_id, "exception"
                continue
            sql = 'update corp_cpt set cptlevelEnum=%d where id=%d;' % (enum, row_id)
            try:
                cursor.execute(sql)
                db.commit()
            except Exception, e:
                print row_id, "exception"
                continue
            print row_id
    except Exception, e:
        print e.message

    db.close()