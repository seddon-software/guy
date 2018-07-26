var tableData =
{
 'tabs':["Last 30 days", "Last 90 days", "Last 180 days", "In the past year"],	
 'data':
	{'all':[
		[["Extremely serious", 5], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
        [["Extremely serious", 2], ["Significant but quickly resolved", 0], ["Minor", 0], ["None", 0]],
        [["Extremely serious", 4], ["Significant but quickly resolved", 0], ["Minor", 1], ["None", 4]],
        [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]],
	 'BT':[
		[["Extremely serious", 2], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
	    [["Extremely serious", 3], ["Significant but quickly resolved", 4], ["Minor", 0], ["None", 0]],
	    [["Extremely serious", 4], ["Significant but quickly resolved", 1], ["Minor", 1], ["None", 4]],
	    [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]]
	}
}
var numberOfTabs;

function displayTableData() {
	getAjaxData("/table-data", setTableData);
}

function setTableData(data) {
//	tableData = data;
	numberOfTabs = tableData['tabs'].length;
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

	function attachPieChart(set) {
		o = {
			    data: {
			        columns: [],
			        type : 'pie'
			    }
			};
			let filter = 'BT';
			let n = tableData['tabs'].length;
			for(let i = 0; i < n; i++) {
				o['bindto'] = `#table-chart-${set}-${i}`;
				o['data']['columns'] = tableData['data'][filter][i];
				$(`#table-tab-title-${set}-${i}`).text(`${tableData['tabs'][i]}`);
				c3.generate(o);
			}
	}
	
	function drawAllTableCharts(clientOrEmail) {
		for(let i = 0; i < numberOfTabs; i++) {
			createTabs("#tablecharts", i);
			attachPieChart(i);
		}
	}
	// initial draw
	drawAllTableCharts('all');

	$("#table-filter").on("change", function(e) { 
		return;
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

function createTabs(selector, n) {
	let tabs = div("", `table-tabs-${n}`);
	$(selector).append(tabs);
	let tabObject = {};
	$(function() {$(`#table-tabs-${n}`).tabs(tabObject);});

	// lists first
	let ulist = $("<ul></ul>");
	$(ulist).attr("id", `table-ulist-${n}`);
	$(`#table-tabs-${n}`).append(ulist);
	
	for(let i = 0; i < numberOfTabs; i++) {
		let list = $(`<li onmousemove='setTimeout(positionCopyright, 100)'></li>`);
		let anchor = $(`<a href="#tab-${n}-${i}" id="table-tab-title-${n}-${i}"></a>`);
		$(ulist).append(list);
		$(list).append(anchor);
	}

	// then add divs
	for(let i = 0; i < numberOfTabs; i++) {
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
