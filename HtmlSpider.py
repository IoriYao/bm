import urllib2
from urllib import urlencode

from bs4 import BeautifulSoup


def open_url(url, query_str=None, post_body=None):
    # print url, query_str, post_body
    _url = url
    if query_str is not None:
        _url = '%s?%s' % (url, urlencode(query_str))
    print _url
    html = urllib2.urlopen(_url)
    return BeautifulSoup(html, "html.parser")


def print_dict(info):
    ret = "{"
    for key in info:
        ret += "%s:%s, " % (key.encode("utf-8"), info[key].encode("utf-8"))
    ret += "}"
    print ret
