import urllib2
import sys
sys.path.append("C:\\Python27\\Lib\\site-packages")

import MySQLdb
db = MySQLdb.connect('127.0.0.1','root','root','demo')
cursor = db.cursor()

def query_all_main_maded(corpid):
    from bs4 import BeautifulSoup
    url_pre = "http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingQuery.do?nodeType=MAIN_MADED&corpCode="+corpid
    page_no = 1
    while True:
        url = url_pre + "&pageNo=" + str(page_no)
        try:
            html = urllib2.urlopen(url,data=None, timeout=30)
        except:
            continue
        bsObj = BeautifulSoup(html, "html.parser")
        table_ele = bsObj.find('table')
        trs = table_ele.find_all('tr')
        if len(trs) <= 1:
            break

        for tr in trs:
            tds = tr.find_all('td')
            a_ele = tds[1].a
            if a_ele:
                href_str = a_ele['href']
                begin = href_str.find('\'')
                end = href_str.find('\'', begin + 1)
                proj_id = href_str[begin + 1:end]
                sql = 'insert into corp_proj(corpid,proj_id) values ("%s","%s")' % (corpid,proj_id)
                print sql
                cursor.execute(sql)

        page_no += 1
    db.commit()

sql = 'select id from corp_details where id >= \"48500143-0\" order by id'
try:
    cursor.execute(sql)
    results = cursor.fetchall()
    for row in results:
        corpid = row[0]
        query_all_main_maded(corpid)
except Exception,e:
    print e.message

db.close
