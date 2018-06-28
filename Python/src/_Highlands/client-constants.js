/* 
############################################################
#
#    Highlands Client
#
#    © Highlands Negotiations, June 2018, v0.5
#
############################################################
*/

// global variables: do not change
var cookies;
var results;
var questions;
var options;
var chartData;
var android = navigator.appVersion.indexOf("Android") !== -1;


// colors
var HIGHLANDS_NEGOTIATIONS = "http://www.highlandsnegotiations.com/";
var QUESTION_ANSWERED_COLOR = 'rgb(100, 150, 200)';
var QUESTION_ANSWER_INVALID_COLOR = 'rgb(255, 150, 200)';
var QUESTION_HEADER_COLOR = 'aquamarine';
var QUESTION_BODY_COLOR = 'rgb(159, 202, 173)';
var GRID_CHILDREN_COLOR = 'rgba(255, 255, 255, 0.8)';
var DIALOG_BACKGROUND_COLOR = 'rgb(255, 150, 200)'; 
var PIECHART_TITLES_COLOR = "blue";

// fonts
var GRID_CHILDREN_FONT_SIZE = "16px";

// layout
var MARGIN_LEFT = "5%";
var MARGIN_RIGHT = "5%";
var QUESTION_MARGIN_TOP = "10vh";
var PERCENTAGE_SHIFT_TEXTBOX_RIGHT = 20;
var TEXTAREA_ROWS = 5;
var TEXTAREA_COLS = 80;
var TEXTAREA_MIN_WIDTH = "95%";
var TEXTAREA_MAX_WIDTH = "95%";
var TABLE_COLUMN_SPACING = 2.5;
var TABLE_SPACING_BETWEEN_ROWS = 5;


// number of rows and columns in grid
if(android) {
    var ROWS = 11;
    var COLS = 11;
} else {
    var ROWS = 21;
    var COLS = 21;
}
