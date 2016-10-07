# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json

mps = []
lookup = {}

with open(path.dirname(__file__) + '/../../data/mps.json', 'r') as mpFile:
    mps = json.loads(mpFile.read())
    for index, mp in enumerate(mps):
        lookup[int(mp['id'])] = index

def get_mps():
    print 'getting mps!'
    return jsonify(mps)

def get_mp_by_id(mp_id):
    print mp_id
    print '=========='
    if mp_id not in lookup:
        return '404'

    mp_index = lookup[mp_id]
    return jsonify(mps[mp_index])
