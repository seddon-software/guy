var pieChartData;
var pieChartQuestionsAndOptions;

function displayCharts() {
	pieChartData = undefined;
	pieChartQuestionsAndOptions = undefined;
	getPieChartData();
	getPieChartQuestionsAndOptions()
}

function getPieChartData() {
    $.ajax(
    {
        url: '/chart-data',
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
        url: '/chart-questions-options',
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

/*
function drawChart(data) {
	let keys = Object.keys(data);
	let values = Object.values(data);
	
	keys.unshift('x');
	values.unshift('averages');
	let chart = c3.generate({
	    data: {
	        x : 'x',
	        columns: [keys, values],
	        type: 'bar'
	    },
	    axis: {
			rotated: true,
	        x: { type: 'category' }
	    }
	});
}
*/

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
 	    let number = pieChartQuestionsAndOptions[i][0];
 	    let title = pieChartQuestionsAndOptions[i][1];
 	    title = `${number}. ${title}`;
 	    title = truncate(title, maxTitleLength);
 	    console.log(title);
 	    legend = pieChartQuestionsAndOptions[i][4];

 		// make sure no more than n pie charts are drawn per line
 	    let chartsPerLine = 1;
 		let w1 = $(window).width()/pieChartData.length;
 		let w2 = $(window).width()/chartsPerLine;
 		let width = Math.max(w1, w2);

 	    pie = `["${truncate(legend[0],maxLegendLength)}", ${data[0]}]`;
 	    for(let k = 1; k < data.length; k++) {
 	    	if(data[k] !== -1) pie += `,\n["${truncate(legend[k], maxLegendLength)}", ${data[k]}]`;
 	    }
 	    o = `{
 	    	"title": {"text":"${title}"},
 	    	"size": {"width":"${width}"},
 	    	"padding": {"bottom":"40"},
 	    	"legend": {"position":"right"},
 	    	"bindto": "${selector}",
 	    	"data": {
 	    	    "columns": [${pie}],
		        "type" : "pie"
		    }
		}`;
 	    o = JSON.parse(o);
 		c3.generate(o);
 		// this is a hack, because charts are always centered, even though we need left justified
 		$("svg").css({"transform":"translateX(-20vw)"});
	};
}

