/*
  script para graficar el partido politico seleccionado en cada uno de los 18 distritos
*/

// Funcion al seleccionar una opcion del select para Partidos
function selectOptionPart(partido, ordenSelected){
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
  
  loadBarGraphicsPart(datosBarPart, partido, ordenSelected);
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
function loadBarGraphicsPart(datosBar, partido, ordenSelected) {
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

  const etiquetas = g.append("g")

  // Carga de Datos
  datosBar.pop();///  Eliminamos la última fila que es la de totales que no utilizamos en esta gráfica
  data = datosBar;
  // Accessor
  const yAccessor = (d) => d.votos;
  const xAccessor = (d) => d.distrito;

  //ordenar
  switch(ordenSelected){
    case 'option1':
      //ya está en orden por distrito
      break;
    case 'option2':
      data.sort((a, b) => yAccessor(b) - yAccessor(a))
      break;
    case 'option3':
      data.sort((a, b) => yAccessor(a) - yAccessor(b))
      break;
  }

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
  const rect = g.selectAll("rect").data(data, xAccessor)
  rect
    .enter()
    .append("rect")
    .attr('x', (d) => x(xAccessor(d)))
    .attr('y', (d) => y(0))
    .attr('width', x.bandwidth())
    .attr('height', (d) => 0)
    .attr('fill', 'white')
    .merge(rect)    
    .transition()
    .duration(900)
    .attr("x", (d) => x(xAccessor(d)))
    .attr("y", (d) => y(yAccessor(d)))
    .attr("width", x.bandwidth())
    .attr("height", (d) => alto - y(yAccessor(d)))
    .attr("fill", (d) => d.color)
    .delay((d,i) => i*100)

    //etiquetas
    const et = etiquetas.selectAll("text").data(data)
    et.enter()
      .append("text")
      .attr("x", (d) => x(xAccessor(d)) + x.bandwidth() / 2)
      .attr("y", (d) => y(0))
      .attr("style", "font-size:12px;  color:#c0c0c0")
      .merge(et)
      .transition()
      .duration(900)
      .attr("x", (d) => x(xAccessor(d)) + x.bandwidth() / 2)
      .attr("y", (d) => y(yAccessor(d)) - 5)
      .text(yAccessor)
      .attr("text-anchor", "middle")
      .delay((d,i) => i*100)

  // Títulos
  const titulo = g
    .append("text")
    .attr("x", ancho/2)
    .attr("y", - 25)
    .classed("titulo", true)
    .text(`Votos emitidos por Distrio Local para el Partido Político: ${partido}`)

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