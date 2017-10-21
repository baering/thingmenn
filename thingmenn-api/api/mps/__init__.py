# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error
from api.cache import cache

mp_cache_timeout = 1800

mps = []
mpsByLthing = {}
mpLookup = {}
mpByLthingLookup = {}

similar_mp_votes = {}
different_mp_votes = {}

def shouldShowMp(mp):
    isSubstitute = mp['isSubstitute']
    isAlive = mp['id'] != '683' and mp['id'] != '477'

    return not isSubstitute and isAlive

with open(path.dirname(__file__) + '/../../data/v2/mps.json', 'r') as mpFile:
    mps = json.loads(mpFile.read())
    for index, mp in enumerate(mps):
        mpLookup[mp['id']] = index

with open(path.dirname(__file__) + '/../../data/v2/mps-by-lthing.json', 'r') as mpFile:
    mpsByLthing = json.loads(mpFile.read())
    for lthing in mpsByLthing:
        lthingAsInt = int(lthing)
        mpByLthingLookup[lthingAsInt] = []
        for index, mp in enumerate(mpsByLthing[lthing]):
            mpDetails = mps[mpLookup[mp['id']]]
            mpByLthingLookup[lthingAsInt].append(mpDetails)

with open(path.dirname(__file__) + '/../../data/mp-similar-votes.json', 'r') as f:
    similar_mp_votes = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/mp-different-votes.json', 'r') as f:
    different_mp_votes = json.loads(f.read())


@cache.cached(timeout=mp_cache_timeout)
def get_mps():
    return make_json_response(mps)

@cache.cached(timeout=mp_cache_timeout)
def get_mps_by_lthing(lthing):
    return make_json_response(mpByLthingLookup[lthing])

@cache.cached(timeout=mp_cache_timeout)
def get_mp_by_id(mp_id):
    if mp_id not in mpLookup:
        return make_error('Not found')

    mp_index = mpLookup[mp_id]
    return make_json_response(mps[mp_index])

@cache.cached(timeout=mp_cache_timeout)
def get_similar_mps(mp_id):
    if mp_id not in similar_mp_votes:
        return make_error('Not found')

    return make_json_response(similar_mp_votes[mp_id])

@cache.cached(timeout=mp_cache_timeout)
def get_different_mps(mp_id):
    if mp_id not in different_mp_votes:
        return make_error('Not found')

    return make_json_response(different_mp_votes[mp_id])
