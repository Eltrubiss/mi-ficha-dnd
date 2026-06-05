let libroDeReglasBasicas = {
  razas: [
    {
      id: "draconido",
      nombre: "Dracónido",
      descripcion: "Herederos de antiguos dragones, los dracónidos llevan en la sangre un linaje elemental que se manifiesta como aliento destructivo y resistencia al daño asociado.",
      velocidad: 30,
      rasgos: [
        {
          nombre: "Rasgos Dracónidos",
          descripcionResum: "Tamaño Mediano, velocidad 30 pies, idiomas común y dracónico, linaje dracónico, ataque de aliento y resistencia al daño.",
          descripcion: `
            Considera los siguientes rasgos para tu dracónido:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Dracónidos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y dracónico.</li>
              <li><strong>Linaje dracónico</strong>: elige un antepasado dragón. Este linaje determina el tipo de daño de tu ataque de aliento y de tu resistencia.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Dracónido",
          descripcionResum: "+2 Fuerza y +1 Carisma.",
          descripcion: "Tu puntuación de Fuerza aumenta en 2 y tu puntuación de Carisma aumenta en 1.",
          efectos: [
            { tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 2 },
            { tipoDeEfecto: "bono_stat", statAfectada: "CAR", valor: 1 }
          ]
        },
        {
          nombre: "Ataque de Aliento",
          descripcionResum: "Exhalas energía destructiva determinada por tu linaje dracónico; se recupera con un descanso corto o prolongado.",
          descripcion: `Como acción, exhalas energía en una línea o cono según tu antepasado dragón. Las criaturas afectadas realizan una tirada de salvación; reciben daño completo si fallan y la mitad si tienen éxito. El daño aumenta con el nivel.`
        },
        {
          nombre: "Resistencia al Daño",
          descripcionResum: "Tienes resistencia al tipo de daño asociado a tu linaje dracónico.",
          descripcion: "Tu herencia dracónica te concede resistencia al tipo de daño indicado por tu antepasado dragón."
        }
      ],
      subrazas: []
    },
    {
      id: "elfo",
      nombre: "Elfo",
      descripcion: "Pueblo longevo y grácil, asociado a la magia, el arte, la naturaleza y una sensibilidad que rara vez encaja por completo en las tierras humanas.",
      velocidad: 30,
      rasgos: [
        {
          nombre: "Rasgos Élficos",
          descripcionResum: "Tamaño Mediano, velocidad 30 pies, idiomas común y élfico, trance, linaje feérico y visión en la oscuridad.",
          descripcion: `
            Considera los siguientes rasgos para tu elfo:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Élficos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y élfico.</li>
              <li><strong>Trance</strong>: meditas durante 4 horas para obtener el beneficio de un descanso equivalente al sueño de otras razas.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Elfo",
          descripcionResum: "+2 Destreza.",
          descripcion: "Tu puntuación de Destreza aumenta en 2.",
          efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "DES", valor: 2 }]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Ves en oscuridad hasta 60 pies.",
          descripcion: "Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.",
          efectos: [{ tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }]
        },
        {
          nombre: "Sentidos Agudos",
          descripcionResum: "Eres competente en Percepción.",
          descripcion: "Ganas competencia en la habilidad Percepción.",
          efectos: [{ tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Percepción", valor: 1 }]
        },
        {
          nombre: "Linaje Feérico",
          descripcionResum: "Ventaja contra ser hechizado y la magia no puede dormirte.",
          descripcion: "Tienes ventaja en tiradas de salvación para evitar quedar hechizado y no puedes ser dormido mediante magia."
        }
      ],
      subrazas: [
        {
          id: "altoelfo",
          nombre: "Alto Elfo",
          descripcion: "Alto elfo de mente aguda, tradición mágica básica y entrenamiento con armas élficas.",
          rasgos: [
            {
              nombre: "Mejora de Características del Alto Elfo",
              descripcionResum: "+1 Inteligencia.",
              descripcion: "Tu puntuación de Inteligencia aumenta en 1.",
              efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 1 }]
            },
            {
              nombre: "Entrenamiento en Armas Élficas",
              descripcionResum: "Competencia con espada larga, espada corta, arco corto y arco largo.",
              descripcion: "Ganas competencia con espada larga, espada corta, arco corto y arco largo.",
              efectos: [
                { tipoDeEfecto: "bono_arma", armaAfectada: "espadaLarga", valor: 1 },
                { tipoDeEfecto: "bono_arma", armaAfectada: "espadaCorta", valor: 1 },
                { tipoDeEfecto: "bono_arma", armaAfectada: "arcoCorto", valor: 1 },
                { tipoDeEfecto: "bono_arma", armaAfectada: "arcoLargo", valor: 1 }
              ]
            },
            {
              nombre: "Truco",
              descripcionResum: "Conoces un truco de la lista de conjuros de mago.",
              descripcion: "Aprendes un truco a tu elección de la lista de conjuros de mago. Inteligencia es tu característica de lanzamiento para ese truco."
            },
            {
              nombre: "Idioma Adicional",
              descripcionResum: "Aprendes un idioma adicional a tu elección.",
              descripcion: "Puedes hablar, leer y escribir un idioma adicional de tu elección."
            }
          ]
        }
      ]
    },
    {
      id: "enano",
      nombre: "Enano",
      descripcion: "Gente resistente y tenaz, conocida por su disciplina marcial, su relación con la piedra, sus oficios y su desconfianza inicial hacia los extraños.",
      velocidad: 25,
      rasgos: [
        {
          nombre: "Rasgos Enanos",
          descripcionResum: "Tamaño Mediano, velocidad 25 pies, idiomas común y enano, velocidad enana, fortaleza enana y afinidad con la piedra.",
          descripcion: `
            Considera los siguientes rasgos para tu enano:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Enanos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y enano.</li>
              <li><strong>Velocidad enana</strong>: tu velocidad no se reduce por llevar armadura pesada.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Enano",
          descripcionResum: "+2 Constitución.",
          descripcion: "Tu puntuación de Constitución aumenta en 2.",
          efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 2 }]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Ves en oscuridad hasta 60 pies.",
          descripcion: "Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.",
          efectos: [{ tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }]
        },
        {
          nombre: "Fortaleza Enana",
          descripcionResum: "Ventaja en salvaciones contra veneno y resistencia al daño por veneno.",
          descripcion: "Tienes ventaja en las tiradas de salvación contra venenos y resistencia al daño por veneno."
        },
        {
          nombre: "Entrenamiento de Combate Enano",
          descripcionResum: "Competencia con hacha de mano, hacha de batalla, martillo de guerra y martillo ligero.",
          descripcion: "Ganas competencia con hacha de mano, hacha de batalla, martillo de guerra y martillo ligero.",
          efectos: [
            { tipoDeEfecto: "bono_arma", armaAfectada: "hachaMano", valor: 1 },
            { tipoDeEfecto: "bono_arma", armaAfectada: "hachaBatalla", valor: 1 },
            { tipoDeEfecto: "bono_arma", armaAfectada: "martilloGuerra", valor: 1 },
            { tipoDeEfecto: "bono_arma", armaAfectada: "martilloLigero", valor: 1 }
          ]
        },
        {
          nombre: "Afinidad con la Piedra",
          descripcionResum: "Doble competencia en Historia para pruebas relacionadas con mampostería.",
          descripcion: "Cuando hagas una prueba de Inteligencia (Historia) relacionada con el origen de una obra de piedra, se considera que eres competente y aplicas el doble de tu bonificador de competencia."
        }
      ],
      subrazas: [
        {
          id: "enano_colinas",
          nombre: "Enano de las Colinas",
          descripcion: "Enano de intuición aguda y fortaleza excepcional.",
          rasgos: [
            {
              nombre: "Mejora de Características del Enano de las Colinas",
              descripcionResum: "+1 Sabiduría.",
              descripcion: "Tu puntuación de Sabiduría aumenta en 1.",
              efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "SAB", valor: 1 }]
            },
            {
              nombre: "Dureza Enana",
              descripcionResum: "+1 punto de golpe por nivel.",
              descripcion: "Tus puntos de golpe máximos aumentan en 1 y vuelven a aumentar en 1 cada vez que subes de nivel.",
              efectos: [{ tipoDeEfecto: "bono_pg_por_nivel", valor: 1 }]
            }
          ]
        }
      ]
    },
    {
      id: "gnomo",
      nombre: "Gnomo",
      descripcion: "Inventores, alquimistas y estudiosos curiosos que suelen vivir en comunidades escondidas, cómodas y llenas de ingenio práctico.",
      velocidad: 25,
      rasgos: [
        {
          nombre: "Rasgos Gnómicos",
          descripcionResum: "Tamaño Pequeño, velocidad 25 pies, idiomas común y gnomo, visión en la oscuridad y astucia gnómica.",
          descripcion: `
            Considera los siguientes rasgos para tu gnomo:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Gnómicos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Pequeño.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y gnomo.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Gnomo",
          descripcionResum: "+2 Inteligencia.",
          descripcion: "Tu puntuación de Inteligencia aumenta en 2.",
          efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 2 }]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Ves en oscuridad hasta 60 pies.",
          descripcion: "Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.",
          efectos: [{ tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }]
        },
        {
          nombre: "Astucia Gnómica",
          descripcionResum: "Ventaja en salvaciones de INT, SAB y CAR contra magia.",
          descripcion: "Tienes ventaja en todas las tiradas de salvación de Inteligencia, Sabiduría y Carisma contra magia."
        }
      ],
      subrazas: [
        {
          id: "gnomo_rocas",
          nombre: "Gnomo de las Rocas",
          descripcion: "Gnomo especialmente creativo, resistente y diestro con herramientas artesanales.",
          rasgos: [
            {
              nombre: "Mejora de Características del Gnomo de las Rocas",
              descripcionResum: "+1 Constitución.",
              descripcion: "Tu puntuación de Constitución aumenta en 1.",
              efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 1 }]
            },
            {
              nombre: "Conocimiento de Artífice",
              descripcionResum: "Añades el doble de competencia a pruebas de Historia sobre objetos mágicos, alquímicos o tecnológicos.",
              descripcion: "Cuando hagas pruebas de Inteligencia (Historia) relacionadas con objetos mágicos, alquímicos o tecnológicos, puedes añadir el doble de tu bonificador de competencia."
            },
            {
              nombre: "Manitas",
              descripcionResum: "Ganas competencia con herramientas de artesano para crear pequeños mecanismos.",
              descripcion: "Tienes competencia con herramientas de artesano y puedes fabricar dispositivos diminutos de cuerda."
            }
          ]
        }
      ]
    },
    {
      id: "humano",
      nombre: "Humano",
      descripcion: "La raza común más adaptable y ambiciosa, marcada por vidas breves, gran variedad cultural y una enorme capacidad para aprender de otros pueblos.",
      velocidad: 30,
      rasgos: [
        {
          nombre: "Rasgos Humanos",
          descripcionResum: "Tamaño Mediano, velocidad 30 pies, idioma común y un idioma adicional.",
          descripcion: `
            Considera los siguientes rasgos para tu humano:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Humanos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y un idioma adicional de tu elección.</li>
              <li><strong>Alineamiento</strong>: los humanos no tienen una tendencia fija y pueden representar lo mejor o lo peor de cualquier pueblo.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Humano",
          descripcionResum: "+1 a todas las características.",
          descripcion: "Tu puntuación de Fuerza, Destreza, Constitución, Inteligencia, Sabiduría y Carisma aumenta en 1.",
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
      subrazas: []
    },
    {
      id: "mediano",
      nombre: "Mediano",
      descripcion: "Pueblo pequeño, amable y comunitario, conocido por su valentía cotidiana, su suerte improbable y su rechazo a la opresión.",
      velocidad: 25,
      rasgos: [
        {
          nombre: "Rasgos Medianos",
          descripcionResum: "Tamaño Pequeño, velocidad 25 pies, idiomas común y mediano, agilidad, valentía y suerte.",
          descripcion: `
            Considera los siguientes rasgos para tu mediano:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Medianos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Pequeño.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y mediano.</li>
              <li><strong>Agilidad de los medianos</strong>: puedes moverte por el espacio de criaturas de mayor tamaño que tú.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Mediano",
          descripcionResum: "+2 Destreza.",
          descripcion: "Tu puntuación de Destreza aumenta en 2.",
          efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "DES", valor: 2 }]
        },
        {
          nombre: "Afortunado",
          descripcionResum: "Puedes repetir un 1 en el d20 para ataques, pruebas o salvaciones.",
          descripcion: "Cuando sacas un 1 en una tirada de ataque, prueba de característica o tirada de salvación, puedes volver a tirar el dado y debes usar el nuevo resultado."
        },
        {
          nombre: "Valiente",
          descripcionResum: "Ventaja en salvaciones contra quedar asustado.",
          descripcion: "Tienes ventaja en tiradas de salvación contra quedar asustado."
        }
      ],
      subrazas: [
        {
          id: "mediano_piesligeros",
          nombre: "Mediano Piesligeros",
          descripcion: "Mediano sociable y viajero, especialmente hábil para ocultarse aprovechando la cobertura de criaturas mayores.",
          rasgos: [
            {
              nombre: "Mejora de Características del Piesligeros",
              descripcionResum: "+1 Carisma.",
              descripcion: "Tu puntuación de Carisma aumenta en 1.",
              efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "CAR", valor: 1 }]
            },
            {
              nombre: "Sigilo Natural",
              descripcionResum: "Puedes intentar esconderte tras una criatura de tamaño mayor que el tuyo.",
              descripcion: "Puedes intentar esconderte incluso cuando solo estás cubierto por una criatura que sea al menos un tamaño mayor que tú."
            }
          ]
        }
      ]
    },
    {
      id: "semielfo",
      nombre: "Semielfo",
      descripcion: "Descendientes de humanos y elfos, valoran la libertad, la expresión personal y la vida entre culturas sin pertenecer del todo a una sola.",
      velocidad: 30,
      rasgos: [
        {
          nombre: "Rasgos de Semielfo",
          descripcionResum: "Tamaño Mediano, velocidad 30 pies, idiomas común, élfico y uno adicional, visión en la oscuridad y ancestro feérico.",
          descripcion: `
            Considera los siguientes rasgos para tu semielfo:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos de Semielfo</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común, élfico y un idioma adicional de tu elección.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Semielfo",
          descripcionResum: "+2 Carisma y +1 a dos características a elección.",
          descripcion: "Tu puntuación de Carisma aumenta en 2. Además, dos características distintas de tu elección aumentan en 1.",
          efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "CAR", valor: 2 }],
          selecciones: [
            {
              id: "stats_semielfo",
              nombre: "Características de Semielfo",
              tipo: "caracteristica",
              cantidadSeleccionable: 2,
              descripcion: "Escoge dos características distintas para aumentar en 1.",
              opciones: [
                { id: "FUE", nombre: "Fuerza", efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 1 }] },
                { id: "DES", nombre: "Destreza", efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "DES", valor: 1 }] },
                { id: "CON", nombre: "Constitución", efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 1 }] },
                { id: "INT", nombre: "Inteligencia", efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 1 }] },
                { id: "SAB", nombre: "Sabiduría", efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "SAB", valor: 1 }] }
              ]
            }
          ]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Ves en oscuridad hasta 60 pies.",
          descripcion: "Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.",
          efectos: [{ tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }]
        },
        {
          nombre: "Ancestro Feérico",
          descripcionResum: "Ventaja contra ser hechizado y la magia no puede dormirte.",
          descripcion: "Tienes ventaja en tiradas de salvación para evitar quedar hechizado y no puedes ser dormido mediante magia."
        },
        {
          nombre: "Versatilidad con Habilidades",
          descripcionResum: "Ganas competencia en dos habilidades a elección.",
          descripcion: "Escoge dos habilidades para ganar competencia.",
          selecciones: [
            {
              id: "habilidades_semielfo",
              nombre: "Habilidades de Semielfo",
              tipo: "habilidad",
              cantidadSeleccionable: 2,
              descripcion: "Escoge dos habilidades para las que ganas competencia.",
              opciones: [
                { id: "acrobacias", nombre: "Acrobacias" }, { id: "atletismo", nombre: "Atletismo" }, { id: "arcanos", nombre: "Arcanos" }, { id: "enganar", nombre: "Engañar" }, { id: "historia", nombre: "Historia" }, { id: "interpretacion", nombre: "Interpretación" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "investigacion", nombre: "Investigación" }, { id: "juego_de_manos", nombre: "Juego de Manos" }, { id: "medicina", nombre: "Medicina" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "percepcion", nombre: "Percepción" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "persuasion", nombre: "Persuasión" }, { id: "religion", nombre: "Religión" }, { id: "sigilo", nombre: "Sigilo" }, { id: "supervivencia", nombre: "Supervivencia" }, { id: "trato_con_animales", nombre: "Trato con animales" }
              ]
            }
          ]
        }
      ],
      subrazas: []
    },
    {
      id: "semiorco",
      nombre: "Semiorco",
      descripcion: "Descendientes de orcos y humanos, suelen destacar por su fuerza, resistencia y una presencia intimidante marcada por su herencia orca.",
      velocidad: 30,
      rasgos: [
        {
          nombre: "Rasgos de Semiorco",
          descripcionResum: "Tamaño Mediano, velocidad 30 pies, idiomas común y orco, visión en la oscuridad, aguante incansable y ataques salvajes.",
          descripcion: `
            Considera los siguientes rasgos para tu semiorco:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Semiorcos</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común y orco.</li>
              <li><strong>Edad</strong>: maduran antes que los humanos y rara vez viven más de 75 años.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Semiorco",
          descripcionResum: "+2 Fuerza y +1 Constitución.",
          descripcion: "Tu puntuación de Fuerza aumenta en 2 y tu puntuación de Constitución aumenta en 1.",
          efectos: [
            { tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 2 },
            { tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 1 }
          ]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Ves en oscuridad hasta 60 pies.",
          descripcion: "Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.",
          efectos: [{ tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }]
        },
        {
          nombre: "Amenazante",
          descripcionResum: "Eres competente en Intimidación.",
          descripcion: "Ganas competencia en la habilidad Intimidación.",
          efectos: [{ tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Intimidación", valor: 1 }]
        },
        {
          nombre: "Aguante Incansable",
          descripcionResum: "Una vez por descanso prolongado, puedes quedarte a 1 PG cuando bajarías a 0.",
          descripcion: "Cuando tus puntos de golpe se reducen a 0 y no mueres de inmediato, puedes quedarte a 1 punto de golpe. Recuperas este rasgo tras un descanso prolongado."
        },
        {
          nombre: "Ataques Salvajes",
          descripcionResum: "Añades un dado de daño adicional en críticos con armas cuerpo a cuerpo.",
          descripcion: "Cuando logras un golpe crítico con un ataque de arma cuerpo a cuerpo, puedes tirar un dado de daño del arma una vez más y añadirlo al daño extra del crítico."
        }
      ],
      subrazas: []
    },
    {
      id: "tiefling",
      nombre: "Tiefling",
      descripcion: "Personas marcadas por una herencia infernal que suele provocar rechazo, sospecha y una inclinación externa hacia fuerzas caóticas.",
      velocidad: 30,
      rasgos: [
        {
          nombre: "Rasgos Tiefling",
          descripcionResum: "Tamaño Mediano, velocidad 30 pies, idiomas común e infernal, visión en la oscuridad, legado infernal y resistencia al fuego.",
          descripcion: `
            Considera los siguientes rasgos para tu tiefling:<br>
            <h4 style="color: #5a4035; margin: 10px 0 5px 0;">Atributos Tiefling</h4>
            <ul style="margin-top: 5px;">
              <li><strong>Tamaño</strong>: tu tamaño es Mediano.</li>
              <li><strong>Idiomas</strong>: puedes hablar, leer y escribir común e infernal.</li>
            </ul>
          `
        },
        {
          nombre: "Mejora de Características del Tiefling",
          descripcionResum: "+2 Carisma y +1 Inteligencia.",
          descripcion: "Tu puntuación de Carisma aumenta en 2 y tu puntuación de Inteligencia aumenta en 1.",
          efectos: [
            { tipoDeEfecto: "bono_stat", statAfectada: "CAR", valor: 2 },
            { tipoDeEfecto: "bono_stat", statAfectada: "INT", valor: 1 }
          ]
        },
        {
          nombre: "Visión en la Oscuridad",
          descripcionResum: "Ves en oscuridad hasta 60 pies.",
          descripcion: "Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.",
          efectos: [{ tipoDeEfecto: "vision", tipoVision: "VisionOscuridad", alcance: 60 }]
        },
        {
          nombre: "Resistencia Infernal",
          descripcionResum: "Tienes resistencia al daño por fuego.",
          descripcion: "Tu herencia infernal te concede resistencia al daño por fuego."
        },
        {
          nombre: "Legado Infernal",
          descripcionResum: "Conoces Taumaturgia; más adelante puedes lanzar Reprensión infernal y Oscuridad una vez por descanso prolongado.",
          descripcion: "Conoces el truco Taumaturgia. A nivel 3 puedes lanzar Reprensión infernal como conjuro de nivel 2 una vez por descanso prolongado. A nivel 5 puedes lanzar Oscuridad una vez por descanso prolongado. Carisma es tu característica para estos conjuros."
        }
      ],
      subrazas: []
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
    { id: "barbaro",
      nombre: "Bárbaro",
      descripcion: "Combatiente salvaje que convierte la furia, la resistencia y la fuerza bruta en su principal respuesta ante el peligro.",
      dadoDeGolpe: 12,
      competencias: {
        salvaciones: ["FUE", "CON"],
        habilidades: [],
        armas: {
          descripcion: "Armas simples y marciales",
          competencias: ["armasSimples", "armasMarciales"]
        },
        armaduras: { descripcion: "Armaduras ligeras, medias y escudos", competencias: ["ligera", "media", "escudo"] },
        herramientas: "Ninguna",
        idiomas: []
      },
      rasgos: [
        {
          id: "competencias_iniciales_barbaro",
          nombre: "Competencias iniciales",
          nivelClase: 1,
          descripcionResum: "Obtienes salvaciones de Fuerza y Constitución, armaduras ligeras y medias, escudos, armas simples y marciales, y dos habilidades.",
          descripcion: `El bárbaro empieza con entrenamiento defensivo y marcial amplio. Escoge dos habilidades entre Trato con animales, Atletismo, Intimidación, Naturaleza, Percepción y Supervivencia.`,
          selecciones: [{ id: "habilidades_barbaro_n1", nombre: "Habilidades de Bárbaro", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades para las que ganas competencia.", opciones: [
            { id: "trato_con_animales", nombre: "Trato con animales" }, { id: "atletismo", nombre: "Atletismo" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "percepcion", nombre: "Percepción" }, { id: "supervivencia", nombre: "Supervivencia" }
          ] }]
        },
        {
          id: "defensa_sin_armadura_barbaro",
          nombre: "Defensa sin Armadura",
          nivelClase: 1,
          descripcionResum: "Sin armadura, tu CA es 10 + DES + CON; puedes seguir usando escudo.",
          descripcion: `Mientras no lleves armadura, calculas tu Clase de Armadura como 10 + tu modificador de Destreza + tu modificador de Constitución. El escudo sigue sumando su bonificador normal.`,
          efectos: [{ tipoDeEfecto: "caSinArmadura", base: 10, modificadores: ["DES", "CON"], condicion: { sinArmadura: true, sinEscudo: false } }]
        },
        { id: "furia_barbaro", nombre: "Furia", nivelClase: 1, descripcionResum: "Entras en furia como acción adicional para potenciar pruebas y salvaciones de Fuerza, daño cuerpo a cuerpo y resistencias.", descripcion: `Como acción adicional puedes iniciar una furia que refuerza tus pruebas y tiradas de salvación de Fuerza, mejora el daño de ataques cuerpo a cuerpo basados en Fuerza y te vuelve más resistente al daño físico común. No puedes lanzar ni concentrarte en conjuros mientras dura.` },
        { id: "ataque_temerario", nombre: "Ataque temerario", nivelClase: 2, descripcionResum: "Puedes ganar ventaja en ataques cuerpo a cuerpo con Fuerza, dejando ventaja contra ti hasta tu siguiente turno.", descripcion: `Al atacar por primera vez en tu turno, puedes decidir atacar sin reservarte. Tus ataques cuerpo a cuerpo con Fuerza tienen ventaja durante ese turno, pero los ataques contra ti también tienen ventaja hasta tu siguiente turno.` },
        { id: "sentido_peligro", nombre: "Sentido del peligro", nivelClase: 2, descripcionResum: "Ventaja en salvaciones de Destreza contra efectos visibles si no estás cegado, ensordecido ni incapacitado.", descripcion: `Tus reflejos te ayudan contra trampas, conjuros y otros efectos que puedas ver. Ganas ventaja en tiradas de salvación de Destreza aplicables si puedes reaccionar con normalidad.` },
        { id: "senda_barbaro", nombre: "Senda de bárbaro", nivelClase: 3, descripcionResum: "Escoge una senda que concede rasgos en los niveles 3, 6, 10 y 14.", descripcion: `Tu furia adopta una senda concreta. Esta elección define nuevos rasgos de clase a medida que progresas.`, selecciones: [{ id: "senda_barbaro", nombre: "Senda de bárbaro", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu senda bárbara.", opciones: [{ id: "berserker", nombre: "Senda del berserker" }] }] },
        { id: "mejora_caracteristica_barbaro", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, respetando el máximo normal de 20 salvo que otro rasgo indique lo contrario.` },
        { id: "ataque_adicional_barbaro", nombre: "Ataque adicional", nivelClase: 5, descripcionResum: "Puedes atacar dos veces cuando usas la acción de Ataque.", descripcion: `Cuando realizas la acción de Ataque en tu turno, haces dos ataques en lugar de uno.` },
        { id: "movimiento_rapido", nombre: "Movimiento rápido", nivelClase: 5, descripcionResum: "+10 pies de velocidad mientras no lleves armadura pesada.", descripcion: `Tu velocidad aumenta en 10 pies mientras no lleves armadura pesada.`, efectos: [{ tipoDeEfecto: "bono_velocidad", valor: 10, condicion: { sinArmaduraPesada: true } }] },
        { id: "instinto_salvaje", nombre: "Instinto salvaje", nivelClase: 7, descripcionResum: "Ventaja en iniciativa y reacción rápida ante la sorpresa si puedes entrar en furia.", descripcion: `Tus instintos afinados te dan ventaja en iniciativa. Si estás sorprendido al comenzar el combate y no incapacitado, puedes actuar si entras en furia antes de hacer otra cosa.` },
        { id: "critico_brutal", nombre: "Crítico brutal", nivelClase: 9, descripcionResum: "Añades dados extra de arma al daño de tus críticos cuerpo a cuerpo.", descripcion: `Cuando logras un golpe crítico con un ataque cuerpo a cuerpo, añades dados adicionales de daño de arma. El número de dados aumenta en niveles superiores.` },
        { id: "furia_implacable", nombre: "Furia implacable", nivelClase: 11, descripcionResum: "Mientras estás en furia, puedes intentar quedarte a 1 PG cuando bajarías a 0.", descripcion: `Si tus puntos de golpe se reducen a 0 mientras estás en furia y no mueres de inmediato, puedes intentar una salvación de Constitución para permanecer a 1 punto de golpe. La dificultad sube con usos repetidos antes de descansar.` },
        { id: "furia_persistente", nombre: "Furia persistente", nivelClase: 15, descripcionResum: "Tu furia solo termina pronto si caes inconsciente o decides acabarla.", descripcion: `Tu furia se mantiene con una tenacidad extraordinaria y ya no termina antes de tiempo salvo por inconsciencia o por tu decisión.` },
        { id: "poder_indomable", nombre: "Poder indomable", nivelClase: 18, descripcionResum: "Si una prueba de Fuerza queda por debajo de tu puntuación de Fuerza, puedes usar esa puntuación como resultado.", descripcion: `Cuando el total de una prueba de Fuerza sea inferior a tu puntuación de Fuerza, puedes reemplazar el total por esa puntuación.` },
        { id: "campeon_primordial", nombre: "Campeón primordial", nivelClase: 20, descripcionResum: "+4 a Fuerza y Constitución; su máximo pasa a 24.", descripcion: `Tu poder físico alcanza un límite sobrenatural: Fuerza y Constitución aumentan en 4 y su máximo pasa a 24.`, efectos: [{ tipoDeEfecto: "bono_stat", statAfectada: "FUE", valor: 4 }, { tipoDeEfecto: "bono_stat", statAfectada: "CON", valor: 4 }] }
      ],
      subclase: [{ id: "berserker", nombre: "Senda del berserker", descripcionResum: "La furia se convierte en violencia imparable.", descripcion: `Esta senda enfatiza la agresión directa y el combate sin reservas.`, rasgos: [
        { id: "frenesi", nombre: "Frenesí", nivelClase: 3, descripcionResum: "Al entrar en furia, puedes hacer ataques adicionales a cambio de agotamiento al terminar.", descripcion: `Puedes convertir tu furia en frenesí para atacar como acción adicional mientras dura. Al terminar, sufres agotamiento.` },
        { id: "furia_inconsciente", nombre: "Furia inconsciente", nivelClase: 6, descripcionResum: "No puedes quedar asustado ni hechizado durante la furia.", descripcion: `Mientras estás en furia, tu mente es difícil de doblegar: no puedes ser asustado ni hechizado, y la furia suspende esos efectos si ya los sufrías.` },
        { id: "presencia_intimidante", nombre: "Presencia intimidante", nivelClase: 10, descripcionResum: "Puedes usar tu acción para asustar a una criatura cercana.", descripcion: `Puedes imponer tu presencia a una criatura que pueda verte u oírte, obligándola a resistir con Sabiduría o quedar asustada temporalmente.` },
        { id: "represalia", nombre: "Represalia", nivelClase: 14, descripcionResum: "Puedes atacar con tu reacción a quien te dañe cuerpo a cuerpo.", descripcion: `Cuando una criatura a 5 pies te daña, puedes usar tu reacción para hacer un ataque cuerpo a cuerpo contra ella.` }
      ] }]
    },
    { id: "bardo",
      nombre: "Bardo",
      descripcion: "Artista y lanzador de conjuros que inspira aliados, confunde enemigos y usa el conocimiento como herramienta de aventura.",
      dadoDeGolpe: 8,
      competencias: { salvaciones: ["DES", "CAR"], habilidades: [], armas: { descripcion: "Armas simples, ballesta de mano, espada larga, estoque y espada corta", competencias: ["armasSimples", "ballestaMano", "espadaLarga", "estoque", "espadaCorta"] }, armaduras: { descripcion: "Armaduras ligeras", competencias: ["ligera"] }, herramientas: "Tres instrumentos musicales a escoger", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_bardo", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Obtienes salvaciones de Destreza y Carisma, armaduras ligeras, armas de bardo, tres instrumentos y tres habilidades.", descripcion: `El bardo empieza con competencias flexibles. Escoge tres habilidades cualesquiera y tres instrumentos musicales.`, selecciones: [{ id: "habilidades_bardo_n1", nombre: "Habilidades de Bardo", tipo: "habilidad", cantidadSeleccionable: 3, descripcion: "Escoge tres habilidades para las que ganas competencia.", opciones: [
          { id: "acrobacias", nombre: "Acrobacias" }, { id: "atletismo", nombre: "Atletismo" }, { id: "arcanos", nombre: "Arcanos" }, { id: "enganar", nombre: "Engañar" }, { id: "historia", nombre: "Historia" }, { id: "interpretacion", nombre: "Interpretación" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "investigacion", nombre: "Investigación" }, { id: "juego_de_manos", nombre: "Juego de Manos" }, { id: "medicina", nombre: "Medicina" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "percepcion", nombre: "Percepción" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "persuasion", nombre: "Persuasión" }, { id: "religion", nombre: "Religión" }, { id: "sigilo", nombre: "Sigilo" }, { id: "supervivencia", nombre: "Supervivencia" }, { id: "trato_con_animales", nombre: "Trato con animales" }
        ] }] },
        { id: "lanzamiento_conjuros_bardo", nombre: "Lanzamiento de conjuros", nivelClase: 1, descripcionResum: "Lanzas conjuros de bardo usando Carisma e instrumentos musicales como foco.", descripcion: `Tu magia se basa en Carisma. Conoces trucos y conjuros de bardo, puedes lanzar rituales de bardo conocidos y usar un instrumento musical como foco de conjuro.` },
        { id: "inspiracion_bardica", nombre: "Inspiración bárdica", nivelClase: 1, descripcionResum: "Como acción adicional concedes un dado que un aliado puede sumar a una prueba, ataque o salvación.", descripcion: `Puedes animar a una criatura que pueda oírte a 60 pies. Durante los próximos minutos, esa criatura puede sumar tu dado de inspiración a una prueba de característica, tirada de ataque o tirada de salvación.` },
        { id: "aprendiz_de_mucho", nombre: "Aprendiz de mucho", nivelClase: 2, descripcionResum: "Añades la mitad de tu competencia a pruebas de característica que no la incluyan.", descripcion: `Tu experiencia variada te permite sumar la mitad de tu bonificador de competencia a pruebas de característica en las que no seas competente.`, efectos: [
          { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Acrobacias", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Atletismo", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Arcanos", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Engañar", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Historia", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Interpretación", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Intimidación", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Investigación", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Juego de Manos", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Medicina", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Naturaleza", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Percepción", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Perspicacia", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Persuasión", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Religión", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Sigilo", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Supervivencia", valor: "mitad_competencia", condicion: { competencia: false } }, { tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Trato con animales", valor: "mitad_competencia", condicion: { competencia: false } }
        ] },
        { id: "cancion_descanso", nombre: "Canción de descanso", nivelClase: 2, descripcionResum: "Durante descansos breves, tu música añade curación extra a quienes gasten Dados de Golpe.", descripcion: `Si tú o tus aliados gastáis Dados de Golpe durante un descanso breve y podéis oír tu interpretación, recuperáis puntos de golpe adicionales según tu dado de Canción de descanso.` },
        { id: "colegio_bardo", nombre: "Colegio de bardo", nivelClase: 3, descripcionResum: "Escoge un colegio que otorga rasgos en niveles 3, 6 y 14.", descripcion: `Tu formación entra en un colegio bárdico que define tu especialización.`, selecciones: [{ id: "colegio_bardo", nombre: "Colegio de bardo", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu colegio bárdico.", opciones: [{ id: "colegio_conocimiento", nombre: "Colegio del Conocimiento" }] }] },
        { id: "pericia_bardo", nombre: "Pericia", nivelClase: 3, descripcionResum: "Elige competencias de habilidades para duplicar tu bonificador de competencia.", descripcion: `Escoge dos habilidades en las que seas competente; tu bonificador de competencia se duplica para ellas. Más adelante eliges otras dos.` },
        { id: "mejora_caracteristica_bardo", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "fuente_inspiracion", nombre: "Fuente de inspiración", nivelClase: 5, descripcionResum: "Recuperas Inspiración bárdica al terminar un descanso breve o prolongado.", descripcion: `Tus usos de Inspiración bárdica se recuperan al completar un descanso breve o prolongado.` },
        { id: "contraencantamiento", nombre: "Contraencantamiento", nivelClase: 6, descripcionResum: "Puedes proteger con tu actuación contra miedo y encantamiento.", descripcion: `Como acción, inicias una actuación breve. Tú y aliados cercanos que puedan oírte tenéis ventaja en salvaciones contra quedar asustados o hechizados mientras dura.` },
        { id: "secretos_magicos", nombre: "Secretos mágicos", nivelClase: 10, descripcionResum: "Aprendes conjuros de cualquier lista, que pasan a contar como conjuros de bardo.", descripcion: `Elige conjuros de cualquier clase de un nivel que puedas lanzar; para ti cuentan como conjuros de bardo y amplían tus opciones conocidas.` },
        { id: "inspiracion_superior", nombre: "Inspiración superior", nivelClase: 20, descripcionResum: "Al tirar iniciativa sin usos de Inspiración bárdica, recuperas un uso.", descripcion: `Si empiezas un combate sin usos de Inspiración bárdica, recuperas uno al tirar iniciativa.` }
      ],
      subclase: [{ id: "colegio_conocimiento", nombre: "Colegio del Conocimiento", descripcionResum: "Bardo centrado en saberes, habilidades y secretos mágicos.", descripcion: `Este colegio colecciona relatos, saberes y técnicas útiles de muchas fuentes.`, rasgos: [
        { id: "competencias_adicionales_conocimiento", nombre: "Competencias adicionales", nivelClase: 3, descripcionResum: "Ganas tres competencias de habilidad a tu elección.", descripcion: `Al unirte al colegio, escoge tres habilidades adicionales para ganar competencia.`, selecciones: [{ id: "habilidades_conocimiento_n3", nombre: "Habilidades del Colegio del Conocimiento", tipo: "habilidad", cantidadSeleccionable: 3, descripcion: "Escoge tres habilidades adicionales.", opciones: [
          { id: "acrobacias", nombre: "Acrobacias" }, { id: "atletismo", nombre: "Atletismo" }, { id: "arcanos", nombre: "Arcanos" }, { id: "enganar", nombre: "Engañar" }, { id: "historia", nombre: "Historia" }, { id: "interpretacion", nombre: "Interpretación" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "investigacion", nombre: "Investigación" }, { id: "juego_de_manos", nombre: "Juego de Manos" }, { id: "medicina", nombre: "Medicina" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "percepcion", nombre: "Percepción" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "persuasion", nombre: "Persuasión" }, { id: "religion", nombre: "Religión" }, { id: "sigilo", nombre: "Sigilo" }, { id: "supervivencia", nombre: "Supervivencia" }, { id: "trato_con_animales", nombre: "Trato con animales" }
        ] }] },
        { id: "palabras_hirientes", nombre: "Palabras hirientes", nivelClase: 3, descripcionResum: "Usa tu reacción e Inspiración bárdica para penalizar ataque, prueba o daño de una criatura.", descripcion: `Cuando una criatura cercana que puedas ver realiza una tirada relevante, puedes gastar Inspiración bárdica como reacción para restar el resultado del dado.` },
        { id: "secretos_magicos_adicionales", nombre: "Secretos mágicos adicionales", nivelClase: 6, descripcionResum: "Aprendes dos conjuros adicionales de cualquier clase.", descripcion: `Aprendes dos conjuros de cualquier lista que cuenten como conjuros de bardo sin consumir tus conjuros conocidos normales.` },
        { id: "habilidad_sin_igual", nombre: "Habilidad sin igual", nivelClase: 14, descripcionResum: "Puedes gastar Inspiración bárdica para sumarla a una prueba de característica propia.", descripcion: `Cuando haces una prueba de característica, puedes gastar un dado de Inspiración bárdica y sumarlo antes de conocer el resultado definitivo.` }
      ] }]
    },
    { id: "brujo",
      nombre: "Brujo",
      descripcion: "Lanzador de pacto que obtiene magia y secretos arcanos mediante un vínculo con un patrón sobrenatural.",
      dadoDeGolpe: 8,
      competencias: { salvaciones: ["SAB", "CAR"], habilidades: [], armas: { descripcion: "Armas simples", competencias: ["armasSimples"] }, armaduras: { descripcion: "Armaduras ligeras", competencias: ["ligera"] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_brujo", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Sabiduría y Carisma, armaduras ligeras, armas simples y dos habilidades.", descripcion: `Escoge dos habilidades entre Arcanos, Engañar, Historia, Intimidación, Investigación, Naturaleza y Religión.`, selecciones: [{ id: "habilidades_brujo_n1", nombre: "Habilidades de Brujo", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "arcanos", nombre: "Arcanos" }, { id: "enganar", nombre: "Engañar" }, { id: "historia", nombre: "Historia" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "investigacion", nombre: "Investigación" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "religion", nombre: "Religión" }] }] },
        { id: "patron_sobrenatural", nombre: "Patrón sobrenatural", nivelClase: 1, descripcionResum: "Escoge el patrón que alimenta tu magia de pacto.", descripcion: `Tu pacto procede de una entidad poderosa que define rasgos adicionales.`, selecciones: [{ id: "patron_brujo", nombre: "Patrón sobrenatural", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu patrón.", opciones: [{ id: "ser_infernal", nombre: "Ser infernal" }] }] },
        { id: "magia_pacto", nombre: "Magia del pacto", nivelClase: 1, descripcionResum: "Lanzas conjuros de brujo usando Carisma y recuperas espacios de pacto al descansar brevemente o prolongadamente.", descripcion: `Tu magia usa Carisma. Conoces trucos y conjuros de brujo; tus espacios de pacto vuelven tras un descanso breve o prolongado.` },
        { id: "invocaciones_sobrenaturales", nombre: "Invocaciones sobrenaturales", nivelClase: 2, descripcionResum: "Aprendes invocaciones que te conceden capacidades mágicas persistentes.", descripcion: `Eliges invocaciones sobrenaturales, fragmentos de poder oculto que personalizan tus aptitudes mágicas.` },
        { id: "don_pacto", nombre: "Don del pacto", nivelClase: 3, descripcionResum: "Tu patrón te concede un don de pacto especial.", descripcion: `Recibes un don pactado, como un familiar, un arma de pacto o un tomo, que cambia tus opciones de juego.` },
        { id: "mejora_caracteristica_brujo", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "arcanum_mistico", nombre: "Arcanum místico", nivelClase: 11, descripcionResum: "Accedes a conjuros místicos de alto nivel mediante tu pacto.", descripcion: `Tu patrón te permite lanzar un conjuro místico concreto de alto nivel sin usar tus espacios de pacto habituales.` },
        { id: "maestro_sobrenatural", nombre: "Maestro sobrenatural", nivelClase: 20, descripcionResum: "Puedes recuperar espacios de pacto con una breve súplica a tu patrón.", descripcion: `Puedes dedicar un breve tiempo a implorar a tu patrón para recuperar espacios de conjuro de pacto gastados.` }
      ],
      subclase: [{ id: "ser_infernal", nombre: "Ser infernal", descripcionResum: "Pacto con una entidad de los planos inferiores.", descripcion: `El patrón infernal premia la caída de tus enemigos y te protege con poder abrasador.`, rasgos: [
        { id: "bendicion_oscuro", nombre: "Bendición del oscuro", nivelClase: 1, descripcionResum: "Al reducir una criatura hostil a 0 PG, ganas puntos de golpe temporales.", descripcion: `Cuando derrotas a una criatura hostil, recibes puntos de golpe temporales basados en tu Carisma y nivel de brujo.` },
        { id: "suerte_oscuro", nombre: "Suerte del oscuro", nivelClase: 6, descripcionResum: "Puedes sumar 1d10 a una prueba o salvación una vez por descanso.", descripcion: `Invocas a tu patrón para añadir 1d10 a una prueba de característica o tirada de salvación antes de conocer el resultado.` },
        { id: "resistencia_infernal", nombre: "Resistencia infernal", nivelClase: 10, descripcionResum: "Elige un tipo de daño tras descansar para ganar resistencia contra él.", descripcion: `Tras un descanso, eliges un tipo de daño y ganas resistencia contra ese daño hasta cambiarlo en otro descanso.` },
        { id: "lanzar_infierno", nombre: "Lanzar al infierno", nivelClase: 14, descripcionResum: "Una vez por descanso puedes enviar temporalmente a una criatura dañada a una experiencia infernal.", descripcion: `Cuando impactas a una criatura, puedes hacer que desaparezca brevemente y sufra daño psíquico por una visión infernal.` }
      ] }]
    },
    { id: "clerigo",
      nombre: "Clérigo",
      descripcion: "Canalizador de magia divina que actúa como intermediario entre deidades, ideales sagrados y el mundo mortal.",
      dadoDeGolpe: 8,
      competencias: { salvaciones: ["SAB", "CAR"], habilidades: [], armas: { descripcion: "Armas simples", competencias: ["armasSimples"] }, armaduras: { descripcion: "Armaduras ligeras, medias y escudos", competencias: ["ligera", "media", "escudo"] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_clerigo", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Sabiduría y Carisma, armaduras ligeras y medias, escudos, armas simples y dos habilidades.", descripcion: `Escoge dos habilidades entre Historia, Perspicacia, Medicina, Persuasión y Religión.`, selecciones: [{ id: "habilidades_clerigo_n1", nombre: "Habilidades de Clérigo", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "historia", nombre: "Historia" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "medicina", nombre: "Medicina" }, { id: "persuasion", nombre: "Persuasión" }, { id: "religion", nombre: "Religión" }] }] },
        { id: "lanzamiento_conjuros_clerigo", nombre: "Lanzamiento de conjuros", nivelClase: 1, descripcionResum: "Preparas y lanzas conjuros de clérigo usando Sabiduría.", descripcion: `Tu magia divina usa Sabiduría. Preparas conjuros de la lista de clérigo y puedes usar un símbolo sagrado como foco.` },
        { id: "dominio_divino", nombre: "Dominio divino", nivelClase: 1, descripcionResum: "Escoge un dominio que concede rasgos y conjuros asociados.", descripcion: `Tu deidad o ideal te otorga un dominio con rasgos propios.`, selecciones: [{ id: "dominio_clerigo", nombre: "Dominio divino", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu dominio.", opciones: [{ id: "dominio_vida", nombre: "Dominio de la vida" }] }] },
        { id: "canalizar_divinidad", nombre: "Canalizar divinidad", nivelClase: 2, descripcionResum: "Puedes canalizar poder divino para expulsar muertos vivientes u otros efectos de dominio.", descripcion: `Usas una reserva de poder sagrado para producir efectos especiales como expulsar muertos vivientes o activar opciones de tu dominio.` },
        { id: "mejora_caracteristica_clerigo", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "destruir_muertos_vivientes", nombre: "Destruir muertos vivientes", nivelClase: 5, descripcionResum: "Tu Expulsar muertos vivientes puede destruir criaturas débiles de ese tipo.", descripcion: `Cuando expulsas muertos vivientes, los de bajo desafío pueden ser destruidos directamente. El umbral aumenta con tu nivel.` },
        { id: "intervencion_divina", nombre: "Intervención divina", nivelClase: 10, descripcionResum: "Puedes pedir ayuda directa a tu deidad; al nivel 20 tiene éxito automáticamente.", descripcion: `Solicitas auxilio divino con una probabilidad de éxito basada en tu nivel de clérigo. Si tiene éxito, no puedes volver a usarlo durante varios días.` }
      ],
      subclase: [{ id: "dominio_vida", nombre: "Dominio de la vida", descripcionResum: "Dominio centrado en curación, protección y vitalidad.", descripcion: `Este dominio refuerza la magia restauradora y la capacidad defensiva del clérigo.`, rasgos: [
        { id: "competencia_adicional_vida", nombre: "Competencia adicional", nivelClase: 1, descripcionResum: "Ganas competencia con armadura pesada.", descripcion: `Tu dominio te entrena para portar armaduras pesadas.` },
        { id: "discipulo_vida", nombre: "Discípulo de vida", nivelClase: 1, descripcionResum: "Tus conjuros de curación restauran puntos de golpe adicionales.", descripcion: `Cuando lanzas conjuros de curación, añades curación extra según el nivel del conjuro.` },
        { id: "preservar_vida", nombre: "Preservar vida", nivelClase: 2, descripcionResum: "Canalizar divinidad permite repartir curación entre criaturas cercanas.", descripcion: `Puedes canalizar divinidad para restaurar puntos de golpe a varias criaturas dentro de un límite total.` },
        { id: "sanador_bendecido", nombre: "Sanador bendecido", nivelClase: 6, descripcionResum: "Cuando curas a otros con conjuros, también te curas a ti.", descripcion: `Tu magia sanadora te devuelve vitalidad cuando curas a otra criatura con un conjuro.` },
        { id: "golpe_divino_vida", nombre: "Golpe divino", nivelClase: 8, descripcionResum: "Una vez por turno añades daño radiante a un ataque con arma.", descripcion: `Puedes imbuir un ataque de arma con daño radiante adicional; el daño aumenta en niveles altos.` },
        { id: "curacion_suprema", nombre: "Curación suprema", nivelClase: 17, descripcionResum: "Tus dados de curación con conjuros sanan el máximo posible.", descripcion: `Cuando un conjuro tuyo restaura puntos de golpe, los dados de curación cuentan como si hubieran obtenido su resultado máximo.` }
      ] }]
    },
    { id: "druida",
      nombre: "Druida",
      descripcion: "Guardián de la magia natural que invoca fuerzas elementales y adopta formas animales.",
      dadoDeGolpe: 8,
      competencias: { salvaciones: ["INT", "SAB"], habilidades: [], armas: { descripcion: "Garrotes, dagas, dardos, jabalinas, mazas, bastones, cimitarras, hoces, hondas y lanzas", competencias: ["garrote", "daga", "dardo", "jabalina", "maza", "baston", "cimitarra", "hoz", "honda", "lanza"] }, armaduras: { descripcion: "Armaduras ligeras, medias y escudos (normalmente no metálicos)", competencias: ["ligera", "media", "escudo"] }, herramientas: "Kit de herboristería", idiomas: ["Druídico"] },
      rasgos: [
        { id: "competencias_iniciales_druida", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Inteligencia y Sabiduría, equipo druídico y dos habilidades.", descripcion: `Escoge dos habilidades entre Arcanos, Trato con animales, Perspicacia, Medicina, Naturaleza, Percepción, Religión y Supervivencia.`, selecciones: [{ id: "habilidades_druida_n1", nombre: "Habilidades de Druida", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "arcanos", nombre: "Arcanos" }, { id: "trato_con_animales", nombre: "Trato con animales" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "medicina", nombre: "Medicina" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "percepcion", nombre: "Percepción" }, { id: "religion", nombre: "Religión" }, { id: "supervivencia", nombre: "Supervivencia" }] }] },
        { id: "druidico", nombre: "Druídico", nivelClase: 1, descripcionResum: "Conoces el idioma secreto de los druidas.", descripcion: `Puedes hablar y dejar mensajes ocultos en druídico, reconocibles por quienes también conocen este idioma.` },
        { id: "lanzamiento_conjuros_druida", nombre: "Lanzamiento de conjuros", nivelClase: 1, descripcionResum: "Preparas y lanzas conjuros de druida usando Sabiduría.", descripcion: `Tu magia natural usa Sabiduría. Preparas conjuros de druida y puedes usar un foco druídico.` },
        { id: "forma_salvaje", nombre: "Forma salvaje", nivelClase: 2, descripcionResum: "Puedes transformarte en bestias que hayas visto.", descripcion: `Puedes adoptar formas de bestia durante un tiempo limitado. Tus opciones mejoran con el nivel y tu círculo.` },
        { id: "circulo_druidico", nombre: "Círculo druídico", nivelClase: 2, descripcionResum: "Escoge un círculo que concede rasgos en niveles 2, 6, 10 y 14.", descripcion: `Tu círculo define tu relación con la naturaleza y tus rasgos de especialización.`, selecciones: [{ id: "circulo_druidico", nombre: "Círculo druídico", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu círculo.", opciones: [{ id: "circulo_tierra", nombre: "Círculo de la Tierra" }] }] },
        { id: "mejora_caracteristica_druida", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "cuerpo_sin_tiempo", nombre: "Cuerpo sin tiempo", nivelClase: 18, descripcionResum: "Tu envejecimiento se ralentiza enormemente.", descripcion: `La magia primigenia ralentiza tu vejez hasta hacer que pase casi inadvertida.` },
        { id: "conjuros_bestia", nombre: "Conjuros de bestia", nivelClase: 18, descripcionResum: "Puedes lanzar muchos conjuros de druida estando en Forma salvaje.", descripcion: `Puedes completar componentes de muchos conjuros de druida incluso mientras estás transformado.` },
        { id: "archidruida", nombre: "Archidruida", nivelClase: 20, descripcionResum: "Puedes usar Forma salvaje sin límite de usos.", descripcion: `Tu dominio de la Forma salvaje deja de estar limitado por usos normales.` }
      ],
      subclase: [{ id: "circulo_tierra", nombre: "Círculo de la Tierra", descripcionResum: "Druidas ligados a regiones y magia natural recuperadora.", descripcion: `Este círculo ofrece magia adicional según tierra elegida y recuperación de energía mágica.`, rasgos: [
        { id: "truco_adicional_tierra", nombre: "Truco adicional", nivelClase: 2, descripcionResum: "Aprendes un truco adicional de druida.", descripcion: `Aprendes un truco de druida extra a tu elección.` },
        { id: "recuperacion_natural", nombre: "Recuperación natural", nivelClase: 2, descripcionResum: "Durante un descanso breve recuperas espacios de conjuro limitados.", descripcion: `Una vez al día tras descansar brevemente, recuperas parte de tu poder mágico gastado.` },
        { id: "zancada_tierra", nombre: "Zancada de la tierra", nivelClase: 6, descripcionResum: "Te mueves mejor por terreno difícil no mágico y resistes ciertas plantas mágicas.", descripcion: `El terreno natural complicado te frena menos, y tienes ventaja contra plantas creadas o manipuladas mágicamente para obstaculizarte.` },
        { id: "custodia_naturaleza", nombre: "Custodia de la naturaleza", nivelClase: 10, descripcionResum: "Inmunidad a veneno y enfermedad; protección contra encantos y miedo de elementales y feéricos.", descripcion: `La naturaleza te protege contra venenos, enfermedades y ciertas influencias de elementales y feéricos.` },
        { id: "santuario_naturaleza", nombre: "Santuario de la naturaleza", nivelClase: 14, descripcionResum: "Bestias y plantas tienen dificultades para atacarte.", descripcion: `Las criaturas naturales sienten tu vínculo con la naturaleza y deben superar una salvación para atacarte.` }
      ] }]
    },
    { id: "explorador",
      nombre: "Explorador",
      descripcion: "Especialista de frontera que combina rastreo, supervivencia, armas y magia natural.",
      dadoDeGolpe: 10,
      competencias: { salvaciones: ["FUE", "DES"], habilidades: [], armas: { descripcion: "Armas simples y marciales", competencias: ["armasSimples", "armasMarciales"] }, armaduras: { descripcion: "Armaduras ligeras, medias y escudos", competencias: ["ligera", "media", "escudo"] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_explorador", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Fuerza y Destreza, armaduras ligeras y medias, escudos, armas simples y marciales, y tres habilidades.", descripcion: `Escoge tres habilidades entre Trato con animales, Atletismo, Perspicacia, Investigación, Naturaleza, Percepción, Sigilo y Supervivencia.`, selecciones: [{ id: "habilidades_explorador_n1", nombre: "Habilidades de Explorador", tipo: "habilidad", cantidadSeleccionable: 3, descripcion: "Escoge tres habilidades.", opciones: [{ id: "trato_con_animales", nombre: "Trato con animales" }, { id: "atletismo", nombre: "Atletismo" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "investigacion", nombre: "Investigación" }, { id: "naturaleza", nombre: "Naturaleza" }, { id: "percepcion", nombre: "Percepción" }, { id: "sigilo", nombre: "Sigilo" }, { id: "supervivencia", nombre: "Supervivencia" }] }] },
        { id: "enemigo_predilecto", nombre: "Enemigo predilecto", nivelClase: 1, descripcionResum: "Elige enemigos contra los que eres mejor rastreador y estudioso.", descripcion: `Escoge tipos de criaturas. Tienes ventajas narrativas y de rastreo relacionadas con ellas, y aprendes idiomas asociados según corresponda.` },
        { id: "explorador_natural", nombre: "Explorador natural", nivelClase: 1, descripcionResum: "Elige terrenos en los que viajas y sobrevives con gran eficacia.", descripcion: `Escoge un terreno predilecto. En ese entorno ayudas al grupo a viajar, orientarse, rastrear y encontrar recursos con mayor eficacia.` },
        { id: "estilo_combate_explorador", nombre: "Estilo de Combate", nivelClase: 2, descripcionResum: "Elige una especialidad marcial de explorador.", descripcion: `Adoptas un estilo de combate como especialidad.`, selecciones: [{ id: "estilo_combate_explorador", nombre: "Estilo de Combate", tipo: "estilo_combate", tipoPlural: "estilos de combate", cantidadSeleccionable: 1, descripcion: "Escoge un estilo de combate.", fuenteOpciones: { coleccion: "opcionesCompartidas.estilosCombate", incluirIds: ["arqueria", "defensa", "duelo", "dos_armas"] } }] },
        { id: "lanzamiento_conjuros_explorador", nombre: "Lanzamiento de conjuros", nivelClase: 2, descripcionResum: "Lanzas conjuros de explorador usando Sabiduría.", descripcion: `Aprendes conjuros de explorador; tu aptitud mágica es Sabiduría.` },
        { id: "arquetipo_explorador", nombre: "Arquetipo de explorador", nivelClase: 3, descripcionResum: "Escoge un arquetipo que concede rasgos en niveles 3, 7, 11 y 15.", descripcion: `Tu forma de cazar y sobrevivir se concreta en un arquetipo.`, selecciones: [{ id: "arquetipo_explorador", nombre: "Arquetipo de explorador", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu arquetipo.", opciones: [{ id: "cazador", nombre: "Cazador" }] }] },
        { id: "consciencia_primigenia", nombre: "Consciencia primigenia", nivelClase: 3, descripcionResum: "Puedes detectar la presencia de ciertos tipos de criaturas en una región.", descripcion: `Gastando magia, percibes si hay aberraciones, celestiales, dragones, elementales, feéricos, infernales o muertos vivientes cercanos.` },
        { id: "mejora_caracteristica_explorador", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "ataque_adicional_explorador", nombre: "Ataque adicional", nivelClase: 5, descripcionResum: "Puedes atacar dos veces cuando usas la acción de Ataque.", descripcion: `Cuando realizas la acción de Ataque en tu turno, haces dos ataques en lugar de uno.` },
        { id: "zancada_tierra_explorador", nombre: "Zancada de la tierra", nivelClase: 8, descripcionResum: "El terreno difícil no mágico te frena menos y resistes vegetación mágica obstructiva.", descripcion: `Puedes moverte por terreno difícil no mágico sin coste extra y tienes ventaja contra plantas mágicas que obstaculicen.` },
        { id: "ocultarse_vista", nombre: "Ocultarse a plena vista", nivelClase: 10, descripcionResum: "Puedes camuflarte durante un minuto para obtener un gran bono de Sigilo mientras permanezcas quieto.", descripcion: `Preparas camuflaje natural para ocultarte con eficacia mientras no te muevas ni realices acciones llamativas.`, efectos: [{ tipoDeEfecto: "bono_habilidad", habilidadAfectada: "Sigilo", valor: 10, condicion: { inmovil: true } }] },
        { id: "desvanecerse", nombre: "Desvanecerse", nivelClase: 14, descripcionResum: "Puedes esconderte como acción adicional y no puedes ser rastreado por medios no mágicos salvo que dejes rastro.", descripcion: `Tu sigilo mejora hasta permitirte esconderte con acción adicional y evitar rastreo no mágico cuando no dejas rastro intencionado.` },
        { id: "sentidos_salvajes", nombre: "Sentidos salvajes", nivelClase: 18, descripcionResum: "Percibes mejor a criaturas invisibles cercanas.", descripcion: `Tu instinto te ayuda a combatir enemigos que no puedes ver si están cerca y no se ocultan de ti.` },
        { id: "azote_enemigos", nombre: "Azote de enemigos", nivelClase: 20, descripcionResum: "Puedes sumar Sabiduría una vez por turno contra enemigos predilectos.", descripcion: `Una vez en cada turno puedes aplicar tu Sabiduría a una tirada contra un enemigo predilecto apropiado.` }
      ],
      subclase: [{ id: "cazador", nombre: "Cazador", descripcionResum: "Explorador centrado en abatir amenazas con técnicas especializadas.", descripcion: `El cazador elige tácticas contra presas numerosas, grandes o escurridizas.`, rasgos: [
        { id: "presa_cazador", nombre: "Presa del cazador", nivelClase: 3, descripcionResum: "Elige una técnica ofensiva especializada.", descripcion: `Escoge una opción como daño extra a enemigos heridos, respuestas contra criaturas grandes o ataques contra enemigos agrupados.` },
        { id: "tacticas_defensivas", nombre: "Tácticas defensivas", nivelClase: 7, descripcionResum: "Elige una defensa contra amenazas concretas.", descripcion: `Escoge una opción defensiva que te protege contra ataques de oportunidad, multiataques o miedo.` },
        { id: "multiataque_cazador", nombre: "Multiataque", nivelClase: 11, descripcionResum: "Elige una técnica para atacar a varios enemigos.", descripcion: `Aprendes una opción de multiataque que mejora tu capacidad contra grupos.` },
        { id: "defensa_cazador_superior", nombre: "Defensa superior del cazador", nivelClase: 15, descripcionResum: "Elige una defensa avanzada.", descripcion: `Obtienes una opción defensiva superior para resistir o evitar daño.` }
      ] }]
    },
    { id: "guerrero",
      nombre: "Guerrero",
      descripcion: "Maestro versátil de armas, armaduras y tácticas de combate.",
      dadoDeGolpe: 10,
      competencias: { salvaciones: ["FUE", "CON"], habilidades: [], armas: { descripcion: "Armas simples y marciales", competencias: ["armasSimples", "armasMarciales"] }, armaduras: { descripcion: "Todas las armaduras y escudos", competencias: ["ligera", "media", "pesada", "escudo"] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_guerrero", nombre: "Competencias Iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Fuerza y Constitución, todas las armaduras, escudos, armas simples y marciales, y dos habilidades.", descripcion: `Escoge dos habilidades entre Acrobacias, Atletismo, Historia, Intimidación, Trato con animales, Percepción, Perspicacia y Supervivencia.`, selecciones: [{ id: "habilidades_guerrero_n1", nombre: "Habilidades de Guerrero", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "acrobacias", nombre: "Acrobacias" }, { id: "atletismo", nombre: "Atletismo" }, { id: "historia", nombre: "Historia" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "trato_con_animales", nombre: "Trato con animales" }, { id: "percepcion", nombre: "Percepción" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "supervivencia", nombre: "Supervivencia" }] }] },
        { id: "estilo_combate_guerrero", nombre: "Estilo de Combate", nivelClase: 1, descripcionResum: "Elige una especialidad marcial.", descripcion: `Adoptas un estilo de combate como especialidad. No puedes elegir dos veces el mismo estilo.`, selecciones: [{ id: "estilo_combate", nombre: "Estilo de Combate", tipo: "estilo_combate", tipoPlural: "estilos de combate", cantidadSeleccionable: 1, descripcion: "Escoge un estilo de combate.", fuenteOpciones: { coleccion: "opcionesCompartidas.estilosCombate", incluirIds: ["arqueria", "defensa", "duelo", "a_dos_manos", "proteccion", "dos_armas"] } }] },
        { id: "tomar_aliento", nombre: "Tomar Aliento", nivelClase: 1, descripcionResum: "Como acción adicional recuperas 1d10 + tu nivel de guerrero PG una vez por descanso.", descripcion: `En tu turno puedes usar una acción adicional para recuperar puntos de golpe. Recuperas el uso al terminar un descanso breve o prolongado.` },
        { id: "accion_subita", nombre: "Acción Súbita", nivelClase: 2, descripcionResum: "Una vez por descanso puedes realizar una acción adicional en tu turno.", descripcion: `Puedes sobrepasar tus límites y tomar una acción más además de tu acción normal y posible acción adicional. En niveles altos obtienes más usos.` },
        { id: "arquetipo_marcial", nombre: "Arquetipo Marcial", nivelClase: 3, descripcionResum: "Escoge un arquetipo que concede rasgos en niveles 3, 7, 10, 15 y 18.", descripcion: `Tu técnica marcial se especializa en un arquetipo concreto.`, selecciones: [{ id: "arquetipo_guerrero", nombre: "Arquetipo Marcial", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu arquetipo.", opciones: [{ id: "campeon", nombre: "Campeón" }] }] },
        { id: "mejora_caracteristica_guerrero", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 6, 8, 12, 14, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "ataque_adicional_guerrero", nombre: "Ataque adicional", nivelClase: 5, descripcionResum: "Puedes atacar más veces al usar la acción de Ataque.", descripcion: `Atacas dos veces al usar la acción de Ataque; este número aumenta en niveles 11 y 20.` },
        { id: "indomable", nombre: "Indomable", nivelClase: 9, descripcionResum: "Puedes repetir una tirada de salvación fallida; obtienes más usos en niveles altos.", descripcion: `Cuando fallas una tirada de salvación, puedes repetirla y debes usar el nuevo resultado. Recuperas usos al terminar un descanso prolongado.` }
      ],
      subclase: [{ id: "campeon", nombre: "Campeón", descripcionResum: "Perfecciona el combate físico directo.", descripcion: `El campeón destaca por resistencia, atletismo y golpes críticos frecuentes.`, rasgos: [
        { id: "critico_mejorado", nombre: "Crítico Mejorado", nivelClase: 3, descripcionResum: "Tus ataques de arma hacen crítico con 19 o 20.", descripcion: `Tus ataques con arma obtienen golpe crítico con una tirada de 19 o 20 en el d20.` },
        { id: "atleta_destacado", nombre: "Atleta destacado", nivelClase: 7, descripcionResum: "Añades mitad de competencia a pruebas físicas sin competencia y saltas más lejos.", descripcion: `Añades la mitad de tu bonificador de competencia a pruebas de Fuerza, Destreza o Constitución en las que no seas competente; además, tus saltos con carrera mejoran.`, efectos: [{ tipoDeEfecto: "bono_prueba_stat", statsAfectadas: ["FUE", "DES", "CON"], valor: "mitad_competencia", condicion: { competencia: false } }] },
        { id: "estilo_combate_adicional", nombre: "Estilo de combate adicional", nivelClase: 10, descripcionResum: "Obtienes un segundo estilo de combate.", descripcion: `Escoge otro estilo de combate disponible para guerrero.`, selecciones: [{ id: "estilo_combate_campeon", nombre: "Estilo de Combate adicional", tipo: "estilo_combate", tipoPlural: "estilos de combate", cantidadSeleccionable: 1, descripcion: "Escoge otro estilo.", fuenteOpciones: { coleccion: "opcionesCompartidas.estilosCombate", incluirIds: ["arqueria", "defensa", "duelo", "a_dos_manos", "proteccion", "dos_armas"] } }] },
        { id: "critico_superior", nombre: "Crítico superior", nivelClase: 15, descripcionResum: "Tus ataques de arma hacen crítico con 18, 19 o 20.", descripcion: `Tu rango de crítico con ataques de arma se amplía a 18-20.` },
        { id: "superviviente", nombre: "Superviviente", nivelClase: 18, descripcionResum: "Regeneras PG al inicio del turno si estás herido pero no a 0.", descripcion: `Si tienes pocos puntos de golpe pero no estás a 0, recuperas puntos al inicio de tus turnos.` }
      ] }]
    },
    { id: "hechicero",
      nombre: "Hechicero",
      descripcion: "Lanzador de conjuros con magia innata que moldea sus conjuros mediante poder interior.",
      dadoDeGolpe: 6,
      competencias: { salvaciones: ["CON", "CAR"], habilidades: [], armas: { descripcion: "Dagas, dardos, hondas, bastones y ballestas ligeras", competencias: ["daga", "dardo", "honda", "baston", "ballestaLigera"] }, armaduras: { descripcion: "Ninguna", competencias: [] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_hechicero", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Constitución y Carisma, armas sencillas de lanzador y dos habilidades.", descripcion: `Escoge dos habilidades entre Arcanos, Engañar, Perspicacia, Intimidación, Persuasión y Religión.`, selecciones: [{ id: "habilidades_hechicero_n1", nombre: "Habilidades de Hechicero", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "arcanos", nombre: "Arcanos" }, { id: "enganar", nombre: "Engañar" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "persuasion", nombre: "Persuasión" }, { id: "religion", nombre: "Religión" }] }] },
        { id: "lanzamiento_conjuros_hechicero", nombre: "Lanzamiento de conjuros", nivelClase: 1, descripcionResum: "Lanzas conjuros de hechicero usando Carisma.", descripcion: `Tu magia innata usa Carisma. Conoces trucos y conjuros de hechicero y utilizas espacios de conjuro para lanzarlos.` },
        { id: "origen_hechicero", nombre: "Origen hechicero", nivelClase: 1, descripcionResum: "Escoge el origen de tu magia innata.", descripcion: `Tu fuente de poder determina rasgos adicionales.`, selecciones: [{ id: "origen_hechicero", nombre: "Origen hechicero", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu origen.", opciones: [{ id: "linaje_dragon", nombre: "Linaje de dragón" }] }] },
        { id: "fuente_magia", nombre: "Fuente de magia", nivelClase: 2, descripcionResum: "Obtienes puntos de hechicería para crear espacios o alimentar rasgos.", descripcion: `Tienes puntos de hechicería que puedes convertir en espacios de conjuro o emplear en opciones especiales.` },
        { id: "metamagia", nombre: "Metamagia", nivelClase: 3, descripcionResum: "Elige opciones para modificar tus conjuros.", descripcion: `Puedes gastar puntos de hechicería para alterar alcance, duración, objetivos u otros aspectos de tus conjuros.` },
        { id: "mejora_caracteristica_hechicero", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "restauracion_hechicera", nombre: "Restauración hechicera", nivelClase: 20, descripcionResum: "Recuperas puntos de hechicería al terminar un descanso breve.", descripcion: `Al completar un descanso breve, recuperas parte de tus puntos de hechicería.` }
      ],
      subclase: [{ id: "linaje_dragon", nombre: "Linaje de dragón", descripcionResum: "Tu magia procede de sangre o influencia dracónica.", descripcion: `Este origen mejora tu resistencia física y afinidad elemental.`, rasgos: [
        { id: "ancestro_dragon", nombre: "Ancestro de dragón", nivelClase: 1, descripcionResum: "Elige un tipo de dragón asociado a un daño elemental y aprendes Dracónico.", descripcion: `Tu linaje define un tipo de daño asociado y te concede afinidad lingüística con los dragones.` },
        { id: "resistencia_draconica", nombre: "Resistencia dracónica", nivelClase: 1, descripcionResum: "+1 PG por nivel de hechicero y CA 13 + DES sin armadura.", descripcion: `Tus escamas o vigor dracónico aumentan tu resistencia. Cuando no llevas armadura, tu CA es 13 + tu modificador de Destreza.`, efectos: [{ tipoDeEfecto: "caSinArmadura", base: 13, modificadores: ["DES"], condicion: { sinArmadura: true } }] },
        { id: "afinidad_elemental", nombre: "Afinidad elemental", nivelClase: 6, descripcionResum: "Añades Carisma al daño de conjuros de tu elemento y puedes ganar resistencia.", descripcion: `Cuando lanzas magia del tipo asociado a tu linaje, puedes añadir Carisma al daño y gastar recursos para resistir ese daño.` },
        { id: "alas_dragon", nombre: "Alas de dragón", nivelClase: 14, descripcionResum: "Puedes desplegar alas y obtener velocidad de vuelo igual a tu velocidad actual.", descripcion: `Puedes manifestar alas dracónicas, obteniendo velocidad de vuelo mientras estén desplegadas.` },
        { id: "presencia_draconica", nombre: "Presencia dracónica", nivelClase: 18, descripcionResum: "Puedes gastar puntos de hechicería para asustar o encantar criaturas cercanas.", descripcion: `Irradias majestad dracónica para provocar temor o fascinación en criaturas cercanas.` }
      ] }]
    },
    { id: "mago",
      nombre: "Mago",
      descripcion: "Estudioso arcano que prepara conjuros desde un libro y domina fórmulas mágicas complejas.",
      dadoDeGolpe: 6,
      competencias: { salvaciones: ["INT", "SAB"], habilidades: [], armas: { descripcion: "Dagas, dardos, hondas, bastones y ballestas ligeras", competencias: ["daga", "dardo", "honda", "baston", "ballestaLigera"] }, armaduras: { descripcion: "Ninguna", competencias: [] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_mago", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Inteligencia y Sabiduría, armas sencillas de lanzador y dos habilidades.", descripcion: `Escoge dos habilidades entre Arcanos, Historia, Perspicacia, Investigación, Medicina y Religión.`, selecciones: [{ id: "habilidades_mago_n1", nombre: "Habilidades de Mago", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "arcanos", nombre: "Arcanos" }, { id: "historia", nombre: "Historia" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "investigacion", nombre: "Investigación" }, { id: "medicina", nombre: "Medicina" }, { id: "religion", nombre: "Religión" }] }] },
        { id: "lanzamiento_conjuros_mago", nombre: "Lanzamiento de conjuros", nivelClase: 1, descripcionResum: "Preparas y lanzas conjuros de mago usando Inteligencia y tu libro de conjuros.", descripcion: `Tu magia usa Inteligencia. Copias conjuros en tu libro, preparas una selección diaria y puedes lanzar rituales de mago desde él.` },
        { id: "recuperacion_arcana", nombre: "Recuperación arcana", nivelClase: 1, descripcionResum: "Una vez al día, tras un descanso breve recuperas espacios de conjuro limitados.", descripcion: `Después de descansar brevemente, recuperas parte de tus espacios de conjuro gastados.` },
        { id: "tradicion_arcana", nombre: "Tradición arcana", nivelClase: 2, descripcionResum: "Escoge una tradición que concede rasgos en niveles 2, 6, 10 y 14.", descripcion: `Tu estudio se especializa en una tradición arcana.`, selecciones: [{ id: "tradicion_arcana", nombre: "Tradición arcana", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu tradición.", opciones: [{ id: "escuela_evocacion", nombre: "Escuela de Evocación" }] }] },
        { id: "mejora_caracteristica_mago", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "maestria_conjuros", nombre: "Maestría de conjuros", nivelClase: 18, descripcionResum: "Elige conjuros de bajo nivel que puedes lanzar a voluntad.", descripcion: `Seleccionas conjuros de nivel bajo de tu libro para lanzarlos sin gastar espacios, salvo que quieras potenciarlos.` },
        { id: "conjuros_firma", nombre: "Conjuros de firma", nivelClase: 20, descripcionResum: "Preparas dos conjuros de nivel 3 como firmas con uso gratuito limitado.", descripcion: `Dos conjuros de nivel 3 de tu libro siempre están preparados y puedes lanzar cada uno una vez sin gastar espacio antes de descansar.` }
      ],
      subclase: [{ id: "escuela_evocacion", nombre: "Escuela de Evocación", descripcionResum: "Especialista en energía arcana destructiva y controlada.", descripcion: `La evocación moldea energía para causar daño sin comprometer tanto a los aliados.`, rasgos: [
        { id: "erudito_evocacion", nombre: "Erudito de la evocación", nivelClase: 2, descripcionResum: "Copiar conjuros de evocación en tu libro cuesta menos oro y tiempo.", descripcion: `Tu especialización reduce el coste y tiempo de transcribir conjuros de evocación.` },
        { id: "esculpir_conjuros", nombre: "Esculpir conjuros", nivelClase: 2, descripcionResum: "Puedes proteger aliados dentro de ciertos conjuros de evocación.", descripcion: `Al lanzar evocaciones de área, puedes elegir criaturas protegidas que superan automáticamente la salvación y evitan daño si normalmente reducirían a la mitad.` },
        { id: "truco_potente", nombre: "Truco potente", nivelClase: 6, descripcionResum: "Tus trucos de salvación causan daño parcial incluso si el objetivo supera la salvación.", descripcion: `Cuando una criatura supera la salvación contra uno de tus trucos dañinos, recibe parte del daño.` },
        { id: "evocacion_potenciada", nombre: "Evocación potenciada", nivelClase: 10, descripcionResum: "Añades Inteligencia a una tirada de daño de evocación.", descripcion: `Tus conjuros de evocación golpean con más fuerza al añadir tu modificador de Inteligencia a una tirada de daño.` },
        { id: "sobrecargar", nombre: "Sobrecargar", nivelClase: 14, descripcionResum: "Puedes maximizar daño de conjuros de evocación de nivel bajo con riesgo al repetirlo.", descripcion: `Puedes maximizar el daño de ciertos conjuros de evocación; usarlo repetidamente antes de descansar te daña.` }
      ] }]
    },
    { id: "monje",
      nombre: "Monje",
      descripcion: "Combatiente disciplinado que canaliza ki para defenderse, moverse y golpear con precisión.",
      dadoDeGolpe: 8,
      competencias: { salvaciones: ["FUE", "DES"], habilidades: [], armas: { descripcion: "Armas simples y espadas cortas", competencias: ["armasSimples", "espadaCorta"] }, armaduras: { descripcion: "Ninguna", competencias: [] }, herramientas: "Un tipo de herramienta de artesano o instrumento musical", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_monje", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Fuerza y Destreza, armas simples, espada corta, una herramienta o instrumento y dos habilidades.", descripcion: `Escoge dos habilidades entre Acrobacias, Atletismo, Historia, Perspicacia, Religión y Sigilo.`, selecciones: [{ id: "habilidades_monje_n1", nombre: "Habilidades de Monje", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "acrobacias", nombre: "Acrobacias" }, { id: "atletismo", nombre: "Atletismo" }, { id: "historia", nombre: "Historia" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "religion", nombre: "Religión" }, { id: "sigilo", nombre: "Sigilo" }] }] },
        { id: "defensa_sin_armadura_monje", nombre: "Defensa sin Armadura", nivelClase: 1, descripcionResum: "Sin armadura ni escudo, tu CA es 10 + DES + SAB.", descripcion: `Mientras no lleves armadura ni escudo, calculas tu Clase de Armadura como 10 + tu modificador de Destreza + tu modificador de Sabiduría.`, efectos: [{ tipoDeEfecto: "caSinArmadura", base: 10, modificadores: ["DES", "SAB"], condicion: { sinArmadura: true, sinEscudo: true } }] },
        { id: "artes_marciales", nombre: "Artes marciales", nivelClase: 1, descripcionResum: "Sin armadura ni escudo, mejoras ataques sin armas y armas de monje.", descripcion: `Mientras no llevas armadura ni escudo, puedes usar Destreza para ataques y daño de impactos sin armas o armas de monje, usar tu dado marcial y atacar sin armas como acción adicional tras atacar.` },
        { id: "ki", nombre: "Ki", nivelClase: 2, descripcionResum: "Gastas puntos de ki para activar técnicas como ráfaga, defensa paciente y paso del viento.", descripcion: `Tu reserva de ki equivale a tu nivel de monje y se recupera al descansar. La CD de tus efectos de ki usa Sabiduría.` },
        { id: "rafaga_golpes", nombre: "Ráfaga de golpes", nivelClase: 2, descripcionResum: "Gasta ki para realizar dos impactos sin armas como acción adicional tras atacar.", descripcion: `Después de usar la acción de Ataque, puedes gastar 1 ki para hacer dos impactos sin armas como acción adicional.` },
        { id: "defensa_paciente", nombre: "Defensa paciente", nivelClase: 2, descripcionResum: "Gasta ki para Esquivar como acción adicional.", descripcion: `Puedes gastar 1 ki para realizar la acción de Esquivar como acción adicional en tu turno.` },
        { id: "paso_viento", nombre: "Paso del viento", nivelClase: 2, descripcionResum: "Gasta ki para Retirarte o Esprintar como acción adicional y saltar más lejos.", descripcion: `Puedes gastar 1 ki para retirarte o esprintar como acción adicional; durante ese turno duplicas tu distancia de salto.` },
        { id: "movimiento_sin_armadura_2", nombre: "Movimiento sin Armadura", nivelClase: 2, descripcionResum: "+10 pies de velocidad sin armadura ni escudo.", descripcion: `Tu velocidad aumenta mientras no lleves armadura ni escudo; el bonificador crece con tu nivel de monje.`, efectos: [{ tipoDeEfecto: "bono_velocidad", valor: 10, condicion: { sinArmadura: true, sinEscudo: true } }] },
        { id: "tradicion_monastica", nombre: "Tradición monástica", nivelClase: 3, descripcionResum: "Escoge una tradición que concede rasgos en niveles 3, 6, 11 y 17.", descripcion: `Tu entrenamiento se concreta en una tradición monástica.`, selecciones: [{ id: "tradicion_monastica", nombre: "Tradición monástica", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu tradición.", opciones: [{ id: "mano_abierta", nombre: "Camino de la mano abierta" }] }] },
        { id: "desviar_proyectiles", nombre: "Desviar proyectiles", nivelClase: 3, descripcionResum: "Como reacción reduces daño de ataques a distancia y puedes devolver el proyectil.", descripcion: `Al ser alcanzado por un ataque de arma a distancia, puedes reducir el daño. Si lo reduces a 0, puedes atrapar el proyectil y gastar ki para contraatacar.` },
        { id: "mejora_caracteristica_monje", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "caida_lenta", nombre: "Caída lenta", nivelClase: 4, descripcionResum: "Como reacción reduces daño por caída en 5 × tu nivel de monje.", descripcion: `Puedes usar tu reacción al caer para reducir el daño por caída en una cantidad basada en tu nivel.` },
        { id: "ataque_adicional_monje", nombre: "Ataque adicional", nivelClase: 5, descripcionResum: "Puedes atacar dos veces cuando usas la acción de Ataque.", descripcion: `Cuando realizas la acción de Ataque en tu turno, haces dos ataques en lugar de uno.` },
        { id: "golpe_aturdidor", nombre: "Golpe aturdidor", nivelClase: 5, descripcionResum: "Gasta ki al impactar cuerpo a cuerpo para intentar aturdir al objetivo.", descripcion: `Cuando impactas con un ataque de arma cuerpo a cuerpo, puedes gastar ki para forzar una salvación de Constitución; si falla, el objetivo queda aturdido hasta el final de tu siguiente turno.` },
        { id: "movimiento_sin_armadura_6", nombre: "Movimiento sin Armadura mejorado", nivelClase: 6, descripcionResum: "El bonificador de velocidad sin armadura aumenta.", descripcion: `Tu movimiento sin armadura mejora con la práctica.`, efectos: [{ tipoDeEfecto: "bono_velocidad", valor: 5, condicion: { sinArmadura: true, sinEscudo: true } }] },
        { id: "impactos_ki", nombre: "Impactos de ki", nivelClase: 6, descripcionResum: "Tus impactos sin armas cuentan como mágicos contra resistencias e inmunidades.", descripcion: `Tus golpes sin armas se consideran mágicos para superar resistencia e inmunidad a daño no mágico.` },
        { id: "evasion_monje", nombre: "Evasión", nivelClase: 7, descripcionResum: "En salvaciones de Destreza de mitad de daño, evitas todo con éxito y recibes mitad al fallar.", descripcion: `Tu agilidad reduce o niega daños de área que permitan salvación de Destreza para recibir mitad.` },
        { id: "quietud_mente", nombre: "Quietud de la mente", nivelClase: 7, descripcionResum: "Puedes usar tu acción para terminar un efecto que te asuste o hechice.", descripcion: `Con disciplina mental, puedes gastar tu acción para finalizar sobre ti un efecto de miedo o hechizo.` },
        { id: "movimiento_vertical", nombre: "Movimiento sin armadura mejorado", nivelClase: 9, descripcionResum: "Puedes moverte por superficies verticales y líquidos durante tu turno sin caer mientras te mueves.", descripcion: `Mientras te mueves, puedes cruzar superficies verticales y líquidos sin caer durante ese turno.` },
        { id: "pureza_cuerpo", nombre: "Pureza del cuerpo", nivelClase: 10, descripcionResum: "Eres inmune a enfermedades y venenos.", descripcion: `Tu dominio del ki te vuelve inmune a enfermedades y venenos.` },
        { id: "movimiento_sin_armadura_10", nombre: "Movimiento sin Armadura avanzado", nivelClase: 10, descripcionResum: "El bonificador de velocidad sin armadura aumenta.", descripcion: `Tu movimiento sin armadura vuelve a mejorar.`, efectos: [{ tipoDeEfecto: "bono_velocidad", valor: 5, condicion: { sinArmadura: true, sinEscudo: true } }] },
        { id: "lengua_sol_luna", nombre: "Lengua del sol y la luna", nivelClase: 13, descripcionResum: "Entiendes todos los idiomas hablados y quienes conozcan algún idioma entienden tus palabras.", descripcion: `Tu ki te permite comunicarte por encima de las barreras idiomáticas habladas.` },
        { id: "movimiento_sin_armadura_14", nombre: "Movimiento sin Armadura experto", nivelClase: 14, descripcionResum: "El bonificador de velocidad sin armadura aumenta.", descripcion: `Tu movimiento sin armadura continúa aumentando.`, efectos: [{ tipoDeEfecto: "bono_velocidad", valor: 5, condicion: { sinArmadura: true, sinEscudo: true } }] },
        { id: "alma_diamante", nombre: "Alma de diamante", nivelClase: 14, descripcionResum: "Ganas competencia en todas las tiradas de salvación y puedes gastar ki para repetir salvaciones fallidas.", descripcion: `Tu maestría del ki refuerza todas tus salvaciones y te permite repetir una salvación fallida gastando ki.` },
        { id: "cuerpo_eterno", nombre: "Cuerpo eterno", nivelClase: 15, descripcionResum: "No envejeces mágicamente y ya no necesitas comida ni agua.", descripcion: `Tu ki evita la fragilidad de la vejez, te protege del envejecimiento mágico y elimina tu necesidad de alimento y agua.` },
        { id: "movimiento_sin_armadura_18", nombre: "Movimiento sin Armadura supremo", nivelClase: 18, descripcionResum: "El bonificador de velocidad sin armadura aumenta.", descripcion: `Tu velocidad sin armadura alcanza su mayor bonificador.`, efectos: [{ tipoDeEfecto: "bono_velocidad", valor: 5, condicion: { sinArmadura: true, sinEscudo: true } }] },
        { id: "cuerpo_vacio", nombre: "Cuerpo vacío", nivelClase: 18, descripcionResum: "Puedes gastar ki para volverte invisible y resistir casi todo daño temporalmente.", descripcion: `Puedes gastar ki para volverte invisible durante un minuto y ganar resistencia a la mayoría de daños.` },
        { id: "yo_perfecto", nombre: "Yo perfecto", nivelClase: 20, descripcionResum: "Si tiras iniciativa sin ki, recuperas 4 puntos de ki.", descripcion: `Cuando tiras iniciativa y no te quedan puntos de ki, recuperas 4.` }
      ],
      subclase: [{ id: "mano_abierta", nombre: "Camino de la mano abierta", descripcionResum: "Maestros del combate sin armas y del control del ki propio y ajeno.", descripcion: `Esta tradición usa ráfagas y precisión para derribar, empujar, curarse y protegerse.`, rasgos: [
        { id: "tecnica_mano_abierta", nombre: "Técnica de la mano abierta", nivelClase: 3, descripcionResum: "Tus Ráfagas de golpes pueden derribar, empujar o impedir reacciones.", descripcion: `Cuando impactas con Ráfaga de golpes, puedes añadir efectos de control contra el objetivo.` },
        { id: "plenitud_cuerpo", nombre: "Plenitud del cuerpo", nivelClase: 6, descripcionResum: "Puedes curarte a ti mismo una vez por descanso prolongado.", descripcion: `Como acción, recuperas puntos de golpe basados en tu nivel de monje.` },
        { id: "tranquilidad", nombre: "Tranquilidad", nivelClase: 11, descripcionResum: "Tras un descanso prolongado obtienes un efecto protector similar a santuario.", descripcion: `Al terminar un descanso prolongado, quedas envuelto en una calma protectora hasta que ataques o lances conjuros dañinos.` },
        { id: "palma_temblorosa", nombre: "Palma temblorosa", nivelClase: 17, descripcionResum: "Puedes implantar vibraciones letales con un impacto sin armas.", descripcion: `Gastando ki al impactar sin armas, dejas vibraciones que después puedes activar para dañar gravemente al objetivo.` }
      ] }]
    },
    { id: "paladin",
      nombre: "Paladín",
      descripcion: "Campeón juramentado que combina armas, armaduras, magia divina y auras protectoras.",
      dadoDeGolpe: 10,
      competencias: { salvaciones: ["SAB", "CAR"], habilidades: [], armas: { descripcion: "Armas simples y marciales", competencias: ["armasSimples", "armasMarciales"] }, armaduras: { descripcion: "Todas las armaduras y escudos", competencias: ["ligera", "media", "pesada", "escudo"] }, herramientas: "Ninguna", idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_paladin", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Sabiduría y Carisma, todas las armaduras, escudos, armas simples y marciales, y dos habilidades.", descripcion: `Escoge dos habilidades entre Atletismo, Perspicacia, Intimidación, Medicina, Persuasión y Religión.`, selecciones: [{ id: "habilidades_paladin_n1", nombre: "Habilidades de Paladín", tipo: "habilidad", cantidadSeleccionable: 2, descripcion: "Escoge dos habilidades.", opciones: [{ id: "atletismo", nombre: "Atletismo" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "medicina", nombre: "Medicina" }, { id: "persuasion", nombre: "Persuasión" }, { id: "religion", nombre: "Religión" }] }] },
        { id: "sentido_divino", nombre: "Sentido divino", nivelClase: 1, descripcionResum: "Detectas celestiales, infernales, muertos vivientes y lugares consagrados o profanados cercanos.", descripcion: `Como acción, abres tus sentidos para notar presencias sobrenaturales cercanas y naturaleza sagrada o profana de lugares u objetos.` },
        { id: "imposicion_manos", nombre: "Imposición de manos", nivelClase: 1, descripcionResum: "Tienes una reserva de curación igual a 5 × tu nivel de paladín.", descripcion: `Puedes tocar a una criatura para restaurar puntos de golpe desde una reserva o neutralizar enfermedades y venenos gastando parte de ella.` },
        { id: "estilo_combate_paladin", nombre: "Estilo de Combate", nivelClase: 2, descripcionResum: "Elige una especialidad marcial de paladín.", descripcion: `Adoptas un estilo de combate como especialidad.`, selecciones: [{ id: "estilo_combate_paladin", nombre: "Estilo de Combate", tipo: "estilo_combate", tipoPlural: "estilos de combate", cantidadSeleccionable: 1, descripcion: "Escoge un estilo de combate.", fuenteOpciones: { coleccion: "opcionesCompartidas.estilosCombate", incluirIds: ["defensa", "duelo", "a_dos_manos", "proteccion"] } }] },
        { id: "lanzamiento_conjuros_paladin", nombre: "Lanzamiento de conjuros", nivelClase: 2, descripcionResum: "Preparas y lanzas conjuros de paladín usando Carisma.", descripcion: `Tu magia juramentada usa Carisma. Preparas conjuros de paladín y puedes usar un símbolo sagrado como foco.` },
        { id: "castigo_divino", nombre: "Castigo divino", nivelClase: 2, descripcionResum: "Al impactar con arma cuerpo a cuerpo puedes gastar un espacio de conjuro para añadir daño radiante.", descripcion: `Cuando golpeas con un arma cuerpo a cuerpo, puedes gastar un espacio de conjuro para infligir daño radiante adicional, especialmente eficaz contra muertos vivientes e infernales.` },
        { id: "salud_divina", nombre: "Salud divina", nivelClase: 3, descripcionResum: "Eres inmune a enfermedades.", descripcion: `La magia divina que fluye por ti te vuelve inmune a enfermedades.` },
        { id: "juramento_sagrado", nombre: "Juramento sagrado", nivelClase: 3, descripcionResum: "Escoge un juramento que concede rasgos en niveles 3, 7, 15 y 20.", descripcion: `Tu juramento define ideales, conjuros y formas de Canalizar divinidad.`, selecciones: [{ id: "juramento_paladin", nombre: "Juramento sagrado", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu juramento.", opciones: [{ id: "juramento_devocion", nombre: "Juramento de devoción" }] }] },
        { id: "mejora_caracteristica_paladin", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "ataque_adicional_paladin", nombre: "Ataque adicional", nivelClase: 5, descripcionResum: "Puedes atacar dos veces cuando usas la acción de Ataque.", descripcion: `Cuando realizas la acción de Ataque en tu turno, haces dos ataques en lugar de uno.` },
        { id: "aura_proteccion", nombre: "Aura de protección", nivelClase: 6, descripcionResum: "Tú y aliados cercanos sumáis tu Carisma a tiradas de salvación.", descripcion: `Tu presencia protege a aliados cercanos, que añaden tu modificador de Carisma a sus tiradas de salvación mientras estés consciente.` },
        { id: "aura_valor", nombre: "Aura de valor", nivelClase: 10, descripcionResum: "Tú y aliados cercanos no podéis ser asustados mientras estés consciente.", descripcion: `Tu aura impide que el miedo afecte a criaturas amistosas cercanas mientras estás consciente.` },
        { id: "castigo_divino_mejorado", nombre: "Castigo divino mejorado", nivelClase: 11, descripcionResum: "Tus ataques cuerpo a cuerpo con arma infligen daño radiante adicional.", descripcion: `Tus golpes cuerpo a cuerpo con arma quedan imbuidos de energía radiante adicional.` },
        { id: "toque_purificador", nombre: "Toque purificador", nivelClase: 14, descripcionResum: "Puedes terminar conjuros sobre ti o criaturas voluntarias con tu acción.", descripcion: `Como acción, puedes finalizar un conjuro que afecte a ti o a una criatura voluntaria que toques.` }
      ],
      subclase: [{ id: "juramento_devocion", nombre: "Juramento de devoción", descripcionResum: "Ideal de honor, virtud y protección contra la oscuridad.", descripcion: `Este juramento protege contra impureza, miedo y criaturas malignas.`, rasgos: [
        { id: "canalizar_devocion", nombre: "Canalizar divinidad: Devoción", nivelClase: 3, descripcionResum: "Puedes consagrar tu arma o expulsar impíos.", descripcion: `Tus opciones de Canalizar divinidad te permiten santificar un arma o repeler ciertos enemigos sobrenaturales.` },
        { id: "aura_devocion", nombre: "Aura de devoción", nivelClase: 7, descripcionResum: "Tú y aliados cercanos no podéis ser hechizados mientras estés consciente.", descripcion: `Tu aura protege contra encantamientos a criaturas amistosas cercanas.` },
        { id: "pureza_espiritu", nombre: "Pureza de espíritu", nivelClase: 15, descripcionResum: "Siempre estás bajo protección contra el mal y el bien.", descripcion: `Tu espíritu queda protegido de forma constante contra ciertas criaturas sobrenaturales.` },
        { id: "aureola_sagrada", nombre: "Aureola sagrada", nivelClase: 20, descripcionResum: "Puedes emitir luz sagrada que daña enemigos y mejora tus salvaciones contra sus conjuros.", descripcion: `Como acción, manifiestas una aureola de luz que daña criaturas hostiles cercanas y te protege de sus conjuros.` }
      ] }]
    },
    { id: "picaro",
      nombre: "Pícaro",
      descripcion: "Especialista ágil en sigilo, precisión y resolución ingeniosa de problemas.",
      dadoDeGolpe: 8,
      competencias: {
        salvaciones: ["DES", "INT"],
        habilidades: [],
        armas: {
          descripcion: "Armas simples, ballestas de mano, espadas largas, estoques y espadas cortas",
          competencias: ["armasSimples", "ballestaMano", "espadaLarga", "estoque", "espadaCorta"]
        },
        armaduras: {
          descripcion: "Armaduras ligeras", competencias: ["ligera"]
        },
        herramientas: "Herramientas de ladrón",
        idiomas: [] },
      rasgos: [
        { id: "competencias_iniciales_picaro", nombre: "Competencias iniciales", nivelClase: 1, descripcionResum: "Salvaciones de Destreza e Inteligencia, armaduras ligeras, armas de pícaro, herramientas de ladrón y cuatro habilidades.", descripcion: `Escoge cuatro habilidades entre Acrobacias, Atletismo, Engañar, Perspicacia, Intimidación, Investigación, Percepción, Interpretación, Persuasión, Juego de Manos y Sigilo.`, selecciones: [{ id: "habilidades_picaro_n1", nombre: "Habilidades de Pícaro", tipo: "habilidad", cantidadSeleccionable: 4, descripcion: "Escoge cuatro habilidades.", opciones: [{ id: "acrobacias", nombre: "Acrobacias" }, { id: "atletismo", nombre: "Atletismo" }, { id: "enganar", nombre: "Engañar" }, { id: "perspicacia", nombre: "Perspicacia" }, { id: "intimidacion", nombre: "Intimidación" }, { id: "investigacion", nombre: "Investigación" }, { id: "percepcion", nombre: "Percepción" }, { id: "interpretacion", nombre: "Interpretación" }, { id: "persuasion", nombre: "Persuasión" }, { id: "juego_de_manos", nombre: "Juego de Manos" }, { id: "sigilo", nombre: "Sigilo" }] }] },
        { id: "pericia_picaro", nombre: "Pericia", nivelClase: 1, descripcionResum: "Elige dos competencias para duplicar tu bonificador de competencia.", descripcion: `Elige dos competencias entre habilidades y herramientas de ladrón; duplicas tu bonificador de competencia para ellas. Más adelante eliges otras dos.` },
        { id: "ataque_furtivo", nombre: "Ataque furtivo", nivelClase: 1, descripcionResum: "Una vez por turno infliges daño extra si atacas con ventaja o con un aliado junto al objetivo.", descripcion: `Con arma sutil o a distancia, puedes añadir daño extra una vez por turno si cumples las condiciones de precisión o distracción.` },
        { id: "jerga_ladrones", nombre: "Jerga de ladrones", nivelClase: 1, descripcionResum: "Conoces códigos y mensajes secretos del submundo.", descripcion: `Puedes comunicar mensajes ocultos mediante jerga, símbolos y claves que otros pícaros reconocen.` },
        { id: "accion_astuta", nombre: "Acción astuta", nivelClase: 2, descripcionResum: "Puedes correr, retirarte o esconderte como acción adicional.", descripcion: `Tu rapidez te permite usar una acción adicional para Esprintar, Retirarte o Esconderte.` },
        { id: "arquetipo_picaro", nombre: "Arquetipo de pícaro", nivelClase: 3, descripcionResum: "Escoge un arquetipo que concede rasgos en niveles 3, 9, 13 y 17.", descripcion: `Tu estilo de pícaro se especializa en un arquetipo.`, selecciones: [{ id: "arquetipo_picaro", nombre: "Arquetipo de pícaro", tipo: "subclase", cantidadSeleccionable: 1, descripcion: "Escoge tu arquetipo.", opciones: [{ id: "ladron", nombre: "Ladrón" }] }] },
        { id: "mejora_caracteristica_picaro", nombre: "Mejora de característica", nivelClase: 4, descripcionResum: "En los niveles 4, 8, 10, 12, 16 y 19 puedes mejorar características.", descripcion: `Puedes aumentar una característica en 2 o dos características en 1, hasta el máximo normal.` },
        { id: "esquiva_asombrosa", nombre: "Esquiva asombrosa", nivelClase: 5, descripcionResum: "Como reacción reduces a la mitad el daño de un atacante que puedas ver.", descripcion: `Cuando un atacante que ves te impacta, puedes usar tu reacción para reducir a la mitad el daño del ataque.` },
        { id: "evasion_picaro", nombre: "Evasión", nivelClase: 7, descripcionResum: "En salvaciones de Destreza de mitad de daño, evitas todo con éxito y recibes mitad al fallar.", descripcion: `Tu agilidad reduce o niega daños de área que permitan salvación de Destreza para recibir mitad.` },
        { id: "talento_fiable", nombre: "Talento fiable", nivelClase: 11, descripcionResum: "En pruebas con competencia, cualquier d20 de 9 o menos cuenta como 10.", descripcion: `Tus habilidades entrenadas son tan constantes que los resultados bajos en el d20 se tratan como 10 en pruebas competentes.` },
        { id: "sentido_ciego", nombre: "Sentido ciego", nivelClase: 14, descripcionResum: "Detectas criaturas ocultas o invisibles cercanas si puedes oír.", descripcion: `Si puedes oír, localizas criaturas ocultas o invisibles a corta distancia.` },
        { id: "mente_escurridiza", nombre: "Mente escurridiza", nivelClase: 15, descripcionResum: "Ganas competencia en tiradas de salvación de Sabiduría.", descripcion: `Tu mente se vuelve difícil de manipular y ganas competencia en salvaciones de Sabiduría.`, efectos: [{ tipoDeEfecto: "bono_salvacion", statAfectada: "SAB", valor: "competencia" }] },
        { id: "elusivo", nombre: "Elusivo", nivelClase: 18, descripcionResum: "Ninguna tirada de ataque tiene ventaja contra ti mientras no estés incapacitado.", descripcion: `Tu movimiento hace que los enemigos no puedan obtener ventaja en ataques contra ti salvo que estés incapacitado.` },
        { id: "golpe_suerte", nombre: "Golpe de suerte", nivelClase: 20, descripcionResum: "Puedes convertir un fallo de ataque en impacto o tratar una prueba fallida como 20.", descripcion: `Una vez por descanso, puedes transformar un fallo decisivo en éxito: un ataque fallido impacta o una prueba de característica usa 20 en el d20.` }
      ],
      subclase: [{ id: "ladron", nombre: "Ladrón", descripcionResum: "Pícaro centrado en infiltración, rapidez manual y uso de objetos.", descripcion: `El ladrón destaca al trepar, manipular objetos y aprovechar tesoros mágicos.`, rasgos: [
        { id: "manos_rapidas", nombre: "Manos rápidas", nivelClase: 3, descripcionResum: "Acción astuta permite ciertas interacciones adicionales como acción adicional.", descripcion: `Puedes usar Acción astuta para pruebas de Juego de Manos, herramientas de ladrón o usar objetos apropiados como acción adicional.` },
        { id: "trabajo_segundo_piso", nombre: "Trabajo de segundo piso", nivelClase: 3, descripcionResum: "Trepar ya no cuesta movimiento extra y saltas más lejos con carrera.", descripcion: `Trepar no te cuesta movimiento adicional y tus saltos con carrera mejoran según tu Destreza.` },
        { id: "sigilo_supremo", nombre: "Sigilo supremo", nivelClase: 9, descripcionResum: "Tienes ventaja en Sigilo si no te mueves demasiado en el turno.", descripcion: `Si te desplazas despacio durante un turno, tienes ventaja en pruebas de Destreza (Sigilo).` },
        { id: "usar_objeto_magico", nombre: "Usar objeto mágico", nivelClase: 13, descripcionResum: "Ignoras requisitos de clase, raza y nivel al usar objetos mágicos.", descripcion: `Tu práctica con artefactos te permite ignorar varios requisitos al usar objetos mágicos.` },
        { id: "reflejos_ladron", nombre: "Reflejos de ladrón", nivelClase: 17, descripcionResum: "Puedes actuar dos veces durante la primera ronda de combate.", descripcion: `Durante el primer asalto, actúas una vez en tu iniciativa normal y otra más tarde, siempre que no estés sorprendido.` }
      ] }]
    }
  ],
  armas: [
    {
      id: "arcoCorto",
      nombre: "Arco corto",
      descripcion: "Arma sencilla a distancia del equipo básico.",
      precio: "25 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_distancia",
      subtipo: "Sencilla a distancia",
      peso: "2",
      arma: {
        clase: "simple",
        uso: "distancia",
        dano: { dado: "1d6", tipo: "perforante" },
        alcance: 80,
        alcanceLargo: 320,
        propiedades: ["distancia", "dos_manos", "municion"]
      },
      efectos: ["Daño: 1d6 perforante", "Alcance: 80/320 pies"],
      etiquetas: ["Simple", "Distancia", "Distancia", "Dos manos", "Munición"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "ballesta_ligera",
      nombre: "Ballesta ligera",
      descripcion: "Arma sencilla a distancia del equipo básico.",
      precio: "25 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_distancia",
      subtipo: "Sencilla a distancia",
      peso: "5",
      arma: {
        clase: "simple",
        uso: "distancia",
        dano: { dado: "1d8", tipo: "perforante" },
        alcance: 80,
        alcanceLargo: 320,
        propiedades: ["de_carga", "distancia", "dos_manos", "municion"]
      },
      efectos: ["Daño: 1d8 perforante", "Alcance: 80/320 pies"],
      etiquetas: ["Simple", "Distancia", "De carga", "Distancia", "Dos manos", "Munición"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "baston",
      nombre: "Bastón",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "2 pp",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "4",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "contundente" },
        propiedades: ["versatil"],
        versatil: { dado: "1d8", tipo: "contundente" }
      },
      efectos: ["Daño: 1d6 contundente", "Versátil: 1d8 contundente"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Versátil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "clava",
      nombre: "Clava",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "1 pp",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d4", tipo: "contundente" },
        propiedades: ["ligera"]
      },
      efectos: ["Daño: 1d4 contundente"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "daga",
      nombre: "Daga",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "2 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "1",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d4", tipo: "perforante" },
        alcance: 20,
        alcanceLargo: 60,
        propiedades: ["arrojadiza", "distancia", "ligera", "sutil"]
      },
      efectos: ["Daño: 1d4 perforante", "Alcance: 20/60 pies"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Arrojadiza", "Distancia", "Ligera", "Sutil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "dardo",
      nombre: "Dardo",
      descripcion: "Arma sencilla a distancia del equipo básico.",
      precio: "5 pc",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_distancia",
      subtipo: "Sencilla a distancia",
      peso: "1/4",
      arma: {
        clase: "simple",
        uso: "distancia",
        dano: { dado: "1d4", tipo: "perforante" },
        alcance: 20,
        alcanceLargo: 60,
        propiedades: ["arrojadiza", "distancia", "sutil"]
      },
      efectos: ["Daño: 1d4 perforante", "Alcance: 20/60 pies"],
      etiquetas: ["Simple", "Distancia", "Arrojadiza", "Distancia", "Sutil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "gran_clava",
      nombre: "Gran clava",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "2 pp",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "10",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "contundente" },
        propiedades: ["dos_manos"]
      },
      efectos: ["Daño: 1d8 contundente"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Dos manos"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "hachaMano",
      nombre: "Hacha de mano",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "5 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "cortante" },
        alcance: 20,
        alcanceLargo: 60,
        propiedades: ["arrojadiza", "ligera"]
      },
      efectos: ["Daño: 1d6 cortante", "Alcance: 20/60 pies"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Arrojadiza", "Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "honda",
      nombre: "Honda",
      descripcion: "Arma sencilla a distancia del equipo básico.",
      precio: "1 pp",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_distancia",
      subtipo: "Sencilla a distancia",
      peso: "—",
      arma: {
        clase: "simple",
        uso: "distancia",
        dano: { dado: "1d4", tipo: "contundente" },
        alcance: 30,
        alcanceLargo: 120,
        propiedades: ["distancia", "municion"]
      },
      efectos: ["Daño: 1d4 contundente", "Alcance: 30/120 pies"],
      etiquetas: ["Simple", "Distancia", "Distancia", "Munición"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "hoz",
      nombre: "Hoz",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "1 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d4", tipo: "cortante" },
        propiedades: ["ligera"]
      },
      efectos: ["Daño: 1d4 cortante"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "jabalina",
      nombre: "Jabalina",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "5 pp",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "perforante" },
        alcance: 30,
        alcanceLargo: 120,
        propiedades: ["arrojadiza", "distancia"]
      },
      efectos: ["Daño: 1d6 perforante", "Alcance: 30/120 pies"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Arrojadiza", "Distancia"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "lanza",
      nombre: "Lanza",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "1 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "3",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "perforante" },
        alcance: 20,
        alcanceLargo: 60,
        propiedades: ["arrojadiza", "distancia", "versatil"],
        versatil: { dado: "1d8", tipo: "perforante" }
      },
      efectos: ["Daño: 1d6 perforante", "Versátil: 1d8 perforante", "Alcance: 20/60 pies"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Arrojadiza", "Distancia", "Versátil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "martilloLigero",
      nombre: "Martillo ligero",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "2 pp",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d4", tipo: "contundente" },
        alcance: 20,
        alcanceLargo: 60,
        propiedades: ["arrojadiza", "distancia", "ligera"]
      },
      efectos: ["Daño: 1d4 contundente", "Alcance: 20/60 pies"],
      etiquetas: ["Simple", "Cuerpo a cuerpo", "Arrojadiza", "Distancia", "Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "maza",
      nombre: "Maza",
      descripcion: "Arma sencilla cuerpo a cuerpo del equipo básico.",
      precio: "5 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_simples_cuerpo",
      subtipo: "Sencilla cuerpo a cuerpo",
      peso: "4",
      arma: {
        clase: "simple",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "contundente" },
        propiedades: []
      },
      efectos: ["Daño: 1d6 contundente"],
      etiquetas: ["Simple", "Cuerpo a cuerpo"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "alabarda",
      nombre: "Alabarda",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "20 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "6",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d10", tipo: "cortante" },
        propiedades: ["alcance", "dos_manos", "pesada"]
      },
      efectos: ["Daño: 1d10 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Alcance", "Dos manos", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "arcoLargo",
      nombre: "Arco largo",
      descripcion: "Arma marcial a distancia del equipo básico.",
      precio: "50 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_distancia",
      subtipo: "Marcial a distancia",
      peso: "2",
      arma: {
        clase: "marcial",
        uso: "distancia",
        dano: { dado: "1d8", tipo: "perforante" },
        alcance: 150,
        alcanceLargo: 600,
        propiedades: ["distancia", "dos_manos", "municion", "pesada"]
      },
      efectos: ["Daño: 1d8 perforante", "Alcance: 150/600 pies"],
      etiquetas: ["Marcial", "Distancia", "Distancia", "Dos manos", "Munición", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "ballesta_de_mano",
      nombre: "Ballesta de mano",
      descripcion: "Arma marcial a distancia del equipo básico.",
      precio: "75 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_distancia",
      subtipo: "Marcial a distancia",
      peso: "3",
      arma: {
        clase: "marcial",
        uso: "distancia",
        dano: { dado: "1d6", tipo: "perforante" },
        alcance: 30,
        alcanceLargo: 120,
        propiedades: ["de_carga", "distancia", "ligera", "municion"]
      },
      efectos: ["Daño: 1d6 perforante", "Alcance: 30/120 pies"],
      etiquetas: ["Marcial", "Distancia", "De carga", "Distancia", "Ligera", "Munición"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "ballesta_pesada",
      nombre: "Ballesta pesada",
      descripcion: "Arma marcial a distancia del equipo básico.",
      precio: "50 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_distancia",
      subtipo: "Marcial a distancia",
      peso: "18",
      arma: {
        clase: "marcial",
        uso: "distancia",
        dano: { dado: "1d10", tipo: "perforante" },
        alcance: 100,
        alcanceLargo: 400,
        propiedades: ["de_carga", "distancia", "dos_manos", "municion"]
      },
      efectos: ["Daño: 1d10 perforante", "Alcance: 100/400 pies"],
      etiquetas: ["Marcial", "Distancia", "De carga", "Distancia", "Dos manos", "Munición"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cerbatana",
      nombre: "Cerbatana",
      descripcion: "Arma marcial a distancia del equipo básico.",
      precio: "10 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_distancia",
      subtipo: "Marcial a distancia",
      peso: "1",
      arma: {
        clase: "marcial",
        uso: "distancia",
        dano: { dado: "1", tipo: "perforante" },
        alcance: 25,
        alcanceLargo: 100,
        propiedades: ["de_carga", "distancia", "municion"]
      },
      efectos: ["Daño: 1 perforante", "Alcance: 25/100 pies"],
      etiquetas: ["Marcial", "Distancia", "De carga", "Distancia", "Munición"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cimitarra",
      nombre: "Cimitarra",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "25 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "3",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "cortante" },
        propiedades: ["ligera", "sutil"]
      },
      efectos: ["Daño: 1d6 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Ligera", "Sutil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "espadaCorta",
      nombre: "Espada corta",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "10 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "perforante" },
        propiedades: ["ligera", "sutil"]
      },
      efectos: ["Daño: 1d6 perforante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Ligera", "Sutil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "espadaLarga",
      nombre: "Espada larga",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "15 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "3",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "cortante" },
        propiedades: ["versatil"],
        versatil: { dado: "1d10", tipo: "cortante" }
      },
      efectos: ["Daño: 1d8 cortante", "Versátil: 1d10 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Versátil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "espadon",
      nombre: "Espadón",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "50 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "6",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "2d6", tipo: "cortante" },
        propiedades: ["dos_manos", "pesada"]
      },
      efectos: ["Daño: 2d6 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Dos manos", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "estoque",
      nombre: "Estoque",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "25 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "perforante" },
        propiedades: ["sutil"]
      },
      efectos: ["Daño: 1d8 perforante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Sutil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "flagelo",
      nombre: "Flagelo",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "10 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "contundente" },
        propiedades: []
      },
      efectos: ["Daño: 1d8 contundente"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "gran_hacha",
      nombre: "Gran hacha",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "30 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "7",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d12", tipo: "cortante" },
        propiedades: ["dos_manos", "pesada"]
      },
      efectos: ["Daño: 1d12 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Dos manos", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "guja",
      nombre: "Guja",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "20 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "6",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d10", tipo: "cortante" },
        propiedades: ["alcance", "dos_manos", "pesada"]
      },
      efectos: ["Daño: 1d10 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Alcance", "Dos manos", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "hachaBatalla",
      nombre: "Hacha de batalla",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "10 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "4",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "cortante" },
        propiedades: ["versatil"],
        versatil: { dado: "1d10", tipo: "cortante" }
      },
      efectos: ["Daño: 1d8 cortante", "Versátil: 1d10 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Versátil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "lanza_de_caballeria",
      nombre: "Lanza de caballería",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "10 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "6",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d12", tipo: "perforante" },
        propiedades: ["alcance", "especial"]
      },
      efectos: ["Daño: 1d12 perforante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Alcance", "Especial"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "latigo",
      nombre: "Látigo",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "2 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "3",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d4", tipo: "cortante" },
        propiedades: ["alcance", "sutil"]
      },
      efectos: ["Daño: 1d4 cortante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Alcance", "Sutil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "lucero_del_alba",
      nombre: "Lucero del alba",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "15 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "4",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "perforante" },
        propiedades: []
      },
      efectos: ["Daño: 1d8 perforante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "martilloGuerra",
      nombre: "Martillo de guerra",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "15 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "contundente" },
        propiedades: ["versatil"],
        versatil: { dado: "1d10", tipo: "contundente" }
      },
      efectos: ["Daño: 1d8 contundente", "Versátil: 1d10 contundente"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Versátil"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "mazo_de_guerra",
      nombre: "Mazo de guerra",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "10 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "10",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "2d6", tipo: "contundente" },
        propiedades: ["dos_manos", "pesada"]
      },
      efectos: ["Daño: 2d6 contundente"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Dos manos", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "pica",
      nombre: "Pica",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "5 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "18",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d10", tipo: "perforante" },
        propiedades: ["alcance", "dos_manos", "pesada"]
      },
      efectos: ["Daño: 1d10 perforante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Alcance", "Dos manos", "Pesada"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "pico_de_guerra",
      nombre: "Pico de guerra",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "5 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "2",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d8", tipo: "perforante" },
        propiedades: []
      },
      efectos: ["Daño: 1d8 perforante"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "red",
      nombre: "Red",
      descripcion: "Arma marcial a distancia del equipo básico.",
      precio: "1 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_distancia",
      subtipo: "Marcial a distancia",
      peso: "3",
      arma: {
        clase: "marcial",
        uso: "distancia",
        alcance: 5,
        alcanceLargo: 15,
        propiedades: ["arrojadiza", "distancia", "especial"]
      },
      efectos: ["Alcance: 5/15 pies"],
      etiquetas: ["Marcial", "Distancia", "Arrojadiza", "Distancia", "Especial"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "tridente",
      nombre: "Tridente",
      descripcion: "Arma marcial cuerpo a cuerpo del equipo básico.",
      precio: "5 po",
      categoria: "arma",
      tipo: "arma",
      grupo: "armas_marciales_cuerpo",
      subtipo: "Marcial cuerpo a cuerpo",
      peso: "4",
      arma: {
        clase: "marcial",
        uso: "cuerpo",
        dano: { dado: "1d6", tipo: "perforante" },
        alcance: 20,
        alcanceLargo: 60,
        propiedades: ["arrojadiza", "distancia", "versatil"],
        versatil: { dado: "1d8", tipo: "perforante" }
      },
      efectos: ["Daño: 1d6 perforante", "Versátil: 1d8 perforante", "Alcance: 20/60 pies"],
      etiquetas: ["Marcial", "Cuerpo a cuerpo", "Arrojadiza", "Distancia", "Versátil"],
      sintonizable: false,
      sintonizado: false
    }
  ],
  armaduras: [
    {
      id: "acolchada",
      nombre: "Acolchada",
      descripcion: "Armadura ligera del equipo básico.",
      precio: "5 po",
      categoria: "armadura",
      tipo: "ligera",
      grupo: "armaduras_ligeras",
      subtipo: "Ligera",
      peso: "8",
      armadura: {
        clase: "ligera",
        caBase: 11,
        destreza: "completa",
        fuerzaMinima: null,
        desventajaSigilo: true
      },
      caBase: 11,
      efectos: ["CA base: 11 + modificador de Destreza"],
      etiquetas: ["Ligera", "Desventaja"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cuero",
      nombre: "Cuero",
      descripcion: "Armadura ligera del equipo básico.",
      precio: "10 po",
      categoria: "armadura",
      tipo: "ligera",
      grupo: "armaduras_ligeras",
      subtipo: "Ligera",
      peso: "10",
      armadura: {
        clase: "ligera",
        caBase: 11,
        destreza: "completa",
        fuerzaMinima: null,
        desventajaSigilo: false
      },
      caBase: 11,
      efectos: ["CA base: 11 + modificador de Destreza"],
      etiquetas: ["Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cueroTachonado",
      nombre: "Cuero tachonado",
      descripcion: "Armadura ligera del equipo básico.",
      precio: "45 po",
      categoria: "armadura",
      tipo: "ligera",
      grupo: "armaduras_ligeras",
      subtipo: "Ligera",
      peso: "13",
      armadura: {
        clase: "ligera",
        caBase: 12,
        destreza: "completa",
        fuerzaMinima: null,
        desventajaSigilo: false
      },
      caBase: 12,
      efectos: ["CA base: 12 + modificador de Destreza"],
      etiquetas: ["Ligera"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "camisoteMalla",
      nombre: "Camisote de malla",
      descripcion: "Armadura media del equipo básico.",
      precio: "50 po",
      categoria: "armadura",
      tipo: "media",
      grupo: "armaduras_medias",
      subtipo: "Media",
      peso: "20",
      armadura: {
        clase: "media",
        caBase: 13,
        destreza: "max2",
        fuerzaMinima: null,
        desventajaSigilo: false
      },
      caBase: 13,
      efectos: ["CA base: 13 + modificador de Destreza (máximo +2)"],
      etiquetas: ["Media"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "coraza",
      nombre: "Coraza",
      descripcion: "Armadura media del equipo básico.",
      precio: "400 po",
      categoria: "armadura",
      tipo: "media",
      grupo: "armaduras_medias",
      subtipo: "Media",
      peso: "20",
      armadura: {
        clase: "media",
        caBase: 14,
        destreza: "max2",
        fuerzaMinima: null,
        desventajaSigilo: false
      },
      caBase: 14,
      efectos: ["CA base: 14 + modificador de Destreza (máximo +2)"],
      etiquetas: ["Media"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cotaEscamas",
      nombre: "Cota de escamas",
      descripcion: "Armadura media del equipo básico.",
      precio: "50 po",
      categoria: "armadura",
      tipo: "media",
      grupo: "armaduras_medias",
      subtipo: "Media",
      peso: "45",
      armadura: {
        clase: "media",
        caBase: 14,
        destreza: "max2",
        fuerzaMinima: null,
        desventajaSigilo: true
      },
      caBase: 14,
      efectos: ["CA base: 14 + modificador de Destreza (máximo +2)"],
      etiquetas: ["Media", "Desventaja"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "pieles",
      nombre: "Pieles",
      descripcion: "Armadura media del equipo básico.",
      precio: "10 po",
      categoria: "armadura",
      tipo: "media",
      grupo: "armaduras_medias",
      subtipo: "Media",
      peso: "12",
      armadura: {
        clase: "media",
        caBase: 12,
        destreza: "max2",
        fuerzaMinima: null,
        desventajaSigilo: false
      },
      caBase: 12,
      efectos: ["CA base: 12 + modificador de Destreza (máximo +2)"],
      etiquetas: ["Media"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "mediaArmadura",
      nombre: "Placas y malla",
      descripcion: "Armadura media del equipo básico.",
      precio: "750 po",
      categoria: "armadura",
      tipo: "media",
      grupo: "armaduras_medias",
      subtipo: "Media",
      peso: "40",
      armadura: {
        clase: "media",
        caBase: 15,
        destreza: "max2",
        fuerzaMinima: null,
        desventajaSigilo: true
      },
      caBase: 15,
      efectos: ["CA base: 15 + modificador de Destreza (máximo +2)"],
      etiquetas: ["Media", "Desventaja"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "armaduraBandas",
      nombre: "Armadura de bandas",
      descripcion: "Armadura pesada del equipo básico.",
      precio: "200 po",
      categoria: "armadura",
      tipo: "pesada",
      grupo: "armaduras_pesadas",
      subtipo: "Pesada",
      peso: "60",
      armadura: {
        clase: "pesada",
        caBase: 17,
        destreza: "ninguna",
        fuerzaMinima: 15,
        desventajaSigilo: true
      },
      caBase: 17,
      efectos: ["CA base: 17"],
      etiquetas: ["Pesada", "Desventaja", "Fuerza"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "armaduraPlacas",
      nombre: "Armadura de placas",
      descripcion: "Armadura pesada del equipo básico.",
      precio: "1500 po",
      categoria: "armadura",
      tipo: "pesada",
      grupo: "armaduras_pesadas",
      subtipo: "Pesada",
      peso: "65",
      armadura: {
        clase: "pesada",
        caBase: 18,
        destreza: "ninguna",
        fuerzaMinima: 15,
        desventajaSigilo: true
      },
      caBase: 18,
      efectos: ["CA base: 18"],
      etiquetas: ["Pesada", "Desventaja", "Fuerza"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cotaMalla",
      nombre: "Cota de malla",
      descripcion: "Armadura pesada del equipo básico.",
      precio: "75 po",
      categoria: "armadura",
      tipo: "pesada",
      grupo: "armaduras_pesadas",
      subtipo: "Pesada",
      peso: "55",
      armadura: {
        clase: "pesada",
        caBase: 16,
        destreza: "ninguna",
        fuerzaMinima: 13,
        desventajaSigilo: true
      },
      caBase: 16,
      efectos: ["CA base: 16"],
      etiquetas: ["Pesada", "Desventaja", "Fuerza"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "cotaGuarnecida",
      nombre: "Cota guarnecida",
      descripcion: "Armadura pesada del equipo básico.",
      precio: "30 po",
      categoria: "armadura",
      tipo: "pesada",
      grupo: "armaduras_pesadas",
      subtipo: "Pesada",
      peso: "40",
      armadura: {
        clase: "pesada",
        caBase: 14,
        destreza: "ninguna",
        fuerzaMinima: null,
        desventajaSigilo: true
      },
      caBase: 14,
      efectos: ["CA base: 14"],
      etiquetas: ["Pesada", "Desventaja"],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "escudonormal",
      nombre: "Escudo",
      descripcion: "Escudo del equipo básico.",
      precio: "10 po",
      categoria: "armadura",
      tipo: "escudo",
      grupo: "escudos",
      subtipo: "Escudo",
      peso: "6",
      armadura: {
        clase: "escudo",
        bonificadorCA: 2
      },
      bonifCA: 2,
      efectos: ["+2 a la CA mientras lo portas"],
      etiquetas: ["Escudo"],
      sintonizable: false,
      sintonizado: false
    }
  ],
  equipo: [
    {
      id: "herramientas_de_artesano",
      nombre: "Herramientas de artesano",
      descripcion: "Categoría de herramientas de artesano del equipo básico.",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "herramientas_de_ladron",
      nombre: "Herramientas de ladrón",
      descripcion: "Objeto de equipo básico.",
      precio: "25 po",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      peso: "1",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "herramientas_de_navegante",
      nombre: "Herramientas de navegante",
      descripcion: "Objeto de equipo básico.",
      precio: "25 po",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      peso: "2",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "kit_de_disfraz",
      nombre: "Kit de disfraz",
      descripcion: "Objeto de equipo básico.",
      precio: "25 po",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      peso: "3",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "kit_de_envenenador",
      nombre: "Kit de envenenador",
      descripcion: "Objeto de equipo básico.",
      precio: "50 po",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      peso: "2",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "kit_de_falsificacion",
      nombre: "Kit de falsificación",
      descripcion: "Objeto de equipo básico.",
      precio: "15 po",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      peso: "5",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "kit_de_herborista",
      nombre: "Kit de herborista",
      descripcion: "Objeto de equipo básico.",
      precio: "5 po",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      peso: "3",
      etiquetas: ["Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "set_de_juego",
      nombre: "Set de juego",
      descripcion: "Categoría de sets de juego del equipo básico.",
      categoria: "herramienta",
      tipo: "equipo",
      grupo: "herramientas",
      etiquetas: ["Juego", "Herramienta"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "vehiculo_acuatico",
      nombre: "Vehículo (acuático)",
      descripcion: "Objeto de equipo básico.",
      categoria: "vehiculo",
      tipo: "equipo",
      grupo: "vehiculos",
      etiquetas: ["Vehículo"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "vehiculo_terrestre",
      nombre: "Vehículo (terrestre)",
      descripcion: "Objeto de equipo básico.",
      categoria: "vehiculo",
      tipo: "equipo",
      grupo: "vehiculos",
      etiquetas: ["Vehículo"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_artista",
      nombre: "Paquete de artista",
      descripcion: "Objeto de equipo básico.",
      precio: "40 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_diplomatico",
      nombre: "Paquete de diplomático",
      descripcion: "Objeto de equipo básico.",
      precio: "39 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_erudito",
      nombre: "Paquete de erudito",
      descripcion: "Objeto de equipo básico.",
      precio: "40 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_explorador",
      nombre: "Paquete de explorador",
      descripcion: "Objeto de equipo básico.",
      precio: "10 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_explorador_de_mazmorras",
      nombre: "Paquete de explorador de mazmorras",
      descripcion: "Objeto de equipo básico.",
      precio: "12 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_ladron",
      nombre: "Paquete de ladrón",
      descripcion: "Objeto de equipo básico.",
      precio: "16 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
      sintonizable: false,
      sintonizado: false
    },
    {
      id: "paquete_de_sacerdote",
      nombre: "Paquete de sacerdote",
      descripcion: "Objeto de equipo básico.",
      precio: "19 po",
      categoria: "pack",
      tipo: "equipo",
      grupo: "packs",
      etiquetas: ["Pack"],
      efectos: [],
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