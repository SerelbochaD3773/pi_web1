// ReviewForm.js — usa API remoto para CRUD
const API_URL = 'https://68e4547e8e116898997b91a4.mockapi.io/Review/ReviewVulcanoAPP';

function endpoint(id) {
    return id ? `${API_URL}/${id}` : API_URL;
}

document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews');
    const sortSelect = document.getElementById('sort');
    const reviewForm = document.getElementById('reviewForm');
    const formError = document.getElementById('formError');

    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editAuthor = document.getElementById('editAuthor');
    const editRating = document.getElementById('editRating');
    const editComment = document.getElementById('editComment');
    const editError = document.getElementById('editError');
    const cancelEdit = document.getElementById('cancelEdit');
    const clearBtn = document.getElementById('clearReviews');

    if (!reviewsContainer || !reviewForm) return; // nothing to do

    let reviews = [];
    let editingId = null;

    async function fetchReviews() {
        try {
            const res = await fetch(endpoint());
            if (!res.ok) throw new Error(`Error fetching reviews: ${res.status}`);
            reviews = await res.json();
            renderReviews();
        } catch (err) {
            reviewsContainer.innerHTML = `<div class="text-red-600">${escapeHtml(err.message)}</div>`;
        }
    }

    function renderReviews() {
        const order = sortSelect?.value || 'desc';
        const sorted = [...reviews].sort((a, b) => {
            const ra = Number(a.rating) || 0;
            const rb = Number(b.rating) || 0;
            return order === 'asc' ? ra - rb : rb - ra;
        });

        if (sorted.length === 0) {
            reviewsContainer.innerHTML = '<p class="text-sm text-[#5a3a2e]">No hay reseñas todavía.</p>';
            return;
        }

        reviewsContainer.innerHTML = '';
        sorted.forEach(review => {
            const card = document.createElement('div');
            card.className = 'rounded-lg bg-white border border-[#E6D4C1] shadow p-5 text-[#5a3a2e]';
            card.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-bold text-[#5a3a2e]">${escapeHtml(review.author || 'Anónimo')}</span>
                        <span class="text-[#A57E5A] text-lg">${renderStars(review.rating)}</span>
                    </div>
                    <div class="text-[#5a3a2e] mt-1 mb-2">${escapeHtml(review.comment || '')}</div>
                    <div class="flex gap-2">
                        <button class="edit-btn bg-[#714C3A] hover:bg-[#5a3a2e] text-white px-3 py-1 rounded transition" data-id="${review.id}">Editar</button>
                        <button class="delete-btn bg-transparent border border-[#E6D4C1] text-[#5a3a2e] px-3 py-1 rounded hover:bg-[#FDECEC] transition" data-id="${review.id}">Eliminar</button>
                    </div>
                `;
            reviewsContainer.appendChild(card);
        });

        // attach handlers
        reviewsContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                if (!id) return;
                if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return;
                await deleteReview(id);
            });
        });

        reviewsContainer.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEditModal(id);
            });
        });
    }

    async function deleteReview(id) {
        try {
            const res = await fetch(endpoint(id), { method: 'DELETE' });
            if (!res.ok) throw new Error(`Error deleting review: ${res.status}`);
            reviews = reviews.filter(r => r.id !== id);
            renderReviews();
        } catch (err) {
            alert(err.message);
        }
    }

    function openEditModal(id) {
        const review = reviews.find(r => String(r.id) === String(id));
        if (!review) return;
        editingId = id;
        editAuthor.value = review.author || '';
        editRating.value = review.rating || '';
        editComment.value = review.comment || '';
        editError.textContent = '';
        editModal?.classList.remove('hidden');
    }

    function closeEditModal() {
        editingId = null;
        editModal?.classList.add('hidden');
    }

    cancelEdit?.addEventListener('click', closeEditModal);

    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        editError.textContent = '';
        const author = editAuthor.value.trim();
        const rating = parseInt(editRating.value);
        const comment = editComment.value.trim();
        if (!author || !comment || isNaN(rating) || rating < 1 || rating > 5) {
            editError.textContent = 'Por favor, completa todos los campos correctamente.';
            return;
        }
        try {
            const res = await fetch(endpoint(editingId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, rating, comment })
            });
            if (!res.ok) throw new Error(`Error editing review: ${res.status}`);
            const updated = await res.json();
            reviews = reviews.map(r => String(r.id) === String(editingId) ? updated : r);
            renderReviews();
            closeEditModal();
        } catch (err) {
            editError.textContent = err.message;
        }
    });

    sortSelect?.addEventListener('change', renderReviews);

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.textContent = '';
        const author = reviewForm.author.value.trim();
        const rating = parseInt(reviewForm.rating.value);
        const comment = reviewForm.comment.value.trim();
        if (!author || !comment || isNaN(rating) || rating < 1 || rating > 5) {
            formError.textContent = 'Por favor, completa todos los campos correctamente.';
            return;
        }
        try {
            const res = await fetch(endpoint(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, rating, comment })
            });
            if (!res.ok) throw new Error(`Error adding review: ${res.status}`);
            const newReview = await res.json();
            reviews.push(newReview);
            renderReviews();
            reviewForm.reset();
        } catch (err) {
            formError.textContent = err.message;
        }
    });

    clearBtn?.addEventListener('click', async () => {
        if (!confirm('¿Borrar todas las reseñas? Esta acción eliminará cada reseña en el servidor.')) return;
        try {
            // delete all sequentially to avoid overloading the API
            for (const r of [...reviews]) {
                await fetch(endpoint(r.id), { method: 'DELETE' });
            }
            reviews = [];
            renderReviews();
        } catch (err) {
            alert('Error al limpiar reseñas: ' + err.message);
        }
    });

    // close modal on backdrop click
    editModal?.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // initial load
    fetchReviews();
});

// Función para mostrar estrellas según la puntuación
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

// Escapar HTML para evitar XSS
function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
