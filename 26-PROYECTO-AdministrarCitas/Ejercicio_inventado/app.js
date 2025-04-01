//Selectores

const formulario = document.querySelector('#formulario-libro')
const tituloLibro = document.querySelector('#titulo')
const autorLibro = document.querySelector('#autor')
const generoLibro = document.querySelector('#genero')
const anioLibro = document.querySelector('#anio')
const disponibleLibro = document.querySelector('#disponible')

//Objeto para almacenar los datos introducidos

const libroObj = {
    id: Date.now(),
    titulo: '',
    autor: '',
    genero: '',
    anio: '',
    disponible: false
}

//Eventos

tituloLibro.addEventListener('change', datosLibro)
autorLibro.addEventListener('change', datosLibro)
generoLibro.addEventListener('change', datosLibro)
anioLibro.addEventListener('change', datosLibro)
disponibleLibro.addEventListener('change', datosLibro)

formulario.addEventListener('submit', submitLibro)

class Libro {
    constructor({titulo, autor, genero, anio, disponible}) {
        this.id = Date.now(),
        this.titulo = titulo,
        this.autor = autor,
        this.genero = genero,
        this.anio = anio,
        this.disponible = disponible
    }
}

//Funciones

function datosLibro(e) {
    if (e.target.type === 'checkox') {
        libroObj[e.target.name] = e.target.checked
    }else {
        libroObj[e.target.name] = e.target.value
    }

    console.log("Datos actualizados")
}

function submitLibro(e) {
    e.prevenDefault()

}
