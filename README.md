# SOAP.AI   -- Documentation Tool

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

