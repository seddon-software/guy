/* 
############################################################
#
#    Highlands Client
#
#    © Highlands Negotiations, June 2018, v0.5
#
############################################################
*/
// piecharts tooltip should show frequency not marks

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
	// data is presented as an array of objects
	// each entry has:
	//		key = "<aspect>,<client>-<email>,<guid>"
	//		value = <sum of marks>
	if($.isEmptyObject(data)) {
		$("#piecharts-message").text("no pie charts available");
		return;
	} else {
		$("#piecharts-message").text("");		
	}
	let ASPECT = 0;
    let CLIENT = 1;
    
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
		// determine the categories shown on the y axis based on input "keys"
		// keys = "<aspect>,<client> <email>,<guid>"
		// remove aspect and then check for unique sets of "<client> <email>,<guid>" 
		// then remove the <guid> as its not shown on the chart
		let clients = [];
		keys.forEach(function(key) {
			// remove <aspect> and check for unique sets
			let client = key.replace(/^[^,]+,/,"");
			if($.inArray(client, clients) === -1) clients.push(client);
		});
		// now remove <guid> from end of strings
		for(let i = 0; i < clients.length; i++) {
			clients[i] = clients[i].replace(/,[^,]+$/,"");
		}
		// return categories used as y axis
		return clients;
	}
	function determineAspects() {
		function capitalize(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
		let aspects = [];
		keys.forEach(function(key) {
			let aspect = key.split(",")[ASPECT];
			aspect = capitalize(aspect);
			if($.inArray(aspect, aspects) === -1) aspects.push(aspect);
		});
		return aspects;
	}
	function splitValues() {
		let array = [];
		let spliceLength = values.length / aspects.length;
		while(values.length) array.push(values.splice(0, spliceLength));
		return array;
	}
	function addAspectNamesToStartOfColumn() {
		for(let i = 0; i < values.length; i++) {
				values[i].unshift(aspects[i]);
		}
	}
	let keys = Object.keys(data);
	let values = Object.values(data);
	let clientsAndEmails = determineClients();
	let clients = [];
	let emails = [];
	for(let i = 0; i < clientsAndEmails.length; i++) {
		clients.push(clientsAndEmails[i].replace(/^(.*)<.*/,"$1"));
		emails.push(clientsAndEmails[i].replace(/^[^<]+[<](.*)>/,"$1"));
	}
	let aspects = determineAspects();
	values = splitValues();
	addAspectNamesToStartOfColumn();
	let height = clients.length * screen.height / 10;
	let o = {};  // used to generate chart
	o["axis"] = { rotated:true, x:{ type:'category', categories:clients}};
    o["bar"]  = { width:{ ratio: 0.5}}; // this makes bar width 50% of length between ticks
	o["data"] = { columns: values, type: 'bar'};
	o["size"] = {
        height: height
    },
    o["tooltip"] = {
		format: {
			title: function(i) { 
				console.log(i, emails[i]); return emails[i]; },
			value: function (value, ratio, id) {
				return value;
			}
		}
	}
	var chart = c3.generate(o);
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
	
	let maxLegendLength = 100;

	for(let i = 0; i < pieChartData.length; i++) {
	    function appendTitle() {
	 	    title = `${number}. ${title}`;
	 	    //title = title.replace(/\"/g,'\\"');		// escape all " quotes
	 	    title = div(title,"", {"width":"100%", "color":PIECHART_TITLES_COLOR, "background-color":PIECHART_BACKGROUND_COLOR})
	 	    $("#piechart").append(title);
	 	}

		let selector = `#chart${i}`;
		
 	    let data = pieChartData[i];
 	    let number = pieChartQuestionsAndOptions[i][NUMBER];
 	    let legend = pieChartQuestionsAndOptions[i][OPTIONS];
 	    let title = pieChartQuestionsAndOptions[i][QUESTION];
 	    
 	    appendTitle();	// workaround for title broken in C3 library
 	    let anchor = div("", `chart${i}`).css({"float":"left", "width":"100%", "background-color":PIECHART_BACKGROUND_COLOR});
 	    $("#piechart").append(anchor);

 		// make sure no more than n (=1) pie charts are drawn per line
 	    let chartsPerLine = 1;
 		let w1 = $(window).width()/pieChartData.length;
 		let w2 = $(window).width()/chartsPerLine;
 		let width = Math.max(w1, w2);

 	    pie = `["${truncate(legend[0],maxLegendLength)}", ${data[0]}]`;
 	    for(let k = 1; k < data.length; k++) {
 	    	if(data[k] !== -1) pie += `,\n["${truncate(legend[k], maxLegendLength)}", ${data[k]}]`;
 	    }

 	    // build object to generate piechart
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
 	    	"tooltip": {"contents":"this_will_be_replaced"}
 	    	}`;
 	    o = JSON.parse(o);
 	    // JSON parsing converts the function to a string so change it to a function:
 	    o["tooltip"]["contents"] = function(d, defaultTitleFormat, defaultValueFormat, color) {
 		    						   var sum = 0;
 		    						   d.forEach(function (e) {
 		    							   sum += e.value;
 		    						   });
 		    						   defaultTitleFormat = function() {
 		    							   return `Frequency = ${sum}`;
 		    						   };
 		    						   return c3.chart.internal.fn.getTooltipContent.apply(this, arguments);
 								   }
 		c3.generate(o);
	};
	let endOfPiecharts = div("", "", {"clear":"both"});
	$("#piechart").append(endOfPiecharts);
}

