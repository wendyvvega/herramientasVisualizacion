//Grafica de barras 1, fondo azul
const graf1 = d3.select("#graf-1")

const anchoTotal1 = +graf1.style("width").slice(0, -2)
const altoTotal1 = anchoTotal1 * 9 / 16

const svg1 = graf1
  .append("svg")
  .attr('width', anchoTotal1)
  .attr('height', altoTotal1)
  .attr("class", "bg-primary")
  //.attr("class", "graf") //clase que pone el fondo blanco