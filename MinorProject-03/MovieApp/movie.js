export const OMDB_API_KEY = "https://www.omdbapi.com/?i=tt3896198&apikey=e3a8ad95";

import { OMDB_API_KEY } from "./config.js";



// Select HTML Elements

const form = document.querySelector("#movie-form");

const input = document.querySelector("#movie-input");

const statusMessage =
    document.querySelector("#movie-status");

const results =
    document.querySelector("#movie-results");

const detailsPanel =
    document.querySelector("#movie-details");

const resultsTitle =
    document.querySelector("#results-title");

const resultsCount =
    document.querySelector("#results-count");


// Display Status Messages

const setStatus = (message, isError = false) => {

    statusMessage.textContent = message;

    statusMessage.classList.toggle("error", isError);

};


// Search Movies Using OMDb API

async function searchMovies(query) {

    const params = new URLSearchParams({

        apikey: OMDB_API_KEY,

        s: query,

        type: "movie"

    });

    const response = await fetch(
        `https://www.omdbapi.com/?${params}`
    );

    if (!response.ok) {

        throw new Error(
            "Unable to connect to movie service."
        );

    }

    const data = await response.json();

    if (data.Response === "False") {

        throw new Error(
            data.Error || "No movies found."
        );

    }

    return data.Search ?? [];

}


// Get Individual Movie Details

async function getMovieDetails(imdbID) {

    const params = new URLSearchParams({

        apikey: OMDB_API_KEY,

        i: imdbID,

        plot: "full"

    });

    const response = await fetch(
        `https://www.omdbapi.com/?${params}`
    );

    if (!response.ok) {

        throw new Error(
            "Could not load movie details."
        );

    }

    const data = await response.json();

    if (data.Response === "False") {

        throw new Error(
            data.Error || "Could not load movie details."
        );

    }

    return data;

}


// Create Movie Cards

function createMovieCard(movie) {

    const {
        Title,
        Year,
        Poster,
        imdbID
    } = movie;


    const card = document.createElement("article");

    card.className = "movie-card";

    card.tabIndex = 0;

    card.setAttribute("role", "button");

    card.setAttribute(
        "aria-label",
        `View details for ${Title}`
    );


    // Create Poster

    if (Poster && Poster !== "N/A") {

        const image = document.createElement("img");

        image.className = "movie-poster";

        image.src = Poster;

        image.alt = `Poster for ${Title}`;

        image.loading = "lazy";

        card.appendChild(image);

    } else {

        const placeholder = document.createElement("div");

        placeholder.className = "poster-placeholder";

        placeholder.textContent = "▣";

        card.appendChild(placeholder);

    }


    // Create Movie Information

    const info = document.createElement("div");

    info.className = "movie-card-info";


    const title = document.createElement("h3");

    title.textContent = Title;


    const meta = document.createElement("div");

    meta.className = "movie-meta";


    const year = document.createElement("span");

    year.textContent = Year;


    const type = document.createElement("span");

    type.className = "movie-rating";

    type.textContent = "Movie";


    meta.append(year, type);

    info.append(title, meta);

    card.appendChild(info);


    // Open Movie Details

    const openDetails = () => showDetails(imdbID);

    card.addEventListener("click", openDetails);

    card.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openDetails();

        }

    });


    return card;

}


// Display Movie Results

function renderMovies(movies) {

    results.replaceChildren(
        ...movies.map(createMovieCard)
    );

    resultsCount.textContent =
        `${movies.length} results`;

}


// Display Selected Movie Details

async function showDetails(imdbID) {

    detailsPanel.hidden = false;

    detailsPanel.textContent =
        "Loading movie details...";


    try {

        const movie = await getMovieDetails(imdbID);

        detailsPanel.replaceChildren();


        // Movie Poster

        const poster = document.createElement("img");

        if (movie.Poster && movie.Poster !== "N/A") {

            poster.src = movie.Poster;

        }

        poster.alt = `Poster for ${movie.Title}`;


        // Movie Information

        const content = document.createElement("div");


        const title = document.createElement("h3");

        title.textContent = movie.Title;


        const info = document.createElement("p");

        info.textContent =
            `${movie.Year} · ${movie.Runtime} · ${movie.Genre} · IMDb ${movie.imdbRating}`;


        const plot = document.createElement("p");

        plot.textContent = movie.Plot;


        const cast = document.createElement("p");

        cast.textContent = `Cast: ${movie.Actors}`;


        // Close Button

        const close = document.createElement("button");

        close.className = "details-close";

        close.textContent = "Close details";

        close.addEventListener("click", () => {

            detailsPanel.hidden = true;

        });


        content.append(
            title,
            info,
            plot,
            cast,
            close
        );


        detailsPanel.append(poster, content);


        detailsPanel.scrollIntoView({

            behavior: "smooth",

            block: "nearest"

        });


    } catch (error) {

        detailsPanel.textContent = error.message;

    }

}


// Handle Movie Search

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const query = input.value.trim();

    if (!query) return;


    // Check API Key

    if (
        !OMDB_API_KEY ||
        OMDB_API_KEY.includes("YOUR_API_KEY")
    ) {

        setStatus(
            "Please add your OMDb API key in config.js.",
            true
        );

        return;

    }


    results.replaceChildren();

    detailsPanel.hidden = true;

    resultsTitle.textContent =
        `Results for "${query}"`;


    setStatus("Searching movies...");


    const button = form.querySelector("button");

    button.disabled = true;


    try {

        const movies = await searchMovies(query);

        renderMovies(movies);


        setStatus(
            movies.length
                ? "Select a movie to view more details."
                : "No matching movies found."
        );


    } catch (error) {

        resultsCount.textContent = "";

        setStatus(error.message, true);


    } finally {

        button.disabled = false;

    }

});