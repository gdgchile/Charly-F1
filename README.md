Charly-F1
=========

[!Image](https://raw.githubusercontent.com/gdgchile/Charly-F1/master/screen.png)

Un control remoto para el [Charly-F1](http://www.charlylabs.cl/charly-labs/charly-f1-version1-1-autito-control-remoto-bluetooth-con-arduino-y-avr/),
más que eso un ejemplo de cómo crear una [Chrome App](https://developer.chrome.com/apps/about_apps),
además de usar el puerto serial de la API de Chrome.

##¿Qué es y por qué Charly-F1?

![Image](http://www.charlylabs.cl/wp-content/uploads/2013/09/f1-cap-300x160.jpg)

Es un autito a control remoto (BlueTooth) de un tal Charly, el compadre hace [videos](https://www.youtube.com/user/charlylabs)
educativos al estilo "hagalo usted mismo" sobre electrónica y cosas varias, super recomendable.

Si bien es cierto se comunica por BlueTooh, este lo utiliza como un medio para transmitir la señal
serial, así que para efectos practicos la tarea es construir una App de Chrome con soporte para
puerto serial.

A favor:
* El código fuente de Charly F1 es público, así que no es necesario hacer ingeniería inversa.
* El aparato es fácil de fabricar, y aun si no se quisiera el software es el de Ardiuno, así que para
debug se puede utilizar el monitor serial de Arduino (ver test/sketch.ino).
* La aplicación actual de Charly F1 está en VB, tecnología cerrada de Microsoft. Esta usa la tecnología
cerrada de Google xD, pero al menos es multiplataforma (Hice todo esto en Linux ♥).
* Es Chileno, así se apoya el talento local.

## ¿Ok, cómo empiezo?

### Instalación

1. Descarga el [ZIP](https://github.com/gdgchile/Charly-F1/archive/master.zip) o bien clona el proyecto
```
$ git clone https://github.com/gdgchile/Charly-F1.git
$ cd Charly-F1
```
2. Habilita las extensiones en Google Chrome para modo desarrollador:
Ir a
```
chrome://flags
```
Encontrar "Experimental Extension APIs", también puede aparecer como "Extensión experimental API" y Activar. Luego reiniciar el navegador.

3. En Google Chrome ir a Configuración > Herramientas > Extensiones, click en "Cargar extensión sin empaquetar..." y
seleccionar la carpeta app que está dentro de este proyecto (Charly-F1/app).

Listo! Ahora puedes abrir la aplicación en el menú de aplicaciones de Chrome, Verás un Manubrio (Volante) y todo.

### Jugar

1. Pon el conector BlueTooh al PC
2. Abre la app
3. Selecciona el puerto correcto y dale conectar.

Presiona las teclas según la leyenda para controlar el auto.

Finalmente presiona desconectar, o bien simplemente cierra la App.

### Sin Charly F1

La idea más que nada es demostrar como usar Puerto Serial con Chrome App, así que también basta
con un Arduino común. Simplemente usa el sketch (test/sketch.ino) y el monitor serial


