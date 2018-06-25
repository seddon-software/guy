var NUMBER = 0;
var SECTION = 1;
var QUESTION = 2;
var TYPE = 3;
var AUTOFILL = 4;
var OPTIONS = 5;
var VALUES = 6;

var pieChartData;
var pieChartQuestionsAndOptions;

function displayPieCharts() {
	pieChartData = undefined;
	pieChartQuestionsAndOptions = undefined;
	getPieChartData();
	getPieChartQuestionsAndOptions();
}

function displayCharts() {
	console.log("displayCharts()");
	getChartData();
}

function getChartData() {
    $.ajax(
    {
        url: '/chart-data',
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	console.log(data);
        	drawChart(data);
        }	
    });
}

function getPieChartData() {
    $.ajax(
    {
        url: '/piechart-data',
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	pieChartData = data;
        	if (pieChartData && pieChartQuestionsAndOptions) {
        		drawPieChart(data);
        	}
        }	
    });
}

function getPieChartQuestionsAndOptions() {
    $.ajax(
    {
        url: '/piechart-questions-options',
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	pieChartQuestionsAndOptions = data;
        	if (pieChartData && pieChartQuestionsAndOptions) {
	        	drawPieChart(data);
        	}
        }	
    });
}

function drawChart(data) {
 	function zip(a, b) {
		var result = [];
		for(var i = 0; i < a.length; i++){
			result.push([a[i], b[i]]);
		}
		return result;
	}
 	function splitKeys(keys) {
		var result = [];
		for(var i = 0; i < keys.length; i++){
			result.push([keys[i].split(',')]);
		}
		return result;
 		
 	} 	
	function determineClients() {
		let clients = [];
		keys.forEach(function(key) {
			let client = key.split(",")[1];
			if($.inArray(client, clients) === -1) clients.push(client);
		});
		return clients;
	}
	function determineAspects() {
		let aspects = [];
		keys.forEach(function(key) {
			let aspect = key.split(",")[0];
			if($.inArray(aspect, aspects) === -1) aspects.push(aspect);
		});
		return aspects;
	}
	function splitValues() {
		var array = [];
		while(values.length) array.push(values.splice(0,clients.length));
		return array;
	}
	function addAspectNamesToStartOfColumn() {
		for(let i = 0; i < aspects.length; i++) {
			values[i].unshift(aspects[i]);
		}
	}	
	let keys = Object.keys(data);
	let values = Object.values(data);
	let clients = determineClients();
	let aspects = determineAspects();
	values = splitValues()
	addAspectNamesToStartOfColumn();

	var chart = c3.generate({
		title: {
		    text:'Strength of each Aspect'
		},
		data: {
	        columns: values,
	        type: 'bar'
	    },
	    bar: {
	        width: {
	            ratio: 0.5 // this makes bar width 50% of length between ticks
	        }
	    },
	    axis: {
			rotated: true,
		    x: {
	            type: 'category',
	            categories: clients
	        }
	    },
	    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	    tooltip: {
	        format: {
	            title: function (d) { 
	            	console.log("tooltip");
	            	return 'Data ' + d; },
	            value: function (value, ratio, id) {
	            	console.log("tooltip");
	                var format = id === 'data1' ? d3.format(',') : d3.format('$');
	                return format(value);
	            }
//	            value: d3.format(',') // apply this format to both y and y2
	        }
	    }
	});
}

function drawPieChart() {
	// uses globals: pieChartData, pieChartQuestionsAndOptions
	// the server sends data values of -1 when there is no data
	
	function truncate(s, length) {
	    if (s.length > length) {
	      s = s.substring(0, length - 3) + "...";
	    }
	    return s;
	}
	
	let maxTitleLength = 100;
	let maxLegendLength = 100;
	
	for(let i = 0; i < pieChartData.length; i++) {
		let selector = `#chart${i}`;
		let anchor = div("", `chart${i}`).css({"float":"left"});
 	    $("#piechart").append(anchor);
 	    let data = pieChartData[i];
 	    let number = pieChartQuestionsAndOptions[i][NUMBER];
 	    let title = pieChartQuestionsAndOptions[i][QUESTION];
 	    title = `${number}. ${title}`;
 	    title = truncate(title, maxTitleLength);
 	    let legend = pieChartQuestionsAndOptions[i][OPTIONS];

 		// make sure no more than n pie charts are drawn per line
 	    let chartsPerLine = 1;
 		let w1 = $(window).width()/pieChartData.length;
 		let w2 = $(window).width()/chartsPerLine;
 		let width = Math.max(w1, w2);

 	    pie = `["${truncate(legend[0],maxLegendLength)}", ${data[0]}]`;
 	    for(let k = 1; k < data.length; k++) {
 	    	if(data[k] !== -1) pie += `,\n["${truncate(legend[k], maxLegendLength)}", ${data[k]}]`;
 	    }
 	    //title = escape(title);
	    //"onmouseover":"function(d,i){ console.log('onmouseover', d, i); }",
    	//"value": "function(value, ratio, id) {console.log('tooltip');var format = id === 'data1' ? d3.format(',') : d3.format('$');return format(value);}"
//	    	"tooltip": {
// 	    		"format": {
// 	    			"title": "function(d){console.log('tooltip2'); return '';}"
// 	    		}
// 	    	},
 	    title = title.replace(/\"/g,'\\"');		// escape all " quotes
 	    o = `{
 	    	"title": {"text":"${title}"},
 	    	"size": {"width":"${width}"},
 	    	"padding": {"bottom":"40"},
 	    	"legend": {"position":"right"},
 	    	"bindto": "${selector}",
 	    	"data": {
 	    	    "columns": [${pie}],
		        "type" : "pie"
		    },
 	    	"pie": { 
 	    	    "label": "{format:function(value, ratio, id) { console.log('x');return d3.format('$')(value);}}"
 	    	}
		}`;
// 	    console.log(o.substring(300,330));
// 	    console.log(o.substring(314,315));
 	    o = JSON.parse(o);
 		c3.generate(o);
 		// this is a hack, because charts are always centered, even though we need left justified
 		$("svg").css({"transform":"translateX(0vw)"});
 		// align title to the left
 		$(`#chart${i} > svg > text`).attr("x", 0);
	};
}

