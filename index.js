/**
* Variables de configuración del juego
*/

const opciones = {
	top_left: {
		id: "top_left"
	},
	top_right: {
		id: "top_right"
	},
	bottom_left: {
		id: "bottom_left"
	},
	bottom_right: {
		id: "bottom_right"
	},
};



const estadoJuego = {
	intervalos:{
		inicio:1000,
		paso:500
	},
	segundosInicio: 3,
	interaciones: false,
	secuenciaJuego: [],
	secuenciaUsuario: [],
	nivelJuego: 0,
	nivelUsuario: 0,
	opciones,
};

/**
* Referencias del DOM
*/

const botonesDelJuego = document.querySelectorAll(".simon-button");

/**
 * metodos de ayuda p interactuar con los elementos
 */
const activarElemento=(elementoDom)=>{
	elementoDom.classList.add("active");
};

const mostrarElemento=(elementoDom)=>{
	elementoDom.classList.add("show");
	elementoDom.classList.remove("hide");
};

const desactivarElemento=(elementoDom)=>{
	elementoDom.classList.remove("active");
};

const ocultarElemento=(elementoDom)=>{
	elementoDom.classList.add("hide");
	elementoDom.classList.remove("show");
	
};

const activarElementos=(elementos)=>{
	elementos.forEach(activarElemento);
};

const desactivarElementos=(elementos)=>{
	elementos.forEach(desactivarElemento);
};

const obtenerElementoDom=(id)=>{
	return window.document.getElementById(id);
} ;

 /**
  * interacciones
  */

  const activarInteracciones=()=>{
	  const elementoApp= obtenerElementoDom("app");
	  elementoApp.classList.remove("app-background-dark");

	  const elementoTexto = obtenerElementoDom("turno_texto");
	  mostrarElemento(elementoTexto);
	  elementoTexto.textContent= "Tu turno";

	  estadoJuego.interaciones=true;

	 

  };

  const desactivarInteracciones=()=>{
	  const elementoApp= obtenerElementoDom("app");
	  elementoApp.classList.add("app-background-dark");

	  const elementoTexto= obtenerElementoDom("turno_texto");
	  ocultarElemento(elementoTexto);

	  
	 estadoJuego.interaciones=false;

	 

  };

/**
 * Accion modal para iniciar el juego
 */
const accionModalInicio= () =>{
	//obtener nombre del jugador
	const inputDom= obtenerElementoDom("nombre_jugador");
	const nombreJugador = inputDom.value;

	//se valida q se haya cargado algun dato
	const permitirAcceso= nombreJugador.length;
	if(permitirAcceso){
		//se ocula el modal de incio
		const elementoModalInicio = obtenerElementoDom("inicio_juego");
		ocultarElemento(elementoModalInicio);

		//muestra el nombre en pantalla y guarda nombre
		const elementoNombre = obtenerElementoDom("nombre_usuario");
		elementoNombre.textContent = nombreJugador;
		window.localStorage.setItem("nombre", nombreJugador);

		//se comienza el juego
		inicializacion();
	}

};


 /**
  * Accion modal para reiniciar el juego
  */

const accionModalFin = ()=>{
	//se oculta el modal fin del juego
	const elementoModalFin = obtenerElementoDom("fin_juego");
	ocultarElemento(elementoModalFin);

	//se comienza el juego
	inicializacion();
};


/** 
 * Acción salir del juego
 */

const accionSalir = () => {
	const salir= confirm("¿Estas seguro que deseas salir?");
	  if (salir == true) {
		  window.close();
	  } else {
		  salir= null;
	  };
  
  };




const clickBoton = (id) => {

	if(!estadoJuego.interaciones){
		return;
	}
	//se guarda en la secuencia del usuario el Id seleccionado
	estadoJuego.secuenciaUsuario.push(id);

	const secuenciaJuegoEstaEtapa = estadoJuego.secuenciaJuego[estadoJuego.nivelUsuario];
	const secuenciaUsuarioEstaEtapa = estadoJuego.secuenciaUsuario[estadoJuego.nivelUsuario];

	//se compararn las secuencias del juego y de usuario
	if(secuenciaUsuarioEstaEtapa === secuenciaJuegoEstaEtapa){
		//se incrementa el nivel del usuario y da inicio a la sig reproduccion
		estadoJuego.nivelUsuario = estadoJuego.nivelUsuario +1;
		//se muestra nivel acutal
		const nivelDom = obtenerElementoDom("nivel");
    	nivelDom.textContent = `Nivel: ${estadoJuego.nivelJuego}`;

	} else{
		//se oculta el juego
		const ocultarJuego= obtenerElementoDom("juego");
		ocultarElemento(ocultarJuego);

		//se desactivan las interacciones
		desactivarInteracciones();

		//se muestra modal de fin
		const elementoModalFin = obtenerElementoDom("fin_juego");
		mostrarElemento(elementoModalFin);

		//mostrar puntaje
		const puntaje= obtenerElementoDom("puntaje");
		puntaje.textContent=`Tu puntaje es ${estadoJuego.nivelJuego}`;

		return;

	};

	//se verifica si el uruario y el juego estan en 0
	if(estadoJuego.nivelJuego===estadoJuego.nivelUsuario){
		desactivarInteracciones();

		//se resetea la secuencua de usuario
		estadoJuego.secuenciaUsuario=[];

		//se resetea el nivel de usuario
		estadoJuego.nivelUsuario=0;

		//se reproduce una nueva secuencia
		reproducirSecuencia();

	}
};

	

const obtenerElementoAleatorio = () => {
	const opcionesIds= Object.keys(estadoJuego.opciones);
	const idAleatorio = opcionesIds[Math.floor(Math.random() * opcionesIds.length)];
	return estadoJuego.opciones[idAleatorio];

	

};

const reproducirSecuencia = () => {
	let paso=0;
	//agregar un Id a la secuencia y se incrementa la secuencia de juego
	estadoJuego.secuenciaJuego.push(obtenerElementoAleatorio().id);
	estadoJuego.nivelJuego = estadoJuego.nivelJuego + 1;

	//se define intervalo para mostrar y ocultar los elementos de la secuencia
	const intervalo = setInterval(()=>{
		//se define una variable para generar una pausa
		const pausaPaso = (paso % 2) === 1;
		const finReproduccion = paso === (estadoJuego.secuenciaJuego.length * 2);

		if(pausaPaso){
			//se desactivan todos los botones del juego
			desactivarElementos(botonesDelJuego);
			//se incrementa un paso
			paso= paso + 1;

			return;
		};

		if(finReproduccion){
			//se elimina intervalo
			clearInterval(intervalo);

			//se desactivan los botones
			desactivarElementos(botonesDelJuego);

			//se activan las interacciones del usuario
			activarInteracciones();

			return;
		};

		const id = estadoJuego.secuenciaJuego[paso/2];
		const refereciaDom = obtenerElementoDom(id);
		activarElemento(refereciaDom);

		//se incrementa un paso
		paso= paso + 1;
		
	}, estadoJuego.intervalos.paso);

	
};

const inicializacion = () => {
	//variable segundos antes de comenzar juego
	let segundosInicio= estadoJuego.segundosInicio;

	//se resetea el juego
	estadoJuego.secuenciaJuego=[];
	estadoJuego.secuenciaUsuario=[];
	estadoJuego.nivelJuego=0;
	estadoJuego.nivelUsuario=0;

	//mostrar el juego
	const elementoJuego= obtenerElementoDom("juego");
	mostrarElemento(elementoJuego);

	//se actualiza el contador HTML
	const cuentaRegresiva = obtenerElementoDom("cuenta_regresiva");
	mostrarElemento(cuentaRegresiva);
	cuentaRegresiva.textContent=segundosInicio;

	//se define un intervalo por el tiempo antes de comenzar juego
	const intervalo = setInterval(()=>{
		//se descuenta un segundo
		segundosInicio= segundosInicio-1;

		//se actualiza el contador HTML
		cuentaRegresiva.textContent = segundosInicio;

		if(segundosInicio ===0){
			//se oculta el HTML
			ocultarElemento(cuentaRegresiva);

			//se reproduce secuenta
			reproducirSecuencia();

			//se elimina intervalo
			clearInterval(intervalo);
		};

	}, estadoJuego.intervalos.inicio);

	

};

const nombreJugadorStorage = window.localStorage.getItem("nombre");
const elementoNombre = obtenerElementoDom("nombre_jugador");
elementoNombre.value= nombreJugadorStorage || "";

