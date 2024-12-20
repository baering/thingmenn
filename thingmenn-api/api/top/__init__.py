# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error
from api.cache import cache

top_cache_timeout = 1800

mp_top_attendance = {}
mp_top_minutes_talked = {}
mp_top_stands_taken = {}

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-top-attendance.json', 'r') as f:
    mp_top_attendance = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-top-minutes-talked.json', 'r') as f:
    mp_top_minutes_talked = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-top-stands-taken.json', 'r') as f:
    mp_top_stands_taken = json.loads(f.read())

@cache.cached(timeout=top_cache_timeout)
def get_top_mp_attendance(lthing):
    return make_json_response(mp_top_attendance[lthing][0:10])

@cache.cached(timeout=top_cache_timeout)
def get_bottom_mp_attendance(lthing):
    return make_json_response(mp_top_attendance[lthing][-10:][::-1])

@cache.cached(timeout=top_cache_timeout)
def get_top_mp_minutes_talked(lthing):
    return make_json_response(mp_top_minutes_talked[lthing][0:10])

@cache.cached(timeout=top_cache_timeout)
def get_bottom_mp_minutes_talked(lthing):
    return make_json_response(mp_top_minutes_talked[lthing][-10:][::-1])

@cache.cached(timeout=top_cache_timeout)
def get_top_mp_stands_taken(lthing):
    return make_json_response(mp_top_stands_taken[lthing][0:10])

@cache.cached(timeout=top_cache_timeout)
def get_bottom_mp_stands_taken(lthing):
    return make_json_response(mp_top_stands_taken[lthing][-10:][::-1])
