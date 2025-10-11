const MOCKAPI_APPTS_URL = 'https://68dedd3a898434f413563995.mockapi.io/ReseasApp';

let appointments = [];

const $appointments = document.getElementById('appointments');
const $apptTpl = document.getElementById('apptTpl');
const apptForm = document.getElementById('appointmentForm');

function renderAppts() {
  $appointments.innerHTML = '';
  if (!Array.isArray(appointments) || appointments.length === 0) {
    $appointments.innerHTML = '<div class="p-4 bg-yellow-50 rounded">No hay citas programadas.</div>';
    return;
  }

  for (const a of appointments) {
    const node = $apptTpl.content.cloneNode(true);
    node.querySelector('.appt-client').textContent = a.client || 'Sin nombre';
    node.querySelector('.appt-meta').textContent = `${a.date || ''} · ${a.time || ''} · ${a.service || ''}`;
    node.querySelector('.appt-notes').textContent = a.notes || '';
    const editBtn = node.querySelector('.editBtn');
    const deleteBtn = node.querySelector('.deleteBtn');
    editBtn.addEventListener('click', () => startEdit(a));
    deleteBtn.addEventListener('click', () => handleDelete(a.id));
    $appointments.appendChild(node);
  }
}

async function loadAppts() {
  if (!MOCKAPI_APPTS_URL || MOCKAPI_APPTS_URL.trim() === '') {
    $appointments.innerHTML = '<div class="p-4 bg-yellow-50 rounded">Configura MOCKAPI_APPTS_URL en app.js para cargar citas.</div>';
    return;
  }
  try {
    const res = await fetch(MOCKAPI_APPTS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    appointments = Array.isArray(data) ? data.map(d => ({ id: Number(d.id), client: d.client, date: d.date, time: d.time, service: d.service, notes: d.notes })) : [];
    renderAppts();
  } catch (err) {
    $appointments.innerHTML = `<div class="p-4 bg-red-50 text-red-800 rounded">Error cargando citas: ${err.message}</div>`;
  }
}

async function createAppt(payload) {
  const res = await fetch(MOCKAPI_APPTS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Error creando: ${res.status}`);
  return await res.json();
}

async function updateAppt(id, payload) {
  const res = await fetch(`${MOCKAPI_APPTS_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Error actualizando: ${res.status}`);
  return await res.json();
}

async function deleteAppt(id) {
  const res = await fetch(`${MOCKAPI_APPTS_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error borrando: ${res.status}`);
  return true;
}

function resetForm() {
  apptForm.reset();
  document.getElementById('aId').value = '';
  document.getElementById('formTitle').textContent = 'Crear cita';
  document.getElementById('submitBtn').textContent = 'Crear cita';
  document.getElementById('cancelBtn').classList.add('hidden');
}

function startEdit(a) {
  document.getElementById('aId').value = a.id;
  document.getElementById('aClient').value = a.client || '';
  document.getElementById('aDate').value = a.date || '';
  document.getElementById('aTime').value = a.time || '';
  document.getElementById('aService').value = a.service || '';
  document.getElementById('aNotes').value = a.notes || '';
  document.getElementById('formTitle').textContent = 'Editar cita';
  document.getElementById('submitBtn').textContent = 'Guardar cambios';
  document.getElementById('cancelBtn').classList.remove('hidden');
}

async function handleDelete(id) {
  if (!confirm('¿Borrar esta cita?')) return;
  try {
    await deleteAppt(id);
    await loadAppts();
  } catch (err) {
    alert('Error borrando cita: ' + err.message);
  }
}

apptForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('aId').value;
  const payload = {
    client: document.getElementById('aClient').value.trim(),
    date: document.getElementById('aDate').value,
    time: document.getElementById('aTime').value,
    service: document.getElementById('aService').value.trim(),
    notes: document.getElementById('aNotes').value.trim(),
  };
  try {
    if (!MOCKAPI_APPTS_URL || MOCKAPI_APPTS_URL.trim() === '') throw new Error('MOCKAPI_APPTS_URL no configurada');
    if (id && id.trim() !== '') {
      await updateAppt(id, payload);
    } else {
      await createAppt(payload);
    }
    resetForm();
    await loadAppts();
  } catch (err) {
    document.getElementById('formMsg').textContent = 'Error: ' + err.message;
    setTimeout(() => { document.getElementById('formMsg').textContent = ''; }, 3000);
  }
});

document.getElementById('cancelBtn').addEventListener('click', resetForm);

// Inicializar
loadAppts();
