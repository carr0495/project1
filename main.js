//Project 1 - movie database search

let APP = {
    pages: [],
    active: null,
    baseURL: "https://api.themoviedb.org/3/",
    APIkey: "?api_key=654017f2465d4ccc44d71a511faa8c40&language=en-US&page=1&include_adult=false&query=",
    imagePath: "https://image.tmdb.org/t/p/",
    movieID: null,
    person: null,
    personTarget: null,
    movieTarget: null,
    dataTarget: null,
    counter: null,
    // movieURL: `${APP.baseURL}movie/{${APP.movieID}}`,
    // personURL: `${APP.baseURL}search/${APP.person}`,
    personData: null,
    movieData: null,
    movieDataDisplay: function (ev) {
        APP.counter = 1;
        APP.clearPages();
        APP.dataTarget = ev;
        APP.active = "movieData";
        location.href = "#movieData";
        APP.checkHash("movieData")
        //console.log(ev.target.alt);
        //console.log('inside movie data');
        //console.log(`${APP.baseURL}search/movie/${ev.target.alt}${APP.APIkey}`);
        let mylink = `https://api.themoviedb.org/3/movie/${ev.target.alt}?language=en-US&api_key=654017f2465d4ccc44d71a511faa8c40`;
        let castLink = `https://api.themoviedb.org/3/movie/${ev.target.alt}/credits?language=en-US&api_key=654017f2465d4ccc44d71a511faa8c40`
        fetch(mylink)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                let parent = document.getElementById("movieData");
                let img = document.createElement('img');
                let infoName = document.createElement('h3');
                let infoDate = document.createElement('h3');
                let overview = document.createElement('p');
                let popularity = document.createElement('h3');
                let info = document.createElement('h3');

                div = document.createElement('div');
                img.src = `${APP.getImageSizeLink(500)}${data.backdrop_path}`;
                parent.appendChild(div);
                div.appendChild(img);
                popularity.textContent = `Popularity: ${data.popularity}%`;
                infoName.textContent = `${data.original_title}`;
                div.appendChild(infoName);
                div.appendChild(popularity);
                infoDate.textContent = `Release Date: ${data.release_date}`;
                div.appendChild(infoDate);
                overview.textContent = `${data.overview}`;
                div.appendChild(overview);
            })
            .catch({});
            fetch(castLink)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.cast.forEach(member => {
                    //console.log(member.name);
                    let parent = document.getElementById('movieData');
                    let container = document.createElement('div');
                    container.id = "container";
                    let castContainer = document.createElement('div');
                    castContainer.id = "castContainer";
                    parent.appendChild(container);
                    container.appendChild(castContainer);
                    let img = document.createElement('img');
                    img.src = `${APP.getImageSizeLink(300)}${member.profile_path}`;
                    if (member.profile_path == null) {
                        img.src = "no_photo.png";
                    }
                    castContainer.appendChild(img);
                    let name = document.createElement('p');
                    name.textContent = member.name + " | " + member.character;
                    castContainer.appendChild(name);


                });
                
            })
    },
    displayMovies: function (ev) {
        // console.log(ev.target.alt);
        // console.log(ev.target.firstChild.data);
        //console.log(ev.target);
        APP.counter = 1;
        APP.clearPages();
        APP.movieTarget = ev;
        location.href = "#movies"
        APP.checkHash('movies');

        let link = ev.target.alt;
        if (!ev.target.alt) {
            link = ev.target.firstChild.data;
        }
        

        fetch(`${APP.baseURL}search/person${APP.APIkey}${link}`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                data.results[0].known_for.forEach(movie => {
                    if (movie.media_type == "movie") {
                        let img = document.createElement('img');
                        let movieName = document.createElement('h1');
                        let div = document.createElement('div');
                        movieName.textContent = movie.original_title;
                        let parent = document.getElementById("movies");
                        img.src = `${APP.getImageSizeLink(300)}${movie.poster_path}`;
                        img.alt = movie.id;
                        //console.log(movie.id);

                        parent.appendChild(div);
                        div.appendChild(img);
                        div.appendChild(movieName);
                        img.addEventListener('click', APP.movieDataDisplay);

                    }

                });
            })

    },
    getImageSizeLink: function (width) {
        return `${APP.imagePath}w${width}/`
    },
    displayProfile: function (object) {
        location.href = "#actor";
        APP.checkHash('actor');
        let parent = document.getElementById('actor');
        let div = document.createElement('div');
        let name = document.createElement('h1');
        let image = document.createElement('img');
        let imageLink = APP.getImageSizeLink(300);

        name.textContent = object.name;
        image.src = `${imageLink}${object.profile_path}`;
        object.known_for.forEach(pic => {
            //add #actor to the end

            if (pic.media_type == "movie") {
                //console.log(image);
                if (object.profile_path != null) {
                    div.id = object.name;
                    image.alt = object.name;
                    parent.appendChild(div);
                    div.appendChild(image);
                    div.appendChild(name);
                    image.addEventListener('click', APP.displayMovies);

                }

            }
        });




    },
    init: () => {
        APP.pages = document.querySelectorAll(".page");
        APP.person = document.getElementById("personName");
        //console.log(APP.person);
        //console.log("hello");
        APP.clearPages();

        let URLs = location.href.split('=');
        APP.person = URLs[1];
        if (APP.person.includes("#")) {
            let x = APP.person.split("#");
            APP.person = x[0];
        };
        console.log(APP.person);
        //console.log(`${APP.baseURL}search/${APP.person}${APP.APIkey}`);

        // window.addEventListener('hashchange', hc);
        window.addEventListener('popstate', ps);


        fetch(`${APP.baseURL}search/person${APP.APIkey}${APP.person}`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                data.results.forEach(person => {
                    if (person.known_for_department == "Acting") {
                        APP.displayProfile(person);
                    }
                });
            })

    },
    checkHash: function (pageName) {
        APP.pages.forEach(page => {
            if (page.id == pageName) {
                page.classList.remove('disabled');
            } else {
                page.classList.add('disabled');
            }

        });


    },
    clearPages: function () {

        APP.pages.forEach(page => {
            // let nodes = page.childNodes
            // nodes.forEach(element => {
            //     page.removeChild(element);
            while (page.firstChild) {
                console.log(`removed: ${page.firstChild}`);
                
                page.removeChild(page.firstChild);
            }
            
        });

    }


}

function hc(ev) {
    console.log("INSIDE HASHCHANGE");
    console.log(ev.newURL);
    
    

}

function ps(ev) {
    console.log("popstate inside");
    let name = location.hash.split("#");
    ev.preventDefault();
    APP.clearPages();
    if (APP.counter != 1) {
        if (name[1] == "actor") {
            APP.init();
        } else if (name[1] == "movies") {
            APP.displayMovies(APP.movieTarget);
    
        } else {
            APP.movieDataDisplay(APP.dataTarget);
    
        } 
    }
    APP.counter = 0;

}

document.addEventListener("DOMContentLoaded", APP.init);