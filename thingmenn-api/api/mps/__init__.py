# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json
from api.helpers import make_json_response, make_error
from api.cache import cache

mp_cache_timeout = 1800

mps = []
mp_lookup = {}
mps_by_lthing = {}

similar_mp_votes = {}
similar_mp_votes_by_lthing = {}
different_mp_votes = {}
different_mp_votes_by_lthing = {}

def shouldShowMp(mp):
    onlySubstitute = mp['onlySubstitute']

    return not onlySubstitute

with open(path.dirname(__file__) + '/../../data/v2/mps.json', 'r') as mpFile:
    mps = json.loads(mpFile.read())
    for index, mp in enumerate(mps):
        mp_lookup[mp['id']] = index

with open(path.dirname(__file__) + '/../../data/v2/mps-by-lthing.json', 'r') as mpFile:
    mpsByLthing = json.loads(mpFile.read())
    for lthing in mpsByLthing:
        lthingAsInt = int(lthing)
        mps_by_lthing[lthingAsInt] = []
        for index, mp in enumerate(mpsByLthing[lthing]):
            mpIdAsInt = int(mp['id'])
            mpDetails = mps[mp_lookup[mpIdAsInt]]
            mps_by_lthing[lthingAsInt].append(mpDetails)

with open(path.dirname(__file__) + '/../../data/v2/total/mp-similar-votes.json', 'r') as f:
    similar_mp_votes = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-similar-votes.json', 'r') as f:
    similarMpVotesByLthing = json.loads(f.read())
    for lthing in similarMpVotesByLthing:
        lthingAsInt = int(lthing)
        similar_mp_votes_by_lthing[lthingAsInt] = {}
        for mpId in similarMpVotesByLthing[lthing]:
            mpIdAsInt = int(mpId)
            mpSimilarVotes = similarMpVotesByLthing[lthing][mpId]
            similar_mp_votes_by_lthing[lthingAsInt][mpIdAsInt] = mpSimilarVotes

with open(path.dirname(__file__) + '/../../data/v2/total/mp-different-votes.json', 'r') as f:
    different_mp_votes = json.loads(f.read())

with open(path.dirname(__file__) + '/../../data/v2/by-lthing/mp-different-votes.json', 'r') as f:
    differentMpVotesByLthing = json.loads(f.read())
    for lthing in similarMpVotesByLthing:
        lthingAsInt = int(lthing)
        different_mp_votes_by_lthing[lthingAsInt] = {}
        for mpId in differentMpVotesByLthing[lthing]:
            mpIdAsInt = int(mpId)
            mpSimilarVotes = differentMpVotesByLthing[lthing][mpId]
            different_mp_votes_by_lthing[lthingAsInt][mpIdAsInt] = mpSimilarVotes


@cache.cached(timeout=mp_cache_timeout)
def get_mps():
    return make_json_response(mps)

@cache.cached(timeout=mp_cache_timeout)
def get_mps_by_lthing(lthing):
    return make_json_response(mps_by_lthing[lthing])

@cache.cached(timeout=mp_cache_timeout)
def get_mp_by_id(mp_id):
    if mp_id not in mp_lookup:
        return make_error('Not found')

    mp_index = mp_lookup[mp_id]
    return make_json_response(mps[mp_index])

@cache.cached(timeout=mp_cache_timeout)
def get_similar_mps(mp_id):
    mpIdAsString = str(mp_id)
    if mpIdAsString not in similar_mp_votes:
        return make_error('Not found')

    return make_json_response(similar_mp_votes[mpIdAsString])

@cache.cached(timeout=mp_cache_timeout)
def get_similar_mps_by_lthing(lthing, mp_id):
    if lthing not in similar_mp_votes_by_lthing:
        return make_error('Not found')

    if mp_id not in similar_mp_votes_by_lthing[lthing]:
        return make_error('Not found')

    return make_json_response(similar_mp_votes_by_lthing[lthing][mp_id])

@cache.cached(timeout=mp_cache_timeout)
def get_different_mps(mp_id):
    mpIdAsString = str(mp_id)
    if mpIdAsString not in different_mp_votes:
        return make_error('Not found')

    return make_json_response(different_mp_votes[mpIdAsString])

@cache.cached(timeout=mp_cache_timeout)
def get_different_mps_by_lthing(lthing, mp_id):
    if lthing not in different_mp_votes_by_lthing:
        return make_error('Not found')

    if mp_id not in different_mp_votes_by_lthing[lthing]:
        return make_error('Not found')

    return make_json_response(different_mp_votes_by_lthing[lthing][mp_id])
