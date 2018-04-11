import urllib2
from bs4 import BeautifulSoup


class HtmlSpider(object):
    def __init__(self, url):
        html = urllib2.urlopen(url)
        self.html_doc = BeautifulSoup(html, "html.parser")

