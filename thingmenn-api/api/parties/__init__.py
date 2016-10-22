# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error
from api.cache import cache

party_cache_timeout = 1800

parties = []
lookup = {}

with open(path.dirname(__file__) + '/../../data/parties.json', 'r') as f:
    parties = json.loads(f.read())
    for index, party in enumerate(parties):
        lookup[party['id']] = index

@cache.cached(timeout=party_cache_timeout)
def get_parties():
    return make_json_response(parties)

@cache.cached(timeout=party_cache_timeout)
def get_party_by_id(party_id):
    if party_id not in lookup:
        return make_error('Not found')

    party_index = lookup[party_id]
    return make_json_response(parties[party_index])
