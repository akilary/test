import { fetchApi } from './utils/api.js';

let currentPage = 1;
const perPage = 20;

async function initProducts() {
    const loadMoreButton = document.getElementById('load-more');
    const filterForm = document.getElementById('filter-form');

    loadProducts();
    initProductLoading(loadMoreButton);
    initFilters(filterForm);
}

function initProductLoading(loadMoreButton) {
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => loadProducts());
    }
}

function initFilters(filterForm) {
    if (filterForm) {
        const applyButton = document.getElementById('apply-filters');
        if (applyButton) {
            applyButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = 1;
                loadProducts(true);
            });
        }

        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                filterForm.reset();
                currentPage = 1;
                loadProducts(true);
            });
        }
    }
}

async function loadProducts(reset = false) {
    const container = document.getElementById('products-container');
    const productsCount = document.getElementById('products-count');
    const loadingIndicator = document.getElementById('loading-indicator');
    if (!container) return;

    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    let url = `/api/products?page=${currentPage}&per_page=${perPage}`;
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        const formData = new FormData(filterForm);
        url += `&${new URLSearchParams(formData).toString()}`;
    }

    try {
        const result = await fetchApi(url, { method: 'GET' });
        if (result.html) {
            if (reset) container.innerHTML = '';
            container.insertAdjacentHTML('beforeend', result.html);
        }

        if (productsCount && result.total_items !== undefined) {
            productsCount.textContent = `Найдено товаров: ${result.total_items}`;
        }

        currentPage++;
        const loadMoreButton = document.getElementById('load-more');
        if (loadMoreButton) {
            loadMoreButton.style.display = (result.page >= result.total_pages) ? 'none' : 'inline-block';
        }
    } catch (error) {
        console.error('Ошибка при загрузке товаров');
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initProducts);