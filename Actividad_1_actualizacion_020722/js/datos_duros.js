//Resumen de datos, fondo rojo
const graf2 = d3.select("#datos-duros")
const anchoTotal2 = +graf2.style("width").slice(0, -2)
const altoTotal2 = altoTotal1 

//usa el alto total de la primera grafica para que midan lo mismo
const svg2 = graf2
  .append("svg")
  .attr('width', anchoTotal2)
  .attr('height', altoTotal2)
  .attr("class", "bg-danger")
  //.attr("class", "graf") //clase que pone el fondo blanco