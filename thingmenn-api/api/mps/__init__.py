# coding=utf-8

from flask import jsonify
from flask import make_response
from os import path
import json

mps = []
lookup = {}

with open(path.dirname(__file__) + '/../../data/mps.json', 'r') as mpFile:
    mps = json.loads(mpFile.read())
    mps = [mp for mp in mps if mp['isPrimary'] is True]
    for index, mp in enumerate(mps):
        lookup[int(mp['id'])] = index

def get_mps():
    print 'getting mps!'
    response = jsonify(mps)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

def get_mp_by_id(mp_id):
    if mp_id not in lookup:
        return '404'

    mp_index = lookup[mp_id]
    response = jsonify(mps[mp_index])
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response