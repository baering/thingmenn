# coding=utf-8

from flask_cache import Cache

cache = Cache(config={"CACHE_TYPE": "simple"})
