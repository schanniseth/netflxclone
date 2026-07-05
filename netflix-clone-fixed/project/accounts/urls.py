from django.contrib.auth import views as auth_views
from django.urls import path, reverse_lazy
from . import views

urlpatterns = [
    path("", views.landing, name="landing"),
    path("check-email/", views.check_email, name="check_email"),
    path("signup/", views.signup_view, name="signup"),
    path("signin/", views.signin_view, name="signin"),
    path("signout/", views.signout_view, name="signout"),

    # Forgot / reset password (built on Django's auth views, styled to
    # match the sign-in card).
    path(
        "password-reset/",
        auth_views.PasswordResetView.as_view(
            template_name="pages/password_reset.html",
            email_template_name="registration/password_reset_email.html",
            subject_template_name="registration/password_reset_subject.txt",
            success_url=reverse_lazy("password_reset_done"),
        ),
        name="password_reset",
    ),
    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(
            template_name="pages/password_reset_done.html"
        ),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="pages/password_reset_confirm.html",
            success_url=reverse_lazy("password_reset_complete"),
        ),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(
            template_name="pages/password_reset_complete.html"
        ),
        name="password_reset_complete",
    ),
    path("profiles/", views.profiles_view, name="profiles"),
    path("profiles/manage/", views.manage_profiles, name="manage_profiles"),
    path("profiles/add/", views.add_profile, name="add_profile"),
    path("profiles/<int:profile_id>/select/", views.select_profile, name="select_profile"),
    path("profiles/<int:profile_id>/edit/", views.edit_profile, name="edit_profile"),
    path("profiles/<int:profile_id>/delete/", views.delete_profile, name="delete_profile"),
]
