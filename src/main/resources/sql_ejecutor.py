"""Ejecuta las consultas SQL de AGbyte con SQLite (incluido en Python) y devuelve el resultado en JSON.
Uso: python sql_ejecutor.py consulta.sql
"""
import json
import sqlite3
import sys
import time

SAMPLE_DB = """
CREATE TABLE frutas (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL, stock INTEGER);
INSERT INTO frutas (nombre, precio, stock) VALUES
  ('mango', 3.50, 24), ('fresa', 6.00, 10), ('maracuyá', 4.20, 15), ('plátano', 2.00, 40), ('uva', 8.50, 5);
CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, ciudad TEXT);
INSERT INTO clientes (nombre, ciudad) VALUES
  ('Ana', 'Lima'), ('Luis', 'Arequipa'), ('Sofía', 'Cusco'), ('Diego', 'Lima');
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER, fruta_id INTEGER, cantidad INTEGER, fecha TEXT);
INSERT INTO pedidos (cliente_id, fruta_id, cantidad, fecha) VALUES
  (1, 1, 3, '2026-10-01'), (1, 2, 1, '2026-10-03'), (2, 4, 6, '2026-10-05'), (3, 3, 2, '2026-10-07'), (4, 1, 5, '2026-10-09');
"""


def tabla(cols, rows):
    fmt = lambda v: "NULL" if v is None else (f"{v:.2f}" if isinstance(v, float) else str(v))
    data = [[fmt(v) for v in r] for r in rows]
    widths = [max([len(c)] + [len(r[i]) for r in data]) for i, c in enumerate(cols)]
    line = lambda vals: " | ".join(v.ljust(widths[i]) for i, v in enumerate(vals)).rstrip()
    out = [line(cols), "-+-".join("-" * w for w in widths)]
    out += [line(r) for r in data]
    out.append(f"({len(rows)} {'fila' if len(rows) == 1 else 'filas'})")
    return "\n".join(out)


def main():
    with open(sys.argv[1], encoding="utf-8") as f:
        code = f.read()
    started = time.time()
    con = sqlite3.connect(":memory:")
    con.executescript(SAMPLE_DB)
    outputs, err, stmt = [], "", ""
    try:
        for line in code.splitlines(True):
            stmt += line
            if sqlite3.complete_statement(stmt):
                s = stmt.strip()
                stmt = ""
                if not s.strip(";").strip():
                    continue
                cur = con.execute(s)
                if cur.description:
                    outputs.append(tabla([d[0] for d in cur.description], cur.fetchmany(200)))
                else:
                    outputs.append(f"Listo: {cur.rowcount if cur.rowcount >= 0 else 0} filas afectadas.")
        if stmt.strip():
            err = "Falta el ; al final de la consulta."
    except sqlite3.Error as e:
        err = f"Error: {e}"
    finally:
        con.close()
    res = {"code": 1 if err else 0, "stdout": "\n\n".join(outputs), "stderr": err,
           "ms": int((time.time() - started) * 1000), "timeout": False, "runner": f"SQLite {sqlite3.sqlite_version}"}
    sys.stdout.write(json.dumps(res, ensure_ascii=True))


if __name__ == "__main__":
    main()
