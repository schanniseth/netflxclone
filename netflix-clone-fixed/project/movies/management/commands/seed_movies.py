import os
import requests
from django.core.management.base import BaseCommand
from movies.models import Category, Movie


class Command(BaseCommand):
    help = "Seed movies from the TMDB API"

    def handle(self, *args, **options):
        api_key = os.getenv("TMDB_API_KEY")
        if not api_key:
            self.stderr.write(self.style.ERROR("TMDB_API_KEY not set in .env"))
            return

        base_url = "https://api.themoviedb.org/3"
        image_base = "https://image.tmdb.org/t/p"

        endpoints = [
            ("Trending Now", f"{base_url}/trending/movie/week"),
            ("Top Rated", f"{base_url}/movie/top_rated"),
            ("Action", f"{base_url}/discover/movie", {"with_genres": "28"}),
            ("Comedy", f"{base_url}/discover/movie", {"with_genres": "35"}),
        ]

        for name, url, *extra in endpoints:
            params = {"api_key": api_key}
            if extra:
                params.update(extra[0])

            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            category, _ = Category.objects.get_or_create(name=name)

            for item in data.get("results", [])[:20]:
                poster = item.get("poster_path") or ""
                backdrop = item.get("backdrop_path") or ""

                movie, _ = Movie.objects.update_or_create(
                    tmdb_id=item["id"],
                    defaults={
                        "title": item.get("title", "Unknown"),
                        "overview": item.get("overview", ""),
                        "poster_url": f"{image_base}/w500{poster}" if poster else "",
                        "backdrop_url": f"{image_base}/original{backdrop}" if backdrop else "",
                        "release_year": item.get("release_date", "")[:4],
                        "rating": item.get("vote_average"),
                    },
                )
                movie.categories.add(category)

                # Fetch and cache the YouTube trailer key (if not already set)
                if not movie.youtube_key:
                    try:
                        v_resp = requests.get(
                            f"{base_url}/movie/{movie.tmdb_id}/videos",
                            params={"api_key": api_key},
                            timeout=15,
                        )
                        v_resp.raise_for_status()
                        v_results = v_resp.json().get("results", [])
                        trailer = next(
                            (v for v in v_results if v.get("site") == "YouTube" and v.get("type") == "Trailer"),
                            None,
                        ) or next(
                            (v for v in v_results if v.get("site") == "YouTube"),
                            None,
                        )
                        if trailer and trailer.get("key"):
                            movie.youtube_key = trailer["key"]
                            movie.save(update_fields=["youtube_key"])
                    except requests.RequestException:
                        pass

            self.stdout.write(self.style.SUCCESS(f"Seeded category: {name}"))

        self.stdout.write(self.style.SUCCESS("Done seeding movies"))
