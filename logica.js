const personajePorDefecto = {
  nombre: "Sin nombre",
  raza: "humano",
  subraza: "",
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
  eleccionesRasgos: {}
};

const personajeActual = window.personajeActual || personajePorDefecto;

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

function aplicarBonosDeRasgosDeRaza() {
    // --- 1. APLICAMOS BONOS DE LA RAZA PRINCIPAL ---
    if (razaElegida && razaElegida.rasgos) {
        razaElegida.rasgos.forEach(rasgo => {
            if (rasgo.efectos) {
                rasgo.efectos.forEach(efecto => {
                    if (efecto.tipoDeEfecto === "bono_stat") {
                        // Sumamos el valor a la estadística del personaje (soportando ambas nomenclaturas)
                        personajeConBonos[efecto.statAfectada] += (efecto.valor || efecto.valorDelBono || 0);
                    }
                });
            }
        });
    }

    // --- ¡LO NUEVO! 2. APLICAMOS BONOS DE LA SUBRAZA ---
    if (subrazaElegida && subrazaElegida.rasgos) {
        subrazaElegida.rasgos.forEach(rasgo => {
            if (rasgo.efectos) {
                rasgo.efectos.forEach(efecto => {
                    if (efecto.tipoDeEfecto === "bono_stat") {
                        // Hacemos exactamente lo mismo: sumar a la estadística
                        personajeConBonos[efecto.statAfectada] += (efecto.valor || efecto.valorDelBono || 0);
                    }
                });
            }
        });
    }
}
if (razaElegida) {
aplicarBonosDeRasgosDeRaza();
}

document.getElementById("FUE").innerText = personajeConBonos.FUE;
document.getElementById("DES").innerText = personajeConBonos.DES;
document.getElementById("CON").innerText = personajeConBonos.CON;
document.getElementById("INT").innerText = personajeConBonos.INT;
document.getElementById("SAB").innerText = personajeConBonos.SAB;
document.getElementById("CAR").innerText = personajeConBonos.CAR;

document.getElementById("mod-FUE").innerText = calcularModificador(personajeConBonos.FUE);
document.getElementById("mod-DES").innerText = calcularModificador(personajeConBonos.DES);
document.getElementById("mod-CON").innerText = calcularModificador(personajeConBonos.CON);
document.getElementById("mod-INT").innerText = calcularModificador(personajeConBonos.INT);
document.getElementById("mod-SAB").innerText = calcularModificador(personajeConBonos.SAB);
document.getElementById("mod-CAR").innerText = calcularModificador(personajeConBonos.CAR);
///////////////////////////////////////////////////////////////////
document.getElementById("nombre-personaje").innerText = personajeActual.nombre;
document.getElementById("info-personaje").innerText = personajeActual.raza + ", " + personajeActual.clase1 + " " + personajeActual.nivel;
document.getElementById("BC").innerText = "+" + bonifCompetencia;

let modFUE = calcularModificadorNumero(personajeConBonos.FUE);
let modDES = calcularModificadorNumero(personajeConBonos.DES);
let modCON = calcularModificadorNumero(personajeConBonos.CON);
let modINT = calcularModificadorNumero(personajeConBonos.INT);
let modSAB = calcularModificadorNumero(personajeConBonos.SAB);
let modCAR = calcularModificadorNumero(personajeConBonos.CAR);

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
    if (efectoEncontrado) return efectoEncontrado; // Si lo halló en la subraza, lo devuelve

    return efectoEncontrado;
}


const efectos = [claseElegida, razaElegida, subrazaElegida].filter(Boolean);
const equipo = [...(personajeConBonos.equipo || []), personajeConBonos.escudo].filter(Boolean);
const bonoVelocidad = sumaDeEfectos("velocidad", efectos, estado);
const bonoCARaza = sumaDeEfectos("bonoCA", efectos, estado);
const bonoIniciativa = sumaDeEfectos("iniciativa", efectos, estado);
const iniciativaTotal = modDES + bonoIniciativa;

///////////////////// CÁLCULO DE PUNTOS DE GOLPE /////////////////////
if (claseElegida) {
  let dado = claseElegida.dadoDeGolpe;
  let puntosDeGolpe = dado + (modCON * personajeConBonos.nivel);

  detalleEstadisticas.PG.total = puntosDeGolpe;
  if (typeof personajeActual.hpActual !== "number") {
    personajeActual.hpActual = puntosDeGolpe;
  }
  personajeActual.hpActual = Math.min(personajeActual.hpActual, puntosDeGolpe);
  detalleEstadisticas.PG.items.push(
    { origen: claseElegida.nombre || "clase1", valor: dado, descripcion: "Dado de golpe" },
    { origen: "Modificador de Constitución", valor: modCON, descripcion: "CON final" }
  );

  document.getElementById("PG").innerText = puntosDeGolpe;
}
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
}
function guardarEstadoVida() {
  const estado = {
    hpActual: personajeActual.hpActual,
    hpTemporales: personajeActual.hpTemporales,
    inspiracion: personajeActual.inspiracion
  };
  localStorage.setItem("creadorDndPersonaje", JSON.stringify(estado));
}
function aplicarCuracion(valor) {
  const hpMax = detalleEstadisticas.PG.total;
  personajeActual.hpActual = Math.min(
    hpMax,
    personajeActual.hpActual + valor
  );
  guardarEstadoVida();
  renderVida();
}

function aplicarDano(valor) {
  let restante = Math.max(0, valor);

  if (personajeActual.hpTemporales > 0) {
    const absorbidoTemporales = Math.min(personajeActual.hpTemporales, restante);
    personajeActual.hpTemporales -= absorbidoTemporales;
    restante -= absorbidoTemporales;
  }

  personajeActual.hpActual = Math.max(0, personajeActual.hpActual - restante);
  guardarEstadoVida();
  renderVida();
}

function aplicarTemporales(valor) {
  personajeActual.hpTemporales = Math.max(0, valor);
  guardarEstadoVida();
  renderVida();
}

function alternarInspiracion() {
  personajeActual.inspiracion = !personajeActual.inspiracion;
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

const savedState = JSON.parse(localStorage.getItem("creadorDndPersonaje") || "{}");
personajeActual.hpActual = savedState.hpActual ?? personajeActual.hpActual;
personajeActual.hpTemporales = savedState.hpTemporales ?? personajeActual.hpTemporales;
personajeActual.inspiracion = savedState.inspiracion ?? personajeActual.inspiracion;

renderVida();
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
        idsElegidas.forEach(id => {
          const opcion = (seleccion.opciones || []).find(item => item.id === id);
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
    ...obtenerRasgosDeClasesDisponibles()
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
                    <summary class="desplegable-titulo">Clase ${slot.numeroSlot}: ${slot.clase.nombre} ${slot.nivel}</summary>
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

  const opcionesHTML = (seleccion.opciones || []).map(opcion => {
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

  document.getElementById("popup-rasgo-contenido").innerHTML = `
    <div style="text-align:left;">
      <h3 style="color:#5a4035; margin:0 0 10px; border-bottom:2px solid #5a4035; padding-bottom:8px; font-family:Georgia, serif; font-size:22px;">
        ${textoSeguro(seleccion.nombre)}
      </h3>
      <p style="color:#6b5a53; margin:0 0 12px;">${textoSeguro(seleccion.descripcion || rasgo.nombre || "Selecciona opciones")}</p>
      <div class="build-popup-contador">
        Puedes marcar ${seleccion.cantidadSeleccionable} ${textoSeguro(textoTipoSeleccion(seleccion))}. Restantes: ${restantes}
      </div>
      <div class="build-popup-opciones">
        ${opcionesHTML || `<p style="color:#6b5a53;">No hay opciones cargadas todavía.</p>`}
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

  personajeActual.eleccionesRasgos[clave] = nuevas;
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

const vistaPersonaje = document.getElementById("vistaPersonaje");
const vistaBuild = document.getElementById("vistaBuild");
const btnVistaBuild = document.getElementById("btnVistaBuild");
const btnVistaPersonaje = document.getElementById("btnVistaPersonaje");
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
    const opciones = (seleccion.opciones || []).map(opcion => opcion.nombre).join(", ");

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
    .map(id => (seleccion.opciones || []).find(opcion => opcion.id === id)?.nombre)
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
    : `<small>${textoSeguro((seleccion.opciones || []).map(opcion => opcion.nombre).join(", "))}</small>`;
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
            <div class="build-rasgos-columna">
        ${renderSeccionRasgosBuild(`Raza: ${razaElegida?.nombre || "—"}`, rasgosRaza, "raza")}
        ${renderSeccionRasgosBuild(`Subraza: ${subrazaElegida?.nombre || "—"}`, rasgosSubraza, "subraza")}
        ${renderSeccionRasgosBuild(`Clase: ${nombreClase}`, rasgosClase, "clase1")}
      </div>
    </section>
  `;
}

function renderNivelClaseBuild(nivel) {
  const rasgos = obtenerRasgosClasePorNivel(nivel);
    const nombreClase = clasesActivas[0]?.clase?.nombre || "Clase";

  return `
    <section class="build-nivel ${personajeActual.nivel === nivel ? "actual" : ""}">
      <h3>Nivel ${nivel}</h3>
      <div class="build-rasgos-columna">
        ${rasgos.length
          ? renderSeccionRasgosBuild(`Clase: ${nombreClase}`, rasgos, "clase1")
          : `<span class="build-rasgo">Pendiente de cargar rasgos para este nivel</span>`}
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
  const razaNombre = razaElegida?.nombre || personajeActual.raza || "Raza";
  const claseNombre = claseElegida?.nombre || personajeActual.clase1 || "Clase";
  document.getElementById("nombre-personaje").innerText = personajeActual.nombre || "Sin nombre";
  document.getElementById("info-personaje").innerText = `${razaNombre}, ${claseNombre} ${personajeActual.nivel}`;
  document.getElementById("BC").innerText = `+${Math.ceil(1 + (personajeActual.nivel / 4))}`;
}

function conectarControlesBuild() {
  document.getElementById("buildNombre")?.addEventListener("input", event => {
    personajeActual.nombre = event.target.value;
    actualizarResumenPersonaje();
  });

  document.getElementById("buildRaza")?.addEventListener("change", event => {
    personajeActual.raza = event.target.value;
    razaElegida = libroDeReglasBasicas.razas.find(r => r.id === personajeActual.raza);
    personajeActual.subraza = "";
    subrazaElegida = null;
    actualizarResumenPersonaje();
    renderBuildPersonaje();
  });

  document.getElementById("buildSubraza")?.addEventListener("change", event => {
    personajeActual.subraza = event.target.value;
    subrazaElegida = razaElegida?.subrazas?.find(s => s.id === personajeActual.subraza) || null;
    renderBuildPersonaje();
  });

  document.getElementById("buildClase")?.addEventListener("change", event => {
    personajeActual.clase1 = event.target.value;
    claseElegida = libroDeReglasBasicas.clases.find(c => c.id === personajeActual.clase1);
    actualizarResumenPersonaje();
    renderBuildPersonaje();
  });
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

selectorNivelPersonaje?.addEventListener("change", event => {
  const nuevoNivel = Number(event.target.value);
  personajeActual.nivel = nuevoNivel;
  personajeActual.nivelClase1 = nuevoNivel;
  personajeConBonos.nivel = nuevoNivel;
  actualizarResumenPersonaje();
  renderBuildPersonaje();
});

btnVistaBuild?.addEventListener("click", () => cambiarVistaPersonaje("build"));
btnVistaPersonaje?.addEventListener("click", () => cambiarVistaPersonaje("personaje"));

crearOpcionesNivel();
actualizarResumenPersonaje();
renderBuildPersonaje();