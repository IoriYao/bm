from logging import getLogger, getLevelName, Formatter, StreamHandler

logger = getLogger()
logger.setLevel(getLevelName('INFO'))
log_formatter = Formatter(
    "%(asctime)s [%(threadName)s] : %(message)s ")  # I am printing thread id here

console_handler = StreamHandler()
console_handler.setFormatter(log_formatter)
logger.addHandler(console_handler)


def log(msg):
    logger.info(msg)
