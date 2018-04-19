import sys
import traceback
import re

def go_split(s, symbol):
    symbol = "[" + symbol + "]+"
    result = re.split(symbol, s)
    return [x for x in result if x]

def normal(str):
    str = str.lower()
    result = go_split(str, u"(")
    return result[0]

def convertlen(str):
    str = normal(str)
    str = str.replace(u"k", u"")
    part2 = str.split(u"+")
    if len(part2) == 1:
        return int(float(part2[0])) * 1000
    if len(part2) == 2:
        return int(float(part2[0])) * 1000 + int(float(part2[1])) * 1
    return 0

def calclen(startseg, endseg):
    startlen  = convertlen(startseg)
    endlen    = convertlen(endseg)
    result = endlen - startlen
    return result if result >= 0 else 0

if __name__ == "__main__":
    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo', charset="utf8")
    cursor = db.cursor()
    for itemid in xrange(56, 50000):
        sql = 'select * from corp_proj where id = %d;' % (itemid)
        try:
            cursor.execute(sql)
            results = cursor.fetchall()
            if len(results) == 0:
                continue
            row = results[0]
            startseg = row[14]
            endseg   = row[15]
            roadlen = calclen(startseg, endseg)
            print itemid, roadlen
        except Exception, e:
            print "id", itemid
            print(traceback.format_exc())
            print e
            print "---------"
            print startseg, endseg
            print "---------"
    db.close()