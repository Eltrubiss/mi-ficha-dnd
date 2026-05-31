const CLAVE_PERSONAJE_ACTIVO = "miFichaDnd.personajeActivoId";
const CLAVE_INDICE_PERSONAJES = "miFichaDnd.personajes";
const CLAVE_ABRIR_FICHA_TRAS_RECARGA = "miFichaDnd.abrirFichaTrasRecarga";
const PREFIJO_CLAVE_PERSONAJE = "miFichaDnd.personaje.";
let buscadorPersonajes = null;
let listadoPersonajes = null;
let btnNuevoPersonaje = null;

const personajePorDefecto = {
  nombre: "Sin nombre",
  raza: "humano",
  subraza: "",
  clase1: "guerrero",
  nivelClase1: 1,
  subclase1: "",
  clase2: "",
  nivelClase2: 0,
  subclase2: "",
  clase3: "",
  nivelClase3: 0,
  subclase3: "",
  nivel: 1,
  FUE: 10,
  DES: 10,
  CON: 10,
  INT: 10,
  SAB: 10,
  CAR: 10,
  armadura: "",
  escudo: "",
  hpActual: 0,
  hpTemporales: 0,
  inspiracion: false,
  concentracion: false,
  estadosActivos: [],
  eleccionesRasgos: {},
  progresionNiveles: {},
  pgPorNivel: {}
};

const ESTADISTICAS_PRINCIPALES = [
  { id: "FUE", nombre: "Fuerza" },
  { id: "DES", nombre: "Destreza" },
  { id: "CON", nombre: "Constitución" },
  { id: "INT", nombre: "Inteligencia" },
  { id: "SAB", nombre: "Sabiduría" },
  { id: "CAR", nombre: "Carisma" }
];
const ESTADISTICA_MINIMA_REPARTO = 1;
const ESTADISTICA_MAXIMA_REPARTO = 20;

function clonarPersonaje(personaje) {
  return JSON.parse(JSON.stringify(personaje));
}

function crearIdPersonaje() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `personaje-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function leerJsonLocalStorage(clave) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    console.warn(`No se pudo leer ${clave} desde localStorage`, error);
    return null;
  }
}

function escribirJsonLocalStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.warn(`No se pudo guardar ${clave} en localStorage`, error);
  }
}

function leerPersonajeGuardado(id) {
  return id ? leerJsonLocalStorage(`${PREFIJO_CLAVE_PERSONAJE}${id}`) : null;
}

function guardarPersonaje(personaje) {
  if (!personaje.id) personaje.id = crearIdPersonaje();
  escribirJsonLocalStorage(`${PREFIJO_CLAVE_PERSONAJE}${personaje.id}`, personaje);
  return personaje.id;
}

function guardarPersonajeActual() {
  const id = guardarPersonaje(personajeActual);
  try {
    localStorage.setItem(CLAVE_PERSONAJE_ACTIVO, id);
  } catch (error) {
    console.warn("No se pudo guardar el personaje activo en localStorage", error);
  }
}

function obtenerIdsPersonajesGuardados() {
  const ids = [];

  try {
    for (let indice = 0; indice < localStorage.length; indice++) {
      const clave = localStorage.key(indice);
      if (clave?.startsWith(PREFIJO_CLAVE_PERSONAJE)) {
        ids.push(clave.slice(PREFIJO_CLAVE_PERSONAJE.length));
      }
    }
  } catch (error) {
    console.warn("No se pudo revisar la lista de personajes guardados", error);
  }

  return ids;
}

function normalizarListaEstados(estados) {
  if (!Array.isArray(estados)) return [];
  return [...new Set(estados.map(estadoId => String(estadoId || "").trim()).filter(Boolean))];
}

function normalizarPersonaje(personaje) {
  const datos = clonarPersonaje(personaje || {});
  if (Object.prototype.hasOwnProperty.call(datos, "Inspiracion")
      && !Object.prototype.hasOwnProperty.call(datos, "inspiracion")) {
    datos.inspiracion = datos.Inspiracion;
  }
  delete datos.Inspiracion;

  return {
    ...clonarPersonaje(personajePorDefecto),
    ...datos,
    concentracion: Boolean(datos.concentracion),
    estadosActivos: normalizarListaEstados(datos.estadosActivos),
    eleccionesRasgos: { ...(datos.eleccionesRasgos || {}) },
    progresionNiveles: { ...(datos.progresionNiveles || {}) },
    pgPorNivel: { ...(datos.pgPorNivel || {}) }
  };
}

function crearPersonajeNuevo(base = personajePorDefecto) {
  const personaje = normalizarPersonaje(base);
  personaje.id = personaje.id || crearIdPersonaje();
  return personaje;
}

function cargarOCrearPersonajeActivo() {
  let personajeActivoId = null;

  try {
    personajeActivoId = localStorage.getItem(CLAVE_PERSONAJE_ACTIVO);
  } catch (error) {
    console.warn("No se pudo leer el id del personaje activo", error);
  }

  const personajeGuardado = leerPersonajeGuardado(personajeActivoId);
  if (personajeGuardado) {
    const personaje = normalizarPersonaje(personajeGuardado);
    personaje.id = personaje.id || personajeActivoId;
    return personaje;
  }

  const idsGuardados = obtenerIdsPersonajesGuardados();
  if (idsGuardados.length === 0 && window.personajeDemo) {
    const personajeDemo = crearPersonajeNuevo(window.personajeDemo);
    guardarPersonaje(personajeDemo);
    try {
      localStorage.setItem(CLAVE_PERSONAJE_ACTIVO, personajeDemo.id);
    } catch (error) {
      console.warn("No se pudo marcar el personaje demo como activo", error);
    }
    return personajeDemo;
  }

  const personajeNuevo = crearPersonajeNuevo();
  guardarPersonaje(personajeNuevo);
  try {
    localStorage.setItem(CLAVE_PERSONAJE_ACTIVO, personajeNuevo.id);
  } catch (error) {
    console.warn("No se pudo marcar el personaje nuevo como activo", error);
  }
  return personajeNuevo;
}

window.personajeActual = cargarOCrearPersonajeActivo();

function clonarDatosPersonaje(datos) {
  return JSON.parse(JSON.stringify(datos || {}));
}

function crearIdPersonaje() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `personaje-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizarPersonajeGuardado(datos) {
  const datosCompatibles = clonarDatosPersonaje(datos);
  if (Object.prototype.hasOwnProperty.call(datosCompatibles, "Inspiracion")
      && !Object.prototype.hasOwnProperty.call(datosCompatibles, "inspiracion")) {
    datosCompatibles.inspiracion = datosCompatibles.Inspiracion;
  }
  delete datosCompatibles.Inspiracion;

  const datosNormalizados = {
    ...clonarDatosPersonaje(personajePorDefecto),
    ...datosCompatibles,
    concentracion: Boolean(datosCompatibles.concentracion),
    estadosActivos: normalizarListaEstados(datosCompatibles.estadosActivos),
    eleccionesRasgos: {
      ...clonarDatosPersonaje(personajePorDefecto.eleccionesRasgos),
      ...clonarDatosPersonaje(datosCompatibles.eleccionesRasgos)
    },
    progresionNiveles: {
      ...clonarDatosPersonaje(personajePorDefecto.progresionNiveles),
      ...clonarDatosPersonaje(datosCompatibles.progresionNiveles)
    },
    pgPorNivel: {
      ...clonarDatosPersonaje(personajePorDefecto.pgPorNivel),
      ...clonarDatosPersonaje(datosCompatibles.pgPorNivel)
    }
  };

  datosNormalizados.id = datosNormalizados.id || crearIdPersonaje();
  datosNormalizados.nivel = Number(datosNormalizados.nivel) || personajePorDefecto.nivel;
  datosNormalizados.nivelClase1 = Number(datosNormalizados.nivelClase1) || personajePorDefecto.nivelClase1;
  datosNormalizados.nivelClase2 = Number(datosNormalizados.nivelClase2) || personajePorDefecto.nivelClase2;
  datosNormalizados.nivelClase3 = Number(datosNormalizados.nivelClase3) || personajePorDefecto.nivelClase3;
  ESTADISTICAS_PRINCIPALES.forEach(({ id }) => {
    const valorNormalizado = Number(datosNormalizados[id]);
    datosNormalizados[id] = Number.isFinite(valorNormalizado)
      ? Math.max(ESTADISTICA_MINIMA_REPARTO, Math.min(ESTADISTICA_MAXIMA_REPARTO, valorNormalizado))
      : personajePorDefecto[id];
  });

  return datosNormalizados;
}

Object.assign(personajeActual, normalizarPersonajeGuardado(window.personajeActual));
window.personajeActual = personajeActual;

function listarPersonajesGuardados() {
  const indiceGuardado = localStorage.getItem(CLAVE_INDICE_PERSONAJES);
  const personajes = indiceGuardado ? JSON.parse(indiceGuardado) : [];

  return Array.isArray(personajes) ? personajes : [];
}

function obtenerMetadatosPersonaje(personaje) {
  return {
    id: personaje.id,
    nombre: personaje.nombre || personajePorDefecto.nombre,
    raza: personaje.raza || personajePorDefecto.raza,
    clase1: personaje.clase1 || personajePorDefecto.clase1,
    nivel: Number(personaje.nivel) || personajePorDefecto.nivel,
    updatedAt: personaje.updatedAt
  };
}

function actualizarIndicePersonajes(personaje) {
  const personajeNormalizado = normalizarPersonajeGuardado(personaje);
  const indice = listarPersonajesGuardados();
  const metadatos = obtenerMetadatosPersonaje(personajeNormalizado);
  const indiceExistente = indice.findIndex(item => item.id === personajeNormalizado.id);

  if (indiceExistente >= 0) {
    indice[indiceExistente] = metadatos;
  } else {
    indice.push(metadatos);
  }

  indice.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  localStorage.setItem(CLAVE_INDICE_PERSONAJES, JSON.stringify(indice));

  return indice;
}

function guardarPersonajeActual() {
  if (temporizadorAutoguardadoPersonaje) {
    clearTimeout(temporizadorAutoguardadoPersonaje);
    temporizadorAutoguardadoPersonaje = null;
  }
  const ahora = new Date().toISOString();
  const personajeGuardado = normalizarPersonajeGuardado({
    ...clonarDatosPersonaje(personajeActual),
    id: personajeActual.id || crearIdPersonaje(),
    createdAt: personajeActual.createdAt || ahora,
    updatedAt: personajeActual.updatedAt || ahora
  });

  Object.keys(personajeActual).forEach(clave => delete personajeActual[clave]);
  Object.assign(personajeActual, personajeGuardado);

  localStorage.setItem(
    `${PREFIJO_CLAVE_PERSONAJE}${personajeActual.id}`,
    JSON.stringify(personajeActual)
  );
  localStorage.setItem(CLAVE_PERSONAJE_ACTIVO, personajeActual.id);
  actualizarIndicePersonajes(personajeActual);
  if (typeof renderSelectorPersonajes === "function") {
    renderSelectorPersonajes();
  }
  hayAutoguardadoPersonajePendiente = false;

  return personajeActual;
}

const DEMORA_AUTOGUARDADO_PERSONAJE = 500;
let temporizadorAutoguardadoPersonaje = null;
let hayAutoguardadoPersonajePendiente = false;

function programarAutoguardadoPersonaje() {
  hayAutoguardadoPersonajePendiente = true;

  if (temporizadorAutoguardadoPersonaje) {
    clearTimeout(temporizadorAutoguardadoPersonaje);
  }

  temporizadorAutoguardadoPersonaje = setTimeout(() => {
    temporizadorAutoguardadoPersonaje = null;
    guardarPersonajeActual();
  }, DEMORA_AUTOGUARDADO_PERSONAJE);
}

function marcarPersonajeModificado() {
  personajeActual.updatedAt = new Date().toISOString();
  programarAutoguardadoPersonaje();
}

window.addEventListener("beforeunload", guardarPersonajeActual);

function cargarPersonajePorId(id) {
  const datosGuardados = localStorage.getItem(`${PREFIJO_CLAVE_PERSONAJE}${id}`);
  if (!datosGuardados) return null;

  return normalizarPersonajeGuardado(JSON.parse(datosGuardados));
}

function crearNuevoPersonaje() {
  const ahora = new Date().toISOString();
  const nuevoPersonaje = normalizarPersonajeGuardado({
    ...clonarDatosPersonaje(personajePorDefecto),
    id: crearIdPersonaje(),
    createdAt: ahora,
    updatedAt: ahora
  });

  Object.keys(personajeActual).forEach(clave => delete personajeActual[clave]);
  Object.assign(personajeActual, nuevoPersonaje);
  guardarPersonajeActual();

  return personajeActual;
}

function normalizarNivelClase(valor) {
  const nivel = Number(valor) || 0;
  return Math.max(0, Math.min(20, nivel));
}

function obtenerSlotsClases() {
  return [1, 2, 3].map(numeroSlot => {
    const claseId = personajeActual[`clase${numeroSlot}`] || "";
    const nivel = normalizarNivelClase(personajeActual[`nivelClase${numeroSlot}`]);
    const subclaseId = personajeActual[`subclase${numeroSlot}`] || "";
    const clase = claseId
      ? libroDeReglasBasicas.clases.find(c => c.id === claseId)
      : null;
    const subclase = clase?.subclases
      ? clase.subclases.find(sc => sc.id === subclaseId?.toLowerCase())
      : null;

    return { numeroSlot, claseId, nivel, subclaseId, clase, subclase };
  });
}

function calcularNivelPersonajeDesdeClases() {
  return obtenerSlotsClases()
    .reduce((total, slot) => total + slot.nivel, 0);
}

function sincronizarNivelPersonajeDesdeClases() {
  const totalMulticlase = calcularNivelPersonajeDesdeClases();
  personajeActual.nivel = totalMulticlase || normalizarNivelClase(personajeActual.nivel) || 1;
  return personajeActual.nivel;
}

function obtenerNivelDeClase(numeroSlot) {
  return normalizarNivelClase(personajeActual[`nivelClase${numeroSlot}`]);
}

function establecerNivelClase(numeroSlot, nuevoNivel) {
  personajeActual[`nivelClase${numeroSlot}`] = normalizarNivelClase(nuevoNivel);
  sincronizarNivelPersonajeDesdeClases();
  personajeConBonos = { ...personajeConBonos, nivel: personajeActual.nivel };
}

function subirNivelDeClase(numeroSlot) {
  if (personajeActual.nivel >= 20) return;
  establecerNivelClase(numeroSlot, obtenerNivelDeClase(numeroSlot) + 1);
}

function calcularBonificadorCompetencia(nivelTotal = personajeActual.nivel) {
  return Math.ceil(1 + (nivelTotal / 4));
}
function asegurarDatosBuildPersonaje() {
  if (!personajeActual.progresionNiveles) personajeActual.progresionNiveles = {};
  if (!personajeActual.pgPorNivel) personajeActual.pgPorNivel = {};
}

function obtenerClasePorId(claseId) {
  return claseId ? libroDeReglasBasicas.clases.find(c => c.id === claseId) : null;
}

function obtenerClaseNivelPersonaje(nivel) {
  if (nivel === 1) return personajeActual.clase1 || "";
  return personajeActual.progresionNiveles?.[nivel]?.clase || "";
}

function obtenerDadoGolpeDeClase(claseId) {
  return obtenerClasePorId(claseId)?.dadoDeGolpe || 0;
}

function inicializarProgresionDesdeClases() {
  asegurarDatosBuildPersonaje();
  if (Object.keys(personajeActual.progresionNiveles).length > 0) return;

  let nivelPersonaje = 2;
  [
    { claseId: personajeActual.clase1, niveles: normalizarNivelClase(personajeActual.nivelClase1) - 1 },
    { claseId: personajeActual.clase2, niveles: normalizarNivelClase(personajeActual.nivelClase2) },
    { claseId: personajeActual.clase3, niveles: normalizarNivelClase(personajeActual.nivelClase3) }
  ].forEach(({ claseId, niveles }) => {
    for (let i = 0; i < niveles && nivelPersonaje <= 20; i++) {
      if (claseId) personajeActual.progresionNiveles[nivelPersonaje] = { clase: claseId };
      nivelPersonaje++;
    }
  });
}

function recalcularClasesDesdeProgresion() {
  asegurarDatosBuildPersonaje();
  const conteos = new Map();
  const clasePrincipal = personajeActual.clase1 || "";

  if (clasePrincipal) conteos.set(clasePrincipal, 1);

  for (let nivel = 2; nivel <= 20; nivel++) {
    const claseId = personajeActual.progresionNiveles[nivel]?.clase;
    if (!claseId) continue;
    conteos.set(claseId, (conteos.get(claseId) || 0) + 1);
  }

  const entradas = [...conteos.entries()];
  const principal = entradas.find(([claseId]) => claseId === clasePrincipal) || entradas[0] || [clasePrincipal, clasePrincipal ? 1 : 0];
  const secundarias = entradas.filter(([claseId]) => claseId !== principal[0]);

  personajeActual.clase1 = principal[0] || personajeActual.clase1;
  personajeActual.nivelClase1 = principal[1] || 1;
  personajeActual.clase2 = secundarias[0]?.[0] || "";
  personajeActual.nivelClase2 = secundarias[0]?.[1] || 0;
  personajeActual.clase3 = secundarias[1]?.[0] || "";
  personajeActual.nivelClase3 = secundarias[1]?.[1] || 0;

  sincronizarNivelPersonajeDesdeClases();
  claseElegida = obtenerClasePorId(personajeActual.clase1);
  clasesActivas = obtenerSlotsClases();
  personajeConBonos = { ...personajeConBonos, nivel: personajeActual.nivel };
}

function contarNivelClaseHastaNivelPersonaje(claseId, nivelPersonaje) {
  if (!claseId) return 0;
  let total = personajeActual.clase1 === claseId ? 1 : 0;
  for (let nivel = 2; nivel <= nivelPersonaje; nivel++) {
    if (personajeActual.progresionNiveles?.[nivel]?.clase === claseId) total++;
  }
  return total;
}


function obtenerSlotActivoPorClaseId(claseId) {
  return clasesActivas.find(slot => slot.claseId === claseId) || null;
}

function obtenerContextoClasePorId(claseId) {
  const slot = obtenerSlotActivoPorClaseId(claseId);
  return slot ? `clase${slot.numeroSlot}` : "clase1";
}

function obtenerRasgosClaseEnNivelPersonaje(nivelPersonaje, claseId) {
  const clase = obtenerClasePorId(claseId);
  if (!clase?.rasgos) return [];

  const nivelClase = contarNivelClaseHastaNivelPersonaje(claseId, nivelPersonaje);
  return clase.rasgos.filter(rasgo => (rasgo.nivelClase || 1) === nivelClase);
}

function ajustarProgresionANivelTotal(nuevoNivelTotal) {
  asegurarDatosBuildPersonaje();
  const nivelObjetivo = Math.max(1, Math.min(20, Number(nuevoNivelTotal) || 1));
  const claseBase = personajeActual.clase1 || libroDeReglasBasicas.clases[0]?.id || "";

  for (let nivel = 2; nivel <= nivelObjetivo; nivel++) {
    if (!personajeActual.progresionNiveles[nivel]?.clase && claseBase) {
      personajeActual.progresionNiveles[nivel] = { clase: claseBase };
    }
  }

  for (let nivel = nivelObjetivo + 1; nivel <= 20; nivel++) {
    delete personajeActual.progresionNiveles[nivel];
    delete personajeActual.pgPorNivel[nivel];
  }

  recalcularClasesDesdeProgresion();
}

function obtenerValorPGNivel(nivel, claseId) {
  const dado = obtenerDadoGolpeDeClase(claseId);
  if (!dado) return 0;
  const guardado = Number(personajeActual.pgPorNivel?.[nivel]);
  if (Number.isFinite(guardado) && guardado > 0) return Math.min(guardado, dado);
  return 1;
}

function calcularPuntosGolpeMaximos() {
  asegurarDatosBuildPersonaje();
  const items = [];
  let total = 0;
  const claseNivel1 = obtenerClasePorId(personajeActual.clase1);

  if (claseNivel1) {
    const valorNivel1 = Math.max(1, claseNivel1.dadoDeGolpe + modCON);
    total += valorNivel1;
    items.push({ origen: `${claseNivel1.nombre} nivel 1`, valor: valorNivel1, descripcion: `${claseNivel1.dadoDeGolpe} dado máximo + ${modCON} CON` });
  }

  for (let nivel = 2; nivel <= 20; nivel++) {
    const claseId = personajeActual.progresionNiveles[nivel]?.clase;
    if (!claseId) continue;
    const clase = obtenerClasePorId(claseId);
    if (!clase) continue;
    const tirada = obtenerValorPGNivel(nivel, claseId);
    const valorNivel = Math.max(1, tirada + modCON);
    total += valorNivel;
    items.push({ origen: `Nivel ${nivel} (${clase.nombre})`, valor: valorNivel, descripcion: `${tirada} PG de dado + ${modCON} CON` });
  }

  return { total, items };
}

function actualizarPuntosGolpe() {
  const resultadoPG = calcularPuntosGolpeMaximos();
  detalleEstadisticas.PG.total = resultadoPG.total;
  detalleEstadisticas.PG.items = resultadoPG.items;

  if (typeof personajeActual.hpActual !== "number" || personajeActual.hpActual <= 0) {
    personajeActual.hpActual = resultadoPG.total;
  }
  personajeActual.hpActual = Math.min(personajeActual.hpActual, resultadoPG.total);

  const pgElemento = document.getElementById("PG");
  if (pgElemento) pgElemento.innerText = resultadoPG.total;
}

asegurarDatosBuildPersonaje();
inicializarProgresionDesdeClases();
sincronizarNivelPersonajeDesdeClases();

let personajeConBonos = { ...personajeActual };

const detalleEstadisticas = {
  PG: { total: 0, items: [] },
  Velocidad: { total: 0, items: [] },
  Iniciativa: { total: 0, items: [] },
  CA: { total: 0, items: [] }
};

let claseElegida = libroDeReglasBasicas.clases.find(c => c.id === personajeActual.clase1);
let clasesActivas = obtenerSlotsClases();
let razaElegida = libroDeReglasBasicas.razas.find(r => r.id === personajeActual.raza.toLowerCase());
let armaduraElegida = libroDeReglasBasicas.armaduras.find(a => a.id === personajeActual.armadura);
let subrazaElegida = razaElegida && razaElegida.subrazas 
    ? razaElegida.subrazas.find(s => s.id === personajeActual.subraza?.toLowerCase()) 
    : null;

let subclaseElegida = clasesActivas[0]?.subclase || null;

const estado = {
  usaArmadura: Boolean(armaduraElegida),
  sinArmadura: !armaduraElegida,
  usaEscudo: Boolean(personajeConBonos.escudo),
  sinEscudo: !personajeConBonos.escudo
};
////////////////// CALCULO DE ESTADISTICAS BASE /////////////////////
function calcularModificadorNumero(puntuacion) { // Modificador para cálculos (Number).
return Math.floor((puntuacion - 10) / 2);
}
function calcularModificador(puntuacion) { // Modificador para mostrar con signo (String). 
let resultado = calcularModificadorNumero(puntuacion);

if (resultado >= 0) {
    return "+" + resultado; 
} else {
    return resultado; 
}
}

const bonifCompetencia = calcularBonificadorCompetencia(); // Bonificador de competencia// Agregar Bonos de Raza

function obtenerBonoStatDesdeRasgos(rasgos, statId) {
  return (rasgos || []).reduce((total, rasgo) => {
    return total + (rasgo.efectos || []).reduce((subtotal, efecto) => {
      if (efecto.tipoDeEfecto !== "bono_stat" || efecto.statAfectada !== statId) return subtotal;
      return subtotal + (efecto.valor || efecto.valorDelBono || 0);
    }, 0);
  }, 0);
}

function obtenerBonoRacialStat(statId) {
  return obtenerBonoStatDesdeRasgos(razaElegida?.rasgos, statId)
    + obtenerBonoStatDesdeRasgos(subrazaElegida?.rasgos, statId);
}

function calcularPersonajeConBonos() {
  const personajeCalculado = { ...personajeActual };
  ESTADISTICAS_PRINCIPALES.forEach(({ id }) => {
    personajeCalculado[id] = (Number(personajeActual[id]) || 0) + obtenerBonoRacialStat(id);
  });
  return personajeCalculado;
}

let modFUE = 0;
let modDES = 0;
let modCON = 0;
let modINT = 0;
let modSAB = 0;
let modCAR = 0;

function actualizarVariablesModificadores() {
  modFUE = calcularModificadorNumero(personajeConBonos.FUE);
  modDES = calcularModificadorNumero(personajeConBonos.DES);
  modCON = calcularModificadorNumero(personajeConBonos.CON);
  modINT = calcularModificadorNumero(personajeConBonos.INT);
  modSAB = calcularModificadorNumero(personajeConBonos.SAB);
  modCAR = calcularModificadorNumero(personajeConBonos.CAR);
}

function actualizarValoresEstadisticasEnFicha() {
  ESTADISTICAS_PRINCIPALES.forEach(({ id }) => {
    const valorElemento = document.getElementById(id);
    const modificadorElemento = document.getElementById(`mod-${id}`);
    if (valorElemento) valorElemento.innerText = personajeConBonos[id];
    if (modificadorElemento) modificadorElemento.innerText = calcularModificador(personajeConBonos[id]);
  });
}

function obtenerClaseSignoValor(valor) {
  if (valor > 0) return "positivo";
  if (valor < 0) return "negativo";
  return "";
}

function aplicarClaseSignoValor(elemento, valor) {
  if (!elemento) return;
  elemento.classList.remove("positivo", "negativo");
  const claseSigno = obtenerClaseSignoValor(valor);
  if (claseSigno) elemento.classList.add(claseSigno);
  if (valor > 0) elemento.classList.add("positivo");
  if (valor < 0) elemento.classList.add("negativo");
}

function actualizarResumenEstadisticasBuild() {
  ESTADISTICAS_PRINCIPALES.forEach(({ id }) => {
    const base = Number(personajeActual[id]) || 0;
    const raza = obtenerBonoRacialStat(id);
    const total = base + raza;
    const baseElemento = document.getElementById(`buildStatBase-${id}`);
    const razaElemento = document.getElementById(`buildStatRaza-${id}`);
    const totalElemento = document.getElementById(`buildStatTotal-${id}`);
    const modElemento = document.getElementById(`buildStatMod-${id}`);

    if (baseElemento) baseElemento.innerText = base;
    if (razaElemento) {
      razaElemento.innerText = formatoValor(raza);
      aplicarClaseSignoValor(razaElemento, raza);
    }
    if (totalElemento) {
      totalElemento.innerText = total;
      aplicarClaseSignoValor(totalElemento, total);
    }
    if (modElemento) modElemento.innerText = calcularModificador(total);
  });
}

function actualizarIniciativa() {
  const bonoIniciativaActual = sumaDeEfectos("iniciativa", efectos, estado);
  const iniciativaActual = modDES + bonoIniciativaActual;
  detalleEstadisticas.Iniciativa.total = iniciativaActual;
  detalleEstadisticas.Iniciativa.items = [{
    origen: "Modificador de Destreza",
    valor: modDES,
    descripcion: "Destreza final"
  }];

  if (bonoIniciativaActual) {
    detalleEstadisticas.Iniciativa.items.push({
      origen: "Bonos de iniciativa",
      valor: bonoIniciativaActual,
      descripcion: "Rasgos que añaden iniciativa"
    });
  }

  const iniciativaElemento = document.getElementById("Ini");
  if (iniciativaElemento) iniciativaElemento.innerText = formatoValor(iniciativaActual);
}

function actualizarCA() {
  const resultadoCA = calcularCA(personajeConBonos, armaduraElegida, claseElegida, razaElegida, equipo, estado);
  detalleEstadisticas.CA.total = resultadoCA.caTotal;
  detalleEstadisticas.CA.items = resultadoCA.detalle;
  const caElemento = document.getElementById("CA");
  const armaduraElemento = document.getElementById("armadura");
  if (caElemento) caElemento.innerText = resultadoCA.caTotal;
  if (armaduraElemento) armaduraElemento.innerText = resultadoCA.textoArmadura;
}

function refrescarEstadisticasPersonaje() {
  personajeConBonos = calcularPersonajeConBonos();
  actualizarVariablesModificadores();
  actualizarValoresEstadisticasEnFicha();
  actualizarResumenEstadisticasBuild();
}

refrescarEstadisticasPersonaje();
///////////////////////////////////////////////////////////////////
document.getElementById("nombre-personaje").innerText = personajeActual.nombre;
document.getElementById("info-personaje").innerText = personajeActual.raza + ", " + personajeActual.clase1 + " " + personajeActual.nivel;
document.getElementById("BC").innerText = "+" + bonifCompetencia;

////////////////////// || RASGOS || ///////////////////////////////////
function seCumpleCondicion(condicion, estado) {
  if (!condicion) return true;
  if (condicion.sinArmadura && !estado.sinArmadura) return false;
  if (condicion.sinEscudo && !estado.sinEscudo) return false;
  if (condicion.conArmadura && !estado.usaArmadura) return false;
  return true;
}

function rasgoDisponiblePorNivelClase(rasgo, nivelClase) {
  return !rasgo.nivelClase || nivelClase >= rasgo.nivelClase;
}

function obtenerRasgosDeClasesDisponibles() {
  return clasesActivas.flatMap(slot => {
    if (!slot.clase || slot.nivel <= 0) return [];

    const rasgosClase = (slot.clase.rasgos || [])
      .filter(rasgo => rasgoDisponiblePorNivelClase(rasgo, slot.nivel))
      .map(rasgo => ({ ...rasgo, origen: slot.clase.nombre, nivelClaseActual: slot.nivel, numeroSlot: slot.numeroSlot }));

    const rasgosSubclase = (slot.subclase?.rasgos || [])
      .filter(rasgo => rasgoDisponiblePorNivelClase(rasgo, slot.nivel))
      .map(rasgo => ({ ...rasgo, origen: slot.subclase.nombre, nivelClaseActual: slot.nivel, numeroSlot: slot.numeroSlot }));

    return [...rasgosClase, ...rasgosSubclase];
  });
}

function sumaEfectosDeRasgos(rasgos, tipoDeEfecto, propiedadFiltro = null, valorFiltro = null) {
  let total = 0;

  rasgos.forEach(rasgo => {
    (rasgo.efectos || []).forEach(efecto => {
      if (efecto.tipoDeEfecto === tipoDeEfecto && (!propiedadFiltro || efecto[propiedadFiltro] === valorFiltro)) {
        total += efecto.valor || efecto.valorDelBono || 0;
      }
    });
  });

  return total;
}

function sumaDeEfectos(tipoDeEfecto, propiedadFiltro = null, valorFiltro = null) {
let total = 0;

    if (typeof propiedadFiltro !== "string") {
        propiedadFiltro = null;
        valorFiltro = null;
    }

    // --- 1. ESCANEAR RAZA ---
    if (razaElegida && razaElegida.rasgos) {
        razaElegida.rasgos.forEach(rasgo => {
            if (rasgo.efectos) {
                rasgo.efectos.forEach(efecto => {
                    if (efecto.tipoDeEfecto === tipoDeEfecto) {
                        if (!propiedadFiltro || efecto[propiedadFiltro] === valorFiltro) {
                            total += efecto.valor || efecto.valorDelBono || 0;
                        }
                    }
                });
            }
        });
    }

    // --- 2. ESCANEAR SUBRAZA ---
    if (subrazaElegida && subrazaElegida.rasgos) {
        subrazaElegida.rasgos.forEach(rasgo => {
            if (rasgo.efectos) {
                rasgo.efectos.forEach(efecto => {
                  console.log(`COMPARANDO: El sistema busca [${tipoDeEfecto}] y el rasgo tiene [${efecto.tipoDeEfecto}]`);
                    if (efecto.tipoDeEfecto === tipoDeEfecto) {
                      console.log("5. Encontré un efecto del tipo que busco en la subraza:", efecto);
                        // Filtramos si requiere alguna propiedad específica (como la stat afectada)
                        if (!propiedadFiltro || efecto[propiedadFiltro] === valorFiltro) {
                            // Sumamos el valor del bono (soportando ambas nomenclaturas que usas)
                            total += efecto.valor || efecto.valorDelBono || 0;
                            console.log(`6. Sumando bono de subraza ${subrazaElegida.nombre}:`, efecto.valor || efecto.valorDelBono || 0, "Total actual:", total);
                        }
                    }
                });
            }
        });
    }

    // --- 3. ESCANEAR CLASES ACTIVAS ---
    total += sumaEfectosDeRasgos(obtenerRasgosDeClasesDisponibles(), tipoDeEfecto, propiedadFiltro, valorFiltro);

    return total;
}
function buscarEfecto(tipoDeEfecto) {
    let efectoEncontrado = null;

    // --- 1. BUSCAR EN RAZA ---
    if (razaElegida && razaElegida.rasgos) {
        razaElegida.rasgos.forEach(rasgo => {
            if (rasgo.efectos) {
                let ef = rasgo.efectos.find(e => e.tipoDeEfecto === tipoDeEfecto);
                if (ef) efectoEncontrado = ef;
            }
        });
    }
    if (efectoEncontrado) return efectoEncontrado;

    // --- BUSCAR EN SUBRAZA ---
    if (subrazaElegida && subrazaElegida.rasgos) {
        subrazaElegida.rasgos.forEach(rasgo => {
            if (rasgo.efectos) {
                let ef = rasgo.efectos.find(e => e.tipoDeEfecto === tipoDeEfecto);
                if (ef) efectoEncontrado = ef;
            }
        });
    }
    if (efectoEncontrado) return efectoEncontrado;

    // --- 3. BUSCAR EN CLASES ACTIVAS Y OPCIONES SELECCIONADAS ---
    [...obtenerRasgosDeClasesDisponibles(), ...obtenerOpcionesSeleccionadasDisponibles()].forEach(rasgo => {
        if (rasgo.efectos) {
            let ef = rasgo.efectos.find(e => e.tipoDeEfecto === tipoDeEfecto);
            if (ef) efectoEncontrado = { ...ef, nombre: rasgo.nombre, origen: rasgo.origen };
        }
    });

    return efectoEncontrado;
}


const efectos = [claseElegida, razaElegida, subrazaElegida].filter(Boolean);
const equipo = [...(personajeConBonos.equipo || []), personajeConBonos.escudo].filter(Boolean);
const bonoVelocidad = sumaDeEfectos("velocidad", efectos, estado);
const bonoCARaza = sumaDeEfectos("bonoCA", efectos, estado);
const bonoIniciativa = sumaDeEfectos("iniciativa", efectos, estado);
const iniciativaTotal = modDES + bonoIniciativa;

///////////////////// CÁLCULO DE PUNTOS DE GOLPE /////////////////////
actualizarPuntosGolpe();
///////////////////// CÁLCULO DE INICIATIVA /////////////////////
detalleEstadisticas.Iniciativa.total = iniciativaTotal;
detalleEstadisticas.Iniciativa.items.push({
  origen: "Modificador de Destreza",
  valor: modDES,
  descripcion: "Destreza final"
});

if (bonoIniciativa) {
  detalleEstadisticas.Iniciativa.items.push({
    origen: "Bonos de iniciativa",
    valor: bonoIniciativa,
    descripcion: "Rasgos que añaden iniciativa"
  });
}

if (iniciativaTotal >= 0) {
    document.getElementById("Ini").innerText = "+" + iniciativaTotal;
} else {
    document.getElementById("Ini").innerText = iniciativaTotal;
}

/////////////////////////////////////////////////////////////////

///////////////////// Popup de Estadísticas /////////////////////
function formatoValor(valor) {
  if (typeof valor !== "number" || Number.isNaN(valor)) return valor;
  return valor >= 0 ? "+" + valor : String(valor);
}

function renderPopupEstadisticas(detalle, clave) {
  const contenido = document.getElementById("popupContenido");
  const entradas = clave && Object.prototype.hasOwnProperty.call(detalle, clave)
    ? [[clave, detalle[clave]]]
    : Object.entries(detalle);

  contenido.innerHTML = entradas
    .map(([titulo, data]) => {
      const itemsHtml = data.items.length
        ? data.items.map(item => `
            <div class="popup-item">
              <strong>${item.origen}</strong>: ${formatoValor(item.valor)}
              <small>${item.descripcion}</small>
            </div>
          `).join("")
        : "<p>No hay contribuciones.</p>";

      return `
        <section class="popup-seccion">
          <h3>${titulo} — Total ${formatoValor(data.total)}</h3>
          ${itemsHtml}
        </section>
      `;
    })
    .join("");
}

function abrirPopupEstadisticas(clave) {
  renderPopupEstadisticas(detalleEstadisticas, clave);
  document.getElementById("popup-estadisticas").classList.remove("oculto");
}

function cerrarPopupEstadisticas() {
  document.getElementById("popup-estadisticas").classList.add("oculto");
}
/////////////////////////////////////////////////////////////////

///////////////////// CÁLCULO DE VELOCIDAD /////////////////////
if (razaElegida) {
  let velocidadBase = razaElegida.velocidad;
  let velocidadTotal = velocidadBase + bonoVelocidad;

  detalleEstadisticas.Velocidad.total = velocidadTotal;
  detalleEstadisticas.Velocidad.items.push(
    { origen: "Velocidad base", valor: velocidadBase, descripcion: "Velocidad de la raza" }
  );

  if (bonoVelocidad) {
    detalleEstadisticas.Velocidad.items.push({
      origen: "Bonos de velocidad",
      valor: bonoVelocidad,
      descripcion: "Rasgos u objetos"
    });
  }

  document.getElementById("Vel").innerText = velocidadTotal;
}

////////////////////// RENDERIZADO DE PUNTOS DE GOLPE /////////////////////
function renderVida() {
  const hpMax = detalleEstadisticas.PG.total; // tu cálculo de HP máx
  const hpActual = personajeActual.hpActual;
  const hpTemporales = personajeActual.hpTemporales;

  document.getElementById("hpResumen").innerText =
    `Puntos de Golpe: ${hpMax} / ${hpActual}`;

  const tempTexto = document.getElementById("hpTemporalesTexto");
  if (hpTemporales > 0) {
    tempTexto.innerText = `+${hpTemporales} PG temporales`;
    tempTexto.classList.remove("oculto");
  } else {
    tempTexto.classList.add("oculto");
  }

  const rojo = document.getElementById("barraRoja");
  const azul = document.getElementById("barraAzul");

  const anchoRojo = (hpActual / hpMax) * 100;
  const anchoTotal = Math.min((hpActual + hpTemporales) / hpMax * 100, 100);

  rojo.style.width = `${Math.max(0, anchoRojo)}%`;
  azul.style.width = `${Math.max(0, anchoTotal)}%`;

  document.getElementById("chkInspiracion").checked =
    Boolean(personajeActual.inspiracion);
  document.getElementById("chkConcentracion").checked =
    Boolean(personajeActual.concentracion);
 }
function guardarEstadoVida() {
  const estado = {
    hpActual: personajeActual.hpActual,
    hpTemporales: personajeActual.hpTemporales,
    inspiracion: personajeActual.inspiracion,
    concentracion: personajeActual.concentracion,
    estadosActivos: personajeActual.estadosActivos
  };
  escribirJsonLocalStorage("creadorDndPersonaje", estado);
  marcarPersonajeModificado();
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function obtenerEstadosLibroReglas() {
  return Array.isArray(libroDeReglasBasicas.estados) ? libroDeReglasBasicas.estados : [];
}

function obtenerEstadoPorId(estadoId) {
  return obtenerEstadosLibroReglas().find(estadoRegla => estadoRegla.id === estadoId);
}

function renderSelectorEstados() {
  const selector = document.getElementById("selectEstado");
  if (!selector) return;

  const estadosActivos = new Set(personajeActual.estadosActivos || []);
  const opciones = obtenerEstadosLibroReglas()
    .filter(estadoRegla => !estadosActivos.has(estadoRegla.id))
    .map(estadoRegla => `<option value="${escaparHtml(estadoRegla.id)}">${escaparHtml(estadoRegla.nombre)}</option>`)
    .join("");

  selector.innerHTML = `<option value="">Agregar estado...</option>${opciones}`;
}

function renderEstadosActivos() {
  const contenedor = document.getElementById("estadoTags");
  if (!contenedor) return;

  const estadosActivos = normalizarListaEstados(personajeActual.estadosActivos);
  personajeActual.estadosActivos = estadosActivos;

  if (!estadosActivos.length) {
    contenedor.innerHTML = '<p class="estado-tags-vacio">Sin estados activos.</p>';
    renderSelectorEstados();
    return;
  }

  contenedor.innerHTML = estadosActivos
    .map(estadoId => obtenerEstadoPorId(estadoId))
    .filter(Boolean)
    .map(estadoRegla => `
      <span class="estado-tag">
        <button class="estado-tag-quitar" type="button" data-estado-quitar="${escaparHtml(estadoRegla.id)}" aria-label="Quitar ${escaparHtml(estadoRegla.nombre)}">×</button>
        <button class="estado-tag-nombre" type="button" data-estado-abrir="${escaparHtml(estadoRegla.id)}">${escaparHtml(estadoRegla.nombre)}</button>
      </span>
    `)
    .join("");

  renderSelectorEstados();
}

function agregarEstadoActivo(estadoId) {
  if (!obtenerEstadoPorId(estadoId)) return;
  const estadosActivos = normalizarListaEstados(personajeActual.estadosActivos);
  if (!estadosActivos.includes(estadoId)) {
    personajeActual.estadosActivos = [...estadosActivos, estadoId];
    guardarEstadoVida();
    renderEstadosActivos();
  }
}

function quitarEstadoActivo(estadoId) {
  const estadosActualizados = normalizarListaEstados(personajeActual.estadosActivos)
    .filter(estadoActivoId => estadoActivoId !== estadoId);
  if (estadosActualizados.length !== (personajeActual.estadosActivos || []).length) {
    personajeActual.estadosActivos = estadosActualizados;
    guardarEstadoVida();
    renderEstadosActivos();
  }
}

function abrirPopupEstado(estadoId) {
  const estadoRegla = obtenerEstadoPorId(estadoId);
  if (!estadoRegla) return;

  const contenido = document.getElementById("popup-estado-contenido");
  contenido.innerHTML = `
    <h2>${escaparHtml(estadoRegla.nombre)}</h2>
    <p>${escaparHtml(estadoRegla.descripcion)}</p>
  `;
  document.getElementById("popup-estado").classList.remove("oculto");
}

function cerrarPopupEstado() {
  document.getElementById("popup-estado").classList.add("oculto");
}
function aplicarCuracion(valor) {
  const hpAnterior = personajeActual.hpActual;
  const hpMax = detalleEstadisticas.PG.total;
  personajeActual.hpActual = Math.min(
    hpMax,
    personajeActual.hpActual + Math.max(0, valor)
  );
  if (personajeActual.hpActual !== hpAnterior) guardarEstadoVida();
  renderVida();
}

function aplicarDano(valor) {
  const hpAnterior = personajeActual.hpActual;
  const temporalesAnteriores = personajeActual.hpTemporales;
  let restante = Math.max(0, valor);

  if (personajeActual.hpTemporales > 0) {
    const absorbidoTemporales = Math.min(personajeActual.hpTemporales, restante);
    personajeActual.hpTemporales -= absorbidoTemporales;
    restante -= absorbidoTemporales;
  }

  personajeActual.hpActual = Math.max(0, personajeActual.hpActual - restante);
  if (
    personajeActual.hpActual !== hpAnterior
    || personajeActual.hpTemporales !== temporalesAnteriores
  ) {
    guardarEstadoVida();
  }
  renderVida();
}

function aplicarTemporales(valor) {
  const temporalesAnteriores = personajeActual.hpTemporales;
  personajeActual.hpTemporales = Math.max(0, valor);
  if (personajeActual.hpTemporales !== temporalesAnteriores) guardarEstadoVida();
  renderVida();
}

function alternarInspiracion() {
  personajeActual.inspiracion = !personajeActual.inspiracion;
  guardarEstadoVida();
  renderVida();
}

function alternarConcentracion() {
  personajeActual.concentracion = !personajeActual.concentracion;
  guardarEstadoVida();
  renderVida();
}
document.getElementById("btnCuracion")
  .addEventListener("click", () => {
    const valor = Number(document.getElementById("hpInput").value) || 0;
    aplicarCuracion(valor);
  });

document.getElementById("btnDano")
  .addEventListener("click", () => {
    const valor = Number(document.getElementById("hpInput").value) || 0;
    aplicarDano(valor);
  });

document.getElementById("btnTemporales")
  .addEventListener("click", () => {
    const valor = Number(document.getElementById("hpInput").value) || 0;
    aplicarTemporales(valor);
  });

document.getElementById("chkInspiracion")
  .addEventListener("change", alternarInspiracion);

document.getElementById("chkConcentracion")
  .addEventListener("change", alternarConcentracion);

document.getElementById("btnAgregarEstado")
  .addEventListener("click", () => {
    const selector = document.getElementById("selectEstado");
    agregarEstadoActivo(selector.value);
    selector.value = "";
  });

document.getElementById("estadoTags")
  .addEventListener("click", evento => {
    const botonQuitar = evento.target.closest("[data-estado-quitar]");
    if (botonQuitar) {
      quitarEstadoActivo(botonQuitar.dataset.estadoQuitar);
      return;
    }

    const botonAbrir = evento.target.closest("[data-estado-abrir]");
    if (botonAbrir) abrirPopupEstado(botonAbrir.dataset.estadoAbrir);
  });

renderVida();
renderEstadosActivos();
///////////////////// ARMADURAS /////////////////////
const { caTotal, textoArmadura, detalle } = calcularCA(
  personajeConBonos,
  armaduraElegida,
  claseElegida,
  razaElegida,
  equipo,
  estado
);

detalleEstadisticas.CA.total = caTotal;
detalleEstadisticas.CA.items = detalle;
document.getElementById("CA").innerText = caTotal;
document.getElementById("armadura").innerText = textoArmadura;

function calcularCADesdeEfecto(personaje, efecto) {
  if (!efecto || typeof efecto.base !== "number") return undefined;
  let total = efecto.base;
  if (Array.isArray(efecto.modificadores)) {
    efecto.modificadores.forEach(stat => {
      if (typeof personaje[stat] === "number") {
        total += calcularModificadorNumero(personaje[stat]);
      }
    });
  }
  return total;
}

function calcularCA(personaje, armaduraElegida, claseElegida, razaElegida, equipo, estado) {
  const modDES = calcularModificadorNumero(personaje.DES);
  let caTotal;
  let textoArmadura = "Armadura natural";
  const detalle = [];

  if (armaduraElegida) {
    textoArmadura = armaduraElegida.nombre;

    if (armaduraElegida.tipo === "ligera") {
      caTotal = armaduraElegida.caBase + modDES;
      detalle.push({
        origen: armaduraElegida.nombre,
        valor: armaduraElegida.caBase,
        descripcion: "Base de armadura ligera"
      });
      detalle.push({
        origen: "Modificador de Destreza",
        valor: modDES,
        descripcion: "Destreza aplicada a armadura ligera"
      });
    } else if (armaduraElegida.tipo === "media") {
      const modMedia = Math.min(modDES, 2);
      caTotal = armaduraElegida.caBase + modMedia;
      detalle.push({
        origen: armaduraElegida.nombre,
        valor: armaduraElegida.caBase,
        descripcion: "Base de armadura media"
      });
      detalle.push({
        origen: "Modificador de Destreza",
        valor: modMedia,
        descripcion: "Máximo +2 en armadura media"
      });
    } else {
      caTotal = armaduraElegida.caBase;
      detalle.push({
        origen: armaduraElegida.nombre,
        valor: armaduraElegida.caBase,
        descripcion: "Base de armadura pesada"
      });
    }
  } else {
    let efectoCa = buscarEfecto("caSinArmadura");

    if (efectoCa && seCumpleCondicion(efectoCa.condicion, estado)) {
      caTotal = calcularCADesdeEfecto(personaje, efectoCa);
      textoArmadura = efectoCa.nombre || "Defensa sin Armadura";
      detalle.push({
        origen: efectoCa.nombre + " de " + (claseElegida?.nombre || razaElegida?.nombre)  || "Defensa sin Armadura",
        valor: caTotal,
        descripcion: efectoCa.base + " + " + (efectoCa.modificadores || []).join(" + ")
      });
    } else {
      caTotal = 10 + modDES;
      detalle.push({
        origen: "Armadura natural",
        valor: 10 + modDES,
        descripcion: "CA base sin armadura"
      });
    }
  }

  const bonoCARaza = sumaDeEfectos("bonoCA", [claseElegida, razaElegida], estado);
  if (bonoCARaza) {
    caTotal += bonoCARaza;
    detalle.push({
      origen: "Bonos de CA de rasgos",
      valor: bonoCARaza,
      descripcion: "Rasgos que añaden CA"
    });
  }

  const bonoCAEquip = equipo
    .map(id => libroDeReglasBasicas.equipo.find(item => item.id === id))
    .reduce((sum, item) => sum + (item?.bonifCA || 0), 0);
    let nombres = [...equipo.map(id => {
      const item = libroDeReglasBasicas.equipo.find(e => e.id === id);
      return item ? item.nombre : null;
    }).filter(Boolean)];

  if (bonoCAEquip) {
    caTotal += bonoCAEquip;
    detalle.push({
      origen: "Bonos de " + nombres.join(", "),
      valor: bonoCAEquip,
      descripcion: "Bonos de CA de objetos"
    });
  }

  return { caTotal, textoArmadura, detalle };
}

["PG", "Vel", "Ini", "CA"].forEach(id => {
  const element = document.getElementById(id);
  if (element && element.parentElement) {
    element.parentElement.addEventListener("click", () => abrirPopupEstadisticas(id));
  }
});

document.querySelectorAll(".caja-stat.clickable").forEach(box => {
  const popupKey = box.dataset.popupKey;
  if (popupKey) {
    box.addEventListener("click", () => abrirPopupEstadisticas(popupKey));
  }
});

document.getElementById("popupCerrar").addEventListener("click", cerrarPopupEstadisticas);
document.getElementById("popup-estadisticas").addEventListener("click", event => {
  if (event.target.id === "popup-estadisticas") {
    cerrarPopupEstadisticas();
  }
});


// ══════════════════════════════════════════════
//  SISTEMA DE VENTANAS (TABS)
// ══════════════════════════════════════════════

// El panel donde se renderiza el contenido
const panelVentanas = document.querySelector(".panel-ventanas");

// ── Contenido de cada pestaña ──────────────────


function normalizarTextoCompetencia(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function unirCompetenciasPorNombre(...listas) {
  const resultado = [];
  const vistas = new Set();

  listas.flat().filter(Boolean).forEach(nombre => {
    const clave = normalizarTextoCompetencia(nombre);
    if (!vistas.has(clave)) {
      vistas.add(clave);
      resultado.push(nombre);
    }
  });

  return resultado;
}

function obtenerHabilidadesElegidasDesdeRasgos() {
  const habilidadesElegidas = [];

  const agregarHabilidadesDesdeRasgo = (rasgo, contexto) => {
    obtenerSeleccionesDeRasgo(rasgo)
      .filter(seleccion => seleccion.tipo === "habilidad")
      .forEach(seleccion => {
        const idsElegidas = obtenerOpcionesElegidas(rasgo, seleccion, contexto);
        const opcionesDisponibles = resolverOpcionesSeleccion(seleccion, contexto);
        idsElegidas.forEach(id => {
          const opcion = opcionesDisponibles.find(item => item.id === id);
          if (opcion?.nombre) habilidadesElegidas.push(opcion.nombre);
        });
      });
  };

  (razaElegida?.rasgos || []).forEach(rasgo => agregarHabilidadesDesdeRasgo(rasgo, "raza"));
  (subrazaElegida?.rasgos || []).forEach(rasgo => agregarHabilidadesDesdeRasgo(rasgo, "subraza"));

  clasesActivas.forEach(slot => {
    if (!slot.clase || slot.nivel <= 0) return;
    (slot.clase.rasgos || [])
      .filter(rasgo => rasgoDisponiblePorNivelClase(rasgo, slot.nivel))
      .forEach(rasgo => agregarHabilidadesDesdeRasgo(rasgo, `clase${slot.numeroSlot}`));
  });

  return habilidadesElegidas;
}

function obtenerHabilidadesDesdeEfectos() {
  const rasgosConEfectos = [
    ...(razaElegida?.rasgos || []),
    ...(subrazaElegida?.rasgos || []),
    ...obtenerRasgosDeClasesDisponibles(),
    ...obtenerOpcionesSeleccionadasDisponibles()
  ];

  return rasgosConEfectos.flatMap(rasgo => (rasgo.efectos || [])
    .filter(efecto => efecto.tipoDeEfecto === "bono_habilidad" && efecto.habilidadAfectada)
    .map(efecto => efecto.habilidadAfectada));
}

function obtenerHabilidadesCompetentes() {
  return unirCompetenciasPorNombre(
    clasesActivas.flatMap(slot => slot.clase?.competencias?.habilidades ?? []),
    razaElegida?.competencias?.habilidades ?? [],
    obtenerHabilidadesDesdeEfectos(),
    obtenerHabilidadesElegidasDesdeRasgos()
  );
}

function renderCompetencias() {
  const clase1 = libroDeReglasBasicas.clases.find(c => c.id === personajeActual.clase1);
  const BC = calcularBonificadorCompetencia(); // Bonificador de competencia

  // ── Stats base del personaje con bonos de raza ya aplicados ──
  const stats = {
    FUE: personajeConBonos.FUE, DES: personajeConBonos.DES,
    CON: personajeConBonos.CON, INT: personajeConBonos.INT,
    SAB: personajeConBonos.SAB, CAR: personajeConBonos.CAR,
  };

  // ── Bloque 1: Tiradas de Salvación ──
  // Cada clase1 define en qué stats es competente para salvaciones
  const salvacionesCompetentes = clase1?.competencias?.salvaciones ?? [];

  const TODAS_SALVACIONES = [
    { stat: "FUE", label: "Fuerza" },
    { stat: "DES", label: "Destreza" },
    { stat: "CON", label: "Constitución" },
    { stat: "INT", label: "Inteligencia" },
    { stat: "SAB", label: "Sabiduría" },
    { stat: "CAR", label: "Carisma" },
  ];

  const salvacionesHTML = TODAS_SALVACIONES.map(({ stat, label }) => {
    const esCompetente = salvacionesCompetentes.includes(stat);
    const mod = calcularModificadorNumero(stats[stat]) + (esCompetente ? BC : 0);
    const signo = mod >= 0 ? "+" : "";
    return `
      <div class="comp-fila ${esCompetente ? "competente" : ""}">
        <span class="comp-dot ${esCompetente ? "dot-on" : "dot-off"}"></span>
        <span class="comp-mod">${signo}${mod}</span>
        <span class="comp-nombre">${label}</span>
      </div>`;
  }).join("");

  // ── Bloque 2: Habilidades ──
  // Mapa de habilidad → stat base
  const HABILIDADES = [
    { nombre: "Acrobacias",         stat: "DES" },
    { nombre: "Trato con Animales", stat: "SAB" },
    { nombre: "Arcanos",            stat: "INT" },
    { nombre: "Atletismo",          stat: "FUE" },
    { nombre: "Engaño",             stat: "CAR" },
    { nombre: "Historia",           stat: "INT" },
    { nombre: "Perspicacia",        stat: "SAB" },
    { nombre: "Intimidación",       stat: "CAR" },
    { nombre: "Investigación",      stat: "INT" },
    { nombre: "Medicina",           stat: "SAB" },
    { nombre: "Naturaleza",         stat: "INT" },
    { nombre: "Percepción",         stat: "SAB" },
    { nombre: "Interpretación",     stat: "CAR" },
    { nombre: "Persuasión",         stat: "CAR" },
    { nombre: "Religión",           stat: "INT" },
    { nombre: "Juego de Manos",     stat: "DES" },
    { nombre: "Sigilo",             stat: "DES" },
    { nombre: "Supervivencia",      stat: "SAB" },
  ];

  // Las habilidades competentes vienen de clase, raza y elecciones hechas en Build.
  const habilidadesCompetentes = obtenerHabilidadesCompetentes();
  const habilidadesCompetentesNormalizadas = habilidadesCompetentes.map(normalizarTextoCompetencia);

  const habilidadesHTML = HABILIDADES.map(({ nombre, stat }) => {
    const esCompetente = habilidadesCompetentesNormalizadas.includes(normalizarTextoCompetencia(nombre));
    const mod = calcularModificadorNumero(stats[stat]) + (esCompetente ? BC : 0);
    const signo = mod >= 0 ? "+" : "";
    return `
      <div class="comp-fila ${esCompetente ? "competente" : ""}">
        <span class="comp-dot ${esCompetente ? "dot-on" : "dot-off"}"></span>
        <span class="comp-mod">${signo}${mod}</span>
        <span class="comp-nombre">${nombre} <small class="comp-stat">(${stat})</small></span>
      </div>`;
  }).join("");

  // ── Bloque 3: Otras competencias ──
  const armas        = clase1?.competencias?.armas        ?? "—";
  const armaduras    = clase1?.competencias?.armaduras    ?? "—";
  const herramientas = clase1?.competencias?.herramientas ?? "—";
  const idiomas      = [
    ...(razaElegida?.idiomas ?? []),
    ...(clase1?.competencias?.idiomas ?? []),
  ];

  panelVentanas.innerHTML = `
    <h2 class="titulo-panel">Competencias</h2>

    <div class="comp-bloques">

      <!-- Bloque 1: Salvaciones -->
      <div class="comp-bloque">
        <p class="comp-bloque-titulo">Tiradas de Salvación</p>
        ${salvacionesHTML}
      </div>

      <!-- Bloque 2: Habilidades -->
      <div class="comp-bloque">
        <p class="comp-bloque-titulo">Habilidades</p>
        ${habilidadesHTML}
      </div>

      <!-- Bloque 3: Otras -->
      <div class="comp-bloque">
        <p class="comp-bloque-titulo">Otras Competencias</p>
        <div class="comp-grupo">
          <p class="comp-titulo">Armas</p>
          <p class="comp-valor">${armas}</p>
        </div>
        <div class="comp-grupo">
          <p class="comp-titulo">Armaduras</p>
          <p class="comp-valor">${armaduras}</p>
        </div>
        <div class="comp-grupo">
          <p class="comp-titulo">Herramientas</p>
          <p class="comp-valor">${herramientas}</p>
        </div>
        <div class="comp-grupo">
          <p class="comp-titulo">Idiomas</p>
          <div class="comp-tags" style="margin-top:4px">
            ${idiomas.length
              ? idiomas.map(i => `<span class="comp-tag">${i}</span>`).join("")
              : "<span class='comp-tag'>—</span>"}
          </div>
        </div>
      </div>

    </div>
  `;
}

// 1. Creamos un "bolsillo" temporal para guardar los rasgos que mostramos en pantalla
let listaRasgosActuales = [];
let listaRasgosBuildActuales = [];
let listaSeleccionesBuildActuales = [];

// 2. Nuestra nueva función constructora de la pestaña Rasgos
function renderRasgos() {
    listaRasgosActuales = [];
    let contadorId = 0;
    
    let html = `
        <h2 class="titulo-panel">Rasgos y Atributos</h2>
        <div class="rasgos-contenedor-scroll" style="max-height: 75vh; overflow-y: auto; padding-right: 5px;">
    `;

    // ==========================================
    // 1. SECCIÓN DE RAZA (Desplegable Principal)
    // ==========================================
    if (razaElegida) {
        // La propiedad 'open' hace que arranque abierto por defecto. Si lo quitas, arrancará cerrado.
        html += `<details open class="desplegable-seccion">
                    <summary class="desplegable-titulo">Raza: ${razaElegida.nombre}</summary>
                    <div class="desplegable-contenido">`;
        
        // Rasgos base de la Raza
        if (razaElegida.rasgos && razaElegida.rasgos.length > 0) {
            razaElegida.rasgos.forEach(rasgo => {
                listaRasgosActuales.push({ ...rasgo, origen: razaElegida.nombre });
                let resumen = rasgo.descripcionResum || (rasgo.descripcion ? rasgo.descripcion.substring(0, 60) + "..." : "Sin descripción.");
                resumen = resumen.replace(/<br>|###|\*\*/g, ""); 

                html += `
                    <div class="rasgo-tarjeta-boton" onclick="abrirPopupRasgo(${contadorId})">
                        <div class="rasgo-tarjeta-titulo">${rasgo.nombre}</div>
                        <div class="rasgo-tarjeta-resumen">${resumen}</div>
                    </div>
                `;
                contadorId++;
            });
        }

        // --- SUBRAZA (Desplegable Secundario anidado) ---
        if (subrazaElegida && subrazaElegida.rasgos && subrazaElegida.rasgos.length > 0) {
            html += `<details open class="desplegable-subseccion">
                        <summary class="desplegable-subtitulo">Subraza: ${subrazaElegida.nombre}</summary>
                        <div class="desplegable-contenido">`;
            
            subrazaElegida.rasgos.forEach(rasgo => {
                listaRasgosActuales.push({ ...rasgo, origen: subrazaElegida.nombre });
                let resumen = rasgo.descripcionResum || (rasgo.descripcion ? rasgo.descripcion.substring(0, 60) + "..." : "Sin descripción.");
                resumen = resumen.replace(/<br>|###|\*\*/g, ""); 

                html += `
                    <div class="rasgo-tarjeta-boton" onclick="abrirPopupRasgo(${contadorId})">
                        <div class="rasgo-tarjeta-titulo">${rasgo.nombre}</div>
                        <div class="rasgo-tarjeta-resumen">${resumen}</div>
                    </div>
                `;
                contadorId++;
            });
            html += `</div></details>`; // Cierra Subraza
        }
        
        html += `</div></details>`; // Cierra Raza
    }

    // ==========================================
    // 2. SECCIÓN DE CLASES (Desplegables Principal)
    // ==========================================
    clasesActivas.filter(slot => slot.clase && slot.nivel > 0).forEach(slot => {
        html += `<details open class="desplegable-seccion" style="margin-top: 15px;">
                    <summary class="desplegable-titulo">Clase ${slot.numeroSlot}: ${slot.clase.nombre} nivel ${slot.nivel}</summary>
                    <div class="desplegable-contenido">`;
        
        if (slot.clase.rasgos && slot.clase.rasgos.length > 0) {
            let tieneRasgosClase = false;
            slot.clase.rasgos.forEach(rasgo => {
              if (rasgoDisponiblePorNivelClase(rasgo, slot.nivel)) {
                    tieneRasgosClase = true;
                    listaRasgosActuales.push({...rasgo,origen: slot.clase.nombre});
                    let resumen = rasgo.descripcionResum || (rasgo.descripcion ? rasgo.descripcion.substring(0, 60) + "..." : "Sin descripción.");
                    resumen = resumen.replace(/<br>|###|\*\*/g, "");

                    html += `
                        <div class="rasgo-tarjeta-boton" onclick="abrirPopupRasgo(${contadorId})">
                            <div class="rasgo-tarjeta-titulo">
                                ${rasgo.nombre} <span style="font-size: 11px; font-weight: normal; color: #8b7355;">(Nvl ${rasgo.nivelClase || 1} de ${slot.clase.nombre})</span>
                            </div>
                            <div class="rasgo-tarjeta-resumen">${resumen}</div>
                        </div>
                    `;
                    contadorId++;
                }
            });
  
            if (!tieneRasgosClase) {
                html += `<p style="color: #776a62; font-style: italic; font-size: 13px; margin-left: 10px;">Aún no tienes rasgos desbloqueados para tu nivel de ${slot.clase.nombre}.</p>`;
            }
        }

        if (slot.subclase && slot.subclase.rasgos && slot.subclase.rasgos.length > 0) {
            html += `<details open class="desplegable-subseccion">
                        <summary class="desplegable-subtitulo">Subclase: ${slot.subclase.nombre}</summary>
                        <div class="desplegable-contenido">`;
            
            slot.subclase.rasgos.forEach(rasgo => {
                if (rasgoDisponiblePorNivelClase(rasgo, slot.nivel)) {
                    listaRasgosActuales.push({ ...rasgo, origen: slot.subclase.nombre });
                    let resumen = rasgo.descripcionResum || (rasgo.descripcion ? rasgo.descripcion.substring(0, 60) + "..." : "Sin descripción.");
                    resumen = resumen.replace(/<br>|###|\*\*/g, "");

                    html += `
                        <div class="rasgo-tarjeta-boton" onclick="abrirPopupRasgo(${contadorId})">
                            <div class="rasgo-tarjeta-titulo">
                                ${rasgo.nombre} <span style="font-size: 11px; font-weight: normal; color: #8b7355;">(Nvl ${rasgo.nivelClase || 1} de ${slot.clase.nombre})</span>
                            </div>
                            <div class="rasgo-tarjeta-resumen">${resumen}</div>
                        </div>
                    `;
                    contadorId++;
                }
            });

            html += `</div></details>`;
        }
        
        html += `</div></details>`;
    });

    html += `</div>`; // Cierra el contenedor con scroll
    document.querySelector(".panel-ventanas").innerHTML = html;
}
// --- FUNCIONES DEL POPUP DE RASGOS ---

function abrirPopupRasgo(indice) {
    let rasgo = listaRasgosActuales[indice];
    if (!rasgo) return;
    
    let requisitosHTML = "";
    if (rasgo.requisitos) {
        requisitosHTML = `<p style="margin: 0 0 5px 0;"><strong>Requisitos:</strong> ${rasgo.requisitos}</p>`;
    }
    
    // Armamos el contenido estructurado de arriba hacia abajo de forma natural
    let contenido = `
        <div style="text-align: left; display: flex; flex-direction: column; height: 100%;">
            <h3 style="color: #5a4035; margin: 0 0 10px 0; border-bottom: 2px solid #5a4035; padding-bottom: 8px; font-family: Georgia, serif; font-size: 22px;">
                ${rasgo.nombre}
            </h3>
            
            <div style="background-color: #f3ead7; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; border: 1px solid #dccbb0; color: #5a4035;">
                <p style="margin: 0 0 5px 0;"><strong>Rasgo de </strong> ${rasgo.origen}</p>
                ${requisitosHTML}
            </div>
            
            <div style="line-height: 1.6; color: #2b2521; font-size: 14.5px; overflow-y: auto; max-height: 50vh; padding-right: 5px;">
                ${rasgo.descripcion}
            </div>
        </div>
    `;
    
    document.getElementById("popup-rasgo-contenido").innerHTML = contenido;
    document.getElementById("popup-rasgo").classList.remove("oculto");
}

function cerrarPopupRasgo() {
    // Para cerrar, simplemente le devolvemos la clase1 "oculto" al contenedor
    document.getElementById("popup-rasgo").classList.add("oculto");
}

function abrirPopupRasgoBuild(indice) {
    const rasgo = listaRasgosBuildActuales[indice];
    if (!rasgo) return;

    let requisitosHTML = "";
    if (rasgo.requisitos) {
        requisitosHTML = `<p style="margin: 0 0 5px 0;"><strong>Requisitos:</strong> ${rasgo.requisitos}</p>`;
    }

    const contenido = `
        <div style="text-align: left; display: flex; flex-direction: column; height: 100%;">
            <h3 style="color: #5a4035; margin: 0 0 10px 0; border-bottom: 2px solid #5a4035; padding-bottom: 8px; font-family: Georgia, serif; font-size: 22px;">
                ${rasgo.nombre}
            </h3>

            <div style="background-color: #f3ead7; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; border: 1px solid #dccbb0; color: #5a4035;">
                <p style="margin: 0 0 5px 0;"><strong>Origen del Atributo:</strong> ${rasgo.origen}</p>
                ${requisitosHTML}
            </div>

            <div style="line-height: 1.6; color: #2b2521; font-size: 14.5px; overflow-y: auto; max-height: 50vh; padding-right: 5px;">
                ${rasgo.descripcion || "Sin descripción."}
            </div>
        </div>
    `;

    document.getElementById("popup-rasgo-contenido").innerHTML = contenido;
    document.getElementById("popup-rasgo").classList.remove("oculto");
}

function abrirPopupSeleccionBuild(indice) {
  const item = listaSeleccionesBuildActuales[indice];
  if (!item) return;

  renderPopupSeleccionBuild(indice);
  document.getElementById("popup-rasgo").classList.remove("oculto");
}

function renderPopupSeleccionBuild(indice) {
  const item = listaSeleccionesBuildActuales[indice];
  if (!item) return;

  const { rasgo, seleccion, contexto } = item;
  const elegidas = obtenerOpcionesElegidas(rasgo, seleccion, contexto);
  const restantes = Math.max(0, (seleccion.cantidadSeleccionable || 0) - elegidas.length);

  const opciones = resolverOpcionesSeleccion(seleccion, contexto);
  const usarFormatoHabilidades = seleccion.tipo === "habilidad";

  const opcionesHTML = usarFormatoHabilidades
    ? renderOpcionesHabilidadSeleccionBuild(indice, opciones, elegidas, restantes)
    : renderOpcionesRasgoSeleccionBuild(indice, opciones, elegidas, restantes);

  document.getElementById("popup-rasgo-contenido").innerHTML = `
    <div style="text-align:left;">
      <h3 style="color:#5a4035; margin:0 0 10px; border-bottom:2px solid #5a4035; padding-bottom:8px; font-family:Georgia, serif; font-size:22px;">
        ${textoSeguro(seleccion.nombre)}
      </h3>
      <p style="color:#6b5a53; margin:0 0 12px;">${textoSeguro(seleccion.descripcion || rasgo.nombre || "Selecciona opciones")}</p>
      <div class="build-popup-contador">
        Puedes marcar ${seleccion.cantidadSeleccionable} ${textoSeguro(textoTipoSeleccion(seleccion))}. Restantes: ${restantes}
      </div>
      <div class="${usarFormatoHabilidades ? "build-popup-opciones" : "build-popup-rasgos"}">
        ${opcionesHTML || `<p style="color:#6b5a53;">No hay opciones cargadas todavía.</p>`}
      </div>
    </div>
  `;
}

function renderOpcionesHabilidadSeleccionBuild(indice, opciones, elegidas, restantes) {
  return opciones.map(opcion => {
    const seleccionada = elegidas.includes(opcion.id);
    const bloqueada = !seleccionada && restantes === 0;
    const claseFila = `comp-fila build-popup-opcion ${seleccionada ? "competente" : ""} ${bloqueada ? "bloqueada" : ""}`;

    return `
      <div class="${claseFila}" onclick="toggleOpcionSeleccionBuild(${indice}, '${textoSeguro(opcion.id)}')">
        <span class="comp-dot ${seleccionada ? "dot-on" : "dot-off"}"></span>
        <span class="comp-nombre">${textoSeguro(opcion.nombre)}</span>
      </div>
    `;
  }).join("");
}

function renderOpcionesRasgoSeleccionBuild(indice, opciones, elegidas, restantes) {
  return opciones.map(opcion => {
    const seleccionada = elegidas.includes(opcion.id);
    const bloqueada = !seleccionada && restantes === 0;
    const resumen = opcion.descripcionResum || (opcion.descripcion ? opcion.descripcion.replace(/<[^>]*>/g, "").slice(0, 90) + "..." : "Sin descripción.");

    return `
      <div class="build-popup-rasgo-opcion ${seleccionada ? "seleccionado" : ""} ${bloqueada ? "bloqueada" : ""}" onclick="abrirPopupOpcionSeleccionBuild(${indice}, '${textoSeguro(opcion.id)}')">
        <input
          class="build-popup-checkbox"
          type="checkbox"
          ${seleccionada ? "checked" : ""}
          onclick="event.stopPropagation(); toggleOpcionSeleccionBuild(${indice}, '${textoSeguro(opcion.id)}')"
          aria-label="Seleccionar ${textoSeguro(opcion.nombre)}"
        />
        <div>
          <div class="build-popup-rasgo-titulo">${textoSeguro(opcion.nombre)}</div>
          <div class="build-popup-rasgo-resumen">${textoSeguro(resumen)}</div>
        </div>
      </div>
    `;
  }).join("");
}

function abrirPopupOpcionSeleccionBuild(indice, opcionId) {
  const item = listaSeleccionesBuildActuales[indice];
  if (!item) return;

  const { seleccion, contexto } = item;
  const opcion = resolverOpcionesSeleccion(seleccion, contexto).find(item => item.id === opcionId);
  if (!opcion) return;

  const elegidas = obtenerOpcionesElegidas(item.rasgo, seleccion, contexto);
  const seleccionada = elegidas.includes(opcion.id);
  const restantes = Math.max(0, (seleccion.cantidadSeleccionable || 0) - elegidas.length);
  const bloqueada = !seleccionada && restantes === 0;
  const requisitosHTML = opcion.requisitos
    ? `<p style="margin: 0 0 5px 0;"><strong>Requisitos:</strong> ${textoSeguro(JSON.stringify(opcion.requisitos))}</p>`
    : "";

  document.getElementById("popup-rasgo-contenido").innerHTML = `
    <div style="text-align:left; display:flex; flex-direction:column; height:100%;">
      <button class="build-popup-volver" type="button" onclick="renderPopupSeleccionBuild(${indice})">← Volver a ${textoSeguro(seleccion.nombre)}</button>
      <h3 style="color:#5a4035; margin:0 0 10px; border-bottom:2px solid #5a4035; padding-bottom:8px; font-family:Georgia, serif; font-size:22px;">
        ${textoSeguro(opcion.nombre)}
      </h3>
      <div style="background-color:#f3ead7; padding:10px; border-radius:6px; margin-bottom:15px; font-size:13px; border:1px solid #dccbb0; color:#5a4035;">
        <p style="margin:0 0 5px;"><strong>Selección:</strong> ${textoSeguro(seleccion.nombre)}</p>
        ${requisitosHTML}
        <label class="comp-fila ${seleccionada ? "competente" : ""} ${bloqueada ? "bloqueada" : ""}" style="cursor:pointer; margin-top:8px;">
          <input
            class="build-popup-checkbox"
            type="checkbox"
            ${seleccionada ? "checked" : ""}
            onclick="toggleOpcionSeleccionBuild(${indice}, '${textoSeguro(opcion.id)}'); abrirPopupOpcionSeleccionBuild(${indice}, '${textoSeguro(opcion.id)}')"
          />
          <span class="comp-nombre">${seleccionada ? "Seleccionado" : "Seleccionar"}</span>
        </label>
      </div>
      <div style="line-height:1.6; color:#2b2521; font-size:14.5px; overflow-y:auto; max-height:50vh; padding-right:5px;">
        ${opcion.descripcion || opcion.descripcionResum || "Sin descripción."}
      </div>
    </div>
  `;
}
function toggleOpcionSeleccionBuild(indice, opcionId) {
  const item = listaSeleccionesBuildActuales[indice];
  if (!item) return;

  const { rasgo, seleccion, contexto } = item;
  const clave = crearClaveSeleccionRasgo(rasgo, seleccion, contexto);
  if (!personajeActual.eleccionesRasgos) personajeActual.eleccionesRasgos = {};

  const actuales = obtenerOpcionesElegidas(rasgo, seleccion, contexto);
  const yaExiste = actuales.includes(opcionId);
  let nuevas = yaExiste
    ? actuales.filter(id => id !== opcionId)
    : actuales;

  if (!yaExiste && actuales.length < (seleccion.cantidadSeleccionable || 0)) {
    nuevas = [...actuales, opcionId];
  }

  const cambioReal = nuevas.length !== actuales.length
    || nuevas.some((id, posicion) => id !== actuales[posicion]);
  if (!cambioReal) return;

  personajeActual.eleccionesRasgos[clave] = nuevas;
  marcarPersonajeModificado();
  renderBuildPersonaje();
  renderPopupSeleccionBuild(indice);
}

function renderHechizos() {
  // Placeholder — podés expandir esto con tu lista de hechizos
  panelVentanas.innerHTML = `
    <h2 class="titulo-panel">Hechizos</h2>
    <p style="color:#6b5a53; text-align:center; margin-top:20px;">
      ✨ Esta sección mostrará los hechizos conocidos del personaje.<br>
      <small>Próximamente: filtros por nivel y escuela.</small>
    </p>
  `;
}

function renderEquipo() {
  // Buscamos los objetos del inventario del personaje en el libro de reglas
  const inventario = personajeActual.equipo ?? [];
  const escudoId   = personajeActual.escudo;

  const objetos = inventario
    .map(id => libroDeReglasBasicas.equipo.find(e => e.id === id))
    .filter(Boolean);

  const escudo = escudoId
    ? libroDeReglasBasicas.equipo.find(e => e.id === escudoId)
    : null;

  const todosLosObjetos = [...objetos, ...(escudo ? [escudo] : [])];

  panelVentanas.innerHTML = `
    <h2 class="titulo-panel">Equipo</h2>
    ${todosLosObjetos.length === 0
      ? `<p style="color:#6b5a53; text-align:center; margin-top:20px;">No hay objetos en el inventario.</p>`
      : `<div class="equipo-lista">
          ${todosLosObjetos.map(obj => `
            <div class="equipo-item">
              <strong>${obj.nombre}</strong>
              <span class="equipo-tipo">${obj.tipo ?? ""}</span>
              ${obj.bonifCA  ? `<small>+${obj.bonifCA} CA</small>` : ""}
              ${obj.caBase   ? `<small>CA base: ${obj.caBase}</small>` : ""}
            </div>
          `).join("")}
        </div>`
    }
  `;
}

// ── Mapa de pestañas → funciones ───────────────

const tabMap = {
  competenciasBtn : renderCompetencias,
  rasgosBtn       : renderRasgos,
  hechizosBtn     : renderHechizos,
  equipoBtn       : renderEquipo,
};
let tabActivaId = "competenciasBtn";

// ── Conectar botones ───────────────────────────

Object.entries(tabMap).forEach(([btnId, renderFn]) => {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Quitar estilo activo de todos los botones
    document.querySelectorAll(".fila-ventanas button")
      .forEach(b => b.classList.remove("tab-activa"));

    // Marcar el botón clickeado
    btn.classList.add("tab-activa");
    tabActivaId = btnId;

    // Renderizar el contenido correspondiente
    renderFn();
  });
});

// ── Mostrar la primera pestaña por defecto ─────
document.getElementById("competenciasBtn")?.click();
// ══════════════════════════════════════════════
//  VISTA BUILD Y SELECTOR DE NIVEL
// ══════════════════════════════════════════════

const vistaSelectorPersonaje = document.getElementById("vistaSelectorPersonaje");
const cabeceraFicha = document.getElementById("cabeceraFicha");
const vistaPersonaje = document.getElementById("vistaPersonaje");
const vistaBuild = document.getElementById("vistaBuild");
const btnVistaBuild = document.getElementById("btnVistaBuild");
const btnVistaPersonaje = document.getElementById("btnVistaPersonaje");
buscadorPersonajes = document.getElementById("buscadorPersonajes");
listadoPersonajes = document.getElementById("listadoPersonajes");
btnNuevoPersonaje = document.getElementById("btnNuevoPersonaje");
const btnCambiarPersonaje = document.getElementById("btnCambiarPersonaje");
const selectorNivelPersonaje = document.getElementById("selectorNivelPersonaje");
const buildAvisos = document.getElementById("buildAvisos");
const buildNiveles = document.getElementById("buildNiveles");

function textoSeguro(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function obtenerPersonajeActivoId() {
  try {
    return localStorage.getItem(CLAVE_PERSONAJE_ACTIVO) || personajeActual.id || "";
  } catch (error) {
    console.warn("No se pudo leer el personaje activo desde localStorage", error);
    return personajeActual.id || "";
  }
}

function guardarPersonajeActivoId(id) {
  try {
    localStorage.setItem(CLAVE_PERSONAJE_ACTIVO, id);
  } catch (error) {
    console.warn("No se pudo guardar el personaje activo en localStorage", error);
  }
}

function obtenerNombreClase(claseId) {
  return libroDeReglasBasicas.clases.find(clase => clase.id === claseId)?.nombre || claseId || "Clase";
}

function normalizarTextoBusqueda(valor) {
  return String(valor || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function obtenerNombreRaza(razaId) {
  return libroDeReglasBasicas.razas.find(raza => raza.id === razaId)?.nombre || razaId || "Raza";
}

  
function obtenerSubclasePorId(claseId, subclaseId) {
  return obtenerClasePorId(claseId)?.subclases?.find(subclase => subclase.id === subclaseId) || null;
}

function describirClasePersonaje(personaje, numeroSlot) {
  const claseId = personaje[`clase${numeroSlot}`] || "";
  const nivel = Number(personaje[`nivelClase${numeroSlot}`]) || 0;
  if (!claseId || nivel <= 0) return null;

  const clase = obtenerClasePorId(claseId);
  const subclase = obtenerSubclasePorId(claseId, personaje[`subclase${numeroSlot}`]);
  const textoSubclase = subclase ? ` (${subclase.nombre})` : "";

  return `${clase?.nombre || claseId} ${nivel}${textoSubclase}`;
}

function crearSubtituloTarjetaPersonaje(personaje) {
  const claseId = personaje.clase1 || personajePorDefecto.clase1;
  const subclaseId = personaje.subclase1 || personajePorDefecto.subclase1;
  const clase = obtenerClasePorId(claseId);
  const subclase = obtenerSubclasePorId(claseId, subclaseId);
  const claseTexto = clase?.nombre || obtenerNombreClase(claseId);
  const subclaseTexto = subclase?.nombre || "Sin subclase";
  const raza = obtenerNombreRaza(personaje.raza || personajePorDefecto.raza);
  const nivel = Number(personaje.nivel) || personajePorDefecto.nivel;

  return `${claseTexto} / ${subclaseTexto} / ${raza} / Nivel ${nivel}`;
}

function obtenerPersonajesSelector() {
  const personajes = listarPersonajesGuardados()
    .map(personaje => cargarPersonajePorId(personaje.id) || normalizarPersonajeGuardado(personaje))
    .filter(Boolean);

  if (personajeActual.id && !personajes.some(personaje => personaje.id === personajeActual.id)) {
    personajes.unshift(normalizarPersonajeGuardado(personajeActual));
  }

  return personajes;
}

function renderSelectorPersonajes() {
  if (!listadoPersonajes) return;

  const activoId = obtenerPersonajeActivoId();
  const busqueda = normalizarTextoBusqueda(buscadorPersonajes?.value);
  const personajes = obtenerPersonajesSelector()
    .filter(personaje => normalizarTextoBusqueda(personaje.nombre || personajePorDefecto.nombre).includes(busqueda));

  if (personajes.length === 0) {
    listadoPersonajes.innerHTML = `<div class="selector-personaje-vacio">No hay personajes que coincidan con la búsqueda.</div>`;
    return;
  }

  listadoPersonajes.innerHTML = personajes
    .map(personaje=>`
      <button type="button" class="tarjeta-personaje ${personaje.id === activoId ? "activa" : ""}" data-personaje-id="${textoSeguro(personaje.id)}">
        <h3>${textoSeguro(personaje.nombre || personajePorDefecto.nombre)}</h3>
        <p>${textoSeguro(crearSubtituloTarjetaPersonaje(personaje))}</p>
      </button>
      `)
      .join("");
  listadoPersonajes.querySelectorAll(".tarjeta-personaje").forEach(tarjeta => {
    tarjeta.addEventListener("click", () => activarPersonajeGuardado(tarjeta.dataset.personajeId));
  });
}

function mostrarSelectorPersonajes() {
  vistaSelectorPersonaje?.classList.remove("oculto");
  cabeceraFicha?.classList.add("oculto");
  vistaPersonaje?.classList.add("oculto");
  vistaBuild?.classList.add("oculto");
  renderSelectorPersonajes();
}

function mostrarFichaActiva() {
  vistaSelectorPersonaje?.classList.add("oculto");
  cabeceraFicha?.classList.remove("oculto");
  cambiarVistaPersonaje("personaje");
}

function marcarAbrirFichaTrasRecarga() {
  try {
    sessionStorage.setItem(CLAVE_ABRIR_FICHA_TRAS_RECARGA, "1");
  } catch (error) {
    console.warn("No se pudo recordar que debe abrirse la ficha tras recargar", error);
  }
}

function debeAbrirFichaTrasRecarga() {
  try {
    const debeAbrir = sessionStorage.getItem(CLAVE_ABRIR_FICHA_TRAS_RECARGA) === "1";
    sessionStorage.removeItem(CLAVE_ABRIR_FICHA_TRAS_RECARGA);
    return debeAbrir;
  } catch (error) {
    console.warn("No se pudo leer el estado de apertura de ficha", error);
    return false;
  }
}

function refrescarFichaCompleta() {
  marcarAbrirFichaTrasRecarga();
  window.location.reload();
}

function activarPersonajeGuardado(id) {
  if (!id) return;

  const personajeCargado = cargarPersonajePorId(id);
  if (!personajeCargado) {
    renderSelectorPersonajes();
    return;
  }

  guardarPersonajeActivoId(id);

  if (id === personajeActual.id) {
    mostrarFichaActiva();
    return;
  }

  Object.keys(personajeActual).forEach(clave => delete personajeActual[clave]);
  Object.assign(personajeActual, personajeCargado);
  refrescarFichaCompleta();
}

function crearYActivarNuevoPersonaje() {
  const ahora = new Date().toISOString();
  const nuevoPersonaje = normalizarPersonajeGuardado({
    ...clonarDatosPersonaje(personajePorDefecto),
    id: crearIdPersonaje(),
    createdAt: ahora,
    updatedAt: ahora
  });

  localStorage.setItem(`${PREFIJO_CLAVE_PERSONAJE}${nuevoPersonaje.id}`, JSON.stringify(nuevoPersonaje));
  actualizarIndicePersonajes(nuevoPersonaje);
  guardarPersonajeActivoId(nuevoPersonaje.id);
  Object.keys(personajeActual).forEach(clave => delete personajeActual[clave]);
  Object.assign(personajeActual, nuevoPersonaje);
  refrescarFichaCompleta();
}

function crearOpcionesNivel() {
  if (!selectorNivelPersonaje) return;

  selectorNivelPersonaje.innerHTML = Array.from({ length: 20 }, (_, indice) => {
    const nivel = indice + 1;
    return `<option value="${nivel}">Nivel ${nivel}</option>`;
  }).join("");

  selectorNivelPersonaje.value = String(personajeActual.nivel || 1);
}

function obtenerRasgosClasePorNivel(nivel) {
  if (!claseElegida?.rasgos) return [];
  return claseElegida.rasgos.filter(rasgo => (rasgo.nivelClase || 1) === nivel);
}

function obtenerSeleccionesDeRasgo(rasgo) {
  return Array.isArray(rasgo.selecciones) ? rasgo.selecciones : [];
}

function rasgoRequiereEleccion(rasgo) {
  return obtenerSeleccionesDeRasgo(rasgo).some(seleccion => (seleccion.cantidadSeleccionable || 0) > 0);
}

function crearClaveSeleccionRasgo(rasgo, seleccion, contexto = "general") {
  const rasgoId = rasgo.id || rasgo.nombre || "rasgo";
  const seleccionId = seleccion.id || seleccion.nombre || "seleccion";
  return `${contexto}:${rasgoId}:${seleccionId}`;
}

function obtenerOpcionesElegidas(rasgo, seleccion, contexto) {
  const clave = crearClaveSeleccionRasgo(rasgo, seleccion, contexto);
  const elecciones = personajeActual.eleccionesRasgos?.[clave];
  return Array.isArray(elecciones) ? elecciones : [];
}

function obtenerValorPorRuta(objeto, ruta) {
  if (!ruta) return null;
  return ruta.split(".").reduce((actual, parte) => actual?.[parte], objeto);
}

function obtenerClaseIdDesdeContexto(contexto) {
  const match = String(contexto || "").match(/^clase(\d+)$/);
  if (!match) return null;

  const numeroSlot = Number(match[1]);
  return clasesActivas.find(slot => slot.numeroSlot === numeroSlot)?.claseId || null;
}

function opcionPasaFiltrosSeleccion(opcion, seleccion, contexto = "general") {
  const fuente = seleccion.fuenteOpciones || {};
  const claseId = obtenerClaseIdDesdeContexto(contexto);

  if (Array.isArray(fuente.incluirIds) && !fuente.incluirIds.includes(opcion.id)) return false;
  if (Array.isArray(fuente.excluirIds) && fuente.excluirIds.includes(opcion.id)) return false;
  if (Array.isArray(opcion.clasesPermitidas) && claseId && !opcion.clasesPermitidas.includes(claseId)) return false;
  if (Array.isArray(opcion.clasesExcluidas) && claseId && opcion.clasesExcluidas.includes(claseId)) return false;

  return true;
}

function resolverOpcionesSeleccion(seleccion, contexto = "general") {
  const opcionesDirectas = Array.isArray(seleccion.opciones) ? seleccion.opciones : [];
  const opcionesDesdeFuente = seleccion.fuenteOpciones?.coleccion
    ? obtenerValorPorRuta(libroDeReglasBasicas, seleccion.fuenteOpciones.coleccion)
    : [];
  const opciones = opcionesDirectas.length ? opcionesDirectas : (Array.isArray(opcionesDesdeFuente) ? opcionesDesdeFuente : []);

  return opciones.filter(opcion => opcionPasaFiltrosSeleccion(opcion, seleccion, contexto));
}

function obtenerOpcionesSeleccionadasDeRasgo(rasgo, contexto = "general", origen = "") {
  return obtenerSeleccionesDeRasgo(rasgo).flatMap(seleccion => {
    const idsElegidas = obtenerOpcionesElegidas(rasgo, seleccion, contexto);
    const opcionesDisponibles = resolverOpcionesSeleccion(seleccion, contexto);

    return idsElegidas
      .map(id => opcionesDisponibles.find(opcion => opcion.id === id))
      .filter(Boolean)
      .map(opcion => ({
        ...opcion,
        origen: origen || rasgo.nombre,
        rasgoOrigen: rasgo.nombre,
        seleccionOrigen: seleccion.nombre
      }));
  });
}

function obtenerOpcionesSeleccionadasDisponibles() {
  const opcionesRaza = (razaElegida?.rasgos || [])
    .flatMap(rasgo => obtenerOpcionesSeleccionadasDeRasgo(rasgo, "raza", razaElegida.nombre));
  const opcionesSubraza = (subrazaElegida?.rasgos || [])
    .flatMap(rasgo => obtenerOpcionesSeleccionadasDeRasgo(rasgo, "subraza", subrazaElegida.nombre));
  const opcionesClase = clasesActivas.flatMap(slot => {
    if (!slot.clase || slot.nivel <= 0) return [];

    return (slot.clase.rasgos || [])
      .filter(rasgo => rasgoDisponiblePorNivelClase(rasgo, slot.nivel))
      .flatMap(rasgo => obtenerOpcionesSeleccionadasDeRasgo(rasgo, `clase${slot.numeroSlot}`, slot.clase.nombre));
  });

  return [...opcionesRaza, ...opcionesSubraza, ...opcionesClase];
}
function contarPendientesDeRasgo(rasgo, contexto = "general") {
  return obtenerSeleccionesDeRasgo(rasgo).reduce((total, seleccion) => {
    const cantidadNecesaria = seleccion.cantidadSeleccionable || 0;
    const elegidas = obtenerOpcionesElegidas(rasgo, seleccion, contexto).length;
    return total + Math.max(0, cantidadNecesaria - elegidas);
  }, 0);
}

function textoTipoSeleccion(seleccion) {
  if (seleccion.cantidadSeleccionable === 1) return seleccion.tipo || "opción";
  if (seleccion.tipoPlural) return seleccion.tipoPlural;

  const plurales = {
    habilidad: "habilidades",
    opcion: "opciones",
    opción: "opciones",
    rasgo: "rasgos"
  };

  return plurales[seleccion.tipo] || `${seleccion.tipo || "opción"}s`;
}

function renderResumenSeleccionesRasgo(rasgo, contexto = "general") {
  const selecciones = obtenerSeleccionesDeRasgo(rasgo);
  if (!selecciones.length) return "";

  return selecciones.map(seleccion => {
    const elegidas = obtenerOpcionesElegidas(rasgo, seleccion, contexto);
    const pendientes = Math.max(0, (seleccion.cantidadSeleccionable || 0) - elegidas.length);
    const opciones = resolverOpcionesSeleccion(seleccion, contexto).map(opcion => opcion.nombre).join(", ");

    return `
      <div class="build-seleccion">
        <strong>${textoSeguro(seleccion.nombre)}:</strong>
        elige ${seleccion.cantidadSeleccionable} ${textoSeguro(textoTipoSeleccion(seleccion))}.
        ${pendientes > 0 ? `<span class="build-pendiente">Faltan ${pendientes}</span>` : `<span class="build-completo">Completo</span>`}
        <small>${textoSeguro(opciones)}</small>
      </div>
    `;
  }).join("");
}

function contarRasgosPendientes(hastaNivel = personajeActual.nivel) {
  const pendientesClases = clasesActivas.reduce((total, slot) => {
    if (!slot.clase || slot.nivel <= 0) return total;

    return total + (slot.clase.rasgos || [])
      .filter(rasgo => (rasgo.nivelClase || 1) <= slot.nivel)
      .reduce((subtotal, rasgo) => subtotal + contarPendientesDeRasgo(rasgo, `clase${slot.numeroSlot}`), 0);
  }, 0);

  const pendientesSubraza = (subrazaElegida?.rasgos || [])
    .reduce((total, rasgo) => total + contarPendientesDeRasgo(rasgo, "subraza"), 0);

  return pendientesClases + pendientesSubraza;

}

function resumenRasgo(rasgo) {
  return rasgo.descripcionResum || (rasgo.descripcion ? rasgo.descripcion.replace(/<[^>]*>/g, "").slice(0, 90) + "..." : "Sin descripción todavía.");
}

function renderOpcionesSeleccion(coleccion, seleccionado) {
  return coleccion.map(item => (
    `<option value="${textoSeguro(item.id)}" ${item.id === seleccionado ? "selected" : ""}>${textoSeguro(item.nombre)}</option>`
  )).join("");
}
function registrarRasgoBuild(rasgo, origen, contexto) {
  const indice = listaRasgosBuildActuales.length;
  listaRasgosBuildActuales.push({ ...rasgo, origen, contexto });
  return indice;
}

function registrarSeleccionBuild(rasgo, seleccion, contexto, origen) {
  const indice = listaSeleccionesBuildActuales.length;
  listaSeleccionesBuildActuales.push({ rasgo, seleccion, contexto, origen });
  return indice;
}

function obtenerNombresOpcionesSeleccionadas(rasgo, seleccion, contexto) {
  const idsElegidas = obtenerOpcionesElegidas(rasgo, seleccion, contexto);
  return idsElegidas
    .map(id => resolverOpcionesSeleccion(seleccion, contexto).find(opcion => opcion.id === id)?.nombre)
    .filter(Boolean);
}

function renderExtensionSeleccionBuild(rasgo, seleccion, contexto, origen) {
  const indice = registrarSeleccionBuild(rasgo, seleccion, contexto, origen);
  const elegidas = obtenerNombresOpcionesSeleccionadas(rasgo, seleccion, contexto);
  const pendientes = Math.max(0, (seleccion.cantidadSeleccionable || 0) - elegidas.length);
  const estadoHTML = pendientes > 0
    ? `<span class="build-pendiente">Faltan ${pendientes}</span>`
    : `<span class="build-completo">Completo</span>`;
  const etiquetasHTML = elegidas.length
    ? `<div class="build-seleccion-tags">${elegidas.map(nombre => `<span class="build-seleccion-tag">${textoSeguro(nombre)}</span>`).join("")}</div>`
    : `<small>${textoSeguro(resolverOpcionesSeleccion(seleccion, contexto).map(opcion => opcion.nombre).join(", "))}</small>`;
  const botonHTML = elegidas.length
    ? `<button type="button" class="build-reseleccionar">Reseleccionar opciones</button>`
    : "";

  return `
    <div class="build-seleccion-extension" onclick="abrirPopupSeleccionBuild(${indice})">
      <strong>${textoSeguro(seleccion.nombre)}</strong> ${estadoHTML}
      <small>${textoSeguro(seleccion.descripcion || `Elige ${seleccion.cantidadSeleccionable} ${textoTipoSeleccion(seleccion)}.`)}</small>
      ${etiquetasHTML}
      ${botonHTML}
    </div>
  `;
}

function renderRasgoBuild(rasgo, origen, contexto) {
  const indice = registrarRasgoBuild(rasgo, origen, contexto);
  const resumen = resumenRasgo(rasgo).replace(/<br>|###|\*\*/g, "");
  const seleccionesHTML = obtenerSeleccionesDeRasgo(rasgo)
    .map(seleccion => renderExtensionSeleccionBuild(rasgo, seleccion, contexto, origen))
    .join("");

  return `
    <div class="build-rasgo-grupo">
      <div class="build-rasgo-card" onclick="abrirPopupRasgoBuild(${indice})">
        <div class="build-rasgo-card-titulo">${textoSeguro(rasgo.nombre)} <span style="font-size:11px; font-weight:normal; color:#8b7355;">(Nvl ${rasgo.nivelClase || 1})</span></div>
        <div class="build-rasgo-card-resumen">${textoSeguro(resumen)}</div>
      </div>
      ${seleccionesHTML}
    </div>
  `;
}

function renderSeccionRasgosBuild(titulo, rasgos, contexto) {
  if (!rasgos.length) return "";

  return `
    <section class="build-seccion-rasgos">
      <h4 class="build-seccion-titulo">${textoSeguro(titulo)}</h4>
      ${rasgos.map(rasgo => renderRasgoBuild(rasgo, titulo, contexto)).join("")}
    </section>
  `;
}

function renderRepartoEstadisticasBuild() {
  const filas = ESTADISTICAS_PRINCIPALES.map(({ id, nombre }) => {
    const base = Number(personajeActual[id]) || 0;
    const bonoRaza = obtenerBonoRacialStat(id);
    const total = base + bonoRaza;
    const puedeBajar = base > ESTADISTICA_MINIMA_REPARTO;
    const puedeSubir = base < ESTADISTICA_MAXIMA_REPARTO;

    return `
      <div class="build-stat-fila" data-stat="${id}">
        <span class="build-stat-nombre">${textoSeguro(nombre)} (${id})</span>
        <div class="build-stat-control" aria-label="Reparto de ${textoSeguro(nombre)}">
          <button type="button" class="build-stat-ajuste" data-stat="${id}" data-cambio="-1" ${puedeBajar ? "" : "disabled"}>−</button>
          <span class="build-stat-valor" id="buildStatBase-${id}">${base}</span>
          <button type="button" class="build-stat-ajuste" data-stat="${id}" data-cambio="1" ${puedeSubir ? "" : "disabled"}>+</button>
        </div>
        <span class="build-stat-numero ${obtenerClaseSignoValor(bonoRaza)}" id="buildStatRaza-${id}">${formatoValor(bonoRaza)}</span>
        <span class="build-stat-numero ${total}" id="buildStatTotal-${id}">${total}</span>
        <span class="build-stat-numero ${obtenerClaseSignoValor(calcularModificador(total))}" id="buildStatMod-${id}">${calcularModificador(total)}</span>
      </div>
    `;
  }).join("");

  return `
    <div class="build-stats-reparto" aria-label="Ajuste de reparto de estadísticas">
      <div class="build-stats-header">
        <span>Característica</span>
        <span>Reparto</span>
        <span>Raza</span>
        <span>Total</span>
        <span>Mod.</span>
      </div>
      ${filas}
    </div>
  `;
}

function renderNivelUnoBuild() {
  const subrazas = razaElegida?.subrazas || [];
  const rasgosRaza = razaElegida?.rasgos || [];
  const rasgosSubraza = subrazaElegida?.rasgos || [];
  const rasgosClase = obtenerRasgosClasePorNivel(1, clasesActivas[0]);
  const nombreClase = clasesActivas[0]?.clase?.nombre || "Clase";

  return `
    <section class="build-nivel ${personajeActual.nivel === 1 ? "actual" : ""}">
      <h3>Nivel 1 · Identidad inicial</h3>
      <div class="build-campos">
        <div class="build-campo">
          <label for="buildNombre">Nombre</label>
          <input id="buildNombre" type="text" value="${textoSeguro(personajeActual.nombre)}" placeholder="Nombre del personaje">
        </div>
        <div class="build-campo">
          <label for="buildRaza">Raza</label>
          <select id="buildRaza">${renderOpcionesSeleccion(libroDeReglasBasicas.razas, personajeActual.raza)}</select>
        </div>
        <div class="build-campo">
          <label for="buildSubraza">Subraza</label>
          <select id="buildSubraza" ${subrazas.length ? "" : "disabled"}>
            ${subrazas.length
              ? `<option value="">Sin subraza</option>${renderOpcionesSeleccion(subrazas, personajeActual.subraza)}`
              : `<option value="">Esta raza no tiene subraza</option>`}
          </select>
        </div>
        <div class="build-campo">
          <label for="buildClase">Clase</label>
          <select id="buildClase">${renderOpcionesSeleccion(libroDeReglasBasicas.clases, personajeActual.clase1)}</select>
        </div>
      </div>
      ${renderRepartoEstadisticasBuild()}
      <div class="build-rasgos-columna">
        ${renderSeccionRasgosBuild(`Raza: ${razaElegida?.nombre || "—"}`, rasgosRaza, "raza")}
        ${renderSeccionRasgosBuild(`Subraza: ${subrazaElegida?.nombre || "—"}`, rasgosSubraza, "subraza")}
        ${renderSeccionRasgosBuild(`Clase: ${nombreClase}`, rasgosClase, "clase1")}
      </div>
    </section>
  `;
}

function renderNivelClaseBuild(nivel) {
  const claseId = obtenerClaseNivelPersonaje(nivel);
  const clase = obtenerClasePorId(claseId);
  const dadoGolpe = clase?.dadoDeGolpe || 0;
  const valorPG = claseId ? obtenerValorPGNivel(nivel, claseId) : "";
  const nivelClase = claseId ? contarNivelClaseHastaNivelPersonaje(claseId, nivel) : 0;
  const rasgos = claseId ? obtenerRasgosClaseEnNivelPersonaje(nivel, claseId) : [];
  const contextoClase = obtenerContextoClasePorId(claseId);
  const opcionesClase = `<option value="">Sin clase en este nivel</option>${renderOpcionesSeleccion(libroDeReglasBasicas.clases, claseId)}`;

  return `
    <section class="build-nivel ${personajeActual.nivel === nivel ? "actual" : ""}">
      <h3>Nivel ${nivel}</h3>
      <div class="build-nivel-controles">
        <div class="build-campo">
          <label for="buildClaseNivel-${nivel}">Clase de este nivel</label>
          <select id="buildClaseNivel-${nivel}" class="build-clase-nivel" data-nivel="${nivel}">${opcionesClase}</select>
        </div>
        <div class="build-campo">
          <label for="buildPGNivel-${nivel}">PG del dado</label>
          <input
            id="buildPGNivel-${nivel}"
            class="build-pg-nivel"
            data-nivel="${nivel}"
            type="number"
            min="1"
            max="${dadoGolpe || 1}"
            value="${valorPG}"
            ${claseId ? "" : "disabled"}
            placeholder="${dadoGolpe ? `1-${dadoGolpe}` : "Elige clase"}">
          <small class="build-pg-ayuda">${clase ? `Máximo d${dadoGolpe}. Se suma CON al total.` : "Elige una clase para activar este nivel."}</small>
        </div>
      </div>
      <div class="build-rasgos-columna">
        ${clase
          ? (rasgos.length
            ? renderSeccionRasgosBuild(`${clase.nombre}: nivel de clase ${nivelClase}`, rasgos, contextoClase)
            : `<span class="build-rasgo">${textoSeguro(clase.nombre)} no desbloquea rasgos nuevos en su nivel de clase ${nivelClase}.</span>`)
          : `<span class="build-rasgo">Selecciona una clase para este nivel.</span>`}
      </div>
    </section>
  `;
}

function renderBuildPersonaje() {
  if (!buildAvisos || !buildNiveles) return;

  listaRasgosBuildActuales = [];
  listaSeleccionesBuildActuales = [];

  const pendientes = contarRasgosPendientes(personajeActual.nivel || 1);
  buildAvisos.innerHTML = pendientes > 0
? `<div class="build-alerta">⚠ Hay ${pendientes} ${pendientes === 1 ? "opción" : "opciones"} de rasgo sin elegir en este nivel o anteriores.</div>`
    : "";

  let html = renderNivelUnoBuild();
  for (let nivel = 2; nivel <= 20; nivel++) {
    html += renderNivelClaseBuild(nivel);
  }
  buildNiveles.innerHTML = html;
  conectarControlesBuild();
}

function actualizarResumenPersonaje() {
  sincronizarNivelPersonajeDesdeClases();
  clasesActivas = obtenerSlotsClases();

  const razaNombre = razaElegida?.nombre || personajeActual.raza || "Raza";
  const clasesTexto = clasesActivas
    .filter(slot => slot.clase && slot.nivel > 0)
    .map(slot => `${slot.clase.nombre} ${slot.nivel}`)
    .join(" / ") || "Clase 0";

  document.getElementById("nombre-personaje").innerText = personajeActual.nombre || "Sin nombre";
  document.getElementById("info-personaje").innerText = `${razaNombre}, ${clasesTexto} · Nivel ${personajeActual.nivel}`;
  document.getElementById("BC").innerText = `+${calcularBonificadorCompetencia()}`;
  if (selectorNivelPersonaje) selectorNivelPersonaje.value = String(personajeActual.nivel);
}

function refrescarFichaTrasBuild() {
  recalcularClasesDesdeProgresion();
  refrescarEstadisticasPersonaje();
  actualizarResumenPersonaje();
  actualizarPuntosGolpe();
  renderVida();
  if (typeof actualizarIniciativa === "function") actualizarIniciativa();
  if (typeof actualizarCA === "function") actualizarCA();
  if (typeof renderCompetencias === "function") renderCompetencias();
}

function conectarControlesNivelesBuild() {
  document.querySelectorAll(".build-clase-nivel").forEach(selector => {
    selector.addEventListener("change", event => {
      const nivel = Number(event.target.dataset.nivel);
      const claseId = event.target.value;
      asegurarDatosBuildPersonaje();
      const progresionAnterior = personajeActual.progresionNiveles[nivel]?.clase || "";
      const pgAnterior = personajeActual.pgPorNivel[nivel];

      if (claseId) {
        personajeActual.progresionNiveles[nivel] = { clase: claseId };
        const dado = obtenerDadoGolpeDeClase(claseId);
        const valorActual = Number(personajeActual.pgPorNivel[nivel]) || 1;
        personajeActual.pgPorNivel[nivel] = Math.max(1, Math.min(valorActual, dado || 1));
      } else {
        delete personajeActual.progresionNiveles[nivel];
        delete personajeActual.pgPorNivel[nivel];
      }

      refrescarFichaTrasBuild();
      if (
        progresionAnterior !== (personajeActual.progresionNiveles[nivel]?.clase || "")
        || pgAnterior !== personajeActual.pgPorNivel[nivel]
      ) {
        marcarPersonajeModificado();
      }
      renderBuildPersonaje();
    });
  });

  document.querySelectorAll(".build-pg-nivel").forEach(input => {
    input.addEventListener("input", event => {
      const nivel = Number(event.target.dataset.nivel);
      const claseId = obtenerClaseNivelPersonaje(nivel);
      const dado = obtenerDadoGolpeDeClase(claseId);

      asegurarDatosBuildPersonaje();
      const valorAnterior = personajeActual.pgPorNivel[nivel];

      if (event.target.value === "") {
        delete personajeActual.pgPorNivel[nivel];
        actualizarPuntosGolpe();
        renderVida();
        if (valorAnterior !== undefined) marcarPersonajeModificado();
        return;
      }

      const valor = Number(event.target.value) || 1;
      personajeActual.pgPorNivel[nivel] = Math.max(1, Math.min(valor, dado || 1));
      event.target.value = personajeActual.pgPorNivel[nivel];
      actualizarPuntosGolpe();
      renderVida();
      if (personajeActual.pgPorNivel[nivel] !== valorAnterior) marcarPersonajeModificado();
    });

    input.addEventListener("blur", event => {
      if (event.target.value !== "") return;

      const nivel = Number(event.target.dataset.nivel);
      const claseId = obtenerClaseNivelPersonaje(nivel);
      const dado = obtenerDadoGolpeDeClase(claseId);
      if (!dado) return;
      const valorAnterior = personajeActual.pgPorNivel[nivel];

      personajeActual.pgPorNivel[nivel] = 1;
      event.target.value = 1;
      actualizarPuntosGolpe();
      renderVida();
      if (valorAnterior !== 1) marcarPersonajeModificado();
    })
  });
}

function conectarControlesRepartoEstadisticasBuild() {
  document.querySelectorAll(".build-stat-ajuste").forEach(boton => {
    boton.addEventListener("click", event => {
      const statId = event.currentTarget.dataset.stat;
      const cambio = Number(event.currentTarget.dataset.cambio) || 0;
      if (!ESTADISTICAS_PRINCIPALES.some(({ id }) => id === statId) || cambio === 0) return;

      const valorAnterior = Number(personajeActual[statId]) || personajePorDefecto[statId];
      const valorNuevo = Math.max(
        ESTADISTICA_MINIMA_REPARTO,
        Math.min(ESTADISTICA_MAXIMA_REPARTO, valorAnterior + cambio)
      );
      if (valorNuevo === valorAnterior) return;

      personajeActual[statId] = valorNuevo;
      refrescarFichaTrasBuild();
      marcarPersonajeModificado();
      renderBuildPersonaje();
    });
  });
}

function conectarControlesBuild() {
  document.getElementById("buildNombre")?.addEventListener("input", event => {
    if (personajeActual.nombre !== event.target.value) {
      personajeActual.nombre = event.target.value;
      marcarPersonajeModificado();
    }
    actualizarResumenPersonaje();
  });

  document.getElementById("buildRaza")?.addEventListener("change", event => {
    if (personajeActual.raza === event.target.value) return
    personajeActual.raza = event.target.value;
    razaElegida = libroDeReglasBasicas.razas.find(r => r.id === personajeActual.raza);
    personajeActual.subraza = "";
    subrazaElegida = null;
    marcarPersonajeModificado();
    refrescarFichaTrasBuild();
    renderBuildPersonaje();
  });

  document.getElementById("buildSubraza")?.addEventListener("change", event => {
    if (personajeActual.subraza === event.target.value) return;
    personajeActual.subraza = event.target.value;
    subrazaElegida = razaElegida?.subrazas?.find(s => s.id === personajeActual.subraza) || null;
    marcarPersonajeModificado();
    renderBuildPersonaje();
  });

  document.getElementById("buildClase")?.addEventListener("change", event => {
    if (personajeActual.clase1 === event.target.value) return;
    personajeActual.clase1 = event.target.value;
    claseElegida = libroDeReglasBasicas.clases.find(c => c.id === personajeActual.clase1);
    marcarPersonajeModificado();
    refrescarFichaTrasBuild();
    renderBuildPersonaje();
  });

  conectarControlesRepartoEstadisticasBuild();
  conectarControlesNivelesBuild();
}

function cambiarVistaPersonaje(vista) {
  const mostrarBuild = vista === "build";
  vistaBuild?.classList.toggle("oculto", !mostrarBuild);
  vistaPersonaje?.classList.toggle("oculto", mostrarBuild);
  btnVistaBuild?.classList.toggle("vista-activa", mostrarBuild);
  btnVistaPersonaje?.classList.toggle("vista-activa", !mostrarBuild);

  if (mostrarBuild) {
    renderBuildPersonaje();
  } else {
    tabMap[tabActivaId]?.();
  }
}

buscadorPersonajes?.addEventListener("input", renderSelectorPersonajes);

btnNuevoPersonaje?.addEventListener("click", crearYActivarNuevoPersonaje);

btnCambiarPersonaje?.addEventListener("click", mostrarSelectorPersonajes);

selectorNivelPersonaje?.addEventListener("change", event => {
  ajustarProgresionANivelTotal(Number(event.target.value));
  refrescarFichaTrasBuild();
  marcarPersonajeModificado();

  renderBuildPersonaje();
});

btnVistaBuild?.addEventListener("click", () => cambiarVistaPersonaje("build"));
btnVistaPersonaje?.addEventListener("click", () => cambiarVistaPersonaje("personaje"));

crearOpcionesNivel();
actualizarResumenPersonaje();
renderSelectorPersonajes();
renderBuildPersonaje();
if (debeAbrirFichaTrasRecarga()) {
  mostrarFichaActiva();
} else {
  mostrarSelectorPersonajes();
}