(function(){
  const STORAGE_KEY = 'miFichaLibroReglas_v2';

  function genId(){ return 'lb_' + Math.random().toString(36).slice(2,9); }

  function crearLibroVacio(){
    return { id: genId(), nombre: 'Reglas básicas', descripcion:'', razas: [], opcionesCompartidas: {}, categorias: { rasgos: [], dotes: [], equipo: [], estados: [] }, clases: {} };
  }

  function convertirDesdeDatos(d){
    const libro = { id: 'basicas', nombre: d.nombre || 'Reglas básicas', descripcion: d.descripcion || d.resumen || 'Consulta las reglas disponibles para construir personajes, revisar opciones de juego y encontrar equipo de forma rápida.', razas: [], opcionesCompartidas: d.opcionesCompartidas || {}, categorias: { rasgos: [], dotes: [], equipo: [], estados: [] }, clases: {} };
    if(Array.isArray(d.razas)){
      libro.razas = d.razas;
      d.razas.forEach(r=>{
        (r.rasgos||[]).forEach(rr=>{
          libro.categorias.rasgos.push({ nombre: rr.nombre || rr.titulo || 'Sin nombre', descripcion: rr.descripcion || rr.descripcionResum || '', fuente: r.nombre || r.id || '' });
        });
      });
    }
    if(Array.isArray(d.clases)){
      d.clases.forEach(c=>{
        libro.clases[c.nombre || c.id || ('clase_' + Math.random().toString(36).slice(2,8))] = c;
      });
    }
    if(Array.isArray(d.equipo)) libro.categorias.equipo = d.equipo.map(it=>({ ...it, nombre: it.nombre, descripcion: it.descripcion || it.efectos || '' }));
    if(Array.isArray(d.dotes)) libro.categorias.dotes = d.dotes.map(it=>({ ...it, nombre: it.nombre, descripcion: it.descripcion||'' }));
    if(Array.isArray(d.estados)) libro.categorias.estados = d.estados.map(it=>({ ...it, nombre: it.nombre, descripcion: it.descripcion||'' }));
    return libro;
  }

  const _stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if(!_stored && typeof libroDeReglasBasicas !== 'undefined'){
    window.libroReglas = [ convertirDesdeDatos(libroDeReglasBasicas) ];
  } else {
    window.libroReglas = _stored || [ crearLibroVacio() ];
  }

  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(window.libroReglas)); }
  function el(id){ return document.getElementById(id); }
  function escapeHtml(s){ return String(s||'').replace(/[&<>\"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function textoResumen(item){ return item?.descripcionResum || item?.resumen || item?.descripcion || item?.efectos || 'Sin descripción.'; }
  function descripcionHtml(item){ return item?.descripcion || item?.descripcionResum || item?.resumen || item?.efectos || '<em>Sin descripción.</em>'; }
  function normalizarTexto(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  const btnAbrir = el('btnLibroReglas');
  const modal = el('modal-reglas');
  const cerrar = el('modalReglasCerrar');
  const categoriaBtns = Array.from(document.querySelectorAll('.categoria-btn'));
  const listaContenedor = el('reglas-lista');
  const tituloForm = el('reglas-form-titulo');
  const inpNombre = el('regla-nombre');
  const inpDesc = el('regla-descripcion');
  const inpFuente = el('regla-fuente');
  const selCategoria = el('regla-categoria');
  const btnAgregar = el('btnAgregarRegla');
  const btnExportar = el('btnExportarReglas');
  const btnImportar = el('btnImportarReglas');
  const librosLista = el('libros-lista');
  const btnNuevoLibro = el('btnNuevoLibro');
  const reglasFormEl = document.querySelector('.reglas-form');
  const abrirLibroBtn = el('abrirLibroReglasBtn');

  let categoriaActiva = 'rasgos';
  let libroSeleccionadoId = window.libroReglas[0].id;
  let screenStack = [{ type:'home' }];
  let editMode = false;
  let editState = null;

  function currentScreen(){ return screenStack[screenStack.length-1]; }
  function goHome(){ screenStack = [{ type:'home' }]; renderCurrentScreen(); }
  function pushScreen(state){ screenStack.push(state); renderCurrentScreen(); }
  function popScreen(){ if(screenStack.length>1){ screenStack.pop(); } renderCurrentScreen(); }

  function currentLibro(){
    const libro = window.libroReglas.find(x=>x.id===libroSeleccionadoId) || window.libroReglas[0];
    if(!libro) return null;
    libro.categorias = libro.categorias || { rasgos: [], dotes: [], equipo: [], estados: [] };
    libro.clases = libro.clases || {};
    libro.opcionesCompartidas = libro.opcionesCompartidas || (typeof libroDeReglasBasicas !== 'undefined' ? libroDeReglasBasicas.opcionesCompartidas || {} : {});
    if(!Array.isArray(libro.razas) && typeof libroDeReglasBasicas !== 'undefined' && Array.isArray(libroDeReglasBasicas.razas)) libro.razas = libroDeReglasBasicas.razas;
    libro.razas = libro.razas || [];
    return libro;
  }

  function slugifyId(texto, fallback='item'){
    const base = normalizarTexto(texto)
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return base || `${fallback}_${Date.now().toString(36)}`;
  }

  function crearIdUnico(base, existe){
    let candidato = base;
    let contador = 2;
    while(existe(candidato)){
      candidato = `${base}_${contador}`;
      contador += 1;
    }
    return candidato;
  }

  function obtenerListaSubclasesEditable(clase){
    if(!clase) return [];
    if(Array.isArray(clase.subclase)) return clase.subclase;
    if(Array.isArray(clase.subclases)){ clase.subclase = clase.subclases; return clase.subclase; }
    clase.subclase = [];
    return clase.subclase;
  }

  function abrirEditorRegla(config){
    pushScreen({ type:'editor', ...config });
  }

  function crearBotonAccionEdicion(label, onClick){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reglas-edit-action';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderAccionesEdicion(actions=[]){
    if(!editMode || !actions.length) return null;
    const wrap = document.createElement('div');
    wrap.className = 'reglas-edit-actions';
    actions.forEach(action=> wrap.appendChild(crearBotonAccionEdicion(action.label, action.onClick)));
    return wrap;
  }

  function renderCurrentScreen(){
    const screen = currentScreen();
    if(screen.type==='home') renderLibroMenu();
    else if(screen.type==='categoria') renderCategoria(screen.cat);
    else if(screen.type==='clases') renderClassList(screen.query || '');
    else if(screen.type==='razas') renderRaceList(screen.query || '');
    else if(screen.type==='claseDetail') renderClaseDetail(screen.classId, screen.tab||'rasgos');
    else if(screen.type==='razaDetail') renderRazaDetail(screen.raceId, screen.tab||'rasgos');
    else if(screen.type==='subclaseDetail') renderSubclaseDetail(screen.classId, screen.subclaseId, screen.tab||'rasgos');
    else if(screen.type==='subrazaDetail') renderSubrazaDetail(screen.raceId, screen.subraceId, screen.tab||'rasgos');
    else if(screen.type==='rasgoDetail') renderRasgoDetail(screen.parentTitle, screen.rasgos || [], screen.rasgoIndex);
    else if(screen.type==='itemDetail') renderItemDetail(screen.cat, screen.itemId);
    else if(screen.type==='editor') renderEditor(screen);
  }

  function abrirModal(){ modal.classList.remove('oculto'); renderLibros(); goHome(); }
  function cerrarModal(){ modal.classList.add('oculto'); }

  if(btnAbrir) btnAbrir.addEventListener('click', abrirModal);
  if(cerrar) cerrar.addEventListener('click', cerrarModal);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) cerrarModal(); });
  if(abrirLibroBtn) abrirLibroBtn.addEventListener('click', ()=>{ window.openLibroReglas(window.libroReglas[0] && window.libroReglas[0].id); });

  categoriaBtns.forEach(b=> b.addEventListener('click', ()=>{
    categoriaActiva = b.dataset.categoria;
    categoriaBtns.forEach(x=>x.classList.toggle('active', x===b));
    if(categoriaActiva === 'clases') pushScreen({ type:'clases' });
    else if(categoriaActiva === 'razas') pushScreen({ type:'razas' });
    else pushScreen({ type:'categoria', cat:categoriaActiva });
  }));

  if(btnNuevoLibro) btnNuevoLibro.addEventListener('click', ()=>{
    const nombre = prompt('Nombre del nuevo libro:','Nuevo libro'); if(!nombre) return;
    const nuevo = { id: genId(), nombre: nombre.trim(), descripcion: '', razas: [], opcionesCompartidas: {}, categorias: { rasgos: [], dotes: [], equipo: [], estados: [] }, clases: {} };
    window.libroReglas.push(nuevo); save(); renderLibros(); selectLibro(nuevo.id);
  });

  function actualizarControlesEdicion(){
    try{
      if(btnNuevoLibro) btnNuevoLibro.style.display = editMode ? '' : 'none';
      if(btnExportar) btnExportar.style.display = editMode ? '' : 'none';
      if(btnImportar) btnImportar.style.display = editMode ? '' : 'none';
      if(reglasFormEl) reglasFormEl.style.display = 'none';
      document.querySelectorAll('.categoria-btn').forEach(b=> b.style.display = 'none');
    }catch(e){}
  }

  actualizarControlesEdicion();

  function selectLibro(id){ libroSeleccionadoId = id; renderLibros(); renderCurrentScreen(); }

  function renderLibros(){
    if(!librosLista) return;
    librosLista.innerHTML='';
    window.libroReglas.forEach(lb=>{
      const div = document.createElement('div'); div.className='libro-item'; if(lb.id===libroSeleccionadoId) div.classList.add('active');
      const span = document.createElement('span'); span.textContent = lb.nombre; div.appendChild(span);
      const actions = document.createElement('div');
      const btnSel = document.createElement('button'); btnSel.textContent='Abrir'; btnSel.addEventListener('click', ()=> selectLibro(lb.id));
      actions.appendChild(btnSel); div.appendChild(actions);
      span.addEventListener('click', ()=>{ selectLibro(lb.id); });
      librosLista.appendChild(div);
    });
  }

  window.openLibroReglas = function(id){ if(id) libroSeleccionadoId = id; abrirModal(); };

  function renderSubmenuHeader(title, subtitle){
    const header = document.createElement('div'); header.className = 'submenu-header';
    const back = document.createElement('button'); back.className = 'submenu-back'; back.textContent = '← Volver'; back.addEventListener('click', popScreen);
    const titulos = document.createElement('div'); titulos.className = 'submenu-titulos';
    const titulo = document.createElement('h3'); titulo.textContent = title;
    titulos.appendChild(titulo);
    if(subtitle){ const sub = document.createElement('p'); sub.textContent = subtitle; titulos.appendChild(sub); }
    header.appendChild(back); header.appendChild(titulos);
    return header;
  }

  function renderLibroMenu(){
    const libro = currentLibro();
    listaContenedor.innerHTML = '';
    if(!libro){ listaContenedor.innerHTML = '<p>No hay libros.</p>'; return; }
    const cont = document.createElement('div'); cont.className = 'libro-inicio';
    const eyebrow = document.createElement('div'); eyebrow.className = 'libro-eyebrow'; eyebrow.textContent = 'Libro de reglas'; cont.appendChild(eyebrow);
    const titulo = document.createElement('h3'); titulo.textContent = libro.nombre || 'Libro de reglas'; cont.appendChild(titulo);
    const descText = libro.descripcion || libro.resumen || libro.description || 'Explora razas, clases, dotes y equipo desde un menú ordenado. Cada sección incluye búsqueda, descripciones rápidas y vistas detalladas con pestañas.';
    const p = document.createElement('p'); p.className='libro-descripcion'; p.textContent = descText; cont.appendChild(p);
    const toolbar = document.createElement('div'); toolbar.className = 'reglas-edit-mode-toolbar';
    const toggleEdit = document.createElement('button'); toggleEdit.type = 'button'; toggleEdit.className = 'reglas-edit-toggle' + (editMode ? ' active' : '');
    toggleEdit.textContent = editMode ? '✓ Modo edición activo' : '✎ Activar modo edición';
    toggleEdit.addEventListener('click', ()=>{ editMode = !editMode; actualizarControlesEdicion(); renderCurrentScreen(); });
    const hint = document.createElement('span'); hint.textContent = editMode ? 'Puedes crear clases, razas, subclases, subrazas y rasgos desde cada pantalla.' : 'Actívalo para añadir contenido al libro desde el contexto actual.';
    toolbar.appendChild(toggleEdit); toolbar.appendChild(hint);
    if(editMode){
      toolbar.appendChild(crearBotonAccionEdicion('Editar manual', ()=> abrirEditorRegla({ entity:'manual', mode:'edit', title:'Editar manual', target:{ kind:'manual' } })));
    }
    cont.appendChild(toolbar);    const hr = document.createElement('hr'); cont.appendChild(hr);
    const label = document.createElement('h4'); label.className='libro-menu-titulo'; label.textContent='Selección de submenús'; cont.appendChild(label);
    const menu = document.createElement('div'); menu.className='libro-menu';
    const opciones = [
      ['razas','Razas','Linajes, rasgos raciales y subrazas disponibles.'],
      ['clases','Clases','Progresión, rasgos de clase y subclases.'],
      ['dotes','Dotes','Opciones especiales para personalizar personajes.'],
      ['equipo','Equipo','Objetos, armas, armaduras y herramientas.']
    ];
    opciones.forEach(([key,labelBtn,desc])=>{
      const b = document.createElement('button'); b.className='libro-menu-btn';
      b.innerHTML = `<strong>${escapeHtml(labelBtn)}</strong><span>${escapeHtml(desc)}</span>`;
      b.addEventListener('click', ()=>{
        if(key==='clases') pushScreen({ type:'clases' });
        else if(key==='razas') pushScreen({ type:'razas' });
        else pushScreen({ type:'categoria', cat:key });
      });
      menu.appendChild(b);
    });
    cont.appendChild(menu);
    listaContenedor.appendChild(cont);
  }

  function renderSearchBox(label, query, onInput){
    const box = document.createElement('div'); box.className='reglas-buscador-caja';
    const title = document.createElement('label'); title.textContent = label;
    const input = document.createElement('input'); input.type='search'; input.value=query || ''; input.placeholder='Buscar por nombre o descripción...';
    input.addEventListener('input', ()=> onInput(input.value));
    title.appendChild(input); box.appendChild(title);
    return box;
  }

  function enfocarBuscadorSiHaceFalta(query, shouldFocus){
    if(!shouldFocus && !query) return;
    window.setTimeout(()=>{
      const input = listaContenedor.querySelector('.reglas-buscador-caja input');
      if(!input) return;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

  function renderEntityList({ title, searchLabel, items, query, onQuery, onOpen, meta, emptyText, editActions=[] }){
    const shouldFocusSearch = document.activeElement?.matches('.reglas-buscador-caja input');
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(title));
    const accionesEdicion = renderAccionesEdicion(editActions);
    if(accionesEdicion) listaContenedor.appendChild(accionesEdicion);
    listaContenedor.appendChild(renderSearchBox(searchLabel, query, onQuery));
    const q = normalizarTexto(query);
    const filtrados = items
      .filter(item=> !q || normalizarTexto(`${item.nombre || ''} ${textoResumen(item)}`).includes(q))
      .sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||'', 'es', { sensitivity: 'base' }));
    const lista = document.createElement('div'); lista.className='reglas-lista-columna';
    if(!filtrados.length){ lista.innerHTML = `<p class="reglas-vacio">${escapeHtml(emptyText)}</p>`; }
    filtrados.forEach(item=>{
      const card = document.createElement('button'); card.className='reglas-lista-card'; card.type='button';
      card.innerHTML = `<strong>${escapeHtml(item.nombre || 'Sin nombre')}</strong><span>${escapeHtml(String(textoResumen(item)).replace(/<[^>]*>/g, ''))}</span>${meta ? `<small>${escapeHtml(meta(item))}</small>` : ''}`;
      card.addEventListener('click', ()=> onOpen(item));
      lista.appendChild(card);
    });
    listaContenedor.appendChild(lista);
    enfocarBuscadorSiHaceFalta(query, shouldFocusSearch);
  }

  function renderClassList(query=''){
    const libro = currentLibro(); if(!libro){ listaContenedor.innerHTML = '<p>No hay libros.</p>'; return; }
    const clases = libro.clases || {};
    const items = Object.keys(clases).map(key=>({ ...clases[key], nombre: clases[key].nombre || key, __key: key }));
    renderEntityList({
      title: 'Clases',
      searchLabel: 'Buscador de clases',
      items,
      query,
      onQuery: value=>{ const current = currentScreen(); current.query = value; renderClassList(value); },
      onOpen: item=> pushScreen({ type:'claseDetail', classId: item.__key, tab:'rasgos' }),
      meta: item=> `${item.dadoDeGolpe ? `Dado de golpe d${item.dadoDeGolpe}` : 'Clase'} · Subclases: ${getSubclases(item).length}`,
      emptyText: 'No hay clases que coincidan con la búsqueda.',
      editActions: [{ label: '+ Nueva clase', onClick: ()=> abrirEditorRegla({ entity:'clase', title:'Nueva clase' }) }]
    });
  }

  function renderRaceList(query=''){
    const libro = currentLibro(); if(!libro){ listaContenedor.innerHTML = '<p>No hay libros.</p>'; return; }
    renderEntityList({
      title: 'Razas',
      searchLabel: 'Buscador de razas',
      items: libro.razas || [],
      query,
      onQuery: value=>{ const current = currentScreen(); current.query = value; renderRaceList(value); },
      onOpen: item=> pushScreen({ type:'razaDetail', raceId: item.id || item.nombre, tab:'rasgos' }),
      meta: item=> `${item.velocidad ? `Velocidad ${item.velocidad} pies` : 'Raza'} · Subrazas: ${(item.subrazas || []).length}`,
      emptyText: 'No hay razas que coincidan con la búsqueda.',
      editActions: [{ label: '+ Nueva raza', onClick: ()=> abrirEditorRegla({ entity:'raza', title:'Nueva raza' }) }]
    });
  }

  function renderCategoria(cat){
    const libro = currentLibro(); if(!libro){ listaContenedor.innerHTML = '<p>No hay libros.</p>'; return; }
    if(cat==='clases') return renderClassList();
    if(cat==='razas') return renderRaceList();
    const titulos = { dotes: 'Dotes', equipo: 'Equipo', rasgos: 'Rasgos', estados: 'Estados' };
    const items = (libro.categorias[cat] || []).map((item, index)=>({ ...item, __index: index, id: item.id || `${cat}_${index}` }));
    renderEntityList({
      title: titulos[cat] || cat,
      searchLabel: `Buscador de ${titulos[cat] || cat}`,
      items,
      query: currentScreen().query || '',
      onQuery: value=>{ const current = currentScreen(); current.query = value; renderCategoria(cat); },
      onOpen: item=> pushScreen({ type:'itemDetail', cat, itemId: item.id }),
      meta: item=> item.fuente || item.tipo || item.subtipo || '',
      emptyText: `No hay ${titulos[cat]?.toLowerCase() || 'items'} que coincidan con la búsqueda.`,
      editActions: cat === 'rasgos' ? [{ label: '+ Nuevo rasgo general', onClick: ()=> abrirEditorRegla({ entity:'rasgo', title:'Nuevo rasgo general', parent:{ kind:'categoria', cat:'rasgos' } }) }] : []
    });
  }

  function renderTabs(tabs, activeTab, onChange){
    const wrap = document.createElement('div'); wrap.className = 'clase-tabs';
    tabs.forEach(tab=>{
      const boton = document.createElement('button'); boton.className = 'clase-tab-btn' + (activeTab===tab.key ? ' active' : ''); boton.textContent = tab.label;
      boton.addEventListener('click', ()=> onChange(tab.key));
      wrap.appendChild(boton);
    });
    return wrap;
  }

  function crearDescripcionIntro(item){
    const intro = document.createElement('section'); intro.className='reglas-detalle-intro';
    const desc = document.createElement('div'); desc.className='detalle-rasgo-descripcion'; desc.innerHTML = descripcionHtml(item);
    intro.appendChild(desc);
    return intro;
  }

  function getSubclases(clase){ return clase?.subclase || clase?.subclases || []; }

  function obtenerValorPorRuta(objeto, ruta){
    if(!ruta) return null;
    return ruta.split('.').reduce((actual, parte)=> actual?.[parte], objeto);
  }

  function obtenerFuenteOpcionesCompartidas(seleccion){
    const ruta = seleccion?.fuenteOpciones?.coleccion;
    if(!ruta) return [];
    const libro = currentLibro();
    const desdeLibro = obtenerValorPorRuta(libro, ruta);
    if(Array.isArray(desdeLibro)) return desdeLibro;
    if(typeof libroDeReglasBasicas !== 'undefined'){
      const desdeBasicas = obtenerValorPorRuta(libroDeReglasBasicas, ruta);
      if(Array.isArray(desdeBasicas)) return desdeBasicas;
    }
    return [];
  }

  function esOpcionDote(opcion){
    const textoTipo = normalizarTexto(`${opcion?.tipo || ''} ${opcion?.categoria || ''} ${opcion?.coleccion || ''} ${opcion?.fuente || ''}`);
    return textoTipo.split(/\s+/).some(parte=> parte === 'dote' || parte === 'dotes');
  }

  function opcionPasaFiltrosSeleccion(opcion, seleccion){
    const fuente = seleccion?.fuenteOpciones || {};
    if(esOpcionDote(opcion)) return false;
    if(Array.isArray(fuente.incluirIds) && !fuente.incluirIds.includes(opcion.id)) return false;
    if(Array.isArray(fuente.excluirIds) && fuente.excluirIds.includes(opcion.id)) return false;
    return true;
  }

  function resolverOpcionesSeleccion(seleccion){
    const opcionesDirectas = Array.isArray(seleccion?.opciones) ? seleccion.opciones : [];
    const opcionesRemotas = obtenerFuenteOpcionesCompartidas(seleccion);
    const opciones = opcionesRemotas.length ? opcionesRemotas : opcionesDirectas;
    return opciones.filter(opcion=> opcionPasaFiltrosSeleccion(opcion, seleccion));
  }

  function seleccionGeneraRasgos(seleccion){
    if((seleccion?.cantidadSeleccionable || 0) <= 0) return false;
    const tipo = normalizarTexto(seleccion?.tipo || '');
    if(['subclase', 'habilidad', 'dote', 'dotes'].includes(tipo)) return false;
    const ruta = normalizarTexto(seleccion?.fuenteOpciones?.coleccion || '');
    if(ruta.includes('dote')) return false;
    return resolverOpcionesSeleccion(seleccion).length > 0;
  }

  function getSeleccionesDeRasgos(rasgos){
    const tabs = [];
    (rasgos || []).forEach((rasgo, rasgoIndex)=>{
      (rasgo.selecciones || []).forEach((seleccion, seleccionIndex)=>{
        if(!seleccionGeneraRasgos(seleccion)) return;
        tabs.push({
          key:`seleccion-${rasgoIndex}-${seleccionIndex}`,
          label: seleccion.nombre || rasgo.nombre || 'Rasgos seleccionables',
          rasgo,
          seleccion,
          opciones: resolverOpcionesSeleccion(seleccion)
        });
      });
    });
    return tabs;
  }

  function renderRasgosEnColumna(rasgos, parentTitle){
    const content = document.createElement('div'); content.className='build-rasgos-columna reglas-rasgos-columna';
    const niveles = {};
    (rasgos || []).forEach((r,i)=>{
      const nivel = r.nivelClase || r.nivel || '0';
      niveles[nivel] = niveles[nivel] || [];
      niveles[nivel].push({ rasgo: r, index: i });
    });
    const nivelesOrdenados = Object.keys(niveles).sort((a,b)=> Number(a)-Number(b));
    if(nivelesOrdenados.length===0){ content.innerHTML = '<p class="reglas-vacio">No hay rasgos definidos.</p>'; return content; }
    nivelesOrdenados.forEach(nivel=>{
      const section = document.createElement('section'); section.className='build-seccion-rasgos';
      const titulo = document.createElement('h4'); titulo.className='build-seccion-titulo'; titulo.textContent = nivel === '0' ? 'Rasgos' : `Nivel ${nivel}`;
      section.appendChild(titulo);
      niveles[nivel].forEach(({ rasgo, index })=>{
        const grupo = document.createElement('div'); grupo.className='build-rasgo-grupo';
        const card = document.createElement('button'); card.type='button'; card.className='build-rasgo-card reglas-rasgo-card';
        card.innerHTML = `<div class="build-rasgo-card-titulo">${escapeHtml(rasgo.nombre || 'Sin nombre')}</div><div class="build-rasgo-card-resumen">${escapeHtml(String(textoResumen(rasgo)).replace(/<[^>]*>/g, ''))}</div>`;
        card.addEventListener('click', ()=> pushScreen({ type:'rasgoDetail', parentTitle, rasgos, rasgoIndex:index }));
        grupo.appendChild(card);
        (rasgo.selecciones || []).forEach(sel=>{
          const ext = document.createElement('div'); ext.className='build-seleccion-extension reglas-seleccion-preview';
          const opciones = (sel.opciones || []).map(o=>o.nombre || o.id).filter(Boolean).join(', ');
          ext.innerHTML = `<strong>${escapeHtml(sel.nombre || sel.tipo || 'Selección')}</strong><small>${escapeHtml(sel.descripcion || opciones || 'Opciones seleccionables disponibles.')}</small>`;
          grupo.appendChild(ext);
        });
        section.appendChild(grupo);
      });
      content.appendChild(section);
    });
    return content;
  }

  function renderSeleccionTab(seleccion, opcionesResueltas){
    const wrap = document.createElement('div'); wrap.className='reglas-lista-columna';
    const intro = document.createElement('div'); intro.className='seleccion-card';
    intro.innerHTML = `<strong>${escapeHtml(seleccion.nombre || seleccion.tipo || 'Rasgos seleccionables')}</strong><div class="detalle-rasgo-descripcion">${escapeHtml(seleccion.descripcion || '')}</div>`;
    wrap.appendChild(intro);
    const opciones = opcionesResueltas || resolverOpcionesSeleccion(seleccion);
    if(!opciones.length){ wrap.innerHTML += '<p class="reglas-vacio">No hay rasgos disponibles para esta selección.</p>'; return wrap; }
    opciones.forEach((op, index)=>{
      const card = document.createElement('button'); card.type='button'; card.className='build-rasgo-card reglas-rasgo-card';
      card.innerHTML = `<div class="build-rasgo-card-titulo">${escapeHtml(op.nombre || op.id || 'Rasgo')}</div><div class="build-rasgo-card-resumen">${escapeHtml(String(textoResumen(op)).replace(/<[^>]*>/g, ''))}</div>`;
      card.addEventListener('click', ()=> pushScreen({ type:'rasgoDetail', parentTitle: seleccion.nombre || 'Rasgos seleccionables', rasgos: opciones, rasgoIndex:index }));
      wrap.appendChild(card);
    });
    return wrap;
  }

  function renderDetalleConTabs({ item, title, activeTab, rasgos, subitems, subitemsLabel, subitemsEmpty, subitemOpen, screenType, extraTabs=[], editActionsByTab={} }){
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(title));
    listaContenedor.appendChild(crearDescripcionIntro(item));
    const selectionTabs = getSeleccionesDeRasgos(rasgos);
    const tabs = [{ key:'rasgos', label:'Rasgos' }];
    if(subitems) tabs.push({ key:'subitems', label:subitemsLabel });
    tabs.push(...selectionTabs.map(t=>({ key:t.key, label:t.label })));
    tabs.push(...extraTabs);
    listaContenedor.appendChild(renderTabs(tabs, activeTab, key=>{
      const current = currentScreen(); if(current.type===screenType){ current.tab = key; renderCurrentScreen(); }
    }));
    const accionesEdicion = renderAccionesEdicion(editActionsByTab[activeTab] || []);
    if(accionesEdicion) listaContenedor.appendChild(accionesEdicion);
    const content = document.createElement('div'); content.className = 'clase-tab-contenido';
    const selectedSelection = selectionTabs.find(t=>t.key===activeTab);
    if(activeTab==='rasgos') content.appendChild(renderRasgosEnColumna(rasgos, title));
    else if(activeTab==='subitems'){
      const lista = document.createElement('div'); lista.className='reglas-lista-columna';
      if(!subitems.length) lista.innerHTML = `<p class="reglas-vacio">${escapeHtml(subitemsEmpty)}</p>`;
      subitems.forEach(sub=>{
        const card = document.createElement('button'); card.type='button'; card.className='reglas-lista-card';
        card.innerHTML = `<strong>${escapeHtml(sub.nombre || 'Sin nombre')}</strong><span>${escapeHtml(String(textoResumen(sub)).replace(/<[^>]*>/g, ''))}</span>`;
        card.addEventListener('click', ()=> subitemOpen(sub));
        lista.appendChild(card);
      });
      content.appendChild(lista);
    } else if(selectedSelection) content.appendChild(renderSeleccionTab(selectedSelection.seleccion, selectedSelection.opciones));
    listaContenedor.appendChild(content);
  }

  function renderClaseDetail(classId, activeTab){
    const libro = currentLibro();
    const clase = libro.clases && libro.clases[classId];
    if(!clase){ listaContenedor.innerHTML=''; listaContenedor.appendChild(renderSubmenuHeader('Clase')); listaContenedor.innerHTML += '<p class="reglas-vacio">Clase no encontrada.</p>'; return; }
    const subclases = getSubclases(clase);
    renderDetalleConTabs({
      item: clase,
      title: clase.nombre || classId,
      activeTab,
      rasgos: clase.rasgos || [],
      subitems: subclases,
      subitemsLabel: 'Subclases',
      subitemsEmpty: 'No hay subclases disponibles.',
      subitemOpen: sub=> pushScreen({ type:'subclaseDetail', classId, subclaseId: sub.id || sub.nombre, tab:'rasgos' }),
      screenType: 'claseDetail',
      editActionsByTab: {
        rasgos: [
          { label: 'Editar clase', onClick: ()=> abrirEditorRegla({ entity:'clase', mode:'edit', title:'Editar clase', target:{ kind:'clase', classId } }) },
          { label: '+ Añadir rasgo de clase', onClick: ()=> abrirEditorRegla({ entity:'rasgo', title:'Nuevo rasgo de clase', parent:{ kind:'clase', classId } }) }
        ],
        subitems: [
          { label: 'Editar clase', onClick: ()=> abrirEditorRegla({ entity:'clase', mode:'edit', title:'Editar clase', target:{ kind:'clase', classId } }) },
          { label: '+ Nueva subclase', onClick: ()=> abrirEditorRegla({ entity:'subclase', title:'Nueva subclase', parent:{ classId } }) }
        ]
      }
    });
  }

  function renderRazaDetail(raceId, activeTab){
    const libro = currentLibro();
    const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === raceId);
    if(!raza){ listaContenedor.innerHTML=''; listaContenedor.appendChild(renderSubmenuHeader('Raza')); listaContenedor.innerHTML += '<p class="reglas-vacio">Raza no encontrada.</p>'; return; }
    const subrazas = raza.subrazas || [];
    renderDetalleConTabs({
      item: raza,
      title: raza.nombre || raceId,
      activeTab,
      rasgos: raza.rasgos || [],
      subitems: editMode ? subrazas : (subrazas.length ? subrazas : null),
      subitemsLabel: 'Subrazas',
      subitemsEmpty: 'No hay subrazas disponibles.',
      subitemOpen: sub=> pushScreen({ type:'subrazaDetail', raceId, subraceId: sub.id || sub.nombre, tab:'rasgos' }),
      screenType: 'razaDetail',
      editActionsByTab: {
        rasgos: [
          { label: 'Editar raza', onClick: ()=> abrirEditorRegla({ entity:'raza', mode:'edit', title:'Editar raza', target:{ kind:'raza', raceId } }) },
          { label: '+ Añadir rasgo racial', onClick: ()=> abrirEditorRegla({ entity:'rasgo', title:'Nuevo rasgo racial', parent:{ kind:'raza', raceId } }) }
        ],
        subitems: [
          { label: 'Editar raza', onClick: ()=> abrirEditorRegla({ entity:'raza', mode:'edit', title:'Editar raza', target:{ kind:'raza', raceId } }) },
          { label: '+ Nueva subraza', onClick: ()=> abrirEditorRegla({ entity:'subraza', title:'Nueva subraza', parent:{ raceId } }) }
        ]
      }
    });
  }

  function renderSubclaseDetail(classId, subclaseId, activeTab){
    const libro = currentLibro();
    const clase = libro.clases && libro.clases[classId];
    const sub = getSubclases(clase).find(s=> (s.id || s.nombre) === subclaseId);
    if(!sub){ listaContenedor.innerHTML=''; listaContenedor.appendChild(renderSubmenuHeader('Subclase')); listaContenedor.innerHTML += '<p class="reglas-vacio">Subclase no encontrada.</p>'; return; }
    renderDetalleConTabs({
      item: sub,
      title: sub.nombre || 'Subclase',
      activeTab,
      rasgos: sub.rasgos || [],
      subitems: null,
      screenType: 'subclaseDetail',
      editActionsByTab: { rasgos: [
        { label: 'Editar subclase', onClick: ()=> abrirEditorRegla({ entity:'subclase', mode:'edit', title:'Editar subclase', target:{ kind:'subclase', classId, subclaseId } }) },
        { label: '+ Añadir rasgo de subclase', onClick: ()=> abrirEditorRegla({ entity:'rasgo', title:'Nuevo rasgo de subclase', parent:{ kind:'subclase', classId, subclaseId } }) }
      ] }
    });
  }

  function renderSubrazaDetail(raceId, subraceId, activeTab){
    const libro = currentLibro();
    const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === raceId);
    const sub = (raza?.subrazas || []).find(s=> (s.id || s.nombre) === subraceId);
    if(!sub){ listaContenedor.innerHTML=''; listaContenedor.appendChild(renderSubmenuHeader('Subraza')); listaContenedor.innerHTML += '<p class="reglas-vacio">Subraza no encontrada.</p>'; return; }
    renderDetalleConTabs({
      item: sub,
      title: sub.nombre || 'Subraza',
      activeTab,
      rasgos: sub.rasgos || [],
      subitems: null,
      screenType: 'subrazaDetail',
      editActionsByTab: { rasgos: [
        { label: 'Editar subraza', onClick: ()=> abrirEditorRegla({ entity:'subraza', mode:'edit', title:'Editar subraza', target:{ kind:'subraza', raceId, subraceId } }) },
        { label: '+ Añadir rasgo de subraza', onClick: ()=> abrirEditorRegla({ entity:'rasgo', title:'Nuevo rasgo de subraza', parent:{ kind:'subraza', raceId, subraceId } }) }
      ] }
    });
  }

  function renderRasgoDetail(parentTitle, rasgos, rasgoIndex){
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(parentTitle || 'Rasgos'));
    const rasgo = (rasgos || [])[rasgoIndex];
    if(!rasgo){ listaContenedor.innerHTML += '<p class="reglas-vacio">Rasgo no encontrado.</p>'; return; }
    const titulo = document.createElement('h3'); titulo.textContent = rasgo.nombre || 'Sin nombre';
    const desc = document.createElement('div'); desc.className='detalle-rasgo-descripcion'; desc.innerHTML = descripcionHtml(rasgo);
    listaContenedor.appendChild(titulo);
    listaContenedor.appendChild(desc);
    const accionesEdicion = renderAccionesEdicion([{ label:'Editar rasgo', onClick: ()=> abrirEditorRegla({ entity:'rasgo', mode:'edit', title:'Editar rasgo', target:{ kind:'rasgos', rasgos, index:rasgoIndex } }) }]);
    if(accionesEdicion) listaContenedor.appendChild(accionesEdicion);
    const seleccionesDeRasgos = getSeleccionesDeRasgos([rasgo]);
    if(seleccionesDeRasgos.length){
      const selHeader = document.createElement('div'); selHeader.className='seleccion-titulo'; selHeader.textContent = 'Rasgos seleccionables';
      listaContenedor.appendChild(selHeader);
      seleccionesDeRasgos.forEach(sel=> listaContenedor.appendChild(renderSeleccionTab(sel.seleccion, sel.opciones)));
    }
  }

  function renderItemDetail(cat, itemId){
    const libro = currentLibro();
    const items = (libro.categorias[cat] || []).map((item, index)=>({ ...item, __index: index, id: item.id || `${cat}_${index}` }));    const item = items.find(it=> it.id === itemId);
    const titulos = { dotes: 'Dotes', equipo: 'Equipo', rasgos: 'Rasgos', estados: 'Estados' };
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(titulos[cat] || cat));
    if(!item){ listaContenedor.innerHTML += '<p class="reglas-vacio">Elemento no encontrado.</p>'; return; }
    const title = document.createElement('h3'); title.textContent = item.nombre || 'Sin nombre';
    const desc = document.createElement('div'); desc.className='detalle-rasgo-descripcion reglas-item-detalle'; desc.innerHTML = descripcionHtml(item);
    listaContenedor.appendChild(title);
    listaContenedor.appendChild(desc);
    if(cat === 'rasgos'){
      const accionesEdicion = renderAccionesEdicion([{ label:'Editar rasgo', onClick: ()=> abrirEditorRegla({ entity:'rasgo', mode:'edit', title:'Editar rasgo', target:{ kind:'categoria', cat:'rasgos', index:item.__index } }) }]);
      if(accionesEdicion) listaContenedor.appendChild(accionesEdicion);
    }
    if(cat !== 'equipo'){
      const acciones = document.createElement('div'); acciones.className='reglas-actions reglas-actions-detalle';
      const btnA = document.createElement('button'); btnA.textContent='Añadir a personaje'; btnA.addEventListener('click', ()=> añadirAPersonaje(item, cat));
      acciones.appendChild(btnA); listaContenedor.appendChild(acciones);
    }
  }

  function buscarRaza(raceId){
    return (currentLibro()?.razas || []).find(r=> (r.id || r.nombre) === raceId) || null;
  }

  function buscarClase(classId){
    return currentLibro()?.clases?.[classId] || null;
  }

  function crearCampoTexto({ name, label, value='', type='text', placeholder='', textarea=false, required=false }){
    const lab = document.createElement('label');
    lab.textContent = label;
    const input = textarea ? document.createElement('textarea') : document.createElement('input');
    input.name = name;
    input.value = value || '';
    input.placeholder = placeholder;
    if(!textarea) input.type = type;
    if(required) input.required = true;
    lab.appendChild(input);
    return lab;
  }

  function obtenerItemEditor(screen){
    const libro = currentLibro();
    if(!libro) return null;
    if(screen.entity === 'manual') return libro;
    const target = screen.target || {};
    if(screen.entity === 'clase') return libro.clases?.[target.classId];
    if(screen.entity === 'raza') return (libro.razas || []).find(r=> (r.id || r.nombre) === target.raceId) || null;
    if(screen.entity === 'subclase'){
      const clase = libro.clases?.[target.classId];
      return obtenerListaSubclasesEditable(clase).find(s=> (s.id || s.nombre) === target.subclaseId) || null;
    }
    if(screen.entity === 'subraza'){
      const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === target.raceId);
      return (raza?.subrazas || []).find(s=> (s.id || s.nombre) === target.subraceId) || null;
    }
    if(screen.entity === 'rasgo'){
      if(Array.isArray(target.rasgos)) return target.rasgos[target.index] || null;
      if(target.kind === 'categoria') return (libro.categorias?.[target.cat] || [])[target.index] || null;
    }
    return null;
  }

  function obtenerJsonExtraEditor(item, entity){
    if(!item) return '';
    const omitidos = new Set(['id', 'nombre', 'descripcion', 'descripcionResum', 'resumen', 'description']);
    if(entity === 'clase') omitidos.add('dadoDeGolpe');
    if(entity === 'raza') omitidos.add('velocidad');
    if(entity === 'rasgo') omitidos.add('nivelClase');
    const extra = {};
    Object.keys(item).forEach(key=>{
      if(!omitidos.has(key)) extra[key] = item[key];
    });
    return Object.keys(extra).length ? JSON.stringify(extra, null, 2) : '';
  }

  function renderEditor(screen){
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(screen.title || 'Editar libro'));

    const item = screen.mode === 'edit' ? obtenerItemEditor(screen) : null;
    const form = document.createElement('form');
    form.className = 'reglas-editor-form';
    const intro = document.createElement('p');
    intro.className = 'reglas-editor-help';
    intro.textContent = obtenerAyudaEditor(screen);
    form.appendChild(intro);

    const nombre = crearCampoTexto({ name:'nombre', label: screen.entity === 'manual' ? 'Nombre del manual' : 'Nombre', value:item?.nombre || '', required:true, placeholder:'Nombre visible' });
    form.appendChild(nombre);

    if(screen.entity !== 'manual'){
      const id = crearCampoTexto({ name:'id', label:'ID', value:item?.id || slugifyId(item?.nombre || '', screen.entity), required:true, placeholder:'id_unico' });
      form.appendChild(id);
    }

    if(screen.entity === 'clase') form.appendChild(crearCampoTexto({ name:'dadoDeGolpe', label:'Dado de golpe', type:'number', value:item?.dadoDeGolpe || '', placeholder:'10' }));
    if(screen.entity === 'raza') form.appendChild(crearCampoTexto({ name:'velocidad', label:'Velocidad', type:'number', value:item?.velocidad || '', placeholder:'30' }));
    if(screen.entity === 'rasgo') form.appendChild(crearCampoTexto({ name:'nivelClase', label:'Nivel de clase (opcional)', type:'number', value:item?.nivelClase || '', placeholder:'1' }));

    if(screen.entity !== 'manual'){
      form.appendChild(crearCampoTexto({ name:'descripcionResum', label:'Descripción resumida', value:item?.descripcionResum || item?.resumen || '', placeholder:'Resumen corto para tarjetas' }));
    }
    form.appendChild(crearCampoTexto({ name:'descripcion', label:'Descripción completa', textarea:true, value:item?.descripcion || item?.description || '', placeholder:'Texto completo del elemento' }));

    if(screen.entity !== 'manual'){
      const advanced = document.createElement('details');
      advanced.className = 'reglas-editor-avanzado';
      advanced.innerHTML = '<summary>Campos avanzados (JSON opcional)</summary>';
      advanced.appendChild(crearCampoTexto({ name:'jsonExtra', label:'Propiedades extra en JSON', textarea:true, value:obtenerJsonExtraEditor(item, screen.entity), placeholder:'{"efectos": [], "selecciones": []}' }));
      form.appendChild(advanced);
    }

    const actions = document.createElement('div');
    actions.className = 'reglas-editor-actions';
    const guardar = document.createElement('button'); guardar.type='submit'; guardar.textContent= screen.mode === 'edit' ? 'Guardar cambios' : 'Guardar'
    const cancelar = document.createElement('button'); cancelar.type='button'; cancelar.textContent='Cancelar'; cancelar.className='secundario'; cancelar.addEventListener('click', popScreen);
    actions.appendChild(guardar); actions.appendChild(cancelar); form.appendChild(actions);

    let idEditado = Boolean(item?.id);
    const nombreInput = form.elements.nombre;
    const idInput = form.elements.id;
    if(idInput){
      idInput.addEventListener('input', ()=>{ idEditado = true; });
      nombreInput.addEventListener('input', ()=>{ if(!idEditado) idInput.value = slugifyId(nombreInput.value, screen.entity); });
    }

    form.addEventListener('submit', e=>{
      e.preventDefault();
      guardarDesdeEditor(screen, form);
    });

    listaContenedor.appendChild(form);
    nombreInput.focus();
  }

  function obtenerAyudaEditor(screen){
    if(screen.mode === 'edit'){
      const ayudasEdicion = {
        manual: 'Edita el nombre y la descripción principal del manual.',
        clase: 'Edita la información descriptiva de la clase sin borrar sus rasgos ni subclases.',
        raza: 'Edita la información descriptiva de la raza sin borrar sus rasgos ni subrazas.',
        subclase: 'Edita la información descriptiva de la subclase sin borrar sus rasgos.',
        subraza: 'Edita la información descriptiva de la subraza sin borrar sus rasgos.',
        rasgo: 'Edita este rasgo. En campos avanzados puedes ajustar efectos y selecciones.'
      };
      return ayudasEdicion[screen.entity] || 'Edita este elemento del libro de reglas.';
    }
    const ayudas = {
      clase: 'Crea una clase nueva. Después podrás añadir rasgos y subclases desde su ficha.',
      raza: 'Crea una raza nueva. Después podrás añadir rasgos y subrazas desde su ficha.',
      subclase: 'Crea una subclase dentro de la clase actual.',
      subraza: 'Crea una subraza dentro de la raza actual.',
      rasgo: 'Crea un rasgo en el contexto desde el que has abierto el editor.'
    };
    return ayudas[screen.entity] || 'Crea un elemento del libro de reglas.';
  }

  function leerDatosEditor(screen, form){
    const nombre = form.elements.nombre.value.trim();
    const data = {
      nombre,
      descripcion: form.elements.descripcion.value.trim()
    };
    if(screen.entity !== 'manual'){
      data.id = slugifyId(form.elements.id.value.trim() || nombre, screen.entity);
      data.descripcionResum = form.elements.descripcionResum.value.trim();
    }
    if(screen.entity === 'clase'){
      const dado = Number(form.elements.dadoDeGolpe.value);
      if(dado) data.dadoDeGolpe = dado;
      if(screen.mode !== 'edit'){
        data.rasgos = [];
        data.subclase = [];
      }
    }
    if(screen.entity === 'raza'){
      const velocidad = Number(form.elements.velocidad.value);
      if(velocidad) data.velocidad = velocidad;
      if(screen.mode !== 'edit'){
        data.rasgos = [];
        data.subrazas = [];
      }
    }
    if((screen.entity === 'subclase' || screen.entity === 'subraza') && screen.mode !== 'edit') data.rasgos = [];
    if(screen.entity === 'rasgo'){
      const nivel = Number(form.elements.nivelClase.value);
      if(nivel) data.nivelClase = nivel;
    }
    const extra = form.elements.jsonExtra?.value.trim() || ``;
    if(extra){
      let parsed;
      try{ parsed = JSON.parse(extra); }
      catch(e){ alert('El JSON avanzado no es válido.'); return null; }
      if(parsed && typeof parsed === 'object' && !Array.isArray(parsed)) Object.assign(data, parsed);
    }
    return data;
  }

  function guardarDesdeEditor(screen, form){
    const libro = currentLibro();
    if(!libro) return alert('Selecciona un libro.');
    const data = leerDatosEditor(screen, form);
    if(!data) return;
    if(!data.nombre) return alert('Introduce un nombre.');

    let guardado = false;
    if(screen.mode === 'edit') guardado = actualizarEntidad(libro, screen, data);
    else if(screen.entity === 'clase') guardado = guardarClase(libro, data);
    if(screen.entity === 'clase') guardado = guardarClase(libro, data);
    else if(screen.entity === 'raza') guardado = guardarRaza(libro, data);
    else if(screen.entity === 'subclase') guardado = guardarSubclase(libro, screen.parent, data);
    else if(screen.entity === 'subraza') guardado = guardarSubraza(libro, screen.parent, data);
    else if(screen.entity === 'rasgo') guardado = guardarRasgo(libro, screen.parent, data);
    else return alert('Tipo de elemento no soportado.');

    if(!guardado) return;
    save();
    popScreen();
  }

  function actualizarEntidad(libro, screen, data){
    const target = screen.target || {};
    if(screen.entity === 'manual'){
      libro.nombre = data.nombre;
      libro.descripcion = data.descripcion;
      return true;
    }
    const item = obtenerItemEditor(screen);
    if(!item){ alert('Elemento no encontrado.'); return false; }
    const actualizado = { ...item, ...data };

    if(screen.entity === 'clase'){
      const oldId = target.classId;
      actualizado.id = crearIdUnico(actualizado.id, id=> id !== oldId && Boolean(libro.clases[id]));
      if(actualizado.id !== oldId){ delete libro.clases[oldId]; actualizarPantallaAnterior('classId', actualizado.id); }
      libro.clases[actualizado.id] = actualizado;
      return true;
    }
    if(screen.entity === 'raza'){
      const oldId = target.raceId;
      actualizado.id = crearIdUnico(actualizado.id, id=> id !== oldId && (libro.razas || []).some(r=> (r.id || r.nombre) === id));
      Object.assign(item, actualizado);
      if(actualizado.id !== oldId) actualizarPantallaAnterior('raceId', actualizado.id);
      return true;
    }
    if(screen.entity === 'subclase'){
      const clase = libro.clases?.[target.classId];
      const subclases = obtenerListaSubclasesEditable(clase);
      const oldId = target.subclaseId;
      actualizado.id = crearIdUnico(actualizado.id, id=> id !== oldId && subclases.some(s=> (s.id || s.nombre) === id));
      Object.assign(item, actualizado);
      if(actualizado.id !== oldId) actualizarPantallaAnterior('subclaseId', actualizado.id);
      return true;
    }
    if(screen.entity === 'subraza'){
      const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === target.raceId);
      const subrazas = raza?.subrazas || [];
      const oldId = target.subraceId;
      actualizado.id = crearIdUnico(actualizado.id, id=> id !== oldId && subrazas.some(s=> (s.id || s.nombre) === id));
      Object.assign(item, actualizado);
      if(actualizado.id !== oldId) actualizarPantallaAnterior('subraceId', actualizado.id);
      return true;
    }
    if(screen.entity === 'rasgo'){
      Object.assign(item, actualizado);
      return true;
    }
    return false;
  }

  function actualizarPantallaAnterior(campo, valor){
    const anterior = screenStack[screenStack.length - 2];
    if(anterior && Object.prototype.hasOwnProperty.call(anterior, campo)) anterior[campo] = valor;
  }

  function guardarClase(libro, data){
    data.id = crearIdUnico(data.id, id=> Boolean(libro.clases[id]));
    libro.clases[data.id] = data;
    return true;
  }

  function guardarRaza(libro, data){
    libro.razas = libro.razas || [];
    data.id = crearIdUnico(data.id, id=> libro.razas.some(r=> (r.id || r.nombre) === id));
    libro.razas.push(data);
    return true;
  }

  function guardarSubclase(libro, parent, data){
    const clase = libro.clases?.[parent?.classId];
    if(!clase){ alert('Clase padre no encontrada.'); return false; }
    const subclases = obtenerListaSubclasesEditable(clase);
    data.id = crearIdUnico(data.id, id=> subclases.some(s=> (s.id || s.nombre) === id));
    subclases.push(data);
    return true;
  }

  function guardarSubraza(libro, parent, data){
    const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === parent?.raceId);
    if(!raza){ alert('Raza padre no encontrada.'); return false; }
    raza.subrazas = raza.subrazas || [];
    data.id = crearIdUnico(data.id, id=> raza.subrazas.some(s=> (s.id || s.nombre) === id));
    raza.subrazas.push(data);
    return true;
  }

  function guardarRasgo(libro, parent, data){
    const destino = obtenerDestinoRasgos(libro, parent);
    if(!destino){ alert('Destino del rasgo no encontrado.'); return false; }
    data.id = crearIdUnico(data.id, id=> destino.some(r=> (r.id || r.nombre) === id));
    destino.push(data);
    return true;
  }

  function obtenerDestinoRasgos(libro, parent){
    if(parent?.kind === 'categoria'){
      libro.categorias[parent.cat] = libro.categorias[parent.cat] || [];
      return libro.categorias[parent.cat];
    }
    if(parent?.kind === 'clase'){
      const clase = libro.clases?.[parent.classId];
      if(!clase) return null;
      clase.rasgos = clase.rasgos || [];
      return clase.rasgos;
    }
    if(parent?.kind === 'subclase'){
      const clase = libro.clases?.[parent.classId];
      const sub = obtenerListaSubclasesEditable(clase).find(s=> (s.id || s.nombre) === parent.subclaseId);
      if(!sub) return null;
      sub.rasgos = sub.rasgos || [];
      return sub.rasgos;
    }
    if(parent?.kind === 'raza'){
      const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === parent.raceId);
      if(!raza) return null;
      raza.rasgos = raza.rasgos || [];
      return raza.rasgos;
    }
    if(parent?.kind === 'subraza'){
      const raza = (libro.razas || []).find(r=> (r.id || r.nombre) === parent.raceId);
      const sub = (raza?.subrazas || []).find(s=> (s.id || s.nombre) === parent.subraceId);
      if(!sub) return null;
      sub.rasgos = sub.rasgos || [];
      return sub.rasgos;
    }
    return null;
  }

  function añadirAPersonaje(item, cat){
    if(!window.personajeDemo){ alert('No hay personaje cargado.'); return; }
    if(cat==='equipo'){
      window.personajeDemo.equipo = window.personajeDemo.equipo || [];
      window.personajeDemo.equipo.push({ nombre: item.nombre, descripcion: item.descripcion, fuente: item.fuente });
      alert('Equipo añadido al personaje.');
    } else if(cat==='dotes'){
      window.personajeDemo.eleccionesRasgos = window.personajeDemo.eleccionesRasgos || {};
      window.personajeDemo.eleccionesRasgos.dotes = window.personajeDemo.eleccionesRasgos.dotes || [];
      window.personajeDemo.eleccionesRasgos.dotes.push({ nombre: item.nombre, descripcion: item.descripcion });
      alert('Dote añadida al personaje.');
    } else if(cat==='rasgos'){
      window.personajeDemo.eleccionesRasgos = window.personajeDemo.eleccionesRasgos || {};
      window.personajeDemo.eleccionesRasgos[item.nombre] = item.descripcion || true;
      alert('Rasgo añadido al personaje.');
    }
    if(window.actualizarVistaPersonaje) try{ window.actualizarVistaPersonaje(); }catch(e){}
  }

  if(btnAgregar) btnAgregar.addEventListener('click', ()=>{
    const nombre = inpNombre.value.trim();
    if(!nombre){ alert('Introduce un nombre.'); return; }
    const libro = currentLibro(); if(!libro) return alert('Selecciona un libro.');
    const cat = selCategoria.value;
    if(cat==='clases'){
      if(libro.clases[nombre]) return alert('La clase ya existe.');
      libro.clases[nombre] = { nombre, rasgos: [], subclases: [] }; save(); renderCategoria('clases'); inpNombre.value=''; return;
    }
    const obj = { nombre, descripcion: inpDesc.value.trim(), fuente: inpFuente.value.trim() };
    if(editState){ libro.categorias[editState.cat][editState.index] = obj; editState = null; if(tituloForm) tituloForm.textContent='Agregar item'; }
    else { libro.categorias[cat] = libro.categorias[cat] || []; libro.categorias[cat].push(obj); }
    save(); inpNombre.value=''; inpDesc.value=''; inpFuente.value=''; renderCategoria(cat);
  });

  function prepararLibroParaDatos(libro){
    return {
      nombre: libro.nombre || 'Reglas básicas',
      descripcion: libro.descripcion || '',
      razas: libro.razas || [],
      opcionesCompartidas: libro.opcionesCompartidas || {},
      clases: Object.values(libro.clases || {}),
      dotes: libro.categorias?.dotes || [],
      equipo: libro.categorias?.equipo || [],
      estados: libro.categorias?.estados || []
    };
  }

  function descargarTexto(nombreArchivo, contenido, tipo='application/javascript'){
    const blob = new Blob([contenido], {type: tipo});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
  }

  if(btnExportar) btnExportar.addEventListener('click', ()=>{
    const libro = currentLibro();
    if(!libro) return alert('Selecciona un libro para exportar.');
    const data = prepararLibroParaDatos(libro);
    const contenido = `// Exportado desde el editor del Libro de reglas\n// Copia este objeto en datos.js para sustituir o combinar libroDeReglasBasicas.\nlet libroDeReglasBasicas = ${JSON.stringify(data, null, 2)};\n`;
    descargarTexto('libro_reglas_datos.js', contenido);
  });

  if(btnImportar) btnImportar.addEventListener('click', ()=>{
    const raw = prompt('Pega aquí el JSON del libro de reglas para importar:');
    if(!raw) return;
    try{ const parsed = JSON.parse(raw); if(Array.isArray(parsed)) window.libroReglas = parsed; else alert('Formato inválido.'); save(); renderLibros(); renderCategoria(categoriaActiva); alert('Importado.'); }catch(e){ alert('JSON inválido.'); }
  });

  document.querySelectorAll('.categoria-btn').forEach(b=> b.classList.toggle('active', b.dataset.categoria===categoriaActiva));
  renderLibros(); renderCategoria(categoriaActiva);

})();