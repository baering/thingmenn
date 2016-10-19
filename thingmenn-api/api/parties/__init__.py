# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error

parties = []
lookup = {}

with open(path.dirname(__file__) + '/../../data/parties.json', 'r') as f:
    parties = json.loads(f.read())
    for index, party in enumerate(parties):
        lookup[party['id']] = index

def get_parties():
    print 'getting mps!'
    return make_json_response(parties)

def get_party_by_id(party_id):
    if party_id not in lookup:
        return make_error('Not found')

    party_index = lookup[party_id]
    return make_json_response(parties[party_index])
