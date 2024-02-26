from .utils.db_util import MongoDBUtil
import uuid
from .utils.utils import get_current_time


# scripts
from .scripts.HarryPotterConfig import HarryPotter
from .scripts.ThreeBodyConfig import ThreeBody


class ScriptPlayDAO:
    collection = MongoDBUtil.get_collection()


    @staticmethod
    def create_new_script_play(user_id, script="HarryPotter"):
        Script_class = HarryPotter

        if script == "ThreeBody":
            Script_class = ThreeBody

        story = Script_class.first_story # the first story
        
        data = {
            "_id": str(uuid.uuid4()),
            "user_id": user_id,
            "script": script,
            "start_time": get_current_time(),
            "end_time": get_current_time(),
            "pages": 1,
            "playdata":[        
                {
                    "story":story,
                    "type":"story-description",
                    "order":1,
                    "timestamp":get_current_time(),
                },
            ],
        }
        inserted_id = ScriptPlayDAO.collection.insert_one(data).inserted_id
        res = {
            "scriptplay_id":inserted_id, 
            "script":script,
            "user_name":Script_class.username,
            "pages": 1,
            "data":  {
                    "story":story,
                    "type":"story-description",
                    "order":1,
                    "timestamp":get_current_time(),
                },
            }
        return res
    

    @staticmethod
    def add_gameplay_data(object_id, order, data):
        data["order"] = order
        data["timestamp"] = get_current_time()
        query = {"_id": object_id}  
        update = {
            "$push": {"playdata": {"$each": [data],}},
            "$set":{"end_time":get_current_time()},
            "$inc": {"pages": 1},
        }
        return ScriptPlayDAO.collection.update_one(query, update)
    
    @staticmethod
    def add_option_choice(object_id, order,choice):
        query = {"_id": object_id, "playdata.order": order}  
        update = {
            "$set": {
                "playdata.$.choice": choice,  # Update the "choice
                "end_time":get_current_time(),
            },
        }
        return ScriptPlayDAO.collection.update_one(query, update)
    
    @staticmethod
    def add_character_conversation(object_id, order,messages):
        query = {"_id": object_id, "playdata.order": order}  
        # add time stamp
        for msg in messages:
            msg["timestamp"] = get_current_time()
        update = {
            "$set": {
                "playdata.$.messages": messages,  # Update the "choice
                "end_time":get_current_time(),
            },
        }
        return ScriptPlayDAO.collection.update_one(query, update)

    

    # find srcipt play
    @staticmethod
    def find_all_scriptplay(user_id):
        query = {"user_id":user_id}
        fields = {
            "_id":1,
            "script":1,
            "start_time":1,
            "end_time":1,
            "pages": 1,
            "script_name":1,
        }
        res = []
        for r in ScriptPlayDAO.collection.find(query, fields):
            res.append(r)
        return res
    
    @staticmethod
    def find_scriptplay_by_id(_id):
        return ScriptPlayDAO.collection.find_one({"_id":_id})
 