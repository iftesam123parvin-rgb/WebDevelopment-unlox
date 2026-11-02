// api.js – network calls for the Movie Search App (TVMaze API, no key needed)
// Docs: https://www.tvmaze.com/api

const BASE_URL = 'https://api.tvmaze.com';

export class MovieError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MovieError';
  }
}

const fetchJSON = async (url) => {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new MovieError('Network error. Please check your internet connection.');
  }
  if (response.status === 429) {
    throw new MovieError('Too many requests. Please wait a few seconds and try again.');
  }
  if (!response.ok) {
    throw new MovieError(`Server error (${response.status}). Please try again later.`);
  }
  return response.json();
};

// Strip HTML tags from API summaries safely
const stripHTML = (html) =>
  html ? new DOMParser().parseFromString(html, 'text/html').body.textContent.trim() : '';

// Convert the raw API object into the shape our UI needs (destructuring + defaults)
const normalize = ({
  id, name, genres = [], premiered, ended, status, language, runtime,
  rating: { average } = {}, image, summary, network, webChannel, officialSite, _embedded,
}) => ({
  id,
  title: name,
  genres,
  premiered,
  year: premiered ? premiered.slice(0, 4) : 'N/A',
  ended,
  status,
  language,
  runtime,
  rating: average,
  poster: image?.medium ?? null,
  posterLarge: image?.original ?? image?.medium ?? null,
  summary: stripHTML(summary),
  network: network?.name ?? webChannel?.name ?? 'N/A',
  officialSite,
  cast: (_embedded?.cast ?? []).slice(0, 12).map(({ person, character }) => ({
    name: person.name,
    character: character.name,
    photo: person.image?.medium ?? null,
  })),
});

export const searchTitles = async (query) => {
  const data = await fetchJSON(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
  if (!data.length) {
    throw new MovieError(`No results found for "${query}". Try a different title.`);
  }
  return data.map(({ show }) => normalize(show));
};

export const getDetails = async (id) => {
  const data = await fetchJSON(`${BASE_URL}/shows/${id}?embed=cast`);
  return normalize(data);
};
