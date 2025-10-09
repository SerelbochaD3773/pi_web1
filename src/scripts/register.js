const URL_API = 'https://68e7ebe8f2707e6128c96000.mockapi.io/create/registro';

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('registerForm');
  const botonEnviar = formulario.querySelector('button[type="submit"]');
  const cajaMensajes = document.getElementById('registerMessage');

  function mostrarMensaje(texto, tipo = 'info') {
    if (!cajaMensajes) return;
    cajaMensajes.textContent = texto;
    cajaMensajes.className = '';
    cajaMensajes.classList.add('p-3', 'rounded', 'mb-4');
    if (tipo === 'error') {
      cajaMensajes.classList.add('bg-red-600', 'text-white');
    } else if (tipo === 'exito') {
      cajaMensajes.classList.add('bg-green-600', 'text-white');
    } else {
      cajaMensajes.classList.add('bg-yellow-500', 'text-black');
    }
  }

  function validarEmail(email) {
    // Expresión regular simple para validar email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validarTelefono(telefono) {
    if (!telefono) return true; // opcional
    // Permitir dígitos, espacios, + y guiones. Al menos 7 dígitos.
    const digitos = telefono.replace(/[^0-9]/g, '');
    return digitos.length >= 7;
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Leer valores
    const datosFormulario = new FormData(formulario);
    const nombre = (datosFormulario.get('name') || '').toString().trim();
    const email = (datosFormulario.get('email') || '').toString().trim();
    const telefono = (datosFormulario.get('phone') || '').toString().trim();
    const contrasena = (datosFormulario.get('password') || '').toString();
    const confirmarContrasena = (datosFormulario.get('confirmPassword') || '').toString();

    // Validaciones
    if (!nombre) { mostrarMensaje('Ingresa tu nombre.', 'error'); return; }
    if (!email || !validarEmail(email)) { mostrarMensaje('Correo electrónico inválido.', 'error'); return; }
    if (!validarTelefono(telefono)) { mostrarMensaje('Teléfono inválido. Debe contener al menos 7 dígitos.', 'error'); return; }
    if (!contrasena || contrasena.length < 6) { mostrarMensaje('La contraseña debe tener al menos 6 caracteres.', 'error'); return; }
    if (contrasena !== confirmarContrasena) { mostrarMensaje('Las contraseñas no coinciden.', 'error'); return; }

    // Preparar carga de datos (payload)
    const cargaDatos = { nombre, email, telefono, contrasena };

    // Desactivar botón mientras se realiza la petición
    botonEnviar.disabled = true;
    const textoOriginalBoton = botonEnviar.textContent;
    botonEnviar.textContent = 'Creando...';
    mostrarMensaje('Enviando datos...', 'info');

    try {
      const respuesta = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cargaDatos),
      });

      if (!respuesta.ok) {
        // Intentar leer mensaje de error del cuerpo de la respuesta
        let textoError = `Error en la petición: ${respuesta.status} ${respuesta.statusText}`;
        try {
          const cuerpoError = await respuesta.json();
          if (cuerpoError && cuerpoError.message) textoError = cuerpoError.message;
        } catch (_) {}
        throw new Error(textoError);
      }

      const datos = await respuesta.json();
      // Éxito
      mostrarMensaje('Cuenta creada con éxito.', 'exito');
      formulario.reset();
      // Opcional: redirigir después de 2 segundos (comenta si no quieres)
      // setTimeout(() => { window.location.href = '../index.html'; }, 2000);
      console.log('Respuesta del servidor:', datos);
    } catch (err) {
      console.error(err);
      mostrarMensaje(err.message || 'Ocurrió un error al crear la cuenta.', 'error');
    } finally {
      botonEnviar.disabled = false;
      botonEnviar.textContent = textoOriginalBoton;
    }
  });
});