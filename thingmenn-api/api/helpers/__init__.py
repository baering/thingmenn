from flask import jsonify

def make_json_response(json):
    response = jsonify(json)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

def make_error(reason, status_code=404):
    responseDict = {
        'error': reason
    }

    response = jsonify(responseDict)
    response.status_code = status_code
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response
