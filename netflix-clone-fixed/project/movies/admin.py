from django.contrib import admin
from .models import Category, ContinueWatching, Movie, MyListEntry


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ["title", "release_year", "rating", "has_stream"]
    list_filter = ["categories", "release_year"]
    search_fields = ["title", "overview", "stream_url"]
    filter_horizontal = ["categories"]
    fields = [
        "tmdb_id",
        "title",
        "overview",
        "release_year",
        "rating",
        "poster_url",
        "backdrop_url",
        "youtube_key",
        "stream_url",
        "categories",
    ]

    def has_stream(self, obj):
        return bool(obj.stream_url)

    has_stream.boolean = True
    has_stream.short_description = "Streamable?"


@admin.register(MyListEntry)
class MyListEntryAdmin(admin.ModelAdmin):
    list_display = ["profile", "movie", "added_at"]
    search_fields = ["profile__name", "movie__title"]
    list_filter = ["added_at"]


@admin.register(ContinueWatching)
class ContinueWatchingAdmin(admin.ModelAdmin):
    list_display = ["profile", "movie", "percent", "finished", "updated_at"]
    list_filter = ["finished"]
    search_fields = ["profile__name", "movie__title"]
