//////////////////////////////////////////////////////////////
///// ENTREGA FINAL - SIMULADOR DE TIENDA PARA DIETÉTICA ////
/////////////////// NAHUEL RODRIGUES ////////////////////////
/////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
////////////////// CREANDO OBJETOS Y ARRAYS ////////////////
////////////////////////////////////////////////////////////

// Declaro variable del precio del envio
let precioEnvio = 350;

// Clase Producto
class Producto {
  constructor(id, nombre, precio, categoria, estrellas) {
    this.id = id;
    this.nombre = nombre;
    this.precio = Number(precio);
    this.categoria = categoria;
  }
  // Método : calcular iva
  sumaIva() {
    return this.precio * 1.21;
  }
  // Método : calcular iva + envío
  sumaEnvio() {
    return this.precio * 1.21 + precioEnvio;
  }
}

//////////////////////////////////////////
//////////////  GETJSON  /////////////////
//////////////////////////////////////////

// URL de mi archivo JSON
const URLJSON = "productos.json";

// Declaramos un array vacío para almacenar los productos
const productos = [];

// Pido URL JSON
$.getJSON(URLJSON, function (respuesta, estado) {
  if (estado === "success") {
    let misDatos = respuesta;

    // ARMO UN ARRAY CON LOS PRODUCTOS DEL ARCHIVO JSON
    for (const producto of misDatos) {
      productos.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
      });
    }
    // Recorro mis productos y genero un div "caja" por cada producto
    for (const dato of misDatos) {
      $("#contenedorProductos").append(crearProducto(dato));
    }
  }
});

// API DE WHATSAPP - Contacta al usuario con un mensaje prediseñado al dueño de la tienda.
function wsp(string, numero) {
  window.open(
    `https://api.whatsapp.com/send?phone=+541122709412&text=Hola, estoy interesado en su producto ${string} de $${numero} quisiera saber más información sobre el producto.`,
    "_blank"
  );
}

////////////////////////////////////////////////////////////
//////////////////// FILTROS ///////////////////////////////
////////////////////////////////////////////////////////////

//////////////////// FILTRO DE BUSQUEDA ////////////////////
function crearProducto(producto) {
  return (
    `<div id="caja" class="box"><span class="discount">-20%</span><div class="icons"></a><a href="#contenedorCarrito" onclick="agregarProductosCarrito(${producto.id},${producto.precio},'${producto.nombre}')" class="fas fa-shopping-cart"></a><a onclick="wsp('${producto.nombre}',${producto.precio})" href="#" class="fab fa-whatsapp"></a></div><img src="images/product` +
    producto.id +
    `.jpg" alt="" /><h3 id="titulo1">` +
    producto.nombre +
    `</h3><div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div><div class="quantity"><span> Cantidad : </span><input id="inputKilo${producto.id}" type="number" min="1" max="100" value="1" /></div><div id="precio1" class="price">$` +
    producto.precio +
    `<span></span></div><a href="#contenedorCarrito" id="${producto.id}" onclick="agregarProductosCarrito(${producto.id},${producto.precio},'${producto.nombre}')"  class="btn btn-carrito">Agregar al carrito</a></div>`
  );
}
// Filtro los productos desde la barra de búsqueda
$("#buscar").keypress((e) => {
  const busqueda = e.target.value.toLowerCase();
  const resultados = productos.filter((producto) => {
    const nombre = producto.nombre.toLowerCase();
    const categoria = producto.categoria.toLowerCase();
    return nombre.includes(busqueda) || categoria.includes(busqueda);
  });
  $("#contenedorProductos").empty().append(resultados.map(crearProducto));
});

//////////////////// FILTRO POR CATEGORIA ////////////////////

// Filtro los productos por categoría
$(".buscarCategoria").click(buscarCategoria);
function buscarCategoria(event) {
  const categoria = event.target.parentElement.innerText
    .split("\n")[0]
    .toLowerCase();
  const resultados = productos.filter((producto) => {
    return producto.categoria.toLowerCase() === categoria;
  });
  $("#contenedorProductos").empty().append(resultados.map(crearProducto));
}

//////////// GUARDO EN LOCAL STORAGE Y JSON //////////////////

// Guardo los productos en el LocalStorage
const guardarLocal = (clave, valor) => {
  localStorage.setItem(clave, valor);
};
// Recorro el array de productos y lo convierto en JSON
for (const producto of productos) {
  guardarLocal(producto.id, JSON.stringify(producto));
}
////////////////////////////////////////////////////////////
//////////////////// CARRITO ///////////////////////////////
////////////////////////////////////////////////////////////

// INICIALIZO MI CARRITO EN 0 EN LOCALSTORAGE
const totalCarrito = 0;
localStorage.setItem("Total-Carrito", totalCarrito);

// Creo el CARRITO con su resultado total de la compra (inicializado en 0)
let carritoTotal = document.createElement("div");
carritoTotal.innerHTML =
  "El total de su compra es de <strong>$ " +
  localStorage.getItem("Total-Carrito");
carritoTotal.id = "carritoTotal";
contenedorCarrito.appendChild(carritoTotal);

///////////////////////////////////////////////////////////
//////////////// FUNCIONES CARRITO ////////////////////////
///////////////////////////////////////////////////////////

// Agrego botón de agregar carrito
function accionBoton() {
  const btnCarrito = document.getElementsByClassName("btn-carrito");
  // RECORRO TODOS LOS BOTONES
  for (const boton of btnCarrito) {
    boton.addEventListener("click", (event) => {
      const botonClick = event.target;
      let productoAgregado = productos.find((data) => data.id == botonClick.id);
      agregarProductosCarrito(
        productoAgregado.id,
        productoAgregado.precio,
        productoAgregado.nombre
      );
    });
  }
}

// AGREGO PRODUCTOS AL CARRITO
function agregarProductosCarrito(id, precio, nombre) {
  // GUARDO EL VALOR INDEXADO POR USUARIO
  let cantidad = document.getElementById(`inputKilo${id}`).value;
  // MULTIPLICO CANTIDAD DE UNIDADES POR PRECIO DEL PRODUCTO
  let precioProducto = parseInt(cantidad) * precio;
  let carrito = document.createElement("div");
  let productosAgregados = document.getElementById("productosAgregados");
  // GENERO UN DIV POR CADA PRODUCTO AGREGADO
  carrito.innerHTML =
    nombre +
    " x " +
    cantidad +
    "u = $ " +
    parseFloat(precioProducto).toFixed(2);
  carrito.id = "carrito";
  // lo agrego
  productosAgregados.appendChild(carrito);
  // calculo total
  sumarTotal(precioProducto);
  // actualizo estado de carrito
  actualizarCarrito();
}

// Creo funcion para sumar el total de las compras
function sumarTotal(precioSumar) {
  // tomo el valor actual de localStorage
  let totalActual = Number(localStorage.getItem("Total-Carrito"));
  let sumaTotal = totalActual + precioSumar;
  // y lo guardo actualizado
  localStorage.setItem("Total-Carrito", sumaTotal);
}

// Creo función para actualizar el estado del Carrito y agrego el precio con envío.
function actualizarCarrito() {
  let precioFinalConEnvio =
    parseFloat(localStorage.getItem("Total-Carrito")) + precioEnvio;
  carritoTotal.innerHTML =
    "El total de su compra es de <strong>$ " +
    parseFloat(localStorage.getItem("Total-Carrito")).toFixed(2) +
    "<br></strong>El total de su compra con envío es de <strong>$ " +
    parseFloat(precioFinalConEnvio).toFixed(2);
}

////////////////////////////////////////////////////////////////
///////////////////     FORMULARIO     /////////////////////////
////////////////////////////////////////////////////////////////

const miFormulario = document.getElementById("formulario");
let botonEnviar = document.getElementById("btnEnviar");
const evento2 = "click";

// Creo función para validar los inputs
function validacion() {
  if (
    formulario.input1.value &&
    formulario.input2.value &&
    formulario.input3.value &&
    formulario.input4.value
  )
    submit();
  else {
    if (!!document.getElementById("btnRespuesta"))
      formulario.removeChild(btnRespuesta);
  }
}
// Escucho el evento del usuario.
botonEnviar.addEventListener(evento2, validacion);
let formularioEnviado = false;

// Creo función para enviar un SweetAlert al usuario.
function submit() {
  // creo un flag
  if (!formularioEnviado) {
    formularioEnviado = true;
    swal("Enviado!", "Su formulario fue enviado correctamente!", "success");
  }
}

///////////////////////////////////////////////////////////////
/////////////// EVENTO : ANIMACIONES & INTERACCIONES //////////
///////////////////////////////////////////////////////////////

// PUBLICIDAD POP-UP
// Apendeo con display none una publi
$("body").prepend(
  '<div class="ads-popup" id="js-iframeremove" style="display: none"><div class="ads-popup-wrap"><div class="ads-popup-overlay"></div><div class="ads-popup-container"><img id="img-popup"src="images/pop-up.jpg" alt=""><div class="ads-popup-close">&times;</div></div></div></div>'
);
// Que aparezca a los 5 secs de navegación
$(".ads-popup").css("opacity", "1").slideUp(2000).delay(5000).slideDown(2000);
// Click cerrar ventana y desaparecer
$(".ads-popup-overlay, .ads-popup-close").click(function () {
  $(".ads-popup-wrap").fadeOut();
});

// SIGN IN & LOG IN DEL USUARIO
// APPENDEO AL BODY UN DIV (SIGN UP) OCULTO PARA QUE EL USUARIO INGRESE
$("body").append(`<div id="signup" style="display: none">
<div id="signup-ct">
  <div id="signup-header">
    <h2>Iniciar sesión</h2>
    <p>¿No tienes una cuenta? <a href="#">Registrate!</a></p>
  </div>

  <form action="">
    <div class="txt-fld">
      <label for="">Usuario</label>
      <input name="" type="text" required/>
    </div>
    <div class="txt-fld">
      <label for="">E-mail</label>
      <input  name="" type="email" required />
    </div>
    <div class="txt-fld">
      <label for="">Contraseña</label>
      <input  name="" type="password" required />
    </div>
    <div class="btn-fld">
      <button type="submit">Entrar</button>
    </div>
  </form>
</div>
</div> `);

// MENÚ RESPONSIVE
// Declarando variables Y querySelectors
let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");
let header = document.querySelector(".header-3");
let scrollTop = document.querySelector(".scroll-top");

// Si el usuario hace click en #menu-bar(icono de menu fa-bars )
menu.addEventListener("click", () => {
  // que cambie a fa-times (icono crucecita de salida)
  menu.classList.toggle("fa-times");
  //y despliegue el navbar
  navbar.classList.toggle("active");
});

// SCROLLING Y BOTÓN PARA VOLVER HACIA ARRIBA
//Si el usuario scrollea
window.onscroll = () => {
  //quita fa-times
  menu.classList.remove("fa-times");
  //quita el navbar desplegable
  navbar.classList.remove("active");

  //Si el usuario scrollea + de 250px en el eje Y
  if (window.scrollY > 250) {
    //agrega el header 3
    header.classList.add("active");
  } else {
    //quita el header 3
    header.classList.remove("active");
  }

  //Si el usuario scrollea + de 250px en el eje Y
  if (window.scrollY > 250) {
    //fija al inicio
    scrollTop.style.display = "initial";
  } else {
    //nada
    scrollTop.style.display = "none";
  }
};

// GALERÍA DE IMÁGENES SWIPER
// Swiperv6.6.2 - Most Modern Mobile Touch Slider
// MANUAL : https://swiperjs.com/get-started
//inicializando swiper
var swiper = new Swiper(".home-slider", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  //autoplay cada 3000ms
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  //loopeo
  loop: true,
});
