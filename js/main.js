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
    // Ricerca film con click su bottone
    btnSearch.click( function () {
        if (title.val().trim() !== '') {
            // Stampa serie tv ricercato
            searchSeries(template, title, moviesList);
            // Stampa film ricercato
            searchMovies(template, title, moviesList);
        }
        else {
            alert('Inserisci un titolo.')
            title.focus();
            // Pulizia Input
            title.val('');
        }
    });
}); // <-- End Doc Ready
/************
    FUNZIONI
 ************/
// Funzione: Ottieni e stampa Serie Tv ricercata
function searchSeries(template, name, containerList) {
    // Reset risultati delle ricerche precedenti
    resetList(containerList);
    // Chiamata Api
    $.ajax({
        url: 'https://api.themoviedb.org/3/search/tv',
        method: 'GET',
        data: {
            api_key: 'e99307154c6dfb0b4750f6603256716d',
            query: name.val(),
            language: 'it-IT'
        },
        success: function (res) {
            var series = res.results;
            //console.log(movies);
            if (series.length > 0) {
                for (var i = 0; i < series.length; i++) {
                    var item = series[i];
                    var content = {
                        title: item["name"],
                        originalTitle: item["original_name"],
                        originalLanguage: languageFlag(item["original_language"]),
                        averageVote: starVote(item["vote_average"]),
                        tipo: 'Serie Tv'
                    };
                    // Compilare e aggiungere template
                    var serie = template(content);
                    containerList.append(serie);
                }
            }
            else {
                //alert('Titolo non trovato tra la selezione di Serie Tv.');
                console.log('Titolo non trovato tra la selezione di Serie Tv.');
                name.select();
            }
        },
        error: function () {
            console.log('Errore chiamata API');
        }
    });
}
// Funzione: Ottieni e stampa Film ricercato
function searchMovies(template, title, containerList) {
    // Reset risultati delle ricerche precedenti
    resetList(containerList);
    // Chiamata Api
    $.ajax({
        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
            api_key: '80c54ac2cd974f9a95b3a7f2c5062e4a',
            query: title.val(),
            language: 'it-IT'
        },
        success: function (res) {
            var movies = res.results;
            //console.log(movies);
            if (movies.length > 0) {
                for (var i = 0; i < movies.length; i++) {
                    var item = movies[i];
                    var content = {
                        title: item["title"],
                        originalTitle: item["original_title"],
                        originalLanguage: languageFlag(item["original_language"]),
                        averageVote: starVote(item["vote_average"]),
                        tipo: 'Film'
                    };
                    // Compilare e aggiungere template
                    var movie = template(content);
                    containerList.append(movie);
                }
            }
            else {
                //alert('Titolo non trovato tra la selezione di Film.');
                console.log('Titolo non trovato tra la selezione di Film.');
                title.select();
            }
        },
        error: function () {
            console.log('Errore chiamata API');
        }
    });
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
    if (param === 'it') {
        return '<img class="flag" src="img/it.svg" alt="Italin Flag">';
    }
    else if (param === 'en') {
        return '<img class="flag" src="img/en.svg" alt="English Flag">';
    }
    else {
        return param;
    }
}