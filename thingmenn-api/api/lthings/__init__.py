# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error
from api.cache import cache

mp_cache_timeout = 1800
lthings = None

with open(path.dirname(__file__) + '/../../data/v2/lthings.json', 'r') as f:
    lthings = json.loads(f.read())

@cache.cached(timeout=mp_cache_timeout)
def get_lthings():
    return make_json_response(lthings)
