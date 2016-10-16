from api.mps import get_mps, get_mp_by_id
from api.parties import get_parties, get_party_by_id
from api.summary import get_mp_vote_summary, get_party_vote_summary, get_mp_subject_summary, get_mp_nouns, get_party_nouns

from flask import blueprints
from flask import jsonify
from flask import make_response

api = blueprints.Blueprint('thingmenn-api', __name__)

api.add_url_rule('/api/mps', 'list_mps', get_mps)
api.add_url_rule('/api/mps/<int:mp_id>', 'get_mp', get_mp_by_id)

api.add_url_rule('/api/parties', 'list_parties', get_parties)
api.add_url_rule('/api/parties/<string:party_id>', 'get_party', get_party_by_id)

api.add_url_rule('/api/summary/votes/mp/<string:mp_id>', 'get_mp_vote_summary', get_mp_vote_summary)
api.add_url_rule('/api/summary/votes/party/<string:party_id>', 'get_party_vote_summary', get_party_vote_summary)
api.add_url_rule('/api/summary/subjects/mp/<string:mp_id>', 'get_mp_subject_summary', get_mp_subject_summary)
api.add_url_rule('/api/summary/nouns/mp/<string:mp_id>', 'get_mp_nouns', get_mp_nouns)
api.add_url_rule('/api/summary/nouns/party/<string:party_id>', 'get_party_nouns', get_party_nouns)
