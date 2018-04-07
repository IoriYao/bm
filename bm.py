import urllib2
import time
import MySQLdb


def printID(content):
    const_size = len("/BM/CptInfoAction_frame.do?corpCode=")
    begin = content.find("/BM/CptInfoAction_frame.do?corpCode=")
    if begin == -1:
        exit(0)

    ids = []
    while begin != -1:
        last = content.find("\"", begin)
        ids.append(content[begin + const_size:last])
        begin = content.find("/BM/CptInfoAction_frame.do?corpCode=", last)

    print ids

content = urllib2.urlopen('http://glxy.mot.gov.cn/BM/AdmitAction_jPublishList.do?loc=CorpList&view=N').read()


total_len=len("</font>/<font color=\"red\">")
total_b=content.find("</font>/<font color=\"red\">")
total_e=content.find("</font>",total_b+total_len)
total=content[total_b+total_len:total_e]
print total

total_i = int(total,10)

i=1
while i <= total_i:
    content = urllib2.urlopen('http://glxy.mot.gov.cn/BM/AdmitAction_jPublishList.do?loc=CorpList&view=N&pageNo='+str(i)).read()
    printID(content)
    i += 1





pass
