//Project 1 - movie database search

let APP ={
    pages: [],
    active: "search",
    baseURL : "https://api.themoviedb.org/3/",
    APIkey: "?api_key=654017f2465d4ccc44d71a511faa8c40&language=en-US&page=1&include_adult=false&query=",
    imagePath: "https://image.tmdb.org/t/p/",
    movieID: null,
    person: null,
    // movieURL: `${APP.baseURL}movie/{${APP.movieID}}`,
    // personURL: `${APP.baseURL}search/${APP.person}`,
    personData: null,
    movieData: null,
    movieDataDisplay: function(ev){
      console.log(ev.target);
      
    },
    displayMovies: function(ev){
    let actor = document.getElementById("actor").classList.add('disabled');
    // console.log(ev.target.alt);
    // console.log(ev.target.firstChild.data);
    console.log(ev.target);
    

    let link = ev.target.alt;
    if (!ev.target.alt) {
        link = ev.target.firstChild.data;
    }
    
    fetch(`${APP.baseURL}search/person${APP.APIkey}${link}`)
        .then(response=> response.json())
        .then(data =>{
            console.log(data);
            data.results[0].known_for.forEach(movie => {
                if (movie.media_type == "movie") {
                    let img = document.createElement('img');
                    let movieName = document.createElement('h1');
                    let div = document.createElement('div');
                    movieName.textContent = movie.original_title;
                    let parent = document.getElementById("movies");
                    img.src = `${APP.getImageSizeLink(300)}${movie.poster_path}`;
                    parent.appendChild(div);
                    div.appendChild(img);
                    div.appendChild(movieName);
                    img.addEventListener('click',APP.movieDataDisplay);

                }
                
            });
        })

    },
    getImageSizeLink: function(width){
         return `${APP.imagePath}w${width}/`
    },
    displayProfile: function(object){
          let parent = document.getElementById('actor');
          let div = document.createElement('div');
          let name = document.createElement('h1');
          let image = document.createElement('img');
          let imageLink = APP.getImageSizeLink(300);
          name.textContent = object.name;
          image.src = `${imageLink}${object.profile_path}`;
          if (object.known_for[0].media_type == "movie") {
              console.log(image);
              if (object.profile_path != null) {
                div.id = object.name;
                image.alt = object.name;
                parent.appendChild(div);
                div.appendChild(image);
                div.appendChild(name);
                image.addEventListener('click',APP.displayMovies);
                
              }
            
          }
          

          

    },
    init: ()=>{
        APP.pages = document.querySelectorAll(".page");
        APP.person = document.getElementById("personName");
        console.log(APP.person);
        console.log("hello");

        let URLs = location.href.split('=');
        APP.person = URLs[1];
        console.log(APP.person);
        console.log(`${APP.baseURL}search/${APP.person}${APP.APIkey}`);
        
        
        
        fetch(`${APP.baseURL}search/person${APP.APIkey}${APP.person}`)
        .then(response=> response.json())
        .then(data =>{
            console.log(data);
            data.results.forEach(person => {
                if (person.known_for_department == "Acting") {
                    APP.displayProfile(person);
                }
            });
        })

    }

}

document.addEventListener("DOMContentLoaded", APP.init);