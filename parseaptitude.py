
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

def parseMainTable(table):
    trs = table.find_all('tr')
    if len(trs) != 4:
        return []
    cptTitle = trs[1].find_all("td")[1].text.strip()
    cpttype  = trs[1].find_all("td")[3].text.strip()
    cptlevel = trs[2].find_all("td")[1].text.strip()
    cptNum   = trs[2].find_all("td")[3].text.strip()
    cptOrg   = trs[3].find_all("td")[1].text.strip()
    cptDate  = trs[3].find_all("td")[3].text.strip()
    return [(cptTitle, cpttype, cptlevel, cptNum, cptOrg, cptDate)]

def parseSubTable(table):
    ret = []
    trs = table.find_all('tr')
    if len(trs) <= 1:
        return ret
    trs = trs[1: len(trs)]
    for tr in trs:
        try:
            tds = tr.find_all("td")
            cptTitle = tds[1].text.strip()
            cpttype = tds[2].text.strip()
            cptlevel = tds[3].text.strip()
            cptNum = tds[4].text.strip()
            cptOrg = tds[6].text.strip()
            cptDate = tds[5].text.strip()
            ret.append( (cptTitle, cpttype, cptlevel, cptNum, cptOrg, cptDate) )
        except:
            pass
    return ret

def getaptitude(corp):
    url = u"http://glxy.mot.gov.cn/BM/CptInfoAction_aptitude.do?corpCode=" + corp
    while True:
        try:
            html = urllib2.urlopen(url, data=None, timeout=30)
            break
        except Exception,e:
            continue

    from bs4 import BeautifulSoup
    bsObj = BeautifulSoup(html, "html.parser")
    table_ele = bsObj.find_all('table')
    main = parseMainTable(table_ele[0])
    sub = parseSubTable(table_ele[2])
    return main + sub

if __name__ == "__main__":
    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo', charset="utf8")
    cursor = db.cursor()
    #sql = 'select id,companyId from corp_details where companyId = \"70913213-1\";'
    sql = 'select id,companyId from corp_details where id >= %s;' % (sys.argv[2])

    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            corpid = row[1]
            itemid = row[0]
            print corpid
            h = int(itemid) % 20
            if h != int(sys.argv[1]):
                pass
                continue
            try:
                res = []
                res = getaptitude(corpid)
                print res
                for info in res:
                    tmp = (corpid,) + info
                    tempsql = "INSERT INTO demo.corp_cpt(corp_id, cptTitle,cpttype,cptlevel,cptNum,cptOrg,cptDate) VALUES( \"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\");" % tmp
                    try:
                        cursor.execute(tempsql)
                        db.commit()
                        pass
                    except Exception, e:
                        tempsql = "INSERT INTO demo.corp_cpt(corp_id) VALUES( \"%s\");" % (corpid)
                        cursor.execute(tempsql)
                        db.commit()
                        print itemid, "exception"
                        break

            except Exception , e:
                print(e)
                print itemid, exception
                pass
    except Exception , e:
        pass

    db.close()


