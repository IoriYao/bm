# encoding: utf-8
import sys
import nltk
import jieba
import re
import traceback
from nltk.corpus import brown
reload(sys)
sys.setdefaultencoding('utf-8')
units = [u"km", u"公里", u"千米"]
unitsratio = { u"km":1000, u"公里":1000, u"千米":1000, u"米":1, u"m":1}
sep = u";,，。；"
def get_road_type(desc):
    pos = desc.find("沥青")
    return 1 if pos == -1 else 0

def get_road_len_0(desc):
    strs = go_split(desc,sep)
    for str in strs:
        len = get_road_len_0_int(str)
        if len != 0:
            return len
    return 0

def get_road_len_0_int(desc):
    for key in [u"段长为", u"全长为",u"段长约", u"全长约",u"段长是", u"全长是", u"里程约", u"里程为", u"里程",u"段长", u"全长",  u"长约",u"长"]:
        len_start = desc.find(key)
        if len_start != -1:
            break
    if len_start == -1:
        return 0

    for key2 in units:
        unit_start = desc.find(key2, len_start)
        if unit_start != -1:
            break
    if unit_start == -1:
        return 0
    len_str = desc[len_start + len(key):unit_start]

    return int(float(len_str)* unitsratio[key2])

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

def get_road_len_2(startseg, endseg):
    result = 0
    try:
        startlen  = convertlen(startseg)
        endlen    = convertlen(endseg)
        result = endlen - startlen
    except:
        pass
    return result if result >= 0 else 0

def get_road_len_1(desc):
    strs = go_split(desc,sep)
    for str in strs:
        cut = jieba.cut(str)
        out = ','.join(cut)
        candidate1 = [u"路面", u"路线", u"路基", u"道路",u"村道"]
        candidate2 = units + [ u"m",u"米"]
        candidate1ok = False
        for key in candidate1:
            if out.find(key) != -1:
                for key2 in candidate2:
                    if key2 in out.split(u",") and out.index(key) <= out.index(key2):

                        resultlist = out.split(",")
                        len_str = ""
                        for key in candidate2:
                            try:
                                index = resultlist.index(key)
                            except:
                                continue
                            if index + 1 < len(resultlist):
                                if u"宽" in resultlist[index + 1]:
                                    len_str = ""
                                    continue

                            if index >= 1:
                                len_str = resultlist[index - 1]
                                if index >= 2:
                                    if u"宽" in resultlist[index - 2]:
                                        len_str = ""
                                        continue
                                break
                        if len_str == "":
                            continue
                        try:
                            value = float(len_str) * unitsratio[key2]
                        except:
                            continue

                        return int(value) if value > 761 else 0
    return 0

def get_road_len(desc,start,end):
    """
    """
    len = get_road_len_2(start, end)
    if len != 0:
        return len
    desc = desc.lower()
    desc = desc.replace(u"新建", u"")
    desc = desc.replace(u"㎡", u"平方米")
    desc = desc.replace(u"m2", u"平方米")
    desc = desc.replace(u"mm", u"平方米")
    desc = desc.replace(u"m3", u"立方米")
    desc = desc.replace(u"km", u"千米")
    desc = desc.replace(u"m", u"米")
    desc = desc.replace(u"千米/h", u"千米每小时")
    len = get_road_len_1(desc)
    if len != 0:
        return len
    len = get_road_len_0(desc)
    if len != 0:
        return len

    return 0


if __name__ == "__main__":

    sys.path.append("C:\\Python27\\Lib\\site-packages")
    import MySQLdb

    db = MySQLdb.connect('101.132.159.215', 'yuyao', 'yy123123', 'demo', charset="utf8")
    cursor = db.cursor()



    #sql = 'select * from corp_proj ;'
    fid = int(sys.argv[1])
    try:
        for itemid in xrange(fid, 60000, 20):
            sql = 'select * from corp_proj where id =%d;' %(itemid)
            cursor.execute(sql)
            results = cursor.fetchall()

            if len(results) == 0:
                continue
            row = results[0]
            id = row[0]
            corpid = row[1]
            projid = row[2]
            startseg = row[14]
            endseg   = row[15]
            desc = row[19]

            try:
                road_type = get_road_type(desc)
                read_len  = get_road_len(desc,startseg,endseg)
            except:
                continue

            if read_len != row[21]:
                if row[21] == 0:
                    print "enhance %s" % id
                else:
                    print "update %s, confirm %d -> %d" % (id, row[21], read_len)
                    #continue

            sql = 'update corp_proj set roadType=%d,roadLen=%d where id=%d;' % (road_type, read_len, id)
            try:
                cursor.execute(sql)
                db.commit()
            except Exception, e:
                print(traceback.format_exc())
                print e

    except Exception, e:
            print(traceback.format_exc())
            print e

    db.close()