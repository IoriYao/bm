import urllib2
from bs4 import BeautifulSoup


class HtmlSpider(object):
    def __init__(self, url):
        print url
        html = urllib2.urlopen(url)
        self.html_doc = BeautifulSoup(html, "html.parser")

    def print_dict(self, info):
        ret = "{"
        for key in info:
            ret += "%s:%s, " % (key.encode("utf-8"), info[key].encode("utf-8"))
        ret += "}"
        print ret
