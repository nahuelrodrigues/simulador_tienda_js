//////////////////////////////////////////////////////////////
//   SEGUNDA ENTREGA DE PROYECTO FINAL - NAHUEL RODRIGUES
//////////////////////////////////////////////////////////////

////////////////// CREANDO OBJETOS Y ARRAYS //////////////////

//declaro variable del precio del envio
let precioEnvio = 100;

//clase Producto
class Producto {
  constructor(id, nombre, precio, categoria, estrellas) {
    this.id = id;
    this.nombre = nombre;
    this.precio = Number(precio);
    this.categoria = categoria;
    this.estrellas = estrellas;
  }
  //calcula iva
  sumaIva() {
    return this.precio * 1.21;
  }
  //calcula iva + envío
  sumaEnvio() {
    return this.precio * 1.21 + precioEnvio;
  }
}

//Declaramos un array de productos para almacenar nuestros objetos
const productos = [];
//Declaramos un array de productos para realizar operaciones
const productosConImpuestos = [];

// usamos el método push para agregar productos al array
productos.push(new Producto(0, "Arroz", 100, "legumbres", 5));
productos.push(new Producto(1, "Lenteja", 150, "legumbres", 3));
productos.push(new Producto(2, "Granola", 350, "cereal", 4));
productos.push(new Producto(3, "Maní con cáscara", 175, "legumbres", 4));
productos.push(new Producto(4, "Poroto aduki", 170, "legumbres", 2));
productos.push(new Producto(5, "Garbanzo", 135, "legumbres", 5));
//Iteramos el array con for...of para sumarles impuestos de iva + envío
for (const producto of productos) {
  productosConImpuestos.push({
    nombre: producto.nombre,
    precioConIva: producto.sumaIva(),
    precioConIvaYEnvio: producto.sumaEnvio(),
  });
}

////////////////// CREANDO ELEMENTOS EN HTML CON DOM - JS /////////////////

// ASIGNO UNA VARIABLE AL contenedorProductos POR ID
var contenedorProductos = document.getElementById("contenedorProductos");
// CREO UN FOR...OF PARA RECORRER EL ARRAY DE PRODUCTO Y GENERAR LAS "CARDS"
for (const producto of productos) {
  // CREO UNA VARIABLE CON EL CONTENIDO HTML DE LA "CARD", PARA GENERARLO CON JS
  var card =
    `<div id="caja" class="box"><span class="discount">-20%</span><div class="icons"><a href="#" class="fas fa-heart"></a><a href="#" class="fas fa-share"></a><a href="#" class="fas fa-eye"></a></div><img src="images/product` +
    producto.id +
    `.jpg" alt="" /><h3 id="titulo1">` +
    producto.nombre +
    `</h3><div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div><div class="quantity"><span> Cantidad : </span><input id="inputKilo${producto.id}" type="number" min="1" max="100" value="1" /></div><div id="precio1" class="price">$` +
    producto.precio +
    `<span></span></div><a href="#contenedorCarrito" id="boton${producto.id}" class="btn">Agregar al carrito</a></div>`;
  //CREO LA CARTA DENTRO DE contenedorProductos CON .innerHTML
  contenedorProductos.innerHTML += card;
}

//////////////////// GUARDO EN LOCAL STORAGE Y JSON ///////////////////////

// Guardo los productos en el LocalStorage
const guardarLocal = (clave, valor) => {
  localStorage.setItem(clave, valor);
};
// recorro el array de productos y lo convierto en JSON
for (const producto of productos) {
  guardarLocal(producto.id, JSON.stringify(producto));
}

//////////////////// CARRITO //////////////////////////////////////////////

// INICIALIZO MI CARRITO EN 0 EN LOCALSTORAGE
const totalCarrito = 0;
localStorage.setItem("Total-Carrito", totalCarrito);

// Creo el resultado total de la compra (inicializado en 0)
let carritoTotal = document.createElement("div");
carritoTotal.innerHTML =
  "El total de su compra es de <strong>$ " +
  localStorage.getItem("Total-Carrito");
carritoTotal.id = "carritoTotal";
contenedorCarrito.appendChild(carritoTotal);
console.log(localStorage.getItem("Total-Carrito"));

// Creo una función para ir agregando al carrito
function agregarCarrito(id, cantidad) {
  // CALCULO CANTIDAD de KG indexados X PRECIO con iva
  precioProducto = parseInt(cantidad) * productosConImpuestos[id].precioConIva;
  let carrito = document.createElement("div");
  // Creé una sección nueva en HTML llamada "productosAgregados", y la busco por ID.
  let productosAgregados = document.getElementById("productosAgregados");
  // Que diga qué producto eligió, cuantos kilos, y cual es el precio total.
  carrito.innerHTML =
    cantidad +
    "kg de " +
    productosConImpuestos[id].nombre +
    " = $ " +
    parseFloat(precioProducto).toFixed(2);
  carrito.id = "carrito";
  // lo agrego
  productosAgregados.appendChild(carrito);
  // calculo total
  sumarTotal(precioProducto);
  // actualizo estado de carrito
  actualizarCarrito();
}

// TOMO LOS VALORES DEL INPUT DEL BOTON "agregar a carrito" Y AGREGO A CARRITO
document.getElementById(`boton0`).addEventListener("click", function () {
  agregarCarrito(0, document.getElementById("inputKilo0").value);
});
document.getElementById(`boton1`).addEventListener("click", function () {
  agregarCarrito(1, document.getElementById("inputKilo1").value);
});
document.getElementById(`boton2`).addEventListener("click", function () {
  agregarCarrito(2, document.getElementById("inputKilo2").value);
});
document.getElementById(`boton3`).addEventListener("click", function () {
  agregarCarrito(3, document.getElementById("inputKilo3").value);
});
document.getElementById(`boton4`).addEventListener("click", function () {
  agregarCarrito(4, document.getElementById("inputKilo4").value);
});
document.getElementById(`boton5`).addEventListener("click", function () {
  agregarCarrito(5, document.getElementById("inputKilo5").value);
});

// Creo funcion para sumar el total de las compras
function sumarTotal(precioSumar) {
  // tomo el valor actual de localStorage
  let totalActual = Number(localStorage.getItem("Total-Carrito"));
  let sumaTotal = totalActual + precioSumar;
  // y lo guardo actualizado
  localStorage.setItem("Total-Carrito", sumaTotal);
}

// creo función para actualizar el estado del Carrito y agrego el precio con envío.
function actualizarCarrito() {
  let precioFinalConEnvio =
    parseFloat(localStorage.getItem("Total-Carrito")) + precioEnvio;
  carritoTotal.innerHTML =
    "El total de su compra es de <strong>$ " +
    parseFloat(localStorage.getItem("Total-Carrito")).toFixed(2) +
    "<br></strong>El total de su compra con envío es de <strong>$ " +
    parseFloat(precioFinalConEnvio).toFixed(2);
}

///////////////////     FORMULARIO     /////////////////////////

const miFormulario = document.getElementById("formulario");
let botonEnviar = document.getElementById("btnEnviar");
const evento2 = "click";

// creo una función que me permita generar una respuesta al usuario incrustando html x js.
// siempre y cuando haya completado todo el formulario
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

botonEnviar.addEventListener(evento2, validacion);
let formularioEnviado = false;

// creo la respuesta incrustando html.
function submit() {
  let btnRespuesta = document.createElement("div");
  btnRespuesta.id = "btnRespuesta";
  btnRespuesta.className = "btn";
  btnRespuesta.innerHTML = "Se ha enviado correctamente";
  // creo un flag
  if (!formularioEnviado) {
    formularioEnviado = true;
    formulario.appendChild(btnRespuesta);
  }
}

/////////////// EVENTO : ANIMACIONES & INTERACCIONES //////////

// declarando variables Y querySelectors
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
