# coding=utf-8
import urllib2
import sys
from pypinyin import lazy_pinyin

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

    sql = 'select distinct cptTitle from demo.corp_cpt;'
    # sql = 'select id,corpid,proj_id,proj_desc from corp_proj where id >= 56;'
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        retlist = []
        for i in results:
            if len(i[0]) == 0 or i[0]=="":
                continue
            py = lazy_pinyin(i[0], 2)
            s = ""
            for c in py:
                s = s +str(c[0])
            retlist.append((s,i[0]))

        retlist = sorted(retlist)
        for i in retlist:
            print i[1]

    except:
        pass


    db.close()