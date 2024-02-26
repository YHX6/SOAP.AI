from .db_connection import MongoConnection


class MongoDBUtil:

    @staticmethod
    def get_client():
        return MongoConnection()

    @staticmethod
    def get_db(db_name="erised_db"):
        return MongoConnection().client[db_name]
    
    @staticmethod
    def get_collection(db_name="erised_db", collection="story_play"):
        return MongoConnection().client[db_name][collection]