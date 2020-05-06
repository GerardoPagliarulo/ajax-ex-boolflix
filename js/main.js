/************
    BOOLFLIX
 ************/
$(document).ready( function () {
    // Ref
    var title = $('.search-movie');
    var btnSearch = $('.search-button');
    var moviesList = $('.list-movies');
    // Ref API
    var seriesApi = {
                        url: 'https://api.themoviedb.org/3/search/tv',
                        api_key: 'e99307154c6dfb0b4750f6603256716d',
                        type: 'Serie Tv'
                    }
    var moviesApi = {
                        url: 'https://api.themoviedb.org/3/search/movie',
                        api_key: '80c54ac2cd974f9a95b3a7f2c5062e4a',
                        type: 'Film'
                    }
    // Init Handlebars
    var source = $('#movie-series-template').html();
    var template = Handlebars.compile(source);
    // Ricerca Film e Serie Tv premendo il tasto enter
    title.keypress(function (e) { 
        if (e.which == 13) {
            var query = title.val();
            showResult(seriesApi, moviesApi, query, title, template, moviesList);
        }
    });
    // Ricerca Film e Serie Tv con click su bottone
    btnSearch.click( function () {
        var query = title.val();
        showResult(seriesApi, moviesApi, query, title, template, moviesList);
    });
}); // <-- End Doc Ready
/************
    FUNZIONI
 ************/
// Funzione: Mostrare i risultati
function showResult(seriesApi, moviesApi, query, title, template, moviesList) {
    if (query.trim() !== '') {
        // Reset risultati delle ricerche precedenti
        resetList(moviesList);
        // Chiamata Api Serie Tv o Film
        currentApi(seriesApi, query, template, moviesList);
        currentApi(moviesApi, query, template, moviesList);
    }
    else {
        alert('Inserisci un titolo.')
        title.focus();
        // Pulizia Input
        title.val('');
    }
}
// Funzione: Selezionare Api
function currentApi(myApi, query, template, moviesList) {
        $.ajax({
            url: myApi.url,
            method: 'GET',
            data: {
                api_key: myApi.api_key,
                query: query,
                language: 'it-IT'
            },
            success: function (res) {
                var movies = res.results;
                //console.log(movies);
                if (movies.length > 0) {
                    templatePrint(template, movies, moviesList, myApi.type);
                }
                else {
                    //alert('Titolo non trovato tra la selezione di Film.');
                    console.log('Titolo non trovato.');
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
            posterPath: posterImage(item["poster_path"])
        };
        // Compilare e aggiungere template
        var movie = template(content);
        containerList.append(movie);
    }
}
// Funzione: Aggiungere il Poster del titolo cercato
function posterImage(param) {
    if (param !== null) {
        var poster = 'https://image.tmdb.org/t/p/w342/' + param;
        return poster;
    }
    else if (param == null) {
        var noPoster = 'img/no-poster.png';
        return noPoster;
    }
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