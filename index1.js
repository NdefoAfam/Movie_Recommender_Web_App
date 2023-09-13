let genre_id;
let getSearch = document.querySelector('.search-box');
let genreList = [];
let availGenre = {"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]};

availGenre.genres.forEach(function(genre) {
    genreList.push(genre.name.toLowerCase());
});


getSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        let getSearchValue = getSearch.value;
        if (genreList.includes(getSearchValue.toLowerCase())) {
            for (let i in availGenre.genres) {
                if (availGenre.genres[i].name.toLowerCase() === getSearchValue.toLowerCase()) {
                    genre_id = availGenre.genres[i].id;
                    sessionStorage.setItem("genre_id", genre_id);
                    break;
                }
            }
            localStorage.setItem("currentPage", 1);
            window.location.href = "landing.html"
        }
        else{
            alert("Please enter a valid genre");
            window.location.reload();
        }
    }
});


let api_key = "5bc61b6bb6be8659b76261c169094ea9";


let getGenreClicked = document.querySelectorAll('.service-box h2');
let getGenreClickedDiv = document.querySelectorAll('.service-box');

for (let i = 0; i < getGenreClickedDiv.length; i++) {
   getGenreClickedDiv[i].addEventListener('click', function() {
         let genre_id_name = getGenreClicked[i].textContent.toLowerCase();
            for (let i in availGenre.genres) {
                if (availGenre.genres[i].name.toLowerCase() === genre_id_name) {
                    genre_id = availGenre.genres[i].id;
                    sessionStorage.setItem("genre_id", genre_id);
                    break;
                }
            };
            localStorage.setItem("currentPage", 1);
            window.location.href = "landing.html"
   });
};


let getData = async function() {
    let url = `https://api.themoviedb.org/3/trending/all/day?api_key=${api_key}&limit=8`;

    //let url_movie_details = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`;

    let request = await fetch(url);
    let result = await request.json();

    let movieList = result.results;

    let getTrendingMovieDiv = document.querySelectorAll('.container .card img');
    let getTrendingMovieDivTitle = document.querySelectorAll('.container .card h3');
    let getTrendingMovieDivOverview = document.querySelectorAll('.container .card p');
    console.log(movieList);

    for (let i=0; i < 3; i++) {
        if (movieList[i].title == undefined) {
            movieList[i].title = movieList[i].name;
        }
    };

    for (let i=0; i < getTrendingMovieDiv.length; i++) {
        getTrendingMovieDiv[i].src = `https://image.tmdb.org/t/p/w500${movieList[i].poster_path}`;
        getTrendingMovieDivTitle[i].textContent = movieList[i].title;
        getTrendingMovieDivOverview[i].textContent = movieList[i].overview;
        console.log(movieList[i].id)
        
        getTrendingMovieDiv[i].addEventListener('click', function() {
            if (movieList[i].media_type == "tv"){
                let url_movie_details = `https://themoviedb.org/tv/${movieList[i].id}?api_key=${api_key}`;
                console.log(url_movie_details);
                window.open(url_movie_details, "_blank");
            }else {
                let url_movie_details = `https://www.themoviedb.org/movie/${movieList[i].id}?api_key=${api_key}`;
                console.log(url_movie_details);
                window.open(url_movie_details, "_blank");
            };
        });
    };


    

};

getData();