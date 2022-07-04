let total_PAN_PRI_PRD = 0;
let lista_nominal = 1035733;
let actas = 1740;
let participacion = 0;
///   SUMAR TOTALES AL ARREGLO   
let tot_PAN=0;
let tot_FXM=0;
let tot_PRI=0;
let tot_PRD=0;
let tot_PVEM=0;
let tot_PT=0; 
let tot_MORENA=0; 
let tot_MC=0; 
let tot_CO_PAN_PRD=0;
let tot_CO_PAN_PRI=0;
let tot_CO_PAN_PRI_PRD=0;
let tot_CO_PRI_PRD=0;
let tot_CO_PVEM_PT=0;
let tot_ConteoFinal=0;
let tot_NO_REGISTRADOS=0;
let tot_NULOS=0;
let tot_MC_Porcent=0;
let tot_MORENA_Porcent=0;
let tot_FXM_Porcent=0;
let total_PAN_PRI_PRD_Porcent=0;
let tot_PVEM_PT_Porcent=0;

// Funcion que lee el JSON de todos los votos
function procesarDatosJSON() {
  console.log('***************** procesarDatosJSON');
 
  return new Promise( (resolve, reject) =>{
    $.getJSON( "js/AGS_GUB_2022_limpio.json")
      .done(function( data ) {
        let inicio = true;
        $.each( data, function( key, registro ){
          // si hay error con los datos
          if(!registro)
              reject('error al leer los datos')
          // si inicio es TRUE indica un nuevo distrito al que se calculara los votos por patido
          // y al final el objeto obtenido se agrega a "distritos"
          if( inicio ){
              distrito = registro.DISTRITO_LOCAL;
          }
          inicio=false;
          
          if( registro.DISTRITO_LOCAL == distrito && registro.DISTRITO_LOCAL != 'N/A' ){ 
              ajustadatos(obj, registro);
          }else{
              distritos.push(obj)    
              inicio = true;
              obj = {};        
              ajustadatos(obj, registro);
          } 
          distrito = registro.DISTRITO_LOCAL;
        }); 
        resolve(distritos.pop()); // eliminamos el ultimo objeto del array que es dupliado por el else de la condicion "registro.DISTRITO_LOCAL == distrito"

        // Calculos para agregar la fila de totales al arreglo para la gráfica 
        $.each( distritos, function( key, val ) {
          tot_NULOS = tot_NULOS + parseInt(val.NULOS);
          tot_PAN = tot_PAN + parseInt(val.PAN);
          tot_FXM = tot_FXM + parseInt(val.FXM);
          tot_PRI = tot_PRI + parseInt(val.PRI);
          tot_PRD = tot_PRD + parseInt(val.PRD);
          tot_PVEM = tot_PVEM + parseInt(val.PVEM);
          tot_PT = tot_PT + parseInt(val.PT);
          tot_MORENA = tot_MORENA + parseInt(val.MORENA);
          tot_MC = tot_MC + parseInt(val.MC);
          tot_CO_PAN_PRD = tot_CO_PAN_PRD + parseInt(val.CO_PAN_PRD);
          tot_CO_PAN_PRI = tot_CO_PAN_PRI + parseInt(val.CO_PAN_PRI);
          tot_CO_PAN_PRI_PRD = tot_CO_PAN_PRI_PRD + parseInt(val.CO_PAN_PRI_PRD);
          tot_CO_PRI_PRD = tot_CO_PRI_PRD + parseInt(val.CO_PRI_PRD);
          tot_CO_PVEM_PT = tot_CO_PVEM_PT + parseInt(val.CO_PVEM_PT);
          tot_ConteoFinal = tot_ConteoFinal + parseInt(val.ConteoFinal);
          tot_NO_REGISTRADOS = tot_NO_REGISTRADOS + parseInt(val.NO_REGISTRADOS);
        });
      
        //  Agrega la fila  de totales al arreglo para la gráfica de totales por partido
        let count = distritos.push({DISTRITO_LOCAL: 'TOTALES', FXM: tot_FXM, MC: tot_MC, MORENA: tot_MORENA, PAN: tot_PAN, PRD: tot_PRD, PRI: tot_PRI, PT: tot_PT, PVEM: tot_PVEM, NULOS: tot_NULOS, NO_REGISTRADOS: tot_NO_REGISTRADOS, CO_PAN_PRI_PRD: tot_CO_PAN_PRI_PRD, CO_PAN_PRI: tot_CO_PAN_PRI, CO_PAN_PRD: tot_CO_PAN_PRD, CO_PRI_PRD: tot_CO_PRI_PRD, CO_PVEM_PT: tot_CO_PVEM_PT, ConteoFinal: tot_ConteoFinal, FXM_C: "#EC609D", MC_C: "#FF5F0A", MORENA_C: "#961906", PAN_C: "#015CA9", PRD_C: "#FFCE08", PRI_C: "#F43409", PT_C: "#E32E25", PVEM_C: "#88C544", CO_PAN_PRI_PRD_C: "#756853", CO_PAN_PRI_C:"#756853", CO_PAN_PRD_C: "#756853", CO_PRI_PRD_C:"#756853", CO_PVEM_PT_C: "#756853"});
      
        // Cálculos Datos Duros
        total_PAN_PRI_PRD = tot_CO_PAN_PRD + tot_CO_PAN_PRI + tot_CO_PAN_PRI_PRD +tot_CO_PRI_PRD + tot_PRI + tot_PAN + tot_PRD;
      
        participacion = ((100*tot_ConteoFinal)/lista_nominal).toFixed(2);
      
        tot_PVEM_PT = tot_CO_PVEM_PT + tot_PVEM + tot_PT; 
        tot_MC_Porcent = ( tot_MC * 100 ) / (tot_MC + tot_MORENA + tot_FXM + total_PAN_PRI_PRD + tot_PVEM_PT);
        tot_MORENA_Porcent = ( tot_MORENA * 100 ) / (tot_MC + tot_MORENA + tot_FXM + total_PAN_PRI_PRD + tot_PVEM_PT);
        tot_FXM_Porcent = ( tot_FXM * 100 ) / (tot_MC + tot_MORENA + tot_FXM + total_PAN_PRI_PRD + tot_PVEM_PT);
        total_PAN_PRI_PRD_Porcent = ( total_PAN_PRI_PRD * 100 ) / (tot_MC + tot_MORENA + tot_FXM + total_PAN_PRI_PRD + tot_PVEM_PT);
        tot_PVEM_PT_Porcent = ( tot_PVEM_PT * 100 ) / (tot_MC + tot_MORENA + tot_FXM + total_PAN_PRI_PRD + tot_PVEM_PT);
        Datosduros()

      }).fail( function(){
          reject('error al leer los datos')
      });
  });
}

function Datosduros(){
  $("#actasCap").html(actas.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  $("#listNominal").html(lista_nominal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  $("#partCiuda").html(participacion + '%');
  $("#votosCont").html(tot_ConteoFinal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  
  $("#votosMC").html(tot_MC.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br>' + tot_MC_Porcent.toFixed(2) + '%');
  $("#votosMorena").html(tot_MORENA.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br>' + tot_MORENA_Porcent.toFixed(2) + '%');
  $("#votosFxm").html(tot_FXM.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br>' + tot_FXM_Porcent.toFixed(2) + '%');
  $("#votosCopan_pri_prd").html(total_PAN_PRI_PRD.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br>' + total_PAN_PRI_PRD_Porcent.toFixed(2) + '%');
  $("#votosCovem_pt").html(tot_PVEM_PT.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br>' + tot_PVEM_PT_Porcent.toFixed(2) + '%');
}

function ajustadatos(obj, registro){
  // Crea los registros y agrega color según el partido
  obj.DISTRITO_LOCAL  = distrito;
  obj.FXM             =  (obj.FXM || 0) + registro.FXM;
  obj.MC              =  (obj.MC || 0) + registro.MC;
  obj.MORENA          =  (obj.MORENA || 0) + registro.MORENA;
  obj.PAN             =  (obj.PAN || 0) + registro.PAN;
  obj.PRD             =  (obj.PRD || 0) + registro.PRD;
  obj.PRI             =  (obj.PRI || 0) + registro.PRI;
  obj.PT              =  (obj.PT || 0) + registro.PT;
  obj.PVEM            =  (obj.PVEM || 0) + registro.PVEM; 
  obj.NULOS           =  (obj.NULOS || 0) + registro.NULOS; 
  obj.NO_REGISTRADOS  =  (obj.NO_REGISTRADOS || 0) + registro.NO_REGISTRADOS; 
  obj.CO_PAN_PRI_PRD  =  (obj.CO_PAN_PRI_PRD || 0) + registro.CO_PAN_PRI_PRD;
  obj.CO_PAN_PRI      =  (obj.CO_PAN_PRI || 0) + registro.CO_PAN_PRI;
  obj.CO_PAN_PRD      =  (obj.CO_PAN_PRD || 0) + registro.CO_PAN_PRD;
  obj.CO_PRI_PRD      =  (obj.CO_PRI_PRD || 0) + registro.CO_PRI_PRD;
  obj.CO_PVEM_PT      =  (obj.CO_PVEM_PT || 0) + registro.CO_PVEM_PT;
  obj.ConteoFinal     =  obj.FXM + obj.MC + obj.MORENA + obj.PAN + obj.PRD + obj.PRI + obj.PT + obj.PVEM + obj.CO_PAN_PRI_PRD + obj.CO_PAN_PRI + obj.CO_PAN_PRD + obj.CO_PRI_PRD + obj.CO_PVEM_PT + obj.NULOS + obj.NO_REGISTRADOS;
  obj.FXM_C             = '#EC609D';
  obj.MC_C              = '#FF5F0A';
  obj.MORENA_C          = '#961906';
  obj.PAN_C             = '#015CA9';
  obj.PRD_C             = '#FBBC33';
  obj.PRI_C             = '#268809';
  obj.PT_C              = '#D12C2C';
  obj.PVEM_C            = '#88C544';
  obj.CO_PAN_PRI_PRD_C  = '#756853';
  obj.CO_PAN_PRI_C      = '#756853';
  obj.CO_PAN_PRD_C      = '#756853';
  obj.CO_PRI_PRD_C      = '#756853';
  obj.CO_PVEM_PT_C      = '#756853';
}
