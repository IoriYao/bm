# coding=utf-8
import threading

from HtmlSpider import open_url, print_dict
from SqlWorker import SqlWorker
from logs import log

__author__ = 'afnan'
__attr_map = {
    "评价省份": "province",
    "评价年份": "date",
    "等级": "levelStr",
    # "等级": "level",
    # "企业id": "corp_id"
}
__level_map = {
    'AAA': '99',
    'AA': '98',
    'A': '97',
    'BBB': '89',
    'BB': '88',
    'B': '87',
    'CCC': '79',
    'CC': '78',
    'C': '77',
    'DDD': '69',
    'DD': '68',
    'D': '67',
}
__base_url = 'http://glxy.mot.gov.cn/BM/CreditAction_corpList.do'
__years = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
__thread_count = 5


def start_credit_spider():
    corp_sql_worker = SqlWorker('corp_details')
    records = corp_sql_worker.query_all(columns='companyId')
    corp_sql_worker.close()
    credit_sql_worker = SqlWorker('corp_credit')
    __start_workers(records, credit_sql_worker, __thread_count)
    # __start_work(records, credit_sql_worker)


def __start_workers(corps, credit_sql_worker, worker_count=5):
    if len(corps) % worker_count is 0:
        group_count = len(corps) / worker_count
    else:
        group_count = len(corps) / (worker_count - 1)
    threads = []
    for i in range(0, len(corps), group_count):
        _thread = threading.Thread(target=__start_work, args=(corps[i: i + group_count], credit_sql_worker))
        _thread.start()
        threads.append(_thread)
    for _thread in threads:
        _thread.join()



def __start_work(corps, credit_sql_worker):
    for corp in corps:
        for time in __years:
            try:
                html_doc = open_url(__base_url,
                                    {'corpcode': corp[0], 'corCode': corp[0], 'type': '信用信息', 'periodcode': time})
            except Exception, e:
                log(e.message)
                continue
            for credit_info in __parse_credit_html(html_doc):
                credit_info['corp_id'] = corp[0]
                credit_info['level'] = __level_map[credit_info['levelStr']]
                credit_sql_worker.save(credit_info)


def __parse_credit_html(html_doc):
    credit_table = html_doc.find(id='datagridWithGrade')
    rows = credit_table.find_all('tr')
    results = []
    title = {}
    for i in range(len(rows)):
        credit_info = {}
        columns = rows[i].find_all('td')
        for j in range(len(columns)):
            if i == 0:
                title[j] = columns[j].get_text().strip().encode("utf-8")
            else:
                try:
                    credit_info[__attr_map[title[j]]] = columns[j].get_text().strip().encode("utf-8")
                except:
                    pass
        if len(credit_info.keys()) is not 0:
            results.append(credit_info)
            print_dict(credit_info)
    return results
