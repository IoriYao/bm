# -*- coding: utf-8 -*-
import urllib2
from bs4 import BeautifulSoup

def grab_com_detail( com_id ):
    com_url_pre = "http://glxy.mot.gov.cn/BM/CptInfoAction_base.do?corpCode="
    com_url = com_url_pre+com_id
    html = urllib2.urlopen(com_url)
    bsObj = BeautifulSoup(html,"html.parser")

com = []
com_id = "70913213-1"
com_url_pre = "http://glxy.mot.gov.cn/BM/CptInfoAction_base.do?corpCode="
com_url = com_url_pre + com_id
html = urllib2.urlopen(com_url)
bsObj = BeautifulSoup(html, "html.parser")
table_ele = bsObj.find_all('table')[1]
rows = table_ele.find_all('tr')
com.append(rows[0].find_all('td')[1].string.strip())
com.append(rows[0].find_all('td')[3].string.strip())
com.append(rows[1].find_all('td')[1].span.string)
print com
pass




