# coding=utf-8

import logging
from flask import Flask
from api import router

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

app.register_blueprint(router.api)

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500
