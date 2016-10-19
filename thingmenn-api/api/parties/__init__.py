# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_error

parties = []
lookup = {}

with open(path.dirname(__file__) + '/../../data/parties.json', 'r') as f:
    parties = json.loads(f.read())
    for index, party in enumerate(parties):
        lookup[party['id']] = index

def get_parties():
    print 'getting mps!'
    response = jsonify(parties)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

def get_party_by_id(party_id):
    if party_id not in lookup:
        return make_error('Not found')

    party_index = lookup[party_id]
    response = jsonify(parties[party_index])
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response
