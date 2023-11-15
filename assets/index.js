const productosContainer = document.querySelector(".productos-container");
const verMasBtn = document.querySelector(".btn-verMas");
const categoriasContainer = document.querySelector(".categorias");
const categoriasLista = document.querySelectorAll(".categoria");

const menuBtn = document.querySelector(".menu__hamburguer");
const cartBtn = document.querySelector(".cart-label");

const menuLinks = document.querySelector(".menu__links");
const cartMenu = document.querySelector(".cart");

const productsCart = document.querySelector(".cart-container");
const cartNumero = document.querySelector(".cart-numero");
const cartTotal = document.querySelector(".total");
const comprarBtn = document.querySelector(".btn-comprar");
const eliminarBtn = document.querySelector(".btn-eliminar");
const modalExitoso = document.querySelector(".agregar-modal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const productTemplate = (producto) => {
  const { id, nombre, precio, categoria, imagen } = producto;
  return `
    <div class="producto">
      <img src="${imagen}" alt="${nombre}" />
      <div class="producto-info">
        <div class="producto-nombre">
          <h3>${nombre}</h3>
        </div>
        <div class="producto-precio">
          <span>${precio} USD</span>
        </div>
        <div class="producto-button">
          <button
            class="btn-agregar"
            data-categoria="${categoria}"
            data-id="${id}"
            data-nombre="${nombre}"
            data-precio="${precio}"
            data-imagen="${imagen}"
        
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  `;
};

const toggleMenu = () => {
  menuLinks.classList.toggle("menu__hamburguer");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
  if (menuLinks.classList.contains("menu__hamburguer")) {
    menuLinks.classList.remove("menu__hamburguer");
    return;
  }
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class='empty-msg'> No hay productos en el carrito. </p>`;
    return;
  }
  productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
};

const createCartProductTemplate = (e, i) => {
  const { id, nombre, precio, categoria, imagen, quantity } = e;
  return `<div class="cart-item">
            <img src=${imagen} alt="Carrito" />
            <div class="item-info">
              <h3 class="item-title">${nombre}</h3>
              <p class="item-precio">Precio actual</p>
              <span class="item-price">${precio} USD</span>
       
            </div>
            <div class="item-handler">
              <span class="quantity-handler down" data-id=${id}>-</span>
              <span class="item-quantity">${quantity}</span>
              <span class="quantity-handler up" data-id=${id}>+</span>
            </div>
          </div>`;
};

const createProductData = (product) => {
  const { precio, id, nombre, imagen } = product;
  return { precio, id, nombre, imagen };
};

const agregarUnidad = (product) => {
  cart = cart.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};

const isCarritoExistente = (product) => {
  return cart.some((item) => item.id === product.id);
};

const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity: 1 }];
};

const agregarProducto = (e) => {
  if (!e.target.classList.contains("btn-agregar")) return;
  console.log(e.target.dataset);
  const product = createProductData(e.target.dataset);

  if (isCarritoExistente(product)) {
    agregarUnidad(product);
    showModalExitoso("");
    Swal.fire({
      title: "Se agregó una unidad más al carrito",
      text: "",
      icon: "success"
    });
  } else {
    createCartProduct(product);
    showModalExitoso("");
    Swal.fire({
      title: "Producto agregado al carrito",
      text: "",
      icon: "success"
    });
  }
  actualizarEstadoCarrito();
};

const renderCartNumero = () => {
  cartNumero.textContent = cart.reduce(
    (acumular, actual) => acumular + actual.quantity,
    0
  );
};

const showCartNumero = () => {
  cartNumero.textContent = cart.reduce(
    (acumular, actual) => acumular + actual.quantity,
    0
  );
};

const showCartTotal = () => {
  const total = cart.reduce(
    (acumular, actual) => acumular + Number(actual.precio) * actual.quantity,
    0
  );

  cartTotal.textContent = `${total.toFixed(2)} USD`;
};

const actualizarEstadoCarrito = () => {
  saveCart();
  renderCart();
  showCartTotal();
  renderCartNumero();
};

const handleCantidad = (e) => {
  if (e.target.classList.contains("down")) {
    handleProductoMenos(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handleProductoMas(e.target.dataset.id);
  }
  actualizarEstadoCarrito();
};

const handleProductoMenos = (id) => {
  const carritoExistente = cart.find((item) => item.id === id);
  console.log(carritoExistente);
  if (carritoExistente.quantity === 1) {
    removerProductoCarrito(carritoExistente);
    return;
  }
  restarUnidad(carritoExistente);
};

const removerProductoCarrito = (product) => {
  cart = cart.filter((prod) => prod.id !== product.id);
};

const restarUnidad = (product) => {
  cart = cart.map((prod) => {
    return prod.id === product.id
      ? { ...prod, quantity: Number(product.quantity) - 1 }
      : prod;
  });
};

const handleProductoMas = (id) => {
  const carritoExistente = cart.find((item) => item.id === id);
  agregarUnidad(carritoExistente);
};

const eliminarCarrito = () => {
  if (window.confirm("¿Confirma vaciar el carrito?")) {
    resetearCarrito();
    Swal.fire({
      title: "El carrito se encuentra vacío",
      text: "Puede retomar la compra.",
      icon: "success"
    });
  }
};

const resetearCarrito = () => {
  cart = [];
  actualizarEstadoCarrito();
};

const realizarCompra = () => {
  if (window.confirm("¿Confirma la compra?")) {
    resetearCarrito();
    Swal.fire({
      title: "Compra exitosa",
      text: "Muchas gracias por su compra.",
      icon: "success"
    });
  }
};

const showModalExitoso = (msg) => {
  modalExitoso.classList.add("active-modal");
  modalExitoso.textContent = msg;
  setTimeout(() => {
    modalExitoso.classList.remove("active-modal");
  }, 3000);
};

const renderProducts = (productosLista) => {
  productosContainer.innerHTML = productosLista.map(productTemplate).join("");
};

const mostrarMasProductos = () => {
  estadoApp.actualIndiceProductos += 1;
  const { productos, actualIndiceProductos, productosLimite } = estadoApp;
  renderProducts(productos[actualIndiceProductos]);
  if (actualIndiceProductos === productosLimite - 1) {
    verMasBtn.classList.add("hidden");
  }
};

const esInactivoFiltroBtn = (elemento) => {
  return (
    elemento.classList.contains("categoria") &&
    !elemento.classList.contains("active")
  );
};

const cambiarBtnEstadoActivo = (filter) => {
  const categorias = [...categoriasLista];
  categorias.forEach((btn) => {
    if (btn.dataset.categoria !== filter) {
      btn.classList.remove("active");
    } else {
      btn.classList.add("active");
    }
  });
};

const setMostrarMasProductos = () => {
  if (!estadoApp.activarFiltro) {
    verMasBtn.classList.remove("hidden");
    return;
  }
  verMasBtn.classList.add("hidden");
};

const cambiarFiltroEstado = (element) => {
  estadoApp.activarFiltro = element.dataset.categoria;
  cambiarBtnEstadoActivo(estadoApp.activarFiltro);
  setMostrarMasProductos();
};

const renderizarProductosFiltrados = () => {
  const { activarFiltro, actualIndiceProductos } = estadoApp;
  productosContainer.innerHTML = "";
  if (!activarFiltro) {
    estadoApp.actualIndiceProductos = 0;
    renderProducts(estadoApp.productos[actualIndiceProductos]);
    return;
  }
  const filteredProducts = productosData.filter(
    (producto) => producto.categoria === activarFiltro
  );
  renderProducts(filteredProducts);
};

const aplicarFiltro = ({ target }) => {
  if (!esInactivoFiltroBtn(target)) return;
  cambiarFiltroEstado(target);
  renderizarProductosFiltrados();
};

(function () {
  const listElements = document.querySelectorAll(".menu__item");
  const list = document.querySelector(".menu__links");
  const menu = document.querySelector(".menu__hamburguer");

  const addClick = () => {
    listElements.forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.toggle("menu__item--active");
      });
    });
  };

  menu.addEventListener("click", () =>
    list.classList.toggle("menu__links--show")
  );
})();

const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const msgInput = document.getElementById("msg");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const msgError = document.getElementById("msg-error");
const mensajeExitoso = document.getElementById("success-message");

form.addEventListener("submit", function (event) {
  let valid = true;

  const name = nameInput.value;
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    nameError.textContent =
      "Nombre inválido. Solo se permiten letras y espacios.";
    valid = false;
  } else {
    nameError.textContent = "";
  }

  const email = emailInput.value;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    emailError.textContent = "Dirección de correo electrónico inválida.";
    valid = false;
  } else {
    emailError.textContent = "";
  }

  const msg = msgInput.value;
  if (msg.trim() === "") {
    msgError.textContent = "El mensaje no puede estar vacío.";
    valid = false;
  } else {
    msgError.textContent = "";
  }

  if (!valid) {
    event.preventDefault();
  } else {
    mensajeExitoso.style.display = "block";
    mensajeExitoso.textContent = "El formulario fue enviado con éxito.";
  }
});

const init = () => {
  renderProducts(estadoApp.productos[estadoApp.actualIndiceProductos]);
  verMasBtn.addEventListener("click", mostrarMasProductos);
  categoriasContainer.addEventListener("click", aplicarFiltro);

  menuBtn.addEventListener("click", toggleMenu);
  cartBtn.addEventListener("click", toggleCart);
  window.addEventListener("DOMContentLoaded", renderCart);
  window.addEventListener("DOMContentLoaded", showCartNumero);
  window.addEventListener("DOMContentLoaded", showCartTotal);
  productosContainer.addEventListener("click", agregarProducto);
  productsCart.addEventListener("click", handleCantidad);
  comprarBtn.addEventListener("click", realizarCompra);
  eliminarBtn.addEventListener("click", eliminarCarrito);
};

init();
