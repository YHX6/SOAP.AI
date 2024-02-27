class PromptTemplate:

    @staticmethod
    def wrap_setting(prompt):
        return [
            {"role":"system", "content":"You are an assistant agent to help mental health therapist to write their documentation of the therapy. You need to help to extract information from the audio transcript. Do not give your analysis report."},
            {"role":"user", "content":prompt}
        ]


    @staticmethod
    def get_Subject(description):
        return """Generete a structured repsonse by extracting the information for each patient from the description and return in structured format. If there are some part of information that are not mentioned in description, fill that part with {{TBD}}. This is the description: {{{description}}}. Return your response in following JSON format.
        
        Desired format:
        {{
        "Subject":[
            {{"Patient Name":<String>, "Medical and Mental History":<STRING>, "Complaints and problems":<STRING>}},
            {{"Patient Name":<String>, "Medical and Mental History":<STRING>, "Complaints and problems":<STRING>}},
        ]
        }}
        """.format(description=description)
    
    @staticmethod
    def get_Object(transcript):
        return """Generete a structured repsonse by extracting the information for each patient from the description and return in structured format. If there are some part of information that are not mentioned in description, fill that part with {{TBD}}. This is the transcript: {{{transcript}}}. Return your response in following JSON format.
        
        Desired format:
        {{
        "Object":[
            {{"Patient Name":<String>, "Physical observations":<STRING>, "Psychological observations":<STRING>}},
            {{"Patient Name":<String>, "Physical observations":<STRING>, "Psychological observations":<STRING>}},
        ]
        }}
        """.format(transcript=transcript)
    
    @staticmethod
    def get_Assessment(description, transcript, aiprompt, notes):
        return """Generete a structured repsonse by extracting the information for each patient and return in structured format. Emphasize on the doctors' requirement and audio transcript and do not describe patient's demographical information. If there are some part of information that are not mentioned, fill that part with {{TBD}}. 
        Medical history: {{{description}}}
        Audio transcript of therapy: {{{transcript}}}
        Doctors' notes: {{{notes}}}
        Doctors' requirement: {{{aiprompt}}} 
        Return your response in following JSON format.
        
        Desired format:
        {{
        "Assessment":[
            {{"Patient Name":<String>, "DSM criterial/therapeutic Model":<STRING>, "Clinical and professional knowledge":<STRING>}},
            {{"Patient Name":<String>, "DSM criterial/therapeutic Model":<STRING>, "Clinical and professional knowledge":<STRING>}},
        ]
        }}
        """.format(description=description, transcript=transcript, aiprompt=aiprompt, notes=str(notes))



       
    @staticmethod
    def get_Plan(description, transcript, aiprompt, notes):
        return """Generete a structured repsonse by extracting the information for each patient and return in structured format. Emphasize on the doctors' requirement and audio transcript and do not describe patient's demographical information. If there are some part of information that are not mentioned, fill that part with {{TBD}}. 
        Medical history: {{{description}}}
        Audio transcript of therapy: {{{transcript}}}
        Doctors' notes: {{{notes}}}
        Doctors' requirement: {{{aiprompt}}} 
        Return your response in following JSON format.
        
        Desired format:
        {{
        "Plan":[
            {{"Patient Name":<String>, "Next steps for upcoming session":<STRING>, "How to implement treatment plan":<STRING>}},
            {{"Patient Name":<String>, "Next steps for upcoming session":<STRING>, "How to implement treatment plan":<STRING>}},
        ]
        }}
        """.format(description=description, transcript=transcript, aiprompt=aiprompt, notes=str(notes))


    @staticmethod
    def get_customized_section(description, transcript, aiprompt, notes, section_name):
        return """Generete a structured repsonse by extracting the information for each patient and return in structured format. Emphasize on the doctors' requirement and audio transcript and do not describe patient's demographical information. If there are some part of information that are not mentioned, fill that part with {{TBD}}. 
        Medical history: {{{description}}}
        Audio transcript of therapy: {{{transcript}}}
        Doctors' notes: {{{notes}}}
        Doctors' requirement: {{{aiprompt}}} 
        Return your response in following JSON format.
        
        Desired format:
        {{
        "{{{section_name}}}":[
            {{"Patient Name":<String>, "Content":<STRING>}},
            {{"Patient Name":<String>, "Content":<STRING>}},
        ]
        }}
        """.format(description=description, transcript=transcript, aiprompt=aiprompt, notes=str(notes), section_name=section_name)


