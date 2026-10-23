package pe.agbyte;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.WindowConstants;

/**
 * Abre AGbyte en su propia ventana. Usa Microsoft Edge (viene con Windows) o Google Chrome en «modo app»:
 * una ventana sin barra de direcciones ni pestañas, con su propio perfil en %LOCALAPPDATA%\AGbyte\ventana.
 */
public final class VentanaANYU {

    private VentanaANYU() {
    }

    /** Edge, Chrome, Brave o Chromium instalados (el primero que encuentre). */
    public static Path navegadorAppANYU() {
        List<Path> cANYU = new ArrayList<>();
        if (SistemaANYU.WINDOWS_ANYU) {
            String[] raicesANYU = {SistemaANYU.envANYU("ProgramFiles(x86)", "C:\\Program Files (x86)"), SistemaANYU.envANYU("ProgramFiles", "C:\\Program Files"),
                    SistemaANYU.envANYU("LOCALAPPDATA", "")};
            for (String rANYU : raicesANYU) cANYU.add(Paths.get(rANYU, "Microsoft", "Edge", "Application", "msedge.exe"));
            for (String rANYU : raicesANYU) cANYU.add(Paths.get(rANYU, "Google", "Chrome", "Application", "chrome.exe"));
            for (String rANYU : raicesANYU) cANYU.add(Paths.get(rANYU, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"));
        } else if (SistemaANYU.MAC_ANYU) {
            cANYU.add(Paths.get("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"));
            cANYU.add(Paths.get("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"));
            cANYU.add(Paths.get("/Applications/Chromium.app/Contents/MacOS/Chromium"));
        } else {
            for (String nANYU : new String[]{"microsoft-edge", "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"}) {
                Path pANYU = SistemaANYU.enPathANYU(nANYU);
                if (pANYU != null) cANYU.add(pANYU);
            }
        }
        for (Path pANYU : cANYU) {
            if (Files.isRegularFile(pANYU)) return pANYU;
        }
        return null;
    }

    /** Abre la ventana de AGbyte. Devuelve el proceso (para saber cuándo se cierra) o null si no hay Edge/Chrome. */
    public static Process abrirVentanaAppANYU(String urlANYU) {
        Path exeANYU = navegadorAppANYU();
        if (exeANYU == null) return null;
        Path perfilANYU = SistemaANYU.carpetaDatosANYU().resolve("ventana");
        if (!Files.exists(perfilANYU)) prepararPerfilANYU(perfilANYU);
        List<String> cmdANYU = List.of(exeANYU.toString(), "--app=" + urlANYU, "--user-data-dir=" + perfilANYU, "--window-size=1440,900",
                "--no-first-run", "--no-default-browser-check", "--disable-features=Translate");
        try {
            SistemaANYU.logANYU("Abriendo ventana con " + exeANYU);
            return new ProcessBuilder(cmdANYU).redirectErrorStream(true).redirectOutput(ProcessBuilder.Redirect.DISCARD).start();
        } catch (IOException eANYU) {
            SistemaANYU.logANYU("No se pudo abrir " + exeANYU, eANYU);
            return null;
        }
    }

    /**
     * Primera vez: crea el perfil de la ventana y trae el progreso guardado por AGbyte.exe (la versión de Python
     * guarda en %LOCALAPPDATA%\AGbyte\EBWebView). Así no empiezas de cero al cambiarte a la versión Java.
     */
    private static void prepararPerfilANYU(Path perfilANYU) {
        try {
            Files.createDirectories(perfilANYU);
            // Que Edge/Chrome no se quede abierto en segundo plano al cerrar la ventana de AGbyte.
            Files.writeString(perfilANYU.resolve("Local State"), "{\"background_mode\": {\"enabled\": false}}", StandardCharsets.UTF_8);
            Path anteriorANYU = SistemaANYU.carpetaDatosANYU().resolve("EBWebView").resolve("Default").resolve("Local Storage");
            if (Files.isDirectory(anteriorANYU)) {
                copiarANYU(anteriorANYU, perfilANYU.resolve("Default").resolve("Local Storage"));
                SistemaANYU.logANYU("Progreso copiado desde " + anteriorANYU);
            }
        } catch (IOException eANYU) {
            SistemaANYU.logANYU("No se pudo preparar el perfil de la ventana", eANYU);
        }
    }

    private static void copiarANYU(Path origenANYU, Path destinoANYU) throws IOException {
        try (var todoANYU = Files.walk(origenANYU)) {
            for (Path pANYU : (Iterable<Path>) todoANYU::iterator) {
                Path dANYU = destinoANYU.resolve(origenANYU.relativize(pANYU).toString());
                if (Files.isDirectory(pANYU)) {
                    Files.createDirectories(dANYU);
                } else if (!pANYU.getFileName().toString().equals("LOCK")) {
                    Files.copy(pANYU, dANYU, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }
    }

    /** Abre un enlace en el navegador normal (sin esperar). */
    public static void abrirEnNavegadorANYU(String urlANYU) {
        Thread tANYU = new Thread(() -> {
            try {
                if (!GraphicsEnvironment.isHeadless() && Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(URI.create(urlANYU));
                    return;
                }
            } catch (Exception eANYU) {
                // se prueba con el comando del sistema
            }
            try {
                List<String> cmdANYU = SistemaANYU.WINDOWS_ANYU ? List.of("rundll32", "url.dll,FileProtocolHandler", urlANYU)
                        : SistemaANYU.MAC_ANYU ? List.of("open", urlANYU) : List.of("xdg-open", urlANYU);
                new ProcessBuilder(cmdANYU).redirectErrorStream(true).redirectOutput(ProcessBuilder.Redirect.DISCARD).start();
            } catch (IOException eANYU) {
                SistemaANYU.logANYU("No se pudo abrir el navegador: " + eANYU.getMessage());
            }
        }, "abrir-navegador");
        tANYU.setDaemon(true);
        tANYU.start();
    }

    /**
     * Ventanita de control para cuando AGbyte se abre en el navegador normal:
     * mientras esté abierta, el editor puede ejecutar código; al cerrarla se apaga AGbyte.
     */
    public static void ventanaControlANYU(String urlANYU) {
        if (GraphicsEnvironment.isHeadless()) {
            System.out.println("AGbyte está abierto en " + urlANYU);
            System.out.println("Pulsa Ctrl+C para apagarlo.");
            return;
        }
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); // botones con el aspecto de Windows
            } catch (Exception eANYU) {
                // se queda el aspecto por defecto de Java
            }
            Color vinoANYU = new Color(0x7A, 0x1A, 0x35);
            JFrame fANYU = new JFrame("AGbyte");
            fANYU.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
            Image iconoANYU = iconoANYU();
            if (iconoANYU != null) fANYU.setIconImage(iconoANYU);

            JPanel cabeceraANYU = new JPanel(new BorderLayout());
            cabeceraANYU.setBackground(vinoANYU);
            cabeceraANYU.setBorder(BorderFactory.createEmptyBorder(16, 20, 16, 20));
            JLabel tituloANYU = new JLabel("AGbyte está abierto");
            tituloANYU.setForeground(Color.WHITE);
            tituloANYU.setFont(tituloANYU.getFont().deriveFont(Font.BOLD, 18f));
            cabeceraANYU.add(tituloANYU, BorderLayout.CENTER);

            JLabel textoANYU = new JLabel("<html><body style='width:300px'>Se abrió en tu navegador. Deja esta ventana abierta "
                    + "mientras usas AGbyte: así el editor puede ejecutar tu código. Ciérrala para apagar AGbyte.</body></html>");
            textoANYU.setFont(textoANYU.getFont().deriveFont(14f));
            textoANYU.setBorder(BorderFactory.createEmptyBorder(16, 20, 8, 20));

            JButton abrirANYU = new JButton("Abrir AGbyte otra vez");
            abrirANYU.addActionListener(eANYU -> abrirEnNavegadorANYU(urlANYU));
            JButton cerrarANYU = new JButton("Cerrar AGbyte");
            cerrarANYU.addActionListener(eANYU -> System.exit(0));
            JPanel botonesANYU = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 12));
            botonesANYU.setBackground(Color.WHITE);
            botonesANYU.add(abrirANYU);
            botonesANYU.add(cerrarANYU);

            JPanel cuerpoANYU = new JPanel(new BorderLayout());
            cuerpoANYU.setBackground(Color.WHITE);
            cuerpoANYU.add(textoANYU, BorderLayout.CENTER);
            cuerpoANYU.add(botonesANYU, BorderLayout.SOUTH);

            fANYU.getContentPane().add(cabeceraANYU, BorderLayout.NORTH);
            fANYU.getContentPane().add(cuerpoANYU, BorderLayout.CENTER);
            fANYU.setMinimumSize(new Dimension(420, 220));
            fANYU.pack();
            fANYU.setLocationRelativeTo(null);
            fANYU.setVisible(true);
        });
    }

    private static Image iconoANYU() {
        try (InputStream inANYU = VentanaANYU.class.getResourceAsStream("/icono.png")) {
            return inANYU == null ? null : ImageIO.read(inANYU);
        } catch (IOException eANYU) {
            return null;
        }
    }
}
