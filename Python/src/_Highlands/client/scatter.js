// !!!! important
// xSort is undocumented, c3.js reorders json data without this attribute and this in turn messes up the data index
// https://stackoverflow.com/questions/48465126/c3-charts-dynamic-bubble-size-in-scatter-plot-wrong-index
// https://github.com/c3js/c3/issues/547#issuecomment-56292971

var scatterFrequencies;
var scatterData = {
	xLabels: ["Very Low", "Low", "Neutral", "Moderate", "High"],
	yLabels: ["Very Low", "Low", "Neutral", "Moderate", "High"],
	xTitle: 'Client Revenue Growth',
	yTitle: 'Market Growth',
	frequencies: {
		'all':
		    [[0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4]],
		'BT':
		    [[0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4]],
		'client2':
		    [[0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4]],
		'client3':
		    [[0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4]],
		'chris@def.com':
		    [[0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4]],
		'email2@def.com':
		    [[0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4],
			 [0, 1, 2, 3, 4]],
		}
	};


function displayScatterChart() {
	getAjaxData("/emails-and-clients", scatterChartCallback);
}

function scatterChartCallback(data) {
	let emails = data[0];
	let clients = data[1];
	let id = "scatter-filter";
	let menu = buildMenu(scatterData.frequencies, id, clients, emails);
	let html = $(`${menu}`);
	html.css({'width':'auto'});
	$("#scatter-filter-drop-down").html(html);
	$("#scatter-filter").select2({theme: "classic", dropdownAutoWidth : 'true', width: 'auto'});

	// initial draw
	scatterFrequencies = scatterData.frequencies['all'];
	drawAllScatterCharts();	
	
	$("#scatter-filter").on("change", function(e) { 
		if(e.val === "-") {
			scatterFrequencies = scatterData.frequencies['all'];
		} else {
			let parts = e.val.split(',');
			let group = parts[0];
			let text = parts[1];
			scatterFrequencies = scatterData.frequencies[text];
		}
		function clearAllScatterCharts() {
	 	    $("#scatterchart").empty;
		}
		clearAllScatterCharts();
		drawAllScatterCharts();
	});
}

function drawAllScatterCharts() {
	function isInteger(n) {
		let base = Math.floor(n);
		let diff = Math.abs(base - n);
		return diff < 0.0001;
	}
	
	let frequencies = scatterFrequencies;
	let rows = frequencies.length;
	let cols = frequencies[0].length;
	let columnData = [["x"],[" "]];
	for(let i = 0; i < rows; i++) {
		for(let k = 0; k < cols; k++) {
			columnData[0].push(i);
			columnData[1].push(k);
		}
	}
	let o = {'bindto':"#scattercharts", 'legend':{hide:true} };
	o['data'] = { xSort:false, xs:{' ': 'x'}, type:'scatter', columns:columnData};
	o['point'] = {
	        r: function(d) {
	        	let xy = d['index'];
	        	let x = Math.floor(xy / rows);
	        	let y = xy % rows;
	        	let factor = 4;
	            return frequencies[x][y]*factor;
	        }
	    };
	o['axis'] = {
	        x: {
	        	min: -0.4,
	        	max:  4.4,
	            label: {
	            	position: 'outer-center',
	            	text: scatterData.xTitle
	            },
	            tick: {
	            	count: 5,
	            	format: function(x) { 
//	               		if(isInteger(x))
//	            			return xLabels[x];
//	            		else
//	            			return '';
            			return scatterData.xLabels[x];
	            	},
	                fit: false
	            }
	        },
	        y: {
	            label: {
	            	position: 'outer-middle',
	            	text: scatterData.yTitle
	            },
				tick: {
					format: function(y) { 
	            		if(isInteger(y))
	            			return scatterData.yLabels[y];
	            		else
	            			return '';
	            	}
	        	}
	        }
	    };
	o['tooltip'] = {
        format: {
            title: function (d) {
            	return 'Frequency'; 
            },
            value: function (value, ratio, id, index) {
	        	let x = Math.floor(index / rows);
            	let y = index % rows;
            	return `${frequencies[x][y]}`;
            }
        }
    };
	c3.generate(o);
}
