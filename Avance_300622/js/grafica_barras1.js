//Grafica de barras 1, fondo azul
const graf1 = d3.select("#graf-1")
// almacena el objeto chart.js
let pieChart;
// array que almacenara los registros procesados del archivo JSON
let distritos = new Array(); 

// objeto que almacena temporalmente los calculos de votos y porcentajes
let obj = {};

const anchoTotal1 = +graf1.style("width").slice(0, -2)
const altoTotal1 = anchoTotal1 * 9 / 16

const svg1 = graf1
  .append("svg")
  .attr('width', anchoTotal1)
  .attr('height', altoTotal1)
  .attr("class", "bg-primary")
  //.attr("class", "graf") //clase que pone el fondo blanco

$( document ).ready(function() {

  procesarDatosJSON()
    .then( resp =>{
      console.log(distritos);
      cargarSelect(distritos);
      selectOption("RINCON DE ROMOS I");
    });
  // evento al seleccionar un distrito
  $('#filtro-distritos').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    console.log(valueSelected);
    selectOption(valueSelected)
  });
});

// variables para almacenar los datos del distrito seleccionado
let datosBar = new Array();
let datosPie = new Array();
let votosAcu;
let ConteoFinal;
let NO_REGISTRADOS;
let NULOS;
// Funcion al seleccionar una opcion del select
function selectOption(distrito){
  // limpiar array
  datosBar = [];  
  datosPie = [];  
  $.each( distritos, function( key, val ) {
    if( distrito == val.DISTRITO_LOCAL ){  
      armaArrayDatos('PAN', val.PAN, val.PAN_P, val.PAN_C);
      armaArrayDatos('FXM', val.FXM, val.FXM_P, val.FXM_C);
      armaArrayDatos('PRI', val.PRI, val.PRI_P, val.PRI_C);
      armaArrayDatos('PRD', val.PRD, val.PRD_P, val.PRD_C);
      armaArrayDatos('PVEM', val.PVEM, val.PVEM_P, val.PVEM_C);
      armaArrayDatos('PT', val.PT, val.PT_P, val.PT_C);
      armaArrayDatos('MORENA', val.MORENA, val.MORENA_P, val.MORENA_C);
      armaArrayDatos('MC', val.MC, val.MC_P, val.MC_C);
      armaArrayDatos('CO_PAN_PRI_PRD', val.CO_PAN_PRI_PRD, val.CO_PAN_PRI_PRD_P, val.CO_PAN_PRI_PRD_C);
      armaArrayDatos('CO_PAN_PRI', val.CO_PAN_PRI, val.CO_PAN_PRI_P, val.CO_PAN_PRI_C);
      armaArrayDatos('CO_PAN_PRD', val.CO_PAN_PRD, val.CO_PAN_PRD_P, val.CO_PAN_PRD_C);
      armaArrayDatos('CO_PRI_PRD', val.CO_PRI_PRD, val.CO_PRI_PRD_P, val.CO_PRI_PRD_C);
      armaArrayDatos('CO_PVEM_PT', val.CO_PVEM_PT, val.CO_PVEM_PT_P, val.CO_PVEM_PT_C);
      //armaArrayDatos('ConteoFinal', val.ConteoFinal, '', '');
      ConteoFinal = val.ConteoFinal;
      NO_REGISTRADOS = val.NO_REGISTRADOS;
      NULOS = val.NULOS;
      votosAcu = ConteoFinal - ( NO_REGISTRADOS + NULOS );
      datosPie.push(
        {
          label: "Votos Acumulados",
          value: votosAcu
        },
        {
          label: "No registradas",
          value: NO_REGISTRADOS
        },
        {
          label: "Votos Nulos",
          value: NULOS
        } 
      )
    }
  }); 
  
  // dar formato a las cantidades
  votosAcu = votosAcu.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  ConteoFinal = ConteoFinal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // asignar las cantidades a las etiquetas div correspondientes
  $(".votosAcu").html( votosAcu );
  $(".noReg").html( NO_REGISTRADOS );
  $(".nulos").html( NULOS );
  $(".totVotos").html( ConteoFinal );

  // dibujar la grafica de barras
  loadBarGraphics(datosBar, distrito);
  // dibujar la grafica de pie
  graficaPie(datosPie)


}
function armaArrayDatos(partido, votos, porcentaje, color){
  var numeros = new Object();
  numeros.partido = partido;
  numeros.votos = votos;
  numeros.porcentaje = porcentaje;
  numeros.color = color;
  datosBar.push(numeros)
}

// LLenamos el select con los option de los nombres de Distritos
function cargarSelect(distritos){
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


// Funcion que lee el JSON de todos los votos, regresa una promesa
function procesarDatosJSON() {
    return new Promise(function(resolve, reject) {
      $.getJSON( "js/AGS_GUB_2022_limpio.json", function( data ) {  
        let inicio = true;
        $.each( data, function( key, registro ) {
            // si inicio es TRUE indica un nuevo distrito al que se calculara los votos por patido
            // y al final el objeto obtenido se agrega a "distritos"
            if( inicio ){
              distrito = registro.DISTRITO_LOCAL;
            }
            inicio=false;
            if( registro.DISTRITO_LOCAL == distrito && registro.DISTRITO_LOCAL != 'N/A' ){ 
              calculaVotosProcentaje(obj, registro);
            }else{
              distritos.push(obj)    
              inicio = true;
              obj = {};        
              calculaVotosProcentaje(obj, registro);
            } 
            distrito = registro.DISTRITO_LOCAL;
        }); 
        resolve(distritos.pop()); // eliminamos el ultimo objeto del array que es dupliado por el else de la condicion "registro.DISTRITO_LOCAL == distrito"
      });
    });
}  
function calculaVotosProcentaje(obj, registro){
  // calcula Votos
  obj.DISTRITO_LOCAL = distrito;
  obj.FXM             =  (obj.FXM * 1 || 0) + registro.FXM;
  obj.MC              =  (obj.MC * 1 || 0) + registro.MC;
  obj.MORENA          =  (obj.MORENA * 1 || 0) + registro.MORENA;
  obj.PAN             = (obj.PAN * 1 || 0) + registro.PAN;
  obj.PRD             =  (obj.PRD * 1 || 0) + registro.PRD;
  obj.PRI             =  (obj.PRI * 1 || 0) + registro.PRI;
  obj.PT              =  (obj.PT * 1 || 0) + registro.PT;
  obj.PVEM            =  (obj.PVEM * 1 || 0) + registro.PVEM; 
  obj.NULOS            =  (obj.NULOS * 1 || 0) + registro.NULOS; 
  obj.NO_REGISTRADOS            =  (obj.NO_REGISTRADOS * 1 || 0) + registro.NO_REGISTRADOS; 
  obj.CO_PAN_PRI_PRD  =  (obj.CO_PAN_PRI_PRD * 1 || 0) + registro.CO_PAN_PRI_PRD;
  obj.CO_PAN_PRI      =  (obj.CO_PAN_PRI * 1 || 0) + registro.CO_PAN_PRI;
  obj.CO_PAN_PRD      =  (obj.CO_PAN_PRD * 1 || 0) + registro.CO_PAN_PRD;
  obj.CO_PRI_PRD      =  (obj.CO_PRI_PRD * 1 || 0) + registro.CO_PRI_PRD;
  obj.CO_PVEM_PT      =  (obj.CO_PVEM_PT * 1 || 0) + registro.CO_PVEM_PT;
  obj.ConteoFinal     = obj.FXM + obj.MC + obj.MORENA + obj.PAN + obj.PRD + obj.PRI + obj.PT + obj.PVEM + obj.CO_PAN_PRI_PRD + obj.CO_PAN_PRI + obj.CO_PAN_PRD + obj.CO_PRI_PRD + obj.CO_PVEM_PT + obj.NULOS + obj.NO_REGISTRADOS;
  obj.FXM_C     = '#EC609D';
  obj.MC_C      = '#FF5F0A';
  obj.MORENA_C  = '#961906';
  obj.PAN_C     = '#015CA9';
  obj.PRD_C     = '#FFCE08';
  obj.PRI_C     = '#F43409';
  obj.PT_C      = '#E32E25';
  obj.PVEM_C    = '#88C544';    
  obj.CO_PAN_PRI_PRD_C    = '#EDB621';    
  obj.CO_PAN_PRI_C    = '#EDB621';    
  obj.CO_PAN_PRD_C    = '#EDB621';    
  obj.CO_PRI_PRD_C    = '#EDB621';    
  obj.CO_PVEM_PT_C    = '#EDB621';    
  
}
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

function graficaPie(numeros){
  // si ya esta la grafica destruirla para generar otro grafico
  if(pieChart != undefined){
    pieChart.destroy();
  }

  var labels2 = [ "Votos Acumulados","No registradas","Votos Nulos" ];
 
  var oilCanvas = document.getElementById("pie");
  var oilData = {
      labels: labels2,
      datasets: [
        {
          data: numeros,
          backgroundColor: [
              "#6AC1C4",
              "#AF5FAE",
              "#F43409", 
          ],
        
        }
        
      ],
           
  };

  pieChart = new Chart(oilCanvas, {
    type: 'pie',
    data: oilData,
    options: { 
       
      plugins: {  
        tooltip: { 
          usePointStyle: true,
          callbacks: {
              labelPointStyle: function(context) {
                return {
                    pointStyle: 'triangle',
                    rotation: 0
                };
              },
               
          }
        },
        title: {
          display: true,
          font: {
            size: 18,
          }, 
          text: ''
        },
        legend: {
            display: true, 
            align: 'start',
            position: 'top',
            labels: {
              usePointStyle:true,
              color: 'rgb(0,0, 12)',
              font: {
                size: 12,
              },
              pointStyle: 'circle'              
            } 
        },
      },
      animations: {
        animation : true,
        animationEasing : "easeOutBounce",
        percentageInnerCutout: 60,
        segmentShowStroke : true
      }
    }
  });
} 
 
