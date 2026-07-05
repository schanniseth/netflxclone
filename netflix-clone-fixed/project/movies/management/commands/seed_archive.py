import zlib
import requests
from django.core.management.base import BaseCommand
from movies.models import Category, Movie


SEARCH_URL = "https://archive.org/advancedsearch.php"
METADATA_URL = "https://archive.org/metadata"

# Focused curated list of well-known public-domain feature films.
# Kept to ~60 to keep startup fast; the paginated search fills in the rest.
CURATED_IDENTIFIERS = [
    # Silent classics (confirmed working)
    "night_of_the_living_dead",
    "plan_9_from_outer_space",
    "HisGirlFriday",
    "Charade",
    "TheGeneral1926",
    "ATripToTheMoon1902",
    "Nosferatu1922",
    "CabinetOfDrCaligari",
    "ThePhantomOfTheOpera1925",
    "ReeferMadness",
    "TheGreatTrainRobbery",
    "AChristmasCarol1938",
    "TheBankDick",
    "SteamboatBillJr",
    "TheKid1921",
    "Haxan1922",
    "TheCameraman",
    "TheLittlePrincess1939",
    "SunriseATaleOfTwoHumans",
    "TheAdventuresOfPrinceAchmed",
    "Metropolis1927",
    "TheThiefOfBagdad_1924",
    "TheIronHorse",
    "TheWind_1928",
    "TheDocksOfNewYork",
    "TheLastCommand",
    "Underworld_1927",
    "TheKingOfKings_1927",
    "BenHurA_TaleOfTheChrist_1925",
    "TheTenCommandments_1923",
    "TheHunchbackOfNotreDame_1923",
    "TheLostWorld_1925",
    "TheLodger",
    "Blackmail_1929",
    # Golden-age Hollywood (well-known PD or lapsed copyright)
    "It Happened One Night",
    "MrSmithGoesToWashington",
    "AllAboutEve",
    "SunsetBoulevard",
    "TheThirdMan",
    "SinginInTheRain",
    "RomanHoliday",
    "SomeLikeItHot",
    "ThePhiladelphiaStory",
    "CitizenKane",
    "Casablanca_1942",
    "TheMalteseFalcon_1941",
    "DoubleIndemnity",
    "TheBigSleep",
    "Notorious_1946",
    "Rebecca_1940",
    "TheNightOfTheHunter",
    "RearWindow",
    "Vertigo_1958",
    "Psycho_1960",
    "TheBirds_1963",
    "NorthByNorthwest",
    "Rope_1948",
    "ToCatchAThief",
    "TheWrongMan",
    "GlenOrGlenda",
    "Plan9FromOuterSpace",
    "CarnivalOfSouls",
]


def stable_id(identifier: str) -> int:
    return zlib.crc32(identifier.encode("utf-8")) & 0x7FFFFFFF


def pick_mp4(files):
    mp4s = [f.get("name", "") for f in files if f.get("name", "").lower().endswith(".mp4")]
    if not mp4s:
        return None
    for preferred in ("512kb", "1mb", "2mb", "preview"):
        for name in mp4s:
            if preferred in name.lower():
                return name
    return mp4s[0]


def extract_runtime_seconds(meta):
    m = meta.get("metadata", {}) or {}
    raw = m.get("runtime") or m.get("length") or ""
    if not raw:
        return None
    s = str(raw).strip()
    if ":" in s:
        parts = s.split(":")
        try:
            nums = [float(p) for p in parts]
        except ValueError:
            return None
        if len(nums) == 3:
            return nums[0] * 3600 + nums[1] * 60 + nums[2]
        if len(nums) == 2:
            return nums[0] * 60 + nums[1]
    try:
        return float(s)
    except ValueError:
        return None


def fetch_metadata(identifier):
    resp = requests.get(f"{METADATA_URL}/{identifier}", timeout=30)
    resp.raise_for_status()
    return resp.json()


def add_movie_from_identifier(identifier, category):
    """Fetch metadata, validate, and create/update a Movie. Returns the movie, or None."""
    try:
        meta = fetch_metadata(identifier)
    except requests.RequestException:
        return None

    m = meta.get("metadata", {}) or {}
    title = m.get("title") or identifier
    if isinstance(title, list):
        title = title[0] if title else identifier
    title = str(title).strip()[:255]

    description = m.get("description")
    if isinstance(description, list):
        description = description[0]
    year = m.get("year") or m.get("date")
    if isinstance(year, list):
        year = year[0]
    year_str = str(year)[:4] if year else ""

    runtime = extract_runtime_seconds(meta)
    if runtime is not None and runtime < 600:  # skip shorts (<10 min)
        return None

    mp4 = pick_mp4(meta.get("files", []))
    if not mp4:
        return None

    stream_url = f"https://archive.org/download/{identifier}/{mp4}"
    poster_url = f"https://archive.org/services/img/{identifier}"
    overview = (
        str(description)[:1000]
        if description
        else f"Public-domain film from the Internet Archive ({identifier})."
    )

    movie, _ = Movie.objects.update_or_create(
        tmdb_id=stable_id(identifier),
        defaults={
            "title": title,
            "overview": overview,
            "poster_url": poster_url,
            "backdrop_url": poster_url,
            "release_year": year_str,
            "rating": None,
            "stream_url": stream_url,
        },
    )
    movie.categories.add(category)
    return movie


class Command(BaseCommand):
    help = "Seed public-domain movies from Internet Archive (curated + paginated search)"

    def add_arguments(self, parser):
        parser.add_argument("--target", type=int, default=200,
                            help="Total movies to add (curated + search)")
        parser.add_argument("--pages", type=int, default=20,
                            help="Max Archive search pages to fetch (50 results each)")
        parser.add_argument("--start-year", type=int, default=1920)
        parser.add_argument("--end-year", type=int, default=1970)
        parser.add_argument("--search-only", action="store_true",
                            help="Skip the curated list, only use search")
        parser.add_argument("--curated-only", action="store_true",
                            help="Only seed the curated list, skip search")

    def handle(self, *args, **opts):
        target = opts["target"]
        pages = opts["pages"]
        start_year = opts["start_year"]
        end_year = opts["end_year"]
        search_only = opts["search_only"]
        curated_only = opts["curated_only"]

        category, _ = Category.objects.get_or_create(name="Public Domain")
        seen = set()
        added = 0

        # 1) Curated list
        if not search_only:
            self.stdout.write(f"Seeding {len(CURATED_IDENTIFIERS)} curated identifiers...")
            for identifier in CURATED_IDENTIFIERS:
                if added >= target:
                    break
                seen.add(identifier)
                movie = add_movie_from_identifier(identifier, category)
                if movie:
                    added += 1
                    self.stdout.write(self.style.SUCCESS(f"  + curated: {movie.title}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  - curated skip: {identifier}"))

        # 2) Paginated search
        if not curated_only and added < target:
            self.stdout.write(self.style.NOTICE(
                f"\nSearching Archive for PD movies dated {start_year}-{end_year}..."
            ))
            query = (
                f"mediatype:movies AND licenseurl:*publicdomain* "
                f"AND date:[{start_year} TO {end_year}]"
            )

            for page in range(1, pages + 1):
                if added >= target:
                    break
                params = {
                    "q": query,
                    "fl": "identifier,title,date",
                    "rows": 50,
                    "page": page,
                    "output": "json",
                }
                try:
                    resp = requests.get(SEARCH_URL, params=params, timeout=30)
                    resp.raise_for_status()
                except requests.RequestException as e:
                    self.stdout.write(self.style.ERROR(f"Search page {page} failed: {e}"))
                    break

                results = resp.json().get("response", {}).get("docs", [])
                if not results:
                    self.stdout.write(self.style.NOTICE(f"No more results on page {page}."))
                    break

                page_added = 0
                for item in results:
                    if added >= target:
                        break
                    identifier = item.get("identifier")
                    if not identifier or identifier in seen:
                        continue
                    seen.add(identifier)
                    movie = add_movie_from_identifier(identifier, category)
                    if movie:
                        added += 1
                        page_added += 1
                        self.stdout.write(self.style.SUCCESS(f"  + search: {movie.title} ({movie.release_year})"))

                self.stdout.write(self.style.NOTICE(
                    f"Page {page}: {page_added} added ({added}/{target} total)"
                ))

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Added {added} public-domain movies total."
        ))
