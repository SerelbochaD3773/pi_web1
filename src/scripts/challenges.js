const MOCKAPI_DESAFIOS_URL = 'https://68f05b760b966ad50032a281.mockapi.io/desafios';

// VARIABLES GLOBALES
let desafios = [];
let desafioEditando = null;
let desafioActivo = null;

// ELEMENTOS DEL DOM
const btnNuevoDesafio = document.getElementById('btnNuevoDesafio');
const formularioDesafio = document.getElementById('formularioDesafio');
const tituloFormulario = document.getElementById('tituloFormulario');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const listaDesafios = document.getElementById('listaDesafios');
const loading = document.getElementById('loading');
const estadisticas = document.getElementById('estadisticas');

const inputNombre = document.getElementById('inputNombre');
const inputCategoria = document.getElementById('inputCategoria');
const inputDificultad = document.getElementById('inputDificultad');
const inputPuntos = document.getElementById('inputPuntos');
const inputDescripcion = document.getElementById('inputDescripcion');

const buscarDesafio = document.getElementById('buscarDesafio');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroDificultad = document.getElementById('filtroDificultad');

// Obtener todos los desafíos
async function obtenerDesafios() {
  try {
    loading.classList.remove('hidden');
    const response = await fetch(MOCKAPI_DESAFIOS_URL);
    if (!response.ok) throw new Error('Error al obtener desafíos');
    desafios = await response.json();
    loading.classList.add('hidden');
    renderizarDesafios();
    actualizarEstadisticas();
  } catch (error) {
    loading.classList.add('hidden');
    console.error('Error:', error);
    alert('Error al cargar los desafíos. Verifica tu conexión a MockAPI.');
  }
}

// Crear nuevo desafío
async function crearDesafio(desafio) {
  try {
    const response = await fetch(MOCKAPI_DESAFIOS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(desafio)
    });
    if (!response.ok) throw new Error('Error al crear desafío');
    await obtenerDesafios();
    return true;
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear el desafío: ' + error.message);
    return false;
  }
}

// Actualizar desafío
async function actualizarDesafio(id, desafio) {
  try {
    const response = await fetch(`${MOCKAPI_DESAFIOS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(desafio)
    });
    if (!response.ok) throw new Error('Error al actualizar desafío');
    await obtenerDesafios();
    return true;
  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar el desafío: ' + error.message);
    return false;
  }
}

// Eliminar desafío
async function eliminarDesafio(id) {
  try {
    const response = await fetch(`${MOCKAPI_DESAFIOS_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar desafío');
    await obtenerDesafios();
    return true;
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar el desafío: ' + error.message);
    return false;
  }
}

function renderizarDesafios() {
  const textoBusqueda = buscarDesafio.value.toLowerCase();
  const categoriaSeleccionada = filtroCategoria.value;
  const dificultadSeleccionada = filtroDificultad.value;

  const desafiosFiltrados = desafios.filter(d => {
    const cumpleBusqueda = d.nombre.toLowerCase().includes(textoBusqueda);
    const cumpleCategoria = categoriaSeleccionada === 'Todas' || d.categoria === categoriaSeleccionada;
    const cumpleDificultad = dificultadSeleccionada === 'Todas' || d.dificultad === dificultadSeleccionada;
    return cumpleBusqueda && cumpleCategoria && cumpleDificultad;
  });

  if (desafiosFiltrados.length === 0) {
    listaDesafios.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-white text-lg">No hay desafíos para mostrar</p>
      </div>
    `;
    return;
  }

  listaDesafios.innerHTML = desafiosFiltrados.map(desafio => `
    <div class="bg-[#5A3A2E] rounded-lg shadow-lg p-6 border-l-4 border-[#C19A6B] hover:shadow-xl transition-shadow">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-bold text-white flex-1">${desafio.nombre}</h3>
        <div class="flex gap-2">
          <button onclick="editarDesafio(${desafio.id})" class="text-[#C19A6B] hover:text-[#D2B48C]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button onclick="confirmarEliminar(${desafio.id}, '${desafio.nombre.replace(/'/g, "\\'")}' )" class="text-red-400 hover:text-red-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        <span class="bg-[#714C3A] text-[#C19A6B] px-3 py-1 rounded-full text-sm font-semibold">${desafio.categoria}</span>
        <span class="bg-[#714C3A] text-white px-3 py-1 rounded-full text-sm font-semibold">${desafio.dificultad}</span>
        <span class="bg-[#714C3A] text-[#C19A6B] px-3 py-1 rounded-full text-sm font-semibold">⭐ ${desafio.puntos} pts</span>
      </div>

      <p class="text-gray-300 text-sm mb-4">${desafio.descripcion}</p>

      <button onclick="iniciarDesafio(${desafio.id})" class="w-full bg-[#C19A6B] hover:bg-[#D2B48C] text-[#5A3A2E] font-semibold py-2 rounded-lg transition-colors">
        Comenzar Desafío
      </button>
    </div>
  `).join('');

  actualizarEstadisticas();
}

function actualizarEstadisticas() {
  if (desafios.length === 0) {
    estadisticas.classList.add('hidden');
    return;
  }

  estadisticas.classList.remove('hidden');
  
  const totalFaciles = desafios.filter(d => d.dificultad === 'Fácil').length;
  const totalIntermedios = desafios.filter(d => d.dificultad === 'Intermedio').length;
  const totalAvanzados = desafios.filter(d => d.dificultad === 'Difícil' || d.dificultad === 'Experto').length;

  document.getElementById('totalDesafios').textContent = desafios.length;
  document.getElementById('totalFaciles').textContent = totalFaciles;
  document.getElementById('totalIntermedios').textContent = totalIntermedios;
  document.getElementById('totalAvanzados').textContent = totalAvanzados;
}

function mostrarFormulario(editar = false) {
  formularioDesafio.classList.remove('hidden');
  tituloFormulario.textContent = editar ? 'Editar Desafío' : 'Nuevo Desafío';
}

function ocultarFormulario() {
  formularioDesafio.classList.add('hidden');
  limpiarFormulario();
  desafioEditando = null;
}

function limpiarFormulario() {
  inputNombre.value = '';
  inputCategoria.value = 'Lógica';
  inputDificultad.value = 'Fácil';
  inputPuntos.value = '10';
  inputDescripcion.value = '';
}

function editarDesafio(id) {
  const desafio = desafios.find(d => d.id == id);
  if (!desafio) return;

  desafioEditando = desafio;
  inputNombre.value = desafio.nombre;
  inputCategoria.value = desafio.categoria;
  inputDificultad.value = desafio.dificultad;
  inputPuntos.value = desafio.puntos;
  inputDescripcion.value = desafio.descripcion;
  
  mostrarFormulario(true);
}

async function guardarDesafio() {
  if (!inputNombre.value || !inputDescripcion.value) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }

  const desafio = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    dificultad: inputDificultad.value,
    puntos: parseInt(inputPuntos.value),
    descripcion: inputDescripcion.value.trim()
  };

  let exito;
  if (desafioEditando) {
    exito = await actualizarDesafio(desafioEditando.id, desafio);
  } else {
    exito = await crearDesafio(desafio);
  }

  if (exito) {
    ocultarFormulario();
  }
}

function confirmarEliminar(id, nombre) {
  if (confirm(`¿Estás seguro de eliminar el desafío "${nombre}"?`)) {
    eliminarDesafio(id);
  }
}

//Ejecutar desafío

function iniciarDesafio(id) {
  const desafio = desafios.find(d => d.id == id);
  if (!desafio) return;

  desafioActivo = desafio;
  mostrarModalDesafio(desafio);
}

function mostrarModalDesafio(desafio) {
  // Crear modal
  const modal = document.createElement('div');
  modal.id = 'modalDesafio';
  modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-[#5A3A2E] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-[#714C3A] p-6 border-b-2 border-[#C19A6B]">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">${desafio.nombre}</h2>
            <div class="flex gap-2">
              <span class="bg-[#5A3A2E] text-[#C19A6B] px-3 py-1 rounded-full text-sm font-semibold">${desafio.categoria}</span>
              <span class="bg-[#5A3A2E] text-white px-3 py-1 rounded-full text-sm font-semibold">${desafio.dificultad}</span>
              <span class="bg-[#5A3A2E] text-[#C19A6B] px-3 py-1 rounded-full text-sm font-semibold">⭐ ${desafio.puntos} pts</span>
            </div>
          </div>
          <button onclick="cerrarModalDesafio()" class="text-white hover:text-[#C19A6B] transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="mb-6">
          <h3 class="text-lg font-bold text-white mb-3">📋 Descripción del Desafío</h3>
          <p class="text-gray-300 whitespace-pre-wrap">${desafio.descripcion}</p>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-bold text-white mb-3">💻 Escribe tu código JavaScript</h3>
          <textarea 
            id="codigoUsuario" 
            class="w-full h-64 px-4 py-3 bg-[#714C3A] text-white rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B] border border-[#C19A6B]"
            placeholder="// Escribe tu solución aquí...
function solucion() {
  // Tu código
  return resultado;
}

// Ejemplo:
// return 'Hola Mundo';"
          ></textarea>
        </div>

        <div id="resultadoEjecucion" class="hidden mb-4">
          <h3 class="text-lg font-bold text-white mb-3">📊 Resultado</h3>
          <div id="resultadoContenido" class="bg-[#714C3A] rounded-lg p-4 border-l-4"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-[#714C3A] p-6 border-t-2 border-[#C19A6B] flex gap-3">
        <button 
          onclick="ejecutarCodigo()" 
          class="flex-1 bg-[#C19A6B] hover:bg-[#D2B48C] text-[#5A3A2E] font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Ejecutar Código
        </button>
        <button 
          onclick="cerrarModalDesafio()" 
          class="bg-[#5A3A2E] hover:bg-[#A57E5A] text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function cerrarModalDesafio() {
  const modal = document.getElementById('modalDesafio');
  if (modal) {
    modal.remove();
  }
  desafioActivo = null;
}

function ejecutarCodigo() {
  const codigoUsuario = document.getElementById('codigoUsuario').value;
  const resultadoDiv = document.getElementById('resultadoEjecucion');
  const resultadoContenido = document.getElementById('resultadoContenido');

  if (!codigoUsuario.trim()) {
    mostrarResultado('Por favor, escribe algo de código primero.', 'error');
    resultadoDiv.classList.remove('hidden');
    // Desplazar al resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  resultadoDiv.classList.remove('hidden');

  try {
    // Capturar console.log
    let consoleOutput = [];
    const originalLog = console.log;
    console.log = function(...args) {
      consoleOutput.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalLog.apply(console, args);
    };

    // Ejecutar código del usuario
    const resultado = eval(codigoUsuario);

    // Restaurar console.log
    console.log = originalLog;

    // Mostrar resultado
    let mensaje = '';
    
    if (consoleOutput.length > 0) {
      mensaje += '<div class="mb-3"><strong class="text-[#C19A6B]">📝 Console output:</strong><pre class="mt-2 text-gray-300">' + consoleOutput.join('\n') + '</pre></div>';
    }
    
    if (resultado !== undefined) {
      mensaje += '<div><strong class="text-[#C19A6B]">✅ Resultado:</strong><pre class="mt-2 text-white font-mono">' + 
        (typeof resultado === 'object' ? JSON.stringify(resultado, null, 2) : String(resultado)) + 
        '</pre></div>';
    }

    if (!mensaje) {
      mensaje = '<p class="text-gray-300">Código ejecutado correctamente (sin output)</p>';
    }

    mostrarResultado(mensaje, 'success');

  } catch (error) {
    mostrarResultado(`<strong class="text-red-400">❌ Error:</strong><pre class="mt-2 text-white">${error.message}</pre>`, 'error');
  }
}

function mostrarResultado(mensaje, tipo) {
  const resultadoContenido = document.getElementById('resultadoContenido');
  
  if (tipo === 'success') {
    resultadoContenido.className = 'bg-[#714C3A] rounded-lg p-4 border-l-4 border-green-500';
  } else {
    resultadoContenido.className = 'bg-[#714C3A] rounded-lg p-4 border-l-4 border-red-500';
  }
  
  resultadoContenido.innerHTML = mensaje;
}

//Configuración de clicks y acciones de la página

btnNuevoDesafio.addEventListener('click', () => mostrarFormulario());
btnCancelar.addEventListener('click', ocultarFormulario);
btnGuardar.addEventListener('click', guardarDesafio);

buscarDesafio.addEventListener('input', renderizarDesafios);
filtroCategoria.addEventListener('change', renderizarDesafios);
filtroDificultad.addEventListener('change', renderizarDesafios);

window.addEventListener('DOMContentLoaded', () => {
  obtenerDesafios();
  
  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('modalDesafio')) {
      cerrarModalDesafio();
    }
  });
});

// Hacer funciones globales para onclick del HTML
window.editarDesafio = editarDesafio;
window.confirmarEliminar = confirmarEliminar;
window.iniciarDesafio = iniciarDesafio;
window.cerrarModalDesafio = cerrarModalDesafio;
window.ejecutarCodigo = ejecutarCodigo;