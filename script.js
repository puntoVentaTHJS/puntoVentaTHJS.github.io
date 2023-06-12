const tablaProductos = db.collection('productos');

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

  Quagga.onDetected((data) => {
    $resultados.textContent = data.codeResult.code;
    const prod = tablaProductos.where("id", "==", data.codeResult.code).get();
    if (!prod.empty) {
      if (isCameraActive) {
        Quagga.stop();
        isCameraActive = false;
        //Ocultar o eliminar temporalmente la parte de la cámara
        const $contenedor = document.querySelector('#contenedor');
        $contenedor.style.display = 'none';
      }

      const producto = prod.docs[0].data();
      nombre.innerHTML = `<h3>${producto.nombre}</h3>`;
      precio.innerHTML = `<h4>${producto.precio}</h4>`
      setTimeout(() => {
        $nombre = "";
        $precio = "";
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
