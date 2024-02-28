# SOAP.AI   -- Documentation Tool

## Description
Therapists spend a significant amount of time on documentation, which includes recording client progress, treatment plans, and session notes. This administrative task can be time-consuming and can take away from the valuable time therapists have to interact with and provide direct support to their clients.

An AI-enabled documentation tool has the potential to significantly improve therapy by streamlining record-keeping, enhancing data accuracy, and providing data-driven insights for personalized care.

SOAP.AI use the AI tools to help theprapist to extract basic therapy session information (date, location, participants information) and patient's information (following SOAP structure, Subject, Object, Assessment, Plan) in a therapy, especially a group therapy. After the master report is generated, SOAP.AI will also generate individual reports for each patient automatically. 

Moreover, we provide therapists are AI-boosted editor tool to customize information extraction by allowing to set prompt and section name for the information needed.

Here is a structure of the document of SOAP.AI

-- Group Identifier
-- Date of Session
-- Time of Session
-- Location
-- participants
    -- Therapists
    -- Patients

-- Subject(For each patient)
    -- Patient Name
    -- Medical and Mental History
    -- Complaints and problems

-- Object(For each patient)
    -- Patient Name
    -- Physical observations
    -- Psychological observations

-- Assessment(For each patient)
    -- Patient Name
    -- DSM criterial/therapeutic Model
    -- Clinical and professional knowledge

-- Plan(For each patient)
    -- Patient Name
    -- Next steps for upcoming session
    -- How to implement treatment plan

-- Other Customized Section Defined by users


## Versions/Environment
node  v21.6.2 (tested on node v19 and it works)
npm v10.2.4
python 3


## First Settup

### Frontend

Create a `.env` file in your `/frontend` folder and add this line into it

```
REACT_APP_BACKEND_HOST="http://localhost:8000"
```

then run following command in your terminal

```shell
cd path_to_your_project/frontend
npm install
npm start
```





### Backend

Create a `.env` file in your `/backend-django` folder and add these lines into it  (Replace information ...)

```
OPENAI_API_KEY="..."
OPENAI_API_VERSION="."
OPENAI_API_ENDPOINT="."
```

Open a new terminal, then run following command in terminal

```shell
cd path_to_your_project/backend-django
conda create --name yourenvname python=3.9
conda activate yourenvname
pip install -r requirements.txt
python manage.py runserver
```


## Run if you finish settup before
Start backend server

```shell
cd path_to_your_project/backend-django
conda activate yourenvname
python manage.py runserver
```

Start frontend app
```shell
cd path_to_your_project/frontend
npm install
```

