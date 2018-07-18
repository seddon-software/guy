function getAjaxData(url, fn) {
    $.ajax(
    {
        url: url,
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	fn(data);
        }	
    });
}

