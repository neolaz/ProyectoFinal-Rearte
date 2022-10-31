const clientElement = document.getElementById("cliente");
const tipoDocumentoElement = document.getElementById("tipoDocumento");
const centroEmisorElement = document.getElementById("centroEmisor");
const numeroElement = document.getElementById("numero");
const cantidad1Element = document.getElementById("cantidad1");
const producto1Element = document.getElementById("producto1");
const cantidad2Element = document.getElementById("cantidad2");
const producto2Element = document.getElementById("producto2");
const cantidad3Element = document.getElementById("cantidad3");
const producto3Element = document.getElementById("producto3");
const cantidad4Element = document.getElementById("cantidad4");
const producto4Element = document.getElementById("producto4");
const cantidad5Element = document.getElementById("cantidad5");
const producto5Element = document.getElementById("producto5");
const totalElement = document.getElementById("total");
const confirmarElement = document.getElementById("confirmar");
const cancelarElement = document.getElementById("cancelar");
const cabecerasListadoElement = document.getElementById("cabecerasListado");
const documentoRowElement = document.getElementById("documentoRow");
const containerCancelarElement = document.getElementById("containerCancelar");
const containerConfirmarElement = document.getElementById("containerConfirmar");

let modo = 'ins';   // Es el modo en el que está la pantalla: ins (Insert), upd (Update), dis (display), del (delete).
let idEnUso = 0;    // Id del Documento que se está visualizando/modificando/eliminando.

class Producto{
    constructor (id, nombre, precio, impuesto, stock){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.impuesto = impuesto;
        this.stock = stock;
    }
}

class Documento{
    constructor (id, cliente, tipo, centroEmisor, numero, listaDocumentoDetalle){
        this.id = id;
        this.cliente = cliente;
        this.tipo = tipo;
        this.centroEmisor = centroEmisor;
        this.numero = numero;
        this.listaDocumentoDetalle = listaDocumentoDetalle;
        this.total = calcularTotal(listaDocumentoDetalle);
    }
}

class DocumentoDetalle{
    constructor (producto, cantidad){
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

obtenerProductos(); // Recupero los productos del JSON
mostrarListadoDocumentos(); // Muestro los Documentos que están en el Local Storage.

// Calcula el total del Documento a partir de su detalle.
function calcularTotal(listaDocumentoDetalle) {
    let impuesto;
    let total = 0;

    listaDocumentoDetalle.forEach( (det) => {
        impuesto = 1 + det.producto.impuesto / 100;
        total += det.producto.precio * det.cantidad * impuesto;
    });
    return total;
}

// Chequea si hay Productos en el localStorage. Si no hay, los levanta del archivo JSON y los sube al localStorage.
async function obtenerProductos() {
    let productos = obtenerProductosStorage();

    if(productos.length == 0){
        const resp = await fetch("./data.json"); 
        const post = await resp.json();

        actualizarProductosStorage(post);
    }
}

// Devuelve los productos del Local Storage.
function obtenerProductosStorage(){
    return JSON.parse(localStorage.getItem('productos')) || [];
}

// Actualiza los Productos del Local Storage.
function actualizarProductosStorage(productos){
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Muestra el listado de todos los Documentos creados.
function mostrarListadoDocumentos() {    
    let listaDocumentos = obtenerDocumentosStorage();

    documentoRowElement.innerHTML = '';

    // Si no hay Documentos creados, muestro un mensaje indincándolo.
    if(listaDocumentos.length == 0){
        mostrarMensajeSinDocumentos();
    }

    // Hay Documentos creados, los muestro.
    if(listaDocumentos.length > 0){
        crearCabecerasGrilla(); // Creo las cabeceras de la grilla de Documentos.
        ordernarDocumentos();   // Ordeno de los Documentos para luego mostrarlos.
        cargarDocumentosGrilla(listaDocumentos);   // Cargo los Documentos desde el listado.
    }
}

// Devuelve los productos del Local Storage
function obtenerDocumentosStorage(){
    return JSON.parse(localStorage.getItem('listaDocumentos')) || [];
}

// Muestra un mensaje indicando que no hay Documentos.
function mostrarMensajeSinDocumentos(){
    cabecerasListadoElement.innerHTML = `
        <div class="col-xl-2 offset-md-5">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="numero">Aún no hay Documentos generados</span>
            </div>
        </div>
    `;
}

// Crea las cabeceras de la grilla de Documentos.
function crearCabecerasGrilla(){
    cabecerasListadoElement.innerHTML = `
        <div class="col-xl-2 offset-md-1">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="TipoDocumento">Tipo de Documento</span>
            </div>
        </div>
        <div class="col-xl-1">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="CentroEmisor">Centro Emisor</span>
            </div>
        </div>
        <div class="col-xl-1">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="Numero">Número</span>
            </div>
        </div>
        <div class="col-xl-2">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="Cliente">Cliente</span>
            </div>
        </div>
        <div class="col-xl-2">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="Total">Total</span>
            </div>
        </div>
        <div class="col-xl-2">
        </div>
    `;
}

// Ordena los documentos por tres criterios distintos simultáneamente: Tipo de Documento, Centro Emisor y Número.
function ordernarDocumentos() {
    let listaDocumentos = obtenerDocumentosStorage();

    // Utilizo un bubble sort para ordenar los Documentos por Tipo de Documento, Centro Emisor y Número.
    for(let i = 0; i < listaDocumentos.length; i++){
        for(let j = 0; j < listaDocumentos.length - 1; j++){
            if ((listaDocumentos[j].tipo > listaDocumentos[j + 1].tipo) ||
                (listaDocumentos[j].tipo == listaDocumentos[j + 1].tipo && listaDocumentos[j].centroEmisor > listaDocumentos[j + 1].centroEmisor) ||
                (listaDocumentos[j].tipo == listaDocumentos[j + 1].tipo && listaDocumentos[j].centroEmisor == listaDocumentos[j + 1].centroEmisor && listaDocumentos[j].numero > listaDocumentos[j + 1].numero)) {
                let documentoAux = listaDocumentos[j];
                listaDocumentos[j] = listaDocumentos[j + 1];
                listaDocumentos[j + 1] = documentoAux;
            }
        }
    }
    actualizarDocumentosStorage(listaDocumentos);
}

// Actualiza la lista de Documentos del Local Storage;
function actualizarDocumentosStorage(listaDocumentos){
    localStorage.setItem('listaDocumentos', JSON.stringify(listaDocumentos));
}

// Carga los Documentos desde el listado.
function cargarDocumentosGrilla(listaDocumentos) {
    // Recorro el listado de Documentos para mostrarlos en pantalla.
    listaDocumentos.forEach( (doc) => { 
        let {id, tipo, centroEmisor, numero, cliente, total} = doc;

        documentoRowElement.innerHTML += `
            <div class="row">
                <div class="col-xl-2 offset-md-1 gridRowColor">
                    <div class="containerInput alignCenter">
                        <p class="textGeneric">${tipo}</p>
                    </div>
                </div>
                <div class="col-xl-1 gridRowColor">
                    <div class="containerInput alignCenter">
                        <p class="textGeneric">${centroEmisor}</p>
                    </div>
                </div>
                <div class="col-xl-1 gridRowColor">
                    <div class="containerInput alignCenter">
                        <p class="textGeneric">${numero}</p>
                    </div>
                </div>
                <div class="col-xl-2 gridRowColor">
                    <div class="containerInput alignCenter">
                        <p class="textGeneric">${cliente}</p>
                    </div>
                </div>
                <div class="col-xl-2 gridRowColor">
                    <div class="containerInput alignCenter">
                        <p class="textGeneric">${total}</p>
                    </div>
                </div>
                <div class="col-xl-2 gridRowColor">
                    <div class="alignCenter">
                        <a class="buttonGrid" onclick="gestionarVisualizarDocumento(${id})">
                            <img src="img/search.png" alt="Visuaizar Documento" title="Visualizar">
                        </a>
                        <a class="buttonGrid" onclick="gestionarModificarDocumento(${id})">
                            <img src="img/edit.png" alt="Modificar Documento" title="Modificar">
                        </a>
                        <a class="buttonGrid" onclick="eliminarDocumento(${id})">
                            <img src="img/delete.png" alt="Eliminar Documento" title="Eliminar">
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Se encarga de gestionar el botón para Confirmar.
const gestionarConfirmar = () => {
    let msgError = '';

    msgError = validarInputs(); // Valida que los datos ingresados sean correctos.
    if (msgError != '') mostrarError(msgError); // Si hay algún error, lo muestra en pantalla.
    if (msgError == '' && modo == 'ins') crearDocumento();  // Si está en modo INSERT, crea un nuevo Documento.
    if (msgError == '' && modo == 'upd') modificarDocumento(idEnUso);   // Si está en modo UPDATE, modifica el Documento.
    if (msgError == '' && modo == 'dis') reinciarForm();    // Si está en modo DISPLAY, reinicia el form para ingresar un nuevo Documento.
}

// Valida que se hayan cargado correctamente los atributos del Documento.
function validarInputs() {
    let msgError = '';

    msgError = validarCliente(msgError);
    msgError = validarTipoDocumento(msgError);
    msgError = validarCentroEmisor(msgError);
    if (msgError == '') msgError = validarNumero(msgError);
    msgError = validarDetalle(msgError);
    return msgError;
}

// Valida que se haya seleccionado Cliente.
function validarCliente(msgError) {
    let cliente = clientElement.value;

    if (cliente == '') msgError += 'Seleccione Cliente\n';   
    return msgError;
}

// Valida que se haya seleccionado Tipo de Documento.
function validarTipoDocumento(msgError) {
    let tipoDocumento = tipoDocumentoElement.value;

    if(tipoDocumento == '' ) msgError += 'Seleccione Tipo de Documento\n';
    return msgError;
}

// Valida que se haya seleccionado Centro Emisor.
function validarCentroEmisor(msgError) {
    let centroEmisor = centroEmisorElement.value;

    if (centroEmisor == '') msgError += 'Seleccione Centro Emisor\n';
    return msgError;
}

// Valida que se haya asignado Número. Para ello tuvo que seleccionarse previamente el Tipo de Documento y el Centro Emisor.
function validarNumero(msgError) {
    let numero = numeroElement.innerHTML;

    if (numero == '00000000') msgError += 'Seleccione Tipo de Documento y Centro Emisor\n';
    return msgError;
}

// Valida que se haya cargado correctamente el detalle del Documento.
function validarDetalle(msgError) {
    let cantidadInput;
    let productoInput;
    let algunaLineaCargada = false;

    // Recorro el detalle del Documento y valido aquellas líneas en las que se ingresó la Cantidad y/o se seleccionó un Producto.
    for (let i = 1; i < 6; i++) {
        cantidadInput = document.getElementById(`cantidad${i}`).value;
        productoInput = document.getElementById(`producto${i}`).value;

        // Se seleccionó un Producto pero no se ingresó Cantidad, muestro mensaje de error.
        if (cantidadInput <= 0 && productoInput != ""){
            algunaLineaCargada = true;
            msgError += `Ingrese la cantidad en la línea ${i} del detalle\n`;
        }

        // Se ingresó Cantidad pero no se seleccionó un Producto, muestro mensaje de error.
        if (cantidadInput > 0 && productoInput == ""){
            algunaLineaCargada = true;
            msgError += `Seleccione el producto en la línea ${i} del detalle\n`;
        }

        if(cantidadInput > 0 && productoInput != "") algunaLineaCargada = true;
    }

    if(algunaLineaCargada) msgError = validarStock(msgError);   // Si se cargó alguna línea del detalle correctamente, valido el stock.

    if (!algunaLineaCargada) msgError += 'Ingrese alguna línea del detalle\n';  // No se ingresó correctamente ninguna línea del detall, muestro mensaje de error.
    return msgError
}

// Valida que no se estén facturando más Productos de los que se tienen en stock.
function validarStock(msgError) {
    let productos = obtenerProductosStorage();
    let cantidadIngresada;
    let cantidadInput;
    let productoInput;

    productos.forEach( (p) => {
        cantidadIngresada = 0;

        // Sumo la cantidad de unidades de un Producto que se están facturando, para luego comparar con el stock disponible.
        for (let i = 1; i < 6; i++) {
            cantidadInput = document.getElementById(`cantidad${i}`).value;
            productoInput = document.getElementById(`producto${i}`).value;
            if(p.id == productoInput && cantidadInput > 0){
                cantidadIngresada += parseInt(cantidadInput);
            }
        }

        // Si la cantidad de unidades ingresada es superior al stock disponible, muestro mensaje de error.
        if(cantidadIngresada > p.stock) msgError += `No hay suficiente stock de ${p.nombre}. Hay ${p.stock} unidades en stock y está intentando cargar ${cantidadIngresada} en el Documento.\n`;
    })
    return msgError;
}

// Muestra mensaje de error.
function mostrarError(msgError) {
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: msgError,
        background: '#272727',
        color: '#FFFFFF',
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#30fdb0'
    });
}

// Crea un nuevo documento con los datos cargados en pantalla.
function crearDocumento() {
    let listaDocumentos = obtenerDocumentosStorage();
    let cliente = clientElement.value;
    let tipoDocumento = tipoDocumentoElement.value;
    let centroEmisor = centroEmisorElement.value;
    let numero = numeroElement.innerHTML;
    let listaDocumentoDetalle = crearDetalle();
    let ultimoDocumentoId = obtenerUltimoDocumentoIdStorage();

    ultimoDocumentoId++;        

    let documento = new Documento(ultimoDocumentoId, cliente, tipoDocumento, centroEmisor, numero, listaDocumentoDetalle);

    listaDocumentos.push(documento); 
    actualizarDocumentosStorage(listaDocumentos);
    actualizarUltimoDocumentoIdStorage(ultimoDocumentoId);
    mostrarListadoDocumentos();
    reinciarForm(); 

    Swal.fire({
        title: 'Documento creado!',
        text: `Se creó la ${tipoDocumento} del Centro Emisor ${centroEmisor}, número ${numero}.`,
        background: '#272727',
        color: '#FFFFFF',
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#30fdb0'
    })
}

// Devuelve, desde el Local Storage, el último Id de Documento asignado.
function obtenerUltimoDocumentoIdStorage(){
    return localStorage.getItem('ultimoDocumentoId') || 0;
}

// Actualiza, en el Local Storage, el último Id de Documento asignado.
function actualizarUltimoDocumentoIdStorage(ultimoDocumentoId){
    localStorage.setItem('ultimoDocumentoId', ultimoDocumentoId);
}


// Crea el detalle del Documento.
function crearDetalle() {
    let productos = obtenerProductosStorage();
    let cantidadInput;
    let productoInput;
    let documentoDetalle;
    let listaDocumentoDetalle = [];

    // Agrego al detalle del Documento aquellas líneas que hayan ingresado Cantidad y seleccionado un Producto.
    for (let i = 1; i < 6; i++) {
        cantidadInput = document.getElementById(`cantidad${i}`).value;
        productoInput = document.getElementById(`producto${i}`).value;

        if (cantidadInput > 0 && productoInput != ""){
            productos.forEach( (p) => {

                // Busco el Producto cargado en el detalle para descontar el stock.
                if (productoInput == p.id){
                    p.stock -= parseInt(cantidadInput);
                    documentoDetalle = new DocumentoDetalle(p, cantidadInput);
                    listaDocumentoDetalle.push(documentoDetalle);
                }
            })
        }
    }

    actualizarProductosStorage(productos);
    return listaDocumentoDetalle;
}

// Reinicia el form dejando todos los inputs en vacíos.
function reinciarForm() {
    let productos = obtenerProductosStorage();

    // Vacío los inputs de la cabecera del Documento, los pongo editables y coloco el color correspondiente al modo INSERT.
    clientElement.value = '';
    clientElement.disabled = false;
    clientElement.style.backgroundColor = "#403f3f";
    clientElement.style.color = "#ffffff";
    tipoDocumentoElement.value = '';
    tipoDocumentoElement.disabled = false;
    tipoDocumentoElement.style.backgroundColor = "#403f3f";
    tipoDocumentoElement.style.color = "#ffffff";
    centroEmisorElement.value = '';
    centroEmisorElement.disabled = false;
    centroEmisorElement.style.backgroundColor = "#403f3f";
    centroEmisorElement.style.color = "#ffffff";
    numeroElement.innerHTML = '00000000';
    totalElement.innerHTML = 0;

    // Si está en modo UPDATE, resto el stock del detalle.
    if(modo == 'upd'){
        let documento = obtenerDocumentoPorId(idEnUso);

        documento.listaDocumentoDetalle.forEach( (det) => {
            productos.forEach( (p) => {
                if (det.producto.id == p.id){
                    p.stock -= parseInt(det.cantidad);
                }
            })
        });   
        actualizarProductosStorage(productos);
    }

    // Vacío los inputs del detalle del Documento, los pongo editables y coloco el color correspondiente al modo INSERT.
    for (let i = 1; i < 6; i++) {
        document.getElementById(`cantidad${i}`).value = 0;
        document.getElementById(`cantidad${i}`).disabled = false;
        document.getElementById(`cantidad${i}`).style.backgroundColor = "#403f3f";
        document.getElementById(`cantidad${i}`).style.color = "#ffffff";
        document.getElementById(`producto${i}`).value = '';
        document.getElementById(`producto${i}`).disabled = false;
        document.getElementById(`producto${i}`).style.backgroundColor = "#403f3f";
        document.getElementById(`producto${i}`).style.color = "#ffffff";
        document.getElementById(`precio${i}`).innerHTML = 0;
        document.getElementById(`impuesto${i}`).innerHTML = 0;
        document.getElementById(`subtotal${i}`).innerHTML = 0;
    } 

    containerCancelarElement.style.display = "block";
    containerConfirmarElement.className = "col-xl-2";
    idEnUso = 0;
    modo = 'ins';
}

// Busca y devuelve un Documento por su Id
function obtenerDocumentoPorId(id) {
    let listaDocumentos = obtenerDocumentosStorage();
    let documento = listaDocumentos.filter(d => d.id == id)[0]; 

    return documento;
}

// Modifica el documento con los datos cargados en pantalla.
function modificarDocumento(id) {
    let listaDocumentos = obtenerDocumentosStorage();
    let productos = obtenerProductosStorage();
    let documento = obtenerDocumentoPorId(id);  // Recupero el Documento a modificar.

    // Devuelvo el stock del detalle desde el listado (no modificado). Cuando genere el detalle modificado, lo vuelvo a restar.
    documento.listaDocumentoDetalle.forEach( (det) => {
        productos.forEach( (p) => {
            if (det.producto.id == p.id){
                p.stock += parseInt(det.cantidad);
            }
        })
    });   

    let listaDocumentoDetalle = crearDetalle();

    // Actualizo el detale del Documento.
    listaDocumentos.forEach( (d) => {
        if(d.id == id){
            d.listaDocumentoDetalle = listaDocumentoDetalle;
            d.total = calcularTotal(listaDocumentoDetalle);
        }
    });
    actualizarDocumentosStorage(listaDocumentos);
    mostrarListadoDocumentos();
    modo = 'ins';
    reinciarForm(); 
}

// Asigna el Número del Documento. Busca el número del último Documento generado con el mismo Tipo de Documento y Centro Emisor y le agrega uno.
function asignarNumero(tipoDocumento, centroEmisor) {
    let listaDocumentos = obtenerDocumentosStorage();
    let documentosFiltrados = [];
    let numero;
    let numeroStr = '00000000';
    let difLength = 0;

    // Consigo los Documentos del mismo Tipo y Centro emisor.    
    documentosFiltrados = listaDocumentos.filter( (d) => d.tipo == tipoDocumento && d.centroEmisor == centroEmisor);
    
    // Si no hay Documentos con el mismo Tipo y Centro Emisor, el número será 1.
    if(documentosFiltrados.length == 0) return '00000001';

    documentosFiltrados.sort( (a,b) => b.numero - a.numero); // Ordeno los documentos filtrados de mayor a menor para obtener el más grande fácilmente.
    numero = parseInt(documentosFiltrados[0].numero) + 1;   // Recupero el último Número de Documento asignado para el mismo Tipo y Centro Emisor
    numeroStr += numero;    // Concateno el número a los ocho ceros declarados previamente.
    difLength = numeroStr.length - 8;   // Me quedo con la diferencia de caracteres entre el string resultante y los ocho caracteres iniciales.
    numeroStr = numeroStr.substring(difLength)  // Genero el número definitivo quitando los ceros de la izquierda que sobran.
    return numeroStr;
}

// Muestra en pantalla el Documento para visualizar/modificar recibido por parámetro.
function mostrarDocumento(id) {
    let documento = obtenerDocumentoPorId(id);  // Recupero el Documento a visualizar/modificar.
    let { cliente, tipo, centroEmisor, numero, total, listaDocumentoDetalle } = documento;

    // Cargo la cabecera del Documento.
    clientElement.value = cliente;
    tipoDocumentoElement.value = tipo;
    centroEmisorElement.value = centroEmisor;
    numeroElement.innerHTML = numero;
    totalElement.innerHTML = total;

    // Cargo el detalle del Documento. Las líneas del detalle no utilizadas las cargo vacías.
    for (let i = 1; i < 6; i++) {
        if(i <= listaDocumentoDetalle.length){
            let { cantidad, producto: { id, precio, impuesto }} = listaDocumentoDetalle[i - 1];

            document.getElementById(`cantidad${i}`).value = cantidad;
            document.getElementById(`producto${i}`).value = id;
            document.getElementById(`precio${i}`).innerHTML = precio;
            document.getElementById(`impuesto${i}`).innerHTML = impuesto;
            document.getElementById(`subtotal${i}`).innerHTML = cantidad * precio * (1 + impuesto / 100);
        } else {
            document.getElementById(`cantidad${i}`).value = 0;
            document.getElementById(`producto${i}`).value = '';
            document.getElementById(`precio${i}`).innerHTML = 0;
            document.getElementById(`impuesto${i}`).innerHTML = 0;
            document.getElementById(`subtotal${i}`).innerHTML = 0;
        }     
    } 
}

// Setea la pantalla para visualizar el Documento.
function gestionarVisualizarDocumento(id) {
    reinciarForm();
    idEnUso = id;
    modo = 'dis';
    mostrarDocumento(id);

    // Dejo los inputs de la cabecera como readonly y cambió el color para distinguirlos.
    clientElement.disabled = true;
    clientElement.style.backgroundColor = "#2f2f2f";
    clientElement.style.color = "#c6c6c6";
    tipoDocumentoElement.disabled = true;
    tipoDocumentoElement.style.backgroundColor = "#2f2f2f";
    tipoDocumentoElement.style.color = "#c6c6c6";
    centroEmisorElement.disabled = true;
    centroEmisorElement.style.backgroundColor = "#2f2f2f";
    centroEmisorElement.style.color = "#c6c6c6";

    // Dejo los inputs del detalle como readonly y cambió el color para distinguirlos.
    for (let i = 1; i < 6; i++) {
        document.getElementById(`cantidad${i}`).disabled = true;
        document.getElementById(`cantidad${i}`).style.backgroundColor = "#2f2f2f";
        document.getElementById(`cantidad${i}`).style.color = "#c6c6c6";
        document.getElementById(`producto${i}`).disabled = true;
        document.getElementById(`producto${i}`).style.backgroundColor = "#2f2f2f";
        document.getElementById(`producto${i}`).style.color = "#c6c6c6";
    } 

    containerCancelarElement.style.display = "none";
    containerConfirmarElement.className = "col-xl-2 offset-md-5";
}

// Setea la pantalla para modificar el Documento.
function gestionarModificarDocumento(id) {
    let listaDocumentos = obtenerDocumentosStorage();
    let productos = obtenerProductosStorage();
    
    reinciarForm();
    idEnUso = id;
    modo = 'upd';
    mostrarDocumento(id);

    // Reasigno el stock para luego actualizarlo con lo que el usuario haya modificado.
    listaDocumentos.forEach( (d) => {
        if(d.id == id){
            d.listaDocumentoDetalle.forEach( (det) => {
                productos.forEach( (p) => {
                    if (det.producto.id == p.id){
                        p.stock += parseInt(det.cantidad);
                    }
                })
            });   
        }
    });

    actualizarProductosStorage(productos);

    // Dejo los inputs de la cabecera como readonly y les cambio el color para distinguirlos.
    // Se podrá modifcar el detalle del Documento pero no la cabecera.
    clientElement.disabled = true;
    clientElement.style.backgroundColor = "#2f2f2f";
    clientElement.style.color = "#c6c6c6";
    tipoDocumentoElement.disabled = true;
    tipoDocumentoElement.style.backgroundColor = "#2f2f2f";
    tipoDocumentoElement.style.color = "#c6c6c6";
    centroEmisorElement.disabled = true;
    centroEmisorElement.style.backgroundColor = "#2f2f2f";
    centroEmisorElement.style.color = "#c6c6c6";
}

// Elimina el Documento recibido por parámetro.
function eliminarDocumento(id) {
    let listaDocumentos = obtenerDocumentosStorage();
    let productos = obtenerProductosStorage();
    let documento = obtenerDocumentoPorId(id);  // Recupero el Documento a visualizar/modificar.
    let {tipo, centroEmisor, numero } = documento;

    // Le pregunto al usuario si está seguro que quiere eliminar el Documento.
    Swal.fire({
        title: 'Eliminar Documento',
        text: `Está seguro que desea eliminar la ${tipo} del Centro Emisor ${centroEmisor}, número ${numero}?`,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: `Cancelar`,
        background: '#272727',
        color: '#FFFFFF',
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#30fdb0'
    }).then((result) => {
        // El usuario quiere eliminar el Documento, lo elimino.
        if (result.isConfirmed) {
            // Chequeo no estar en modo update para no reasignar dos veces el stock del Documento a eliminar.
            if(modo != 'upd'){
                // Reasigno el stock de los productos del Docuento a eliminar.
                listaDocumentos.forEach( (d) => {
                    if(d.id == id){
                        d.listaDocumentoDetalle.forEach( (det) => {
                            productos.forEach( (p) => {
                                if (det.producto.id == p.id){
                                    p.stock += parseInt(det.cantidad);
                                }
                            })
                        });   
                    }
                });
            }
            
            modo = 'del';
            listaDocumentos = listaDocumentos.filter(d => d.id != id);  // Elimino el Documento del lisado.
            actualizarDocumentosStorage(listaDocumentos);
            actualizarProductosStorage(productos);
            reinciarForm();
            mostrarListadoDocumentos();

            Swal.fire({
                title: 'Documento Eliminado!',
                background: '#272727',
                color: '#FFFFFF',
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#30fdb0'
            })
        }
    })
}

// Se encarga de asignar el número cuando se cambia de Centro Emisor o Tipo de Documento
const gestionarNumero = () => {
    let tipoDocumentoInput;
    let centroEmisorInput;
    let numero;

    tipoDocumentoInput = tipoDocumentoElement.value;
    centroEmisorInput = centroEmisorElement.value;
    
    // Si el usuario seleccionó Tipo de Documento y Centro Emisor, le asigno el número.
    if(tipoDocumentoInput != '' && centroEmisorInput != ''){
        numero = asignarNumero(tipoDocumentoInput, centroEmisorInput);   
        numeroElement.innerHTML = numero;
    } else {    // El usuario no seleccionó Tipo de Documento y Centro emisor, pongo 0 cómo número.
        numeroElement.innerHTML = '00000000';
    }
}

// Se encarga de traer todos los datos del Producto seleccionado y calcula su total teniendo en cuenta la cantidad ingresada.
const gestionarLineaDetalle = (nroLinea) => {
    let cantidadInput;
    let productoInput;
    let subtotalInput;
    let totalInput;
    let total;
    let producto;

    cantidadInput =  document.getElementById(`cantidad${nroLinea}`).value;
    productoInput = document.getElementById(`producto${nroLinea}`).value; 
    subtotalInput =  parseInt(document.getElementById(`subtotal${nroLinea}`).innerHTML);             
    totalInput = parseInt(totalElement.innerHTML);
    total = totalInput - subtotalInput;
        
    // El usuario ingresó Cantidad y seleccionó Producto, voy a buscar sus datos.
    if(cantidadInput > 0 && productoInput != ''){
        producto = obtenerProductoPorId(productoInput);
        let { precio, impuesto } = producto;
        document.getElementById(`precio${nroLinea}`).innerHTML = precio;
        document.getElementById(`impuesto${nroLinea}`).innerHTML = impuesto;
        document.getElementById(`subtotal${nroLinea}`).innerHTML = cantidadInput * precio * (1 + impuesto / 100);
    }  

    // El usuario no ingresó Cantidad y/o no seleccionó Producto, vacío los datos.
    if(cantidadInput <= 0 || productoInput == ''){
        document.getElementById(`precio${nroLinea}`).innerHTML = 0;
        document.getElementById(`impuesto${nroLinea}`).innerHTML = 0;
        document.getElementById(`subtotal${nroLinea}`).innerHTML = 0;
    }

    total += parseInt(document.getElementById(`subtotal${nroLinea}`).innerHTML);
    totalElement.innerHTML = total;
}

// Obtiene un Producto por su Id.
const obtenerProductoPorId = (id) => {
    let productos = obtenerProductosStorage();
    let productosFiltrados;

    productosFiltrados = productos.filter( (p) => p.id == id);
    return productosFiltrados[0];
}

confirmarElement.addEventListener("click", gestionarConfirmar);
cancelarElement.addEventListener("click", reinciarForm)
tipoDocumentoElement.addEventListener("change", gestionarNumero);
centroEmisorElement.addEventListener("change", gestionarNumero);
cantidad1Element.addEventListener("focusout", () => gestionarLineaDetalle(1));
producto1Element.addEventListener("change", () => gestionarLineaDetalle(1));
cantidad2Element.addEventListener("focusout", () => gestionarLineaDetalle(2));
producto2Element.addEventListener("change", () => gestionarLineaDetalle(2));
cantidad3Element.addEventListener("focusout", () => gestionarLineaDetalle(3));
producto3Element.addEventListener("change", () => gestionarLineaDetalle(3));
cantidad4Element.addEventListener("focusout", () => gestionarLineaDetalle(4));
producto4Element.addEventListener("change", () => gestionarLineaDetalle(4));
cantidad5Element.addEventListener("focusout", () => gestionarLineaDetalle(5));
producto5Element.addEventListener("change", () => gestionarLineaDetalle(5));