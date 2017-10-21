from api.mps import get_mps, get_mp_by_id, get_similar_mps, get_different_mps
from api.mps import get_mps_by_lthing, get_mp_by_id_by_lthing, get_similar_mps_by_lthing, get_different_mps_by_lthing
from api.parties import get_parties, get_party_by_id

from api.summary import get_mp_vote_summary, get_mp_speech_summary, get_mp_document_summary
from api.summary import get_mp_vote_positions, get_mp_speech_positions, get_mp_document_positions
from api.summary import get_party_vote_summary, get_party_speech_summary, get_party_document_summary
from api.summary import get_party_vote_positions, get_party_speech_positions, get_party_document_positions

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
api.add_url_rule('/api/lthing/<int:lthing>/mps/<int:mp_id>', 'get_mp_by_lthing', get_mp_by_id_by_lthing)
api.add_url_rule('/api/lthing/<int:lthing>/mps/<int:mp_id>/similar', 'get_similar_mps_by_lthing', get_similar_mps_by_lthing)
api.add_url_rule('/api/lthing/<int:lthing>/mps/<int:mp_id>/different', 'get_different_mps_by_lthing', get_different_mps_by_lthing)

api.add_url_rule('/api/parties', 'list_parties', get_parties)
api.add_url_rule('/api/parties/<string:party_id>', 'get_party', get_party_by_id)

# mp summaries total
api.add_url_rule('/api/summary/votes/mp/<string:mp_id>', 'get_mp_vote_summary', get_mp_vote_summary)
api.add_url_rule('/api/summary/speeches/mp/<string:mp_id>', 'get_mp_speech_summary', get_mp_speech_summary)
api.add_url_rule('/api/summary/documents/mp/<string:mp_id>', 'get_mp_document_summary', get_mp_document_summary)

# mp positions total
api.add_url_rule('/api/positions/votes/mp/<string:mp_id>', 'get_mp_vote_positions', get_mp_vote_positions)
api.add_url_rule('/api/positions/speeches/mp/<string:mp_id>', 'get_mp_speech_positions', get_mp_speech_positions)
api.add_url_rule('/api/positions/documents/mp/<string:mp_id>', 'get_mp_document_positions', get_mp_document_positions)

# party summaries total
api.add_url_rule('/api/summary/votes/party/<string:party_id>', 'get_party_vote_summary', get_party_vote_summary)
api.add_url_rule('/api/summary/speeches/party/<string:party_id>', 'get_party_speech_summary', get_party_speech_summary)
api.add_url_rule('/api/summary/documents/party/<string:party_id>', 'get_party_document_summary', get_party_document_summary)

# party positions total
api.add_url_rule('/api/positions/votes/party/<string:party_id>', 'get_party_vote_positions', get_party_vote_positions)
api.add_url_rule('/api/positions/speeches/party/<string:party_id>', 'get_party_speech_positions', get_party_speech_positions)
api.add_url_rule('/api/positions/documents/party/<string:party_id>', 'get_party_document_positions', get_party_document_positions)

api.add_url_rule('/api/top/attendance/mps', 'get_top_mp_attendance', get_top_mp_attendance)
api.add_url_rule('/api/top/minutes/mps', 'get_top_mp_minutes_talked', get_top_mp_minutes_talked)
api.add_url_rule('/api/top/stands/mps', 'get_top_mp_stands_taken', get_top_mp_stands_taken)

api.add_url_rule('/api/bottom/attendance/mps', 'get_bottom_mp_attendance', get_bottom_mp_attendance)
api.add_url_rule('/api/bottom/minutes/mps', 'get_bottom_mp_minutes_talked', get_bottom_mp_minutes_talked)
api.add_url_rule('/api/bottom/stands/mps', 'get_bottom_mp_stands_taken', get_bottom_mp_stands_taken)
