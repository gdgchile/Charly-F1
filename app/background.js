/**
 * Esta app es un control remoto para el Charly F1,
 * (http://www.charlylabs.cl/charly-labs/charly-f1-version1-1-autito-control-remoto-bluetooth-con-arduino-y-avr/)
 * más que eso, es un ejemplo de cómo hacer una aplicación para
 * Chrome (Chrome App) y usar el puerto serial según la API de Chrome.
 *
 * Trate de comentar lo más posible xD, cualquier consulta enviar un issue al github del proyecto.
 * 
 * Copyright (c) 2014 GDG Antofagasta.
 * Author Rodrigo González.
 * Available via MIT LICENSE. See https://github.com/gdgchile/Charly-F1/blob/master/LICENSE.md for details.
 */

// Cada vez que la app se carga se llama automáticamente al evento "Launched",
// es entonces cuando comienza todo.
chrome.app.runtime.onLaunched.addListener(function() {
    
    // Esto es para centrar la ventana, se define el alto y el ancho en pixeles.
    var screenWidth = screen.availWidth,
        screenHeight = screen.availHeight;
        width = 600,
        height = 600;
    
    // Crea una nueva ventana. El primer parámetro el nombre del archivo HTML5
    // que tendrá lo que se muestra al usuario.
    chrome.app.window.create("window.html", {
        // Un identificador de la ventana
        id : "mainWindow",
        // Las dimensiones de la ventana
        bounds: {
            // Ancho
            width: width,
            // Alto
            height: height,
            // La distancia desde el margen izquierdo de la pantalla hasta la ventana
            left: Math.round((screenWidth-width)/2),
            // La distancia desde el margen superior de la pantalla hasta la ventana
            top: Math.round((screenHeight-height)/2)
        }    
    // Cuando la ventana se crea se llama al siguiente método. Aquí se pone todo lo que
    // necesita trabajar con la ventana. El parámetro mainWindow es una referencia a la ventana
    }, function(mainWindow) {
        
        // mainWindow (el parámetro de la función) representa la ventana recién creada.
        // Dado que sólo se requiere trabajar con el contexto "window" de la ventana,
        // se navega a contentWindow. Recordar que el DOM de una página
        mainWindow = mainWindow.contentWindow;
        
        // Una vez referenciada la ventana hay que esperar que el DOM se cargue, para
        // ello se agrega un listener (function) al evento 'load' de la ventana
        mainWindow.addEventListener('load', function() {
            
            // Estas variables representan nodos HTML de la ventana recien creada. Como
            // se puede ver se usa mainWindow.document para acceder al documento de la ventana
            // querySelector para seleccionar el elemento HTML dado su ID
            var portsSelect = mainWindow.document.querySelector("#ports"),
                wheel = mainWindow.document.querySelector("#wheel"),
                upInfo = mainWindow.document.querySelector("#up"),
                speedInfo = mainWindow.document.querySelector("#speed")
                downInfo = mainWindow.document.querySelector("#down"),
                connectBtn = mainWindow.document.querySelector("#connect"),
                disconnectBtn = mainWindow.document.querySelector("#disconnect"),
                portsInfo = mainWindow.document.querySelector("#ports"),
                baudiosInfo = mainWindow.document.querySelector("#baudios"),
                connectionStatus = mainWindow.document.querySelector("#connectionStatus");
            
            // Aquí simplemente se llama a la API de Chrome para que retorne todos los
            // puertos disponibles en el dispositivo. ports es un arreglo de objetos que
            // tienen el atributo path. Por ejemplo, ports[0].path en Ubuntu comunmente sería
            // "/dev/ttyACM0". Para cada puerto se crea un elemento <option> y se agrega al
            // <select> cuyo ID="ports".
            chrome.serial.getDevices(function(ports) {
                // Para cada puerto
                for (var i=0; i< ports.length; i++) {
                    // Se crea un elemento option
                    var option = mainWindow.document.createElement('option');
                    // Se le adjuntan los atributos
                    option.textContent = ports[i].path;
                    option.value = ports[i].path;
                    // Y se agrega al <select id="ports"></select>
                    portsSelect.appendChild(option);
                }
            });
            
            // Variables auxiliares varias
            var scale = 1,
                rotate = 0,
                speedRange = 1,                
                oldScale,
                oldRotate,
                oldSpeedRange,
                connectionId;
                
            // Adjunta el evento keypress, a la ventana recién creada. De esta forma
            // mientras se presione una tecla se llamará a esta function. el
            // parámetro e es un objeto que representa el evento
            mainWindow.addEventListener('keypress', function(e) {
                
                // Obtiene la tecla del evento.
                var key = String.fromCharCode(e.charCode).toUpperCase();
                
                switch (key) {
                    
                    case "W":
                        // Si es W significa que debe avanzar, por ende:
                        // 1. Cambia el color de la flecha arriba a naranja y oscurece la de abajo.
                        upInfo.style.borderColor = "transparent transparent #FF6600 transparent";
                        downInfo.style.borderColor = "#EEE transparent transparent transparent";
                        // 2. Cambia la variable que representa la escala del manubrio (volante) para
                        // que se vea un poco más grande.
                        scale = 1.01;
                        // 3. Cambia el indicador de velocidad.
                        speedInfo.textContent = speedRange;
                        break;
                    case "S":
                        // Si es S significa que debe retroceder, por ende:
                        // 1. Cambia el color de la flecha abajo a naranja y oscurece la de arriba.
                        upInfo.style.borderColor = "transparent transparent #EEE transparent";
                        downInfo.style.borderColor = "#FF6600 transparent transparent transparent";
                        // 2. Cambia la variable que representa la escala del manubrio (volante) para
                        // que se vea un poco más pequeña.
                        scale = 0.99;
                        // 3. Cambia el indicador de velocidad.
                        speedInfo.textContent = -speedRange;
                        break;
                    case "A":
                        // Ir a la Izquierda
                        rotate = -60;
                        break;
                    case "D":
                        // Ir a la Derecha
                        rotate = 60;
                        break;
                    case "1":
                        // Cambia la velocidad a LENTO
                        speedRange = 1;
                        break;
                    case "2":
                        // Cambia la velocidad a NORMAL
                        speedRange = 2;
                        break;
                    case "3":
                        // Cambia la velocidad a RAPIDO
                        speedRange = 3;
                        break;
                }
                
                // scale y rotate solo son variables, es en este paso donde efectivamente se
                // realiza el cambio. transform en CSS3 permite escalar y rotar elementos DOM.
                // En este caso se usa webkitTransform para escalar y rotar el manubrio (volante).
                wheel.style.webkitTransform = "scale(" + scale + ") rotate(" + rotate + "deg)";
                
            });
            
            // Cada vez que se deja de presionar una tecla se llama a esta función.
            // Básicamente es para dejar todo como estaba antes. El parámetro e representa
            // el evento.
            mainWindow.addEventListener('keyup', function(e) {
                // El valor por default de las variables.
                scale = 1;
                rotate = 0;
                // Deja el manubrio en el estado inicial.
                wheel.style.webkitTransform = "scale(" + scale + ") rotate(" + rotate + "deg)";
                // Deja la fleja de arriba y la de abajo oscurecida.
                upInfo.style.borderColor = "transparent transparent #EEE transparent";
                downInfo.style.borderColor = "#EEE transparent transparent transparent";
                // Cambia el indicador de velocidad a 0.
                speedInfo.textContent = "0";
            });
            
            // Cuando se haga click en el botón "conectar"...
            connectBtn.addEventListener('click', function() {
                
                // Crea una conexión al puerto serial seleccionado y
                // al intervalo (baudios) seleccionados. connectionId es
                // el identificador de la conexión.
                chrome.serial.connect(portsInfo.value, {
                    bitrate : parseInt(baudiosInfo.value)
                }, function(connectionInfo) {
                    
                    // Si la conexión fallo connectionInfo es null, en cuyo caso
                    // mostrar un mensaje y terminar.
                    if(!connectionInfo) {
                        connectionStatus.value = "ERROR, NO CONECTADO"
                        return;
                    }                    
                    connectionId = connectionInfo.connectionId;
                    
                    // Deshabilita el botón para conectar (dado que ya se está conectado)
                    // y habilita el para desconectar.
                    connectBtn.disabled = true;
                    disconnectBtn.disabled = false;
                    
                    // Cambia el estado a CONECTADO.
                    connectionStatus.value = "CONECTADO";
                    
                    // Los eventos como keypress se ejecutan extremadamente rápido uno después de otro,
                    // por lo que no es sano enviar los datos por puerto serial por cada vez que se
                    // ejecutan, en vez de esto se puede crear un temporizador de intervalos regulares
                    // setInterval(function callback,int time) que ejecuta callback cada time
                    // (en milisegundos).
                    setInterval(function() {
                        
                        // Si rotate cambio con respecto al anterior (izquierda, derecha)
                        if (rotate != oldRotate) {
                            // Actualiza oldRotate
                            oldRotate = rotate;
                            switch (rotate) {
                                // Si rotate es -60 significa que debe virar a la izquierda
                                case -60:
                                    console.log("izquierda");
                                    // Envia la señar al puerto serial, según el protocolo de Charly.
                                    // send(int connId, ArrayBuffer data, function callback), envía
                                    // data a la conexión connId y al terminar ejecuta callback. Para
                                    // pasar de string a ArrayBuffer se usa el helper str2ArrayBuffer
                                    // que está definido al final.
                                    chrome.serial.send(connectionId, int2ArrayBuffer(1), function() {
                                        connectionStatus.value = "1: IZQUIERDA";
                                    });
                                    break;
                                // Si es 0 significa que debe mantenerse derecho
                                case 0:
                                    console.log("recto");
                                    chrome.serial.send(connectionId, int2ArrayBuffer(2), function() {
                                        connectionStatus.value = "2: RECTO";
                                    });
                                    break;
                                // A la derecha
                                case 60:
                                    console.log("derecha");
                                    chrome.serial.send(connectionId, int2ArrayBuffer(3), function() {
                                        connectionStatus.value = "3: DERECHA";
                                    });
                                    break;
                            }
                            
                        }
                        
                        // Si la escala cambio con respecto a la anterior (adelante, atrás)
                        if (scale != oldScale) {
                            oldScale = scale;                            
                            switch (scale) {
                                // Si es 1.01 entonces debe avanzar.
                                case 1.01:
                                    chrome.serial.send(connectionId, int2ArrayBuffer(4), function() {
                                        connectionStatus.value = "4: AVANZAR";
                                    });
                                    break;
                                // Si es 1 parar
                                case 1:
                                    chrome.serial.send(connectionId, int2ArrayBuffer(6), function() {
                                        connectionStatus.value = "6: PARAR";
                                    });
                                    break;
                                // Atrás
                                case 0.99:
                                    chrome.serial.send(connectionId, int2ArrayBuffer(5), function() {
                                        connectionStatus.value = "5: RETROCEDER";
                                    });
                                    break;
                            }
                        }
                        
                        // Si la velocidad cambio con respecto a la anterior
                        if (speedRange != oldSpeedRange) {
                            oldSpeedRange = speedRange;                            
                            switch (speedRange) {
                                case 1:
                                    chrome.serial.send(connectionId, int2ArrayBuffer(7), function() {
                                        connectionStatus.value = "7: IR LENTO";
                                    });
                                    break;
                                case 2:
                                    chrome.serial.send(connectionId, int2ArrayBuffer(8), function() {
                                        connectionStatus.value = "8: IR NORMAL";
                                    });
                                    break;
                                case 3:
                                    chrome.serial.send(connectionId, int2ArrayBuffer(9), function() {
                                        connectionStatus.value = "9: IR RAPIDO";
                                    });
                                    break;
                            }
                        }
                    }, 100); // Fin de setInterval
                    
                }); // Fin de conexion
                
            }); // Fin del evento click en connect
            
            disconnectBtn.addEventListener('click', function() {
                
                // Crea una conexión al puerto serial seleccionado y
                // al intervalo (baudios) seleccionados. connectionId es
                // el identificador de la conexión.
                chrome.serial.disconnect(connectionId, function(ok) {
                    
                    // Si falló la desconexión
                    if (!ok) {
                        connectionStatus.value = "ERROR, NO SE PUDO DESCONECTAR"
                        return;
                    }
                    
                    connectionStatus.value = "DESCONECTADO"
                    
                    // Deshabilita el botón para desconectar
                    // y habilita el para conectar.
                    connectBtn.disabled = false;
                    disconnectBtn.disabled = true;
                    
                }); // Fin de la orden desconectar
                
            }); // Fin del evento para desconectar
            
        }); // Fin del evento load en la ventana creada
        
    }); // Fin de la instrucción para crear la ventana
    
}); // Fin de lo que debe pasar al iniciar la app.

// Método auxiliar para pasar un entero [0-255] a ArrayBuffer
var int2ArrayBuffer = function(value) {
    var buf = new ArrayBuffer(1);
    var bufView = new Uint8Array(buf);
    bufView[0] = value;
    return buf;
}