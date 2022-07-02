/*
  script para graficar el partido politico seleccionado en cada uno de los 18 distritos
*/

// Funcion al seleccionar una opcion del select para Partidos
function selectOptionPart(partido){
  // limpiar array
  datosBarPart = [];
  let color = partido + '_C'
  $.each( distritos, function( key, val ) { 
    // convertir el nombre del distrito a un array
    const romanoArr = val.DISTRITO_LOCAL.split(" ");
    // obtener la ultima posicion del array 
    let romano = romanoArr[romanoArr.length - 1];
    arrayDatosPart(romano, val[partido], val[color]);
  }); 
  // dibujar la grafica de barras
  
  loadBarGraphicsPart(datosBarPart, partido);
}

// armar el array con los datos para graficar
function arrayDatosPart(partido, votos, color){
  var numeros = new Object();
  numeros.distrito = partido;
  numeros.votos = votos;
  numeros.color = color;
  datosBarPart.push(numeros);
}



// Grafica para los partidos Bar
function loadBarGraphicsPart(datosBar) {
  // limpiamos el contenedor de la grafica
  d3.select('#grafPart').html("");
 
  // Selecciones
  const graf = d3.select("#grafPart");

  // Dimensiones
  const anchoTotal = +graf.style("width").slice(0, -2);
  const altoTotal = (anchoTotal * 11) / 16;

  const margins = {
    top: 60,
    right: 20,
    bottom: 75,
    left: 50,
  };
  const ancho = anchoTotal - margins.left - margins.right;
  const alto = altoTotal - margins.top - margins.bottom;

  // Escaladores
  // Elementos gráficos (layers)
  const svg = graf
    .append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graf");

  const layer = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  layer
    .append("rect")
    .attr("height", alto)
    .attr("width", ancho)
    .attr("fill", "white");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  // Carga de Datos
  datosBar.pop();///  Eliminamos la última fila que es la de totales que no utilizamos en esta gráfica
  data = datosBar;
  // Accessor
  const yAccessor = (d) => d.votos;
  const xAccessor = (d) => d.distrito;

  // ordenar ascendente
  //data.sort((a, b) => yAccessor(b) - yAccessor(a))
  // Escaladores
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .range([alto, 0]);


  const x = d3
    .scaleBand()
    .domain(d3.map(data, xAccessor))
    .range([0, ancho])
    .paddingOuter(0.2)
    .paddingInner(0.1);


  //Rectángulos (Elementos)
  const rect = g
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(xAccessor(d)))
    .attr("y", (d) => y(yAccessor(d)))
    .attr("width", x.bandwidth())
    .attr("height", (d) => alto - y(yAccessor(d)))
    .attr("fill", function (d) {
      return d.color;
    });
    
  // aplicar texto a cada barra en la parte de arriba
  const et = g
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("style", "font-size:12px;  color:#c0c0c0")
    .attr("x", (d) => x(xAccessor(d)) + x.bandwidth() / 2)
    .attr("y", (d) => y(yAccessor(d)))
    .text(yAccessor)
    .attr("text-anchor", "middle");

  // Títulos
  g.append("text")
    .attr("x", ancho / 2)
    .attr("y", -15)
    .classed("titulo", true);
  // Ejes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y).ticks(8);


  // texto a cada columna
  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .attr("x", alto + 10)
    .classed("axis", true)
    .call(xAxis)
    .selectAll("text")
    .attr("style", "font-size:14px; font-weight:bold; color:#000000;margin-top:15px");

  const yAxisGroup = g.append("g").classed("axis", true).call(yAxis);


} 