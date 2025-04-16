document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('catalog-search');
    const productsContainer = document.getElementById('products-container');
    if (searchInput && productsContainer) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            const cards = productsContainer.querySelectorAll('.product-card');
            let visibleCount = 0;
            cards.forEach(card => {
                const title = card.querySelector('.product-card__title');
                if (!title) return;
                const text = title.textContent.trim().toLowerCase();
                if (text.includes(query)) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            const productsCount = document.getElementById('products-count');
            if (productsCount) {
                productsCount.textContent = `Найдено товаров: ${visibleCount}`;
            }
        });
    }

    // Инициализация переключения фильтров
    const toggleBtn = document.getElementById('catalog-toggle-filters');
    const filtersSection = document.getElementById('filters-section');
    const toggleIcon = document.querySelector('#catalog-toggle-filters .material-icons');
    const toggleText = document.getElementById('toggle-text');
    if (toggleBtn && filtersSection && toggleText) {
        let open = true;
        function updateUI() {
            if (open) {
                filtersSection.classList.add('open');
                if (toggleIcon) toggleIcon.textContent = 'expand_less';
                toggleText.textContent = 'Скрыть фильтры';
            } else {
                filtersSection.classList.remove('open');
                if (toggleIcon) toggleIcon.textContent = 'expand_more';
                toggleText.textContent = 'Показать фильтры';
            }
        }

        toggleBtn.addEventListener('click', function () {
            open = !open;
            updateUI();
        });

        updateUI();
    }
});
