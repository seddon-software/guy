/*
 * This function is a simple wrapper around the JQuery AJAX call
 */

function getAjaxData(url, fn) {
    $.ajax(
    {
        url: url,
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	fn(data);
        },	
    	progress: function(evt) {
        if (evt.lengthComputable) {
            console.log("Loaded " + parseInt( (evt.loaded / evt.total * 100), 10) + "%");
        }
        else {
            console.log("Length not computable.");
        }
    }
    });
}

