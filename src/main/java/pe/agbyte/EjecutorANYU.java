package pe.agbyte;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Ejecuta el código del editor: Python, Java y C++ con los programas instalados en tu PC,
 * y SQL con el SQLite que trae Python. Todo corre en tu equipo: si falta el intérprete o
 * compilador de un lenguaje, AGbyte lo dice claramente en vez de mandar tu código a internet.
 * JavaScript, HTML y CSS se ejecutan dentro de la app, no aquí.
 */
public final class EjecutorANYU {

    private static final int MAX_SALIDA_ANYU = 64 * 1024;
    private static final int TIEMPO_EJECUCION_ANYU = 8;
    private static final int TIEMPO_COMPILACION_ANYU = 40;

    private static List<String> pythonCmdANYU;
    private static Path javaExeANYU;
    private static Path gppExeANYU;
    private static boolean buscadoANYU;
    private static Path ayudanteSqlANYU;

    private EjecutorANYU() {
    }

    // ------------------------------------------------------------------ programas instalados

    public static synchronized void buscarHerramientasANYU() {
        if (buscadoANYU) return;
        pythonCmdANYU = buscarPythonANYU();
        javaExeANYU = buscarJavaANYU();
        gppExeANYU = buscarGppANYU();
        buscadoANYU = true;
        SistemaANYU.logANYU("Python: " + pythonCmdANYU + " | Java: " + javaExeANYU + " | g++: " + gppExeANYU);
    }

    private static List<String> buscarPythonANYU() {
        if (SistemaANYU.WINDOWS_ANYU) {
            Path pyANYU = SistemaANYU.enPathANYU("py");
            if (pyANYU != null) return List.of(pyANYU.toString(), "-3");
            Path localANYU = SistemaANYU.masNuevoANYU(SistemaANYU.buscarANYU(System.getenv("LOCALAPPDATA"), "Programs", "Python", "Python3*", "python.exe"));
            if (localANYU != null) return List.of(localANYU.toString());
            Path pANYU = SistemaANYU.enPathANYU("python");
            if (pANYU != null && !pANYU.toString().contains("WindowsApps")) return List.of(pANYU.toString());
            return null;
        }
        Path pANYU = SistemaANYU.enPathANYU("python3");
        if (pANYU == null) pANYU = SistemaANYU.enPathANYU("python");
        return pANYU == null ? null : List.of(pANYU.toString());
    }

    private static Path buscarJavaANYU() {
        String exeANYU = SistemaANYU.WINDOWS_ANYU ? "java.exe" : "java";
        List<Path> candidatosANYU = new ArrayList<>();
        String javaHomeANYU = System.getenv("JAVA_HOME");
        if (javaHomeANYU != null && !javaHomeANYU.isBlank()) {
            Path pANYU = Paths.get(javaHomeANYU, "bin", exeANYU);
            if (Files.isRegularFile(pANYU)) candidatosANYU.add(pANYU);
        }
        if (SistemaANYU.WINDOWS_ANYU) {
            for (String raizANYU : new String[]{SistemaANYU.envANYU("ProgramFiles", "C:\\Program Files"), SistemaANYU.envANYU("ProgramFiles(x86)", "C:\\Program Files (x86)")}) {
                for (String marcaANYU : new String[]{"Eclipse Adoptium", "Java", "Microsoft", "Zulu", "Amazon Corretto", "BellSoft"}) {
                    candidatosANYU.addAll(SistemaANYU.buscarANYU(raizANYU, marcaANYU, "*", "bin", exeANYU));
                }
            }
        }
        Path mejorANYU = SistemaANYU.masNuevoANYU(candidatosANYU);
        if (mejorANYU != null) return mejorANYU;
        // El Java con el que corre AGbyte sirve si trae el compilador (un JDK, no solo un JRE).
        if (ModuleLayer.boot().findModule("jdk.compiler").isPresent()) {
            Path propioANYU = Paths.get(System.getProperty("java.home"), "bin", exeANYU);
            if (Files.isRegularFile(propioANYU)) return propioANYU;
        }
        return SistemaANYU.enPathANYU("java");
    }

    private static Path buscarGppANYU() {
        Path pANYU = SistemaANYU.enPathANYU("g++");
        if (pANYU != null) return pANYU;
        if (!SistemaANYU.WINDOWS_ANYU) return null;
        List<Path> cANYU = new ArrayList<>();
        for (String raizANYU : new String[]{SistemaANYU.envANYU("ProgramFiles", "C:\\Program Files"), SistemaANYU.envANYU("ProgramFiles(x86)", "C:\\Program Files (x86)")}) {
            cANYU.addAll(SistemaANYU.buscarANYU(raizANYU, "CodeBlocks", "MinGW", "bin", "g++.exe"));
            cANYU.addAll(SistemaANYU.buscarANYU(raizANYU, "mingw*", "bin", "g++.exe"));
        }
        cANYU.addAll(SistemaANYU.buscarANYU("C:\\MinGW", "bin", "g++.exe"));
        cANYU.addAll(SistemaANYU.buscarANYU("C:\\msys64", "ucrt64", "bin", "g++.exe"));
        cANYU.addAll(SistemaANYU.buscarANYU("C:\\msys64", "mingw64", "bin", "g++.exe"));
        cANYU.addAll(SistemaANYU.buscarANYU("C:\\mingw64", "bin", "g++.exe"));
        return SistemaANYU.masNuevoANYU(cANYU);
    }

    public static Map<String, Object> infoANYU() {
        buscarHerramientasANYU();
        Map<String, Object> mANYU = new LinkedHashMap<>();
        mANYU.put("python", pythonCmdANYU != null ? "Python en tu PC" : "Python en línea");
        mANYU.put("java", javaExeANYU != null ? "Java en tu PC" : "Java en línea");
        mANYU.put("cpp", gppExeANYU != null ? "g++ en tu PC" : "C++ en línea");
        mANYU.put("sql", pythonCmdANYU != null ? "SQLite (con Python)" : "SQL necesita Python");
        return mANYU;
    }

    // ------------------------------------------------------------------ ejecutar

    public static Map<String, Object> ejecutarANYU(String lenguajeANYU, String codigoANYU, String entradaANYU) {
        buscarHerramientasANYU();
        Map<String, Object> rANYU;
        switch (lenguajeANYU) {
            case "python": rANYU = pythonANYU(codigoANYU, entradaANYU); break;
            case "java": rANYU = javaANYU(codigoANYU, entradaANYU); break;
            case "cpp": rANYU = cppANYU(codigoANYU, entradaANYU); break;
            case "sql": rANYU = sqlANYU(codigoANYU); break;
            default: throw new IllegalArgumentException("lenguaje no soportado");
        }
        rANYU.put("ok", Integer.valueOf(0).equals(rANYU.get("code")) && !Boolean.TRUE.equals(rANYU.get("timeout")));
        return rANYU;
    }

    private static Map<String, Object> pythonANYU(String codigoANYU, String entradaANYU) {
        if (pythonCmdANYU == null) return sinHerramientaANYU("No encontré Python instalado en tu PC. Instálalo desde python.org y vuelve a abrir AGbyte.");
        return conCarpetaANYU(dANYU -> {
            Files.writeString(dANYU.resolve("main.py"), codigoANYU, StandardCharsets.UTF_8);
            List<String> cmdANYU = new ArrayList<>(pythonCmdANYU);
            cmdANYU.addAll(List.of("-X", "utf8", "main.py"));
            Map<String, String> envANYU = Map.of("PYTHONIOENCODING", "utf-8", "PYTHONUTF8", "1", "PYTHONDONTWRITEBYTECODE", "1");
            Map<String, Object> rANYU = correrANYU(cmdANYU, dANYU, entradaANYU, TIEMPO_EJECUCION_ANYU, envANYU);
            rANYU.put("stderr", String.valueOf(rANYU.get("stderr")).replace(dANYU.resolve("main.py").toString(), "main.py"));
            rANYU.put("runner", "Python en tu PC");
            return rANYU;
        });
    }

    private static Map<String, Object> javaANYU(String codigoANYU, String entradaANYU) {
        if (javaExeANYU == null) return sinHerramientaANYU("No encontré un JDK de Java instalado en tu PC. Instala uno (por ejemplo Eclipse Temurin) y vuelve a abrir AGbyte.");
        return conCarpetaANYU(dANYU -> {
            Matcher mANYU = Pattern.compile("public\\s+class\\s+(\\w+)").matcher(codigoANYU);
            String nombreANYU = (mANYU.find() ? mANYU.group(1) : "Main") + ".java";
            Files.writeString(dANYU.resolve(nombreANYU), codigoANYU, StandardCharsets.UTF_8);
            List<String> cmdANYU = List.of(javaExeANYU.toString(), "-Dfile.encoding=UTF-8", "-Dstdout.encoding=UTF-8", "-Dstderr.encoding=UTF-8",
                    "-Duser.language=en", "-Duser.country=US", nombreANYU);
            Map<String, Object> rANYU = correrANYU(cmdANYU, dANYU, entradaANYU, 20, Map.of());
            String errANYU = String.valueOf(rANYU.get("stderr")).replace(dANYU.resolve(nombreANYU).toString(), nombreANYU);
            errANYU = errANYU.lines().filter(lANYU -> !lANYU.startsWith("Picked up JAVA_TOOL_OPTIONS") && !lANYU.startsWith("Picked up _JAVA_OPTIONS"))
                    .collect(Collectors.joining("\n"));
            rANYU.put("stderr", errANYU);
            rANYU.put("runner", "Java en tu PC");
            return rANYU;
        });
    }

    private static Map<String, Object> cppANYU(String codigoANYU, String entradaANYU) {
        if (gppExeANYU == null) return sinHerramientaANYU("No encontré g++ instalado en tu PC. Instala MinGW (o el g++ de tu sistema) y vuelve a abrir AGbyte.");
        return conCarpetaANYU(dANYU -> {
            Files.writeString(dANYU.resolve("main.cpp"), codigoANYU, StandardCharsets.UTF_8);
            Path exeANYU = dANYU.resolve(SistemaANYU.WINDOWS_ANYU ? "main.exe" : "main");
            String pathANYU = gppExeANYU.getParent() + File.pathSeparator + SistemaANYU.envANYU("PATH", "");
            Map<String, String> envANYU = Map.of(SistemaANYU.WINDOWS_ANYU ? "Path" : "PATH", pathANYU);
            Map<String, Object> cANYU = correrANYU(List.of(gppExeANYU.toString(), "-std=c++17", "-O0", "-o", exeANYU.toString(), "main.cpp"), dANYU, "", TIEMPO_COMPILACION_ANYU, envANYU);
            if (!Integer.valueOf(0).equals(cANYU.get("code"))) {
                cANYU.put("stderr", String.valueOf(cANYU.get("stderr")).replace(dANYU.resolve("main.cpp").toString(), "main.cpp"));
                cANYU.put("phase", "compile");
                cANYU.put("runner", "g++ en tu PC");
                return cANYU;
            }
            Map<String, Object> rANYU = correrANYU(List.of(exeANYU.toString()), dANYU, entradaANYU, TIEMPO_EJECUCION_ANYU, envANYU);
            rANYU.put("ms", ((Number) rANYU.get("ms")).intValue() + ((Number) cANYU.get("ms")).intValue());
            rANYU.put("runner", "g++ en tu PC");
            return rANYU;
        });
    }

    private static Map<String, Object> sqlANYU(String codigoANYU) {
        if (pythonCmdANYU == null) {
            return sinHerramientaANYU("Para ejecutar SQL, AGbyte usa el SQLite que viene con Python. Instala Python desde python.org y vuelve a abrir AGbyte.");
        }
        return conCarpetaANYU(dANYU -> {
            Files.writeString(dANYU.resolve("consulta.sql"), codigoANYU, StandardCharsets.UTF_8);
            List<String> cmdANYU = new ArrayList<>(pythonCmdANYU);
            cmdANYU.addAll(List.of("-X", "utf8", ayudanteSqlANYU().toString(), "consulta.sql"));
            Map<String, Object> rANYU = correrANYU(cmdANYU, dANYU, "", 15, Map.of("PYTHONIOENCODING", "utf-8", "PYTHONUTF8", "1"));
            if (!Integer.valueOf(0).equals(rANYU.get("code"))) {
                rANYU.put("runner", "SQLite");
                return rANYU;
            }
            Map<String, Object> resANYU = JsonANYU.objetoANYU(String.valueOf(rANYU.get("stdout")));
            resANYU.put("code", ((Number) resANYU.get("code")).intValue());
            return resANYU;
        });
    }

    private static synchronized Path ayudanteSqlANYU() throws IOException {
        if (ayudanteSqlANYU == null) {
            Path destinoANYU = SistemaANYU.carpetaDatosANYU().resolve("sql_ejecutor.py");
            try (InputStream inANYU = EjecutorANYU.class.getResourceAsStream("/sql_ejecutor.py")) {
                if (inANYU == null) throw new IOException("Falta sql_ejecutor.py dentro de AGbyte");
                Files.write(destinoANYU, inANYU.readAllBytes());
            }
            ayudanteSqlANYU = destinoANYU;
        }
        return ayudanteSqlANYU;
    }

    // ------------------------------------------------------------------ sin herramienta instalada

    /** Todo se ejecuta en tu PC: si falta el intérprete/compilador, se avisa en vez de usar internet. */
    private static Map<String, Object> sinHerramientaANYU(String mensajeANYU) {
        Map<String, Object> rANYU = resultadoANYU(-1, "", mensajeANYU, 0, false);
        rANYU.put("runner", "sin ejecutor");
        return rANYU;
    }

    // ------------------------------------------------------------------ procesos

    private interface TareaANYU {
        Map<String, Object> hacerANYU(Path carpetaANYU) throws Exception;
    }

    private static Map<String, Object> conCarpetaANYU(TareaANYU tANYU) {
        Path dANYU = null;
        try {
            dANYU = Files.createTempDirectory("agbyte");
            return tANYU.hacerANYU(dANYU);
        } catch (Exception eANYU) {
            SistemaANYU.logANYU("Error al ejecutar", eANYU);
            Map<String, Object> rANYU = resultadoANYU(-1, "", "Error interno: " + eANYU.getMessage(), 0, false);
            rANYU.put("runner", "AGbyte");
            return rANYU;
        } finally {
            borrarANYU(dANYU);
        }
    }

    private static Map<String, Object> correrANYU(List<String> cmdANYU, Path carpetaANYU, String entradaANYU, int segundosANYU, Map<String, String> envANYU) throws IOException, InterruptedException {
        Path inANYU = carpetaANYU.resolve("__entrada.txt"), outANYU = carpetaANYU.resolve("__salida.txt"), errANYU = carpetaANYU.resolve("__error.txt");
        Files.writeString(inANYU, entradaANYU == null ? "" : entradaANYU, StandardCharsets.UTF_8);
        ProcessBuilder pbANYU = new ProcessBuilder(cmdANYU).directory(carpetaANYU.toFile())
                .redirectInput(inANYU.toFile()).redirectOutput(outANYU.toFile()).redirectError(errANYU.toFile());
        pbANYU.environment().putAll(envANYU);
        long inicioANYU = System.currentTimeMillis();
        Process pANYU = pbANYU.start();
        boolean terminoANYU = pANYU.waitFor(segundosANYU, TimeUnit.SECONDS);
        if (!terminoANYU) {
            pANYU.descendants().forEach(ProcessHandle::destroyForcibly);
            pANYU.destroyForcibly();
            pANYU.waitFor(3, TimeUnit.SECONDS);
            return resultadoANYU(-1, recortarANYU(leerANYU(outANYU)),
                    "El programa tardó más de " + segundosANYU + " s y se detuvo. ¿Hay un bucle infinito o espera una entrada?", segundosANYU * 1000, true);
        }
        return resultadoANYU(pANYU.exitValue(), recortarANYU(leerANYU(outANYU)), recortarANYU(leerANYU(errANYU)), (int) (System.currentTimeMillis() - inicioANYU), false);
    }

    /** Lee la salida del programa (como máximo un poco más de lo que se muestra, por si imprime sin parar). */
    private static String leerANYU(Path fANYU) throws IOException {
        if (!Files.exists(fANYU)) return "";
        byte[] datosANYU;
        try (InputStream inANYU = Files.newInputStream(fANYU)) {
            datosANYU = inANYU.readNBytes(MAX_SALIDA_ANYU * 4 + 1);
        }
        return new String(datosANYU, StandardCharsets.UTF_8).replace("\r\n", "\n");
    }

    private static String recortarANYU(String tANYU) {
        return tANYU.length() > MAX_SALIDA_ANYU ? tANYU.substring(0, MAX_SALIDA_ANYU) + "\n… (salida recortada)" : tANYU;
    }

    private static Map<String, Object> resultadoANYU(int codeANYU, String stdoutANYU, String stderrANYU, int msANYU, boolean timeoutANYU) {
        Map<String, Object> rANYU = new HashMap<>();
        rANYU.put("code", codeANYU);
        rANYU.put("stdout", stdoutANYU);
        rANYU.put("stderr", stderrANYU);
        rANYU.put("ms", msANYU);
        rANYU.put("timeout", timeoutANYU);
        return rANYU;
    }

    private static void borrarANYU(Path dANYU) {
        if (dANYU == null) return;
        try (var todoANYU = Files.walk(dANYU)) {
            todoANYU.sorted(Comparator.reverseOrder()).forEach(pANYU -> {
                try {
                    Files.deleteIfExists(pANYU);
                } catch (IOException eANYU) {
                    // un archivo en uso se queda en la carpeta temporal
                }
            });
        } catch (IOException eANYU) {
            // nada que borrar
        }
    }
}
