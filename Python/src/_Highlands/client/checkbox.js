var checkboxData;

function displayCheckboxData() {
	getAjaxData("/checkbox-data", setCheckboxData);
}

function setCheckboxData(data) {
	checkboxData = data;
	getAjaxData("/emails-and-clients", drawCheckboxCharts);
}

function drawCheckboxCharts(data) {
	let emails = data[0];
	let clients = data[1];
	let id = "checkbox-filter";
	let menu = buildMenu(undefined, id, clients, emails);
	let html = $(`${menu}`);
	html.css({'width':'auto'});
	$("#checkbox-filter-drop-down").html(html);
	$("#checkbox-filter").select2({theme: "classic", dropdownAutoWidth : 'true', width: 'auto'});
	let title = div(`${CHECKBOXES_TAB_TEXT}`);
	$("#checkbox-title").html(title);

	function drawAllCheckboxCharts(clientOrEmail) {
	 	$("#checkboxcharts").empty();
		for(let i = 0; i < checkboxData['record'].length; i++) {
			let number = checkboxData['record'][i]['Number'];
			let question = checkboxData['record'][i]['Question'];
			let title = div(`<br/>${number}. ${question}`);
			$("#checkboxcharts").append(title);
			let html = div("", `checkbox-figure-${i}`);
			$("#checkboxcharts").append(html);
			
			drawCheckboxChart(`#checkbox-figure-${i}`, clientOrEmail, i);
		}
	}
	// initial draw
	drawAllCheckboxCharts('all');

	$("#checkbox-filter").on("change", function(e) { 
		if(e.val === "-") {
			drawAllCheckboxCharts('all');
		} else {
			let parts = e.val.split(',');
			let group = parts[0];
			let text = parts[1];
			drawAllCheckboxCharts(text);
		}
	});

}

function drawCheckboxChart(selector, clientOrEmail, i) {
	let o = {
		bindto: selector,
		axis: { rotated:false, x:{ type:'category', categories: ['frequencies (%)']}},
	    data: {
	        columns: [],
	        type: 'bar'
	    },
	    bar: {
	        width: {
	            ratio: 0.5
	        }
	    },
	    tooltip: {contents:"this_will_be_replaced"}
	};
	o['data']['columns'] = checkboxData['record'][i]['data'][clientOrEmail];
	o["tooltip"]["contents"] = function(d, defaultTitleFormat, defaultValueFormat, color) {
		let recordCount = checkboxData['recordCount'];
	    defaultTitleFormat = function() {
		    return `Frequency`;
	    };
	    defaultValueFormat = function(value) {
	    	return Math.round(value*recordCount/100);
	    }
	    return c3.chart.internal.fn.getTooltipContent.apply(this, arguments);
    }

	var chart = c3.generate(o);
}
