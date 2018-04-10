import urllib2
import sys


def query_pro_info( corid, projid ):
    url = "http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingShow.do?nodeType=MAIN_MADED&pageType=2&corpCode=%s&keyWord=%s" % ( corid, projid )
    while True:
        try:
            html = urllib2.urlopen(url, data=None, timeout=30)
            break
        except:
            continue

    from bs4 import BeautifulSoup
    bsObj = BeautifulSoup(html, "html.parser")
    table_ele = bsObj.find_all('table')
    trs = table_ele[1].find_all('tr')
    if len(trs) <= 1:
        return ""

    td = trs[9].find_all('td')[1]
    span = td.span
    return span.text

if __name__ == "__main__":
    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('127.0.0.1', 'root', 'root', 'demo', charset="utf8")
    cursor = db.cursor()


    sql = 'select * from corp_proj where id>=222;'
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            id = row[0]
            corpid = row[1]
            projid = row[2]
            desc = query_pro_info(corpid, projid)
            sql = 'update corp_proj set proj_desc=\"%s\" where id=%d;' % (desc, id)
            cursor.execute(sql)
            db.commit()
            print id

    except Exception, e:
        print e.message

    db.close