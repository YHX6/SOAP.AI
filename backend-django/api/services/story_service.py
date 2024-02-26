from ..scripts.script_util import PromptTemplate
from ..ai_models.openai_api import OpenAIAPI
import datetime
from ..utils.utils import *






 ##############################################################################################################################################
 ## Below are the functions to for the logic
 ##############################################################################################################################################

def documentation_tool_task(req):
    #  get parameters from request
    task, prompt, scriptplay_id, order = req["script_name"], req["task"], req["prompt"], req["scriptplay_id"], req["order"]
    print("task",task)


        
    # for each task, write logic here
    if task == "ASK_STORY":
        try:
            resp = OpenAIAPI.send_prompt(prompt = prompt+ " "+  PromptTemplate.ask_story(username))
            res = parse_to_json(resp)  # parse response into　 json
        except:
            resp = OpenAIAPI.send_prompt(prompt = prompt+ " "+  PromptTemplate.ask_story(username))
            res = parse_to_json(resp)

        return res
  