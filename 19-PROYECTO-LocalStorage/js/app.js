//Variables
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets')
let tweets = []; //Array vacio para almacenar los tweets

//Even listeners

eventListeners();

function eventListeners() {
    //Cuando el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    //Cuando el documento esta listo
    document.addEventListener('DOMContentLoaded', () =>{
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];
        
        console.log(tweets);

        crearHtml();
    })
}

//Funciones

function agregarTweet(e) {
    e.preventDefault();

    //Textarea donde el usuario escribe
    const tweet = document.querySelector('#tweet').value;

    //Validacion

    if(tweet === '') {
        mostrarError('Un mensaje no puede ir vacio');

        return;//Evita que se ejecuten más lineas de código
    }

    const tweetObj = {
        id: Date.now(),
        tweet //Si tanto llave como valor se llaman igual se puede solo poner uno de los dos (tweet: tweet pasa a solo tweet)
    }

    //Añadir al arreglo de tweets
    tweets = [...tweets, tweetObj];

    //Una vez agragado vamos a crear el html
    crearHtml();

    //Reiniciar el formulario
    formulario.reset();
}

//Mostrar mensaje de error
function mostrarError(error) {
    const mensajeError = document.createElement('P');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    //Insertarlo en el contenido
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    //Elimina la alerta despues de 3 segundos
    setTimeout(() =>{
        mensajeError.remove()
    }, 3000);
}

//Muestra un listado de los tweets
function crearHtml(){

    limpiarHTML();

    if(tweets.length > 0) {
        tweets.forEach(tweet => {
            //Agregar un boton de eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.innerText = 'X';
            
            //Añadir la función de eliminar
            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            }
            
            //Crear html
            const li = document.createElement('li');

            //Añadir el texto
            li.innerText = tweet.tweet;

            //Asignar el botón
            li.appendChild(btnEliminar);

            //insertarlo en el html
            listaTweets.appendChild(li);
        });
    }

    sincronizarStorage();
}

//Agrega los tweets actuales a LocalStorage
function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

//Elimina un tweet
function borrarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id != id);
    
    crearHtml();
}

//Limpiar el html
function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}