from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    overview = models.TextField(blank=True)
    poster_url = models.URLField(blank=True)
    backdrop_url = models.URLField(blank=True)
    release_year = models.CharField(max_length=4, blank=True)
    rating = models.FloatField(null=True, blank=True)
    youtube_key = models.CharField(max_length=64, blank=True)
    stream_url = models.URLField(blank=True)
    categories = models.ManyToManyField(Category, related_name="movies")

    class Meta:
        ordering = ["-rating"]

    def __str__(self):
        return self.title


class MyListEntry(models.Model):
    """A movie a profile has saved to their 'My List'."""

    profile = models.ForeignKey(
        "accounts.Profile", on_delete=models.CASCADE, related_name="mylist_entries"
    )
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="in_lists")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-added_at"]
        unique_together = ("profile", "movie")

    def __str__(self):
        return f"{self.movie.title} on {self.profile.name}'s list"


class ContinueWatching(models.Model):
    """Tracks playback progress per profile so 'Continue Watching' can resume."""

    profile = models.ForeignKey(
        "accounts.Profile", on_delete=models.CASCADE, related_name="continue_watching"
    )
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="watch_progress")
    progress_seconds = models.PositiveIntegerField(default=0)
    duration_seconds = models.PositiveIntegerField(default=0)
    finished = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        unique_together = ("profile", "movie")

    @property
    def percent(self):
        if not self.duration_seconds:
            return 0
        return min(100, round((self.progress_seconds / self.duration_seconds) * 100))

    def __str__(self):
        return f"{self.profile.name} watching {self.movie.title} ({self.percent}%)"
