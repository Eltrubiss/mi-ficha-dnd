// Este objeto contendrá todas las reglas de nuestro juego
let libroDeReglas = {
  razas: [
    {
      id: "humano",
      nombre: "Humano",
      descripcion: "Los humanos son la raza más común en el mundo de fantasía. Son versátiles y adaptables, lo que les permite destacar en cualquier clase o profesión.",
      velocidad: 30,
      rasgos: [
        {
            nombre: "Rasgos Humanos",
            descripcion: "Considera los siguientes rasgos para tu humano: <br>  ### Atributos Humanos <br> **Edad**: Los humanos alcanzan la madurez a los 15 años y viven hasta los 80 años. <br> - **Tamaño**: Mediano."
        },
        {
          nombre: "Mejora de Características del Humano",
          descripcion: "+1 a todas las características.",
          efectos: [
            { tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "DES", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "SAB", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "CAR", valor: 1 }
          ]
        }
      ]
    },
    {
      id: "elfo",
      nombre: "Elfo",
      descripcion: "Como las ramas de un árbol joven, los elfos son flexibles frente al peligro. Confían en que la diplomacia y la negociación permitirán acabar con las diferencias antes de llegar a las manos. Se sabe que han llegado a retirarse ante incursiones contra sus hogares en el bosque, confiados en la seguridad de que pueden limitarse a esperar a que los invasores se marchen. No obstante, cuando la necesidad apremia, los elfos muestran su lado más severo y marcial, haciendo gala de su habilidad con la espada, el arco y la estrategia.",
      velocidad: 30,
      rasgos: [
        {
            nombre: "Rasgos Élficos",
            descripcion: "Considera los siguientes rasgos para tu elfo: <br>  ### Atributos Élficos <br> **Edad**:  Aunque los elfos alcanzan la madurez aproximadamente a la misma edad que los humanos, la concepción de la mayoría de edad de los elfos va más allá del crecimiento e incluye la experiencia vital. Los elfos suelen llegar a la edad adulta y recibir su nuevo nombre tras unos cien años y pueden llegar a vivir hasta setecientos cincuenta. <br> **Idiomas**: Puedes hablar, leer y escribir en común y elfo. El idioma elfo es fluido, con entonaciones sutiles y una gramática compleja. La literatura élfica es rica y variada, y sus canciones y poemas son famosos entre el resto de razas. Muchos bardos aprenden este idioma para poder añadir baladas élficas a sus repertorios.  <br>**Tamaño**: Mediano."
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcion: "Acostumbrados a la penumbra de los bosques y el cielo nocturno, puedes ver bien en la oscuridad o con poca luz. Hasta a un máximo de 60 pies, eres capaz de ver con luz tenue como si hubiera luz brillante y en la oscuridad como si hubiera luz tenue. Eso sí, no puedes distinguir colores en la oscuridad, solo tonos de gris.",
          efectos: [
            { tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }
          ]
        },
        {
          nombre: "Sentidos Agudos",
          descripcion: "Eres competente en la habilidad Percepción.",
          efectos: [
            { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Percepción", valor: 1 }
          ]
        },
        {
            nombre: "Linaje Feérico.",
            descripcion: "Tienes ventaja en las tiradas de salvación para evitar ser hechizado y la magia no puede dormirte."
        },
        {
            nombre: "Trance.",
            descripcion: " Los elfos no necesitan dormir. Meditan profundamente, en un estado semiconsciente, durante 4 horas al día. La palabra en común para referirse a esta meditación es «trance». Mientras meditas, experimentas algo parecido a sueños, que en realidad son ejercicios mentales que se han vuelto automáticos tras años de práctica. Este trance es suficiente para obtener los mismos beneficios que un humano recibe de 8 horas de sueño. "
        }
      ]
    },
    {
      id: "semiorco",
      nombre: "Semiorco",
      descripcion: "Los orcos son una raza de humanoides brutales y agresivos que a menudo se asocian con la destrucción y el caos. Son conocidos por su fuerza física, resistencia y habilidades de combate, lo que los convierte en adversarios formidables en el campo de batalla. A pesar de su reputación como criaturas malvadas, los orcos también tienen una cultura rica y compleja, con sus propias tradiciones, creencias y formas de vida.",
      velocidad: 30,
      rasgos: [
        {
            nombre: "Rasgos de Semiorco",
            descripcion: "Considera los siguientes rasgos para tu Semiorco <br> ### Atributos Semiorcos <br> **Edad**: Los semiorcos maduran un poco más rápido que los humanos, llegando a la madurez en torno a los 14 años. Tambien envejecen más rápido y rara vez viven más de 75 años. <br>**Idiomas**: Puedes hablas, leer y escribir en común y en orco. El orco es un idioma áspero y severo, con consonantes duras. No tiene escritura propia, pero para transcribirlo se usa el alfabeto enano. <br>**Tamaño**: Los semiorcos son ligeramente más altos y corpulentos que los humanos, midiendo desde 5 hasta bastante por encima de los 6 pies de altura. Eres tamaño Mediano."
        },
        {
            nombre: "Mejora de Características del Semiorco",
            descripcion: "Tu puntuación de Fuerza aumenta en 2 y tu puntuación de Constitución aumenta en 1.",
            efectos: [
                { tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 2 },
                { tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 1 },
            ]
        }
      ]
    }
  ],
  clases: [
    {
      id: "barbaro", // Usamos minúsculas y sin tildes para buscar más fácil
      nombre: "Bárbaro",
      dadoDeGolpe: 12, // El bárbaro usa un d12
      competencias: {
        salvaciones:   ["FUE", "CON"],
        habilidades:   ["Atletismo", "Intimidación"],
        armas:         {
          descripcion: "Armas simples y marciales",
          competencias: ["armasSimples", "armasMarciales"]
        },
        armaduras:     {
          descripcion: "Ligeras, medias, escudos",
          competencias: ["ligera", "media", "escudo"]
        },
        herramientas:  "Ninguna",
        idiomas:       []   // los idiomas van en razaElegida.idiomas
      },
      rasgos: [
        {
          nombre: "Competencias iniciales",
          nivelClase: 1
        },
        {
          nombre: "Defensa sin Armadura",
          descripcion: "Si no estás portando armadura alguna, tu Clase de Armadura será 10 + tu modificador de Destreza + tu modificador de Constitución. Podras usar escudo sin tener que renunciar a este beneficio.",
          nivelClase: 1,
          efectos: [
            { tipoDeEfecto: "caSinArmadura",
              base: 10,
              modificadores: ["DES", "CON"],
              condicion: {sinArmadura:true, sinEscudo: false} }
          ]
        },
        {
          nombre: "Furia",
        }
      ]
    },
    {
      id: "guerrero",
      nombre: "Guerrero",
      dadoDeGolpe: 10
    },
    {
      id: "monje",
      nombre: "Monje",
      dadoDeGolpe: 8,
      rasgos: [
        {
          nombre: "Defensa sin Armadura",
          descripcion: "Si no estás portando armadura alguna ni embrazando un escudo, tu Clase de Armadura será 10 + tu modificador de Destreza + tu modificador de Sabiduría.",
          nivelClase: 1,
          efectos: [
            { tipoDeEfecto: "caSinArmadura",
              base: 10,
              modificadores: ["DES", "SAB"],
              condicion: {sinArmadura:true, sinEscudo: true} }
          ]
        },
        {
          nombre: "Movimiento sin Armadura",
          descripcion: "Si no estás portando armadura alguna ni embrazando un escudo, tu velocidad aumenta en 10 pies.",
          nivelClase: 2,
          efectos: [
            { tipoDeEfecto: "bono_velocidad", valor: 10, condicion: {sinArmadura:true, sinEscudo: true} }
          ]
        }
      ]
    }
  ],
  armaduras: [
    {
      id: "cuero",
      nombre: "Armadura de Cuero",
      tipo: "ligera",
      caBase: 11
    },
    {
      id: "mediaArmadura",
      nombre: "Armadura Media",
      tipo: "media",
      caBase: 15
    }
  ],
  equipo: [
    {
      id: "escudonormal",
      nombre: "Escudo",
      tipo: "escudo",
      bonifCA: 2
    }
  ]
};

console.log("Mi libro de reglas:", libroDeReglas);