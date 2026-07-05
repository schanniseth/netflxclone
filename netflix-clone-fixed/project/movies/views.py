import os

import requests
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_GET, require_POST

from accounts.decorators import require_profile
from .models import Category, ContinueWatching, Movie, MyListEntry


def get_recommendations(profile, limit=20):
    """Very simple content-based recommender: look at the categories of movies
    the profile has watched or saved, then surface other well-rated movies
    that share those categories (excluding ones already seen/saved)."""
    seen_ids = set(
        ContinueWatching.objects.filter(profile=profile).values_list("movie_id", flat=True)
    ) | set(MyListEntry.objects.filter(profile=profile).values_list("movie_id", flat=True))

    category_ids = Movie.objects.filter(id__in=seen_ids).values_list("categories__id", flat=True)
    category_ids = [c for c in category_ids if c is not None]

    if category_ids:
        qs = (
            Movie.objects.filter(categories__id__in=category_ids)
            .exclude(id__in=seen_ids)
            .annotate(match_count=Count("categories", filter=Q(categories__id__in=category_ids)))
            .order_by("-match_count", "-rating")
            .distinct()
        )
    else:
        qs = Movie.objects.exclude(id__in=seen_ids).order_by("-rating")
    return qs[:limit]


@require_profile
def home(request):
    featured = (
        Movie.objects.filter(backdrop_url__isnull=False)
        .exclude(backdrop_url="")
        .order_by("?")
        .first()
    )
    categories = Category.objects.prefetch_related("movies")

    continue_watching = (
        ContinueWatching.objects.filter(profile=request.profile, finished=False)
        .select_related("movie")
        .order_by("-updated_at")[:20]
    )
    my_list = (
        MyListEntry.objects.filter(profile=request.profile)
        .select_related("movie")
        .order_by("-added_at")[:20]
    )
    recommended = get_recommendations(request.profile)
    mylist_ids = set(MyListEntry.objects.filter(profile=request.profile).values_list("movie_id", flat=True))

    return render(
        request,
        "movies/home.html",
        {
            "featured": featured,
            "categories": categories,
            "continue_watching": continue_watching,
            "my_list": my_list,
            "recommended": recommended,
            "mylist_ids": mylist_ids,
        },
    )


@require_profile
def movie_detail(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    in_list = MyListEntry.objects.filter(profile=request.profile, movie=movie).exists()
    progress = ContinueWatching.objects.filter(profile=request.profile, movie=movie).first()
    similar = (
        Movie.objects.filter(categories__in=movie.categories.all())
        .exclude(id=movie.id)
        .distinct()
        .order_by("-rating")[:12]
    )
    mylist_ids = set(MyListEntry.objects.filter(profile=request.profile).values_list("movie_id", flat=True))
    return render(
        request,
        "movies/movie_detail.html",
        {"movie": movie, "in_list": in_list, "progress": progress, "similar": similar, "mylist_ids": mylist_ids},
    )


@require_profile
def watch(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    progress = ContinueWatching.objects.filter(profile=request.profile, movie=movie).first()
    return render(request, "movies/watch.html", {"movie": movie, "progress": progress})


@require_profile
def search_page(request):
    query = request.GET.get("q", "").strip()
    results = Movie.objects.filter(title__icontains=query)[:60] if query else []
    mylist_ids = set(MyListEntry.objects.filter(profile=request.profile).values_list("movie_id", flat=True))
    return render(request, "movies/search.html", {"query": query, "results": results, "mylist_ids": mylist_ids})


@require_profile
def mylist_page(request):
    entries = (
        MyListEntry.objects.filter(profile=request.profile).select_related("movie").order_by("-added_at")
    )
    mylist_ids = set(e.movie_id for e in entries)
    return render(request, "movies/mylist.html", {"entries": entries, "mylist_ids": mylist_ids})


@require_profile
@require_POST
def toggle_mylist(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    entry = MyListEntry.objects.filter(profile=request.profile, movie=movie).first()
    if entry:
        entry.delete()
        in_list = False
    else:
        MyListEntry.objects.create(profile=request.profile, movie=movie)
        in_list = True
    return JsonResponse({"in_list": in_list})


@require_profile
@require_POST
def update_progress(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    try:
        progress_seconds = int(request.POST.get("progress_seconds", 0))
        duration_seconds = int(request.POST.get("duration_seconds", 0))
    except (TypeError, ValueError):
        return JsonResponse({"error": "invalid progress values"}, status=400)

    finished = duration_seconds > 0 and progress_seconds >= duration_seconds * 0.9

    cw, _ = ContinueWatching.objects.update_or_create(
        profile=request.profile,
        movie=movie,
        defaults={
            "progress_seconds": progress_seconds,
            "duration_seconds": duration_seconds,
            "finished": finished,
        },
    )
    return JsonResponse({"ok": True, "percent": cw.percent, "finished": cw.finished})


# ---------------- JSON API (used by the search box / dynamic UI bits) ----------------

@require_GET
def search_movies(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return JsonResponse({"movies": []})

    movies = Movie.objects.filter(title__icontains=query)[:20]
    data = [
        {
            "id": m.id,
            "title": m.title,
            "overview": m.overview,
            "poster_url": m.poster_url,
            "backdrop_url": m.backdrop_url,
            "release_year": m.release_year,
            "rating": m.rating,
            "stream_url": m.stream_url,
        }
        for m in movies
    ]
    return JsonResponse({"movies": data})


@require_GET
def movie_detail_api(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return JsonResponse({"error": "Movie not found"}, status=404)

    data = {
        "id": movie.id,
        "title": movie.title,
        "overview": movie.overview,
        "poster_url": movie.poster_url,
        "backdrop_url": movie.backdrop_url,
        "release_year": movie.release_year,
        "rating": movie.rating,
        "stream_url": movie.stream_url,
        "categories": [c.name for c in movie.categories.all()],
    }
    return JsonResponse(data)


@require_GET
def movie_videos(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return JsonResponse({"error": "Movie not found"}, status=404)

    if movie.stream_url:
        return JsonResponse({"stream_url": movie.stream_url, "videos": []})

    if movie.youtube_key:
        return JsonResponse(
            {
                "videos": [
                    {
                        "key": movie.youtube_key,
                        "site": "YouTube",
                        "type": "Trailer",
                        "name": f"{movie.title} Trailer",
                    }
                ]
            }
        )

    api_key = os.getenv("TMDB_API_KEY")
    if not api_key:
        return JsonResponse({"videos": [], "error": "No trailer cached and TMDB_API_KEY not set"}, status=200)

    url = f"https://api.themoviedb.org/3/movie/{movie.tmdb_id}/videos"
    try:
        resp = requests.get(url, params={"api_key": api_key}, timeout=30)
        resp.raise_for_status()
    except requests.RequestException:
        return JsonResponse({"videos": [], "error": "TMDB unreachable and no trailer cached"}, status=200)

    results = resp.json().get("results", [])
    trailer = next(
        (v for v in results if v.get("site") == "YouTube" and v.get("type") == "Trailer"), None
    ) or next((v for v in results if v.get("site") == "YouTube"), None)
    if trailer and trailer.get("key"):
        movie.youtube_key = trailer["key"]
        movie.save(update_fields=["youtube_key"])
        return JsonResponse(
            {
                "videos": [
                    {
                        "key": trailer["key"],
                        "site": "YouTube",
                        "type": trailer.get("type", "Trailer"),
                        "name": trailer.get("name", f"{movie.title} Trailer"),
                    }
                ]
            }
        )

    return JsonResponse({"videos": [], "error": "No trailer available"}, status=200)
