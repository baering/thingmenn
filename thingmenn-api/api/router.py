from api.mps import get_mps, get_mp_by_id, get_similar_mps, get_different_mps
from api.mps import get_mps_by_lthing, get_similar_mps_by_lthing, get_different_mps_by_lthing
from api.parties import get_parties, get_party_by_id
from api.summary import get_mp_vote_summary, get_party_vote_summary, get_mp_subject_summary, get_party_subject_summary, get_mp_nouns, get_party_nouns, get_mp_speech_statistics, get_party_speech_statistics
from api.top import get_top_mp_attendance, get_bottom_mp_attendance, get_top_mp_minutes_talked, get_bottom_mp_minutes_talked, get_top_mp_stands_taken, get_bottom_mp_stands_taken

from flask import blueprints
from flask import jsonify
from flask import make_response

api = blueprints.Blueprint('thingmenn-api', __name__)

api.add_url_rule('/api/mps', 'list_mps', get_mps)
api.add_url_rule('/api/mps/<int:mp_id>', 'get_mp', get_mp_by_id)
api.add_url_rule('/api/mps/<int:mp_id>/similar', 'get_similar_mps', get_similar_mps)
api.add_url_rule('/api/mps/<int:mp_id>/different', 'get_different_mps', get_different_mps)

api.add_url_rule('/api/lthing/<int:lthing>/mps/', 'list_mps_by_lthing', get_mps_by_lthing)
api.add_url_rule('/api/lthing/<int:lthing>/mps/<int:mp_id>/similar', 'get_similar_mps_by_lthing', get_similar_mps_by_lthing)
api.add_url_rule('/api/lthing/<int:lthing>/mps/<int:mp_id>/different', 'get_different_mps_by_lthing', get_different_mps_by_lthing)

api.add_url_rule('/api/parties', 'list_parties', get_parties)
api.add_url_rule('/api/parties/<string:party_id>', 'get_party', get_party_by_id)

api.add_url_rule('/api/summary/votes/mp/<string:mp_id>', 'get_mp_vote_summary', get_mp_vote_summary)
api.add_url_rule('/api/summary/votes/party/<string:party_id>', 'get_party_vote_summary', get_party_vote_summary)
api.add_url_rule('/api/summary/subjects/mp/<string:mp_id>', 'get_mp_subject_summary', get_mp_subject_summary)
api.add_url_rule('/api/summary/subjects/party/<string:party_id>', 'get_party_subject_summary', get_party_subject_summary)
api.add_url_rule('/api/summary/nouns/mp/<string:mp_id>', 'get_mp_nouns', get_mp_nouns)
api.add_url_rule('/api/summary/nouns/party/<string:party_id>', 'get_party_nouns', get_party_nouns)
api.add_url_rule('/api/summary/speeches/mp/<string:mp_id>', 'get_mp_speech_statistics', get_mp_speech_statistics)
api.add_url_rule('/api/summary/speeches/party/<string:party_id>', 'get_party_speech_statistics', get_party_speech_statistics)

api.add_url_rule('/api/top/attendance/mps', 'get_top_mp_attendance', get_top_mp_attendance)
api.add_url_rule('/api/top/minutes/mps', 'get_top_mp_minutes_talked', get_top_mp_minutes_talked)
api.add_url_rule('/api/top/stands/mps', 'get_top_mp_stands_taken', get_top_mp_stands_taken)

api.add_url_rule('/api/bottom/attendance/mps', 'get_bottom_mp_attendance', get_bottom_mp_attendance)
api.add_url_rule('/api/bottom/minutes/mps', 'get_bottom_mp_minutes_talked', get_bottom_mp_minutes_talked)
api.add_url_rule('/api/bottom/stands/mps', 'get_bottom_mp_stands_taken', get_bottom_mp_stands_taken)
