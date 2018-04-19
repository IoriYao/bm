
# coding=utf-8
import urllib2
import sys

reload(sys)
sys.setdefaultencoding('utf-8')
import sys
import urllib
table = {
    u"AAA" : 100,
    u"AA" : 90,
    u"A" : 80,
    u"BBB" : 100,
    u"BB" : 90,
    u"B" : 80,
    u"CCC" : 70,
    u"CC" : 50,
    u"C" : 40,
    u"DDD" : 30,
    u"DD" : 20,
    u"D" : 10,
}
def passeCredit(tr):
    td = tr.find_all(u"td",recursive=None)
    province = td[1].text.strip()
    date = td[2].text.strip()
    level = table[td[3].text.strip()]
    return (province,int(date),level)
def getcredit(id,date):
    url = u"http://glxy.mot.gov.cn/BM/CreditAction_corpList.do"

    while True:
        try:
            req = urllib2.Request(url)
            data = urllib.urlencode(  { u"corCode" : id,u"corpcode" : id, u"periodcode" : str(date) , u"type" : u"信用信息"}  )
            opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())
            html = opener.open(req, data,timeout=5)
            break
        except Exception,e:
            continue

    from bs4 import BeautifulSoup
    bsObj = BeautifulSoup(html, "html.parser")
    table_ele = bsObj.find_all('table')
    trs = table_ele[1].find_all('tr')
    resList = []
    trtem = trs[1:len(trs)]
    for tr in trtem:
        info = passeCredit(tr)
        resList.append(info)
    return resList

if __name__ == "__main__":
    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo', charset="utf8")
    cursor = db.cursor()
    #sql = 'select id,companyId from corp_details where id =16;'
    sql = 'select id,companyId from corp_details where id >= %s;' %(sys.argv[2])

    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            id = row[0]
            corpid = row[1]
            if int(id) % 20 != int(sys.argv[1]):
                pass
                continue
            print id, corpid,sys.argv[1],sys.argv[2]
            try:
                for date in [ 2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]:
                    res = getcredit(corpid, date)
                    print date, res
                    for info in res:
                        tmp = info + (corpid,)
                        tempsql = "INSERT INTO demo.corp_credit VALUES( \"%s\",%d,%d,\"%s\");" % tmp
                        try:
                            cursor.execute(tempsql)
                            db.commit()
                        except Exception, e:
                            print(e)

            except Exception , e:
                print(e)
                pass
    except:
        pass

    db.close()


