from django.urls import path
from .views import DocumentationToolApiView


urlpatterns = [
    path("document-tool", DocumentationToolApiView.as_view()),
]