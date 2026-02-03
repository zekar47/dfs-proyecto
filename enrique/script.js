// Cambiar avatar
document.getElementById("avatar-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("avatar").src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Cambiar color de fondo
document.getElementById("bg-color").addEventListener("input", function (e) {
  document.body.style.backgroundImage = "";
  document.body.style.backgroundColor = e.target.value;
});

// Cambiar imagen de fondo
document.getElementById("bg-image").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.body.style.backgroundImage = `url(${event.target.result})`;
    };
    reader.readAsDataURL(file);
  }
});
