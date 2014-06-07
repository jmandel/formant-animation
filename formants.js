var width = 1000;
var height =1000;

var formants = [];
var initialSlop = 8.5;
var terminalSlop = 4;
var pathSlop = 0.4;
var numTokens = 600;
var numSamples = 50;

function generateData(){
  if (formants.length > 0) return;
  formants = [];

  for (var i=0; i<numTokens;i++){

    var ftrack = [];
    formants.push(ftrack);

    var startDistance = Math.random()*initialSlop;
    var startAngle = Math.random()*2*Math.PI;
    var start = [startDistance*Math.cos(startAngle), startDistance*Math.sin(startAngle)];
    var endDistance = Math.random()*terminalSlop;
    var endAngle = Math.random()*2*Math.PI;
    var end = [endDistance*Math.cos(endAngle), endDistance*Math.sin(endAngle)];

    for (var j=0;j<numSamples;j++){
      var sample = [
        start[0] - (start[0]-end[0])*(j/numSamples) + Math.random()*pathSlop,
        start[1] - (start[1]-end[1])*(j/numSamples) + Math.random()*pathSlop
      ];
      ftrack.push(sample);
    }
  }
}

var svg = d3.select('svg')
.attr('width', width)
.attr('height', height)
.attr("viewBox", "-6 -6 12 12");

var g = svg.append("g").attr("viewBox", "-20 -20 40 40");

window.onmousemove = function(e){
  var x = e.clientX / window.width * numSamples;
  jumpToFrame(Math.round(x));
}

var circle;
var timesDefined = 1;
function defineCircles(){
  circle = g.selectAll('circle')
  .data(formants);
  circle.enter().append('circle')
  .attr('cx', function(d){ return d[0][0]; })
  .attr('cy', function(d){ return d[0][1]; })
  .attr('r', .1*timesDefined);
  timesDefined++;
}

function jumpToFrame(frame){
  circle.transition()
  .duration(200)
  .ease('linear')
  .attr('cx', function(d){  
    return d[frame][0];
  })
  .attr('cy', function(d){ 
    return d[frame][1]; 
  }).attr('class', function(d){
    if (Math.pow(d[0][0], 2) + Math.pow(d[0][1],2) > .8*Math.pow(initialSlop,2) ) {
      return "outlier";
    }
  });
  return true;
}

generateData();
defineCircles();

var thinning = 4;
for (var i=0;i <numSamples/thinning;i++){
  (function(i){
    d3.timer(function(){
      return jumpToFrame(i*thinning);
    },200*i)
  })(i)
};
