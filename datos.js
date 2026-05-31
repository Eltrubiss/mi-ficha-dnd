// Este objeto contendrá todas las reglas de nuestro juego
let libroDeReglasBasicas = {
  razas: [
    {
      id: "humano",
      nombre: "Humano",
      descripcion: "Los humanos son la raza más común en el mundo de fantasía. Son versátiles y adaptables, lo que les permite destacar en cualquier clase o profesión.",
      velocidad: 30,
      rasgos: [
        {
            nombre: "Rasgos Humanos",
            descripcionResum: "Considera los siguientes rasgos para tu humano: Edad, Idioma, Tamaño.",
            descripcion: `
              Considera los siguientes rasgos para tu humano: <br> 
              <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Humanos</h4>
              <ul style="margin-top: 5px;">
                <li><strong>Edad</strong>: los humanos alcanzan la madurez cerca de la veintena y rara vez llegan a vivir un siglo completo. </li>
                <li><strong>Idioma</strong>: Puedes hablar, leer y escribir en común y un idioma adicional de tu elección. </li>
                <li><strong>Tamaño</strong>: los humanos varían mucho en cuanto a altura y constitución, desde aproximadamente los 5 a los 6 pies de alto. Independientemente de tu altura, tu tamaño es Mediano. </li>
              </ul>
            `
        },
        {
          nombre: "Mejora de Características del Humano",
          descripcionResum: "+1 a todas las características.",
          descripcion: `
          Tu puntuación de todas tus características aumenta en 1.
          `,
          efectos: [
            { tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "DES", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "SAB", valor: 1 },
            { tipoDeEfecto: "bono_stat", statAfectada: "CAR", valor: 1 }
          ]
        }
      ],
      subrazas: [

      ]
    },
    {
      id: "elfo",
      nombre: "Elfo",
      descripcion: "Los elfos son un pueblo mágico de gracia sobrenatural, viviendo en el mundo sin ser del todo parte de él. Viven en lugares de etérea belleza, en medio de antiguos bosques o en plateados minaretes que resplandecen con luz feérica, donde una suave música flota en el aire y delicadas fragancias son transportadas por la brisa. Los elfos aman la naturaleza y la magia, el arte y la maestría, la música y la poesía, y las cosas buenas del mundo.",
      velocidad: 30,
      rasgos: [
        {
            nombre: "Rasgos Élficos",
            descripcionResum: "Considera los siguientes rasgos para tu elfo: Edad, Idiomas y Tamaño.",
            descripcion: `
              Considera los siguientes rasgos para tu elfo: <br>
              <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Élficos</h4>
              <ul style="margin-top: 5px;">
                <li><strong>Edad</strong>:  aunque los elfos alcanzan la madurez física más o menos a la misma edad que los humanos, la comprensión élfica de la adultez va más allá del crecimiento físico y abarca la experiencia del mundo. Un elfo típicamente reclama la edad adulta y un nombre adulto alrededor de los 100 años y puede vivir hasta los 750. </li>
                <li><strong>Idiomas</strong>: Puedes hablar, leer y escribir en común y elfo. El idioma elfo es fluido, con entonaciones sutiles y una gramática compleja. La literatura élfica es rica y variada, y sus canciones y poemas son famosos entre el resto de razas. Muchos bardos aprenden este idioma para poder añadir baladas élficas a sus repertorios.  </li>
                <li><strong>Tamaño</strong>:  la estatura de los elfos varía entre los menos de 5 pies y los más de 6 y tienen complexiones esbeltas. Tu tamaño es Mediano. </li>
              </ul>
             `
        },
        {
          nombre: "Mejora de Características del Elfo",
          descripcionResum: "+2 a puntuación de Destreza",
          descripcion: `
          Tu puntuación de Destreza aumenta en 2.
          `,
          efectos: [
            { tipoDeEfecto: "bono_stat", statAfectada: "DES", valor: 2 }
          ]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Tienes visión en la oscuridad hasta una distancia de 60 pies.",
          descripcion: `Acostumbrado a los bosques iluminados por el crepúsculo y el cielo nocturno, tienen una visión superior en la oscuridad y la luz tenue. 
            <br>
            Puedes ver en luz tenue hasta los 60 pies como si fuera a plena luz, y en la oscuridad como si fuera en luz tenue.
            <br>
             Sin embargo, no puedes distinguir colores en la oscuridad, sólo tonos de gris.
          `,
          efectos: [
            { tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }
          ]
        },
        {
          nombre: "Sentidos Agudos",
          descripcionResum: "Eres competente en la habilidad Percepción.",
          descripcion: `Eres competente en la habilidad <strong>Percepción</strong>. `,
          efectos: [
            { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Percepción", valor: 1 }
          ]
        },
        {
            nombre: "Linaje Feérico.",
            descripcionResum: "Tienes ventaja en las tiradas de salvación para evitar ser hechizado y la magia no puede dormirte.",
            descripcion: `Tienes ventaja en las tiradas de salvación para evitar ser hechizado y la magia no puede dormirte.`
        },
        {
            nombre: "Trance.",
            descripcionResum: "Los elfos no necesitan dormir. Para descansar, entran en Trance...",
            descripcion: `los elfos no necesitan dormir. En lugar de eso ,meditan profundamente, permaneciendo semiconscientes durante 4 horas al día. (La palabra en Común para tal meditación es “trance.”) Mientras meditas, puedes soñar en cierta manera; tales sueños son en realidad ejercicios mentales que se han convertido en un reflejo a lo largo de años de práctica. Tras descansar de esta manera, obtienes el mismo beneficio que un humano tras 8 horas de sueño. `
        }
      ],
      subrazas: [
        {
          id: "altoelfo",
          nombre: "Alto Elfo",
          descripcion: "Como alto elfo, tienes una mente afilada y la maestría sobre al menos los rudimentos de la magia. En muchos de los mundos de D&D hay dos tipos de altos elfos. Un tipo (que incluye los elfos grises y elfos de los valles de Greyhawk, los Silvanesti de Dragonlance y los elfos solares de los Reinos Olvidados) son altivos y aislacionistas, creyéndose superiores a los no-elfos e incluso al resto de elfos. El otro tipo (incluyendo a los altos elfos de Greyhawk, los Qualinesti de Dragonlance y los elfos lunares de los Reinos Olvidados) son más comunes y más amistosos, y a menudo se les encuentra entre humanos y otras razas.",
          rasgos: [
            {
              nombre: "Mejora de Características del Alto Elfo",
              descripcionResum: "+1 a puntuación de Inteligencia",
              descripcion: `
              Tu puntuación de Inteligencia aumenta en 1.
              `,
              efectos: [
                { tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 1 }
              ]
            },
            {
              nombre: "Entrenamiento en Armas élficas",
              descripcionResum: "Eres competente con las espadas largas, las espadas cortas, los arcos cortos y los arcos largos.",
              descripcion: `Eres competente con las espadas largas, las espadas cortas, los arcos cortos y los arcos largos.`,
              efectos:[
                { tipoDeEfecto: "bono_arma", armaAfectada: "espadaLarga", valor: 1 },
                { tipoDeEfecto: "bono_arma", armaAfectada: "espadaCorta", valor: 1 },
                { tipoDeEfecto: "bono_arma", armaAfectada: "arcoCorto", valor: 1 },
                { tipoDeEfecto: "bono_arma", armaAfectada: "arcoLargo", valor: 1 }
              ]
            },
            {
              nombre: "Trucos",
              descripcionResum: "Conoces un truco a tu elección de la Lista de Conjuros de Mago.",
              descripcion: `Conoces un truco a tu elección de la Lista de Conjuros de Mago. Inteligencia es tu habilidad de conjuro para este truco.`,
              efectos: [

              ]
            },
            {
              nombre: "Lenguaje adicional",
              descripcionResum: "Puedes hablar, leer y escribir un idioma adicional de tu elección.",
              descripcion: `Puedes hablar, leer y escribir un idioma adicional de tu elección.`,
            }
          ]
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
  opcionesCompartidas: {
    estilosCombate: [
      {
        id: "arqueria",
        nombre: "Arquería",
        descripcionResum: "+2 a las tiradas de ataque con armas a distancia.",
        descripcion: `
          Obtienes un bonificador +2 a las tiradas de ataque que hagas
          con armas a distancia.
        `,
        efectos: [
          {
            tipoDeEfecto: "bono_ataque",
            valor: 2,
            condicion: { etiqueta: "distancia" }
          }
        ]
      },
      {
        id: "defensa",
        nombre: "Defensa",
        descripcionResum: "Mientras lleves puesta una armadura: +1 a la CA",
        descripcion: `
          Mientras lleves puesta una armadura, sea cual sea, ganas un +1 la CA.
        `,
        efectos: [
          {
            tipoDeEfecto: "bonifCA",
            valor: 1,
            condicion: { usaArmadura: true }
          }
        ]
      },
      {
        id: "duelista",
        nombre: "Duelista",
        descripcionResum: "Si llevas solo un arma en una mano: +2 al ataque",
        descripcion: `
          Cuando llevas un arma en una mano y ningún arma más, ganas un bono de +2 a las tiradas de daño con ese arma.
        `,
        efectos: [
          {
            tipoDeEfecto: "bono_ataque",
            valor: 2,
            condicion: { etiqueta: "una-mano" }
          }
        ]
      },
      {
        id: "a_dos_manos",
        nombre: "Lucha con Arma a Dos Manos",
        descripcionResum: "Cuando sacas un 1 o un 2 en una tirada de daño con un arma a dos manos, puedes..",
        descripcion: `
          Cuando sacas un 1 o un 2 en una tirada de daño con un arma a dos manos, puedes volver a realizar la tirada de daño y deberás usar la nueva tirada, incluso si la nueva tirada vuelve a ser un 1 o un 2. El arma debe ser un arma a dos manos o tener la propiedad versátil para ganar este beneficio.
        `
      },
      {
        id: "proteccion",
        nombre: "Protección",
        descripcionResum: "Puedes interponerte en un ataque para dar desventaja a la tirada.",
        descripcion: `
          Cuando una criatura que puedes ver ataca a un objetivo que no eres tú y está a 5 pies o menos de ti. Puedes usar tu reacción para hacer que el enemigo tenga desventaja en la tirada de ataque. Debes estar usando un escudo.
        `
      },
      {
        id: "dos_armas",
        nombre: "Lucha con Dos Armas",
        descripcionResum: "Puedes añadir tu modificador de características a un segundo ataque.",
        descripcion:`
          Cuando luchas con dos armas con la propiedad "ligera", puedes añadir tu modificador de caracterísica al daño del ataque de tu acción adicional.
        `
      }
    ]
  },
  clases: [
    {
      id: "barbaro",
      nombre: "Bárbaro",
      dadoDeGolpe: 12,
      competencias: {
        salvaciones:   ["FUE", "CON"],
        habilidades:   [],
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
              condicion: {sinArmadura:true, sinEscudo: false,nivelClase: 1} }
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
      dadoDeGolpe: 10,
      competencias:{
        salvaciones:   ["FUE", "CON"],
        armas:         {
          descripcion: "Armas simples y marciales",
          competencias: ["armasSimples", "armasMarciales"]
        },
        armaduras: {
          descripcion: "Armaduras ligeras, medianas, pesadas y escudos",
          competencias: ["ligera", "media", "pesada", "escudo"]
        },
        herramientas: "Ninguna",
        idiomas: []
      },
      rasgos: [
        {
          id: "competencias_iniciales_guerrero",
          nombre: "Competencias Iniciales",
          nivelClase: 1,
          requisitos: "Nivel 1",
          descripcionResum: "Obtienes las siguientes competencias:...",
          descripcion: `
          Obtienes las siguientes competencias:
          <br>
              <ul style="margin-top: 5px;">
                <li><strong>Salvaciones</strong>: Ganas competencias en las Tiradas de Salvación de Fuerza y Constitución. </li>
                <li><strong>Habilidades</strong>: Escoje dos entre: Acrobacias, Atletismo, Historia, Intimidación, Trato con animales, Percepción, Perspicacia, Supervivencia. </li>
                <li><strong>Armas</strong>: Eres competente en armas simples y armas marciales. </li>
                <li><strong>Armaduras</strong>: Eres competente en todas las armaduras y escudos. </li>
                <li>>strong>Herramientas</strong>: No recibes competencias con herramientas por este rasgo. </li>
              </ul>
          `,
          selecciones: [
            {
              id: "habilidades_guerrero_n1",
              nombre: "Habilidades de Guerrero",
              tipo: "habilidad",
              cantidadSeleccionable: 2,
              descripcion: "Escoge dos habilidades para las que ganas competencia.",
              opciones: [
                { id: "acrobacias", nombre: "Acrobacias" },
                { id: "atletismo", nombre: "Atletismo" },
                { id: "historia", nombre: "Historia" },
                { id: "intimidacion", nombre: "Intimidación" },
                { id: "trato_con_animales", nombre: "Trato con animales" },
                { id: "percepcion", nombre: "Percepción" },
                { id: "perspicacia", nombre: "Perspicacia" },
                { id: "supervivencia", nombre: "Supervivencia" }
              ]
            }
          ]
        },
        {
          id: "estilo_combate_guerrero",
          nombre: "Estilo de Combate",
          nivelClase: 1,
          descripcionResum: "Elige una de las siguientes opciones de Estilo de Combate",
          descripcion:`
            Adoptas un estilo particular de lucha como especialidad. Elije una de las siguientes opciones. No puedes escojer un mismo Estilo de Lucha más de una vez, incluso cuando más adelante tengas que volver a escoger uno.
          `,
          selecciones: [
            {
              id: "estilo_combate",
              nombre: "Estilo de Combate",
              tipo: "estilo_combate",
              tipoPlural: "estilos de combate",
              cantidadSeleccionable: 1,
              descripcion: "Escoge un estilo de combate disponible para tu clase.",
              fuenteOpciones: {
                coleccion: "opcionesCompartidas.estilosCombate",
                incluirIds: [
                  "arqueria",
                  "defensa",
                  "duelo",
                  "a_dos_manos",
                  "proteccion",
                  "dos_armas"
                ]
              }
            }
          ]

        },
        {
          nombre: "Tomar Aliento",
          nivelClase: 1,
          descripcionResum: "Como acción adicional puedes recuperar 1d10 + Nvl de Guerrero.",
          descripcion: `
            Tienes un pozo limitado de aguante que puedes usar para protegerte a ti mismo del peligro. En tu turno, puedes usar una acción adicional para ganar una cantidad de puntos de golpe igual a 1d10 + tu nivel de guerrero.
            <br>
            Una vez que hayas usado este rasgo, deber tomar un descanso corto o prolongado antes de poder volver a usarlo.
          `,
          efectos: [ {condicion: {nivelClase: 1}}]
        },
        {
          nombre: "Accion Súbita",
          nivelClase: 2,
          descripcionResum: "Una vez por descanso, puedes usar una acción extra.",
          descripcion:`
            Empezando a 2º nivel, por un momento puedes presionarte a ti mismo más allá de los límites normales. Una vez por turno, puedes usar una acción extra además de tu acción normal y tu posible acción adicional. Una vez que hayas usado este rasgo, deber tomar un descanso corto o prolongado antes de poder volver a usarlo.
            <br>
            A partir de nivel 17, puedes usarlo dos veces antes de descansar, pero solo una vez en el mismo turno.
          `,
          efectos:[ {condicion: {nivelClase: 2}}]
        },
        {
          nombre: "Arquetipo Marcial",
          nivelClase: 3,
        }
      ]
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
  armas: [
    {
      id: "espadaLarga",
      nombre: "Espada larga",
      descripcion: "Una hoja marcial equilibrada que puede blandirse con una o dos manos.",
      precio: "15 po",
      categoria: "arma",
      subtipo: "Marcial cuerpo a cuerpo",
      efectos: [
        "Daño: 1d8 cortante",
        "Versátil: 1d10 cortante"
      ],
      etiquetas: ["Versátil", "Marcial"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "arcoLargo",
      nombre: "Arco largo",
      descripcion: "Arco de gran alcance usado habitualmente por exploradores y soldados entrenados.",
      precio: "50 po",
      categoria: "arma",
      subtipo: "Marcial a distancia",
      efectos: [
        "Daño: 1d8 perforante",
        "Alcance: 150/600 pies"
      ],
      etiquetas: ["A dos manos", "Munición", "Pesada"],
      sintonizable: false,
      sintonizado: false
    }
  ],
  armaduras: [
    {
      id: "cuero",
      nombre: "Armadura de Cuero",
      descripcion: "Armadura ligera de cuero endurecido que ofrece protección básica sin limitar demasiado el movimiento.",
      precio: "10 po",
      categoria: "armadura",
      tipo: "ligera",
      subtipo: "Ligera",
      efectos: ["CA base: 11 + modificador de Destreza"],
      etiquetas: ["Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "mediaArmadura",
      nombre: "Armadura Media",
      descripcion: "Protección intermedia que combina placas y piezas flexibles para resistir golpes fuertes.",
      precio: "50 po",
      categoria: "armadura",
      tipo: "media",
      subtipo: "Media",
      caBase: 15,
      efectos: ["CA base: 15 + modificador de Destreza (máximo +2)"],
      etiquetas: ["Media", "DES máx. +2"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "escudonormal",
      nombre: "Escudo",
      descripcion: "Una defensa de mano que se embraza para desviar ataques y mejorar la Clase de Armadura.",
      precio: "10 po",
      categoria: "equipo",
      tipo: "escudo",
      subtipo: "Escudo",
      bonifCA: 2,
      efectos: ["+2 a la CA mientras lo portas"],
      etiquetas: ["Defensivo", "Mano ocupada"],
      sintonizable: false,
      sintonizado: false
    }
  ],
  dotes: [
    {    }
  ],
  estados: [
    {
      id: "agarrado",
      nombre: "Agarrado",
      descripcion: `La velocidad de una criatura agarrada pasa a ser 0 y no puede beneficiarse de bonificadores a su velocidad. El estado termina si quien agarra queda incapacitado o si un efecto aleja a la criatura agarrada del alcance de quien la agarra.`
    },
    {
      id: "apresado",
      nombre: "Apresado",
      descripcion: `La velocidad de una criatura apresada pasa a ser 0. Las tiradas de ataque contra ella tienen ventaja y sus propias tiradas de ataque tienen desventaja. Además, tiene desventaja en las tiradas de salvación de Destreza.`
    },
    {
      id: "aturdido",
      nombre: "Aturdido",
      descripcion: `Una criatura aturdida está incapacitada, no puede moverse y solo puede hablar vacilantemente. Falla automáticamente las tiradas de salvación de Fuerza y Destreza, y las tiradas de ataque contra ella tienen ventaja.`
    },
    {
      id: "asustado",
      nombre: "Asustado",
      descripcion: `Una criatura asustada tiene desventaja en pruebas de característica y tiradas de ataque mientras la fuente de su miedo esté en su línea de visión. No puede acercarse voluntariamente a la fuente de su miedo.`
    },
    {
      id: "cegado",
      nombre: "Cegado",
      descripcion: `Una criatura cegada no puede ver y falla automáticamente cualquier prueba de característica que requiera la vista. Las tiradas de ataque contra ella tienen ventaja y sus propias tiradas de ataque tienen desventaja.`
    },
    {
      id: "derribado",
      nombre: "Derribado",
      descripcion: `Una criatura derribada solo puede moverse gateando, salvo que se levante. Tiene desventaja en las tiradas de ataque. Las tiradas de ataque contra ella tienen ventaja si el atacante está a 5 pies o menos; si no, tienen desventaja.`
    },
    {
      id: "ensordecido",
      nombre: "Ensordecido",
      descripcion: `Una criatura ensordecida no puede oír y falla automáticamente cualquier prueba de característica que requiera el oído.`
    },
    {
      id: "envenenado",
      nombre: "Envenenado",
      descripcion: `Una criatura envenenada tiene desventaja en las tiradas de ataque y en las pruebas de característica.`
    },
    {
      id: "hechizado",
      nombre: "Hechizado",
      descripcion: `Una criatura hechizada no puede atacar a quien la hechizó ni elegirlo como objetivo de aptitudes o efectos mágicos dañinos. Quien hechiza tiene ventaja en pruebas de característica para interactuar socialmente con ella.`
    },
    {
      id: "incapacitado",
      nombre: "Incapacitado",
      descripcion: `Una criatura incapacitada no puede realizar acciones ni reacciones.`
    },
    {
      id: "inconsciente",
      nombre: "Inconsciente",
      descripcion: `Una criatura inconsciente está incapacitada, no puede moverse ni hablar, no es consciente de su entorno, suelta lo que sostenga y cae derribada. Falla automáticamente salvaciones de Fuerza y Destreza; los ataques contra ella tienen ventaja y todo ataque que impacte desde 5 pies o menos es crítico.`
    },
    {
      id: "invisible",
      nombre: "Invisible",
      descripcion: `Una criatura invisible es imposible de ver sin ayuda de magia o sentidos especiales. A efectos de esconderse está muy oscurecida. Sus tiradas de ataque tienen ventaja y las tiradas de ataque contra ella tienen desventaja.`
    },
    {
      id: "paralizado",
      nombre: "Paralizado",
      descripcion: `Una criatura paralizada está incapacitada y no puede moverse ni hablar. Falla automáticamente salvaciones de Fuerza y Destreza. Los ataques contra ella tienen ventaja y todo ataque que impacte desde 5 pies o menos es crítico.`
    },
    {
      id: "petrificado",
      nombre: "Petrificado",
      descripcion: `Una criatura petrificada se transforma, junto con cualquier objeto no mágico que vista o porte, en una sustancia sólida inanimada. Está incapacitada, no puede moverse ni hablar, no es consciente, tiene resistencia a todo daño y es inmune al veneno y la enfermedad.`
    }
  ]
  
};

console.log("Mi libro de reglas:", libroDeReglasBasicas);