/**
 * Este es un sketch de prueba solamente, simplemente
 * hace un eco de toda entrada serial al monitor serial.
 *
 * 1. Cargar en el Arduino por el USB
 * 2. Abrir el Monitor Serial
 * 3. Abrir la App Charly F1 (Chrome App)
 * 4. Conectar al puerto correcto y a 9600 baudios usando la App
 * 5. Manejar! :D
 *
 * Copyright (c) 2014 GDG Antofagasta.
 * Author Rodrigo González.
 * Available via MIT LICENSE. See https://github.com/gdgchile/Charly-F1/blob/master/LICENSE.md for details.
 */

// Inicializa todo
void setup() {
  // initialize serial:
  Serial.begin(9600);
}

// Itera infinitamente
void loop() {
  // Si serial esta disponible
  if(Serial.available()) {
    // Esperamos algo
    delay(100);
    // Mientras siga disponible
    while(Serial.available() > 0) {
      // Imprimir en el monitor serial toda entrada
      Serial.println(Serial.read());
    }
  }
}
