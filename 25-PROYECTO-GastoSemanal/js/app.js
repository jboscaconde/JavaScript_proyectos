//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//Classes

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]; 
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad){
        //Extraer valor
        const {presupuesto, restante} = cantidad;
        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        },3000)
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); //Elimina el HTML previo
        
        //Iterar sobre los gastos
        gastos.forEach(gasto => {

            const {cantidad, nombre, id} = gasto;

            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //nuevoGasto.setAttribute('data-id', id); Esto y lo de abajo hacen lo mismo
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML 

            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        const submitBtn = formulario.querySelector('button[type="submit"]');
    
        // Guardar el estado PREVIO antes de limpiar clases
        const estabaEnRojo = restanteDiv.classList.contains('alert-danger');
    
        // Limpiar clases primero
        restanteDiv.classList.remove('alert-danger', 'alert-warning', 'alert-success');
    
        // Manejar estado del botón
        submitBtn.disabled = restante <= 0;
    
        // Mostrar mensaje de recuperación SI:
        // 1. Estaba en rojo (estado crítico)
        // 2. Ahora el restante es positivo
        // 3. No es la primera carga (presupuesto > 0)
        if (estabaEnRojo && restante > 0 && presupuesto > 0) {
            ui.imprimirAlerta('¡Presupuesto recuperado!', 'success');
        }
    
        // Asignar nueva clase según el nivel
        if (restante <= 0) {
            restanteDiv.classList.add('alert-danger');
            if (restante < 0) { // Solo mostrar alerta si es negativo estricto
                ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            }
        } else if (restante <= presupuesto / 4) {
            restanteDiv.classList.add('alert-danger');
        } else if (restante <= presupuesto / 2) {
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.add('alert-success');
        }
    }
}

//Instanciar
const ui = new UI();
let presupuesto;

//Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cúal es tu presupuesto');

    console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    //Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario); //Lo instancias aquí una vez tienes presupuesto
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value); 

    //Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos casos son obligatorios', 'error');
        return;
    }else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    //Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje de todo correcto
    ui.imprimirAlerta('Gasto agregado correctamente');

    //Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //Elimina del objeto
    presupuesto.eliminarGasto(id)

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}
