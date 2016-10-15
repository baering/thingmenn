# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json

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

def get_mp_vote_summary(mp_id):
    if mp_id not in mp_vote_summary_lookup:
        return '404'

    summary_for_mp = mp_vote_summary_lookup[mp_id]
    response = jsonify(summary_for_mp)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

def get_mp_subject_summary(mp_id):
    if mp_id not in mp_subject_summary_lookup:
        return '404'

    summary_for_mp = mp_subject_summary_lookup[mp_id]
    response = jsonify(summary_for_mp)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

def get_mp_nouns(mp_id):
    if mp_id not in mp_noun_lookup:
        return '404'

    summary_for_mp = mp_noun_lookup[mp_id]
    response = jsonify(summary_for_mp)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response
