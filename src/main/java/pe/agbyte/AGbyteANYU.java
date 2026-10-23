package pe.agbyte;

import java.util.Arrays;
import java.util.List;

/**
 * AGbyte en Java: inicia el servidor local y abre la app en su propia ventana.
 *
 *   java -jar AGbyte.jar              abre AGbyte en una ventana propia (Edge o Chrome en modo app)
 *   java -jar AGbyte.jar --navegador  abre AGbyte en tu navegador normal
 *   java -jar AGbyte.jar --servidor   solo el servidor (para pruebas)
 */
public final class AGbyteANYU {

    private AGbyteANYU() {
    }

    public static void main(String[] argsANYU) throws Exception {
        System.setProperty("java.net.useSystemProxies", "true"); // respeta el proxy configurado en Windows
        List<String> opcionesANYU = Arrays.asList(argsANYU);
        ServidorANYU servidorANYU = ServidorANYU.iniciarANYU();
        int puertoANYU = servidorANYU == null ? ServidorANYU.PUERTO_ANYU : servidorANYU.puertoANYU();
        String urlANYU = "http://127.0.0.1:" + puertoANYU + "/index.html";

        if (servidorANYU != null) {
            // Busca Python, Java y g++ en segundo plano para que la primera ejecución sea rápida.
            Thread tANYU = new Thread(EjecutorANYU::buscarHerramientasANYU, "buscar-herramientas");
            tANYU.setDaemon(true);
            tANYU.start();
        }

        if (opcionesANYU.contains("--servidor")) {
            System.out.println("AGbyte escuchando en " + urlANYU);
            if (servidorANYU == null) return;
            Thread.currentThread().join(); // hasta que lo cierren con Ctrl+C
        }

        if (servidorANYU == null) {
            // Ya hay un AGbyte abierto: abrimos otra ventana que usa su servidor y su progreso.
            if (opcionesANYU.contains("--navegador") || VentanaANYU.abrirVentanaAppANYU(urlANYU) == null) VentanaANYU.abrirEnNavegadorANYU(urlANYU);
            return;
        }

        if (!opcionesANYU.contains("--navegador")) {
            long inicioANYU = System.currentTimeMillis();
            Process ventanaANYU = VentanaANYU.abrirVentanaAppANYU(urlANYU);
            if (ventanaANYU != null) {
                int salidaANYU = ventanaANYU.waitFor();
                if (System.currentTimeMillis() - inicioANYU > 5000) {
                    // El usuario cerró la ventana de AGbyte: se apaga todo.
                    SistemaANYU.logANYU("Ventana cerrada (" + salidaANYU + ")");
                    servidorANYU.detenerANYU();
                    System.exit(0);
                }
                // La ventana se unió a otra ya abierta con el mismo perfil: no sabemos cuándo se cierra,
                // así que mostramos la ventanita de control para apagar AGbyte.
                VentanaANYU.ventanaControlANYU(urlANYU);
                return;
            }
        }
        VentanaANYU.abrirEnNavegadorANYU(urlANYU);
        VentanaANYU.ventanaControlANYU(urlANYU);
    }
}
