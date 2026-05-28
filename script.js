/* ========================================
   MAKASSAR CULINARY HUB — Script
   ======================================== */

// --- Global Page Navigation ---
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    // Force re-trigger animation
    target.style.animation = 'none';
    target.offsetHeight; // Trigger reflow
    target.style.animation = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const resultItems = document.querySelectorAll('.result-item');

  // --- Restaurant Page Mapping ---
  const restaurantPages = {
    'babathe': 'page-babathe',
    'sop-sodara': 'page-sop-sodara',
    'pisang-ijo': 'page-pisang-ijo',
    'dinar-seafood': 'page-dinar-seafood',
    'tsuka-ramen': 'page-tsuka-ramen'
  };

  // --- Search Functionality ---
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length > 0) {
      searchResults.classList.remove('hidden');

      // Filter results based on query
      resultItems.forEach(item => {
        const text = item.querySelector('.result-text').textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });

      // If no results match, show all (to simulate suggestion behavior)
      const visibleItems = [...resultItems].filter(i => i.style.display !== 'none');
      if (visibleItems.length === 0) {
        resultItems.forEach(item => item.style.display = 'flex');
      }
    } else {
      searchResults.classList.add('hidden');
    }
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      searchResults.classList.remove('hidden');
    }
  });

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchResults.classList.add('hidden');
    }
  });

  // --- Navigate to Detail from Search Results ---
  resultItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const restaurantId = item.dataset.restaurant;
      const targetPage = restaurantPages[restaurantId];
      if (targetPage) {
        showPage(targetPage);
      }
    });
  });

  // --- Tab Switching (scoped to each detail page) ---
  document.querySelectorAll('.detail-right').forEach(rightCol => {
    const tabBtns = rightCol.querySelectorAll('.tab-btn');
    const tabContents = rightCol.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update active tab button within this section only
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content within this section only
        tabContents.forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(`content-${tabName}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });

  // --- Comment Submission ---
  document.querySelectorAll('.comment-input').forEach(field => {
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && field.value.trim()) {
        const commentsContainer = field.closest('.tab-content').querySelector('.existing-comments');
        const newComment = document.createElement('div');
        newComment.className = 'comment-row';
        newComment.style.animation = 'tabFadeIn 0.3s ease forwards';
        newComment.innerHTML = `
          <div class="avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div class="comment-bubble">
            <div class="comment-author">Anda</div>
            ${field.value.trim()}
          </div>
        `;
        commentsContainer.prepend(newComment);
        field.value = '';
      }
    });
  });

  // --- Auto-focus search on page load ---
  setTimeout(() => {
    searchInput.focus();
  }, 600);
});
