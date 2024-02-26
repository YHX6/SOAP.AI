import openai
from dotenv import load_dotenv
import os
import requests

#This class contains the functions to send request to openai for text generation,image generation

class OpenAIAPI:
    # load local parameters
    load_dotenv()
    client = openai.AzureOpenAI(
        api_key = os.getenv("OPENAI_API_KEY"),
        api_version = os.getenv("OPENAI_API_VERSION"),
        azure_endpoint = os.getenv("OPENAI_API_ENDPOINT"),
    )
    
 ##############################################################################################################################################
 ## Below are the functions to set openai model parameters and send to openai
 ##############################################################################################################################################
    @staticmethod
    def send_prompt(prompt, model = "gpt-35-turbo", is_json=False):
        if is_json:
            response = OpenAIAPI.client.chat.completions.create(
                model= model, # model = "deployment_name".
                response_format={ "type": "json_object" },
                messages=[{"role": "user", "content": prompt}]
            )
        else:
            response = OpenAIAPI.client.chat.completions.create(
                model= model, # model = "deployment_name".
                messages=[{"role": "user", "content": prompt}]
            )
        
        resp =response.choices[0].message.content
        return resp

    @staticmethod
    def send_messages(messages, model = "gpt-35-turbo", is_json=False):
        if is_json:
            response = OpenAIAPI.client.chat.completions.create(
                model= model, 
                response_format={ "type": "json_object" },
                messages=messages
            )
        else:
            response = OpenAIAPI.client.chat.completions.create(
                model= model, 
                messages=messages
            )
        
        resp =response.choices[0].message.content
        return resp

