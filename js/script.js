const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_TOP = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_INFO = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
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

//Обработка вывода рейтинга
function getClassByRate(vote){
    if(vote>=7){
        return "green";
    } else if(vote > 5){
        return "orange";
    }else if(vote == "Нет"){
        return "none";
    }else{
        return "red";
    }
}

//Отрисовка блоков с фильмами
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
        }else if(movie.rating == 'null'){
            rating = 0
        }else if(movie.rating){
            rating = movie.rating
        }else{
            rating = 0
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
        ${rating != 0 ? `<div class="movie_average movie_average--${getClassByRate(rating)}">${rating}</div>` : ""}
    </div>
        `;
        movieEl.addEventListener("click", ()=> openModal(movie.kinopoiskId));
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

//Модальное окно
const modalEl = document.querySelector(".modal");
document.body.classList.add("stop_srolling");
async function openModal(id){
    const resp = await fetch(API_URL_INFO + id, {
        headers:{
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
modalEl.classList.add("modal--show");

modalEl.innerHTML=`
    <div class="modal_card">
        <img class="modal_backdrop" src="${respData.posterUrl}" alt="">
        <h2>
            <span class="modal_title">${respData.nameRu}</span>
            <span class="modal_release-year">- ${respData.year}</span>
        </h2>
        <ul class="modal_info">
            <div class="loader"></div>
            <li class="modal_genre">Жанр - ${respData.genres.map((el)=> `<span>${el.genre}</span>`)}</li>    
            ${respData.filmLength ? `<li class="modal_runtime">Время - ${respData.filmLength} минут</li>` : ""}    
            <li>Сайт: <a class="modal_site" href="${respData.webUrl}">${respData.webUrl}</a></li>    
            <li class="modal_overview">Описание - ${respData.description}</li>
        </ul>
        <button type="button" class="modal_btn_close">Закрыть</button>
    </div>
`

//Обработчики на закрытие модального окна
const btnClose = document.querySelector(".modal_btn_close");
btnClose.addEventListener("click", ()=> closeModal());
}

window.addEventListener("click", (e)=>{
    if(e.target==modalEl){
        closeModal();
    }
})

window.addEventListener("keydown", (e)=>{
    if(e.keyCode == 27){
        closeModal();
    }
})

//Функция закрытия окна
function closeModal(){
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop_srolling");

}