// 1. Nuestros datos (El Objeto)
let miPersonaje = {
  nombre: "Thogar",
  raza: "Semiorco",
  subraza: "",
  clase1: "Bárbaro",
  nivel_clase1: 1,
  clase2: "",
  nivel_clase2: 0,
  nivel_personaje: 1,
  FUE: 16,
  DES: 14,
  CON: 17,
  INT: 9,
  SAB: 11,
  CAR: 13,
  puntosDeGolpe: 15
};

// 2. Nuestra acción (La Función)
/**
 * @param {Object} personaje
 * @param {string} claseElegida
 * @param {Object} rasgo
 */
function subirDeNivel(personaje, claseElegida) {
  personaje.nivel_personaje = personaje.nivel_personaje + 1;
  
  if (personaje.clase1 === claseElegida) {
    personaje.nivel_clase1 = personaje.nivel_clase1 + 1;
  } else if (personaje.clase2 === claseElegida) {
    personaje.nivel_clase2 = personaje.nivel_clase2 + 1;
  } else if (personaje.clase2 === "") {
    personaje.clase2 = claseElegida;
    personaje.nivel_clase2 = 1;
  }
}

let rasgoRacial = {
  nombre: "Fuerza de la Sangre",
  tipoDeEfecto: "bono_stat",
  statAfectada: "FUE",
  valorDelBono: 2
};

function aplicarRasgo(personaje, rasgo) {
  
  // Verificamos si el rasgo es del tipo que da bonos a las estadísticas
  if (rasgo.tipoDeEfecto === "bono_stat") {
    
    // Guardamos en una variable temporal qué stat vamos a tocar (ej: "FUE")
    let statQueSube = rasgo.statAfectada; 
    
    // Usamos el truco de los corchetes para sumarle el bono dinámicamente!
    // Esto se traduce como: personaje["FUE"] = personaje["FUE"] + 2;
    personaje[statQueSube] = personaje[statQueSube] + rasgo.valorDelBono;
    
    console.log("¡Se aplicó el rasgo: " + rasgo.nombre + "!");
  }
}

// 3. Ejecutamos la función pasándole a Thogar y el rasgo racial
aplicarRasgo(miPersonaje, rasgoRacial);

// 4. Imprimimos para ver cómo quedó Thogar ahora
console.log("Datos de Thogar actualizados:", miPersonaje);