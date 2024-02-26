import datetime
import json
import ast
import random

def get_current_time():
    return datetime.datetime.now()

# parser for story event
def parse_to_json(resp):
    return json.loads(resp)
                
def parse_ask_character_to_json(resp):
    try:
        return json.loads(resp)
    except Exception as e:  # incase it the dict keys is wrapped by ' instead of "
        return ast.literal_eval(resp)