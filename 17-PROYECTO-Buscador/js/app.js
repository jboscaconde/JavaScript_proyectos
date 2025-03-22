//Variables
const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');

//Contenedor para los resultados
const resultado = document.querySelector('#resultado');


const yearMax = new Date().getFullYear(); //Obtiene el años actual
const yearMin = yearMax - 10;

//Generar un objeto con la búsqueda
const datosBusqueda = {
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    transmision: '',
    color: '',

}

//Eventos
document.addEventListener('DOMContentLoaded', () =>{
    mostrarAutos(autos); //muestra los autos al cargar

    //Llena las opciones de años
    llenarSelect(); 
})

//Event listener para los select de búsqueda
marca.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.marca = e.target.value;

    filtrarAuto()
})

year.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.year = parseInt(e.target.value);//Porque el valor es un string cuando debe de ser un numero

    filtrarAuto();
})

minimo.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.minimo = e.target.value;
    
    filtrarAuto();
})

maximo.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.maximo = e.target.value;

    filtrarAuto();
})

puertas.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.puertas = parseInt(e.target.value);

    filtrarAuto();
    
})

transmision.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.transmision = e.target.value;
    
    filtrarAuto();
})

color.addEventListener('change', e =>{ //Se activa cuando se cambia la seleccion de la opcion
    datosBusqueda.color = e.target.value;
    
    filtrarAuto();
})

//Funciones
function mostrarAutos(autos) {
    limpiarHTML();//Elimina el html previo

    autos.forEach(auto => {

        const {marca, modelo, year, precio, puertas, color, transmision} = auto;
        const autoHTML = document.createElement('P');

        autoHTML.textContent = `
        ${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} $ - Color: ${color}`;

        //Insertar en el html
        resultado.appendChild(autoHTML);
    });
}

//Limpiar HTML
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

//Genera los años del select
function llenarSelect() {
    
    for(let i = yearMax; i >= yearMin; i--) {
        const opcion = document.createElement('OPTION');
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion); //Agrega las opciones de cada año

    }
}

//Fución que filtra en base a la búsqueda
function filtrarAuto() {
    const resultado = autos.filter(filtrarMarca).filter(filtrarYear).filter(filtrarMinimo).filter(filtrarMaximo).filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);

    if (resultado.length){
        mostrarAutos(resultado);
    }else {
        noResultado();
    }
    
}

function noResultado(){

    limpiarHTML();
    
    const noResultado = document.createElement('DIV');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No hay resultados';
    resultado.appendChild(noResultado);
    
}

function filtrarMarca(auto){
    const {marca} = datosBusqueda;
    if (marca) {
        return auto.marca === marca;
    }
    return auto;
}

function filtrarYear(auto) {
    const {year} = datosBusqueda;
    if (year) {
        return auto.year === year;
    }
    return auto;
}

function filtrarMinimo(auto) {
    const {minimo} = datosBusqueda;
    if (minimo) {
        return auto.precio >= minimo;
    }
    return auto;
}

function filtrarMaximo(auto) {
    const {maximo} = datosBusqueda;
    if (maximo) {
        return auto.precio <= maximo;
    }
    return auto;
}

function filtrarPuertas (auto) {
    const {puertas} = datosBusqueda;
    if (puertas) {
        return auto.puertas === puertas;
    }
    return auto;
}

function filtrarTransmision (auto) {
    const {transmision} = datosBusqueda;
    if (transmision) {
        return auto.transmision === transmision;
    }
    return auto;
}

function filtrarColor (auto) {
    const {color} = datosBusqueda;
    if (color) {
        return auto.color === color;
    }
    return auto;
}
