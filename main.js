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
        ev.preventDefault();
        history.pushState({}, "", "#movieData");
        APP.counter = 1;
        APP.clearPages();
        APP.dataTarget = ev;
        APP.active = "movieData";
        APP.checkHash("movieData")
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

            });
            })
            .catch({});
        
    },
    displayMovies: function (ev) {
        ev.preventDefault();
        history.pushState({}, "", "#movies");
        APP.counter = 1;
        APP.clearPages();
        APP.movieTarget = ev;
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
    displayProfile: function (ev) {
        ev.preventDefault();
        history.pushState({}, "", "#actor");
        APP.personTarget = ev;
        APP.checkHash('actor');

        APP.person = ev.target.parentElement[0].value
        fetch(`${APP.baseURL}search/person${APP.APIkey}${APP.person}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.results.forEach(person => {
                    if (person.known_for_department == "Acting") {

                        APP.checkHash('actor');
                        let parent = document.getElementById('actor');
                        let div = document.createElement('div');
                        let name = document.createElement('h1');
                        let image = document.createElement('img');
                        let imageLink = APP.getImageSizeLink(300);

                        name.textContent = person.name;
                        image.src = `${imageLink}${person.profile_path}`;
                        person.known_for.forEach(pic => {
                            //add #actor to the end

                            if (pic.media_type == "movie") {
                                //console.log(image);
                                if (person.profile_path != null) {
                                    div.id = person.name;
                                    image.alt = person.name;
                                    parent.appendChild(div);
                                    div.appendChild(image);
                                    div.appendChild(name);
                                    image.addEventListener('click', APP.displayMovies);

                                }

                            }
                        });

                    }
                });

            });

    },
    init: () => {
        APP.pages = document.querySelectorAll(".page");
        APP.person = document.getElementById("personName");
        let search = document.getElementById('submitButton');
        console.log(search);
        search.addEventListener('click', APP.displayProfile);
        window.addEventListener('popstate', ps);

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
function ps(ev) {
    ev.preventDefault();

    let name = location.hash.split("#");
    console.log(name[1]);
    console.log(ev.state);
    
    // if (name[1] == "actor") {
    //     APP.displayProfile(APP.personTarget);
    // } else if (name[1] == "movies") {
    //     APP.displayMovies(APP.movieTarget);

    // } else {
    //     APP.movieDataDisplay(APP.dataTarget);

    // } 

}

document.addEventListener("DOMContentLoaded", APP.init);