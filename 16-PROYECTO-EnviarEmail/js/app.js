document.addEventListener('DOMContentLoaded', function(){

    const email = {
        email: '',
        cc: '',
        asunto: '',
        mensaje: ''
    }

    //Seleccionar los elementos de la interfaz
    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const formulario = document.querySelector('#formulario');
    const btnSubmit = document.querySelector('#formulario button[type="submit"]');
    const btnReset = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector('#spinner');

    const divCc = document.createElement('DIV');
    divCc.classList.add('flex', 'flex-col', 'space-y-2');

    const labelCc = document.createElement('LABEL')
    labelCc.setAttribute('for', 'email');
    labelCc.classList.add('font-regular', 'font-medium');
    labelCc.textContent = 'Email Cc (Opcional';

    const inputCc = document.createElement('INPUT');
    inputCc.classList.add('border', 'border-gray-300', 'px-3', 'py-2', 'rounded-lg');
    inputCc.setAttribute('id', 'cc');
    inputCc.setAttribute('type', 'email');
    inputCc.setAttribute('placeholder', 'Email destino');
    inputCc.setAttribute('name', 'email');

    divCc.appendChild(labelCc);
    divCc.appendChild(inputCc);
    formulario.insertBefore(divCc, inputAsunto.parentElement);
    

    //Asignar eventos
    inputEmail.addEventListener('input', validar);

    if (inputCc) {//Si el campo CC existe, asignamos el evento ya que se trata de un campo opcional
        inputCc.addEventListener('input', validar);
    }

    inputAsunto.addEventListener('input', validar);

    inputMensaje.addEventListener('input', validar);

    formulario.addEventListener('submit', enviarEmail)

    btnReset.addEventListener('click', function(e) {
        e.preventDefault();

        resetFormulario();
    })

    function enviarEmail(e) {
        e.preventDefault();

        spinner.classList.add('flex');
        spinner.classList.remove('hidden');

        setTimeout(() => {
            spinner.classList.remove('flex');
            spinner.classList.add('hidden');

            resetFormulario();

            //Crear una alerta
            const alertaExito = document.createElement('P');
            alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounder-lg','mt-10', 'font-bold', 'text-sm', 'uppercase');
            alertaExito.textContent = 'Mensaje enviado correctamente';

            formulario.appendChild(alertaExito);

            setTimeout(() => {
                alertaExito.remove();
            }, 3000);
        }, 3000);
    }

    function validar(e) {
        if (e.target.value.trim() === '' && e.target.id !== 'cc') { //.trim elimina los espacios en blanco
            mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement); //Asi reacciona en funcion del id del campo
            email[e.target.name] = '';
            comprobarEmail();
            return; //Detiene la ejecución del código
        }

        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('El email no es válido', e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        }

        //Validación para el campo CC (opcional)
        if(e.target.id === 'cc' && e.target.value.trim() !== '') {
            if (!validarEmail(e.target.value)) {
                mostrarAlerta('El email de CC no es válido', e.target.parentElement);
                email[e.target.name] = '';
                comprobarEmail();
                return;
            }
        }

        limpiarAlerta(e.target.parentElement);

        //Asignar los valores
        if (e.target.id !== 'cc' || e.target.value.trim() !== '') {
            email[e.target.name] = e.target.value.trim().toLowerCase();
        }

        //Comprobar el objeto de email
        comprobarEmail();
    }

    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia);
    
        //Generar alerta en HTML
        const error = document.createElement('P');
        error.textContent = mensaje;
        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center');
        
        //Inyectar el error al formulario 
        //Si lo haces con innerHtml limpias lo que tienes
        referencia.appendChild(error);
    }

    function limpiarAlerta(referencia) {
        //Comprueba si ya existe una alerta
        //Se usa referencia para encontrar exactamente el input que activa el evento
        const alerta = referencia.querySelector('.bg-red-600');//Se usa la clase que contiene las alertas
        if(alerta) {
            alerta.remove();
        }
    }

    function validarEmail(email) {
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
        const resultado = regex.test(email);
        return resultado;
    }

    function comprobarEmail() {
        if (email.email === '' || email.asunto === '' || email.mensaje === '') {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            return;
        }
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
        }

        function resetFormulario () {
        //reiniciar el objeto
        email.email = '';
        email.cc = '';
        email.asunto = '';
        email.mensaje = '';

        formulario.reset();
        comprobarEmail();
        }
});

//Reto: Añade un campo extra llamado CC; para añadir un destinatario extra
//Ese campo no es obligatorio; pero en caso de tener información debes validar que se un email valido
//Este reto toma alrededor de unos 20 minutos



