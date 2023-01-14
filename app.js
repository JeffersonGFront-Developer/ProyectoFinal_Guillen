async function miPrograma() {
  const response = await fetch("productos.json");
  const stockProductos = await response.json();

  const contenedor = document.querySelector("#contenedor");
  const carritoContenedor = document.querySelector("#carritoContenedor");
  const vaciarCarrito = document.querySelector("#vaciarCarrito");
  const precioTotal = document.querySelector("#precioTotal");
  const activarFuncion = document.querySelector("#activarFuncion");
  const procesarCompra = document.querySelector("#procesarCompra");
  const totalProceso = document.querySelector("#totalProceso");
  const formulario = document.querySelector("#procesar-pago");

  const inputBusqueda = document.querySelector("#inputBusqueda");

  if (activarFuncion) {
    activarFuncion.addEventListener("click", procesarPedido);
    console.log(activarFuncion);
  }

  document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    mostrarCarrito();
    document.querySelector("#activarFuncion").click(procesarPedido);
  });
  if (formulario) {
    formulario.addEventListener("submit", enviarCompra);
  }

  if (vaciarCarrito) {
    vaciarCarrito.addEventListener("click", () => {
      carrito.length = [];
      mostrarCarrito();
    });
  }

  if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
      if (carrito.length === 0) {
        Swal.fire({
          title: "¡Tu carrito está vacio!",
          text: "Compra algo para continuar con la compra",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        location.href = "compra.html";
      }
    });
  }

  stockProductos.forEach((prod) => {
    const { id, nombre, precio, desc, img, cantidad } = prod;
    if (contenedor) {
      contenedor.innerHTML += `
    <div class="card mt-3" style="width: 29rem;">
    <img class="card-img-top mt-2" src="${img}" alt="Card image cap">
    <div class="card-body flex-grow-1">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text">Precio: $${precio}</p>
      <p class="card-text">Descripcion: ${desc}</p>
      <p class="card-text">Cantidad: ${cantidad}</p>
      <button class="btn btn-primary"; onclick="agregarProducto(${id})">Comprar Producto</button>
    </div>
  </div>
    `;
    }
  });

  const buscarProductos = (palabraClave) => {
    const productosEncontrados = stockProductos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(palabraClave.toLowerCase()) ||
        producto.desc.toLowerCase().includes(palabraClave.toLowerCase())
      );
    });
    return productosEncontrados;
  };

  window.agregarProducto = (id) => {
    const existe = carrito.some((prod) => prod.id === id);

    if (existe) {
      const prod = carrito.map((prod) => {
        if (prod.id === id) {
          prod.cantidad++;
        }
      });
    } else {
      const item = stockProductos.find((prod) => prod.id === id);
      carrito.push(item);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
  };

  const mostrarCarrito = () => {
    const modalBody = document.querySelector(".modal .modal-body");
    if (modalBody) {
      modalBody.innerHTML = "";
      carrito.forEach((prod) => {
        const { id, nombre, precio, desc, img, cantidad } = prod;
        console.log(modalBody);
        modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
        <img class="img-fluid img-carrito" src="${img}"/>
        </div>
        <div>
        <p>Producto: ${nombre}</p>
      <p>Precio: $${precio}</p>
      <p>Cantidad :${cantidad}</p>
      <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
        </div>
      </div>
      
  
      `;
      });
      inputBusqueda.addEventListener("input", (event) => {
        const productos = buscarProductos(event.target.value);
        contenedor.innerHTML = "";
        productos.forEach((producto) => {
          contenedor.innerHTML += `
    <div class="card mt-3" style="width: 29rem;">
    <img class="card-img-top mt-2" src="${producto.img}" alt="Card image cap">
    <div class="card-body flex-grow-1">
      <h5 class="card-title">${producto.nombre}</h5>
      <p class="card-text">Precio: $${producto.precio}</p>
      <p class="card-text">Descripcion: ${producto.desc}</p>
      <p class="card-text">Cantidad: ${producto.cantidad}</p>
      <button class="btn btn-primary"; onclick="agregarProducto(${producto.id})">Comprar Producto</button>
    </div>
  </div>
    `;
        });
      });
    }
    guardarStorage();

    if (carrito.length === 0) {
      console.log("Nada");
      modalBody.innerHTML = `
    <p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
    `;
    } else {
      console.log("Algo");
    }
    carritoContenedor.textContent = carrito.length;

    if (precioTotal) {
      precioTotal.innerText = carrito.reduce(
        (acc, prod) => acc + prod.cantidad * prod.precio,
        0
      );
    }
    guardarStorage();
    procesarPedido();
  };

  const eliminarProducto = (id) => {
    const juegoId = id;
    carrito = carrito.filter((juego) => juego.id !== juegoId);
    mostrarCarrito();
  };

  window.eliminarProducto = eliminarProducto;

  let carrito = [];

  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
  }
  guardarStorage();

  function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function procesarPedido() {
    carrito.forEach((prod) => {
      const listaCompra = document.querySelector("#lista-compra tbody");
      const { id, nombre, precio, img, cantidad } = prod;
      if (listaCompra) {
        const row = document.createElement("tr");
        row.innerHTML += `
              <td>
              <img class="img-fluid img-carrito" src="${img}"/>
              </td>
              <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>$${precio * cantidad}</td>
            `;
        listaCompra.appendChild(row);
      }
    });
    totalProceso.innerText = carrito.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,
      0
    );
  }

  procesarPedido();

  function enviarCompra(e) {
    e.preventDefault();
    const cliente = document.querySelector("#cliente").value;
    const email = document.querySelector("#correo").value;

    if (email === "" || cliente == "") {
      Swal.fire({
        title: "¡Debes completar tu email y nombre!",
        text: "Rellena el formulario",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      const btn = document.getElementById("button");

      // document.getElementById('procesar-pago')
      //  .addEventListener('submit', function(event) {
      //    event.preventDefault();

      btn.value = "Enviando...";

      const serviceID = "service_5cm45l3";
      const templateID = "template_uyio2rb";

      emailjs.sendForm(serviceID, templateID, this).then(
        () => {
          btn.value = "Finalizar compra";
          alert("Correo enviado!");
          // vacía el carrito después de enviar el correo electrónico
          carrito.length = 0;
          mostrarCarrito();
        },
        (err) => {
          btn.value = "Finalizar compra";
          alert(JSON.stringify(err));
          carrito.length = 0;
          mostrarCarrito();
        }
      );

      const spinner = document.querySelector("#spinner");
      spinner.classList.add("d-flex");
      spinner.classList.remove("d-none");

      setTimeout(() => {
        spinner.classList.remove("d-flex");
        spinner.classList.add("d-none");
        formulario.reset();

        const alertExito = document.createElement("p");
        alertExito.classList.add(
          "alert",
          "alerta",
          "d-block",
          "text-center",
          "col-12",
          "mt-2",
          "alert-success"
        );
        alertExito.textContent = "Compra realizada correctamente";
        formulario.appendChild(alertExito);

        setTimeout(() => {
          alertExito.remove();
        }, 3000);
      }, 3000);
    }
    localStorage.clear();
  }
}
miPrograma();
