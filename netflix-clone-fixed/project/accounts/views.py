from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from .forms import EmailLoginForm, ProfileForm, SignUpForm
from .models import Profile
from django.urls import reverse
from django.http import JsonResponse

User = get_user_model()


def landing(request):
    """Public marketing homepage (Lenh's scraped Netflix landing page).
    Logged-in users get bounced straight into the app instead of seeing the ad page."""
    if request.user.is_authenticated:
        return redirect("profiles")
    return render(request, "pages/landing.html")


def static_page(request, template_name):
    """Renders one of the ported static info pages (FAQ, Help Center,
    Terms of Use, etc). No auth required — these are public site pages."""
    return render(request, template_name)

def check_email(request):
    email = request.GET.get("email", "").strip().lower()
    if email and User.objects.filter(email__iexact=email).exists():
        return redirect(f"{reverse('signin')}?email={email}")
    return redirect(f"{reverse('signup')}?email={email}")


def signup_view(request):
    if request.user.is_authenticated:
        return redirect("profiles")

    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Give every new account a default first profile so they can start
            # browsing immediately, Netflix-style.
            Profile.objects.create(user=user, name=user.email.split("@")[0][:20] or "You")
            login(request, user)
            return redirect("profiles")
    else:
        form = SignUpForm()
    return render(request, "pages/signup.html", {"form": form})


def signin_view(request):
    if request.user.is_authenticated:
        return redirect("profiles")

    error = None
    if request.method == "POST":
        form = EmailLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"].strip().lower()
            password = form.cleaned_data["password"]
            user = authenticate(request, username=email, password=password)
            if user is None:
                # Fall back in case someone typed their username instead of email
                try:
                    matched = User.objects.get(email__iexact=email)
                    user = authenticate(request, username=matched.username, password=password)
                except User.DoesNotExist:
                    user = None
            if user is not None:
                login(request, user)
                return redirect("profiles")
            error = "Incorrect email or password. Please try again."
    else:
        form = EmailLoginForm()
    return render(request, "pages/signin.html", {"form": form, "error": error})


@login_required
def signout_view(request):
    logout(request)
    return redirect("landing")


@login_required
def profiles_view(request):
    """Netflix-style 'Who's watching?' screen."""
    profiles = request.user.profiles.all()
    return render(request, "pages/profiles.html", {"profiles": profiles})


@login_required
def select_profile(request, profile_id):
    profile = get_object_or_404(Profile, id=profile_id, user=request.user)
    request.session["profile_id"] = profile.id
    request.session["profile_name"] = profile.name
    return redirect("home")


@login_required
def manage_profiles(request):
    profiles = request.user.profiles.all()
    return render(request, "pages/manage_profiles.html", {"profiles": profiles})


@login_required
def add_profile(request):
    if request.user.profiles.count() >= 5:
        messages.error(request, "You can only have up to 5 profiles per account.")
        return redirect("manage_profiles")

    if request.method == "POST":
        form = ProfileForm(request.POST)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            return redirect("manage_profiles")
    else:
        form = ProfileForm()
    return render(request, "pages/edit_profile.html", {"form": form, "is_new": True})


@login_required
def edit_profile(request, profile_id):
    profile = get_object_or_404(Profile, id=profile_id, user=request.user)
    if request.method == "POST":
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect("manage_profiles")
    else:
        form = ProfileForm(instance=profile)
    return render(request, "pages/edit_profile.html", {"form": form, "profile": profile, "is_new": False})


@login_required
def delete_profile(request, profile_id):
    profile = get_object_or_404(Profile, id=profile_id, user=request.user)
    if request.method == "POST":
        if request.user.profiles.count() <= 1:
            messages.error(request, "You need at least one profile.")
        else:
            profile.delete()
            if request.session.get("profile_id") == profile_id:
                request.session.pop("profile_id", None)
        return redirect("manage_profiles")
    return render(request, "pages/delete_profile_confirm.html", {"profile": profile})
