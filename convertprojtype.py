# coding=utf-8
import urllib2
import sys

reload(sys)
sys.setdefaultencoding('utf-8')


def gettype( projtype, techlevel):
    table = {
        u'高速公路': 100,
        u'一级公路': 90,
        u'二级公路': 80,
        u'三级公路': 70,
        u'四级公路': 60
    }
    if projtype == u'其他工程':
        projtype = techlevel
    return table[projtype]

if __name__ == "__main__":
    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo', charset="utf8")
    cursor = db.cursor()

    sql = 'select id,projectType,techLevel from corp_proj where id >= %s;' % (sys.argv[2])
    # sql = 'select id,corpid,proj_id,proj_desc from corp_proj where id >= 56;'
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            row_id = row[0]
            projtype = row[1]
            teclevel = row[2]
            if int(row_id) % 10 != int(sys.argv[1]):
                continue
            try:
                enum = gettype(projtype, teclevel)
            except:
                continue
            sql = 'update corp_proj set projectTypeEnum=%d where id=%d;' % (enum, row_id)
            try:
                cursor.execute(sql)
                db.commit()
            except Exception, e:
                continue
            print row_id

    except Exception, e:
        print e.message

    db.close()