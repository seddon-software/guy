var tableData;

function displayTableData() {
	getAjaxData("/table-data", setTableData);
}

function setTableData(data) {
	tableData = data;
	getAjaxData("/emails-and-clients", drawTableCharts);
}

function drawTableCharts(data) {
	let emails = data[0];
	let clients = data[1];
	let id = "table-filter";
	let menu = buildMenu(undefined, id, clients, emails);
	let html = $(`${menu}`);
	html.css({'width':'auto'});
	$("#table-filter-drop-down").html(html);
	$("#table-filter").select2({theme: "classic", dropdownAutoWidth : 'true', width: 'auto'});
	let title = div("Table Charts");
	$("#table-title").html(title);

	function attachPieChart(key, filter) {
		o = {
			    data: {
			        columns: [],
			        type : 'pie'
			    }
			};
			let n = tableData[key]['tabs'].length;
			for(let i = 0; i < n; i++) {
				o['bindto'] = `#table-chart-${key}-${i}`;
				o['data']['columns'] = tableData[key]['data'][filter][i];
				$(`#table-tab-title-${key}-${i}`).text(`${tableData[key]['tabs'][i]}`);
				c3.generate(o);
			}
	}
	
	function drawAllTableCharts(clientOrEmail) {
	 	$("#tablecharts").empty();
		for(let key in tableData) {
			$("#tablecharts").append(`<p>${key}.${tableData[key]['question']}<br/>`);			
			createTabs("#tablecharts", key);
			attachPieChart(key, clientOrEmail);
		}
	}
	// initial draw
	drawAllTableCharts('all');

	$("#table-filter").on("change", function(e) { 
		if(e.val === "-") {
			drawAllTableCharts('all');
		} else {
			let parts = e.val.split(',');
			let group = parts[0];
			let clientOrEmail = parts[1];
			drawAllTableCharts(clientOrEmail);
		}
	});

}

function createTabs(selector, n) {
	let tabs = div("", `table-tabs-${n}`);
	$(selector).append(tabs);
	let tabObject = {};
	$(function() {$(`#table-tabs-${n}`).tabs(tabObject);});

	// lists first
	let ulist = $("<ul></ul>");
	$(ulist).attr("id", `table-ulist-${n}`);
	$(`#table-tabs-${n}`).append(ulist);
	
	for(let i = 0; i < tableData[n]['tabs'].length; i++) {
		let list = $(`<li onmousemove='setTimeout(positionCopyright, 100)'></li>`);
		let anchor = $(`<a href="#tab-${n}-${i}" id="table-tab-title-${n}-${i}"></a>`);
		$(ulist).append(list);
		$(list).append(anchor);
	}

	// then add divs
	for(let i = 0; i < tableData[n]['tabs'].length; i++) {
		let outer = div("", `tab-${n}-${i}`);
		outer.addClass(`table-tab-${n}-class`);
		let inner = div("", `table-chart-${n}-${i}`);
		if(i === 0) {
			$(`#table-ulist-${n}`).after(outer);
		} else {
			$(`.table-tab-${n}-class`).last().after(outer);
		}
		$(outer).append(inner);
	}	
}
