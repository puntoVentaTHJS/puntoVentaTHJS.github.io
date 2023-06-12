const tablaProductos = db.collection('productos');

document.addEventListener("DOMContentLoaded", () => {
  const $resultados = document.querySelector("#resultado");
  let isCameraActive = true;

  Quagga.init({
    inputStream: {
      constraints: {
        width: 1920,
        height: 1080,
      },
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#contenedor'), // Pasar el elemento del DOM
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
    Quagga.start();
  });

  Quagga.onDetected((data) => {
    $resultados.textContent = data.codeResult.code;
    const prod = tablaProductos.where("id", "==", data.codeResult.code).get();
    if (!prod.empty) {
      // Quitar la vista de cámara y mostrar un texto con prod en su campo nombre,
      // y por debajo su precio, esperar 5 segundos y volver a mostrar la cámara
      Quagga.stop();
      isCameraActive = false;
      const producto = prod.docs[0].data(); // Suponiendo que solo hay un resultado
      const $infoProducto = document.querySelector("#info-producto");
      $infoProducto.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>Precio: ${producto.precio}</p>
      `;
      setTimeout(() => {
        $infoProducto.innerHTML = "";
        if (!isCameraActive) {
          Quagga.start();
          isCameraActive = true;
        }
      }, 5000);
    } else {
      console.log("Ese producto no existe");
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
