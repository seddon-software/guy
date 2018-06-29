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
var ACTIVE_TAB_BUTTON_BORDER_COLOR = "black";
var ASSESSMENT_BACKGROUND_COLOR = "white";
var BACKGROUND_COLOR = "white";
var BANNER_TITLE_COLOR = "gold";
var CHARTS_TITLE_COLOR = "darkmagenta";
var CHART_BACKGROUND_COLOR = "rgb(220, 220, 255)";
var CHART_BORDER_COLOR = "rgb(220, 220, 255)";
var COPYRIGHT_BACKGROUND_COLOR = "rgba(0, 0, 0, 0.1)"; 
var COPYRIGHT_TEXT_COLOR = "rgba(0, 0, 0, 0.6)";
var DIALOG_BACKGROUND_COLOR = 'rgb(255, 150, 200)'; 
var ERROR_MESSAGE_COLOR = "red";
var GRID_CHILDREN_COLOR = 'rgba(255, 255, 255, 0.8)';
var PIECHART_TITLES_COLOR = "blue";
var QUESTION_ANSWER_INVALID_COLOR = 'rgb(255, 150, 200)';
var QUESTION_ANSWERED_COLOR = 'rgb(100, 150, 200)';
var QUESTION_BODY_COLOR = 'rgb(159, 202, 173)';
var QUESTION_HEADER_COLOR = 'aquamarine';
var TAB_BUTTON_COLOR = "black";
var TAB_BUTTON_BACKGROUND_COLOR = "white"
var TAB_HEADING_BACKGROUND_COLOR = 'white';
var TITLE_BAR_COLOR = "white";


// fonts
var GRID_CHILDREN_FONT_SIZE = "16px";

// layout
var COPYRIGHT_WIDTH = "50vw";
var MARGIN_LEFT = "5%";
var MARGIN_RIGHT = "5%";
var PERCENTAGE_SHIFT_TEXTBOX_RIGHT = 20;
var QUESTION_MARGIN_TOP = "10vh";
var TEXTAREA_ROWS = 5;
var TEXTAREA_COLS = 80;
var TEXTAREA_MIN_WIDTH = "95%";
var TEXTAREA_MAX_WIDTH = "95%";
var TEXTAREA_PADDING = "5%";
var TABLE_COLUMN_SPACING = 2.5;
var TABLE_SPACING_BETWEEN_ROWS = 5;

// miscellaneous
var HIGHLANDS_NEGOTIATIONS = "http://www.highlandsnegotiations.com/";

// number of rows and columns in grid
if(android) {
    var ROWS = 11;
    var COLS = 11;
} else {
    var ROWS = 21;
    var COLS = 21;
}
