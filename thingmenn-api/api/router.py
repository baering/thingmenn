from api.mps import get_mps_by_lthing, get_mp_by_id_by_lthing, get_similar_mps_by_lthing, get_different_mps_by_lthing
from api.parties import get_parties, get_party_by_id

from api.summary import get_mp_vote_summary_by_lthing, get_mp_speech_summary_by_lthing, get_mp_document_summary_by_lthing
from api.summary import get_mp_vote_positions_by_lthing, get_mp_speech_positions_by_lthing, get_mp_document_positions_by_lthing
from api.summary import get_mp_absent_day_time_summary_by_lthing

from api.summary import get_party_vote_summary_by_lthing, get_party_speech_summary_by_lthing, get_party_document_summary_by_lthing
from api.summary import get_party_vote_positions_by_lthing, get_party_speech_positions_by_lthing, get_party_document_positions_by_lthing
from api.summary import get_party_absent_day_time_summary_by_lthing

from api.lthings import get_lthings, get_terms

from api.top import get_top_mp_attendance, get_bottom_mp_attendance, get_top_mp_minutes_talked, get_bottom_mp_minutes_talked, get_top_mp_stands_taken, get_bottom_mp_stands_taken

from flask import blueprints

api = blueprints.Blueprint('thingmenn-api', __name__)

api.add_url_rule('/api/lthing/<string:lthing>/mps', 'list_mps_by_lthing', get_mps_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/mps/<string:mp_id>', 'get_mp_by_lthing', get_mp_by_id_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/mps/<string:mp_id>/similar', 'get_similar_mps_by_lthing', get_similar_mps_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/mps/<string:mp_id>/different', 'get_different_mps_by_lthing', get_different_mps_by_lthing)

api.add_url_rule('/api/lthing/allt/parties', 'list_parties', get_parties)
api.add_url_rule('/api/lthing/allt/parties/<string:party_id>', 'get_party', get_party_by_id)

# mp summaries by lthing
api.add_url_rule('/api/lthing/<string:lthing>/summary/votes/mp/<string:mp_id>', 'get_mp_vote_summary_by_lthing', get_mp_vote_summary_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/summary/speeches/mp/<string:mp_id>', 'get_mp_speech_summary_by_lthing', get_mp_speech_summary_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/summary/documents/mp/<string:mp_id>', 'get_mp_document_summary_by_lthing', get_mp_document_summary_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/summary/absent/mp/<string:mp_id>', 'get_mp_absent_day_time_summary', get_mp_absent_day_time_summary_by_lthing)

# mp positions by lthing
api.add_url_rule('/api/lthing/<string:lthing>/positions/votes/mp/<string:mp_id>', 'get_mp_vote_positions_by_lthing', get_mp_vote_positions_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/positions/speeches/mp/<string:mp_id>', 'get_mp_speech_positions_by_lthing', get_mp_speech_positions_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/positions/documents/mp/<string:mp_id>', 'get_mp_document_positions_by_lthing', get_mp_document_positions_by_lthing)

# party summaries by lthing
api.add_url_rule('/api/lthing/<string:lthing>/summary/votes/party/<string:party_id>', 'get_party_vote_summary_by_lthing', get_party_vote_summary_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/summary/speeches/party/<string:party_id>', 'get_party_speech_summary_by_lthing', get_party_speech_summary_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/summary/documents/party/<string:party_id>', 'get_party_document_summary_by_lthing', get_party_document_summary_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/summary/absent/party/<string:party_id>', 'get_party_absent_day_time_summary', get_party_absent_day_time_summary_by_lthing)

# party positions by lthing
api.add_url_rule('/api/lthing/<string:lthing>/positions/votes/party/<string:party_id>', 'get_party_vote_positions_by_lthing', get_party_vote_positions_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/positions/speeches/party/<string:party_id>', 'get_party_speech_positions_by_lthing', get_party_speech_positions_by_lthing)
api.add_url_rule('/api/lthing/<string:lthing>/positions/documents/party/<string:party_id>', 'get_party_document_positions_by_lthing', get_party_document_positions_by_lthing)

api.add_url_rule('/api/lthing/<string:lthing>/top/attendance/mps', 'get_top_mp_attendance', get_top_mp_attendance)
api.add_url_rule('/api/lthing/<string:lthing>/top/minutes/mps', 'get_top_mp_minutes_talked', get_top_mp_minutes_talked)
api.add_url_rule('/api/lthing/<string:lthing>/top/stands/mps', 'get_top_mp_stands_taken', get_top_mp_stands_taken)

api.add_url_rule('/api/lthing/<string:lthing>/bottom/attendance/mps', 'get_bottom_mp_attendance', get_bottom_mp_attendance)
api.add_url_rule('/api/lthing/<string:lthing>/bottom/minutes/mps', 'get_bottom_mp_minutes_talked', get_bottom_mp_minutes_talked)
api.add_url_rule('/api/lthing/<string:lthing>/bottom/stands/mps', 'get_bottom_mp_stands_taken', get_bottom_mp_stands_taken)

api.add_url_rule('/api/lthings', 'get_lthings', get_lthings)
api.add_url_rule('/api/terms', 'get_terms', get_terms)
