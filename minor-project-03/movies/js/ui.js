// ui.js – DOM rendering for the Movie Search App

const statusBox = document.querySelector('#status');
const resultsBox = document.querySelector('#results');
const modal = document.querySelector('#details-modal');
const modalBody = document.querySelector('#modal-body');

const escapeHTML = (str = '') =>
  String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

const posterHTML = (src, alt) =>
  src
    ? `<img class="poster" src="${src}" alt="${escapeHTML(alt)} poster" loading="lazy" />`
    : `<div class="poster no-poster" aria-label="No poster">🎞️</div>`;

export const showLoading = () => {
  resultsBox.innerHTML = '';
  statusBox.innerHTML = '<div class="loader" role="status" aria-label="Loading"></div>';
};

export const showMessage = (text) => {
  statusBox.innerHTML = `<p class="message">${escapeHTML(text)}</p>`;
};

export const showError = (text) => {
  resultsBox.innerHTML = '';
  statusBox.innerHTML = `<p class="message error">⚠️ ${escapeHTML(text)}</p>`;
};

export const renderResults = (items) => {
  showMessage(`Found ${items.length} result${items.length === 1 ? '' : 's'}. Click a card for details.`);
  resultsBox.innerHTML = items
    .map(({ id, title, year, rating, poster }) => `
      <button type="button" class="movie-card" data-id="${id}">
        ${posterHTML(poster, title)}
        <div class="movie-info">
          <h3>${escapeHTML(title)}</h3>
          <div class="meta">
            <span>📅 ${year}</span>
            <span class="rating">⭐ ${rating ?? '–'}</span>
          </div>
        </div>
      </button>`)
    .join('');
};

export const openModalLoading = () => {
  modalBody.innerHTML = '<div class="loader" role="status" aria-label="Loading"></div>';
  if (!modal.open) modal.showModal();
};

export const renderDetails = (item) => {
  const {
    title, posterLarge, genres, rating, premiered, ended, status,
    language, runtime, network, summary, cast, officialSite,
  } = item;

  const castHTML = cast.length
    ? `<section class="cast">
         <h3>Cast</h3>
         <div class="cast-list">
           ${cast.map(({ name, character, photo }) => `
             <div class="cast-member">
               ${photo ? `<img src="${photo}" alt="${escapeHTML(name)}" loading="lazy" />` : '<img alt="" />'}
               <div><strong>${escapeHTML(name)}</strong></div>
               <div>${escapeHTML(character)}</div>
             </div>`).join('')}
         </div>
       </section>`
    : '';

  modalBody.innerHTML = `
    <div class="details-layout">
      ${posterHTML(posterLarge, title)}
      <div>
        <h2>${escapeHTML(title)}</h2>
        <div class="rating">⭐ ${rating ? `${rating} / 10` : 'Not rated'}</div>
        <div class="tags">${genres.map((g) => `<span class="tag">${escapeHTML(g)}</span>`).join('')}</div>
        <ul class="facts">
          <li><strong>Released:</strong> ${formatDate(premiered)}</li>
          ${ended ? `<li><strong>Ended:</strong> ${formatDate(ended)}</li>` : ''}
          <li><strong>Status:</strong> ${escapeHTML(status ?? 'N/A')}</li>
          <li><strong>Language:</strong> ${escapeHTML(language ?? 'N/A')}</li>
          <li><strong>Runtime:</strong> ${runtime ? `${runtime} min` : 'N/A'}</li>
          <li><strong>Network:</strong> ${escapeHTML(network)}</li>
        </ul>
        <p class="summary">${escapeHTML(summary || 'No summary available.')}</p>
        ${officialSite ? `<p style="margin-top:10px"><a href="${escapeHTML(officialSite)}" target="_blank" rel="noopener">Official site ↗</a></p>` : ''}
      </div>
    </div>
    ${castHTML}
  `;
};

export const showModalError = (text) => {
  modalBody.innerHTML = `<p class="message error">⚠️ ${escapeHTML(text)}</p>`;
};
