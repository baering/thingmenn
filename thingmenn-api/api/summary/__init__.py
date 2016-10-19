# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error

mps = []
mp_vote_summary_lookup = {}
mp_subject_summary_lookup = {}
mp_noun_lookup = {}

with open(path.dirname(__file__) + '/../../data/mp-vote-summaries.json', 'r') as f:
    mp_vote_summary_lookup = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/mp-positions.json', 'r') as f:
    mp_subject_summary_lookup = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/mp-noun-lookup.json', 'r') as f:
    mp_noun_lookup = json.loads(f.read())

parties = []
party_lookup = {}
party_noun_lookup = {}

with open(path.dirname(__file__) + '/../../data/parties.json', 'r') as f:
    parties = json.loads(f.read())
    for index, party in enumerate(parties):
        party_lookup[party['id']] = index

with open(path.dirname(__file__) + '/../../data/party-noun-lookup.json', 'r') as f:
    party_noun_lookup = json.loads(f.read())

party_vote_summary_lookup = {}

with open(path.dirname(__file__) + '/../../data/party-vote-summary.json', 'r') as f:
    party_vote_summary_lookup = json.loads(f.read())

def get_mp_vote_summary(mp_id):
    if mp_id not in mp_vote_summary_lookup:
        return make_error('Not found')

    summary_for_mp = mp_vote_summary_lookup[mp_id]
    return make_json_response(summary_for_mp)

def get_party_vote_summary(party_id):
    if party_id not in party_lookup:
        return make_error('Not found')

    party_index = party_lookup[party_id]
    party = parties[party_index]
    summary_for_party = party_vote_summary_lookup[party['name']]
    return make_json_response(summary_for_party)

def get_mp_subject_summary(mp_id):
    if mp_id not in mp_subject_summary_lookup:
        return make_error('Not found')

    summary_for_mp = mp_subject_summary_lookup[mp_id]
    return make_json_response(summary_for_mp)

def get_mp_nouns(mp_id):
    if mp_id not in mp_noun_lookup:
        return make_error('Not found')

    summary_for_mp = mp_noun_lookup[mp_id]
    return make_json_response(summary_for_mp)

def get_party_nouns(party_id):
    if party_id not in party_lookup:
        return make_error('Not found')

    party = parties[party_lookup[party_id]]
    summary_for_party = party_noun_lookup[party['name']]
    return make_json_response(summary_for_party)
