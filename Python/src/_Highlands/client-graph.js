/* 
############################################################
#
#    Highlands Client
#
#    © Highlands Negotiations, June 2018, v0.5
#
############################################################
*/

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

function displayGraph(text, n, questionType, questionNumber) {
    function fillOutTheBoxes(parentSelector, boxWidth) {
    	function setupBoxes() {
    	    let boxHeight =  boxWidth;
    	    let squareSize = (boxWidth-1) / COLS;	// not sure why we need the -1, but it doesn't work without it
    	    console.log(squareSize*COLS, squareSize);
    	    let squareRule = `.square { height:${squareSize}px; width:${squareSize}px; } `
    	    let sheet = window.document.styleSheets[0];
    	    sheet.insertRule(squareRule, sheet.cssRules.length);
    	}
    	function getId(row, col) {
    		return row * COLS + col;
    	}
    	console.log(boxWidth);
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
                if(col === 4) child.addClass("nl");
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
	$(selector).append(div(text[0]));

	let html = `<div id="graph${n}"></div>`;
    $(selector).append(html);

    function tabulateGraph() {
    	// this routine is in a timeout to give time for the screen widths to be correct
		let frame = div("", "frame", {"margin-top":"5vh"});
		$(`#graph${n}`).append(frame);
		let main = 25;
		let spacing = `10% 10% ${main}% ${main}% ${main}% 5%`;
		g = new Grid("frame", n, spacing);
		g.addArea("header");
		g.addArea("left-1");
		g.addArea("left-2");
		g.addArea("main");
		g.addArea("right");
		g.addArea("footer");
		g.addArea("base");
		g.layout(`'header header header header header header' 
		    	 'left-1 left-2 main main main right' 
		    	 'left-1 left-2 footer footer footer right'
		    	 'base base base base base base`);
		g.flex("left-1", "column");
		g.flex("left-2", "column");
		g.flex("footer", "row");
		g.flex("base", "row");

		g.childCss({
			   "background-color":GRID_CHILDREN_COLOR,
			   "text-align":"center",
		  	   "font-size":GRID_CHILDREN_FONT_SIZE,
			   "padding-bottom":"5px"});	

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
		let frameWidth = frame.width();
		console.log(frameWidth);
		let gridSpacing = frameWidth * 3 * parseInt(main)/100;
		fillOutTheBoxes(`#grid-${n}-main`, gridSpacing);

        // stoke-width is affected by aspectRatio and angle, but I'm ignoring this for now
        let arrowsVertical = $(`<svg height="100%"; preserveAspectRatio="none" viewBox="0 0 100 100">
        	<text text-anchor="middle" x="0" y="0" style="font-family:Arial; font-size:4;" 
                transform="translate(50,0) scale(8,1) translate(1,50) rotate(-90 0,0)  ">Client Revenue Growth</text>
        	<path d="M25,80 L25,20 M75,80 L75,20"
        					style="stroke:#660000; stroke-width:8;fill:none;"/>
        	<path d="M28,20 L13,20 L50,13 L90,20 L72,20"
        					style="stroke:#660000; stroke-width:1;fill:none;"/>
        	<path d="M72,80 L87,80 L50,87 L10,80 L28,80"
        					style="stroke:#660000; stroke-width:1;fill:none;"/>
   		    </svg>`);
		
        $(`#grid-${n}-left-1`).append(arrowsVertical);
        function horizontalArrow(cx, cy, width1, width2, height1, height2, adjustment, strokeWidth) {
        	let w1 = width1;
        	let w2 = width2;
        	let h1 = height1;
        	let h2 = height2;
        	let a = adjustment;
        	let p1 =  `${cx-w1},${cy+h1}`;
        	let p1a = `${cx-w1},${cy+h1-a}`;
        	let p2 =  `${cx+w1},${cy+h1}`;
        	let p2a = `${cx+w1},${cy+h1-a}`;
        	let p3 =  `${cx+w1},${cy+h2}`;
        	let p4 =  `${cx+w2},${cy}`;
        	let p5 =  `${cx+w1},${cy-h2}`;
        	let p6 =  `${cx+w1},${cy-h1}`;
        	let p6a = `${cx+w1},${cy-h1+a}`;
        	let p7 =  `${cx-w1},${cy-h1}`;
        	let p7a = `${cx-w1},${cy-h1+a}`;
        	let p8 =  `${cx-w1},${cy-h2}`;
        	let p9 =  `${cx-w2},${cy}`;
        	let p10 = `${cx-w1},${cy+h2}`;
			let path1 = `<path d = "M${p7a} L${p8} L${p9} L${p10} L${p1a}" style="stroke:#660000; stroke-width:1;fill:none;"/>`;
			let path2 = `<path d = "M${p2a} L${p3} L${p4} L${p5} L${p6a}" style="stroke:#660000; stroke-width:1;fill:none;"/>`;
			let path3 = `<path d = "M${p1} L${p2} M${p6} L${p7}" style="stroke:#660000; stroke-width:${strokeWidth};fill:none;"/>`;
        	return `${path1} ${path2} ${path3}`;
        }
        var arrowsHorizontal = `<svg width="100%"; preserveAspectRatio="none" viewBox="0 0 100 100">
        	<text text-anchor="middle" x="0" y="0" style="font-family:Arial; font-size:3.5;" 
                transform="translate(50,0) scale(1,5) translate(1,10) rotate(0 0,0)">Market Growth</text>
                ${horizontalArrow(50,45,30,35,15,20,2.5,5)}
		  </svg>`;
		
		$(`#grid-${n}-base`).append(arrowsHorizontal);
    }
    
    setTimeout(function(){
    	tabulateGraph();
    	graphClickHandler();    	
    }, 100);
	
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
		    questionAnswered(`#border${n}`, n);

	    	let section = questions[n][1];
	    	let optionCount = options.length;
			results[n] = keyValuePair(questionType, {"question":questionNumber, "section":section, "rowFactor":rowFactor, "colFactor":colFactor});
			repaint();
			$(cell).css({"background-color":"black"});
		});
	}
}
