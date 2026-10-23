package pe.agbyte;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * «Continuar con Google» con el flujo oficial para apps de escritorio:
 * se abre Google en tu navegador, Google vuelve a http://127.0.0.1:puerto/oauth/google
 * y AGbyte cambia el código por tu nombre, correo y foto (con PKCE).
 * Necesita un ID de cliente de tipo «App de escritorio», guardado en %LOCALAPPDATA%\AGbyte\google-oauth.json.
 */
public final class GoogleLoginANYU {

    private static final String AUTH_ANYU = SistemaANYU.envANYU("AGBYTE_GOOGLE_AUTH_URL", "https://accounts.google.com/o/oauth2/v2/auth");
    private static final String TOKEN_ANYU = SistemaANYU.envANYU("AGBYTE_GOOGLE_TOKEN_URL", "https://oauth2.googleapis.com/token");
    private static final String USERINFO_ANYU = SistemaANYU.envANYU("AGBYTE_GOOGLE_USERINFO_URL", "https://openidconnect.googleapis.com/v1/userinfo");
    private static final String ARCHIVO_ANYU = "google-oauth.json";
    private static final SecureRandom AZAR_ANYU = new SecureRandom();

    private static final class FlujoANYU {
        final String verificadorANYU;
        final String redireccionANYU;
        final long creadoANYU = System.currentTimeMillis();
        volatile String estadoANYU = "pending";
        volatile String mensajeANYU = "";
        volatile Map<String, Object> perfilANYU;

        FlujoANYU(String verificadorANYU, String redireccionANYU) {
            this.verificadorANYU = verificadorANYU;
            this.redireccionANYU = redireccionANYU;
        }
    }

    private static final Map<String, FlujoANYU> FLUJOS_ANYU = new ConcurrentHashMap<>();

    private GoogleLoginANYU() {
    }

    // ------------------------------------------------------------------ configuración

    @SuppressWarnings("unchecked")
    private static Map<String, String> leerConfigANYU(Map<String, Object> objANYU) {
        if (objANYU == null) return null;
        Object internoANYU = objANYU.containsKey("installed") ? objANYU.get("installed") : objANYU.containsKey("web") ? objANYU.get("web") : objANYU;
        if (!(internoANYU instanceof Map)) return null;
        Map<String, Object> mANYU = (Map<String, Object>) internoANYU;
        String idANYU = JsonANYU.textoANYU(mANYU, "client_id").trim();
        String secretoANYU = JsonANYU.textoANYU(mANYU, "client_secret").trim();
        if (!idANYU.endsWith(".apps.googleusercontent.com")) return null;
        Map<String, String> cfgANYU = new LinkedHashMap<>();
        cfgANYU.put("client_id", idANYU);
        cfgANYU.put("client_secret", secretoANYU);
        return cfgANYU;
    }

    private static List<Path> carpetasConfigANYU() {
        List<Path> lANYU = new ArrayList<>();
        lANYU.add(SistemaANYU.carpetaDatosANYU());
        try {
            Path jarANYU = Paths.get(GoogleLoginANYU.class.getProtectionDomain().getCodeSource().getLocation().toURI());
            lANYU.add(Files.isDirectory(jarANYU) ? jarANYU : jarANYU.getParent());
        } catch (Exception eANYU) {
            // sin carpeta del programa
        }
        return lANYU;
    }

    public static Map<String, String> configANYU() {
        for (Path dANYU : carpetasConfigANYU()) {
            if (dANYU == null || !Files.isDirectory(dANYU)) continue;
            List<Path> archivosANYU = new ArrayList<>();
            archivosANYU.add(dANYU.resolve(ARCHIVO_ANYU));
            try (DirectoryStream<Path> dsANYU = Files.newDirectoryStream(dANYU, "client_secret*.json")) {
                dsANYU.forEach(archivosANYU::add);
            } catch (IOException eANYU) {
                // carpeta sin permiso
            }
            for (Path fANYU : archivosANYU) {
                try {
                    if (!Files.isRegularFile(fANYU)) continue;
                    Map<String, String> cfgANYU = leerConfigANYU(JsonANYU.objetoANYU(Files.readString(fANYU, StandardCharsets.UTF_8)));
                    if (cfgANYU != null) return cfgANYU;
                } catch (Exception eANYU) {
                    // archivo inválido: se prueba el siguiente
                }
            }
        }
        return null;
    }

    public static Map<String, String> guardarConfigANYU(Map<String, Object> cuerpoANYU) throws IOException {
        Map<String, String> cfgANYU = null;
        String jsonANYU = JsonANYU.textoANYU(cuerpoANYU, "json");
        if (!jsonANYU.isBlank()) {
            try {
                cfgANYU = leerConfigANYU(JsonANYU.objetoANYU(jsonANYU));
            } catch (Exception eANYU) {
                cfgANYU = null;
            }
        }
        if (cfgANYU == null) cfgANYU = leerConfigANYU(cuerpoANYU);
        if (cfgANYU == null) return null;
        Files.writeString(SistemaANYU.carpetaDatosANYU().resolve(ARCHIVO_ANYU), JsonANYU.stringifyANYU(cfgANYU), StandardCharsets.UTF_8);
        return cfgANYU;
    }

    // ------------------------------------------------------------------ flujo

    private static String b64urlANYU(byte[] datosANYU) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(datosANYU);
    }

    private static String aleatorioANYU(int bytesANYU) {
        byte[] bANYU = new byte[bytesANYU];
        AZAR_ANYU.nextBytes(bANYU);
        return b64urlANYU(bANYU);
    }

    private static String formANYU(Map<String, String> mANYU) {
        StringBuilder bANYU = new StringBuilder();
        for (Map.Entry<String, String> eANYU : mANYU.entrySet()) {
            if (bANYU.length() > 0) bANYU.append('&');
            bANYU.append(URLEncoder.encode(eANYU.getKey(), StandardCharsets.UTF_8)).append('=').append(URLEncoder.encode(eANYU.getValue(), StandardCharsets.UTF_8));
        }
        return bANYU.toString();
    }

    public static Map<String, Object> iniciarANYU(int puertoANYU) throws Exception {
        Map<String, String> cfgANYU = configANYU();
        Map<String, Object> rANYU = new LinkedHashMap<>();
        if (cfgANYU == null) {
            rANYU.put("configured", false);
            return rANYU;
        }
        long ahoraANYU = System.currentTimeMillis();
        FLUJOS_ANYU.entrySet().removeIf(eANYU -> ahoraANYU - eANYU.getValue().creadoANYU > 15 * 60 * 1000);
        String estadoANYU = aleatorioANYU(24);
        String verificadorANYU = aleatorioANYU(48);
        String redireccionANYU = "http://127.0.0.1:" + puertoANYU + "/oauth/google";
        FLUJOS_ANYU.put(estadoANYU, new FlujoANYU(verificadorANYU, redireccionANYU));
        String retoANYU = b64urlANYU(MessageDigest.getInstance("SHA-256").digest(verificadorANYU.getBytes(StandardCharsets.US_ASCII)));
        Map<String, String> pANYU = new LinkedHashMap<>();
        pANYU.put("client_id", cfgANYU.get("client_id"));
        pANYU.put("redirect_uri", redireccionANYU);
        pANYU.put("response_type", "code");
        pANYU.put("scope", "openid email profile");
        pANYU.put("state", estadoANYU);
        pANYU.put("prompt", "select_account");
        pANYU.put("code_challenge", retoANYU);
        pANYU.put("code_challenge_method", "S256");
        String urlANYU = AUTH_ANYU + "?" + formANYU(pANYU);
        VentanaANYU.abrirEnNavegadorANYU(urlANYU);
        rANYU.put("configured", true);
        rANYU.put("state", estadoANYU);
        rANYU.put("url", urlANYU);
        return rANYU;
    }

    private static String fotoComoDatosANYU(String urlANYU) {
        if (urlANYU == null || urlANYU.isBlank()) return "";
        try {
            urlANYU = urlANYU.replaceAll("=s\\d+(-c)?$", "=s256-c");
            HttpRequest reqANYU = HttpRequest.newBuilder(URI.create(urlANYU)).timeout(Duration.ofSeconds(10)).GET().build();
            HttpResponse<byte[]> respANYU = EjecutorANYU.clienteANYU().send(reqANYU, HttpResponse.BodyHandlers.ofByteArray());
            String tipoANYU = respANYU.headers().firstValue("Content-Type").orElse("image/jpeg").split(";")[0].trim();
            byte[] datosANYU = respANYU.body();
            if (respANYU.statusCode() != 200 || datosANYU.length > 400 * 1024 || !tipoANYU.startsWith("image/")) return "";
            return "data:" + tipoANYU + ";base64," + Base64.getEncoder().encodeToString(datosANYU);
        } catch (Exception eANYU) {
            return "";
        }
    }

    /** Google vuelve aquí con ?state=…&code=… (o &error=…). Devuelve {ok, texto para la página}. */
    @SuppressWarnings("unchecked")
    public static Object[] terminarANYU(Map<String, String> consultaANYU) {
        FlujoANYU fANYU = FLUJOS_ANYU.get(consultaANYU.getOrDefault("state", ""));
        if (fANYU == null || !"pending".equals(fANYU.estadoANYU)) {
            return new Object[]{false, "Este enlace ya se usó o caducó. Vuelve a AGbyte y pulsa otra vez «Continuar con Google»."};
        }
        if (consultaANYU.containsKey("error")) {
            fANYU.mensajeANYU = "Cancelaste el inicio de sesión con Google.";
            fANYU.estadoANYU = "error";
            return new Object[]{false, "Cancelaste el inicio de sesión. Puedes cerrar esta pestaña y volver a AGbyte."};
        }
        try {
            Map<String, String> cfgANYU = configANYU();
            if (cfgANYU == null) throw new IllegalStateException("sin configuración");
            Map<String, String> datosANYU = new LinkedHashMap<>();
            datosANYU.put("code", consultaANYU.getOrDefault("code", ""));
            datosANYU.put("client_id", cfgANYU.get("client_id"));
            datosANYU.put("redirect_uri", fANYU.redireccionANYU);
            datosANYU.put("grant_type", "authorization_code");
            datosANYU.put("code_verifier", fANYU.verificadorANYU);
            if (!cfgANYU.get("client_secret").isEmpty()) datosANYU.put("client_secret", cfgANYU.get("client_secret"));
            HttpRequest reqANYU = HttpRequest.newBuilder(URI.create(TOKEN_ANYU)).timeout(Duration.ofSeconds(20))
                    .header("Content-Type", "application/x-www-form-urlencoded").POST(HttpRequest.BodyPublishers.ofString(formANYU(datosANYU))).build();
            HttpResponse<String> respANYU = EjecutorANYU.clienteANYU().send(reqANYU, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            Map<String, Object> tokenANYU = JsonANYU.objetoANYU(respANYU.body());
            if (respANYU.statusCode() != 200) {
                String detalleANYU = JsonANYU.textoANYU(tokenANYU, "error_description");
                fANYU.mensajeANYU = "Google rechazó la conexión. " + detalleANYU;
                fANYU.estadoANYU = "error";
                return new Object[]{false, "Google rechazó la conexión. Revisa el ID de cliente en AGbyte. " + detalleANYU};
            }
            HttpRequest req2ANYU = HttpRequest.newBuilder(URI.create(USERINFO_ANYU)).timeout(Duration.ofSeconds(20))
                    .header("Authorization", "Bearer " + JsonANYU.textoANYU(tokenANYU, "access_token")).GET().build();
            Map<String, Object> infoANYU = JsonANYU.objetoANYU(EjecutorANYU.clienteANYU().send(req2ANYU, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)).body());
            String correoANYU = JsonANYU.textoANYU(infoANYU, "email").toLowerCase();
            if (correoANYU.isEmpty()) throw new IllegalStateException("Google no devolvió un correo");
            String nombreANYU = JsonANYU.textoANYU(infoANYU, "name");
            if (nombreANYU.isEmpty()) nombreANYU = JsonANYU.textoANYU(infoANYU, "given_name");
            if (nombreANYU.isEmpty()) nombreANYU = correoANYU.split("@")[0];
            Map<String, Object> perfilANYU = new LinkedHashMap<>();
            perfilANYU.put("email", correoANYU);
            perfilANYU.put("name", nombreANYU);
            perfilANYU.put("given_name", JsonANYU.textoANYU(infoANYU, "given_name"));
            perfilANYU.put("sub", JsonANYU.textoANYU(infoANYU, "sub"));
            perfilANYU.put("picture", fotoComoDatosANYU(JsonANYU.textoANYU(infoANYU, "picture")));
            fANYU.perfilANYU = perfilANYU;
            fANYU.estadoANYU = "ok";
            return new Object[]{true, nombreANYU};
        } catch (Exception eANYU) {
            SistemaANYU.logANYU("Google", eANYU);
            fANYU.mensajeANYU = "No pude conectar con Google. Revisa tu internet e inténtalo otra vez.";
            fANYU.estadoANYU = "error";
            return new Object[]{false, fANYU.mensajeANYU};
        }
    }

    public static Map<String, Object> resultadoANYU(String estadoANYU) {
        Map<String, Object> rANYU = new LinkedHashMap<>();
        FlujoANYU fANYU = FLUJOS_ANYU.get(estadoANYU);
        if (fANYU == null) {
            rANYU.put("status", "error");
            rANYU.put("message", "La conexión caducó. Inténtalo otra vez.");
            return rANYU;
        }
        if ("pending".equals(fANYU.estadoANYU)) {
            rANYU.put("status", "pending");
            return rANYU;
        }
        FLUJOS_ANYU.remove(estadoANYU); // el perfil se entrega una sola vez
        if ("ok".equals(fANYU.estadoANYU)) {
            rANYU.put("status", "ok");
            rANYU.put("profile", fANYU.perfilANYU);
        } else {
            rANYU.put("status", "error");
            rANYU.put("message", fANYU.mensajeANYU.isEmpty() ? "No se pudo conectar." : fANYU.mensajeANYU);
        }
        return rANYU;
    }

    // ------------------------------------------------------------------ página de regreso

    public static String paginaANYU(boolean okANYU, String textoANYU) {
        String colorANYU = okANYU ? "#7A1A35" : "#D92D20";
        String iconoANYU = okANYU ? "&#10003;" : "!";
        String tituloANYU = okANYU ? "¡Listo, " + htmlANYU(textoANYU.split("\\s+")[0]) + "!" : "No se pudo conectar";
        String cuerpoANYU = okANYU ? "Tu cuenta de Google ya está conectada. Puedes cerrar esta pestaña y volver a AGbyte." : htmlANYU(textoANYU);
        return "<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><title>AGbyte</title><style>"
                + "body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8F5F6;"
                + "font-family:system-ui,'Segoe UI',sans-serif;color:#1F1418}.c{max-width:440px;margin:24px;padding:32px;border-radius:24px;"
                + "background:#fff;border:1px solid #EDE6E9;text-align:center;box-shadow:0 10px 30px rgba(31,20,24,.08)}"
                + ".i{width:64px;height:64px;margin:0 auto 16px;border-radius:18px;display:flex;align-items:center;justify-content:center;"
                + "font-size:32px;color:#fff;background:" + colorANYU + "}h1{margin:0 0 8px;font-size:24px}p{margin:0;font-size:16px;line-height:1.5;color:#56484E}"
                + "</style></head><body><div class=\"c\"><div class=\"i\">" + iconoANYU + "</div><h1>" + tituloANYU + "</h1><p>" + cuerpoANYU + "</p></div></body></html>";
    }

    static String htmlANYU(String tANYU) {
        return tANYU.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
