from django.urls import path

from chatbot import views
urlpatterns = [
    path('send/', views.send, name = 'sendRequest')
]