from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from .services.story_service import *



# start a new story play 
class DocumentationToolApiView(APIView):
    def post(self, request, format=None):
        # some times the AI response does not fit the json format and will run into error
        # try twice in that case
        try:
            res = documentation_tool_task(request.data)
            return Response(res, status=status.HTTP_200_OK)
        except Exception as e:
            try:
                res = documentation_tool_task(request.data)
                return Response(res, status=status.HTTP_200_OK)
            except:
                return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
