const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_TOP = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_TOP);

async function getMovies(url){
    const resp = await fetch(url, {
        headers:{
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
    showMovies(respData)
}

function getClassByRate(vote){
    if(vote>=7){
        return "green";
    } else if(vote > 5){
        return "orange";
    }else{
        return "red";
    }
}

function showMovies(data){
    const moviesEl = document.querySelector(".movies");

    //Очистка предыдущих фильмов
    document.querySelector(".movies").innerHTML = "";

   

    (data.items?data.items:data.films).forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        let rating;
        if(movie.ratingImdb){
            rating = movie.ratingImdb
        }else if(movie.rating){
            rating = movie.rating
        }else{
            rating = "Нет"
        }
        // let rating = movie.ratingImdb != null ? movie.ratingImdb : "Нет";
        movieEl.innerHTML = `
        <div class="movie_cover--inner">
        <img src="${movie.posterUrlPreview}" class="movie_cover"
        alt="${movie.nameRu}"
        />
        <div class="movie_cover--dark"></div>
    </div>
    <div class="movie_info">
        <div class="movie_title">${movie.nameRu}</div>
        <div class="movie_category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
        <div class="movie_average movie_average--${getClassByRate(rating)}">${rating}</div>
    </div>
        `;
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector("form");
const search = document.querySelector(".search");

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if(search.value){
        getMovies(apiSearchUrl);
    }
});

