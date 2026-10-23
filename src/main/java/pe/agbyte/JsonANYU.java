package pe.agbyte;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * JSON mínimo, sin librerías: convierte texto JSON en Map/List/String/Number/Boolean/null y al revés.
 */
public final class JsonANYU {

    private final String sANYU;
    private int iANYU;

    private JsonANYU(String sANYU) {
        this.sANYU = sANYU;
    }

    // ------------------------------------------------------------------ leer

    public static Object parseANYU(String textoANYU) {
        JsonANYU pANYU = new JsonANYU(textoANYU == null ? "" : textoANYU);
        pANYU.espaciosANYU();
        Object vANYU = pANYU.valorANYU();
        pANYU.espaciosANYU();
        if (pANYU.iANYU != pANYU.sANYU.length()) throw new IllegalArgumentException("JSON con texto de más en la posición " + pANYU.iANYU);
        return vANYU;
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> objetoANYU(String textoANYU) {
        Object vANYU = parseANYU(textoANYU);
        if (!(vANYU instanceof Map)) throw new IllegalArgumentException("Se esperaba un objeto JSON");
        return (Map<String, Object>) vANYU;
    }

    private void espaciosANYU() {
        while (iANYU < sANYU.length() && Character.isWhitespace(sANYU.charAt(iANYU))) iANYU++;
    }

    private char verANYU() {
        if (iANYU >= sANYU.length()) throw new IllegalArgumentException("JSON incompleto");
        return sANYU.charAt(iANYU);
    }

    private Object valorANYU() {
        char cANYU = verANYU();
        switch (cANYU) {
            case '{': return leerObjetoANYU();
            case '[': return leerListaANYU();
            case '"': return leerTextoANYU();
            case 't': esperarANYU("true"); return Boolean.TRUE;
            case 'f': esperarANYU("false"); return Boolean.FALSE;
            case 'n': esperarANYU("null"); return null;
            default: return leerNumeroANYU();
        }
    }

    private void esperarANYU(String palabraANYU) {
        if (!sANYU.startsWith(palabraANYU, iANYU)) throw new IllegalArgumentException("JSON inválido en la posición " + iANYU);
        iANYU += palabraANYU.length();
    }

    private Map<String, Object> leerObjetoANYU() {
        Map<String, Object> mANYU = new LinkedHashMap<>();
        iANYU++;
        espaciosANYU();
        if (verANYU() == '}') { iANYU++; return mANYU; }
        while (true) {
            espaciosANYU();
            if (verANYU() != '"') throw new IllegalArgumentException("Se esperaba una clave en la posición " + iANYU);
            String kANYU = leerTextoANYU();
            espaciosANYU();
            if (verANYU() != ':') throw new IllegalArgumentException("Se esperaba ':' en la posición " + iANYU);
            iANYU++;
            espaciosANYU();
            mANYU.put(kANYU, valorANYU());
            espaciosANYU();
            char cANYU = verANYU();
            iANYU++;
            if (cANYU == '}') return mANYU;
            if (cANYU != ',') throw new IllegalArgumentException("Se esperaba ',' en la posición " + (iANYU - 1));
        }
    }

    private List<Object> leerListaANYU() {
        List<Object> lANYU = new ArrayList<>();
        iANYU++;
        espaciosANYU();
        if (verANYU() == ']') { iANYU++; return lANYU; }
        while (true) {
            espaciosANYU();
            lANYU.add(valorANYU());
            espaciosANYU();
            char cANYU = verANYU();
            iANYU++;
            if (cANYU == ']') return lANYU;
            if (cANYU != ',') throw new IllegalArgumentException("Se esperaba ',' en la posición " + (iANYU - 1));
        }
    }

    private String leerTextoANYU() {
        StringBuilder bANYU = new StringBuilder();
        iANYU++; // comilla de apertura
        while (true) {
            char cANYU = verANYU();
            iANYU++;
            if (cANYU == '"') return bANYU.toString();
            if (cANYU != '\\') { bANYU.append(cANYU); continue; }
            char eANYU = verANYU();
            iANYU++;
            switch (eANYU) {
                case '"': bANYU.append('"'); break;
                case '\\': bANYU.append('\\'); break;
                case '/': bANYU.append('/'); break;
                case 'b': bANYU.append('\b'); break;
                case 'f': bANYU.append('\f'); break;
                case 'n': bANYU.append('\n'); break;
                case 'r': bANYU.append('\r'); break;
                case 't': bANYU.append('\t'); break;
                case 'u':
                    if (iANYU + 4 > sANYU.length()) throw new IllegalArgumentException("Escape \\u incompleto");
                    bANYU.append((char) Integer.parseInt(sANYU.substring(iANYU, iANYU + 4), 16));
                    iANYU += 4;
                    break;
                default: throw new IllegalArgumentException("Escape inválido \\" + eANYU);
            }
        }
    }

    private Number leerNumeroANYU() {
        int iniANYU = iANYU;
        while (iANYU < sANYU.length() && "+-0123456789.eE".indexOf(sANYU.charAt(iANYU)) >= 0) iANYU++;
        String nANYU = sANYU.substring(iniANYU, iANYU);
        if (nANYU.isEmpty()) throw new IllegalArgumentException("JSON inválido en la posición " + iniANYU);
        if (nANYU.contains(".") || nANYU.contains("e") || nANYU.contains("E")) return Double.parseDouble(nANYU);
        long vANYU = Long.parseLong(nANYU);
        if (vANYU >= Integer.MIN_VALUE && vANYU <= Integer.MAX_VALUE) return (int) vANYU;
        return vANYU;
    }

    // ------------------------------------------------------------------ escribir

    public static String stringifyANYU(Object vANYU) {
        StringBuilder bANYU = new StringBuilder();
        escribirANYU(bANYU, vANYU);
        return bANYU.toString();
    }

    private static void escribirANYU(StringBuilder bANYU, Object vANYU) {
        if (vANYU == null) {
            bANYU.append("null");
        } else if (vANYU instanceof String) {
            textoANYU(bANYU, (String) vANYU);
        } else if (vANYU instanceof Boolean || vANYU instanceof Integer || vANYU instanceof Long) {
            bANYU.append(vANYU);
        } else if (vANYU instanceof Number) {
            double dANYU = ((Number) vANYU).doubleValue();
            if (dANYU == Math.rint(dANYU) && Math.abs(dANYU) < 1e15) bANYU.append((long) dANYU);
            else bANYU.append(dANYU);
        } else if (vANYU instanceof Map) {
            bANYU.append('{');
            boolean primeroANYU = true;
            for (Map.Entry<?, ?> eANYU : ((Map<?, ?>) vANYU).entrySet()) {
                if (!primeroANYU) bANYU.append(", ");
                primeroANYU = false;
                textoANYU(bANYU, String.valueOf(eANYU.getKey()));
                bANYU.append(": ");
                escribirANYU(bANYU, eANYU.getValue());
            }
            bANYU.append('}');
        } else if (vANYU instanceof Iterable) {
            bANYU.append('[');
            boolean primeroANYU = true;
            for (Object oANYU : (Iterable<?>) vANYU) {
                if (!primeroANYU) bANYU.append(", ");
                primeroANYU = false;
                escribirANYU(bANYU, oANYU);
            }
            bANYU.append(']');
        } else {
            textoANYU(bANYU, vANYU.toString());
        }
    }

    private static void textoANYU(StringBuilder bANYU, String tANYU) {
        bANYU.append('"');
        for (int kANYU = 0; kANYU < tANYU.length(); kANYU++) {
            char cANYU = tANYU.charAt(kANYU);
            switch (cANYU) {
                case '"': bANYU.append("\\\""); break;
                case '\\': bANYU.append("\\\\"); break;
                case '\n': bANYU.append("\\n"); break;
                case '\r': bANYU.append("\\r"); break;
                case '\t': bANYU.append("\\t"); break;
                case '\b': bANYU.append("\\b"); break;
                case '\f': bANYU.append("\\f"); break;
                default:
                    if (cANYU < 0x20 || cANYU == ' ' || cANYU == ' ') bANYU.append(String.format("\\u%04x", (int) cANYU));
                    else bANYU.append(cANYU);
            }
        }
        bANYU.append('"');
    }

    // ------------------------------------------------------------------ ayudas

    public static String textoANYU(Map<String, Object> mANYU, String claveANYU) {
        Object vANYU = mANYU.get(claveANYU);
        return vANYU == null ? "" : String.valueOf(vANYU);
    }
}
