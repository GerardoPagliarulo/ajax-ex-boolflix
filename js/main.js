/************
    BOOLFLIX
 ************/
$(document).ready( function () {
    // Ref
    var title = $('input');
    // Init Handlebars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);
    // Ricerca film con click su bottone
    $('button').click( function () {
        if (title.val().trim() !== '') {
            // Stampa film ricercato
            searchMovies(template, title);
        }
        // Pulizia Input
        title.val('');
    });
}); // <-- End Doc Ready
/************
    FUNZIONI
 ************/
// Ottieni e stampa film ricercato
function searchMovies(template, title) {
    // Reset risultati delle ricerche precedenti
    $('.list-movies').html(''); //empty()
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
            for (var i = 0; i < movies.length; i++) {
                var item = movies[i];
                // Dati template
                var content = {
                    title: item["title"],
                    originalTitle: item["original_title"],
                    originalLanguage: item["original_language"],
                    averageVote: item["vote_average"]
                };
                // Compilare e aggiungere template
                var movie = template(content);
                $('.list-movies').append(movie);
                // Pulizia Input
                //title.val('');
            }
        },
        error: function () {
            console.log('Errore chiamata API');
        }
    });
}