/************
    BOOLFLIX
 ************/
$(document).ready( function () {
    // Ref
    var title = $('.search-movie');
    var btnSearch = $('.search-button');
    var moviesList = $('.list-movies');
    // Init Handlebars
    var source = $('#movie-series-template').html();
    var template = Handlebars.compile(source);
    // Ricerca Film e Serie Tv premendo il tasto enter
    title.keypress(function (e) { 
        if (e.which == 13) {
            showResult(title, template, moviesList);
        }
    });
    // Ricerca Film e Serie Tv con click su bottone
    btnSearch.click( function () {
        showResult(title, template, moviesList);
    });
    // Hover sulle card per mostrare la descrizione
    //$('body').on('mouseenter', '.movie-series', function() {
            //$('.description', this).removeClass('disp-none');
    //});
    //$('body').on('mouseleave', '.movie-series', function() {
        //$('.description', this).addClass('disp-none');
    //});
}); // <-- End Doc Ready
/************
    FUNZIONI
 ************/
// Funzione: Mostrare i risultati
function showResult(title, template, moviesList) {
    // Reset risultati delle ricerche precedenti
    resetList(moviesList);
    var apiKey = '80c54ac2cd974f9a95b3a7f2c5062e4a';
    var language = 'it-IT';
    if (title.val().trim() !== '') {
        // Chiamata Serie Tv
        var seriesApi = {
            url: 'https://api.themoviedb.org/3/search/tv',
            api_key: apiKey,
            language: language,
            type: 'Serie Tv'
        }
        currentApi(seriesApi, title, template, moviesList);
        // Chiamata Film
        var moviesApi = {
            url: 'https://api.themoviedb.org/3/search/movie',
            api_key: apiKey,
            language: language,
            type: 'Film'
        }
        currentApi(moviesApi, title, template, moviesList);
    }
    else {
        alert('Inserisci un titolo.')
        title.focus();
        // Pulizia Input
        title.val('');
    }
}
// Funzione: Chiamata Api
function currentApi(myApi, title, template, moviesList) {
        $.ajax({
            url: myApi.url,
            method: 'GET',
            data: {
                api_key: myApi.api_key,
                query: title.val(),
                language: myApi.language
            },
            success: function (res) {
                var movies = res.results;
                //console.log(movies);
                if (movies.length > 0) {
                    templatePrint(template, movies, moviesList, myApi.type);
                }
                else {
                    //alert('Titolo non trovato tra la selezione di Film.');
                    console.log('Titolo non trovato nella categoria ' + myApi.type);
                }
            },
            error: function () {
                console.log('Errore chiamata API');
            }
        });
    }    
// Funzione: Ottenere dati template e stampare template
function templatePrint(template, movies, containerList, type) {
    for (var i = 0; i < movies.length; i++) {
        var item = movies[i];
        // Variazione del contenuto del template per Film o Serie Tv
        var title, originalTitle;
        if ( type == 'Film') {
            title = item["title"];
            originalTitle = item["original_title"];
        }
        else if ( type == 'Serie Tv') {
            title = item["name"];
            originalTitle = item["original_name"];
        }
        // Contenuto del Template
        var content = {
            title: title,
            originalTitle: originalTitle,
            originalLanguage: languageFlag(item["original_language"]),
            averageVote: starVote(item["vote_average"]),
            type: type,
            posterPath: posterImage(item["poster_path"]),
            overview: item["overview"].substr(0, 100) + '...'
        };
        // Compilare e aggiungere template
        var movie = template(content);
        containerList.append(movie);
    }
}
// Funzione: Aggiungere il Poster del titolo cercato
function posterImage(param) {
    var noPoster = 'img/no-poster.png';
    if (param) {
        var poster = 'https://image.tmdb.org/t/p/w342/' + param;
        return poster;
    }
    return noPoster;
}
// Funzione: Reset risultati delle ricerche precedenti
function resetList(element) {
    element.html('');  //empty()
}
// Funzione: Voto su base 5 e Asseganzione del voto con stelle
function starVote(num) {
    // Variazione della base del voto da 10 a 5
    var numVote = Math.round(num / 10 * 5);
    // Contenitore del risultato
    var result = '';
    // Stelle piene
    for (var i = 0; i < numVote; i++) {
        var starFull = '<i class="fas fa-star"></i>';
        result += starFull;
    }
    // Stelle vuote
    for (var i = 0; i < (5 - numVote); i++) {
        var starEmpty = '<i class="far fa-star"></i>';
        result += starEmpty;
    }
    return result;
}
// Funzione: Assegnazione bandiere italiana e inglese
function languageFlag(param) {
    var languages = [
        'en',
        'it'
    ];
    if (languages.includes(param)) {
        var flag = '<img src="img/' + param + '.svg" alt="Flag Image" class="flag"/>';
        return flag;
    }
    return param;
}