# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json

mps = []
mp_vote_summary_lookup = {}

with open(path.dirname(__file__) + '/../../data/mp-vote-summaries.json', 'r') as summaryFile:
    mp_vote_summary_lookup = json.loads(summaryFile.read())

def get_mp_vote_summary(mp_id):
    if mp_id not in mp_vote_summary_lookup:
        return '404'

    summary_for_mp = mp_vote_summary_lookup[mp_id]
    response = jsonify(summary_for_mp)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response
