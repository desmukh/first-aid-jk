//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}

function drawPath(svg, path, startX, startY, endX, endY, connect) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    var stroke =  parseFloat(path.attr("stroke-width"));
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  endY)                 svg.attr("height", endY);
    if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
    if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));
    
    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    // for further calculations which ever is the shortest distance
    var delta  =  deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

    // set sweep-flag (counter/clock-wise)
    // if start element is closer to the left edge,
    // draw the first arc counter-clockwise, and the second one clock-wise
    var arc1 = 0; var arc2 = 1;
    if (startX > endX) {
        arc1 = 1;
        arc2 = 0;
    }
    // draw tha pipe-like path
    // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 

    if (connect=='leftFromBelow' | connect=='rightFromBelow' ) {
        path.attr("d",  "M"  + startX + " " + (startY) +
                        " H" + (endX - delta*signum(deltaX)) + 
                        " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + delta) +
                        " V" + endY );
    } else if (connect=='belowFromBelow')  {
      path.attr("d",  "M"  + startX + " " + startY +
                      " V" + (endY - delta) +
                      " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (endY) +
                      " H" + (endX));
    } else {
      path.attr("d",  "M"  + startX + " " + startY +
                      " V" + (startY + delta) +
                      " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
                      " H" + (endX - delta*signum(deltaX)) + 
                      " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                      " V" + endY );
    }
}

function connectElements(svg, path, startElem, endElem, connect=false) {

    var svgContainer= $("#svgContainer");

    // if first element is lower than the second, swap!
    if(startElem.offset().top > endElem.offset().top){
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container   
    var svgTop  = svgContainer.offset().top;
    var svgLeft = svgContainer.offset().left;

    // get (top, left) coordinates for the two elements
    var startCoord = startElem.offset();
    var endCoord   = endElem.offset();

    // calculate path's start (x,y)  coords
    // calculate path's end (x,y) coords
    // we want the x coordinate to visually result in the element's mid point
    if (connect=='leftFromBelow' | connect=='rightFromBelow') {
      var startX = startCoord.left - svgLeft;    // x = left offset + 0.5*width - svg's left offset
      var startY = startCoord.top  + 0.5*startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset
      var endX = endCoord.left + 0.5*endElem.outerWidth() - svgLeft;
      var endY = endCoord.top  - svgTop;
    } else if (connect=='belowFromBelow') {
      var startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
      var startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset
      var endX = endCoord.left + endElem.outerWidth() - svgLeft;
      var endY = endCoord.top  + 0.5*endElem.outerHeight() - svgTop;
    } else {
      var startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
      var startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset
      var endX = endCoord.left + 0.5*endElem.outerWidth() - svgLeft;
      var endY = endCoord.top  - svgTop;
    }

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY, connect);

}



function connectAll() {
    // connect all the paths you want!
    connectElements($("#svg1"), $("#path-01-02"), $("#f-01"),   $("#f-02"), "leftFromBelow");
    connectElements($("#svg1"), $("#path-02-03"), $("#f-02"),   $("#f-03"), 'rightFromBelow');
    connectElements($("#svg1"), $("#path-03-04"), $("#f-03"),   $("#f-04"), "belowFromBelow");
    connectElements($("#svg1"), $("#path-04-05"), $("#f-04"),   $("#f-05"), "rightFromBelow");
    connectElements($("#svg1"), $("#path-02-06"), $("#f-02"),   $("#f-06"), false);
    connectElements($("#svg1"), $("#path-08-09"), $("#f-08"),   $("#f-09"), "leftFromBelow");
    connectElements($("#svg1"), $("#path-06-08"), $("#f-06"),   $("#f-08"), "leftFromBelow");
    connectElements($("#svg1"), $("#path-07-05"), $("#f-07"),   $("#f-05"), "leftFromBelow");
    connectElements($("#svg1"), $("#path-03-07"), $("#f-03"),   $("#f-07"), "belowFromBelow");
    connectElements($("#svg1"), $("#path-07-10"), $("#f-07"),   $("#f-10"), "belowFromBelow");
    connectElements($("#svg1"), $("#path-08-11"), $("#f-08"),   $("#f-11"), "belowFromBelow");
    connectElements($("#svg1"), $("#path-09-13"), $("#f-09"),   $("#f-13"), "rightFromBelow");
    connectElements($("#svg1"), $("#path-11-12"), $("#f-11"),   $("#f-12"), "leftFromBelow");
    connectElements($("#svg1"), $("#path-12-13"), $("#f-13"),   $("#f-12"), "leftFromBelow");
    connectElements($("#svg1"), $("#path-05-10"), $("#f-05"),   $("#f-10"), "leftFromBelow");

    // $("#svg1").attr("height", $("#svg1").height()+150);
}

$(document).ready(function() {
    // reset svg each time 
    $("#svg1").attr("height", "0");
    $("#svg1").attr("width", "0");
    connectAll();
});

$(window).resize(function () {
    // reset svg each time 
    $("#svg1").attr("height", "0");
    $("#svg1").attr("width", "0");
    connectAll();
});