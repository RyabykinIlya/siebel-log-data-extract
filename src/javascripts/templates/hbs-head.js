requirejs(['jquery', 'handlebars'], function($, Handlebars) {
    var source = $("#hbs-head-template").html();

    var template = Handlebars.compile(source);

    var html = template({
        metaContent: 'Siebel Log Info Extract',
        title: 'Siebel Log Info Extract',
        googleFonts: 'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en',
        materialIcons: 'https://fonts.googleapis.com/icon?family=Material+Icons'
    });

    $('.hbs-head-container').append(html);
});