# Netflix Clone — Django Project (Merged)

This is the merged project: your friend's Django scaffold (auth-ready structure,
Movie/Category models, TMDB seeding scripts, sqlite database with 426 movies
already loaded) + your front-end work (the full Netflix Cambodia landing page,
sign in / sign up screens, help center, FAQ, corporate/legal pages, images,
fonts, and your big `style.css` / `script.js`).

On top of that, this adds everything from your feature list:

- ✅ HTML/CSS Netflix homepage — your landing page is now `templates/pages/landing.html`
- ✅ Converted into Django templates — every `.html` file now uses `{% static %}` / `{% url %}`
- ✅ User registration and login — email + password, via `accounts` app
- ✅ Movies from the database — `movies/views.py` `home()` pulls Category/Movie from the DB
- ✅ Movie detail page — `/movie/<id>/`
- ✅ Video player page — `/movie/<id>/watch/` (plays `stream_url` if set, else the YouTube trailer)
- ✅ Search — `/search/?q=...` (server-rendered page) + `/api/search/` (JSON, for the navbar)
- ✅ My List — `/my-list/`, add/remove via the "+" button on any movie card
- ✅ Continue Watching — playback progress is saved every 10s and shown as a row on the homepage
- ✅ Multiple profiles — Netflix-style "Who's watching?" screen, up to 5 per account
- ✅ Admin panel — manage Movies, Categories, Profiles, My List, Continue Watching at `/admin/`
- ✅ Recommendations — simple content-based recommender (`get_recommendations()` in `movies/views.py`),
  based on the categories of what a profile has watched or saved

## Project layout

```
netflix_clone/       # Django settings/urls (project config)
accounts/            # Signup, signin, "Who's watching?" profile screens
movies/              # Movie/Category models, browsing, detail, watch, search, My List
templates/pages/     # Your ported static pages (landing, signin, signup, FAQ, help
                      # center, corporate info, legal, etc.)
movies/templates/    # The Django "app shell" (navbar) + browse/detail/watch/search pages
static/
  css/style.css      # Small stylesheet used by the browsing app (from your friend's scaffold)
  css/site.css       # Your big stylesheet, used by landing/signin/signup/info pages
  js/app.js          # Browsing app behavior (My List toggle, profile dropdown, row arrows)
  js/site.js         # Your original script.js, used by the marketing/info pages
  pic/               # Your images (also duplicated at static/img/ for the friend's templates)
db.sqlite3           # Already has 426 movies / 5 categories loaded (from movies_fixture.json)
movies_fixture.json  # Re-importable fixture if you ever reset the DB
```

## How the two projects were merged

- Your friend's Django app (`movies`) was kept as the backend foundation since it
  already had working models, an admin config, and a seeded database.
- A new `accounts` app was added for authentication + multiple profiles (not present before).
- Your marketing/info pages (`index.html`, `signin.html`, `signup.html`, `faq.html`,
  `helpcenter.html`, `corporateinfo.html`, `investorrel.html`, `job.html`,
  `legalnotice.html`, `mediacenter.html`, `onlyonnetflix.html`, `privacy.html`,
  `termofuse.html`, `waystowatch.html`, `contactus.html`) were converted into Django
  templates automatically (static/URL tags swapped in) and wired to real routes.
  `signin.html` / `signup.html` were additionally hand-wired to real Django auth forms.
- The actual movie-browsing screens (home/detail/watch/search/My List) use a fresh,
  small template set styled with your friend's original `style.css`, extended with new
  rules for the detail page, player page, progress bars, and profile screens — so the two
  stylesheets don't collide with each other.

## Running it

```bash
cd project
python -m venv .venv && source .venv/bin/activate    # optional but recommended
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Then visit `http://127.0.0.1:8000/`.

- Admin panel: `http://127.0.0.1:8000/admin/` — a superuser `admin` / `admin12345`
  already exists in `db.sqlite3` (**change this password**, or run
  `python manage.py createsuperuser` for your own).
- Sign up at `/signup/`, pick/create a profile, and you're browsing.

### Re-seeding movies (if you ever wipe the DB)

```bash
python manage.py migrate
python manage.py loaddata movies_fixture.json
```

or use the friend's live-TMDB seeding commands:

```bash
python manage.py seed_movies      # or seed_archive.py — check movies/management/commands/
```

### Environment variables (`.env`)

```
TMDB_API_KEY=your_key_here     # only needed as a fallback for fetching trailers live
DEBUG=True
SECRET_KEY=change-me-in-production
```

## Deploying to Vercel

Vercel auto-detects Django by finding `manage.py`, so no build script is needed —
it reads `WSGI_APPLICATION` from `netflix_clone/settings.py`, runs `collectstatic`
automatically (because `STATIC_ROOT` is set), and serves everything under
`/static/` from its CDN.

**1. Push this `project/` folder to a Git repo** (GitHub/GitLab/Bitbucket), and
import it at [vercel.com/new](https://vercel.com/new).

> This folder currently sits at `Netflex/netflix-clone-fixed/project` in your
> repo. When you import the project in Vercel, open **Project Settings → Root
> Directory** and set it to `netflix-clone-fixed/project` — otherwise Vercel
> won't find `manage.py`. (If you instead push just this `project/` folder as
> its own repo, leave Root Directory as the default `.`.)

**2. Add a Postgres database.** SQLite (`db.sqlite3`) is bundled read-only with
each deployment and gets reset on every deploy/cold start, so sign-ups, My
List, and Continue Watching won't actually save. Add **Vercel Postgres** (or
Neon/Supabase) from the Storage tab — this automatically sets a `DATABASE_URL`
env var, which `dj_database_url` in `settings.py` already reads.

**3. Set environment variables** in Project Settings → Environment Variables:

```
SECRET_KEY=<a long random string>
DEBUG=False
TMDB_API_KEY=<only if you want live trailer fallback>
```

**4. Run migrations against the new database.** Locally:

```bash
vercel pull                 # writes .env.local with your Vercel env vars
python -m dotenv -f .env.local run -- python manage.py migrate
python -m dotenv -f .env.local run -- python manage.py loaddata movies_fixture.json
python -m dotenv -f .env.local run -- python manage.py createsuperuser
```

**5. Deploy** — push to your Git branch, or run `vercel --prod`.

Notes:
- `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` already whitelist `*.vercel.app`
  and the deployment's own `VERCEL_URL`, so preview deployments work out of
  the box. If you attach a custom domain, add it to `CSRF_TRUSTED_ORIGINS` in
  `settings.py`.
- No code uploads images/files at runtime (avatars are just colors, posters
  are TMDB URLs), so there's no serverless-storage problem to solve there.

## Notes / things worth doing next

- `movie.stream_url` is what actually plays in the `<video>` tag on the watch page;
  movies without a `stream_url` fall back to their YouTube trailer (not the full film).
  If you want real playback for every title, that's the field to populate.
- A few sub-links inside the ported help center / terms pages point to pages that
  never existed in the original scrape (e.g. `helpcentersignin.html`) — those were
  left as harmless `#` links.
- The recommendation logic is intentionally simple (category overlap) — a good "advanced"
  follow-up would be collaborative filtering or a "genres you added to My List" weight.
