from django.contrib import admin
from django.urls import include, path

from accounts import views as account_views
from movies import views as movie_views

# Simple static "info" pages ported from the marketing site (job listings,
# FAQ, help center, legal pages, etc). Each just renders a converted template.
STATIC_PAGES = [
    "faq", "helpcenter", "corporateinfo", "investorrel", "job",
    "legalnotice", "mediacenter", "onlyonnetflix", "privacy",
    "termofuse", "waystowatch", "contactus",
]

urlpatterns = [
    path("admin/", admin.site.urls),

    # Accounts: landing page, signup/signin/signout, profile selection
    path("", include("accounts.urls")),

    # The main app (requires a selected profile)
    path("browse/", movie_views.home, name="home"),
    path("search/", movie_views.search_page, name="search_page"),
    path("my-list/", movie_views.mylist_page, name="mylist_page"),
    path("movie/", include("movies.urls")),

    # JSON API
    path("api/search/", movie_views.search_movies, name="search"),
    path("api/movie/<int:movie_id>/", movie_views.movie_detail_api, name="movie_detail_api"),
    path("api/movie/<int:movie_id>/videos/", movie_views.movie_videos, name="movie_videos"),
]

for slug in STATIC_PAGES:
    urlpatterns.append(
        path(f"{slug}/", account_views.static_page, {"template_name": f"pages/{slug}.html"}, name=slug)
    )
