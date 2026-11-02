// app.js – entry point for the Movie Search App
import { searchTitles, getDetails, MovieError } from './api.js';
import {
  showLoading, showError, renderResults, openModalLoading, renderDetails, showModalError,
} from './ui.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-select');
const button = document.querySelector('#search-btn');
const resultsBox = document.querySelector('#results');
const modal = document.querySelector('#details-modal');

let results = [];

// Sorting strategies (object of arrow functions)
const sorters = {
  relevance: (list) => list,
  rating: (list) => [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
  newest: (list) => [...list].sort((a, b) => (b.premiered ?? '').localeCompare(a.premiered ?? '')),
};

const render = () => renderResults(sorters[sortSelect.value](results));

const friendly = (err) => (err instanceof MovieError ? err.message : 'Something went wrong. Please try again.');

const search = async (rawQuery) => {
  const query = rawQuery.trim();

  // Handle invalid search queries before calling the API
  if (!query) return showError('Please enter a title to search.');
  if (query.length < 2) return showError('Please enter at least 2 characters.');

  button.disabled = true;
  showLoading();
  try {
    results = await searchTitles(query);
    render();
  } catch (err) {
    console.error(err);
    results = [];
    showError(friendly(err));
  } finally {
    button.disabled = false;
  }
};

const openDetails = async (id) => {
  openModalLoading();
  try {
    const item = await getDetails(id);
    renderDetails(item);
  } catch (err) {
    console.error(err);
    showModalError(friendly(err));
  }
};

// --- Event handling ---
form.addEventListener('submit', (e) => {
  e.preventDefault();
  search(input.value);
});

sortSelect.addEventListener('change', () => {
  if (results.length) render();
});

// Event delegation for dynamically created cards
resultsBox.addEventListener('click', ({ target }) => {
  const card = target.closest('.movie-card');
  if (card) openDetails(card.dataset.id);
});

// Close modal: X button or click on backdrop (Esc works natively with <dialog>)
modal.addEventListener('click', ({ target }) => {
  if (target === modal || target.closest('.modal-close')) modal.close();
});
