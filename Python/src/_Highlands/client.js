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

function questionAnswered(selector, n) {
    $(selector).css("background-color", QUESTION_ANSWERED_COLOR);
    $(`#title-${n}`).css("color", "black");
	$(`#asterisk-${n}`).text("");
	$("#errorMessage").html("");
}

function questionAnswerInvalid(selector, n) {
    $(selector).css("background-color", QUESTION_ANSWER_INVALID_COLOR);	
}

function removeCookiesOnStartup() {
	var cookies = $.cookie();
	for(let cookie in cookies) {
	   $.removeCookie(cookie);
	}
}

function useCookiesToSetFields(selector, textbox, n, questionType) {
    let cookieValue = $.cookie(`cookie${n}`);
    if(cookieValue) {
    	$(textbox).val(cookieValue);
    	questionAnswered(selector, n);
		results[n] = keyValuePair(questionType, cookieValue);
    }
}

function keyValuePair(key, value) {
	let o = {}
	o[`${key}`] = value;
	return o;
}

function displayQuestion(questionNumber, questionText, i, questionType) {
	let selector = `#border${i}`;
	let period = ". ";
	let asterisk = `<span id="asterisk-${i}" style="color:red;font-size:x-large"></span>`;
	
	if(questionNumber === "0") { 
		questionNumber = "";	// titles don't have question numbers
		period = "";			// don't put a period in front of title
	}
	let title = div(`<br/><b>${asterisk}${questionNumber}${period}${questionText}</b>`, `title-${i}`);
	title.addClass("titles");
	$(selector).append(title);
	if(questionType === "title") {
		let css = {"background-color":"aquamarine", 
				   "font-size":"xx-large",
				   "text-align":"center",
				   "margin-top":"10vh"};
		$(title).css(css);		
	}
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
	$(`input[type=checkbox][name=checkbox${n}]`).change(function(event) {
		if($(`input[type=checkbox][name=checkbox${n}]`).length > 0) {
			questionAnswered(selector, n);
		    let checkedValues = "";
		    let checkedMarks = "";
		    $(`input[name="checkbox${n}"]:checked`).each(function() {
		    	checkedValues += this.value + " ";
		    	checkedMarks += marks[this.value] + " ";
		    });
	    	let section = questions[n][1];
	    	let optionCount = options.length;
			results[n] = keyValuePair(questionType, {"section":section, "selection":checkedValues, "marks":checkedMarks, "optionCount":optionCount});
			console.log(n, results[n], results);
		} else {
			questionAnswerInvalid(selector, n);
		}
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
	$(`input[type=radio][name=radioButton${n}]`).change(function(event) {
    	questionAnswered(selector, n);
    	let section = questions[n][1];
    	let optionCount = options.length;
    	let value = $(`input[name=radioButton${n}]:checked`).val();
		results[n] = keyValuePair(questionType, {"section":section, "selection":value, "marks":marks[value], "optionCount":optionCount});
	});
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
    		questionAnswered(selector, n);
	    	let key = event.data.type;
    		results[n] = keyValuePair(key, value)
		    if(autoFill) $.cookie(`cookie${n}`, value);
    	} else {
    		questionAnswerInvalid(selector, n);
    	}
	});	
}

function displayClient(text, n, questionType, autoFill) {
	let selector = `#border${n}`;
	if(text.trim() !== "blank" && text.trim() !== "autofill") $(selector).append(div(text));
	let textbox = div(`<input type="text" name="text${n}" id="text-${n}"`);
    $(selector).append(textbox);
    textbox.css({"width":"100%", "transform":"translateX(20%)"});
    if(autoFill) useCookiesToSetFields(selector, `#text-${n}`, n, questionType);

    // change the color when text changed
    $(`#text-${n}`).change(function(event) {
    	let value = $(this).val();
		questionAnswered(selector, n);
		results[n] = keyValuePair(questionType, value)
	    if(autoFill) $.cookie(`cookie${n}`, value);
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
	    	questionAnswered(selector, n);
	    	let key = event.data.type;
    		results[n] = keyValuePair(key, value)
		    if(autoFill) $.cookie(`cookie${n}`, value);
    	} else {
    		results[n] = undefined
    		questionAnswerInvalid(selector, n);
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

function drawTable(selector, options, n) {
	let rows = options.length;
	let cols = options[0].length;
	
	let rowText = [];
	let columnText = [];
	for(let r = 1; r < rows; r++) {
	    rowText.push(options[r][0]);	
	}
	for(let c = 1; c < cols; c++) {
	    columnText.push(options[0][c]);	
	}
	
	function getTemplateSpacing(hw) {
		let n, space;
		let extraSpaces = 2.5;
		if(hw === 'h') {
			n = rowText.length + 1;
			space = 5;
		}
		if(hw === 'w') {
			n = columnText.length + 1;
			space = 95/(n+extraSpaces);
		}
		let spacing = "";
		for(let i = 0; i < n; i++) {
			// make the first width (1+extraSpaces) times as big as others
			if(hw === 'w' && i === 0) 
				spacing += `${(1+extraSpaces)*space}v${hw} `;
			else
				spacing += `${space}v${hw} `;	
		}
		return spacing;
	}
	let container = div("", `table${n}`, {"display":"grid"});
	$(selector).append(container);
	$(container).css({"grid-template-rows":`${getTemplateSpacing('h')}`, "grid-template-columns":`${getTemplateSpacing('w')}`}); 
	
	for(let row = 0; row < rowText.length+1; row++) {
		for(let col = 0; col < columnText.length+1; col++) {
			let html;
			if(row == 0 && col == 0) {
				html = div("&nbsp;");
			} else if(row == 0 && col >= 1) {
				html = div(`${columnText[col-1]}`, `radio-${row}:${col}`);
				html.css({"text-align": "center", "transform":"translateX(-50%)"});
			} else if (row >= 1 && col == 0) {
				html = div(`${rowText[row-1]}`, `radio-${row}:${col}`);			
				html.css({"text-align":"left", "margin-left":"5px", "margin-right":"5px", "transform":"translateX(0%)"});
			} else {
			    let css = "display: block; margin-right: auto; margin-left: auto;";
				html = div(`<div style="${css}""><input style="${css}" type="radio" name="radio-${n}-${row}" id="radio-${n}-${row}:${col}" value="${row}:${col}"></div>`);
				$(container).append(html);
				html.css({"transform":`translateX(-50%)`});
			}
			if(row == 0 || col == 0) $(container).append(html);
		}
	}
	return rows - 1;	// used to size array of results
}

function displayTable(entry, n, questionType) {
	let selector = `#border${n}`;
	let options = entry[1];
	let rows = drawTable(selector, options, n);	
	let values = Array(rows);
	
	$(`#table${n} input:radio`).on('change', function(event){
		let name = event.currentTarget.name;
		let value = event.currentTarget.value;
		pair = value.split(':').map(Number);
		let buttonRow = pair[0] - 1;	// row of radio buttons
		let button = pair[1];		// which button
		values[buttonRow] = button;
		
		if(!values.includes(undefined)) {
			questionAnswered(selector, n);
			let marks = [];
			for(let i = 0; i < values.length; i++) {
				let mark = options[i+1][values[i]];
				marks.push(mark);
			};
//			console.log("marks:", marks);
	    	let section = questions[n][1];
	    	let optionCount = options[0].length - 1;  // -1 for the sidebar text
	    	let value = $(`input[name=radioButton${n}]:checked`).val();
			results[n] = keyValuePair(questionType, {"section":section, "selection":values, 
				"marks":marks, "optionCount":optionCount});
			console.log(results[n]);
		}
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
		let questionSection = entry[0][1];
		let questionText = entry[0][2];
		let questionType = entry[0][3]; 
		let autoFill = entry[0][4];
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
		if(questionType === "client") {
			text = entry[1][0];
			displayClient(text[0], i, questionType, autoFill);
		}
		if(questionType === "title") {
			text = entry[1][0];
			displayTitle(text[0], i, questionType);
		}
		if(questionType === "graph") {
 			options = entry[1];
			displayGraph(options, i, questionType);
		}
		if(questionType === "table") {
			displayTable(entry, i, questionType);
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
	function allQuestionsAnswered() {
		let all = true;
		for(let i = 0; i < results.length; i++) {
			if(results[i] === undefined) {
				all = false; break;
			}
		}
		return all;
	}

	function continueOrExit() {
		function clearPage() {
		    $("#questions").empty();
		    
			getQuestions();
			getOptions();
			addClickHandlers();
			positionCopyright();
		}
		$("#modal_dialog").dialog({
		    resizable: false,
		    height:"auto",
		    title: "Highlands Assessment",
		    modal: true,
		    buttons: {
		    	"No": function() {
		    		$(this).dialog("close");
		    		setInterval(function() {location.assign(`${HIGHLANDS_NEGOTIATIONS}`)}, 500);
		    	},
		    	"Yes": function() {
		    		results = [];
		    		$(this).dialog("close");
		    		clearPage();
		    		//setInterval(function() {location.reload()}, 500);
		    	}
		    }
		});	
		$("#modal_dialog").html("Do you want to complete another client profile?")
		                  .css({"font-size":"large", "background-color":DIALOG_BACKGROUND_COLOR});
	}

	function highlightMissingAnswers() {
		for(let n = 0; n < results.length; n++) {
			console.log(n, results[n]);
			if(!results[n]) {
				$(`#asterisk-${n}`).text("* ");
			}
		}
	}
	
	$("#showResults").mousedown(function(e) {
		setTimeout(function() {
			if(allQuestionsAnswered()) {
				$("#errorMessage").html("Results Submitted");				
				let resultsAsText = JSON.stringify(results);
				$.ajax(
			   	    {
			   	        url: '/results',
			   	        type: 'POST',
			   	        contentType:'application/json',
			   	        dataType:'text',
			   	        data: resultsAsText,
			   	        success: function(data) {
			   	        	console.log("results sent OK");
			   	        	continueOrExit();
			   	    }	
			   	});
			} else {
				$("#errorMessage").html("Some questions still need valid answers");
				$("#errorMessage").css({"margin-left":`${MARGIN_LEFT}`});
   	        	setTimeout(function() {highlightMissingAnswers()}, 500);
			}
		}, 200);
    });    
}
	
