from api.mp import get_mps, get_mp_by_id

from flask import blueprints
from flask import jsonify
from flask import make_response

api = blueprints.Blueprint('thingmenn-api', __name__)

prefix = '/api'

api.add_url_rule(prefix + '/mp', 'list_mps', get_mps)
api.add_url_rule(prefix + '/mp/<int:mp_id>', 'get_mp', get_mp_by_id)
