from api.mp import get_mps, get_mp_by_id
from api.summary import get_mp_vote_summary, get_mp_subject_summary, get_mp_nouns

from flask import blueprints
from flask import jsonify
from flask import make_response

api = blueprints.Blueprint('thingmenn-api', __name__)

prefix = '/api'

api.add_url_rule(prefix + '/mps', 'list_mps', get_mps)
api.add_url_rule(prefix + '/mps/<int:mp_id>', 'get_mp', get_mp_by_id)

summary_prefix = prefix + '/summary'
api.add_url_rule(summary_prefix + '/votes/mp/<string:mp_id>', 'get_mp_vote_summary', get_mp_vote_summary)
api.add_url_rule(summary_prefix + '/subjects/mp/<string:mp_id>', 'get_mp_subject_summary', get_mp_subject_summary)
api.add_url_rule(summary_prefix + '/nouns/mp/<string:mp_id>', 'get_mp_nouns', get_mp_nouns)
