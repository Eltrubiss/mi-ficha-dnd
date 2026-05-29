const personajePorDefecto = {
  nombre: "Sin nombre",
  raza: "humano",
  clase: "guerrero",
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
  inspiracion: false
};

const personajeActual = window.personajeActual || personajePorDefecto;

let personajeConBonos = { ...personajeActual };

const detalleEstadisticas = {
  PG: { total: 0, items: [] },
  Velocidad: { total: 0, items: [] },
  Iniciativa: { total: 0, items: [] },
  CA: { total: 0, items: [] }
};

let claseElegida = libroDeReglas.clases.find(c => c.id === personajeActual.clase);
let razaElegida = libroDeReglas.razas.find(r => r.id === personajeActual.raza.toLowerCase());
let armaduraElegida = libroDeReglas.armaduras.find(a => a.id === personajeActual.armadura);

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

const bonifCompetencia = Math.ceil(1 + (personajeActual.nivel / 4)); // Bonificador de competencia
// Agregar Bonos de Raza

function aplicarBonosDeRasgosDeRaza(personaje, raza) {
if (!raza || !Array.isArray(raza.rasgos)) return;

raza.rasgos.forEach(rasgo => {
    if (!Array.isArray(rasgo.efectos)) return;

    rasgo.efectos.forEach(efecto => {
        if (efecto.tipoDeEfecto === "bono_stat") {
            let stat = efecto.statAfectada;
            let valor = Number(efecto.valor);

            if (stat && typeof personaje[stat] === "number" && !Number.isNaN(valor)) {
                personaje[stat] += valor;
            }
        }
    });
});
}
if (razaElegida) {
aplicarBonosDeRasgosDeRaza(personajeConBonos, razaElegida);
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
document.getElementById("info-personaje").innerText = personajeActual.raza + ", " + personajeActual.clase + " " + personajeActual.nivel;
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

function sumaDeEfectos(tipo, entidades, estado) {
  return entidades
    .flatMap(entidad => entidad?.rasgos || [])
    .flatMap(rasgo => rasgo.efectos || [])
    .filter(efecto => efecto.tipoDeEfecto === tipo)
    .filter(efecto => seCumpleCondicion(efecto.condicion, estado))
    .reduce((total, efecto) => {
      let valor = Number(efecto.valor);
      return total + (Number.isFinite(valor) ? valor : 0);
    }, 0);
}
function buscarEfecto(entidad, tipo) {
  if (!entidad || !Array.isArray(entidad.rasgos)) return undefined;
  return entidad.rasgos
    .flatMap(rasgo => rasgo.efectos || [])
    .find(efecto => efecto.tipoDeEfecto === tipo);
}

const efectos = [claseElegida, razaElegida];
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
    { origen: claseElegida.nombre || "Clase", valor: dado, descripcion: "Dado de golpe" },
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
    let efectoCa = buscarEfecto(claseElegida, "caSinArmadura")
      || buscarEfecto(razaElegida, "caSinArmadura");

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
    .map(id => libroDeReglas.equipo.find(item => item.id === id))
    .reduce((sum, item) => sum + (item?.bonifCA || 0), 0);
    let nombres = [...equipo.map(id => {
      const item = libroDeReglas.equipo.find(e => e.id === id);
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

function renderCompetencias() {
  const clase = libroDeReglas.clases.find(c => c.id === personajeActual.clase);
  const BC = Math.ceil(1 + (personajeActual.nivel / 4)); // Bonificador de competencia

  // ── Stats base del personaje con bonos de raza ya aplicados ──
  const stats = {
    FUE: personajeConBonos.FUE, DES: personajeConBonos.DES,
    CON: personajeConBonos.CON, INT: personajeConBonos.INT,
    SAB: personajeConBonos.SAB, CAR: personajeConBonos.CAR,
  };

  // ── Bloque 1: Tiradas de Salvación ──
  // Cada clase define en qué stats es competente para salvaciones
  const salvacionesCompetentes = clase?.competencias?.salvaciones ?? [];

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

  // Las habilidades competentes vienen de la clase y la raza
  const habilidadesCompetentes = [
    ...(clase?.competencias?.habilidades ?? []),
    ...(razaElegida?.competencias?.habilidades ?? []),
  ];

  const habilidadesHTML = HABILIDADES.map(({ nombre, stat }) => {
    const esCompetente = habilidadesCompetentes.includes(nombre);
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
  const armas        = clase?.competencias?.armas        ?? "—";
  const armaduras    = clase?.competencias?.armaduras    ?? "—";
  const herramientas = clase?.competencias?.herramientas ?? "—";
  const idiomas      = [
    ...(razaElegida?.idiomas ?? []),
    ...(clase?.competencias?.idiomas ?? []),
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

function renderRasgos() {
  const raza  = libroDeReglas.razas.find(r => r.id === personajeActual.raza.toLowerCase());
  const clase = libroDeReglas.clases.find(c => c.id === personajeActual.clase);

  const rasgosClase = (clase?.rasgos ?? [])
    .filter(r => !r.nivelClase || r.nivelClase <= personajeActual.nivel);

  function tarjetaRasgo(r) {
    // Escapamos las comillas para pasar los datos al onclick sin romper el HTML
    const nombre = (r.nombre ?? "").replace(/'/g, "\\'");
    const desc   = (r.descripcion ?? "").replace(/'/g, "\\'");
    const nivel  = r.nivelClase ?? 0;

    return `
      <div class="rasgo-item clickable"
           onclick="abrirPopupRasgo('${nombre}', ${nivel}, '${desc}')">
        <div class="rasgo-fila">
          <p class="rasgo-nombre">${r.nombre}</p>
          ${r.nivelClase
            ? `<span class="rasgo-nivel-badge">Nv ${r.nivelClase}</span>`
            : ""}
        </div>
        ${r.descripcion
          ? `<p class="rasgo-desc">${r.descripcion}</p>`
          : ""}
      </div>`;
  }
  function abrirPopupRasgo(titulo, nivel, descripcion) {
    const contenido = document.getElementById("popup-rasgo-contenido");
    const entradas = titulo ? [[titulo + (nivel ? ` (Nivel ${nivel})` : ""), { items: [{ origen: "Descripción", valor: descripcion, descripcion: "" }] }]] : [];
        contenido.innerHTML = entradas
            .map(([titulo, data]) => {
                const itemsHtml = data.items.length
                    ? data.items.map(item => `
                        <div class="popup-item">
                            <strong>${item.origen}</strong>: ${item.valor}
                        </div>
                    `).join("")
                    : "<p>No hay descripción disponible.</p>";
            
                return `
                    <section class="popup-seccion">
                        <h3>${titulo}</h3>
                        ${itemsHtml}
                    </section>
                `;
            })
    document.getElementById("popup-rasgo").classList.remove("oculto");
    }

  function seccionRasgos(titulo, rasgos) {
    if (!rasgos || rasgos.length === 0) return "";
    return `
      <div class="rasgos-seccion">
        <h3 class="rasgos-titulo">${titulo}</h3>
        ${rasgos.map(tarjetaRasgo).join("")}
      </div>`;
    }

  panelVentanas.innerHTML = `
    <h2 class="titulo-panel">Rasgos</h2>
    ${seccionRasgos((raza?.nombre ?? ""), raza?.rasgos)}
    ${seccionRasgos((clase?.nombre ?? ""), rasgosClase)}
  `;
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
    .map(id => libroDeReglas.equipo.find(e => e.id === id))
    .filter(Boolean);

  const escudo = escudoId
    ? libroDeReglas.equipo.find(e => e.id === escudoId)
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

    // Renderizar el contenido correspondiente
    renderFn();
  });
});

// ── Mostrar la primera pestaña por defecto ─────
document.getElementById("competenciasBtn")?.click();