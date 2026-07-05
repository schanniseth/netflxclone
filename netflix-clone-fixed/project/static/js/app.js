// Netflix Clone - client-side behavior for the Django-rendered pages.
// Play/Info/detail links are plain <a> tags (server-rendered), so this file
// only needs to handle: the profile dropdown, row scroll arrows, and the
// "My List" add/remove toggle (which talks to the Django backend).

function getCsrfToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) return match[1];
    const input = document.querySelector('input[name=csrfmiddlewaretoken]');
    return input ? input.value : '';
}

// ---------- My List toggle (backend-backed) ----------

function toggleMyList(movieId, onDone) {
    fetch(`/movie/${movieId}/mylist/toggle/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrfToken() },
    })
        .then(resp => resp.json())
        .then(data => {
            // Keep every card for this movie on the page in sync (e.g. same
            // title appears in multiple rows).
            document.querySelectorAll(`.js-mylist-toggle[data-movie-id="${movieId}"]`).forEach(btn => {
                btn.classList.toggle('in-list', data.in_list);
            });
            if (onDone) onDone(data.in_list);
        })
        .catch(err => console.error('My List toggle failed:', err));
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-mylist-toggle');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    toggleMyList(btn.dataset.movieId);
});

// ---------- Profile dropdown ----------

(function setupProfileDropdown() {
    const trigger = document.getElementById('profile-trigger');
    const dropdown = document.getElementById('profile-dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        trigger.classList.toggle('open', isOpen);
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
            dropdown.classList.remove('open');
            trigger.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('open');
            trigger.classList.remove('open');
        }
    });
})();

// ---------- Row scroll arrows ----------

function setupRowArrows() {
    document.querySelectorAll('.row-container').forEach(container => {
        const posters = container.querySelector('.row-posters');
        const leftBtn = container.querySelector('.scroll-left');
        const rightBtn = container.querySelector('.scroll-right');
        if (!posters || !leftBtn || !rightBtn) return;

        const updateArrows = () => {
            leftBtn.classList.toggle('hidden', posters.scrollLeft <= 0);
            rightBtn.classList.toggle('hidden',
                posters.scrollLeft + posters.clientWidth >= posters.scrollWidth - 2);
        };

        const scrollAmount = () => posters.clientWidth * 0.8;

        leftBtn.addEventListener('click', () => {
            posters.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });
        rightBtn.addEventListener('click', () => {
            posters.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });

        posters.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
    });
}

setupRowArrows();
