function setupHoverHandlers() {   
    // set up "hover" handlers for each cell
    $(".internal").hover(hovering, function(){});   
}

function setupTapHandlers() {   
    // set up "hover" handlers for each cell
    $(".internal").bind("touchstart", function() { touchMoveInProgress = true; });   
    $(".internal").bind("touchend", function() { touchMoveInProgress = false; });   
    $(".internal").bind("touchmove", hovering);
}


function hovering(e) {
    function findCellUnderTapMove(event) {
        var myLocation = event.originalEvent.changedTouches[0];
        return document.elementFromPoint(myLocation.clientX, myLocation.clientY);
    }
    function highlightCell(cell) {
		// clear previous iterations
    	$(".square").children().each(function() {
    	    if($(this).data("id").selected === 1) {
    	    	$(this).data("id").selected = 0;
    	    	$(this).html("");
    	    	colorCell(this);
    	    }
        });
		// highlight cell under mouse
        $(_this).data("id").selected = 1;
		let blackCircle = "\u26AB"; 
		$(_this).html(blackCircle);
		$(_this).css({"text-align":"center", 
			          "vertical-align":"middle", 
			          "line-height":"2.0", 
			          "display":"inline-block",
			          "font-size":"small"})
    }
    
    // change this pointer if using a touch device
    var _this = this;
    if(touchMoveInProgress) {
        _this = findCellUnderTapMove(e);
    }
	highlightCell(_this);
}

function colorCell(selector) {
	function square(x, y) {
		return Math.sqrt((x*x + y*y)/(ROWS*ROWS + COLS*COLS));
	}
	function getQuadrant() {
		let quadrant;
		if(row >= ROWS/2 && col >= COLS/2) quadrant = 1; 
		if(row >= ROWS/2 && col <  COLS/2) quadrant = 2; 
		if(row <  ROWS/2 && col >= COLS/2) quadrant = 3; 
		if(row <  ROWS/2 && col <  COLS/2) quadrant = 4;
		return quadrant;
	}
	let row = $(selector).data("id").row;
	let col = $(selector).data("id").col;
	let distance1 = square(row, col);
	let distance2 = square(row, COLS-col);
	let distance3 = square(ROWS-row, col);
	let distance4 = square(ROWS-row, COLS-col);

	let red = 127;
	let green = 127;
	let blue = 127;

	let quadrant = getQuadrant();
	let x;
	if(quadrant === 1) {
		x = (2*distance1-1)**4;
		green = 255;
		red = Math.floor(255-x*255);
		blue = Math.floor(255-x*255);		
	}
	if(quadrant === 2) {
		x = (2*distance2-1)**4;
		red = 255;
		green = Math.floor(255-x*255);
		blue = Math.floor(255-x*255);		
	}
	if(quadrant === 3) {
		x = (2*distance3-1)**4;
		red = 255;
		green = Math.floor(255-x*255);
		blue = Math.floor(255-x*255);		
	}
	if(quadrant === 4) {
		x = (2*distance4-1)**4;
		red = 255;
		green = Math.floor(255-x*255);
		blue = Math.floor(255-x*255);		
	}
	$(selector).css({"background-color":`rgb(${red},${green},${blue})`});
}

function displayGraph(text, n, questionType) {
    function fillOutTheGrid(parentSelector) {
    	function setupGrid() {
    	    let boxWidth = PERCENTAGE_SCREEN_USED;
    	    let boxHeight =  boxWidth / 2;
    	    let squareSize = boxWidth / COLS;

    	    let divBoxRule = "div#box { height: " + boxHeight + "vw; width: " + boxWidth + "vw; }";
    	    let squareRule = ".square { height: " + squareSize + "vw; width: " + squareSize + "vw; } "
    	    let sheet = window.document.styleSheets[0];
    	    sheet.insertRule(divBoxRule, sheet.cssRules.length);
    	    sheet.insertRule(squareRule, sheet.cssRules.length);
    	}
    	function getId(row, col) {
    		return row * COLS + col;
    	}
        setupGrid();
        let newLine = "<div class='newLine'></div>";
        for(let row = 0; row < ROWS; row++) {
            for(let col = 0; col < COLS; col++) {
                let id = getId(row, col);
                let selector = "cell" + id;
                let square = div("");
                square.addClass("square");
                let child = div("", selector);
                child.addClass("internal");
				square.html(child);
				childDiv = square;
                $(parentSelector).append($(square).clone());

                // add attributes to each "class=internal" div
                $("#" + selector).data( "id", { selected:0, row:row, col:col });
                colorCell("#" + selector);
            }
            $(parentSelector).append($(newLine).clone());
            $(parentSelector).append($(newLine).clone());
        }
    }

    let PERCENTAGE_SCREEN_USED = 50;
	let selector = `#border${n}`;
    	
	$(selector).append(div(text));
	
    let html = `<div id="graph${n}"></div>`;
    $(selector).append(html);

    function tabulateGraph() {
		let frame = div("", "frame", {"margin-top":"5vh"});
		let col1 = div("", "col1", {"display":"flex", "flex-direction":"column", "justify-content": "space-between", 
			"margin":"0% 1% 5% 5%", "float":"left"});
		let col2 = div("", "col2", {"float":"left"});
		let col3 = div("", "col3", {"display":"flex", "flex-direction":"column", "justify-content": "space-evenly", 
			"margin":"0% 1% 5% 5%", "float":"left"});
		let leftTop = div("Very<br>Strong", "id1", {"width":"20%", "float":"left", "width":"100%"});
		let leftMiddle = div("Flat", "id2", {"width":"20%", "float":"left", "width":"100%"});
		let leftBottom = div("Major<br>Decline", "id3", {"width":"20%", "float":"left", "width":"100%"});
		$(`#graph${n}`).append(frame);
		$("#frame").append(col1);
		$("#frame").append(col2);
		$("#frame").append(col3);
		fillOutTheGrid(`#col2`);

		$("#col1").append(leftTop);
		$("#col1").append(leftMiddle);
		$("#col1").append(leftBottom);
		
		let footer = div("", "footer", {"padding-top":"2vh", "display":"flex", "flex-direction":"row", "justify-content": "space-between"});
		let leftFooter = div("0");
		let middleFooter = div("Flat");
		let rightFooter = div("Very<br>Strong");
		$("#col2").append(footer);
		$("#footer").append(leftFooter);
		$("#footer").append(middleFooter);
		$("#footer").append(rightFooter);
		
		let resetButton = div(`<button id="resetGraph${n}" type="button">reset</button>`);
		resetButton.addClass("button");
		$("#col3").append(resetButton);
		$(`#resetGraph${n}`).css({"background-color":"orange"});
		$(`#resetGraph${n}`).mousedown(function(e){
			e.stopPropagation();   // don't let the event bubble or it will interfere with graph selection
            $(".internal").hover(hovering, function(){});
		});

		$("#col1").height($("#col2").height());
		$(window).bind('resize', function(event) {
			$("#col1").height($("#col2").height());
		});
    }
	tabulateGraph();
	setupHoverHandlers();
	graphClickHandler();
	
	function graphClickHandler() {
		$(`#graph${n}`).mousedown({type:questionType}, function(event) {
			if(!android) $(".internal").off("mouseenter mouseleave");       
	    	$(".square").children().each(function() {
	    	    if($(this).data("id").selected === 1) {
	    	    	let row = $(this).data("id").row;
	    	    	let col = $(this).data("id").col;
	    	    	let rowFactor = row / ROWS;
	    	    	let colFactor = col / COLS;
	    	    	let key = event.data.type;
	    	    	let result = {}
	    	    	result[`${key}`] = `${rowFactor}:${colFactor}`;
	    		    results[n] = result;
	    	    }
	        });
		});
	}
}
