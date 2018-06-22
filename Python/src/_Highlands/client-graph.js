class Grid {
	// constructor takes the id of the container
	constructor(selector, questionNumber, spacing) {
	    this.selector = selector;
	    this.questionNumber = questionNumber;
	    $(`#${this.selector}`).css({
	    	"display":"grid",
            "grid-gap":"0px",
            "grid-template-columns":spacing,
            "background-color":"#2196F3",
            "padding":"0px"});
	}

	// grid areas have a name
	// the name is used as part the grid area's id: `grid-${questionNumber}-${name}`
	addArea(name, text) {
		if(!text) text = "";
		let html = div(text, `grid-${this.questionNumber}-${name}`, {"grid-area":name});
	    $(`#${this.selector}`).append(html);
	}
	
	// the format uses the grid area names (ids) 
	layout(format) {
		$(`#${this.selector}`).css({"grid-template-areas":`${format}`});
	}
	
	// flex will space out the child elements
	// direction = "row" or "column"
	flex(name, direction) {
		$(`#grid-${this.questionNumber}-${name}`).css(
				{"display":"flex", 
				 "flex-direction":`${direction}`, 
				 "justify-content": "space-between"});
	}
	
	// apply css to all children
	childCss(css) {
		$(`#${this.selector} > div`).css(css);
	}
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
    function fillOutTheBoxes(parentSelector, boxWidth) {
    	function setupBoxes() {
    	    let boxHeight =  boxWidth;
    	    let squareSize = boxWidth / COLS;
    	    let squareRule = `.square { height:${squareSize}px; width:${squareSize}px; } `
    	    let sheet = window.document.styleSheets[0];
    	    sheet.insertRule(squareRule, sheet.cssRules.length);
    	}
    	function getId(row, col) {
    		return row * COLS + col;
    	}
        setupBoxes();
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
        }
    }
    
	let selector = `#border${n}`;    	
	$(selector).append(div(text));
	let subTitle = text[0];

	let html = `<div id="graph${n}"></div>`;
    $(selector).append(html);

    function tabulateGraph() {
		let frame = div("", "frame", {"margin-top":"5vh"});
		$(`#graph${n}`).append(frame);
		let frameWidth = frame.width();
		let main = 25;
		let spacing = `10% 10% ${main}% ${main}% ${main}% 5%`;
		g = new Grid("frame", n, spacing);
		g.addArea("header");
		g.addArea("left-1");
		g.addArea("left-2");
		g.addArea("main");
		g.addArea("right");
		g.addArea("footer");
		g.layout(`'header header header header header header' 
		    	 'left-1 left-2 main main main right' 
		    	 'left-1 left-2 footer footer footer right'`);
		g.flex("left-1", "column");
		g.flex("left-2", "column");
		g.flex("footer", "row");

		g.childCss({
			   "background-color":GRID_CHILDREN_COLOR,
			   "text-align":"center",
		  	   "font-size":GRID_CHILDREN_FONT_SIZE});	

	    let headerText = div(text[1]).css({"font-size":"xx-large", "margin":"1vw 1vw 1vw 1vw"});
		let sidebarTextArray = text[2];
	    let footerTextArray = text[3];

		function addTextToGridPanel(name, textArray) {
			for(let i = 0; i < textArray.length; i++) {
			    $(`#grid-${n}-${name}`).append(div(textArray[i]));			
			}			
		}
		$(`#grid-${n}-header`).html(headerText);
		addTextToGridPanel("left-2", sidebarTextArray);
		addTextToGridPanel("footer", footerTextArray);
		let gridSpacing = frameWidth * 3 * parseInt(main)/100;
		fillOutTheBoxes(`#grid-${n}-main`, gridSpacing);
		
        var svg = `<div><svg visibility='visible' style='width: 100%; height=600px'
            viewBox='0 0 100 600'>
            <defs>
            	<marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
        			<path d="M2,2 L2,11 L10,6 L2,2" style="fill: #000000;" />
        		</marker>
        	</defs>
        	<rect visibility='visible' x='0' y='0' width='100' height='600' 
		                   rx='10' ry='15' style='stroke:#660000; fill: white'/>
        	<path d="M30,0 L30,100"
        					style="stroke:#660000; fill:none;marker-start:url(#markerArrow);"/>
        	<text x="40" y="40" transform="rotate(90 30,30)">Example SVG text 1</text>
		  </svg></div>`;
        svg = $(svg);

//		let arrows = div(`<img src="images/arrows.svg"></img>`,"arrows");
        $(`#grid-${n}-left-1`).append(svg);
//        arrows.css({"width":"60px", "height":"600px"});
//        $("#arrows").html($("#arrows").html());
    }
    
	tabulateGraph();
	graphClickHandler();
	
	function graphClickHandler() {
		function repaint() {
			$(".square").children().each(function() {
	    	    colorCell(this);
	        });			
		}
		$(`#graph${n}`).mousedown(function(event) {
			let cell = event.target;
	    	let row = $(cell).data("id").row;
	    	let col = $(cell).data("id").col;
	    	let rowFactor = row / (ROWS-1);
	    	let colFactor = col / (COLS-1);
		    results[n] = keyValuePair(questionType, `${rowFactor}:${colFactor}`);
		    questionAnswered(`#border${n}`, n);

	    	let section = questions[n][1];
	    	let optionCount = options.length;
			results[n] = keyValuePair(questionType, {"section":section, "rowFactor":rowFactor, "colFactor":colFactor});
			console.log(results[n]);
			repaint();
			$(cell).css({"background-color":"black"});
		});
	}
}
