//Grafica de barras que presenta el total de votos por partido 
const graf1 = d3.select("#graf-1")
const orden = d3.select("#orden-filtro")

// almacena el objeto chart.js
let pieChart;
// array que almacenara los registros procesados del archivo JSON
let distritos = new Array(); 

// objeto que almacena temporalmente los calculos de votos y porcentajes
let obj = {};

const anchoTotal1 = +graf1.style("width").slice(0, -2)
const altoTotal1 = anchoTotal1 * 9 / 16

var currentOrden = 'option1'
var partidoSelected = null


$( document ).ready(function() {
  // Funcion que regresa una promesa 
  procesarDatosJSON()
    .then( resp =>{
      cargarSelectDist(distritos);
      selectOptionDist('RINCON DE ROMOS I');
      selectOptionPart('PAN', 'option1')
      partidoSelected = 'PAN'
    }).catch( (error) =>{
      console.log(error);
    });
  // evento al seleccionar un distrito
  $('#filtro-distritos').on('change', function (e) {
    var valueSelected = this.value;
    selectOptionDist(valueSelected)
  });
  // evento al seleccionar un partido
  $('#filtro-partidos').on('change', function (e) {
    var valueSelected = this.value;
    partidoSelected = valueSelected
    selectOptionPart(partidoSelected, currentOrden)
  });
  // evento para order grafica
  $('input[type=radio][name=orden]').change(function() {
    currentOrden = this.value
    selectOptionPart(partidoSelected, this.value)
  });
});

// variables para almacenar los datos del distrito seleccionado
let datosBarDist = new Array();
let datosBarPart = new Array();
let datosPie = new Array();
let votosAcu;
let ConteoFinal;
let NO_REGISTRADOS;
let NULOS;
let Tot_nulos;
let Tot_PAN = 0;

// Funcion al seleccionar una opcion del select para Distritos
function selectOptionDist(distrito){
  // limpiar array
  datosBarDist = [];  
  datosPie = [];
  totales = []
  $.each( distritos, function( key, val ) {
    if( distrito == val.DISTRITO_LOCAL ){  
      arrayDatosDist('PAN', val.PAN, val.PAN_C);
      arrayDatosDist('FXM', val.FXM, val.FXM_C);
      arrayDatosDist('PRI', val.PRI, val.PRI_C);
      arrayDatosDist('PRD', val.PRD, val.PRD_C);
      arrayDatosDist('PVEM', val.PVEM, val.PVEM_C);
      arrayDatosDist('PT', val.PT, val.PT_C);
      arrayDatosDist('MORENA', val.MORENA, val.MORENA_C);
      arrayDatosDist('MC', val.MC, val.MC_C);
      arrayDatosDist('CO_PAN_PRI_PRD', val.CO_PAN_PRI_PRD, val.CO_PAN_PRI_PRD_C);
      arrayDatosDist('CO_PAN_PRI', val.CO_PAN_PRI, val.CO_PAN_PRI_C);
      arrayDatosDist('CO_PAN_PRD', val.CO_PAN_PRD, val.CO_PAN_PRD_C);
      arrayDatosDist('CO_PRI_PRD', val.CO_PRI_PRD, val.CO_PRI_PRD_C);
      arrayDatosDist('CO_PVEM_PT', val.CO_PVEM_PT, val.CO_PVEM_PT_C);
      //armaArrayDatos('ConteoFinal', val.ConteoFinal, '', '');
      ConteoFinal = val.ConteoFinal;
      NO_REGISTRADOS = val.NO_REGISTRADOS;
      NULOS = val.NULOS;

      votosAcu = ConteoFinal - ( NO_REGISTRADOS + NULOS );
      datosPie.push(
        {
          label: "Votos Acumulados %",
          value: parseInt(((votosAcu/ConteoFinal)*100).toFixed(1)),
          color: '#429867'
          
        },
        {
          label: "No registradas",
          value: parseInt(((NO_REGISTRADOS/ConteoFinal)*100).toFixed(1)),
          color: '#fab243'
        },
        {
          label: "Votos Nulos",
          value: parseInt(((NULOS/ConteoFinal)*100).toFixed(1)),
          color: '#e02130'
        } 
      )
    }
  }); 
  
  //dar formato a las cantidades
  votosAcu = votosAcu.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  ConteoFinal = ConteoFinal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  totales.push(
    {
      label: "Votos acumulados",
      value: votosAcu
    },
    {
      label: "No registrados",
      value: NO_REGISTRADOS
    },
    {
      label: "Votos nulos",
      value: NULOS
    },
    {
      label: "Total de votos",
      value: ConteoFinal
    }

  )
  // dibujar la grafica de barras
  loadBarGraphics(datosBarDist, distrito);
  // dibujar la grafica de pie
  graficaPie(datosPie, totales, distrito)
}

// armar el array con los datos para graficar
function arrayDatosDist(partido, votos, color){
  var numeros = new Object();
  numeros.partido = partido;
  numeros.votos = votos;
  numeros.color = color;
  datosBarDist.push(numeros);
}

// LLenamos el select con los option de los nombres de Distritos
function cargarSelectDist(distritos){
  let inicio = true;
  $.each( distritos, function( key, registro ) {
    if( inicio ){
      distrito = registro.DISTRITO_LOCAL;
      $('#filtro-distritos').append( $('<option>').val(registro.DISTRITO_LOCAL).text(registro.DISTRITO_LOCAL) );
    }
    inicio=false;
    if( registro.DISTRITO_LOCAL == distrito && registro.DISTRITO_LOCAL != 'N/A' ) inicio = true;      
  });
}
 
// Grafica para los distritos Bar
const loadBarGraphics =  (datosBar, entidad) => {
  
  // limpiamos el contenedor de la grafica
  d3.select('#graf').html("")  
   
  // Selecciones
  const graf = d3.select("#graf")

  // Dimensiones
  const anchoTotal = +graf.style("width").slice(0, -2)
  const altoTotal = (anchoTotal * 11) / 16

  const margins = {
    top: 60,
    right: 20,
    bottom: 75,
    left: 50,
  }
  const ancho = anchoTotal - margins.left - margins.right
  const alto = altoTotal - margins.top - margins.bottom

  // Escaladores

  // Elementos gráficos (layers)
  const svg = graf
    .append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graf")

  const layer = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

  layer
    .append("rect")
    .attr("height", alto)
    .attr("width", ancho)
    .attr("fill", "white")

  const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    
  // Carga de Datos
  data = datosBar; 
  // Accessor
  const yAccessor = (d) => d.votos
  const xAccessor = (d) => d.partido

  // ordenar ascendente
  //data.sort((a, b) => yAccessor(b) - yAccessor(a))

  // Escaladores
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .range([alto, 0])

  //console.log(data)
  //console.log(d3.map(data, xAccessor))

  const x = d3
    .scaleBand()
    .domain(d3.map(data, xAccessor))
    .range([0, ancho])
    .paddingOuter(0.2)
    .paddingInner(0.1)

 
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
    .attr("fill", function(d){      
      return d.color
    })
  // aplicar texto a cada barra en la parte de arriba
  const et = g
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("style", "font-size:14px; font-weight:bold; color:#c0c0c0")
    .attr("x", (d) => x(xAccessor(d)) + x.bandwidth() / 2)
    .attr("y", (d) => y(yAccessor(d)))
    .text(yAccessor)
    .attr("text-anchor", "middle")

  // Insertar el logo a cada barra 
  arrLogos = [
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_pan.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_fxm.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_pri.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_prd.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_pvem.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_pt.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_morena.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_pmc.jpg",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_co_pan_pri_prd.png",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_co_pan_pri.png",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_co_pan_prd.png",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_co_pri_prd.png",
    "https://www.prep2022-ags-iee.mx/res/ags2022/logos/logo_co_pvem_pt.png",
  ] 
  let anchoImg = 10;
  $.each( arrLogos, function( key, val ) {
    anchoImg = anchoImg + 53 + key;
    svg.append("image")  
      .attr("transform", ` translate(${anchoImg}, 51) `) 
      .attr("xlink:href", val)   
      .attr("y", alto+10)
      .attr("width", 50)
      .attr("height", 40);
  });

  // Títulos
  g.append("text")
    .attr("x", ancho / 2)
    .attr("y", -15)    
    .classed("titulo", true)
  // Ejes

  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y).ticks(8)

   
  // texto a cada columna
  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .classed("axis", true)
    .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-45)" )
      .text("")
  
  const yAxisGroup = g.append("g").classed("axis", true).call(yAxis)
}
 

