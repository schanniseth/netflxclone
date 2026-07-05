from django import template

register = template.Library()


@register.filter
def in_ids(movie_id, id_set):
    """Usage: {{ movie.id|in_ids:mylist_ids }} -> True/False"""
    return movie_id in id_set
