package pe.agbyte;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.BindException;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.JarURLConnection;
import java.net.Proxy;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Executors;

/**
 * Servidor local de AGbyte (solo accesible desde tu PC, en http://127.0.0.1:47615).
 * Entrega las pantallas de la app y responde a su API:
 *   GET  /api/token, /api/info
 *   POST /api/run
 * Se usa siempre el mismo puerto para que el progreso (guardado por la ventana) no se pierda.
 */
public final class ServidorANYU {

    public static final int PUERTO_ANYU = 47615;
    private static final int MAX_CUERPO_ANYU = 512 * 1024;
    private static final Set<String> LENGUAJES_ANYU = Set.of("python", "java", "cpp", "sql");
    private static final Map<String, String> TIPOS_ANYU = new HashMap<>();

    static {
        TIPOS_ANYU.put("html", "text/html; charset=utf-8");
        TIPOS_ANYU.put("js", "text/javascript; charset=utf-8");
        TIPOS_ANYU.put("css", "text/css; charset=utf-8");
        TIPOS_ANYU.put("json", "application/json; charset=utf-8");
        TIPOS_ANYU.put("txt", "text/plain; charset=utf-8");
        TIPOS_ANYU.put("svg", "image/svg+xml");
        TIPOS_ANYU.put("png", "image/png");
        TIPOS_ANYU.put("jpg", "image/jpeg");
        TIPOS_ANYU.put("jpeg", "image/jpeg");
        TIPOS_ANYU.put("gif", "image/gif");
        TIPOS_ANYU.put("webp", "image/webp");
        TIPOS_ANYU.put("ico", "image/x-icon");
        TIPOS_ANYU.put("woff", "font/woff");
        TIPOS_ANYU.put("woff2", "font/woff2");
    }

    private final String tokenANYU;
    private final HttpServer httpANYU;
    private final int puertoANYU;

    private ServidorANYU(HttpServer httpANYU) {
        byte[] bANYU = new byte[16];
        new SecureRandom().nextBytes(bANYU);
        StringBuilder tANYU = new StringBuilder();
        for (byte xANYU : bANYU) tANYU.append(String.format("%02x", xANYU));
        this.tokenANYU = tANYU.toString();
        this.httpANYU = httpANYU;
        this.puertoANYU = httpANYU.getAddress().getPort();
        httpANYU.createContext("/", this::atenderANYU);
        httpANYU.setExecutor(Executors.newCachedThreadPool(rANYU -> {
            Thread hANYU = new Thread(rANYU, "agbyte-http");
            hANYU.setDaemon(true);
            return hANYU;
        }));
    }

    /**
     * Inicia el servidor en el puerto 47615. Si ya hay un AGbyte abierto, devuelve null (se comparte el suyo).
     * Si el puerto lo usa otro programa, se elige uno libre.
     */
    public static ServidorANYU iniciarANYU() throws IOException {
        // Sin esto, cada respuesta pequeña espera ~40 ms (200 ms en Windows) por el algoritmo de Nagle.
        System.setProperty("sun.net.httpserver.nodelay", "true");
        InetAddress localANYU = InetAddress.getByName("127.0.0.1");
        HttpServer hANYU;
        try {
            hANYU = HttpServer.create(new InetSocketAddress(localANYU, PUERTO_ANYU), 64);
        } catch (BindException eANYU) {
            if (vivoANYU(PUERTO_ANYU)) return null;
            hANYU = HttpServer.create(new InetSocketAddress(localANYU, 0), 64);
        }
        ServidorANYU sANYU = new ServidorANYU(hANYU);
        hANYU.start();
        SistemaANYU.logANYU("Servidor en http://127.0.0.1:" + sANYU.puertoANYU);
        return sANYU;
    }

    public int puertoANYU() {
        return puertoANYU;
    }

    public void detenerANYU() {
        httpANYU.stop(0);
    }

    /** ¿Responde un AGbyte en ese puerto? */
    public static boolean vivoANYU(int puertoANYU) {
        try {
            HttpURLConnection cANYU = (HttpURLConnection) URI.create("http://127.0.0.1:" + puertoANYU + "/index.html").toURL().openConnection(Proxy.NO_PROXY);
            cANYU.setConnectTimeout(1000);
            cANYU.setReadTimeout(1000);
            int estadoANYU = cANYU.getResponseCode();
            cANYU.disconnect();
            return estadoANYU == 200;
        } catch (IOException eANYU) {
            return false;
        }
    }

    // ------------------------------------------------------------------ peticiones

    private void atenderANYU(HttpExchange exANYU) throws IOException {
        try {
            String rutaANYU = exANYU.getRequestURI().getPath();
            String metodoANYU = exANYU.getRequestMethod();
            if (rutaANYU.startsWith("/api/")) {
                if (metodoANYU.equals("GET")) apiGetANYU(exANYU, rutaANYU);
                else if (metodoANYU.equals("POST")) apiPostANYU(exANYU, rutaANYU);
                else jsonANYU(exANYU, 405, Map.of("error", "method not allowed"));
            } else if (metodoANYU.equals("GET") || metodoANYU.equals("HEAD")) {
                archivoANYU(exANYU, rutaANYU, metodoANYU.equals("HEAD"));
            } else {
                jsonANYU(exANYU, 405, Map.of("error", "method not allowed"));
            }
        } catch (Exception eANYU) {
            SistemaANYU.logANYU("Error en " + exANYU.getRequestURI(), eANYU);
            try {
                jsonANYU(exANYU, 500, Map.of("error", "error interno"));
            } catch (Exception ignoradoANYU) {
                // la respuesta ya se había enviado
            }
        } finally {
            exANYU.close();
        }
    }

    /** Solo la propia app puede usar la API: se comprueban Host, Origin y una clave por sesión. */
    private boolean confiableANYU(HttpExchange exANYU, boolean pideClaveANYU) {
        Set<String> hostsANYU = Set.of("127.0.0.1:" + puertoANYU, "localhost:" + puertoANYU);
        String hostANYU = exANYU.getRequestHeaders().getFirst("Host");
        if (hostANYU == null || !hostsANYU.contains(hostANYU)) return false;
        String origenANYU = exANYU.getRequestHeaders().getFirst("Origin");
        if (origenANYU != null && !origenANYU.equals("http://127.0.0.1:" + puertoANYU) && !origenANYU.equals("http://localhost:" + puertoANYU)) return false;
        String sitioANYU = exANYU.getRequestHeaders().getFirst("Sec-Fetch-Site");
        if (sitioANYU != null && !sitioANYU.equals("same-origin") && !sitioANYU.equals("none")) return false;
        return !pideClaveANYU || tokenANYU.equals(exANYU.getRequestHeaders().getFirst("X-AGbyte-Token"));
    }

    private void apiGetANYU(HttpExchange exANYU, String rutaANYU) throws IOException {
        if (!confiableANYU(exANYU, false)) {
            jsonANYU(exANYU, 403, Map.of("error", "forbidden"));
            return;
        }
        switch (rutaANYU) {
            case "/api/token":
                jsonANYU(exANYU, 200, Map.of("token", tokenANYU));
                break;
            case "/api/info":
                jsonANYU(exANYU, 200, EjecutorANYU.infoANYU());
                break;
            default:
                jsonANYU(exANYU, 404, Map.of("error", "not found"));
        }
    }

    private void apiPostANYU(HttpExchange exANYU, String rutaANYU) throws IOException {
        if (!confiableANYU(exANYU, true)) {
            jsonANYU(exANYU, 403, Map.of("error", "forbidden"));
            return;
        }
        try {
            byte[] datosANYU = leerCuerpoANYU(exANYU);
            if (datosANYU == null) {
                jsonANYU(exANYU, 413, Map.of("error", "too large"));
                return;
            }
            String textoANYU = new String(datosANYU, StandardCharsets.UTF_8);
            Map<String, Object> cuerpoANYU = textoANYU.isBlank() ? new LinkedHashMap<>() : JsonANYU.objetoANYU(textoANYU);
            switch (rutaANYU) {
                case "/api/run": {
                    Object lenguajeANYU = cuerpoANYU.get("lang");
                    if (!(lenguajeANYU instanceof String) || !LENGUAJES_ANYU.contains(lenguajeANYU)) {
                        jsonANYU(exANYU, 400, Map.of("error", "lenguaje no soportado"));
                        return;
                    }
                    jsonANYU(exANYU, 200, EjecutorANYU.ejecutarANYU((String) lenguajeANYU, JsonANYU.textoANYU(cuerpoANYU, "code"), JsonANYU.textoANYU(cuerpoANYU, "stdin")));
                    return;
                }
                default:
                    jsonANYU(exANYU, 404, Map.of("error", "not found"));
            }
        } catch (Exception eANYU) { // nunca dejar la app sin respuesta
            SistemaANYU.logANYU("Error en " + rutaANYU, eANYU);
            Map<String, Object> rANYU = new LinkedHashMap<>();
            rANYU.put("ok", false);
            rANYU.put("code", -1);
            rANYU.put("stdout", "");
            rANYU.put("stderr", "Error interno: " + eANYU.getMessage());
            rANYU.put("ms", 0);
            rANYU.put("runner", "AGbyte");
            jsonANYU(exANYU, 200, rANYU);
        }
    }

    // ------------------------------------------------------------------ archivos de la app

    private void archivoANYU(HttpExchange exANYU, String rutaANYU, boolean soloCabecerasANYU) throws IOException {
        if (rutaANYU.isEmpty() || rutaANYU.equals("/")) rutaANYU = "/index.html";
        if (rutaANYU.contains("..") || rutaANYU.contains("\\") || rutaANYU.contains("\0") || rutaANYU.endsWith("/")) {
            jsonANYU(exANYU, 404, Map.of("error", "not found"));
            return;
        }
        byte[] datosANYU = leerRecursoANYU(rutaANYU.substring(1));
        if (datosANYU == null) {
            enviarANYU(exANYU, 404, "text/plain; charset=utf-8", "No encontrado".getBytes(StandardCharsets.UTF_8), soloCabecerasANYU);
            return;
        }
        String nombreANYU = rutaANYU.substring(rutaANYU.lastIndexOf('/') + 1);
        String extANYU = nombreANYU.contains(".") ? nombreANYU.substring(nombreANYU.lastIndexOf('.') + 1).toLowerCase() : "";
        enviarANYU(exANYU, 200, TIPOS_ANYU.getOrDefault(extANYU, "application/octet-stream"), datosANYU, soloCabecerasANYU);
    }

    /** Las pantallas viven dentro del programa (carpeta /web). Desde el IDE también sirve src/main/resources/web. */
    private static byte[] leerRecursoANYU(String relativoANYU) throws IOException {
        URL urlANYU = ServidorANYU.class.getResource("/web/" + relativoANYU);
        if (urlANYU != null && !urlANYU.toString().endsWith("/")) {
            if (urlANYU.getProtocol().equals("file")) {
                try {
                    Path pANYU = Paths.get(urlANYU.toURI());
                    if (!Files.isRegularFile(pANYU)) return null;
                } catch (Exception eANYU) {
                    return null;
                }
            }
            URLConnection cANYU = urlANYU.openConnection();
            if (cANYU instanceof JarURLConnection && ((JarURLConnection) cANYU).getJarEntry().isDirectory()) return null;
            try (InputStream inANYU = cANYU.getInputStream()) {
                return inANYU.readAllBytes();
            }
        }
        for (String baseANYU : new String[]{"src/main/resources/web", "web"}) {
            Path raizANYU = Paths.get(baseANYU).toAbsolutePath().normalize();
            Path pANYU = raizANYU.resolve(relativoANYU).normalize();
            if (pANYU.startsWith(raizANYU) && Files.isRegularFile(pANYU)) return Files.readAllBytes(pANYU);
        }
        return null;
    }

    // ------------------------------------------------------------------ ayudas

    private static byte[] leerCuerpoANYU(HttpExchange exANYU) throws IOException {
        String largoANYU = exANYU.getRequestHeaders().getFirst("Content-Length");
        if (largoANYU != null) {
            try {
                if (Long.parseLong(largoANYU.trim()) > MAX_CUERPO_ANYU) return null;
            } catch (NumberFormatException eANYU) {
                return null;
            }
        }
        ByteArrayOutputStream bANYU = new ByteArrayOutputStream();
        byte[] bufANYU = new byte[16 * 1024];
        try (InputStream inANYU = exANYU.getRequestBody()) {
            int nANYU;
            while ((nANYU = inANYU.read(bufANYU)) > 0) {
                bANYU.write(bufANYU, 0, nANYU);
                if (bANYU.size() > MAX_CUERPO_ANYU) return null;
            }
        }
        return bANYU.toByteArray();
    }

    private static void jsonANYU(HttpExchange exANYU, int estadoANYU, Object objANYU) throws IOException {
        enviarANYU(exANYU, estadoANYU, "application/json; charset=utf-8", JsonANYU.stringifyANYU(objANYU).getBytes(StandardCharsets.UTF_8), false);
    }

    private static void enviarANYU(HttpExchange exANYU, int estadoANYU, String tipoANYU, byte[] datosANYU, boolean soloCabecerasANYU) throws IOException {
        exANYU.getResponseHeaders().set("Content-Type", tipoANYU);
        exANYU.getResponseHeaders().set("Cache-Control", "no-store");
        exANYU.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
        if (soloCabecerasANYU) {
            exANYU.getResponseHeaders().set("Content-Length", String.valueOf(datosANYU.length));
            exANYU.sendResponseHeaders(estadoANYU, -1);
            return;
        }
        exANYU.sendResponseHeaders(estadoANYU, datosANYU.length == 0 ? -1 : datosANYU.length);
        if (datosANYU.length > 0) {
            try (OutputStream outANYU = exANYU.getResponseBody()) {
                outANYU.write(datosANYU);
            }
        }
    }
}
