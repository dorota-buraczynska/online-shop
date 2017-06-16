var renderEntries = function (entries) {
    var blogWrapper = $('.blog__wrapper');
    blogWrapper.empty();
    for (var i = 0; i < entries.length; i++) {
        var entry = $('<div>', {
            'class': 'blog__entry',
            'data-id': entries[i].id
        });
        var entryPhoto = $('<img>', {
            'class': "blog__entry-photo",
            'src': entries[i].img_src
        });
        var entriesWrapper = $('<div>', {
            'class': 'blog__entry-wrapper'
        });
        var entryTitle = $('<div>', {'class': 'blog__entry-title'}).text(entries[i].title);
        var entryText = $('<div>', {'class': 'blog__entry-text'}).text(entries[i].text);
        var entryDate = $('<div>', {'class': 'blog__entry-date'}).text(entries[i].date);
        var entryButton = $('<button>', {'class': 'blog__button'}).text('read more');

        blogWrapper.append(entry);
        entry
            .append(entryPhoto)
            .append(entriesWrapper);
        entriesWrapper
            .append(entryTitle)
            .append(entryDate)
            .append(entryText)
            .append(entryButton);
    }

    var entriesOnPage = $('.blog__wrapper .blog__entry');
    entriesOnPage.hide();
    entriesOnPage.slice(0, 3).show();
    $('.products__button-next').show();
};

var loadEntries = function () {
    $.ajax({
        url: 'db/entries.json',
        method: 'GET',
        dataType: 'json'
    }).done(function (response) {
        renderEntries(response.entries);
    }).fail(function (error) {
        console.log(error);
    })
};

loadEntries();

$('.blog__button-next').on('click', function () {
    showNextProducts('.blog__wrapper .blog__entry:hidden');
});
