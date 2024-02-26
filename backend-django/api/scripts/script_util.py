class PromptTemplate:

    @staticmethod
    def wrap_prompt_settings(prompt):
        return "asd"

    # Below are some of the prompt example of our previous project

    # @staticmethod
    # def wrap_prompt_head(prompt):
    #     return "You are a story generator for a role-playing game for children. The user plays the main character, and you create random follow-up stories, to help the children experience the entire narrative. This is the previous story: " + prompt
    
    # @staticmethod
    # def ask_story(username):
    #     return """Using the preceding story, generate the next storyline in 30 words. It is for children's reading so you need to make your response easy and simple. Present the outcome in JSON format with the following structure:
    
    #     Desired format:
    #     {{    
    #         story: <STRING>
    #     }}""".format(username=username)

    # @staticmethod
    # def ask_options(username):
    #     return """Using the preceding story, generate the next storyline in 30 words. Include a decision-making question and three options. The question should be in 15 words and each option in 3 to 5 words. Present the results in JSON format as follows:
        
    #     Desired format:
    #     {{    
    #         question: <STRING>,
    #         option_1: <STRING>,
    #         option_2: <STRING>,
    #         option_3: <STRING>,
    #     }}""".format(username=username)

    # @staticmethod
    # def continue_options(username, choice):
    #     return  """{username} made his choice as: {choice}. Generate the next storyline in 30 words. It is for children's reading so you need to make your response easy and simple. Present the outcome in JSON format with the following structure:

    #     Desired format:
    #     {{    
    #         story: <STRING>
    #     }}""".format(username=username,choice=choice)

    # @staticmethod
    # def ask_character(username):
    #     return """Using the preceding story, generate the next storyline in 30 words. Include a character that {username} is going to converse with. Give a short description of this character and provide the character's first sentence he/she said to {username} in the conversation. Present the results in JSON format as specified:
        
    #     Desired format:
    #     {{    
    #         character_name: <STRING>,
    #         character_description: <STRING>,
    #         first_sentence: <STRING>,
    #     }}""".format(username=username)

    # @staticmethod
    # def get_chat_background(username, character_name, character_description, prompt):
    #     return """You are a role-playing agent. Now you should play the character: {character_name}. The user will be: {username}. Your job is to have a conversation with {username} as if you are the {character_name} in the following story. This is your role description: {character_description}. Your response should be less than 15 words and simple. The following is the story background of how {username} meets {character_name}:
        
    # Backgroud Story:
    #     {{{prompt}}}""".format(username = username, character_name=character_name, character_description=character_description,  prompt=prompt)
    

    # @staticmethod
    # def map_messages(message, character_name, username):
    #     return (username if message["role"] == "user" else character_name) + ": \""+ message["content"] + "\""
 
    # @staticmethod
    # def end_conversation(messages, character_name, username):
    #     return """This is the conversation {username} had with the character: {conversation}. Using the preceding story and conversation, generate the next storyline in 30 words. It is for children's reading so you need to make your response easy and simple. Present the outcome in JSON format with the following structure:

    #     Desired format:
    #     {{ 
    #         story: <STRING>,
    #     }}""".format(username=username, conversation=str([PromptTemplate.map_messages(message, character_name, username) for message in messages[1:]]))


    # # summarize
    # @staticmethod
    # def summarize_prompt(prompt):
    #     return "Summarize the story in 150 words: " + prompt