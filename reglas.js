(function(){
  const STORAGE_KEY = 'miFichaLibroReglas_v2';

  function crearLibroVacio(){
    return { id: genId(), nombre: 'Reglas básicas', descripcion:'', categorias: { rasgos: [], dotes: [], equipo: [], estados: [] }, clases: {} };
  }

  function convertirDesdeDatos(d){
    const libro = { id: 'basicas', nombre: d.nombre || 'Reglas básicas', descripcion: d.descripcion || d.resumen || '', categorias: { rasgos: [], dotes: [], equipo: [], estados: [] }, clases: {} };
    if(Array.isArray(d.razas)){
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
    if(Array.isArray(d.equipo)) libro.categorias.equipo = d.equipo.map(it=>({ nombre: it.nombre, descripcion: it.descripcion||'' }));
    if(Array.isArray(d.dotes)) libro.categorias.dotes = d.dotes.map(it=>({ nombre: it.nombre, descripcion: it.descripcion||'' }));
    if(Array.isArray(d.estados)) libro.categorias.estados = d.estados.map(it=>({ nombre: it.nombre, descripcion: it.descripcion||'' }));
    return libro;
  }

  // Preferir datos en localStorage; si no existen, intentar importar `libroDeReglasBasicas` desde datos.js
  const _stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if(!_stored && typeof libroDeReglasBasicas !== 'undefined'){
    window.libroReglas = [ convertirDesdeDatos(libroDeReglasBasicas) ];
  } else {
    window.libroReglas = _stored || [ crearLibroVacio() ];
  }

  function genId(){ return 'lb_' + Math.random().toString(36).slice(2,9); }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(window.libroReglas)); }
  function el(id){ return document.getElementById(id); }

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

  let categoriaActiva = 'rasgos';
  let libroSeleccionadoId = window.libroReglas[0].id;
  let screenStack = [{ type:'home' }];
  let editState = null; // {cat, index}

  function currentScreen(){ return screenStack[screenStack.length-1]; }
  function renderCurrentScreen(){ const screen = currentScreen(); if(screen.type==='home') renderLibroMenu(); else if(screen.type==='categoria') renderCategoria(screen.cat); else if(screen.type==='clases') renderClassList(); else if(screen.type==='claseDetail') renderClaseDetail(screen.classId, screen.tab||'rasgos'); else if(screen.type==='rasgoDetail') renderRasgoDetail(screen.classId, screen.rasgoIndex); else if(screen.type==='subclaseDetail') renderSubclaseDetail(screen.classId, screen.subclaseId); }
  function goHome(){ screenStack = [{ type:'home' }]; renderCurrentScreen(); }
  function pushScreen(state){ screenStack.push(state); renderCurrentScreen(); }
  function popScreen(){ if(screenStack.length>1){ screenStack.pop(); } renderCurrentScreen(); }

  function abrirModal(){ modal.classList.remove('oculto'); renderLibros(); goHome(); }
  function cerrarModal(){ modal.classList.add('oculto'); }

  btnAbrir.addEventListener('click', abrirModal);
  cerrar.addEventListener('click', cerrarModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) cerrarModal(); });

  categoriaBtns.forEach(b=> b.addEventListener('click', ()=>{ categoriaActiva = b.dataset.categoria; categoriaBtns.forEach(x=>x.classList.toggle('active', x===b)); renderCategoria(categoriaActiva); }));

  btnNuevoLibro.addEventListener('click', ()=>{
    const nombre = prompt('Nombre del nuevo libro:','Nuevo libro'); if(!nombre) return;
    const nuevo = { id: genId(), nombre: nombre.trim(), categorias: { rasgos: [], dotes: [], equipo: [], estados: [] }, clases: {} };
    window.libroReglas.push(nuevo); save(); renderLibros(); selectLibro(nuevo.id);
  });

  // Modo solo lectura: ocultar controles de creación/edición en la UI
  try{
    if(btnNuevoLibro) btnNuevoLibro.style.display = 'none';
    if(btnExportar) btnExportar.style.display = 'none';
    if(btnImportar) btnImportar.style.display = 'none';
    if(reglasFormEl) reglasFormEl.style.display = 'none';
    document.querySelectorAll('.categoria-btn').forEach(b=> b.style.display = 'none');
  }catch(e){}

  function renderLibros(){ librosLista.innerHTML='';
    window.libroReglas.forEach(lb=>{
      const div = document.createElement('div'); div.className='libro-item'; if(lb.id===libroSeleccionadoId) div.classList.add('active');
      const span = document.createElement('span'); span.textContent = lb.nombre; div.appendChild(span);
      const actions = document.createElement('div');
      const btnSel = document.createElement('button'); btnSel.textContent='Abrir'; btnSel.addEventListener('click', ()=> selectLibro(lb.id));
      actions.appendChild(btnSel); div.appendChild(actions);
      // make title clickable to select the book
      span.addEventListener('click', (e)=>{ selectLibro(lb.id); });
      librosLista.appendChild(div);
    });
  }

  // Expose helper to open the modal and select a book
  window.openLibroReglas = function(id){ if(id) selectLibro(id); abrirModal(); };

  // Main-page button to open the basic book
  const abrirLibroBtn = el('abrirLibroBtn');
  if(abrirLibroBtn) abrirLibroBtn.addEventListener('click', ()=>{ window.openLibroReglas(window.libroReglas[0] && window.libroReglas[0].id); });

  function selectLibro(id){ libroSeleccionadoId = id; renderLibros(); renderCurrentScreen(); }

  function renderSubmenuHeader(title){
    const header = document.createElement('div'); header.className = 'submenu-header';
    const back = document.createElement('button'); back.className = 'submenu-back'; back.textContent = '← Volver'; back.addEventListener('click', popScreen);
    const titulo = document.createElement('h3'); titulo.textContent = title;
    header.appendChild(back); header.appendChild(titulo);
    return header;
  }

  // Mostrar la página inicial del libro: descripción + menú de acceso a secciones
  function renderLibroMenu(){
    const libro = currentLibro();
    listaContenedor.innerHTML = '';
    if(!libro){ listaContenedor.innerHTML = '<p>No hay libros.</p>'; return; }
    const cont = document.createElement('div'); cont.className = 'libro-inicio';
    const titulo = document.createElement('h3'); titulo.textContent = libro.nombre || 'Libro de reglas'; cont.appendChild(titulo);
    const descText = libro.descripcion || libro.resumen || libro.description || '';
    if(descText){ const p = document.createElement('p'); p.className='libro-descripcion'; p.textContent = descText; cont.appendChild(p); }
    const hr = document.createElement('hr'); cont.appendChild(hr);
    const menu = document.createElement('div'); menu.className='libro-menu';
    const opciones = [ ['clases','Ir a Clases'], ['rasgos','Ir a Razas'], ['dotes','Ir a Dotes'], ['equipo','Ir a Equipo'], ['estados','Ir a Estados'] ];
    opciones.forEach(([key,label])=>{
      const b = document.createElement('button'); b.className='libro-menu-btn'; b.textContent = label; b.addEventListener('click', ()=>{
        if(key==='clases') pushScreen({ type:'clases' });
        else pushScreen({ type:'categoria', cat:key });
      });
      menu.appendChild(b);
    });
    cont.appendChild(menu);
    listaContenedor.appendChild(cont);
  }

  function currentLibro(){ return window.libroReglas.find(x=>x.id===libroSeleccionadoId) || window.libroReglas[0]; }

  function renderCategoria(cat){
    listaContenedor.innerHTML = '';
    if(screenStack.length>1) listaContenedor.appendChild(renderSubmenuHeader(cat==='clases' ? 'Clases' : cat.charAt(0).toUpperCase() + cat.slice(1)));
    const libro = currentLibro(); if(!libro){ listaContenedor.innerHTML += '<p>No hay libros.</p>'; return; }
    if(cat==='clases'){
      const clases = libro.clases || {};
      const names = Object.keys(clases).sort((a,b)=> a.localeCompare(b, 'es', { sensitivity: 'base' }));
      if(names.length===0) listaContenedor.innerHTML += '<p class="reglas-vacio">No hay clases definidas.</p>';
      names.forEach((cn)=>{
        const c = clases[cn];
        const item = document.createElement('div'); item.className='regla-item';
        const datos = document.createElement('div'); datos.className='regla-datos';
        const nivel = c.dadoDeGolpe ? `dado d${c.dadoDeGolpe}` : '';
        const subcount = (c.subclase || c.subclases || []).length;
        datos.innerHTML = `<strong>${escapeHtml(cn)}</strong><div class="regla-meta">${escapeHtml(nivel)} · Subclases: ${subcount}</div>`;
        const acciones = document.createElement('div'); acciones.className='reglas-actions';
          const btnVer = document.createElement('button'); btnVer.textContent='Ver'; btnVer.addEventListener('click', ()=>{ pushScreen({ type:'claseDetail', classId: cn, tab:'rasgos' }); });
          acciones.appendChild(btnVer);
        item.appendChild(datos); item.appendChild(acciones); listaContenedor.appendChild(item);
      });
      return;
    }

    const items = (libro.categorias[cat] || []).slice().sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||'', 'es', { sensitivity: 'base' }));
    if(items.length===0){ listaContenedor.innerHTML += '<p class="reglas-vacio">No hay items en esta categoría.</p>'; }
    items.forEach((it, idx)=>{
      const item = document.createElement('div'); item.className='regla-item';
      const datos = document.createElement('div'); datos.className='regla-datos';
      datos.innerHTML = `<strong>${escapeHtml(it.nombre)}</strong><div class="regla-meta">${escapeHtml(it.fuente||'')} - ${escapeHtml(it.descripcion||'')}</div>`;
      const acciones = document.createElement('div'); acciones.className='reglas-actions';
        const btnA = document.createElement('button'); btnA.textContent='Añadir a personaje'; btnA.addEventListener('click', ()=>{ añadirAPersonaje(it, cat); });
        const btnVer = document.createElement('button'); btnVer.textContent='Ver'; btnVer.addEventListener('click', ()=>{ const detalles = `${it.nombre}\n\n${it.descripcion||''}`; alert(detalles || 'Sin detalles'); });
        acciones.appendChild(btnA); acciones.appendChild(btnVer);
      item.appendChild(datos); item.appendChild(acciones);
      listaContenedor.appendChild(item);
    });
  }

  function editarClase(libro, className){
    const c = libro.clases[className];
    const detalles = `Rasgos:\n${(c.rasgos||[]).map(r=>r.nombre).join('\n')}\n\nSubclases:\n${(c.subclase||[]).map(s=>s.nombre).join('\n')}`;
    alert(detalles || 'Vacío');
  }

  function renderClassList(){
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader('Clases'));
    const libro = currentLibro(); if(!libro){ listaContenedor.innerHTML += '<p>No hay libros.</p>'; return; }
    const clases = libro.clases || {};
    const names = Object.keys(clases).sort((a,b)=> a.localeCompare(b, 'es', { sensitivity: 'base' }));
    if(names.length===0){ listaContenedor.innerHTML += '<p class="reglas-vacio">No hay clases definidas.</p>'; return; }
    const grid = document.createElement('div'); grid.className='clases-grid';
    names.forEach(cn=>{
      const c = clases[cn];
      const card = document.createElement('div'); card.className='clase-card';
      const titulo = document.createElement('strong'); titulo.textContent = cn;
      const desc = document.createElement('div'); desc.className='clase-card-desc'; desc.innerHTML = escapeHtml(c.descripcionResum || c.descripcion || '');
      const meta = document.createElement('div'); meta.className = 'clase-meta'; meta.textContent = c.dadoDeGolpe ? `dado d${c.dadoDeGolpe}` : '';
      const btn = document.createElement('button'); btn.textContent = 'Abrir'; btn.addEventListener('click', ()=>{ pushScreen({ type:'claseDetail', classId: cn, tab:'rasgos' }); });
      card.appendChild(titulo); if(desc.textContent) card.appendChild(desc); card.appendChild(meta); card.appendChild(btn); grid.appendChild(card);
    });
    listaContenedor.appendChild(grid);
  }

  function renderClaseDetail(classId, activeTab){
    const libro = currentLibro();
    const clase = libro.clases && libro.clases[classId];
    listaContenedor.innerHTML = '';
    if(!clase){ listaContenedor.appendChild(renderSubmenuHeader('Clase')); listaContenedor.innerHTML += '<p class="reglas-vacio">Clase no encontrada.</p>'; return; }
    listaContenedor.appendChild(renderSubmenuHeader(clase.nombre || classId));
    const tabs = document.createElement('div'); tabs.className = 'clase-tabs';
    const opciones = [ ['rasgos','Rasgos principales'], ['subclases','Subclases'] ];
    opciones.forEach(([key,label])=>{
      const boton = document.createElement('button'); boton.className = 'clase-tab-btn' + (activeTab===key ? ' active' : ''); boton.textContent = label;
      boton.addEventListener('click', ()=>{
        const current = currentScreen(); if(current.type==='claseDetail'){ current.tab = key; renderClaseDetail(classId, key); }
      });
      tabs.appendChild(boton);
    });
    listaContenedor.appendChild(tabs);
    const content = document.createElement('div'); content.className = 'clase-tab-contenido';
    if(activeTab==='rasgos'){
      const niveles = {};
      (clase.rasgos||[]).forEach((r,i)=>{
        const nivel = r.nivelClase || '0';
        niveles[nivel] = niveles[nivel] || [];
        niveles[nivel].push({ rasgo: r, index: i });
      });
      const nivelesOrdenados = Object.keys(niveles).sort((a,b)=> Number(a)-Number(b));
      if(nivelesOrdenados.length===0){ content.innerHTML = '<p class="reglas-vacio">No hay rasgos definidos.</p>'; }
      nivelesOrdenados.forEach(nivel=>{
        const bloque = document.createElement('div'); bloque.className='rasgo-nivel-grupo';
        const cabecera = document.createElement('div'); cabecera.className='rasgo-nivel-titulo'; cabecera.textContent = nivel === '0' ? 'Sin nivel asignado' : `Nivel ${nivel}`;
        bloque.appendChild(cabecera);
        const lista = document.createElement('div'); lista.className='rasgo-nivel-lista';
        niveles[nivel].forEach(({ rasgo, index })=>{
          const boton = document.createElement('button'); boton.className='rasgo-link'; boton.textContent = rasgo.nombre || 'Sin nombre';
          boton.title = rasgo.descripcionResum || rasgo.descripcion || '';
          boton.addEventListener('click', ()=>{ pushScreen({ type:'rasgoDetail', classId, rasgoIndex: index }); });
          lista.appendChild(boton);
        });
        bloque.appendChild(lista);
        content.appendChild(bloque);
      });
    } else if(activeTab==='subclases'){
      const subclases = clase.subclase || [];
      if(subclases.length===0){ content.innerHTML = '<p class="reglas-vacio">No hay subclases disponibles.</p>'; }
      subclases.forEach(sub=>{
        const card = document.createElement('div'); card.className='subclase-card';
        const titulo = document.createElement('strong'); titulo.textContent = sub.nombre || 'Sin nombre';
        const desc = document.createElement('div'); desc.className='subclase-desc'; desc.innerHTML = escapeHtml(sub.descripcionResum || sub.descripcion || '');
        const btn = document.createElement('button'); btn.textContent = 'Abrir subclase'; btn.addEventListener('click', ()=>{ pushScreen({ type:'subclaseDetail', classId, subclaseId: sub.id }); });
        card.appendChild(titulo); card.appendChild(desc); card.appendChild(btn);
        content.appendChild(card);
      });
    }
    listaContenedor.appendChild(content);
  }

  function renderRasgoDetail(classId, rasgoIndex){
    const libro = currentLibro();
    const clase = libro.clases && libro.clases[classId];
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(clase?.nombre || classId));
    if(!clase){ listaContenedor.innerHTML += '<p class="reglas-vacio">Clase no encontrada.</p>'; return; }
    const rasgo = (clase.rasgos || [])[rasgoIndex];
    if(!rasgo){ listaContenedor.innerHTML += '<p class="reglas-vacio">Rasgo no encontrado.</p>'; return; }
    const titulo = document.createElement('h3'); titulo.textContent = rasgo.nombre || 'Sin nombre';
    const desc = document.createElement('div'); desc.className='detalle-rasgo-descripcion'; desc.innerHTML = rasgo.descripcion || rasgo.descripcionResum || '<em>Sin descripción</em>';
    listaContenedor.appendChild(titulo);
    listaContenedor.appendChild(desc);
    if(Array.isArray(rasgo.selecciones) && rasgo.selecciones.length){
      const selHeader = document.createElement('div'); selHeader.className='seleccion-titulo'; selHeader.textContent = 'Selecciones';
      listaContenedor.appendChild(selHeader);
      rasgo.selecciones.forEach(sel=>{
        const card = document.createElement('div'); card.className='seleccion-card';
        const title = document.createElement('strong'); title.textContent = sel.nombre || sel.tipo || 'Selección';
        const descSel = document.createElement('div'); descSel.className='detalle-rasgo-descripcion'; descSel.innerHTML = escapeHtml(sel.descripcion || '');
        card.appendChild(title); card.appendChild(descSel);
        if(Array.isArray(sel.opciones) && sel.opciones.length){
          const lista = document.createElement('div'); lista.className='seleccion-opciones';
          sel.opciones.forEach(o=>{
            const opcion = document.createElement('div'); opcion.className='seleccion-opcion'; opcion.textContent = o.nombre || o.id || '';
            lista.appendChild(opcion);
          });
          card.appendChild(lista);
        }
        listaContenedor.appendChild(card);
      });
    }
  }

  function renderSubclaseDetail(classId, subclaseId){
    const libro = currentLibro();
    const clase = libro.clases && libro.clases[classId];
    listaContenedor.innerHTML = '';
    listaContenedor.appendChild(renderSubmenuHeader(clase?.nombre || classId));
    if(!clase){ listaContenedor.innerHTML += '<p class="reglas-vacio">Clase no encontrada.</p>'; return; }
    const sub = (clase.subclase || []).find(s=>s.id===subclaseId);
    if(!sub){ listaContenedor.innerHTML += '<p class="reglas-vacio">Subclase no encontrada.</p>'; return; }
    const titulo = document.createElement('h3'); titulo.textContent = sub.nombre || 'Sin nombre';
    const desc = document.createElement('div'); desc.className='detalle-rasgo-descripcion'; desc.innerHTML = escapeHtml(sub.descripcion || sub.descripcionResum || '<em>Sin descripción</em>');
    listaContenedor.appendChild(titulo);
    listaContenedor.appendChild(desc);
    const niveles = {};
    (sub.rasgos || []).forEach((r,i)=>{
      const nivel = r.nivelClase || '0';
      niveles[nivel] = niveles[nivel] || [];
      niveles[nivel].push(r);
    });
    const nivelesOrdenados = Object.keys(niveles).sort((a,b)=> Number(a)-Number(b));
    if(nivelesOrdenados.length===0){ listaContenedor.innerHTML += '<p class="reglas-vacio">No hay rasgos definidos para esta subclase.</p>'; return; }
    nivelesOrdenados.forEach(nivel=>{
      const bloque = document.createElement('div'); bloque.className='rasgo-nivel-grupo';
      const cabecera = document.createElement('div'); cabecera.className='rasgo-nivel-titulo'; cabecera.textContent = nivel === '0' ? 'Sin nivel asignado' : `Nivel ${nivel}`;
      bloque.appendChild(cabecera);
      const lista = document.createElement('div'); lista.className='rasgo-nivel-lista';
      niveles[nivel].forEach(r=>{
        const item = document.createElement('div'); item.className='rasgo-lista-item';
        item.innerHTML = `<strong>${escapeHtml(r.nombre || 'Sin nombre')}</strong>`;
        lista.appendChild(item);
      });
      bloque.appendChild(lista);
      listaContenedor.appendChild(bloque);
    });
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

  btnAgregar.addEventListener('click', ()=>{
    const nombre = inpNombre.value.trim();
    if(!nombre){ alert('Introduce un nombre.'); return; }
    const libro = currentLibro(); if(!libro) return alert('Selecciona un libro.');
    const cat = selCategoria.value;
    if(cat==='clases'){
      // create class
      if(libro.clases[nombre]) return alert('La clase ya existe.');
      libro.clases[nombre] = { rasgos: [], subclases: [] }; save(); renderCategoria('clases'); inpNombre.value=''; return;
    }
    const obj = { nombre, descripcion: inpDesc.value.trim(), fuente: inpFuente.value.trim() };
    if(editState){ libro.categorias[editState.cat][editState.index] = obj; editState = null; tituloForm.textContent='Agregar item'; }
    else { libro.categorias[cat] = libro.categorias[cat] || []; libro.categorias[cat].push(obj); }
    save(); inpNombre.value=''; inpDesc.value=''; inpFuente.value=''; renderCategoria(cat);
  });

  btnExportar.addEventListener('click', ()=>{
    const data = JSON.stringify(window.libroReglas, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'libro_reglas.json'; a.click(); URL.revokeObjectURL(url);
  });

  btnImportar.addEventListener('click', ()=>{
    const raw = prompt('Pega aquí el JSON del libro de reglas para importar:');
    if(!raw) return;
    try{ const parsed = JSON.parse(raw); if(Array.isArray(parsed)) window.libroReglas = parsed; else alert('Formato inválido.'); save(); renderLibros(); renderCategoria(categoriaActiva); alert('Importado.'); }catch(e){ alert('JSON inválido.'); }
  });

  function escapeHtml(s){ return String(s||'').replace(/[&<>\"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  document.querySelectorAll('.categoria-btn').forEach(b=> b.classList.toggle('active', b.dataset.categoria===categoriaActiva));
  renderLibros(); renderCategoria(categoriaActiva);

})();
