function buildMenu(data, id, clients, emails) {  // scatterData
	function getClients() {
		let clients = [];
		Object.keys(data).forEach(function(key) {
			if(key.indexOf('@') === -1 && key !== 'all') clients.push(key);
		});
		return clients;
	}
	function getEmails() {
		let emails = [];
		Object.keys(data).forEach(function(key) {
			if(key.indexOf('@') !== -1) emails.push(key);
		});
		return emails;
	}
	if(clients === undefined) clients = getClients();
	if(emails  === undefined) emails = getEmails();
	let menu = `
		<div><label>Filter:</label>
		<select id=${id}>
		<optgroup label="filter">
		<option value="-">none</option>
		</optgroup>
		<optgroup label="by&nbsp;client">`;
	clients.forEach(function(client) {
		menu += `<option value="client,${client.trim()}">${cleanupSelectText(client)}</option>`;
		});
	menu += `
		</optgroup>
		<optgroup label="by&nbsp;email">`;
	emails.forEach(function(email) {
		menu += `<option value="email,${email.trim()}">${email.trim()}</option>`;
	});
	menu += `</optgroup></select></div>`;
	return menu;
}

function div(item, id, css) {
	let html = $(`<div>${item}</div>`);
	if(id) html.attr("id", id);
	if(css) html.css(css);
	return html;
}

function span(item, id, css) {
	let html = $(`<span>${item}</span>`);
	if(id) html.attr("id", id);
	if(css) html.css(css);
	return html;
}


