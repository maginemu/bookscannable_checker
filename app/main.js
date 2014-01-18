(function() {
    var storeID = $('#storeID').val();

    if (storeID !== 'books') {
        // ignore
        return undefined;
    }


    var obtainIsbn13 = function () {

        var isbn13 = null;

        /**
         * find ISBN-13 code from html
         * @return {string|null} if found return ISBN-13 string, else return null
         */
        var findIsbn13 = function () {
            var findIsbn13Item = function () {
                var isbn13Item = null;
                $('div.content li>b').each(function(idx, item) {
                    if (/isbn-13/i.test(item.innerHTML)) {
                        isbn13Item = item.parentNode;
                    }
                });
                return isbn13Item;
            };

            var isbn13Item = findIsbn13Item();
            if (isbn13Item) {
                var matched = isbn13Item.innerHTML.match(/97(8|9)-(\d{10})/);

                return '97' + matched[1] + matched[2];
            } else {
                return null;
            }
        };

        //
        // search in webpage
        //
        isbn13 = findIsbn13();


        if (isbn13) {
            //
            // ISBN-13 found
            //
            return isbn13;
        }


        //
        // ISBN-13 item NOT found in web page.
        // Now we attempt to convert ASIN(isbn-10) to ISBN-13
        //
        var ASIN = $('#ASIN').val();

        /**
         * convert ISBN-10 into ISBN-13
         * @param {string} isbn10
         * @return {string}
         */
        var isbn10213 = function (isbn10) {
            var woCheck = isbn10.substr(0, 9);
            var tmpIsbn13 = '978' + woCheck;

            var evenSum = 0;
            var oddSum = 0;
            for (var i=0, l=tmpIsbn13.length; i<l; i++) {
                var intDigit = parseInt(tmpIsbn13.charAt(i), 10);
                if (i % 2 == 0) {
                    // odd digit's Index is EVEN
                    oddSum += intDigit;
                } else {
                    evenSum += intDigit;
                }
            }
            var checkDigit = 10 - ((evenSum * 3 + oddSum) % 10);

            return tmpIsbn13 + checkDigit;
        };

        return isbn10213(ASIN);
    };

    var isbn13 = obtainIsbn13();

    // query
    $.getJSON('http://publisher.bookscan.co.jp/amazon.php', {
        q: isbn13,
        nojson: 0
    }, function complete(data) {
        console.log(data);

        var itemData = data && data.booklist && data.booklist[0];

        if (itemData.ScanNG) {
            $('#btAsinTitle')
                .after('<hr noshade="noshade" size="1">')
                .after('<div><b>Scan:</b> NG</div>')
                .after('<hr noshade="noshade" size="1">');
        } else {
            $('#btAsinTitle')
                .after('<hr noshade="noshade" size="1">')
                .after('<div><b>Scan:</b> OK</div>')
                .after('<hr noshade="noshade" size="1">');
        }
    });

    return undefined;
} ());