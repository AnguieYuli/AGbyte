package pe.agbyte;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Rutas, búsqueda de programas instalados y registro de errores. */
public final class SistemaANYU {

    public static final String APP_ANYU = "AGbyte";
    public static final boolean WINDOWS_ANYU = System.getProperty("os.name", "").toLowerCase().contains("win");
    public static final boolean MAC_ANYU = System.getProperty("os.name", "").toLowerCase().contains("mac");

    private SistemaANYU() {
    }

    /** Carpeta de datos: %LOCALAPPDATA%\AGbyte en Windows (la misma que usa AGbyte.exe). */
    public static Path carpetaDatosANYU() {
        String baseANYU = System.getenv("LOCALAPPDATA");
        if (baseANYU == null || baseANYU.isBlank()) baseANYU = System.getProperty("user.home");
        Path pANYU = Paths.get(baseANYU, APP_ANYU);
        Path anteriorANYU = Paths.get(baseANYU, "Codyu");
        try {
            if (!Files.exists(pANYU) && Files.isDirectory(anteriorANYU)) Files.move(anteriorANYU, pANYU); // conserva lo guardado con el nombre anterior
        } catch (IOException eANYU) {
            // se sigue con una carpeta nueva
        }
        try {
            Files.createDirectories(pANYU);
        } catch (IOException eANYU) {
            // si no se puede crear, se usará igual y fallarán solo las escrituras
        }
        return pANYU;
    }

    public static void logANYU(String mensajeANYU) {
        try {
            Path fANYU = carpetaDatosANYU().resolve("agbyte-java.log");
            Files.writeString(fANYU, LocalDateTime.now() + "  " + mensajeANYU + System.lineSeparator(), StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException eANYU) {
            // sin registro
        }
    }

    public static void logANYU(String mensajeANYU, Throwable tANYU) {
        StringWriter wANYU = new StringWriter();
        tANYU.printStackTrace(new PrintWriter(wANYU));
        logANYU(mensajeANYU + System.lineSeparator() + wANYU);
    }

    /** Busca un programa en el PATH (en Windows prueba también con .exe). */
    public static Path enPathANYU(String nombreANYU) {
        String pathANYU = System.getenv("PATH");
        if (pathANYU == null) return null;
        for (String dirANYU : pathANYU.split(File.pathSeparator)) {
            if (dirANYU.isBlank()) continue;
            for (String nANYU : WINDOWS_ANYU ? new String[]{nombreANYU + ".exe", nombreANYU} : new String[]{nombreANYU}) {
                Path pANYU = Paths.get(dirANYU.trim(), nANYU);
                if (Files.isRegularFile(pANYU) && (WINDOWS_ANYU || Files.isExecutable(pANYU))) return pANYU;
            }
        }
        return null;
    }

    /** Devuelve todos los archivos que coinciden con un patrón simple tipo carpeta/*\/bin/java.exe. */
    public static List<Path> buscarANYU(String raizANYU, String... partesANYU) {
        List<Path> actualesANYU = new ArrayList<>();
        if (raizANYU == null) return actualesANYU;
        Path rANYU = Paths.get(raizANYU);
        if (!Files.isDirectory(rANYU)) return actualesANYU;
        actualesANYU.add(rANYU);
        for (String parteANYU : partesANYU) {
            List<Path> siguientesANYU = new ArrayList<>();
            for (Path aANYU : actualesANYU) {
                if (parteANYU.contains("*")) {
                    String regexANYU = parteANYU.replace(".", "\\.").replace("*", ".*");
                    try (var hijosANYU = Files.list(aANYU)) {
                        hijosANYU.filter(hANYU -> hANYU.getFileName().toString().toLowerCase().matches(regexANYU.toLowerCase()))
                                .forEach(siguientesANYU::add);
                    } catch (IOException eANYU) {
                        // carpeta sin permiso
                    }
                } else {
                    Path hANYU = aANYU.resolve(parteANYU);
                    if (Files.exists(hANYU)) siguientesANYU.add(hANYU);
                }
            }
            actualesANYU = siguientesANYU;
        }
        actualesANYU.removeIf(pANYU -> !Files.isRegularFile(pANYU));
        return actualesANYU;
    }

    /** El archivo con la versión más alta según los números de su ruta (Python313 > Python39, jdk-21 > jdk-17). */
    public static Path masNuevoANYU(List<Path> rutasANYU) {
        return rutasANYU.stream().max(Comparator.comparing(SistemaANYU::versionANYU, SistemaANYU::compararANYU)).orElse(null);
    }

    private static List<Integer> versionANYU(Path pANYU) {
        List<Integer> vANYU = new ArrayList<>();
        Matcher mANYU = Pattern.compile("\\d+").matcher(pANYU.toString());
        while (mANYU.find() && vANYU.size() < 4) {
            try {
                vANYU.add(Integer.parseInt(mANYU.group()));
            } catch (NumberFormatException eANYU) {
                vANYU.add(0);
            }
        }
        return vANYU;
    }

    private static int compararANYU(List<Integer> aANYU, List<Integer> bANYU) {
        for (int kANYU = 0; kANYU < Math.max(aANYU.size(), bANYU.size()); kANYU++) {
            int xANYU = kANYU < aANYU.size() ? aANYU.get(kANYU) : 0, yANYU = kANYU < bANYU.size() ? bANYU.get(kANYU) : 0;
            if (xANYU != yANYU) return Integer.compare(xANYU, yANYU);
        }
        return 0;
    }

    public static String envANYU(String nombreANYU, String porDefectoANYU) {
        String vANYU = System.getenv(nombreANYU);
        return vANYU == null || vANYU.isBlank() ? porDefectoANYU : vANYU;
    }
}
