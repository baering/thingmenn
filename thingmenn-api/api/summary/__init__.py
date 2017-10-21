# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error
from api.cache import cache

summary_cache_timeout = 1800

mp_vote_summary = {}
mp_speech_summary = {}
mp_document_summary = {}

mp_vote_positions = {}
mp_speech_positions = {}
mp_document_positions = {}

with open(path.dirname(__file__) + '/../../data/v2/total/mp-vote-summaries.json', 'r') as f:
    mp_vote_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-speech-summaries.json', 'r') as f:
    mp_speech_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-document-summaries.json', 'r') as f:
    mp_document_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-vote-positions.json', 'r') as f:
    mp_vote_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-speech-positions.json', 'r') as f:
    mp_speech_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-document-positions.json', 'r') as f:
    mp_document_positions = json.loads(f.read())

parties = []
party_lookup = {}

party_vote_summary = {}
party_speech_summary = {}
party_document_summary = {}

party_vote_positions = {}
party_speech_positions = {}
party_document_positions = {}

with open(path.dirname(__file__) + '/../../data/parties.json', 'r') as f:
    parties = json.loads(f.read())
    for index, party in enumerate(parties):
        party_lookup[party['id']] = index

with open(path.dirname(__file__) + '/../../data/v2/total/party-vote-summaries.json', 'r') as f:
    party_vote_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-speech-summaries.json', 'r') as f:
    party_speech_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-document-summaries.json', 'r') as f:
    party_document_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-vote-positions.json', 'r') as f:
    party_vote_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-speech-positions.json', 'r') as f:
    party_speech_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-document-positions.json', 'r') as f:
    party_document_positions = json.loads(f.read())


def get_summary(summary, mp_id):
    if mp_id not in summary:
        return make_error('Not found')

    return make_json_response(summary[mp_id])

@cache.cached(timeout=summary_cache_timeout)
def get_mp_vote_summary(mp_id):
    return get_summary(mp_vote_summary, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_speech_summary(mp_id):
    return get_summary(mp_speech_summary, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_document_summary(mp_id):
    return get_summary(mp_document_summary, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_vote_positions(mp_id):
    return get_summary(mp_vote_positions, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_speech_positions(mp_id):
    return get_summary(mp_speech_positions, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_document_positions(mp_id):
    return get_summary(mp_document_positions, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_vote_summary(party_id):
    return get_summary(party_vote_summary, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_speech_summary(party_id):
    return get_summary(party_speech_summary, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_document_summary(party_id):
    return get_summary(party_document_summary, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_vote_positions(party_id):
    return get_summary(party_vote_positions, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_speech_positions(party_id):
    return get_summary(party_speech_positions, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_document_positions(party_id):
    return get_summary(party_document_positions, party_id)
