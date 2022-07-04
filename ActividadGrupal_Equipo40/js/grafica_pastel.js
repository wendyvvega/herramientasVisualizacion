//Grafica de pastel, fondo amarillo
const graf4 = d3.select("#pie")
const registros = d3.select('#votos')
const anchoTotal4 = +graf4.style("width").slice(0, -2)
const altoTotal4 = altoTotal1 - 100
const margin = 50
var radius = Math.min(anchoTotal4, altoTotal4) / 2 - margin

const svg4 = graf4
 .append("svg")
 .attr('width', anchoTotal4)
 .attr('height', altoTotal4)
 .attr("class", "graf")

const gPie = svg4
  .append("g")
  .attr("transform", "translate(" + anchoTotal4 / 2 + "," + altoTotal4 / 2 + ")");

//Formato
const f = d3.format(",.0%")

// Grafica para los distritos Pie
const graficaPie = async (numeros, totales, distrito) => {
  // asignar las cantidades a las etiquetas correspondientes
  $("#distrito").html( distrito );
  $("#votosAcu").html( totales[0]['value'] );
  $("#noReg").html( totales[1]['value'] );
  $("#nulos").html( totales[2]['value'] );
  $("#totVotos").html( totales[3]['value'] );

  var pie = d3.pie()
    .sort(null)
    .value(function(d) {
      return d.value; });
  
  var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
  
  var arc = gPie.selectAll("arc")
    .data(pie(numeros))
    .enter().append("g")
  arc
    .attr("class", "arc")
    .transition()
    .duration(1600)
    .attrTween("d", arcTween)
    .delay((d,i) => i*100)
  
  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return d.data.color; })
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 1);

  arc.append("text")
    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
    .attr("dy", "0.35em")
    .attr("style", "font-size:12px;  color:#c0c0c0")
    .text(function(d) { return f(d.data.value/100); });
}

var path = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

function arcTween(a){
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t){
    return path(i(t));
  };
}
