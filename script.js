const tablaProductos = db.collection('productos');

let epsilon = 3;

document.addEventListener("DOMContentLoaded", () => {
  const $resultados = document.querySelector("#resultado");
  const $nombre = document.querySelector("#nombre");
  const $precio = document.querySelector("#precio");
  let isCameraActive = true;

  Quagga.init({
    inputStream: {
      constraints: {
        width: 1920,
        height: 1080,
      },
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#contenedor'),
    },
    decoder: {
      readers: ["ean_reader"]
    }
  }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Iniciado correctamente");
    isCameraActive = true;
    Quagga.start();
  });

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  Quagga.onDetected(async (data) => {
    let code = data.codeResult.code;
    $resultados.textContent = code;
    let prod = tablaProductos.where("id", "==", code).get();

    while (epsilon > 0 && prod.empty) {
      code = code.slice(1); // Quita el primer dígito de la cadena
      prod = tablaProductos.where("id", "==", code).get();
      epsilon--;
    }

    if (!prod.empty) {
      if (isCameraActive) {
        Quagga.stop();
        isCameraActive = false;
        const $contenedor = document.querySelector('#contenedor');
        $contenedor.style.display = 'none';
      }

      const producto = prod.docs[0].data();
      $nombre.innerHTML = `<h3>${producto.nombre}</h3>`;
      $precio.innerHTML = `<h4>${producto.precio}</h4>`;

      await delay(5000); // Espera 5 segundos utilizando la función delay

      $nombre.innerHTML = ""; // Corregir aquí
      $precio.innerHTML = ""; // Corregir aquí
      const $contenedor = document.querySelector('#contenedor');
      $contenedor.style.display = 'block';

      if (!isCameraActive) {
        Quagga.start();
        isCameraActive = true;
      }
    } else {
      console.log("Ese producto no existe");
      // Aquí puedes agregar lógica adicional si deseas hacer algo cuando el producto no existe
    }

    console.log(data);
  });

  Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width")),
          parseInt(drawingCanvas.getAttribute("height"))
        );
        result.boxes
          .filter(function (box) {
            return box !== result.box;
          })
          .forEach(function (box) {
            Quagga.ImageDebug.drawPath(
              box,
              { x: 0, y: 1 },
              drawingCtx,
              { color: "green", lineWidth: 2 }
            );
          });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(
          result.box,
          { x: 0, y: 1 },
          drawingCtx,
          { color: "#00F", lineWidth: 2 }
        );
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(
          result.line,
          { x: "x", y: "y" },
          drawingCtx,
          { color: "red", lineWidth: 3 }
        );
      }
    }
  });
});
