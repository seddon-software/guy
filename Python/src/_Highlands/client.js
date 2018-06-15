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

function setupTapHandlers() {   
    // set up "hover" handlers for each cell
    $(".internal").bind("touchstart", function() { 
    	touchMoveInProgress = true;
    });   
    $(".internal").bind("touchend", function() { touchMoveInProgress = false; });   
    $(".internal").bind("touchmove", hovering);
}

function displayQuestion(questionNumber, questionText, i, questionType) {
	let selector = `#border${i}`;
	if(questionNumber === "0") 
		questionNumber = "";	// titles don't have question numbers  
	else
		questionNumber = `${questionNumber}. `;  
	let title = div(`<br/><b>${questionNumber}${questionText}</b>`);
	$(selector).append(title);
	if(questionType === "title") {
		let css = {"background-color":"aquamarine", 
				   "font-size":"xx-large",
				   "text-align":"center",
				   "margin-top":"10vh"};
		$(title).css(css);		
	}
}

function questionAnswered(selector) {
    $(selector).css("background-color", 'rgb(100, 150, 200)');	
}

function questionAnswerInvalid(selector) {
    $(selector).css("background-color", 'rgb(255, 150, 200)');	
}

function displayCheckboxes(options, marks, n, questionType) {
	let selector = `#border${n}`;
	for(var i = 0; i < options.length; i++) {
    	let checkbox = span(`<input type="checkbox" name="checkbox${n}" id="check-${n}-${i}" value="${i}"`);
	    $(selector).append("<span>");
	    $(selector).append(checkbox);
	    $(selector).append(options[i]);
	    $(selector).append("</span></br>");
	}
	
	// change the color when checkbox selected
	$(`input[type=checkbox][name=checkbox${n}]`).change({type:questionType}, function(event) {
    	questionAnswered(selector);
    	let key = event.data.type;
	    values = "";
	    $(`input[name="checkbox${n}"]:checked`).each(function() {
	    	values += marks[this.value] + " ";
	    });
		results[n] = keyValuePair(key, values);
	});
}

function displayRadioButtons(options, marks, n, questionType) {
	let selector = `#border${n}`;
	for(var i = 0; i < options.length; i++) {
		let radioButton = $(`<input type="radio" name="radioButton${n}" value=` + `${i}` + ' />');
	    $(selector).append("<span>");
	    $(selector).append(radioButton.clone());
	    $(selector).append(options[i]);
	    $(selector).append("</span></br>");
	}

	// change the color when radio button selected
	$(`input[type=radio][name=radioButton${n}]`).change({type:questionType, optionCount:options.length}, function(event) {
    	questionAnswered(selector);
    	let key = event.data.type;
    	let optionCount = event.data.optionCount;
    	let value = $(`input[name=radioButton${n}]:checked`).val();
		results[n] = keyValuePair(key, {"selection":value, "marks":marks[value], "optionCount":optionCount});
	});
}

function useCookiesToSetFields(selector, textbox, n, questionType) {
    let cookieValue = $.cookie(`cookie${n}`);
    if(cookieValue) {
    	$(textbox).val(cookieValue);
    	questionAnswered(selector);
		results[n] = keyValuePair(questionType, cookieValue);
    }
}

function keyValuePair(key, value) {
	let o = {}
	o[`${key}`] = value;
	return o;
}

function displayEmail(text, n, questionType, autoFill) {
	let selector = `#border${n}`;
	if(text.trim() !== "blank" && text.trim() !== "autofill") $(selector).append(div(text));
	let textbox = div(`<input type="text" name="text${n}" id="text-${n}"`);
    $(selector).append(textbox);
    textbox.css({"width":"100%", "transform":"translateX(20%)"});
    if(autoFill) useCookiesToSetFields(selector, `#text-${n}`, n, questionType);

    // change the color when text changed
    $(`#text-${n}`).change({type:questionType}, function(event) {
    	function isEmail(email) {
    		let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		return regex.test(email);
    	}
    	let value = $(this).val();
    	if(isEmail(value)) {
    		questionAnswered(selector);
	    	let key = event.data.type;
    		results[n] = keyValuePair(key, value)
		    if(autoFill) $.cookie(`cookie${n}`, value);
    	} else {
    		questionAnswerInvalid(selector);
    	}
	});	
}

function displayText(text, n, questionType, autoFill) {
	let selector = `#border${n}`;
	if(text.trim() !== "blank" && text.trim() !== "autofill") $(selector).append(div(text));
	let textbox = div(`<input type="text" name="text${n}" id="text-${n}"`);
    $(selector).append(textbox);
    textbox.css({"width":"100%", "transform":"translateX(20%)"});
    if(autoFill) useCookiesToSetFields(selector, `#text-${n}`, n, questionType);

    // change the color when text changed
    $(`#text-${n}`).change({type:questionType}, function(event) {
    	let value = $(this).val();
    	if(value !== "") {
	    	questionAnswered(selector);
	    	let key = event.data.type;
    		results[n] = keyValuePair(key, value)
		    if(autoFill) $.cookie(`cookie${n}`, value);
    	} else {
    		results[n] = undefined
    		questionAnswerInvalid(selector);
    	}
	});
}

function displayTitle(text, n) {
	let selector = `#border${n}`;
 	let css = {"background-color":"aquamarine", 
			   "font-size":"large"};
 	let html = div(text, `title${n}`, css);
    $(selector).append(html);
    results[n] = {"title":"blank"};
}

function getProperty(id, property) {
	let element = document.getElementById(id);
	let style = window.getComputedStyle(element);
	return style.getPropertyValue(property);
}

function drawTable(selector, rowText, columnText, n) {	
	function getTemplateSpacing(hw) {
		let n, space;
		if(hw === 'h') {
			n = rowText.length + 1;
			space = 5;
		}
		if(hw === 'w') {
			n = columnText.length + 1;
			space = 90/n;
		}
		let spacing = "";
		for(let i = 0; i < n; i++) {
			spacing += `${space}v${hw} `;
		}
		return spacing;
	}
	let container = div("", "", {"display":"grid"});
	$(selector).append(container);
	$(container).css({"grid-template-rows":`${getTemplateSpacing('h')}`, "grid-template-columns":`${getTemplateSpacing('w')}`}); 
	
	for(let row = 0; row < rowText.length+1; row++) {
		for(let col = 0; col < columnText.length+1; col++) {
			let html;
			if(row == 0 && col == 0) {
				html = div("&nbsp;");
			} else if(row == 0 && col >= 1) {
				html = div(`${columnText[col-1]}`, `check-${row}:${col}`);
				html.css({"text-align": "center", "transform":"translateX(-50%)"});
			} else if (row >= 1 && col == 0) {
				html = div(`${rowText[row-1]}`, `check-${row}:${col}`);			
				html.css({"text-align": "center", "transform":"translateX(0%)"});
			} else {
			    let css = "display: block; margin-right: auto; margin-left: auto;";
				html = div(`<div style="${css}""><input style="${css}" type="checkbox" name="checkbox-${n}" id="check-${n}-${row}:${col}" value="${row}:${col}"></div>`);
				$(container).append(html);
				html.css({"transform":`translateX(-50%)`});
			}
			if(row == 0 || col == 0) $(container).append(html);
		}
	}
}

function displayTable(rows, cols, n, questionType) {
	let selector = `#border${n}`;    
	drawTable(selector, rows, cols, n);	

	// change the color when checkbox selected
	$(`input[type=checkbox][name=checkbox-${n}]`).change({type:questionType}, function(event) {
    	questionAnswered(selector);
	    values = "";
	    $(`input[name="checkbox-${n}"]:checked`).each(function() {
	    	values += this.value + " ";
	    });
    	let key = event.data.type;
		results[n] = keyValuePair(key, values);

	});
}
 
function displayQuestionsAndOptions() {
 	function zip(a, b) {
		var result = [];
		for(var i = 0; i < a.length; i++){
			result.push([a[i], b[i]]);
		}
		return result;
	}
	
 	let entries = zip(questions, options);
    for(var i = 0; i < entries.length; i++) {
    	let entry = entries[i];
		let questionNumber = entry[0][0];
		let questionText = entry[0][1];
		let questionType = entry[0][2]; 
		let autoFill = entry[0][2];
		let options;
		let marks;
		let html = $(`<div id='border${i}'/>`);
		$("#questions").append(html);
		html.css({"margin-left":MARGIN_LEFT, "margin-right":MARGIN_RIGHT, "background-color":BACKGROUND});

		displayQuestion(questionNumber, questionText, i, questionType);
		if(questionType === "radio") {
			options = entry[1][0];
			marks = entry[1][1];
			displayRadioButtons(options, marks, i, questionType);
		}
		if(questionType === "checkbox") {
			options = entry[1][0];
			marks = entry[1][1];
			displayCheckboxes(options, marks, i, questionType);
		}
		if(questionType === "text") {
			text = entry[1][0];
			displayText(text[0], i, questionType, autoFill);
		}
		if(questionType === "email") {
			text = entry[1][0];
			displayEmail(text[0], i, questionType, autoFill);
		}
		if(questionType === "title") {
			text = entry[1][0];
			displayTitle(text[0], i, questionType);
		}
		if(questionType === "graph") {
 			text = entry[1][0];
			displayGraph(text[0], i, questionType);
		}
		if(questionType === "table") {
			rows = entry[1][0].slice(1);
			cols = entry[1][1].slice(1);
			displayTable(rows, cols, i, questionType);
		}
    }
}

function positionCopyright() {
    $("#copyright").css("color", "black")
                   .css("bottom", "0px")
                   .css("position", "fixed")
                   .css("width", "50vw");
}
    
function getQuestions() {
    $.ajax(
    {
        url: '/questions',
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	questions = data;
        	results = new Array(questions.length);
        }	
    });
}

function getOptions() {
    $.ajax(
    {
        url: '/options',
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        success: function(data) {
        	options = data;
        	displayQuestionsAndOptions();
        }	
    });
}

function addClickHandlers() {
	function removeNulls() {
		for(let i = 0; i < results.length; i++) {
			if(results[i] === undefined) results[i] = {};
		}
	}

	function allQuestionsAnswered() {
		let all = true;
		for(let i = 0; i < results.length; i++) {
			if(results[i] === undefined) {
				all = false; break;
			}
		}
		return all;
	}

	$("#showResults").mousedown(function(e) {
		setTimeout(function() {
			//removeNulls();
			if(allQuestionsAnswered()) {
				$("#errorMessage").html("Results Submitted");
				resultsAsText = JSON.stringify(results);
				$.ajax(
			   	    {
			   	        url: '/results',
			   	        type: 'POST',
			   	        contentType:'application/json',
			   	        dataType:'text',
			   	        data: resultsAsText,
			   	        success: function(data) {
			   	        	console.log("results sent OK");
			   	        	results = [];
			   	        	setInterval(function() {location.reload()}, 500);
			   	    }	
			   	});
				displayResultCharts();
			} else {
				$("#errorMessage").html("Some questions still need valid answers");
				$("#errorMessage").css({"margin-left":`${MARGIN_LEFT}`});
			}
		}, 200);
    });    
}
	
