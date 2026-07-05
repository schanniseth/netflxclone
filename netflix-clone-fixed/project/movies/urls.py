from django.urls import path
from . import views

urlpatterns = [
    path("<int:movie_id>/", views.movie_detail, name="movie_detail"),
    path("<int:movie_id>/watch/", views.watch, name="watch"),
    path("<int:movie_id>/mylist/toggle/", views.toggle_mylist, name="toggle_mylist"),
    path("<int:movie_id>/progress/", views.update_progress, name="update_progress"),
]
