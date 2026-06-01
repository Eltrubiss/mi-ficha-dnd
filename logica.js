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
  equipo: [],
  monedas: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  inventario: [],
  sintonizacion: { slotsMax: 3, itemIds: [] },
  hpActual: 0,
  hpTemporales: 0,
  inspiracion: false,
  concentracion: false,
  estadosActivos: [],
  monedas: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  equipo: [],
  inventarioEquipo: [],
  sintonizacionSlots: 3,
  sintonizados: [],
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

const HABILIDADES_PERSONAJE = [
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

let detalleHabilidades = {};

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
    monedas: normalizarMonedasPersonaje(datos.monedas),
    equipo: normalizarListaIds(datos.equipo),
    inventarioEquipo: normalizarInventarioEquipo(datos.inventarioEquipo),
    sintonizacionSlots: Math.max(0, Number(datos.sintonizacionSlots ?? personajePorDefecto.sintonizacionSlots) || 0),
    sintonizados: normalizarListaIds(datos.sintonizados),
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


function normalizarListaIds(valores) {
  if (!Array.isArray(valores)) return [];
  return [...new Set(valores.map(valor => String(valor || "").trim()).filter(Boolean))];
}

function normalizarMonedasPersonaje(monedas) {
  const base = { ...personajePorDefecto.monedas };
  Object.entries(monedas || {}).forEach(([clave, valor]) => {
    if (!Object.prototype.hasOwnProperty.call(base, clave)) return;
    const cantidad = Math.floor(Number(valor));
    base[clave] = Number.isFinite(cantidad) ? Math.max(0, cantidad) : 0;
  });
  return base;
}
function normalizarBonificacionesEquipo(bonificaciones) {
  if (!Array.isArray(bonificaciones)) return [];
  return bonificaciones.map(bono => ({
    tipoDeEfecto: String(bono?.tipoDeEfecto || "bonoCA"),
    valor: Number(bono?.valor) || 0,
    statAfectada: String(bono?.statAfectada || ""),
    habilidadAfectada: String(bono?.habilidadAfectada || ""),
    categoria: String(bono?.categoria || "habilidad"),
    competencia: String(bono?.competencia || bono?.valorCompetencia || "competencia")
  })).filter(bono => bono.tipoDeEfecto);
}

function normalizarInventarioEquipo(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item, indice) => ({
    id: String(item?.id || `equipo-${Date.now()}-${indice}-${Math.random().toString(36).slice(2, 7)}`),
    nombre: String(item?.nombre || "Objeto sin nombre"),
    descripcion: String(item?.descripcion || ""),
    precio: String(item?.precio || ""),
    tipo: ["arma", "armadura", "equipo"].includes(item?.tipo) ? item.tipo : "equipo",
    subtipo: String(item?.subtipo || ""),
    equipado: item?.tipo === "arma" || item?.tipo === "armadura"
      ? item?.equipado !== false
      : Boolean(item?.equipado),
    efectos: Array.isArray(item?.efectos) ? item.efectos.join("\n") : String(item?.efectos || ""),
    etiquetas: Array.isArray(item?.etiquetas)
      ? item.etiquetas.map(etiqueta => String(etiqueta || "").trim()).filter(Boolean)
      : String(item?.etiquetas || "").split(",").map(etiqueta => etiqueta.trim()).filter(Boolean),
    caBase: item?.caBase === undefined || item?.caBase === "" ? "" : Number(item.caBase),
    destrezaCA: String(item?.destrezaCA || "usar"),
    bonificadorExtra: Number(item?.bonificadorExtra) || 0,
    tipoArma: String(item?.tipoArma || ""),
    ataqueMod: String(item?.ataqueMod || "FUE"),
    ataqueCompetencia: String(item?.ataqueCompetencia || "auto"),
    ataqueBonificador: Number(item?.ataqueBonificador) || 0,
    danoMod: String(item?.danoMod || "FUE"),
    danoDado: String(item?.danoDado || ""),
    danoTipo: String(item?.danoTipo || ""),
    danoCritico: String(item?.danoCritico || ""),
    danoModSecundario: String(item?.danoModSecundario || item?.danoMod || "FUE"),
    danoDadoSecundario: String(item?.danoDadoSecundario || ""),
    danoTipoSecundario: String(item?.danoTipoSecundario || ""),
    danoCriticoSecundario: String(item?.danoCriticoSecundario || ""),
    distancia: String(item?.distancia || ""),
    bonificaciones: normalizarBonificacionesEquipo(item?.bonificaciones)
    }));
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
    monedas: normalizarMonedasPersonaje(datosCompatibles.monedas),
    equipo: normalizarListaIds(datosCompatibles.equipo),
    inventarioEquipo: normalizarInventarioEquipo(datosCompatibles.inventarioEquipo),
    sintonizacionSlots: Math.max(0, Number(datosCompatibles.sintonizacionSlots ?? personajePorDefecto.sintonizacionSlots) || 0),
    sintonizados: normalizarListaIds(datosCompatibles.sintonizados),
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
    items.push({ origen: `${claseNivel1.nombre} nivel de clase 1`, valor: valorNivel1, descripcion: `${claseNivel1.dadoDeGolpe} PG de dado máximo + ${modCON} CON` });
  }

  for (let nivel = 2; nivel <= 20; nivel++) {
    const claseId = personajeActual.progresionNiveles[nivel]?.clase;
    if (!claseId) continue;
    const clase = obtenerClasePorId(claseId);
    if (!clase) continue;
    const tirada = obtenerValorPGNivel(nivel, claseId);
    const valorNivel = Math.max(1, tirada + modCON);
    total += valorNivel;
    items.push({ origen: `${clase.nombre} nivel de clase ${contarNivelClaseHastaNivelPersonaje(claseId, nivel)} (personaje nivel ${nivel})`, valor: valorNivel, descripcion: `${tirada} PG de dado + ${modCON} CON` });
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
  FUE: { total: 0, items: [] },
  DES: { total: 0, items: [] },
  CON: { total: 0, items: [] },
  INT: { total: 0, items: [] },
  SAB: { total: 0, items: [] },
  CAR: { total: 0, items: [] },
  PG: { total: 0, items: [] },
  Velocidad: { total: 0, items: [] },
  Iniciativa: { total: 0, items: [] },
  CA: { total: 0, items: [] },
  Competencia: { total: 0, items: []}
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

function obtenerTiposEfectoCompatibles(tipoDeEfecto) {
  const equivalencias = {
    velocidad: ["velocidad", "bono_velocidad"],
    bonoCA: ["bonoCA", "bonifCA"],
    iniciativa: ["iniciativa"],
    bono_stat: ["bono_stat"]
  };
  return equivalencias[tipoDeEfecto] || [tipoDeEfecto];
}


function obtenerRasgosEquipoPersonalizado() {
  return normalizarInventarioEquipo(personajeActual?.inventarioEquipo || [])
    .filter(item => item.tipo === "equipo" || item.equipado)
    .filter(item => item.bonificaciones.length > 0)
    .map(item => {
      const efectos = item.tipo === "armadura"
        ? item.bonificaciones.filter(bono => !["bonoCA", "bonifCA"].includes(bono.tipoDeEfecto))
        : [...item.bonificaciones];
      return {
        nombre: item.nombre,
        origen: "Equipo",
        descripcionResum: item.descripcion || "Bonificador configurado desde la ventana de Equipo",
        efectos
      };
    });
}

function obtenerRasgosConOrigenParaDetalles() {
  return [
    ...(razaElegida?.rasgos || []).map(rasgo => ({ ...rasgo, origen: razaElegida.nombre })),
    ...(subrazaElegida?.rasgos || []).map(rasgo => ({ ...rasgo, origen: subrazaElegida.nombre })),
    ...obtenerRasgosDeClasesDisponibles(),
    ...obtenerOpcionesSeleccionadasDisponibles(),
    ...obtenerRasgosEquipoPersonalizado()
  ];
}

function obtenerValorEfecto(efecto) {
  return efecto?.valor || efecto?.valorDelBono || 0;
}

function obtenerDetallesEfectos(tipoDeEfecto, propiedadFiltro = null, valorFiltro = null) {
  const tiposCompatibles = obtenerTiposEfectoCompatibles(tipoDeEfecto);
  return obtenerRasgosConOrigenParaDetalles().flatMap(rasgo => (rasgo.efectos || [])
    .filter(efecto => tiposCompatibles.includes(efecto.tipoDeEfecto))
    .filter(efecto => !propiedadFiltro || efecto[propiedadFiltro] === valorFiltro)
    .filter(efecto => seCumpleCondicion(efecto.condicion, estado))
    .map(efecto => ({
      origen: `${rasgo.nombre} de ${rasgo.origen || "rasgos"}`,
      valor: obtenerValorEfecto(efecto),
      descripcion: efecto.descripcion || `Efecto ${efecto.tipoDeEfecto}`
    })));
}

function sumarDetallesEfectos(detalles) {
  return detalles.reduce((total, item) => total + (Number(item.valor) || 0), 0);
}

function actualizarDetalleCaracteristicas() {
  ESTADISTICAS_PRINCIPALES.forEach(({ id, nombre }) => {
    const base = Number(personajeActual[id]) || 0;
    const detallesBonos = obtenerDetallesEfectos("bono_stat", "statAfectada", id);
    const total = base + sumarDetallesEfectos(detallesBonos);
    detalleEstadisticas[id] = {
      total,
      items: [
        { origen: `${nombre} base del personaje`, valor: base, descripcion: "Valor asignado en la ficha" },
        ...detallesBonos
      ]
    };
  });
}

function actualizarDetalleCompetencia() {
  const nivelTotal = personajeActual.nivel || 1;
  const total = calcularBonificadorCompetencia(nivelTotal);
  detalleEstadisticas.Competencia = {
    total,
    items: [{
      origen: `Nivel total ${nivelTotal}`,
      valor: total,
      descripcion: "Bonificador de competencia según el nivel total del personaje"
    }]
  };
}

function calcularPersonajeConBonos() {
  const personajeCalculado = { ...personajeActual };
  ESTADISTICAS_PRINCIPALES.forEach(({ id }) => {
    personajeCalculado[id] = (Number(personajeActual[id]) || 0)
      + sumarDetallesEfectos(obtenerDetallesEfectos("bono_stat", "statAfectada", id));
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
  actualizarDetalleCaracteristicas();
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
  const detallesIniciativa = obtenerDetallesEfectos("iniciativa");
  const iniciativaActual = modDES + sumarDetallesEfectos(detallesIniciativa);
  detalleEstadisticas.Iniciativa.total = iniciativaActual;
  detalleEstadisticas.Iniciativa.items = [{
    origen: "Modificador de Destreza del personaje",
    valor: modDES,
    descripcion: "Modificador de la Destreza final"
  }, ...detallesIniciativa];

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
actualizarDetalleCompetencia();
document.getElementById("BC").innerText = formatoValor(bonifCompetencia);
////////////////////// || RASGOS || ///////////////////////////////////
function seCumpleCondicion(condicion, estado) {
  if (!condicion) return true;
  const tieneArmaduraEquipada = Boolean(estado.usaArmadura || obtenerArmaduraPersonalizadaEquipada());
  const tieneEscudoEquipado = Boolean(estado.usaEscudo || obtenerEscudosPersonalizadosEquipados().length);
  if (condicion.sinArmadura && tieneArmaduraEquipada) return false;
  if (condicion.sinEscudo && tieneEscudoEquipado) return false;
  if ((condicion.conArmadura || condicion.usaArmadura) && !tieneArmaduraEquipada) return false;
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
  const tiposCompatibles = obtenerTiposEfectoCompatibles(tipoDeEfecto);
  let total = 0;

  rasgos.forEach(rasgo => {
    (rasgo.efectos || []).forEach(efecto => {
      if (tiposCompatibles.includes(efecto.tipoDeEfecto)
          && (!propiedadFiltro || efecto[propiedadFiltro] === valorFiltro)
          && seCumpleCondicion(efecto.condicion, estado)) {
        total += obtenerValorEfecto(efecto);
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
                    if (obtenerTiposEfectoCompatibles(tipoDeEfecto).includes(efecto.tipoDeEfecto) && seCumpleCondicion(efecto.condicion, estado)) {
                        if (!propiedadFiltro || efecto[propiedadFiltro] === valorFiltro) {
                            total += obtenerValorEfecto(efecto);
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
                    if (obtenerTiposEfectoCompatibles(tipoDeEfecto).includes(efecto.tipoDeEfecto) && seCumpleCondicion(efecto.condicion, estado)) {
                      console.log("5. Encontré un efecto del tipo que busco en la subraza:", efecto);
                        // Filtramos si requiere alguna propiedad específica (como la stat afectada)
                        if (!propiedadFiltro || efecto[propiedadFiltro] === valorFiltro) {
                            // Sumamos el valor del bono (soportando ambas nomenclaturas que usas)
                            total += obtenerValorEfecto(efecto);
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
  const tiposCompatibles = obtenerTiposEfectoCompatibles(tipoDeEfecto);
  for (const rasgo of obtenerRasgosConOrigenParaDetalles()) {
    const efecto = (rasgo.efectos || []).find(ef => tiposCompatibles.includes(ef.tipoDeEfecto));
    if (efecto) return { ...efecto, nombre: rasgo.nombre, origen: rasgo.origen };
  }
  return null;
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
const detallesIniciativaInicial = obtenerDetallesEfectos("iniciativa");
detalleEstadisticas.Iniciativa.total = iniciativaTotal;
detalleEstadisticas.Iniciativa.items = [{
  origen: "Modificador de Destreza del personaje",
  valor: modDES,
  descripcion: "Modificador de la Destreza final"
}, ...detallesIniciativaInicial];

if (iniciativaTotal >= 0) {
    document.getElementById("Ini").innerText = "+" + iniciativaTotal;
} else {
    document.getElementById("Ini").innerText = iniciativaTotal;
}

/////////////////////////////////////////////////////////////////

///////////////////// Popup de Estadísticas /////////////////////
function formatoValor(valor) {
  const numero = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isFinite(numero)) return valor;
  return numero >= 0 ? "+" + numero : String(numero);
}

function obtenerClaveDetalleEstadistica(clave) {
  const equivalencias = { Vel: "Velocidad", Ini: "Iniciativa", BC: "Competencia" };
  return equivalencias[clave] || clave;
}

function obtenerTituloDetalleEstadistica(clave) {
  const titulos = {
    FUE: "Fuerza",
    DES: "Destreza",
    CON: "Constitución",
    INT: "Inteligencia",
    SAB: "Sabiduría",
    CAR: "Carisma",
    PG: "Puntos de Golpe",
    CA: "Clase de Armadura",
    Competencia: "Bonificador de Competencia"
  };
  return titulos[clave] || clave;
}

function renderPopupEstadisticas(detalle, clave) {
  const contenido = document.getElementById("popupContenido");
  const claveDetalle = obtenerClaveDetalleEstadistica(clave);
  const entradas = claveDetalle && Object.prototype.hasOwnProperty.call(detalle, claveDetalle)
    ? [[claveDetalle, detalle[claveDetalle]]]
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
          <h3>${obtenerTituloDetalleEstadistica(titulo)} — Total ${formatoValor(data.total)}</h3>
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
function actualizarVelocidad() {
  if (!razaElegida) return;
  const velocidadBase = razaElegida.velocidad || 0;
  const detallesVelocidad = obtenerDetallesEfectos("velocidad");
  const velocidadTotal = velocidadBase + sumarDetallesEfectos(detallesVelocidad);

  detalleEstadisticas.Velocidad.total = velocidadTotal;
  detalleEstadisticas.Velocidad.items = [
    { origen: `Velocidad de ${razaElegida.nombre}`, valor: velocidadBase, descripcion: "Velocidad base de la raza" },
    ...detallesVelocidad
  ];

  document.getElementById("Vel").innerText = velocidadTotal;
}

actualizarVelocidad();

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
  renderAtaquesCombate();
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

function obtenerArmaduraPersonalizadaEquipada() {
  return normalizarInventarioEquipo(personajeActual.inventarioEquipo)
    .find(item => item.tipo === "armadura" && item.equipado && !esEscudoEquipo(item) && Number(item.caBase));
}

function obtenerEscudosPersonalizadosEquipados() {
  return normalizarInventarioEquipo(personajeActual.inventarioEquipo)
    .filter(item => item.tipo === "armadura" && item.equipado && esEscudoEquipo(item));
}

function calcularCA(personaje, armaduraElegida, claseElegida, razaElegida, equipo, estado) {
  const modDES = calcularModificadorNumero(personaje.DES);
  const armaduraPersonalizada = obtenerArmaduraPersonalizadaEquipada();
  const armaduraActiva = armaduraPersonalizada || armaduraElegida;
  let caTotal;
  let textoArmadura = "Armadura natural";
  const detalle = [];

  if (armaduraActiva) {
    textoArmadura = armaduraActiva.nombre;

    if (armaduraPersonalizada) {
      const base = Number(armaduraPersonalizada.caBase) || 0;
      const modArmadura = obtenerModificadorCAArmadura(armaduraPersonalizada);
      const bonificador = obtenerBonificadorCAItem(armaduraPersonalizada);
      caTotal = base + modArmadura + bonificador;
      detalle.push({
        origen: armaduraPersonalizada.nombre,
        valor: base,
        descripcion: "CA base de armadura equipada"
      });
      if (armaduraPersonalizada.destrezaCA !== "no") {
        detalle.push({
          origen: "Modificador de Destreza",
          valor: modArmadura,
          descripcion: describirDestrezaCA(armaduraPersonalizada.destrezaCA)
        });
      }
      if (bonificador) {
        detalle.push({
          origen: `Bonificadores de ${armaduraPersonalizada.nombre}`,
          valor: bonificador,
          descripcion: "Bonificadores configurados en la armadura"
        });
      }
    } else if (armaduraElegida) {  
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
    }
  } else {
    let efectoCa = buscarEfecto("caSinArmadura");

    if (efectoCa && seCumpleCondicion(efectoCa.condicion, estado)) {
      caTotal = calcularCADesdeEfecto(personaje, efectoCa);
      textoArmadura = efectoCa.nombre || "Defensa sin Armadura";
      detalle.push({
        origen: `${efectoCa.nombre || "Defensa sin Armadura"} de ${efectoCa.origen || claseElegida?.nombre || razaElegida?.nombre || "rasgos"}`,
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

  const detallesBonoCA = obtenerDetallesEfectos("bonoCA");
  const bonoCARasgos = sumarDetallesEfectos(detallesBonoCA);
  if (bonoCARasgos) {
    caTotal += bonoCARasgos;
    detalle.push(...detallesBonoCA);
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

    const escudosPersonalizados = obtenerEscudosPersonalizadosEquipados();
  const bonoEscudosPersonalizados = escudosPersonalizados.reduce((total, item) => total + obtenerBonificadorCAItem(item), 0);
  if (bonoEscudosPersonalizados) {
    caTotal += bonoEscudosPersonalizados;
    detalle.push({
      origen: "Bonos de " + escudosPersonalizados.map(item => item.nombre).join(", "),
      valor: bonoEscudosPersonalizados,
      descripcion: "Bonos de CA de escudos personalizados equipados"
    });
  }

  return { caTotal, textoArmadura, detalle };
}

document.querySelectorAll("[data-popup-key]").forEach(box => {
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

function obtenerFuentesConEfectos() {
  return [
    ...(razaElegida?.rasgos || []).map(rasgo => ({ ...rasgo, origen: razaElegida.nombre })),
    ...(subrazaElegida?.rasgos || []).map(rasgo => ({ ...rasgo, origen: subrazaElegida.nombre })),
    ...obtenerRasgosDeClasesDisponibles(),
    ...obtenerOpcionesSeleccionadasDisponibles(),
    ...obtenerRasgosEquipoPersonalizado()
  ];
}

function obtenerCondicionesEfecto(efecto) {
  if (Array.isArray(efecto.condiciones)) return efecto.condiciones;
  if (efecto.condicion) return [efecto.condicion];
  return [];
}

function efectoTieneCondicionCompetencia(efecto) {
  return obtenerCondicionesEfecto(efecto)
    .some(condicion => Object.prototype.hasOwnProperty.call(condicion, "competencia"));
}

function efectoCumpleCondicionesHabilidad(efecto, contexto) {
  return obtenerCondicionesEfecto(efecto).every(condicion => {
    if (Object.prototype.hasOwnProperty.call(condicion, "competencia")
        && Boolean(condicion.competencia) !== contexto.competencia) {
      return false;
    }

    return true;
  });
}

function obtenerBonosDeHabilidad(nombreHabilidad, esCompetente) {
  const claveHabilidad = normalizarTextoCompetencia(nombreHabilidad);
  const contexto = { competencia: Boolean(esCompetente) };
  const items = [];

  obtenerFuentesConEfectos().forEach(rasgo => {
    (rasgo.efectos || []).forEach(efecto => {
      if (efecto.tipoDeEfecto !== "bono_habilidad" || !efecto.habilidadAfectada) return;
      if (normalizarTextoCompetencia(efecto.habilidadAfectada) !== claveHabilidad) return;
      if (!efectoTieneCondicionCompetencia(efecto)) return;
      if (!efectoCumpleCondicionesHabilidad(efecto, contexto)) return;

      items.push({
        origen: rasgo.nombre || rasgo.origen || "Rasgo",
        valor: efecto.valor || efecto.valorDelBono || 0,
        descripcion: rasgo.descripcionResum || `Bono de ${rasgo.origen || "rasgo"}`
      });
    });
  });

  return {
    total: items.reduce((total, item) => total + item.valor, 0),
    items
  };
}

function abrirPopupHabilidad(nombreHabilidad) {
  const detalle = detalleHabilidades[nombreHabilidad];
  if (!detalle) return;

  renderPopupEstadisticas({ [nombreHabilidad]: detalle }, nombreHabilidad);
  document.getElementById("popup-estadisticas").classList.remove("oculto");
}

function obtenerBonosDeSalvacion(stat) {
  const items = [];

  obtenerFuentesConEfectos().forEach(rasgo => {
    (rasgo.efectos || []).forEach(efecto => {
      if (efecto.tipoDeEfecto !== "bono_salvacion") return;
      const salvacionAfectada = efecto.statAfectada || efecto.salvacionAfectada;
      if (salvacionAfectada !== stat) return;
      if (!efectoCumpleCondicionesHabilidad(efecto, {})) return;

      items.push({
        origen: rasgo.nombre || rasgo.origen || "Rasgo",
        valor: efecto.valor || efecto.valorDelBono || 0,
        descripcion: rasgo.descripcionResum || `Bono de ${rasgo.origen || "rasgo"}`
      });
    });
  });

  return {
    total: items.reduce((total, item) => total + item.valor, 0),
    items
  };
}

function abrirPopupSalvacion(stat) {
  const detalle = detalleSalvaciones[stat];
  if (!detalle) return;

  renderPopupEstadisticas({ [detalle.nombre]: detalle }, detalle.nombre);
  document.getElementById("popup-estadisticas").classList.remove("oculto");
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
  return obtenerFuentesConEfectos().flatMap(rasgo => (rasgo.efectos || [])
    .filter(efecto => (
      ((efecto.tipoDeEfecto === "bono_habilidad" && !efectoTieneCondicionCompetencia(efecto))
        || efecto.tipoDeEfecto === "competencia")
      && efecto.habilidadAfectada
    ))
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

  detalleSalvaciones = {};

  const salvacionesHTML = TODAS_SALVACIONES.map(({ stat, label }) => {
    const esCompetente = salvacionesCompetentes.includes(stat);
    const modBase = calcularModificadorNumero(stats[stat]);
    const bonoCompetencia = esCompetente ? BC : 0;
    const bonosSalvacion = obtenerBonosDeSalvacion(stat);
    const mod = modBase + bonoCompetencia + bonosSalvacion.total;
    const signo = mod >= 0 ? "+" : "";
    const nombreSalvacion = `Tirada de Salvación de ${label}`;

    detalleSalvaciones[stat] = {
      nombre: nombreSalvacion,
      total: mod,
      items: [
        { origen: `Modificador de ${stat}`, valor: modBase, descripcion: `${stat} final: ${stats[stat]}` },
        ...(esCompetente ? [{ origen: "Competencia", valor: bonoCompetencia, descripcion: "Bonificador de competencia aplicado" }] : []),
        ...bonosSalvacion.items
      ]
    };

    return `
      <div class="comp-fila clickable ${esCompetente ? "competente" : ""}" data-salvacion="${textoSeguro(stat)}">
        <span class="comp-dot ${esCompetente ? "dot-on" : "dot-off"}"></span>
        <span class="comp-mod">${signo}${mod}</span>
        <span class="comp-nombre">${label}</span>
      </div>`;
  }).join("");

  // ── Bloque 2: Habilidades ──

  // Las habilidades competentes vienen de clase, raza y elecciones hechas en Build.
  const habilidadesCompetentes = obtenerHabilidadesCompetentes();
  const habilidadesCompetentesNormalizadas = habilidadesCompetentes.map(normalizarTextoCompetencia);

  detalleHabilidades = {};

  const habilidadesHTML = HABILIDADES_PERSONAJE.map(({ nombre, stat }) => {
    const esCompetente = habilidadesCompetentesNormalizadas.includes(normalizarTextoCompetencia(nombre));
    const modBase = calcularModificadorNumero(stats[stat]);
    const bonoCompetencia = esCompetente ? BC : 0;
    const bonosHabilidad = obtenerBonosDeHabilidad(nombre, esCompetente);
    const mod = modBase + bonoCompetencia + bonosHabilidad.total;
    const signo = mod >= 0 ? "+" : "";

    detalleHabilidades[nombre] = {
      total: mod,
      items: [
        { origen: `Modificador de ${stat}`, valor: modBase, descripcion: `${stat} final: ${stats[stat]}` },
        ...(esCompetente ? [{ origen: "Competencia", valor: bonoCompetencia, descripcion: "Bonificador de competencia aplicado" }] : []),
        ...bonosHabilidad.items
      ]
    };

    return `
      <div class="comp-fila clickable ${esCompetente ? "competente" : ""}" data-habilidad="${textoSeguro(nombre)}">
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

  panelVentanas.querySelectorAll("[data-salvacion]").forEach(fila => {
    fila.addEventListener("click", () => abrirPopupSalvacion(fila.dataset.salvacion));
  });

  panelVentanas.querySelectorAll("[data-habilidad]").forEach(fila => {
    fila.addEventListener("click", () => abrirPopupHabilidad(fila.dataset.habilidad));
  });
}

// 1. Creamos un "bolsillo" temporal para guardar los rasgos que mostramos en pantalla
let listaRasgosActuales = [];
let listaRasgosBuildActuales = [];
let listaSeleccionesBuildActuales = [];

// 2. Nuestra nueva función constructora de la pestaña Rasgos
function renderRasgos() {
    listaRasgosActuales = [];
    let contadorId = 0;

    const limpiarResumenFicha = rasgo => resumenRasgo(rasgo).replace(/<br>|###|\*\*/g, "");

    const renderTarjetaRasgoFicha = (rasgo, origen, tituloExtra = "", claseExtra = "") => {
        const indice = contadorId;
        const usarFormatoBuild = claseExtra.includes("rasgo-seleccionado-ficha");
        const claseTarjeta = usarFormatoBuild ? "build-rasgo-card" : "rasgo-tarjeta-boton";
        const claseTitulo = usarFormatoBuild ? "build-rasgo-card-titulo" : "rasgo-tarjeta-titulo";
        const claseResumen = usarFormatoBuild ? "build-rasgo-card-resumen" : "rasgo-tarjeta-resumen";
        listaRasgosActuales.push({ ...rasgo, origen });
        contadorId++;

        return `
            <div class="${claseExtra}">
                <div class="${claseTarjeta}" onclick="abrirPopupRasgo(${indice})">
                    <div class="${claseTitulo}">
                        ${textoSeguro(rasgo.nombre)} ${tituloExtra}
                    </div>
                    <div class="${claseResumen}">${textoSeguro(limpiarResumenFicha(rasgo))}</div>
                </div>
            </div>
        `;
    };

    const opcionElegidaEsRasgo = opcion => Boolean(
        opcion
        && (
            opcion.descripcion
            || opcion.descripcionResum
            || Array.isArray(opcion.efectos)
            || Array.isArray(opcion.selecciones)
        )
    );

    const renderRasgosElegidosPorSeleccion = (rasgo, contexto, origen) => {
        const opcionesElegidas = obtenerOpcionesSeleccionadasDeRasgo(rasgo, contexto, origen)
            .filter(opcionElegidaEsRasgo);

        return opcionesElegidas
            .map(opcion => renderTarjetaRasgoFicha(
                opcion,
                `${origen} — ${rasgo.nombre}`,
                "",
                "rasgo-seleccionado-ficha"
            ))
            .join("");
    };
    let html = `
        <h2 class="titulo-panel">Rasgos y Atributos</h2>
        <div class="rasgos-contenedor-scroll" style="max-height: 75vh; overflow-y: auto; padding-right: 5px;">
    `;

    // ==========================================
    // 1. SECCIÓN DE RAZA (Desplegable Principal)
    // ==========================================
    if (razaElegida) {
        html += `<details open class="desplegable-seccion">
                    <summary class="desplegable-titulo">Raza: ${textoSeguro(razaElegida.nombre)}</summary>                    <div class="desplegable-contenido">`;
        
        if (razaElegida.rasgos && razaElegida.rasgos.length > 0) {
            razaElegida.rasgos.forEach(rasgo => {
                html += renderTarjetaRasgoFicha(rasgo, razaElegida.nombre);
                html += renderRasgosElegidosPorSeleccion(rasgo, "raza", razaElegida.nombre);
            });
        }

        if (subrazaElegida && subrazaElegida.rasgos && subrazaElegida.rasgos.length > 0) {
            html += `<details open class="desplegable-subseccion">
                        <summary class="desplegable-subtitulo">Subraza: ${textoSeguro(subrazaElegida.nombre)}</summary>
                        <div class="desplegable-contenido">`;
            
            subrazaElegida.rasgos.forEach(rasgo => {
                html += renderTarjetaRasgoFicha(rasgo, subrazaElegida.nombre);
                html += renderRasgosElegidosPorSeleccion(rasgo, "subraza", subrazaElegida.nombre);
            });
            html += `</div></details>`;
        }
        
        html += `</div></details>`;
    }

    // ==========================================
    // 2. SECCIÓN DE CLASES (Desplegables Principal)
    // ==========================================
    clasesActivas.filter(slot => slot.clase && slot.nivel > 0).forEach(slot => {
        html += `<details open class="desplegable-seccion" style="margin-top: 15px;">
                    <summary class="desplegable-titulo">Clase ${slot.numeroSlot}: ${textoSeguro(slot.clase.nombre)} nivel ${slot.nivel}</summary>                    <div class="desplegable-contenido">`;
        
        if (slot.clase.rasgos && slot.clase.rasgos.length > 0) {
            let tieneRasgosClase = false;
            slot.clase.rasgos.forEach(rasgo => {
              if (rasgoDisponiblePorNivelClase(rasgo, slot.nivel)) {
                    tieneRasgosClase = true;
                    const tituloNivel = `<span style="font-size: 11px; font-weight: normal; color: #8b7355;">(Nvl ${rasgo.nivelClase || 1} de ${textoSeguro(slot.clase.nombre)})</span>`;
                    html += renderTarjetaRasgoFicha(rasgo, slot.clase.nombre, tituloNivel);
                    html += renderRasgosElegidosPorSeleccion(rasgo, `clase${slot.numeroSlot}`, slot.clase.nombre);
                }
            });
  
            if (!tieneRasgosClase) {
                html += `<p style="color: #776a62; font-style: italic; font-size: 13px; margin-left: 10px;">Aún no tienes rasgos desbloqueados para tu nivel de ${textoSeguro(slot.clase.nombre)}.</p>`;            }
        }

        if (slot.subclase && slot.subclase.rasgos && slot.subclase.rasgos.length > 0) {
            html += `<details open class="desplegable-subseccion">
                        <summary class="desplegable-subtitulo">Subclase: ${textoSeguro(slot.subclase.nombre)}</summary>
                        <div class="desplegable-contenido">`;
            
            slot.subclase.rasgos.forEach(rasgo => {
                if (rasgoDisponiblePorNivelClase(rasgo, slot.nivel)) {
                    const tituloNivel = `<span style="font-size: 11px; font-weight: normal; color: #8b7355;">(Nvl ${rasgo.nivelClase || 1} de ${textoSeguro(slot.clase.nombre)})</span>`;
                    html += renderTarjetaRasgoFicha(rasgo, slot.subclase.nombre, tituloNivel);
                    html += renderRasgosElegidosPorSeleccion(rasgo, `clase${slot.numeroSlot}`, slot.subclase.nombre);
                }
            });

            html += `</div></details>`;
        }
        
        html += `</div></details>`;
    });

    html += `</div>`;
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
    <h2 class="titulo-panel">Conjuros</h2>
    <p style="color:#6b5a53; text-align:center; margin-top:20px;">
      ✨ Esta sección mostrará los conjuros conocidos del personaje.<br>
      <small>Próximamente: filtros por nivel y escuela.</small>
    </p>
  `;
}

const MONEDAS_DND = [
  { id: "cp", nombre: "Cobre", etiqueta: "CP", valorCp: 1 },
  { id: "sp", nombre: "Plata", etiqueta: "SP", valorCp: 10 },
  { id: "ep", nombre: "Electro", etiqueta: "EP", valorCp: 50 },
  { id: "gp", nombre: "Oro", etiqueta: "GP", valorCp: 100 },
  { id: "pp", nombre: "Platino", etiqueta: "PP", valorCp: 1000 }
];

const CONFIG_EQUIPO = {
  arma: {
    titulo: "Armas",
    singular: "Arma",
    subtipos: ["Arma sencilla", "Arma natural", "Arma improvisada", "Arma marcial"]
  },
  armadura: {
    titulo: "Armaduras",
    singular: "Armadura",
    subtipos: ["Ligero", "Medio", "Pesado", "Escudo"]
  },
  equipo: {
    titulo: "Equipo",
    singular: "Equipo",
    subtipos: ["Herramienta", "Objeto aventurero", "Objeto mágico", "Otro"]
  }
};

function asegurarDatosEquipoPersonaje() {
  personajeActual.monedas = normalizarMonedasPersonaje(personajeActual.monedas);
  personajeActual.equipo = normalizarListaIds(personajeActual.equipo);
  personajeActual.inventarioEquipo = normalizarInventarioEquipo(personajeActual.inventarioEquipo);
  personajeActual.sintonizacionSlots = Math.max(0, Number(personajeActual.sintonizacionSlots ?? 3) || 0);
  personajeActual.sintonizados = normalizarListaIds(personajeActual.sintonizados).slice(0, personajeActual.sintonizacionSlots);
}

function obtenerMonedaConfig(monedaId) {
  return MONEDAS_DND.find(moneda => moneda.id === monedaId) || MONEDAS_DND[0];
}

function obtenerCantidadMoneda(monedaId) {
  asegurarDatosEquipoPersonaje();
  return Math.max(0, Math.floor(Number(personajeActual.monedas[monedaId]) || 0));
}

function cambiarCantidadMoneda(monedaId, modo, valor) {
  asegurarDatosEquipoPersonaje();
  const cantidad = Math.max(0, Math.floor(Number(valor)) || 0);
  const actual = obtenerCantidadMoneda(monedaId);

  if (modo === "sumar") personajeActual.monedas[monedaId] = actual + cantidad;
  if (modo === "restar") personajeActual.monedas[monedaId] = Math.max(0, actual - cantidad);
  if (modo === "establecer") personajeActual.monedas[monedaId] = cantidad;

  marcarPersonajeModificado();
  renderEquipo();
  abrirPopupMoneda(monedaId);
}


function maximoComunDivisor(a, b) {
  let x = Math.abs(Number(a) || 0);
  let y = Math.abs(Number(b) || 0);
  while (y) {
    const resto = x % y;
    x = y;
    y = resto;
  }
  return x || 1;
}

function obtenerPasoCanjeMoneda(origenId, destinoId) {
  const origen = obtenerMonedaConfig(origenId);
  const destino = obtenerMonedaConfig(destinoId);
  return origen && destino ? origen.valorCp / maximoComunDivisor(origen.valorCp, destino.valorCp) : 1;
}

function obtenerMaximoCanjeMoneda(origenId, destinoId) {
  const origen = obtenerMonedaConfig(origenId);
  const destino = obtenerMonedaConfig(destinoId);
  if (!origen || !destino || origen.id === destino.id) return 0;
  const cantidadOrigen = obtenerCantidadMoneda(origenId);
  const valorTotalOrigen = cantidadOrigen * origen.valorCp;

  return Math.floor(valorTotalOrigen / destino.valorCp);
}

function obtenerCostoCanjeEnOrigen(origenId, destinoId, cantidadDestino) {
  const origen = obtenerMonedaConfig(origenId);
  const destino = obtenerMonedaConfig(destinoId);
  const cantidad = Math.max(0, Math.floor(Number(cantidadDestino)) || 0);
  const costo = (cantidad * destino.valorCp) / origen.valorCp;
  return Number.isInteger(costo) ? costo : null;
}

function canjearMoneda(origenId) {
  const destinoId = document.getElementById("monedaDestino")?.value;
  const cantidadDestino = Math.max(0, Math.floor(Number(document.getElementById("monedaCanjeCantidad")?.value)) || 0);
  const maximo = obtenerMaximoCanjeMoneda(origenId, destinoId);
  const costoOrigen = obtenerCostoCanjeEnOrigen(origenId, destinoId, cantidadDestino);

  if (!destinoId || destinoId === origenId || cantidadDestino <= 0 || cantidadDestino > maximo || costoOrigen === null) {
    abrirPopupMoneda(origenId);
    return;
  }

  personajeActual.monedas[origenId] = obtenerCantidadMoneda(origenId) - costoOrigen;
  personajeActual.monedas[destinoId] = obtenerCantidadMoneda(destinoId) + cantidadDestino;
  marcarPersonajeModificado();
  renderEquipo();
  abrirPopupMoneda(origenId);
}

function abrirPopupEquipo(titulo, contenidoHtml) {
  const popup = document.getElementById("popup-rasgo");
  const contenido = document.getElementById("popup-rasgo-contenido");
  if (!popup || !contenido) return;

  contenido.innerHTML = `
    <div class="equipo-popup-grid">
      <h3 style="color:#5a4035; margin:0 34px 8px 0; font-family:Georgia, serif;">${textoSeguro(titulo)}</h3>
      ${contenidoHtml}
    </div>
  `;
  popup.classList.remove("oculto");
}

function cerrarPopupEquipo() {
  cerrarPopupRasgo();
}

function abrirPopupMoneda(monedaId) {
  asegurarDatosEquipoPersonaje();
  const moneda = obtenerMonedaConfig(monedaId);
  const opcionesDestino = MONEDAS_DND
    .filter(item => item.id !== monedaId)
    .map(item => {
      const maximo = obtenerMaximoCanjeMoneda(monedaId, item.id);
      const paso = obtenerPasoCanjeMoneda(monedaId, item.id);
      const deshabilitada = maximo < paso;
      const avisoExactitud = paso > 1 ? ` (múltiplos de ${paso})` : "";
      return `<option value="${item.id}" ${deshabilitada ? "disabled" : ""}>${item.nombre} (${item.etiqueta}) — máx. ${maximo}${avisoExactitud}</option>`;
    }).join("");

  abrirPopupEquipo(`Monedas de ${moneda.nombre}`, `
    <p style="margin:0; color:#6b5a53;">Cantidad actual: <strong>${obtenerCantidadMoneda(monedaId)} ${moneda.etiqueta}</strong></p>
    <div class="equipo-popup-fila">
      <div class="equipo-popup-campo">
        <label for="monedaValor">Cantidad</label>
        <input id="monedaValor" type="number" min="0" step="1" value="1">
      </div>
      <div class="equipo-popup-campo">
        <label>Acciones</label>
        <div class="equipo-popup-acciones" style="justify-content:flex-start; margin-top:0;">
          <button class="equipo-popup-accion" type="button" onclick="cambiarCantidadMoneda('${monedaId}', 'sumar', document.getElementById('monedaValor').value)">Sumar</button>
          <button class="equipo-popup-accion" type="button" onclick="cambiarCantidadMoneda('${monedaId}', 'restar', document.getElementById('monedaValor').value)">Restar</button>
          <button class="equipo-popup-accion" type="button" onclick="cambiarCantidadMoneda('${monedaId}', 'establecer', document.getElementById('monedaValor').value)">Establecer</button>
        </div>
      </div>
    </div>
    <hr class="equipo-separador">
    <div class="equipo-popup-campo">
      <label for="monedaDestino">Transformar a</label>
      <select id="monedaDestino" onchange="actualizarMaximoCanjeMoneda('${monedaId}')">${opcionesDestino}</select>
    </div>
    <div class="equipo-popup-campo">
      <label for="monedaCanjeCantidad">Cantidad de monedas destino</label>
      <input id="monedaCanjeCantidad" type="number" min="0" step="1" value="0">
      <small id="monedaCanjeAyuda" style="color:#6b5a53; display:block; margin-top:5px;"></small>
    </div>
    <div class="equipo-popup-acciones">
      <button class="equipo-popup-accion" type="button" onclick="canjearMoneda('${monedaId}')">Transformar</button>
    </div>
  `);
  actualizarMaximoCanjeMoneda(monedaId);
}

function actualizarMaximoCanjeMoneda(origenId) {
  const destinoId = document.getElementById("monedaDestino")?.value;
  const input = document.getElementById("monedaCanjeCantidad");
  const ayuda = document.getElementById("monedaCanjeAyuda");
  if (!destinoId || !input || !ayuda) return;

  const maximo = obtenerMaximoCanjeMoneda(origenId, destinoId);
  const paso = obtenerPasoCanjeMoneda(origenId, destinoId);
  input.max = String(maximo);
  input.step = String(paso);
  if (Number(input.value) > maximo) input.value = String(maximo);
  ayuda.textContent = paso > 1
    ? `Máximo permitido: ${maximo}. Para no partir monedas de origen, usa múltiplos de ${paso}.`
    : `Máximo permitido: ${maximo}.`;
}

function obtenerBibliotecaPorTipoEquipo(tipo) {
  if (tipo === "arma") return libroDeReglasBasicas.armas || [];
  if (tipo === "armadura") {
    return [
      ...(libroDeReglasBasicas.armaduras || []),
      ...(libroDeReglasBasicas.equipo || []).filter(item => item.tipo === "escudo")
    ];
  }
  return libroDeReglasBasicas.equipo || [];
}

function describirEfectosEquipo(item) {
  if (!item) return "";
  if (Array.isArray(item.efectos)) return item.efectos.join("\n");
  return String(item.efectos || "");
}

function detectarDestrezaArmadura(item) {
  const texto = `${item?.tipo || ""} ${item?.subtipo || ""} ${describirEfectosEquipo(item)}`.toLowerCase();
  if (texto.includes("máximo") || texto.includes("max") || texto.includes("media")) return "max2";
  if (texto.includes("pesada") || texto.includes("sin destreza") || texto.includes("no usar")) return "no";
  return "usar";
}

function crearDatosPlantillaEquipo(tipo) {
  return obtenerBibliotecaPorTipoEquipo(tipo).reduce((mapa, item) => {
    const etiquetas = Array.isArray(item.etiquetas) ? item.etiquetas : [];
    const efectos = describirEfectosEquipo(item);
    const danoPrincipal = efectos.match(/Daño:\s*([^\s]+)\s+([^\n]+)/i);
    const danoSecundario = efectos.match(/Versátil:\s*([^\s]+)\s+([^\n]+)/i);
    const alcance = efectos.match(/Alcance:\s*([^\n]+)/i);
    const caBaseDetectada = item.caBase || efectos.match(/CA base:\s*(\d+)/i)?.[1] || "";
    mapa[item.id] = {
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
      precio: item.precio || "",
      subtipo: item.subtipo || item.tipo || "",
      efectos,
      etiquetas: etiquetas.join(", "),
      caBase: caBaseDetectada,
      destrezaCA: detectarDestrezaArmadura(item),
      bonificadorExtra: 0,
      tipoArma: etiquetas.map(et => String(et).toLowerCase()).includes("marcial") || String(item.subtipo || "").toLowerCase().includes("marcial") ? "marcial" : "sencilla",
      ataqueMod: etiquetas.some(et => normalizarTextoCompetencia(et).includes("municion") || normalizarTextoCompetencia(et).includes("distancia")) ? "DES" : "FUE",
      danoMod: etiquetas.some(et => normalizarTextoCompetencia(et).includes("municion") || normalizarTextoCompetencia(et).includes("distancia")) ? "DES" : "FUE",
      danoDado: danoPrincipal?.[1] || "",
      danoTipo: (danoPrincipal?.[2] || "").trim(),
      danoCritico: "",
      danoModSecundario: etiquetas.some(et => normalizarTextoCompetencia(et).includes("municion") || normalizarTextoCompetencia(et).includes("distancia")) ? "DES" : "FUE",
      danoDadoSecundario: danoSecundario?.[1] || "",
      danoTipoSecundario: (danoSecundario?.[2] || "").trim(),
      danoCriticoSecundario: "",
      distancia: (alcance?.[1] || "").trim()
    };
    return mapa;
  }, {});
}

function obtenerTiposBonificadoresEquipo() {
  const tiposDetectados = new Set(["bonoCA", "bono_habilidad", "bono_stat", "competencia"]);
  obtenerRasgosConOrigenParaDetalles().forEach(rasgo => (rasgo.efectos || []).forEach(efecto => {
    if (["bonoCA", "bonifCA", "bono_habilidad", "bono_stat", "competencia"].includes(efecto.tipoDeEfecto)) {
      tiposDetectados.add(efecto.tipoDeEfecto === "bonifCA" ? "bonoCA" : efecto.tipoDeEfecto);
    }
  }));
  return [...tiposDetectados];
}

function crearOpcionesStatsEquipo(seleccionado = "") {
  return ESTADISTICAS_PRINCIPALES
    .map(stat => `<option value="${stat.id}" ${stat.id === seleccionado ? "selected" : ""}>${stat.id} — ${stat.nombre}</option>`)
    .join("");
}

function crearOpcionesHabilidadesEquipo(seleccionada = "") {
  return HABILIDADES_PERSONAJE
    .map(habilidad => `<option value="${textoSeguro(habilidad.nombre)}" ${habilidad.nombre === seleccionada ? "selected" : ""}>${textoSeguro(habilidad.nombre)}</option>`)
    .join("");
}

function crearOptionEquipo(valor, texto, seleccionado = "") {
  return `<option value="${textoSeguro(valor)}" ${String(valor) === String(seleccionado) ? "selected" : ""}>${textoSeguro(texto)}</option>`;
}

function renderCamposBonificadorEquipo(indice, tipoDeEfecto = "bonoCA", bono = {}) {
  const tipos = obtenerTiposBonificadoresEquipo();
  const opcionesTipo = tipos.map(tipo => crearOptionEquipo(tipo, tipo, tipoDeEfecto)).join("");
  const campoDestino = tipoDeEfecto === "bono_stat"
    ? `<label>Característica<select data-bono-campo="statAfectada">${crearOpcionesStatsEquipo(bono.statAfectada || "")}</select></label>`
    : tipoDeEfecto === "bono_habilidad" || tipoDeEfecto === "competencia"
      ? `<label>Habilidad<select data-bono-campo="habilidadAfectada">${crearOpcionesHabilidadesEquipo(bono.habilidadAfectada || "")}</select></label>`
      : `<label>Destino<input data-bono-campo="destino" type="text" placeholder="CA general" value="${textoSeguro(bono.categoria || "CA")}"></label>`;
  const campoValor = tipoDeEfecto === "competencia"
    ? `<label>Nivel<select data-bono-campo="competencia">${crearOptionEquipo("competencia", "Competencia", bono.competencia || "competencia")}${crearOptionEquipo("pericia", "Pericia", bono.competencia || "competencia")}</select></label>`
    : `<label>Valor<input data-bono-campo="valor" type="number" step="1" value="${Number(bono.valor) || 0}"></label>`;

  return `
    <div class="equipo-bonificador" data-bono-indice="${indice}">
      <label>Tipo<select data-bono-campo="tipoDeEfecto" onchange="actualizarTipoBonificadorEquipo(${indice}, this.value)">${opcionesTipo}</select></label>
      ${campoDestino}
      ${campoValor}
      <button class="equipo-popup-accion equipo-boton-rojo equipo-bonificador-quitar" type="button" onclick="quitarBonificadorEquipo(${indice})">Quitar</button>
    </div>
  `;
}

function agregarBonificadorEquipo(tipoDeEfecto = "bonoCA", bono = {}) {
  const contenedor = document.getElementById("equipoBonificadoresLista");
  if (!contenedor) return;
  const indice = contenedor.querySelectorAll(".equipo-bonificador").length;
  contenedor.insertAdjacentHTML("beforeend", renderCamposBonificadorEquipo(indice, tipoDeEfecto, bono));
}

function actualizarTipoBonificadorEquipo(indice, tipoDeEfecto) {
  const fila = document.querySelector(`[data-bono-indice="${indice}"]`);
  if (!fila) return;
  fila.outerHTML = renderCamposBonificadorEquipo(indice, tipoDeEfecto);
}

function quitarBonificadorEquipo(indice) {
  document.querySelector(`[data-bono-indice="${indice}"]`)?.remove();
}

function leerBonificacionesEquipoFormulario() {
  return [...document.querySelectorAll(".equipo-bonificador")].map(fila => {
    const leer = campo => fila.querySelector(`[data-bono-campo="${campo}"]`)?.value || "";
    const tipoDeEfecto = leer("tipoDeEfecto") || "bonoCA";
    return {
      tipoDeEfecto,
      valor: Number(leer("valor")) || 0,
      statAfectada: leer("statAfectada"),
      habilidadAfectada: leer("habilidadAfectada"),
      competencia: leer("competencia") || "competencia",
      categoria: leer("destino") || "CA"
    };
  });
}

function rellenarBonificacionesEquipoFormulario(bonificaciones = []) {
  const contenedor = document.getElementById("equipoBonificadoresLista");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  normalizarBonificacionesEquipo(bonificaciones).forEach(bono => agregarBonificadorEquipo(bono.tipoDeEfecto, bono));
}

function asignarValorCampoEquipo(id, valor) {
  const campo = document.getElementById(id);
  if (!campo) return;
  if (campo.tagName === "SELECT" && valor && ![...campo.options].some(opcion => opcion.value === String(valor))) {
    campo.insertAdjacentHTML("beforeend", `<option value="${textoSeguro(valor)}">${textoSeguro(valor)}</option>`);
  }
  campo.value = valor ?? "";
}

function aplicarPlantillaEquipo(tipo, plantillaId) {
  const plantilla = crearDatosPlantillaEquipo(tipo)[plantillaId];
  if (!plantilla) return;
  rellenarFormularioEquipo(plantilla);
}

function leerDatosItemEquipoDesdeFormulario(tipo, idExistente = "") {
  const config = CONFIG_EQUIPO[tipo] || CONFIG_EQUIPO.equipo;
  const nombre = document.getElementById("equipoNombre")?.value.trim();
  if (!nombre) return null;
  const itemExistente = personajeActual.inventarioEquipo.find(item => item.id === idExistente);

  return {
    id: idExistente || `custom-${tipo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nombre,
    descripcion: document.getElementById("equipoDescripcion")?.value.trim() || "",
    precio: document.getElementById("equipoPrecio")?.value.trim() || "",
    tipo,
    subtipo: document.getElementById("equipoSubtipo")?.value || config.subtipos[0] || "",
    equipado: tipo === "arma" || tipo === "armadura" ? itemExistente?.equipado !== false : Boolean(itemExistente?.equipado),
    efectos: document.getElementById("equipoEfectos")?.value.trim() || "",
    etiquetas: (document.getElementById("equipoEtiquetas")?.value || "")
      .split(",")
      .map(etiqueta => etiqueta.trim())
      .filter(Boolean),
    caBase: document.getElementById("equipoCABase")?.value || "",
    destrezaCA: document.getElementById("equipoDestrezaCA")?.value || "usar",
    bonificadorExtra: Number(document.getElementById("equipoBonificadorExtra")?.value) || 0,
    tipoArma: document.getElementById("equipoTipoArma")?.value || "",
    ataqueMod: document.getElementById("equipoAtaqueMod")?.value || "FUE",
    ataqueCompetencia: document.getElementById("equipoAtaqueCompetencia")?.value || "auto",
    ataqueBonificador: Number(document.getElementById("equipoAtaqueBonificador")?.value) || 0,
    danoMod: document.getElementById("equipoDanoMod")?.value || "FUE",
    danoDado: document.getElementById("equipoDanoDado")?.value.trim() || "",
    danoTipo: document.getElementById("equipoDanoTipo")?.value.trim() || "",
      danoCritico: document.getElementById("equipoDanoCritico")?.value.trim() || "",
    danoModSecundario: document.getElementById("equipoDanoModSecundario")?.value || document.getElementById("equipoDanoMod")?.value || "FUE",
    danoDadoSecundario: document.getElementById("equipoDanoDadoSecundario")?.value.trim() || "",
    danoTipoSecundario: document.getElementById("equipoDanoTipoSecundario")?.value.trim() || "",
    danoCriticoSecundario: document.getElementById("equipoDanoCriticoSecundario")?.value.trim() || "",
    distancia: document.getElementById("equipoDistancia")?.value.trim() || "",
    bonificaciones: leerBonificacionesEquipoFormulario()
  };
}

function guardarCambiosItemEquipo(tipo, itemId) {
  const indice = personajeActual.inventarioEquipo.findIndex(item => item.id === itemId);
  if (indice < 0) return;
  const item = leerDatosItemEquipoDesdeFormulario(tipo, itemId);
  if (!item) return;

  personajeActual.inventarioEquipo[indice] = item;
  aplicarReglasEquipoExclusivo(item);
  cerrarPopupEquipo();
  refrescarTrasCambioEquipo();
}

function crearItemEquipoDesdeFormulario(tipo) {
  const item = leerDatosItemEquipoDesdeFormulario(tipo);
  if (!item) return;

  personajeActual.inventarioEquipo.push(item);
  aplicarReglasEquipoExclusivo(item);
  cerrarPopupEquipo();
  refrescarTrasCambioEquipo();
}

function crearCamposArmaduraEquipo() {
  return `
    <div class="equipo-popup-fila">
      <div class="equipo-popup-campo"><label for="equipoCABase">CA base</label><input id="equipoCABase" type="number" step="1" placeholder="Ej.: 11"></div>
      <div class="equipo-popup-campo"><label for="equipoDestrezaCA">Destreza</label><select id="equipoDestrezaCA"><option value="usar">Utilizar destreza</option><option value="max2">Máx. +2</option><option value="no">No usar destreza</option></select></div>
    </div>
    <div class="equipo-popup-campo"><label for="equipoBonificadorExtra">Bonificador</label><input id="equipoBonificadorExtra" type="number" step="1" value="0"></div>
    <hr class="equipo-separador">
  `;
}

function crearCamposArmaEquipo() {
  return `
    <div class="equipo-popup-campo"><label for="equipoTipoArma">Tipo de arma</label><select id="equipoTipoArma"><option value="sencilla">Sencilla</option><option value="marcial">Marcial</option><option value="improvisada">Improvisada</option><option value="natural">Natural</option></select></div>
    <h4 class="equipo-popup-subtitulo">Impacto</h4>
    <div class="equipo-popup-fila equipo-popup-fila-una">
      <div class="equipo-popup-campo"><label for="equipoAtaqueMod">Modificador</label><select id="equipoAtaqueMod">${crearOpcionesStatsEquipo("FUE")}</select></div>
    </div>
    <div class="equipo-popup-fila">
      <div class="equipo-popup-campo"><label for="equipoAtaqueCompetencia">Competencia</label><select id="equipoAtaqueCompetencia"><option value="auto">Inicialmente vacío / automático</option><option value="sin">Sin competencia</option><option value="competencia">Competencia</option><option value="pericia">Pericia</option></select></div>
      <div class="equipo-popup-campo"><label for="equipoAtaqueBonificador">Bonificador (arma mágica)</label><input id="equipoAtaqueBonificador" type="number" step="1" value="0"></div>
    </div>
    <h4 class="equipo-popup-subtitulo">Daño</h4>
    <div class="equipo-popup-fila equipo-popup-fila-tres">
      <div class="equipo-popup-campo"><label for="equipoDanoMod">Modificador</label><select id="equipoDanoMod">${crearOpcionesStatsEquipo("FUE")}</select></div>
      <div class="equipo-popup-campo"><label for="equipoDanoDado">Dado de daño</label><input id="equipoDanoDado" type="text" placeholder="Ej.: 1d8, 4d4, 6d6"></div>
      <div class="equipo-popup-campo"><label for="equipoDanoCritico">Dado de daño crítico</label><input id="equipoDanoCritico" type="text" placeholder="Ej.: 2d8"></div>
    </div>
    <div class="equipo-popup-fila equipo-popup-fila-tres">
      <div class="equipo-popup-campo"><label for="equipoDanoModSecundario">Modificador</label><select id="equipoDanoModSecundario">${crearOpcionesStatsEquipo("FUE")}</select></div>
      <div class="equipo-popup-campo"><label for="equipoDanoDadoSecundario">Dado secundario</label><input id="equipoDanoDadoSecundario" type="text" placeholder="Opcional: 1d6"></div>
      <div class="equipo-popup-campo"><label for="equipoDanoCriticoSecundario">Dado de daño crítico secundario</label><input id="equipoDanoCriticoSecundario" type="text" placeholder="Opcional: 2d6"></div>
    </div>
    <div class="equipo-popup-fila equipo-popup-fila-tres">
      <div class="equipo-popup-campo"><label for="equipoDanoTipo">Tipo de daño</label><input id="equipoDanoTipo" type="text" placeholder="cortante, fuego..."></div>
      <div class="equipo-popup-campo"><label for="equipoDanoTipoSecundario">Tipo daño secundario</label><input id="equipoDanoTipoSecundario" type="text" placeholder="Opcional"></div>
      <div class="equipo-popup-campo"><label for="equipoDistancia">Distancia</label><input id="equipoDistancia" type="text" placeholder="Ej.: 150/600 pies"></div>
    </div>
    <hr class="equipo-separador">
  `;
}

function crearCamposBonificadoresEquipo() {
  return `
    <div class="equipo-popup-campo">
      <label>Otros bonificadores</label>
      <div id="equipoBonificadoresLista" class="equipo-bonificadores-lista"></div>
      <div class="equipo-popup-acciones" style="justify-content:flex-start; margin-top:8px;">
        <button class="equipo-popup-accion" type="button" onclick="agregarBonificadorEquipo('bonoCA')">+ Bono CA</button>
        <button class="equipo-popup-accion" type="button" onclick="agregarBonificadorEquipo('bono_habilidad')">+ Habilidad</button>
        <button class="equipo-popup-accion" type="button" onclick="agregarBonificadorEquipo('bono_stat')">+ Stat</button>
        <button class="equipo-popup-accion" type="button" onclick="agregarBonificadorEquipo('competencia')">+ Competencia</button>
      </div>
    </div>
  `;
}

function rellenarFormularioEquipo(item) {
  asignarValorCampoEquipo("equipoNombre", item.nombre || "");
  asignarValorCampoEquipo("equipoDescripcion", item.descripcion || "");
  asignarValorCampoEquipo("equipoPrecio", item.precio || "");
  asignarValorCampoEquipo("equipoSubtipo", item.subtipo || item.tipo || "");
  asignarValorCampoEquipo("equipoEfectos", describirEfectosEquipo(item));
  asignarValorCampoEquipo("equipoEtiquetas", Array.isArray(item.etiquetas) ? item.etiquetas.join(", ") : item.etiquetas || "");
  asignarValorCampoEquipo("equipoCABase", item.caBase || "");
  asignarValorCampoEquipo("equipoDestrezaCA", item.destrezaCA || detectarDestrezaArmadura(item));
  asignarValorCampoEquipo("equipoBonificadorExtra", item.bonificadorExtra || 0);
  asignarValorCampoEquipo("equipoTipoArma", item.tipoArma || "sencilla");
  asignarValorCampoEquipo("equipoAtaqueMod", item.ataqueMod || "FUE");
  asignarValorCampoEquipo("equipoAtaqueCompetencia", item.ataqueCompetencia || "auto");
  asignarValorCampoEquipo("equipoAtaqueBonificador", item.ataqueBonificador || 0);
  asignarValorCampoEquipo("equipoDanoMod", item.danoMod || "FUE");
  asignarValorCampoEquipo("equipoDanoDado", item.danoDado || "");
  asignarValorCampoEquipo("equipoDanoTipo", item.danoTipo || "");
  asignarValorCampoEquipo("equipoDanoCritico", item.danoCritico || "");
  asignarValorCampoEquipo("equipoDanoModSecundario", item.danoModSecundario || item.danoMod || "FUE");
  asignarValorCampoEquipo("equipoDanoDadoSecundario", item.danoDadoSecundario || "");
  asignarValorCampoEquipo("equipoDanoTipoSecundario", item.danoTipoSecundario || "");
  asignarValorCampoEquipo("equipoDanoCriticoSecundario", item.danoCriticoSecundario || "");
  asignarValorCampoEquipo("equipoDistancia", item.distancia || "");
  rellenarBonificacionesEquipoFormulario(item.bonificaciones || []);
}

function abrirPopupFormularioEquipo(tipo, item = null) {
  const config = CONFIG_EQUIPO[tipo] || CONFIG_EQUIPO.equipo;
  const biblioteca = obtenerBibliotecaPorTipoEquipo(tipo);
  const opcionesPlantilla = [`<option value="">— Crear desde cero —</option>`, ...biblioteca.map(objeto => `<option value="${textoSeguro(objeto.id)}">${textoSeguro(objeto.nombre)}</option>`)].join("");
  const opcionesSubtipo = config.subtipos.map(subtipo => `<option value="${textoSeguro(subtipo)}">${textoSeguro(subtipo)}</option>`).join("");
  const camposEspeciales = tipo === "arma" ? crearCamposArmaEquipo() : tipo === "armadura" ? crearCamposArmaduraEquipo() : "";
  const esEdicion = Boolean(item);
  const accionPrincipal = esEdicion
    ? `<button class="equipo-popup-accion" type="button" onclick="guardarCambiosItemEquipo('${tipo}', '${item.id}')">Aplicar Cambios</button>`
    : `<button class="equipo-popup-accion" type="button" onclick="crearItemEquipoDesdeFormulario('${tipo}')">Añadir</button>`;
  const accionEliminar = esEdicion
    ? `<button class="equipo-popup-accion equipo-boton-rojo" type="button" onclick="abrirPopupConfirmarEliminarEquipo('${item.id}')">Eliminar</button>`
    : "";

  abrirPopupEquipo(`${esEdicion ? "Editar" : "Añadir"} ${config.singular}`, `
    <div class="equipo-popup-campo">
      <label for="equipoPlantilla">Cargar rasgos desde datos.js</label>
      <select id="equipoPlantilla" onchange="aplicarPlantillaEquipo('${tipo}', this.value)">${opcionesPlantilla}</select>
    </div>
    <div class="equipo-popup-campo">
      <label for="equipoNombre">Nombre</label>
      <input id="equipoNombre" type="text" placeholder="Ej.: Espada larga">
    </div>
    <div class="equipo-popup-campo">
      <label for="equipoDescripcion">Caja con descripción</label>
      <textarea id="equipoDescripcion" rows="4" placeholder="Descripción del objeto"></textarea>
    </div>
    <div class="equipo-popup-fila">
      <div class="equipo-popup-campo">
        <label for="equipoPrecio">Precio</label>
        <input id="equipoPrecio" type="text" placeholder="Ej.: 15 gp">
      </div>
      <div class="equipo-popup-campo">
        <label for="equipoSubtipo">Subtipo</label>
        <select id="equipoSubtipo">${opcionesSubtipo}</select>
      </div>
    </div>
    ${camposEspeciales}
    <div class="equipo-popup-campo">
      <label for="equipoEfectos">Efectos correspondientes</label>      <textarea id="equipoEfectos" rows="3" placeholder="Ej.: 1d8 cortante, +1 CA, requiere sintonización..."></textarea>
    </div>
    <div class="equipo-popup-campo">
      <label for="equipoEtiquetas">Etiquetas</label>
      <input id="equipoEtiquetas" type="text" placeholder="Ligera, Arrojadiza, Una mano">
    </div>
    ${crearCamposBonificadoresEquipo()}
    <div class="equipo-popup-acciones equipo-popup-acciones-finales">
      ${accionEliminar}
      ${accionPrincipal}
    </div>
  `);

  if (item) rellenarFormularioEquipo(item);
}

function abrirPopupAgregarEquipo(tipo) {
  abrirPopupFormularioEquipo(tipo);
}

function abrirPopupEditarEquipo(itemId) {
  asegurarDatosEquipoPersonaje();
  const item = personajeActual.inventarioEquipo.find(objeto => objeto.id === itemId);
  if (!item) return;
  abrirPopupFormularioEquipo(item.tipo, item);
}

function abrirPopupConfirmarEliminarEquipo(itemId) {
  asegurarDatosEquipoPersonaje();
  const item = personajeActual.inventarioEquipo.find(objeto => objeto.id === itemId);
  if (!item) return;
  abrirPopupEquipo("Eliminar objeto", `
    <p class="equipo-confirmacion">¿Seguro deseas eliminar ${textoSeguro(item.nombre)}?</p>
    <div class="equipo-popup-acciones equipo-popup-acciones-finales">
      <button class="equipo-popup-accion equipo-boton-rojo" type="button" onclick="eliminarItemEquipo('${item.id}')">Eliminar</button>
      <button class="equipo-popup-accion" type="button" onclick="abrirPopupEditarEquipo('${item.id}')">Cancelar</button>
    </div>
  `);
}

function eliminarItemEquipo(itemId) {
  asegurarDatosEquipoPersonaje();
  personajeActual.inventarioEquipo = personajeActual.inventarioEquipo.filter(item => item.id !== itemId);
  personajeActual.sintonizados = normalizarListaIds(personajeActual.sintonizados).filter(id => id !== itemId);
  cerrarPopupEquipo();
  refrescarTrasCambioEquipo();
}

function esEscudoEquipo(item) {
  return item?.tipo === "armadura" && normalizarTextoCompetencia(item.subtipo || item.nombre).includes("escudo");
}

function aplicarReglasEquipoExclusivo(itemActualizado) {
  if (!itemActualizado?.equipado || itemActualizado.tipo !== "armadura" || esEscudoEquipo(itemActualizado)) return;
  personajeActual.inventarioEquipo = personajeActual.inventarioEquipo.map(item => (
    item.id !== itemActualizado.id && item.tipo === "armadura" && !esEscudoEquipo(item)
      ? { ...item, equipado: false }
      : item
  ));
}

function refrescarTrasCambioEquipo() {
  marcarPersonajeModificado();
  refrescarEstadisticasPersonaje();
  actualizarCA();
  renderAtaquesCombate();
  if (tabActivaId === "equipoBtn") renderEquipo();
}

function alternarEquipadoItem(itemId) {
  asegurarDatosEquipoPersonaje();
  const indice = personajeActual.inventarioEquipo.findIndex(item => item.id === itemId);
  if (indice < 0) return;

  const item = { ...personajeActual.inventarioEquipo[indice] };
  if (!["arma", "armadura"].includes(item.tipo)) return;
  item.equipado = !item.equipado;
  personajeActual.inventarioEquipo[indice] = item;
  aplicarReglasEquipoExclusivo(item);
  refrescarTrasCambioEquipo();
}

function abrirPopupSlotsSintonizacion() {
  asegurarDatosEquipoPersonaje();
  abrirPopupEquipo("Configurar sintonización", `
    <div class="equipo-popup-campo">
      <label for="sintonizacionSlotsInput">Cantidad de slots</label>
      <input id="sintonizacionSlotsInput" type="number" min="0" step="1" value="${personajeActual.sintonizacionSlots}">
    </div>
    <div class="equipo-popup-acciones">
      <button class="equipo-popup-accion" type="button" onclick="guardarSlotsSintonizacion()">Guardar</button>
    </div>
  `);
}

function guardarSlotsSintonizacion() {
  const cantidad = Math.max(0, Math.floor(Number(document.getElementById("sintonizacionSlotsInput")?.value)) || 0);
  personajeActual.sintonizacionSlots = cantidad;
  personajeActual.sintonizados = normalizarListaIds(personajeActual.sintonizados).slice(0, cantidad);
  marcarPersonajeModificado();
  cerrarPopupEquipo();
  renderEquipo();
}

function cambiarSintonizacionSlot(indice, itemId) {
  personajeActual.sintonizados[indice] = itemId;
  personajeActual.sintonizados = personajeActual.sintonizados.map(id => id || "").slice(0, personajeActual.sintonizacionSlots);
  marcarPersonajeModificado();
  renderEquipo();
}

function obtenerEquipoBiblioteca() {
  const items = [];
  const escudo = personajeActual.escudo
    ? libroDeReglasBasicas.equipo.find(item => item.id === personajeActual.escudo)
    : null;
  const armadura = personajeActual.armadura
    ? libroDeReglasBasicas.armaduras.find(item => item.id === personajeActual.armadura)
    : null;

  (personajeActual.equipo || []).forEach(id => {
    const item = libroDeReglasBasicas.equipo.find(objeto => objeto.id === id);
    if (item) items.push({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion || "Objeto del libro de reglas.",
      precio: item.precio || "—",
      tipo: item.tipo === "escudo" ? "armadura" : "equipo",
      subtipo: item.tipo === "escudo" ? "Escudo" : (item.subtipo || "Objeto"),
      efectos: item.bonifCA ? `+${item.bonifCA} CA` : "—",
      caBase: item.caBase || "",
      destrezaCA: detectarDestrezaArmadura(item),
      bonifCA: item.bonifCA || 0,
      etiquetas: item.etiquetas || []
    });
  });

  if (escudo) items.push({
    id: escudo.id,
    nombre: escudo.nombre,
    descripcion: escudo.descripcion || "Escudo equipado.",
    precio: escudo.precio || "—",
    tipo: "armadura",
    subtipo: "Escudo",
    efectos: escudo.bonifCA ? `+${escudo.bonifCA} CA` : "—",
    caBase: escudo.caBase || "",
    destrezaCA: "no",
    bonifCA: escudo.bonifCA || 0,
    etiquetas: escudo.etiquetas || []
  });

  if (armadura) items.push({
    id: armadura.id,
    nombre: armadura.nombre,
    descripcion: armadura.descripcion || "Armadura equipada.",
    precio: armadura.precio || "—",
    tipo: "armadura",
    subtipo: armadura.tipo || "Armadura",
    efectos: armadura.caBase ? `CA base ${armadura.caBase}` : "—",
    caBase: armadura.caBase || "",
    destrezaCA: detectarDestrezaArmadura(armadura),
    etiquetas: armadura.etiquetas || []
  });

  return items;
}

function obtenerTodosLosItemsEquipo() {
  asegurarDatosEquipoPersonaje();
  return [
    ...obtenerEquipoBiblioteca().map(item => ({ ...item, editable: false })),
    ...normalizarInventarioEquipo(personajeActual.inventarioEquipo).map(item => ({ ...item, editable: true }))
  ];
}

function describirDestrezaCA(valor) {
  if (valor === "max2") return "máx. +2";
  if (valor === "no") return "no usar destreza";
  return "utilizar destreza";
}

function obtenerModificadorStatEquipo(stat) {
  const valor = personajeConBonos?.[stat] ?? personajeActual?.[stat] ?? 10;
  return calcularModificadorNumero(Number(valor) || 10);
}

function obtenerBonificadorCAItem(item) {
  const bonosConfigurados = normalizarBonificacionesEquipo(item.bonificaciones)
    .filter(bono => ["bonoCA", "bonifCA"].includes(bono.tipoDeEfecto))
    .reduce((total, bono) => total + (Number(bono.valor) || 0), 0);
  return (Number(item.bonificadorExtra) || 0) + bonosConfigurados + (Number(item.bonifCA) || 0);
}

function obtenerModificadorCAArmadura(item) {
  if (item.destrezaCA === "no" || item.subtipo === "Escudo") return 0;
  const modDES = obtenerModificadorStatEquipo("DES");
  return item.destrezaCA === "max2" ? Math.min(modDES, 2) : modDES;
}

function obtenerFormulaCAEquipo(item) {
  const base = Number(item.caBase) || 0;
  const mod = obtenerModificadorCAArmadura(item);
  const bonificador = obtenerBonificadorCAItem(item);
  const total = base + mod + bonificador;
  if (!base && item.subtipo === "Escudo") return bonificador ? formatoValor(bonificador) : "—";
  const partes = [String(base || "—")];
  if (item.destrezaCA !== "no" && item.subtipo !== "Escudo") partes.push(`${formatoValor(mod)} (DES${item.destrezaCA === "max2" ? ", máx. +2" : ""})`);
  if (bonificador) partes.push(formatoValor(bonificador));
  return `${partes.join(" + ")}${base ? ` = ${total}` : ""}`;
}

function obtenerCompetenciasArmasPersonaje() {
  return clasesActivas.flatMap(slot => {
    const armas = slot.clase?.competencias?.armas;
    if (Array.isArray(armas)) return armas;
    if (Array.isArray(armas?.competencias)) return armas.competencias;
    return [];
  });
}

function personajeTieneCompetenciaArma(item) {
  const competencias = obtenerCompetenciasArmasPersonaje();
  const tipo = String(item.tipoArma || "").toLowerCase();
  if (tipo === "sencilla") return competencias.includes("armasSimples");
  if (tipo === "marcial") return competencias.includes("armasMarciales");
  return false;
}

function obtenerBonoCompetenciaAtaque(item) {
  const bonoCompetencia = calcularBonificadorCompetencia();
  if (item.ataqueCompetencia === "sin") return 0;
  if (item.ataqueCompetencia === "competencia") return bonoCompetencia;
  if (item.ataqueCompetencia === "pericia") return bonoCompetencia * 2;
  return personajeTieneCompetenciaArma(item) ? bonoCompetencia : 0;
}

function obtenerFormulaImpactoEquipo(item) {
  const stat = item.ataqueMod || "FUE";
  const mod = obtenerModificadorStatEquipo(stat);
  const competencia = obtenerBonoCompetenciaAtaque(item);
  const bonificador = Number(item.ataqueBonificador) || 0;
  const total = mod + competencia + bonificador;
  return `${formatoValor(total)} (${formatoValor(mod)} ${stat} + ${formatoValor(competencia)} comp. + ${formatoValor(bonificador)} bonif.)`;
}

function describirDanoEquipo(item, secundario = false) {
  const dado = secundario ? item.danoDadoSecundario : item.danoDado;
  const tipo = secundario ? item.danoTipoSecundario : item.danoTipo;
  const critico = secundario ? item.danoCriticoSecundario : item.danoCritico;
  const stat = secundario ? (item.danoModSecundario || item.danoMod || "FUE") : (item.danoMod || "FUE");
  if (!dado && !tipo && !critico) return "";
  const mod = obtenerModificadorStatEquipo(stat);
  return `${[dado, tipo].filter(Boolean).join(" ") || "—"} + ${formatoValor(mod)} (${stat})${critico ? ` · crítico ${critico}` : ""}`;
}

function obtenerArmasEquipadasCombate() {
  return normalizarInventarioEquipo(personajeActual.inventarioEquipo)
    .filter(item => item.tipo === "arma" && item.equipado);
}

function renderAtaquesCombate() {
  const contenedor = document.getElementById("ataquesCombateLista");
  if (!contenedor) return;

  const armasEquipadas = obtenerArmasEquipadasCombate();
  if (!armasEquipadas.length) {
    contenedor.innerHTML = `<p class="ataques-combate-vacio">No hay armas equipadas.</p>`;
    return;
  }

  contenedor.innerHTML = `
    <div class="ataque-combate-cabecera">
      <span>Nombre</span>
      <span>Impactar</span>
      <span>Daño</span>
    </div>
    ${armasEquipadas.map(arma => `
      <button class="ataque-combate-fila" type="button" onclick="abrirPopupAtaqueEquipo('${arma.id}')">
        <span>${textoSeguro(arma.nombre)}</span>
        <span>${textoSeguro(obtenerFormulaImpactoEquipo(arma).split(" ")[0])}</span>
        <span>${textoSeguro(describirDanoEquipo(arma) || "—")}</span>
      </button>
    `).join("")}
  `;
}

function abrirPopupAtaqueEquipo(itemId) {
  const arma = obtenerArmasEquipadasCombate().find(item => item.id === itemId);
  if (!arma) return;
  abrirPopupEquipo(`Ataque: ${arma.nombre}`, renderTarjetaEquipo({ ...arma, editable: false }));
}

function renderFilaDetalleEquipo(titulo, valor) {
  if (!valor) return "";
  return `
    <div class="equipo-detalle-fila">
      <span class="equipo-detalle-titulo">${textoSeguro(titulo)}</span>
      <span class="equipo-detalle-valor">${textoSeguro(valor)}</span>
    </div>
  `;
}

function renderCuadriculaDetallesEquipo(item, config) {
  const filas = [
    renderFilaDetalleEquipo("Precio", item.precio || "—"),
    renderFilaDetalleEquipo("Tipo", `${config.singular}${item.subtipo ? ` / ${item.subtipo}` : ""}`)
  ];

  if (item.tipo === "arma") {
    filas.push(renderFilaDetalleEquipo("Impacto", obtenerFormulaImpactoEquipo(item)));
    filas.push(renderFilaDetalleEquipo("Daño", describirDanoEquipo(item)));
    filas.push(renderFilaDetalleEquipo("Daño secundario", describirDanoEquipo(item, true)));
    if (item.distancia) filas.push(renderFilaDetalleEquipo("Distancia", item.distancia));
  }

  if (item.tipo === "armadura") {
    filas.push(renderFilaDetalleEquipo("CA", obtenerFormulaCAEquipo(item)));
  }

  return `<div class="equipo-detalles-grid">${filas.filter(Boolean).join("")}</div>`;
}

function renderBonificacionesEquipo(item) {
  const bonificaciones = normalizarBonificacionesEquipo(item.bonificaciones);
  if (!bonificaciones.length) return "";
  const etiquetasBonos = bonificaciones.map(bono => {
    const destino = bono.statAfectada || bono.habilidadAfectada || bono.categoria || "CA";
    const valor = bono.tipoDeEfecto === "competencia" ? bono.competencia : formatoValor(bono.valor);
    return `<span class="equipo-etiqueta">${textoSeguro(bono.tipoDeEfecto)} · ${textoSeguro(destino)} · ${textoSeguro(valor)}</span>`;
  }).join("");
  return `<div class="equipo-etiquetas equipo-bonos-lista"><strong>Otros bonificadores:</strong> ${etiquetasBonos}</div>`;
}

function renderAccionesItemEquipo(item) {
  const botonEquipado = item.editable && ["arma", "armadura"].includes(item.tipo)
    ? `<button class="equipo-mini-btn equipo-equipado-btn ${item.equipado ? "equipado" : "desequipado"}" type="button" onclick="alternarEquipadoItem('${item.id}')">${item.equipado ? "Equipado" : "Desequipado"}</button>`
    : "";
  const botonesEdicion = item.editable
    ? `<button class="equipo-mini-btn" type="button" onclick="abrirPopupEditarEquipo('${item.id}')">Editar</button>
      <button class="equipo-mini-btn equipo-boton-rojo" type="button" onclick="abrirPopupConfirmarEliminarEquipo('${item.id}')">Eliminar</button>`
    : "";
  if (!botonEquipado && !botonesEdicion) return "";
  
  return `
    <div class="equipo-item-acciones">
      ${botonesEdicion}
      ${botonEquipado}
    </div>
  `;
}

function renderTarjetaEquipo(item) {
  const etiquetas = (item.etiquetas || []).map(etiqueta => `<span class="equipo-etiqueta">${textoSeguro(etiqueta)}</span>`).join("");
  const config = CONFIG_EQUIPO[item.tipo] || CONFIG_EQUIPO.equipo;

  return `
    <article class="equipo-item ${item.editable && ["arma", "armadura"].includes(item.tipo) && !item.equipado ? "equipo-item-desequipado" : ""}">      <div class="equipo-item-cabecera">
        <strong>${textoSeguro(item.nombre)}</strong>
        <span class="equipo-tipo">${textoSeguro(config.singular)}${item.subtipo ? ` · ${textoSeguro(item.subtipo)}` : ""}</span>
      </div>
      <p class="equipo-descripcion">${textoSeguro(item.descripcion || "Sin descripción.")}</p>
      ${renderCuadriculaDetallesEquipo(item, config)}
      <p class="equipo-efectos"><strong>Efectos:</strong> ${textoSeguro(item.efectos || "—")}</p>
      ${renderBonificacionesEquipo(item)}
      <div class="equipo-etiquetas">${etiquetas || `<span class="equipo-etiqueta">Sin etiquetas</span>`}</div>
      ${renderAccionesItemEquipo(item)}
      </article>
  `;
}

function renderSeccionEquipo(tipo, items) {
  const config = CONFIG_EQUIPO[tipo];
  const contenido = items.length
    ? items.map(renderTarjetaEquipo).join("")
    : `<p class="equipo-vacio">No hay ${config.titulo.toLowerCase()} registrados.</p>`;

  return `
    <details class="equipo-seccion" open>
      <summary>
        <button class="equipo-add-btn" type="button" onclick="event.preventDefault(); abrirPopupAgregarEquipo('${tipo}')" aria-label="Añadir ${config.singular}">+</button>
        <span class="equipo-seccion-titulo">${config.titulo}</span>
        <small>${items.length}</small>
      </summary>
      <div class="equipo-lista">${contenido}</div>
    </details>
  `;
}

function renderSintonizacion(items) {
  asegurarDatosEquipoPersonaje();
  const opcionesBase = `<option value="">— Sin objeto —</option>` + items
    .map(item => `<option value="${textoSeguro(item.id)}">${textoSeguro(item.nombre)}</option>`)
    .join("");

  const slots = Array.from({ length: personajeActual.sintonizacionSlots }, (_, indice) => {
    const seleccionado = personajeActual.sintonizados[indice] || "";
    return `
      <div class="sintonizacion-slot">
        <label for="sintonizacionSlot${indice}">Slot ${indice + 1}</label>
        <select id="sintonizacionSlot${indice}" onchange="cambiarSintonizacionSlot(${indice}, this.value)">
          ${opcionesBase.replace(`value="${textoSeguro(seleccionado)}"`, `value="${textoSeguro(seleccionado)}" selected`)}
        </select>
      </div>
    `;
  }).join("");

  return `
    <div class="sintonizacion-cabecera">
      <h3>Sintonización</h3>
      <button class="sintonizar-config-btn" type="button" onclick="abrirPopupSlotsSintonizacion()">Configurar slots</button>
    </div>
    ${personajeActual.sintonizacionSlots > 0 ? `<div class="sintonizacion-slots">${slots}</div>` : `<p class="sintonizacion-vacio">No hay slots de sintonización configurados.</p>`}
  `;
}

function renderEquipo() {
  asegurarDatosEquipoPersonaje();
  const items = obtenerTodosLosItemsEquipo();
  const itemsPorTipo = {
    arma: items.filter(item => item.tipo === "arma"),
    armadura: items.filter(item => item.tipo === "armadura"),
    equipo: items.filter(item => item.tipo !== "arma" && item.tipo !== "armadura")
  };

  panelVentanas.innerHTML = `
    <h2 class="titulo-panel">Equipo</h2>
    <div class="equipo-dashboard">
      <div class="equipo-cajas-centrales">
        <section class="equipo-caja-central">
          <h3>Monedas</h3>
          <div class="monedas-grid">
            ${MONEDAS_DND.map(moneda => `
              <button class="moneda-btn" type="button" onclick="abrirPopupMoneda('${moneda.id}')">
                <span class="moneda-cantidad">${obtenerCantidadMoneda(moneda.id)}</span>
                <span class="moneda-nombre">${moneda.nombre} (${moneda.etiqueta})</span>
              </button>
            `).join("")}
          </div>
        </section>
        <section class="equipo-caja-central">
          <h3>Equipamento</h3>
          ${renderSeccionEquipo("arma", itemsPorTipo.arma)}
          ${renderSeccionEquipo("armadura", itemsPorTipo.armadura)}
          ${renderSeccionEquipo("equipo", itemsPorTipo.equipo)}
        </section>
        <section class="equipo-caja-central">
          ${renderSintonizacion(items)}
        </section>
      </div>
    </div>
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
  actualizarDetalleCompetencia();
  document.getElementById("BC").innerText = formatoValor(calcularBonificadorCompetencia());  if (selectorNivelPersonaje) selectorNivelPersonaje.value = String(personajeActual.nivel);
}

function refrescarFichaTrasBuild() {
  recalcularClasesDesdeProgresion();
  refrescarEstadisticasPersonaje();
  actualizarResumenPersonaje();
  actualizarPuntosGolpe();
  if (typeof actualizarVelocidad === "function") actualizarVelocidad();
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