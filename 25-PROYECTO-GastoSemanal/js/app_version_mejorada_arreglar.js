// ============ SELECTORES GLOBALES ============
const DOM = {
    // Formulario
    formulario: document.getElementById('agregar-gasto'),
    inputGasto: document.getElementById('gasto'),
    inputCantidad: document.getElementById('cantidad'),
    
    // Presupuesto
    total: document.getElementById('total'),
    restante: document.getElementById('restante'),
    restanteContainer: document.querySelector('.restante'),
    
    // Lista
    listaGastos: document.getElementById('gastos').querySelector('ul'),
    
    // Botones
    btnSubmit: document.querySelector('#agregar-gasto button[type="submit"]')
  };
  
  // ============ MODELO (Datos/Lógica) ============
  class PresupuestoModel {
    constructor(presupuesto) {
      this.presupuesto = Number(presupuesto);
      this.restante = Number(presupuesto);
      this.gastos = [];
    }
  
    agregarGasto(gasto) {
      this.gastos = [...this.gastos, { ...gasto, id: Date.now() }];
      this.calcularRestante();
    }
  
    eliminarGasto(id) {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
      this.calcularRestante();
    }
  
    calcularRestante() {
      const gastado = this.gastos.reduce((total, g) => total + g.cantidad, 0);
      this.restante = this.presupuesto - gastado;
    }
  }
  
  // ============ VISTA (UI) ============
  class GastoView {
    static mostrarGastos(gastos) {
      DOM.listaGastos.innerHTML = gastos.map(gasto => `
        <li data-id="${gasto.id}" class="list-group-item d-flex justify-content-between align-items-center">
          ${gasto.nombre}
          <span class="badge badge-primary badge-pill">$${gasto.cantidad}</span>
          <button class="btn btn-danger borrar-gasto">&times;</button>
        </li>
      `).join('');
    }
  
    static actualizarRestante({ restante }) {
      DOM.restante.textContent = restante;
    }
  
    static mostrarAlerta(mensaje, tipo = 'success') {
      const div = document.createElement('div');
      div.className = `alert alert-${tipo} text-center`;
      div.textContent = mensaje;
      document.querySelector('.primario').insertBefore(div, DOM.formulario);
      setTimeout(() => div.remove(), 3000);
    }
  
    static actualizarEstadoPresupuesto({ presupuesto, restante }) {
      // Limpiar clases
      DOM.restanteContainer.classList.remove('alert-danger', 'alert-warning', 'alert-success');
  
      // Estado del botón
      DOM.btnSubmit.disabled = restante <= 0;
  
      // Color según nivel
      const clase = 
        restante <= 0 ? 'alert-danger' :
        restante <= presupuesto / 4 ? 'alert-danger' :
        restante <= presupuesto / 2 ? 'alert-warning' : 'alert-success';
      
      DOM.restanteContainer.classList.add(clase);
    }
  }
  
  // ============ CONTROLADOR ============
  class GastoController {
    constructor() {
      this.model = null;
      this.iniciarApp();
    }
  
    iniciarApp() {
      const presupuestoUsuario = Number(prompt('¿Cuál es tu presupuesto?'));
      
      if (!presupuestoUsuario || presupuestoUsuario <= 0) {
        window.location.reload();
        return;
      }
  
      this.model = new PresupuestoModel(presupuestoUsuario);
      this.configurarEventos();
      this.actualizarVista();
    }
  
    configurarEventos() {
      DOM.formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        this.agregarGasto();
      });
  
      DOM.listaGastos.addEventListener('click', (e) => {
        if (e.target.classList.contains('borrar-gasto')) {
          const id = Number(e.target.closest('li').dataset.id);
          this.eliminarGasto(id);
        }
      });
    }
  
    agregarGasto() {
      const nombre = DOM.inputGasto.value.trim();
      const cantidad = Number(DOM.inputCantidad.value);
  
      if (!nombre || !cantidad) {
        GastoView.mostrarAlerta('Ambos campos son obligatorios', 'error');
        return;
      }
  
      if (cantidad <= 0 || isNaN(cantidad)) {
        GastoView.mostrarAlerta('Cantidad no válida', 'error');
        return;
      }
  
      this.model.agregarGasto({ nombre, cantidad });
      this.actualizarVista();
      GastoView.mostrarAlerta('Gasto agregado');
      DOM.formulario.reset();
    }
  
    eliminarGasto(id) {
      this.model.eliminarGasto(id);
      this.actualizarVista();
      GastoView.mostrarAlerta('Gasto eliminado');
    }
  
    actualizarVista() {
      GastoView.mostrarGastos(this.model.gastos);
      GastoView.actualizarRestante(this.model);
      GastoView.actualizarEstadoPresupuesto(this.model);
    }
  }
  
  // ============ INICIALIZACIÓN ============
  document.addEventListener('DOMContentLoaded', () => new GastoController());