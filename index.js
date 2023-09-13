const sections = document.querySelectorAll(".animate");

function checkSectionInView() {
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 100) {
      section.classList.add("active");
    }
  });
}

window.addEventListener("scroll", checkSectionInView);
window.addEventListener("load", checkSectionInView);


let getBody = document.querySelector("#container");
let items = [];
let getWrapper = document.querySelector("#wrapper");
let getPaginate = document.querySelector("#paginate");
let movie_list = [];
let rows = 5;
let getBackBtn;
let getInput = document.querySelector("#input");
let getPrevBtn = document.querySelector("#btn-prev");
let getNextBtn = document.querySelector("#btn-next");
let getNumOfPage = sessionStorage.getItem("numOfPage");
let currPage = sessionStorage.getItem("currentPage");
let currentPage;
let getBackBtn1 = document.querySelector("#back-btn");

let api_key = "5bc61b6bb6be8659b76261c169094ea9";
let genre_id = sessionStorage.getItem("genre_id");

let getSearch = document.querySelector('.search-box');

let genreList = [];
let availGenre = 
{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]};




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
            sessionStorage.setItem("currentPage", 1);
            window.location.href = "landing.html"
        }
        else{
            alert("Please enter a valid genre");
            window.location.reload();
        }
    }
});



if (currPage && currPage <= getNumOfPage){
    currentPage = currPage
}else {
    currentPage = 1;
}

let getItems = async ()=> {
        // We are making a request to our movie api (kinda stored the value in a file, but if you change in to our movie api it will still work) using the await keyword
        // We are able to use await because this is an asynchronous function
        // the await keyword means it waits till the request is done because we are making a request which can take time to repond

        //let url = "./data/data_horror.json"

        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genre_id}`;

        const request = await fetch(url);

        const response = await request.json(); //this give us our response in json format

        // Our returned json (key, value pair file) formatted response has a key named "results" which has a value that is a list #check our json file for confirmation
        let items_list = response.results;

        //NB. Our response.result value which is a list containing another dictionary in Python/ object in Javascript (key, value pair datatype) separated by comma. It's a LIST OF OBJECTS / DICTIONARIES.

        let items_date = {}; // This is to store our items_list.result[index] release_date(key) values, which are strings. NB. the INDEX is because we will be looping through our LIST OF OBJECTS to get each movies details.

        let items_title = []; // This is to get the title of each movie
        let items_overview = {}; // this is for the overview of each movie.
        let items_img = {};
        let items_id = {};


        //So this is the loop i was talking bout, going through our LIST OF OBJECTS.
        for (let i in items_list) {
            each_item = items_list[i]; // stores each items details in a variable.

            movieTitle = each_item.title; // stores each movies titles.

            items_title.push(movieTitle); // appends all movies titles into a list.

            items_date[movieTitle] = each_item.release_date; // guess that 😁.

            items_overview[movieTitle] = each_item.overview;// and this

            items_img[movieTitle] = each_item.poster_path;
            items_id[movieTitle] = each_item.id;

        };

        // This is to calculate our number of page due to the length of movie title list divide by the number of movies we wanna show on each page
        let page = Math.ceil(items_title.length / rows);


        // this stores our number of pages in sessionStorage so we can use it somewhere else without using the "getItem().then" stuff get it?
        sessionStorage.setItem("numOfPage", page);

        let movieList = [items_title, items_date, items_overview, page, items_img, items_id];

        //this returns 4 important things we need from this function
        DisplayList(movieList, getWrapper, rows, currentPage);
        Paginate(movieList);
        // end of THIS OBJECTS getItem().

};

let DisplayList = function (items, wrapper, row, page) {

    
    if (wrapper) { // This check if our wrapper (the div to house our Movie Titles to display on each page) is not empty, if it's not it makes it empty. This is because on every page we need an empty wrapper, this ensure our movie list doesn't stay on top of each other

        wrapper.innerHTML = "";
    };

    // This decrements our current page value, you will see the reason later on.
    page--;


    // This is the index start of our list on each page
    // So if page is 1 (the page-- up there ☝️) means it's now zero and row is constant

    /*  So page = 0, perPage = 0 * 5 = 0 # we start from index zero of the list displaying 5 items
            page = 1, perPage = 1 * 5 = 5 # we start from index zero of the list displaying 5 items and so on
    
    */
    perPage = row * page;

    let count = 0; // This is to count the number of items we have displayed on each page, so we can stop when we reach the number of items we want to display on each page

    let itemsList = items[0];
    let itemsDate = items[1];
    let itemsOverview = items[2];
    let itemsImg = items[4];
    let itemsId = items[5];

    let getMovieContainer = document.querySelectorAll(".card");
    let getMovieContainerImg = document.querySelectorAll(".card img");
    let getMovieContainerTitle = document.querySelectorAll(".card .intro h3");
    let getMovieContainerOverview = document.querySelectorAll(".card .intro p");

    for (let i = 0; i < getMovieContainer.length; i++) {
        getMovieContainerImg[i].src = "";
        getMovieContainerTitle[i].textContent = "";
        getMovieContainerOverview[i].textContent = "";
    };

    // This is to loop through our list of movie titles and display them on each page

    
    for (let i = perPage; i < row+perPage; i++, count++) { //this makes sure that the specified number of movie items are displayed. 
        if (itemsList[i] == undefined) break; // this is to stop the loop when we reach the end of our list, so we don't get an error
        getMovieContainerImg[count].src = `https://image.tmdb.org/t/p/w185${itemsImg[itemsList[i]]}`;
        getMovieContainerTitle[count].textContent = itemsList[i];
        getMovieContainerOverview[count].textContent = itemsOverview[itemsList[i]];
    };

    getMovieContainer.forEach((movie) => {
        movie.addEventListener("click", () => {
            let movieTitle = movie.querySelector("h3").textContent;
            let movieId = itemsId[movieTitle];
            let url_movie_details = `https://www.themoviedb.org/movie/${movieId}?`;
            window.open(url_movie_details, "_blank");
        });
    });


    // This is to check if our current page is greater than 1, if it is we want to show our previous button
    if (page > 0) {
        getPrevBtn.classList.remove("hide"); // so we remove the hide class from our previous button
    }
    else {
        getPrevBtn.classList.add("hide"); // else we add the hide class to our previous button
    }

    // This is to check if our current page is less than the number of pages we have, if it is we want to show our next button
    if (page < items[3]-1) {
        getNextBtn.classList.remove("hide"); // so we remove the hide class from our next button
    }else {
        getNextBtn.classList.add("hide"); // else we add the hide class to our next button
    }




};

let creatBtn = function  (numPage) {
    //this is a special function for creating our buttons
    let btn = document.createElement("Button");
    btn.classList.add("btn");
    btn.textContent = numPage;

    // we do this to add a special class name "active" which makes our current button show colors
    if (numPage == currentPage) btn.classList.add("active");
    return btn;
};

let btnColor = function (btnNum, btnClass) {
    // Now the button color function i told about, takes two parameters. First, the button's number second our button list we created up there


    // So we loop through it
    for (let i = 0; i < btnClass.length; i++) { 
        btnClass[i].classList.remove("active"); //then remove any button in the list that has the "active" class which gives it color
    }

    //then we give the button we click the "active" class so it now have the color
    btnNum.classList.add("active");
    // get it?
};

let Paginate = function (movieList) {
        // The very special function which almost everything is done
        page = movieList[3]  // we first of all get the number of button that needs to be created.


        for (let i = 1; i < page+1; i++){//then we loop through them creating our button
            let button = creatBtn(i);
            getPaginate.appendChild(button);// Then appending each button to the div created in html, which displays our buttons down there
        };


        let buttons = document.querySelectorAll(".btn"); // this stores all our button which the class name "btn" into a list


        getPrevBtn.addEventListener("click", ()=> { // this is our previous button event listener so when it's clicked
            if (currentPage > 1) { // checks if the current page we are in is > 1, because if it' less that one or == 1 we want to stop going back

                currentPage--; // if it's true we decrement our current page by one
            }
            sessionStorage.setItem("currentPage", currentPage); // then store it in sessionStorage

            DisplayList(movieList, getWrapper, rows, currentPage); //then we want to display the list on that specific page

            btnColor(buttons[currentPage-1], buttons); // then put the color on the right button again
        });
        
        getNextBtn.addEventListener("click", ()=> {

            // same for this but the opposite for the Next button
            if (currentPage < page) { // if it's < the number of our pages this increments it
                currentPage++;
            };

            // you know what all this do
            sessionStorage.setItem("currentPage", currentPage);
            DisplayList(movieList, getWrapper, rows, currentPage);
            btnColor(buttons[currentPage-1], buttons);
        });


        for(let i = 0; i < buttons.length; i++) {
            // now we are looping through our button list, told you it will be useful😁
            buttons[i].addEventListener("click", ()=> {
                // then for each of the buttons we are make an event listerner of when it's clicked

                btnColor(buttons[i], buttons); // then calling our function that colors our button when any of them is clicked # later implemented... hold on
                DisplayList(movieList, getWrapper, rows, i+1); //Now we are calling our displayList depending on which button is clicked
                // so if you click on button 2 we want page 2's list to show not page 1's, Right? Well that's what this guy those

                sessionStorage.setItem("currentPage", i+1); // now am storing our current page in sessionStorage so when we are in page 2 if we refresh the page it still stays in page 2 not otherwise.


                currentPage = sessionStorage.getItem("currentPage");//this set or current page to our exact current page when any button is clicked
            });
        };

    
};

getItems();