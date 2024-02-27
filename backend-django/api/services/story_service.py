from ..scripts.script_util import PromptTemplate
from ..ai_models.openai_api import OpenAIAPI
import datetime
from ..utils.utils import *






 ##############################################################################################################################################
 ## Below are the functions to for the logic
 ##############################################################################################################################################

def documentation_tool_task(req):
    #  get parameters from request
    task =  req["task"]
    print("task",task)


        
    # for each task, write logic here
    if task == "ASK_SUBJECT":
        aiprompt, content =  req["prompt"], req["content"]

        messages = PromptTemplate.wrap_setting(prompt=PromptTemplate.get_Subject(description=content))
        resp = OpenAIAPI.send_messages(messages=messages)
        # resp = '{\n   "Subject":[\n       {"Patient Name":"Alice", "Medical and Mental History":"Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.", "Complaints and problems":"Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings."},\n   ]\n}'
        print(resp)
        res = parse_to_json_2(resp)
        return {"data":res, "title": "Subject"}
    
    elif task == "ASK_OBJECT":
        aiprompt, transcript, notes =  req["prompt"], req["transcript"], req["notes"]

        messages = PromptTemplate.wrap_setting(prompt=PromptTemplate.get_Object(transcript=transcript))
        resp = OpenAIAPI.send_messages(messages=messages)
        print(resp)
        res = parse_to_json_2(resp)
        return {"data":res, "title": "Object"}

    elif task == "ASK_ASSESSMENT":
        aiprompt, transcript, notes, description =  req["prompt"], req["transcript"], req["notes"], req["description"]

        messages = PromptTemplate.wrap_setting(prompt=PromptTemplate.get_Assessment(description=description, transcript=transcript, aiprompt=aiprompt, notes=notes))
        resp = OpenAIAPI.send_messages(messages=messages)
        print(resp)
        res = parse_to_json_2(resp)
        return {"data":res, "title": "Assessment"}
    
    elif task == "ASK_PLAN":
        aiprompt, transcript, notes, description =  req["prompt"], req["transcript"], req["notes"], req["description"]

        messages = PromptTemplate.wrap_setting(prompt=PromptTemplate.get_Plan(description=description, transcript=transcript, aiprompt=aiprompt, notes=notes))
        resp = OpenAIAPI.send_messages(messages=messages)
        print(resp)
        res = parse_to_json_2(resp)
        return {"data":res, "title": "Plan"}
    
    elif task == "ASK_CUSTOMIZE":
        section_name, aiprompt, transcript, notes, description = req["section_name"], req["prompt"], req["transcript"], req["notes"], req["description"]

        messages = PromptTemplate.wrap_setting(prompt=PromptTemplate.get_customized_section(description=description, transcript=transcript, aiprompt=aiprompt, notes=notes, section_name=section_name))
        resp = OpenAIAPI.send_messages(messages=messages)
        print(resp)
        res = parse_to_json_2(resp)
        return {"data":res, "title": section_name}