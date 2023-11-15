let productosData = [
    {
        id: 1,
        nombre: "Laptop",
        precio: 20,
        categoria: "Informática",
        imagen: "./assets/img/products/laptop.jpg",
      },
      {
        id:2,
        nombre:"Camera",
        precio:9,
        categoria: "Tecnología",
        imagen:"./assets/img/products/camera.jpg",
      },
      {
        id: 3,
        nombre: "Headhphones",
        precio: 4,
        categoria: "Tecnología",
        imagen: "./assets/img/products/headphones.jpg",
      },
      {
        id: 4,
        nombre: "Iphone",
        precio: 20,
        categoria: "Celulares",
        imagen: "./assets/img/products/iphone.png",
      },
      {
        id: 5,
        nombre: "Mac",
        precio: 50,
        categoria: "Informática",
        imagen: "./assets/img/products/mac.jpg",
      },
      {
        id: 6,
        nombre: "Phone",
        precio: 15,
        categoria: "Celulares",
        imagen: "./assets/img/products/phone.jpg",
      },
      {
        id: 7,
        nombre: "Phone 2",
        precio: 13,
        categoria: "Celulares",
        imagen: "./assets/img/products/phone2.jpg",
      },
];



let DivideProductos = (size) => {
  const productosLista = [];
  for (let i = 0; i < productosData.length; i += size) {
    productosLista.push(productosData.slice(i, i + size));
  }
  return productosLista;
};

 
let estadoApp = {
  productos: DivideProductos(3),
  actualIndiceProductos: 0,
  productosLimite: DivideProductos(7).length,
  activarFiltro: null,
};
