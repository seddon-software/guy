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
        	drawPieChart(data);
        }	
    });
}

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

function drawPieChart(data) {
	let keys = Object.keys(data);
	let values = Object.values(data);
	
	// make sure no more than 8 pie charts are drawn per line
	let w1 = $(window).width()/keys.length;
	let w2 = $(window).width()/8;
	let width = Math.max(w1, w2);
	//console.log(width, w1, w2);
	for(let i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = values[i];
		let selector = `#${key}`;
		let anchor = div("", `${key}`).css({"float":"left"});
 	    $("#piechart").append(anchor);
 	    let data1 = value
 	    let data2 = 10 - data1
 	    o = `{
 	    	"title": {"text":"${key}"},
 	    	"size": {"width":${width}},
 	    	"bindto": "${selector}",
 	    	"data": {
 	    	    "columns": [
		            ["yes", ${data1}],
		            ["no", ${data2}]
		        ],
		        "type" : "pie"
		    }
		}`;
 	    o = JSON.parse(o);
 		c3.generate(o);
	};
}

function drawPieChart2(data) {
	let keys = Object.keys(data);
	let values = Object.values(data);
	console.log(keys);
	console.log(values);
	let w = {'width':$(window).width()/keys.length};
	
 	keys.forEach(function(key) {
//        ["data1", ${data[key]}],
 		let selector = `#${key}`;
		let anchor = div("", `${key}`).css({"float":"left"});
 	    $("#piechart").append(anchor);
 	    w = 250;
 	    o = `{
 	    	"size": {"width":${w}},
 	    	"bindto": "${selector}",
 	    	"data": {
 	    	    "columns": [
		            ["data1", 30],
		            ["data2", 70]
		        ],
		        "type" : "pie"
		    }
		}`;
 	    o = JSON.parse(o);
 		c3.generate(o);
	});
}

