import urllib2
from bs4 import BeautifulSoup
import MySQLdb

#http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingShow.do?nodeType=MAIN_MADED&pageType=2&corpCode=70913213-1&keyWord=723eca39-80ca-41f8-9727-21faa3db5e76

corpid = "70913213-1"
projid = "723eca39-80ca-41f8-9727-21faa3db5e76"
url = 'http://glxy.mot.gov.cn/BM/CptInfoAction_outstandingShow.do?nodeType=MAIN_MADED&pageType=2&corpCode=%s&keyWord=%s' % (corpid,projid)
html = urllib2.urlopen(url)
bsObj = BeautifulSoup(html, "html.parser")
print bsObj.find_all('table')[1]

