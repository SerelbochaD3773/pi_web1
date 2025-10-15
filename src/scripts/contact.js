document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validación básica
    const nombre = form.elements["nombre"].value.trim();
    const email = form.elements["email"].value.trim();
    const mensaje = form.elements["mensaje"].value.trim();
    let error = "";

    if (!nombre) error += "El nombre es obligatorio.\n";
    if (!email) error += "El email es obligatorio.\n";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      error += "El email no es válido.\n";
    if (!mensaje) error += "El mensaje es obligatorio.\n";

    if (error) {
      alert(error);
      return;
    }

    // Si todo está bien, muestra mensaje de confirmación
    alert("¡Gracias por contactarnos! Tu mensaje ha sido enviado.");
    form.reset();
  });
});
ocument.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validación básica
    const nombre = form.elements["nombre"].value.trim();
    const email = form.elements["email"].value.trim();
    const mensaje = form.elements["mensaje"].value.trim();
    let error = "";

    if (!nombre) error += "El nombre es obligatorio.\n";
    if (!email) error += "El email es obligatorio.\n";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      error += "El email no es válido.\n";
    if (!mensaje) error += "El mensaje es obligatorio.\n";

    if (error) {
      alert(error);
      return;
    }
    // Si todo está bien, muestra mensaje de confirmación
    alert("¡Gracias por contactarnos! Tu mensaje ha sido enviado.");
    form.reset();
  });
});
