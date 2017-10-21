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

mp_vote_summary_by_lthing = {}
mp_speech_summary_by_lthing = {}
mp_document_summary_by_lthing = {}

mp_vote_positions = {}
mp_speech_positions = {}
mp_document_positions = {}

mp_vote_positions_by_lthing = {}
mp_speech_positions_by_lthing = {}
mp_document_positions_by_lthing = {}

with open(path.dirname(__file__) + '/../../data/v2/total/mp-vote-summaries.json', 'r') as f:
    mp_vote_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-vote-summaries.json', 'r') as f:
    mp_vote_summary_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-speech-summaries.json', 'r') as f:
    mp_speech_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-speech-summaries.json', 'r') as f:
    mp_speech_summary_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-document-summaries.json', 'r') as f:
    mp_document_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-document-summaries.json', 'r') as f:
    mp_document_summary_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-vote-positions.json', 'r') as f:
    mp_vote_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-vote-positions.json', 'r') as f:
    mp_vote_positions_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-speech-positions.json', 'r') as f:
    mp_speech_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-speech-positions.json', 'r') as f:
    mp_speech_positions_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/mp-document-positions.json', 'r') as f:
    mp_document_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-document-positions.json', 'r') as f:
    mp_document_positions_by_lthing = json.loads(f.read())

parties = []
party_lookup = {}

party_vote_summary = {}
party_speech_summary = {}
party_document_summary = {}

party_vote_summary_by_lthing = {}
party_speech_summary_by_lthing = {}
party_document_summary_by_lthing = {}

party_vote_positions = {}
party_speech_positions = {}
party_document_positions = {}

party_vote_positions_by_lthing = {}
party_speech_positions_by_lthing = {}
party_document_positions_by_lthing = {}

with open(path.dirname(__file__) + '/../../data/parties.json', 'r') as f:
    parties = json.loads(f.read())
    for index, party in enumerate(parties):
        party_lookup[party['id']] = index

with open(path.dirname(__file__) + '/../../data/v2/total/party-vote-summaries.json', 'r') as f:
    party_vote_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/party-vote-summaries.json', 'r') as f:
    party_vote_summary_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-speech-summaries.json', 'r') as f:
    party_speech_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/party-speech-summaries.json', 'r') as f:
    party_speech_summary_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-document-summaries.json', 'r') as f:
    party_document_summary = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/party-document-summaries.json', 'r') as f:
    party_document_summary_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-vote-positions.json', 'r') as f:
    party_vote_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/party-vote-positions.json', 'r') as f:
    party_vote_positions_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-speech-positions.json', 'r') as f:
    party_speech_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/party-speech-positions.json', 'r') as f:
    party_speech_positions_by_lthing = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/total/party-document-positions.json', 'r') as f:
    party_document_positions = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/party-document-positions.json', 'r') as f:
    party_document_positions_by_lthing = json.loads(f.read())


def get_summary(summary, entityId):
    if entityId not in summary:
        return make_error('Not found')

    return make_json_response(summary[entityId])

def get_summary_by_lthing(summary, lthing, entityId):
    if lthing not in summary:
        return make_error('Not found')

    if entityId not in summary[lthing]:
        return make_error('Not found')

    return make_json_response(summary[lthing][entityId])

# MP

@cache.cached(timeout=summary_cache_timeout)
def get_mp_vote_summary(mp_id):
    return get_summary(mp_vote_summary, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_vote_summary_by_lthing(mp_id, lthing):
    return get_summary_by_lthing(mp_vote_summary_by_lthing, lthing, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_speech_summary(mp_id):
    return get_summary(mp_speech_summary, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_speech_summary_by_lthing(mp_id, lthing):
    return get_summary_by_lthing(mp_speech_summary_by_lthing, lthing, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_document_summary(mp_id):
    return get_summary(mp_document_summary, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_document_summary_by_lthing(mp_id, lthing):
    return get_summary_by_lthing(mp_document_summary_by_lthing, lthing, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_vote_positions(mp_id):
    return get_summary(mp_vote_positions, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_vote_positions_by_lthing(mp_id, lthing):
    return get_summary_by_lthing(mp_vote_positions_by_lthing, lthing, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_speech_positions(mp_id):
    return get_summary(mp_speech_positions, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_speech_positions_by_lthing(mp_id, lthing):
    return get_summary_by_lthing(mp_speech_positions_by_lthing, lthing, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_document_positions(mp_id):
    return get_summary(mp_document_positions, mp_id)

@cache.cached(timeout=summary_cache_timeout)
def get_mp_document_positions_by_lthing(mp_id, lthing):
    return get_summary_by_lthing(mp_document_positions_by_lthing, lthing, mp_id)

# Party
@cache.cached(timeout=summary_cache_timeout)
def get_party_vote_summary(party_id):
    return get_summary(party_vote_summary, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_vote_summary_by_lthing(party_id, lthing):
    return get_summary_by_lthing(party_vote_summary_by_lthing, lthing, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_speech_summary(party_id):
    return get_summary(party_speech_summary, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_speech_summary_by_lthing(party_id, lthing):
    return get_summary_by_lthing(party_speech_summary_by_lthing, lthing, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_document_summary(party_id):
    return get_summary(party_document_summary, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_document_summary_by_lthing(party_id, lthing):
    return get_summary_by_lthing(party_document_summary_by_lthing, lthing, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_vote_positions(party_id):
    return get_summary(party_vote_positions, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_vote_positions_by_lthing(party_id, lthing):
    return get_summary_by_lthing(party_vote_positions_by_lthing, lthing, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_speech_positions(party_id):
    return get_summary(party_speech_positions, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_speech_positions_by_lthing(party_id, lthing):
    return get_summary_by_lthing(party_speech_positions_by_lthing, lthing, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_document_positions(party_id):
    return get_summary(party_document_positions, party_id)

@cache.cached(timeout=summary_cache_timeout)
def get_party_document_positions_by_lthing(party_id, lthing):
    return get_summary_by_lthing(party_document_positions_by_lthing, lthing, party_id)
