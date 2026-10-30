/* AGbyte — datos guardados en este equipo (localStorage), cursos y contenido de lecciones.
   Todas las pantallas leen y escriben aquí a través de window.CodyuStore. */
(function () {
  'use strict';
  var KEY = 'codyu:v1';
  var DAY = 86400000;

  /* ---------- Fechas ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today() { return iso(new Date()); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / DAY); }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var DIAS_C = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  function fmtLong(s) { var d = parse(s); return DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear(); }
  function fmtShort(s) { var d = parse(s); return d.getDate() + ' ' + MES_C[d.getMonth()]; }
  function fmtMonthYear(s) { var d = parse(s); return MESES[d.getMonth()] + ' de ' + d.getFullYear(); }
  function fmtRel(s) {
    var n = diffDays(s, today());
    if (n <= 0) return 'Hoy';
    if (n === 1) return 'Ayer';
    var d = parse(s);
    if (n < 7) return DIAS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MES_C[d.getMonth()];
    return fmtShort(s);
  }

  /* ---------- Cursos y contenido de lecciones ---------- */
  /* Todo el contenido de las lecciones (cursos, módulos, teoría, ejemplos, pruébalo y quiz) vive en
     archivos JSON dentro de la carpeta "lecciones/" (junto a este archivo), no en este script.
     Para AGREGAR, EDITAR o ELIMINAR una lección no toques este código: edita esos archivos JSON.
     La guía completa, con el formato de cada campo, está en lecciones/README.txt */
  function leerJSONLocal(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // síncrono a propósito: son archivos locales, pequeños, y deben estar listos
    xhr.send(null);               // antes de que el resto de la app use COURSES/CONTENT.
    if (xhr.status !== 200 && xhr.status !== 0) throw new Error('No se pudo leer ' + url + ' (' + xhr.status + ')');
    return JSON.parse(xhr.responseText);
  }
  var COURSES = {};
  var CONTENT = {};
  var COURSE_ORDER = [];
  try {
    COURSE_ORDER = leerJSONLocal('./lecciones/_catalogo.json');
    COURSE_ORDER.forEach(function (id) {
      var curso = leerJSONLocal('./lecciones/' + id + '.json');
      COURSES[id] = {
        id: curso.id, name: curso.name, title: curso.title, glyph: curso.glyph, tileBg: curso.tileBg,
        tileFg: curso.tileFg, ext: curso.ext, blurb: curso.blurb,
        modules: curso.modules.map(function (m) { return { title: m.title, desc: m.desc, lessons: m.lessons.slice() }; })
      };
      Object.keys(curso.lessons || {}).forEach(function (titulo) { CONTENT[id + ':' + titulo] = curso.lessons[titulo]; });
    });
  } catch (e) {
    console.error('AGbyte: no pude cargar las lecciones desde la carpeta lecciones/', e);
  }
  var LANG = { python: 'python', javascript: 'js', html: 'html', css: 'css', sql: 'sql', java: 'java', cpp: 'cpp' };

  /* ---------- Editor y ejercicios por lenguaje ---------- */
  var EDITOR = {
    python: {
      runtime: 'Python 3.12',
      main: { name: 'main.py', lines: ['# Bienvenido al editor de Cody', '# Escribe tu código Python aquí', '', 'nombre = "Alex"', 'edad = 17', '', 'print(f"Hola, {nombre}!")', 'print(f"Tienes {edad} años.")', '', 'año_actual = 2026', 'print(f"Naciste en {año_actual - edad}")'], output: ['Hola, Alex!', 'Tienes 17 años.', 'Naciste en 2009'] },
      err: { name: 'errores.py', lines: ['# Encuentra el error y ejecuta', 'precio = 12', 'cantidad = 3', 'total = precio * cantidad', 'print("Total: " + total)'], line: 5, fixed: 'print(f"Total: {total}")',
             error: ['Traceback (most recent call last):', '  File "errores.py", line 5, in <module>', 'TypeError: can only concatenate str (not "int") to str'], fixedOut: ['Total: 36'],
             hint: 'Estás uniendo texto con un número. Python no sabe sumar "Total: " + 36. Usa un f-string:' }
    },
    javascript: {
      runtime: 'Node.js 20',
      main: { name: 'main.js', lines: ['// Bienvenido al editor de Cody', 'const nombre = "Alex";', 'let edad = 17;', '', 'console.log("Hola, " + nombre + "!");', 'console.log("Tienes " + edad + " años.");', '', 'const anioActual = 2026;', 'console.log("Naciste en " + (anioActual - edad));'], output: ['Hola, Alex!', 'Tienes 17 años.', 'Naciste en 2009'] },
      err: { name: 'errores.js', lines: ['// Encuentra el error y ejecuta', 'const precio = 12;', 'const cantidad = 3;', 'const total = precio * cantidad;', 'consol.log("Total: " + total);'], line: 5, fixed: 'console.log("Total: " + total);',
             error: ['errores.js:5', 'ReferenceError: consol is not defined'], fixedOut: ['Total: 36'],
             hint: 'Hay un error de tipeo: escribiste consol en lugar de console. Corrígelo así:' }
    },
    html: {
      runtime: 'HTML5',
      main: { name: 'index.html', lines: ['<!-- Tu página -->', '<h1>Hola, soy Alex</h1>', '<p>Estoy aprendiendo HTML.</p>', '<ul>', '  <li>Me gusta el fútbol</li>', '  <li>Me gusta la música</li>', '</ul>'], output: ['[Título] Hola, soy Alex', '[Párrafo] Estoy aprendiendo HTML.', '• Me gusta el fútbol', '• Me gusta la música'] },
      err: { name: 'errores.html', lines: ['<!-- Encuentra el error -->', '<h1>Mi tienda</h1>', '<p>Precio: 12 soles</p>', '<p>Cantidad: 3', '<p>Total: 36 soles</p>'], line: 4, fixed: '<p>Cantidad: 3</p>',
             error: ['Aviso en la línea 4:', 'La etiqueta <p> no está cerrada.'], fixedOut: ['[Título] Mi tienda', '[Párrafo] Precio: 12 soles', '[Párrafo] Cantidad: 3', '[Párrafo] Total: 36 soles'],
             hint: 'El párrafo de la línea 4 se abrió pero nunca se cerró. Ciérralo con </p>:' }
    },
    css: {
      runtime: 'CSS3',
      main: { name: 'estilos.css', lines: ['/* Estilos de tu página */', 'h1 {', '  color: green;', '  font-size: 32px;', '}', 'p {', '  color: gray;', '  line-height: 1.5;', '}'], output: ['[Título] verde, 32 px', '[Párrafo] gris, interlineado 1.5'] },
      err: { name: 'errores.css', lines: ['/* Encuentra el error */', 'h1 {', '  color: green', '  font-size: 32px;', '}'], line: 3, fixed: '  color: green;',
             error: ['Aviso en la línea 3:', 'Falta ; después de «color: green».', 'El navegador ignora color y font-size.'], fixedOut: ['[Título] verde, 32 px'],
             hint: 'A la línea 3 le falta el punto y coma. Sin él, el navegador descarta también la línea siguiente. Corrígelo así:' }
    },
    sql: {
      runtime: 'SQLite 3',
      main: { name: 'consulta.sql', lines: ['-- Frutas que cuestan menos de 5', 'SELECT nombre, precio', 'FROM frutas', 'WHERE precio < 5', 'ORDER BY precio;'], output: ['nombre    | precio', 'mango     | 3.50', 'maracuyá  | 4.20', '(2 filas)'] },
      err: { name: 'errores.sql', lines: ['-- Encuentra el error y ejecuta', 'SELEC nombre, stock', 'FROM frutas', 'WHERE stock > 10;'], line: 2, fixed: 'SELECT nombre, stock',
             error: ['Error en la línea 2:', 'near "SELEC": syntax error'], fixedOut: ['nombre    | stock', 'mango     | 24', 'maracuyá  | 15', '(2 filas)'],
             hint: 'A SELECT le falta la T. Corrígelo así:' }
    },
    java: {
      runtime: 'Java 21',
      main: { name: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    String nombre = "Alex";', '    int edad = 17;', '    System.out.println("Hola, " + nombre + "!");', '    System.out.println("Naciste en " + (2026 - edad));', '  }', '}'], output: ['Hola, Alex!', 'Naciste en 2009'] },
      err: { name: 'Errores.java', lines: ['public class Errores {', '  public static void main(String[] args) {', '    int total = 12 * 3;', '    System.out.println("Total: " + total)', '  }', '}'], line: 4, fixed: '    System.out.println("Total: " + total);',
             error: ['Errores.java:4: error: \';\' expected', '1 error'], fixedOut: ['Total: 36'],
             hint: 'A la línea 4 le falta el punto y coma final. Corrígelo así:' }
    },
    cpp: {
      runtime: 'C++17',
      main: { name: 'main.cpp', lines: ['#include <iostream>', '#include <string>', '', 'int main() {', '  std::string nombre = "Alex";', '  int edad = 17;', '  std::cout << "Hola, " << nombre << "!" << std::endl;', '  std::cout << "Naciste en " << 2026 - edad << std::endl;', '  return 0;', '}'], output: ['Hola, Alex!', 'Naciste en 2009'] },
      err: { name: 'errores.cpp', lines: ['#include <iostream>', '', 'int main() {', '  int total = 12 * 3;', '  cout << "Total: " << total;', '  return 0;', '}'], line: 5, fixed: '  std::cout << "Total: " << total;',
             error: ['errores.cpp:5:3: error: \'cout\' was not declared in this scope', 'note: did you mean \'std::cout\'?'], fixedOut: ['Total: 36'],
             hint: 'cout vive dentro de std. Escribe std::cout:' }
    }
  };
  var EXERCISE = {
    python: { goal: 'Ordena las piezas para mostrar Hola mundo en la pantalla.', file: 'main.py', tokens: ['print', '(', '"Hola mundo"', ')', 'var', 'echo', ';'], answer: [0, 1, 2, 3], hint: ['# Estructura', 'función(argumento)'], hintNote: 'En Python no hace falta ; al final ni palabras como var o echo.', ok: 'print() muestra en pantalla lo que pongas entre paréntesis.', output: 'Hola mundo' },
    javascript: { goal: 'Ordena las piezas para mostrar Hola mundo en la consola.', file: 'main.js', tokens: ['console.log', '(', '"Hola mundo"', ')', ';', 'print', 'echo'], answer: [0, 1, 2, 3, 4], hint: ['// Estructura', 'console.log(texto);'], hintNote: 'En JavaScript se usa console.log y la línea termina con ;.', ok: 'console.log() escribe en la consola lo que pongas entre paréntesis.', output: 'Hola mundo' },
    html: { goal: 'Ordena las piezas para crear un título que diga Hola mundo.', file: 'index.html', tokens: ['<h1>', 'Hola mundo', '</h1>', '<p>', '</p>', 'print'], answer: [0, 1, 2], hint: ['<!-- Estructura -->', '<etiqueta>texto</etiqueta>'], hintNote: 'Un título se abre con <h1> y se cierra con </h1>.', ok: '<h1> crea el título principal de tu página.', output: '[Título] Hola mundo' },
    css: { goal: 'Ordena las piezas para que el título sea verde.', file: 'estilos.css', tokens: ['h1', '{', 'color: green;', '}', 'print', '='], answer: [0, 1, 2, 3], hint: ['/* Estructura */', 'selector { propiedad: valor; }'], hintNote: 'Las propiedades van entre llaves, después del selector.', ok: 'h1 { color: green; } pinta de verde todos los títulos h1.', output: '[Título] en verde' },
    sql: { goal: 'Ordena las piezas para traer todas las columnas de la tabla frutas.', file: 'consulta.sql', tokens: ['SELECT', '*', 'FROM', 'frutas', ';', 'WHERE', 'print'], answer: [0, 1, 2, 3, 4], hint: ['-- Estructura', 'SELECT columnas FROM tabla;'], hintNote: 'El asterisco * significa «todas las columnas».', ok: 'SELECT * FROM frutas; trae todas las columnas de la tabla.', output: 'mango · fresa · maracuyá' },
    java: { goal: 'Ordena las piezas para mostrar Hola mundo en Java.', file: 'Main.java', tokens: ['System.out.println', '(', '"Hola mundo"', ')', ';', 'print', 'echo'], answer: [0, 1, 2, 3, 4], hint: ['// Estructura', 'System.out.println(texto);'], hintNote: 'En Java cada instrucción termina con ;.', ok: 'System.out.println() muestra una línea de texto.', output: 'Hola mundo' },
    cpp: { goal: 'Ordena las piezas para mostrar Hola mundo en C++.', file: 'main.cpp', tokens: ['std::cout', '<<', '"Hola mundo"', ';', 'print', '>>'], answer: [0, 1, 2, 3], hint: ['// Estructura', 'std::cout << texto;'], hintNote: 'Con cout se usa <<, no >>.', ok: 'std::cout << envía el texto a la pantalla.', output: 'Hola mundo' }
  };

  /* ---------- Resaltado de código ---------- */
  var KW = {
    python: 'def|return|if|else|elif|for|in|while|import|from|True|False|None|and|or|not',
    js: 'const|let|var|function|return|if|else|for|of|while|true|false|null|new',
    java: 'public|class|static|void|int|double|boolean|String|return|if|else|for|while|new|true|false',
    cpp: 'int|double|char|return|if|else|for|while|const|std|include|true|false',
    sql: 'SELECT|FROM|WHERE|ORDER|BY|AND|OR|LIKE|LIMIT|INSERT|UPDATE|DELETE|AS|DISTINCT|GROUP|HAVING|JOIN|ON',
    html: '',
    css: 'color|background|font-size|line-height|margin|padding|border|display|width|height|position'
  };
  var FN = { python: 'print|str|int|len|range|input', js: 'console|log', java: 'System|out|println|print', cpp: 'cout|endl|string', sql: 'COUNT|SUM|AVG|MIN|MAX', html: '', css: '' };
  var CM = { python: '#.*$', js: '\\/\\/.*$', java: '\\/\\/.*$', cpp: '\\/\\/.*$', sql: '--.*$', html: '<!--.*?-->', css: '\\/\\*.*?\\*\\/' };
  var C = { text: '#F3EAEE', comment: '#9C8A94', string: '#F6C177', number: '#EB6F92', func: '#9CCFD8', keyword: '#C4A7E7', op: '#D8CBD1', tag: '#C4A7E7' };
  function tokenize(line, lang) {
    lang = lang || 'python';
    var out = [];
    var tagPart = lang === 'html' ? '(<\\/?[a-zA-Z0-9]+>?|\\/?>)|' : '()';
    var pre = lang === 'cpp' ? '(#include)|' : '()';
    var re = new RegExp('(' + CM[lang] + ')|' + pre + tagPart + '(f?"[^"]*"|\'[^\']*\')|(\\d+(?:\\.\\d+)?)|' +
      (FN[lang] ? '(\\b(?:' + FN[lang] + ')\\b)' : '([^\\s\\S])') + '|' + (KW[lang] ? '(\\b(?:' + KW[lang] + ')(?![\\w-]))' : '([^\\s\\S])') +
      '|([A-Za-z\\u00C0-\\u00FF_][A-Za-z0-9\\u00C0-\\u00FF_]*)|(\\s+)|(.)', 'gu');
    var m;
    while ((m = re.exec(line)) !== null) {
      var c = C.text;
      if (m[1]) c = C.comment; else if (m[2]) c = C.keyword; else if (m[3]) c = C.tag; else if (m[4]) c = C.string;
      else if (m[5]) c = C.number; else if (m[6]) c = C.func; else if (m[7]) c = C.keyword; else if (m[10]) c = C.op;
      out.push({ t: m[0], c: c });
      if (m[0].length === 0) re.lastIndex++;
    }
    return out;
  }

  /* ---------- Insignias y niveles ---------- */
  var LEVELS = [0, 50, 120, 200, 500, 800, 1200, 1700, 2300, 3000];
  var LEVEL_NAMES = ['Novato', 'Curioso', 'Explorador', 'Aprendiz', 'Programador', 'Constructor', 'Experto', 'Maestro', 'Leyenda', 'Leyenda+'];
  var BADGES = [
    { id: 'primer', title: 'Primer vuelo', desc: 'Completa tu primera lección', xp: 20, icon: 'play', tone: 'g', test: function (a, s) { return [Math.min(s.lessonsTotal, 1), 1]; } },
    { id: 'hola', title: 'Hola mundo', desc: 'Ejecuta tu primer programa en el editor', xp: 20, icon: 'term', tone: 'b', test: function (a) { return [Math.min(a.counters.editorRuns, 1), 1]; } },
    { id: 'velocista', title: 'Velocista', desc: 'Termina una lección en menos de 2 min', xp: 30, icon: 'zap', tone: 'p', test: function (a) { return [Math.min(a.counters.fast, 1), 1]; } },
    { id: 'racha', title: 'En racha', desc: '5 días seguidos aprendiendo', xp: 50, icon: 'flame', tone: 'o', test: function (a, s) { return [Math.min(s.streakBest, 5), 5]; } },
    { id: 'modulos', title: 'Constructor', desc: 'Completa 2 módulos de un curso', xp: 100, icon: 'code', tone: 'g', test: function (a, s) { return [Math.min(s.modulesBest, 2), 2]; } },
    { id: 'estrella', title: 'Estrella', desc: 'Alcanza el nivel 5', xp: 200, icon: 'star', tone: 'a', test: function (a) { return [Math.min(a.xp, 500), 500]; } },
    { id: 'robot', title: 'Robot pro', desc: 'Usa el editor 10 veces', xp: 75, icon: 'bot', tone: 'b', test: function (a) { return [Math.min(a.counters.editorRuns, 10), 10]; } },
    { id: 'perfecto', title: 'Perfecto', desc: 'Termina 3 lecciones sin errores', xp: 120, icon: 'check', tone: 'p', test: function (a) { return [Math.min(a.counters.perfect, 3), 3]; } }
  ];

  /* ---------- Liga ---------- */
  var RIVALS = [
    { name: 'Lucía Fernández', i: 'L', tone: 'pk', streak: 21, xp: 315 },
    { name: 'Mateo Rojas', i: 'M', tone: 'b', streak: 12, xp: 290 },
    { name: 'Valentina Cruz', i: 'V', tone: 'a', streak: 9, xp: 180 },
    { name: 'Diego Herrera', i: 'D', tone: 'p', streak: 4, xp: 135, friend: true },
    { name: 'Camila Ortiz', i: 'C', tone: 't', streak: 7, xp: 120, friend: true },
    { name: 'Sofía Paredes', i: 'S', tone: 'r', streak: 3, xp: 95 },
    { name: 'Joaquín Vega', i: 'J', tone: 'b', streak: 2, xp: 80, friend: true },
    { name: 'Martina López', i: 'M', tone: 'g', streak: 6, xp: 60 },
    { name: 'Tomás Ruiz', i: 'T', tone: 'o', streak: 1, xp: 40 },
    { name: 'Renata Silva', i: 'R', tone: 'p', streak: 0, xp: 25 },
    { name: 'Bruno Castillo', i: 'B', tone: 'n', streak: 0, xp: 10 }
  ];

  /* ---------- Estado guardado ---------- */
  var DEFAULT_SETTINGS = { theme: 'claro', size: 'normal', goal: 10, hour: '19:00',
    t: { diario: true, racha: true, liga: true, novedades: false, sonido: true, animaciones: false, contraste: false, ranking: true } };
  function blankAccount(name, email) {
    return { name: name, user: '@' + (email.split('@')[0] || 'estudiante').toLowerCase().replace(/[^a-z0-9_.]/g, ''), email: email, country: 'Perú', since: today(),
      course: 'python', level: 'nuevo', onboarded: false, progress: {}, xp: 0, weekXp: 0, days: {}, activity: [], badges: {},
      counters: { editorRuns: 0, exercises: 0, perfect: 0, fast: 0, minutes: 0 }, notifRead: {}, chat: null, seq: 1 };
  }
  function demoAccount() {
    var t = today(), a = blankAccount('Alex García', 'alex@email.com');
    a.user = '@alexgarcia'; a.country = 'España'; a.since = addDays(t, -36); a.onboarded = true;
    a.progress = { python: 3 }; a.xp = 280; a.weekXp = 140;
    for (var i = 1; i <= 5; i++) a.days[addDays(t, -i)] = 10;
    a.counters = { editorRuns: 3, exercises: 12, perfect: 1, fast: 1, minutes: 135 };
    a.badges = { primer: a.since, hola: addDays(a.since, 1), velocista: addDays(t, -4), racha: addDays(t, -1) };
    a.activity = [
      { id: 5, kind: 'lesson', title: 'Completaste «¿Qué es una variable?»', sub: 'Fundamentos · Python', date: addDays(t, -1), xp: 30 },
      { id: 4, kind: 'badge', title: 'Obtuviste la insignia «En racha»', sub: '5 días seguidos', date: addDays(t, -1), xp: 50 },
      { id: 3, kind: 'lesson', title: 'Completaste «Tu primer print()»', sub: 'Fundamentos · Python', date: addDays(t, -2), xp: 30 },
      { id: 2, kind: 'lesson', title: 'Completaste «¿Qué es programar?»', sub: 'Fundamentos · Python', date: addDays(t, -3), xp: 30 },
      { id: 1, kind: 'badge', title: 'Obtuviste la insignia «Velocista»', sub: 'Lección en menos de 2 min', date: addDays(t, -4), xp: 30 }
    ];
    a.seq = 6;
    a.notifRead = { 'tip': true, 'dark': true, 'act-1': true, 'act-3': true, 'act-4': true, 'act-5': true };
    return a;
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') s = {};
    s.settings = Object.assign({}, DEFAULT_SETTINGS, s.settings || {});
    s.settings.t = Object.assign({}, DEFAULT_SETTINGS.t, (s.settings && s.settings.t) || {});
    if (!s.accounts) s.accounts = {};
    if (s.v !== 2) {
      // Nuevo temario (v2): la cuenta de ejemplo se rehace y el progreso guardado se ajusta al tamaño de cada curso.
      delete s.accounts['alex@email.com'];
      Object.keys(s.accounts).forEach(function (e) {
        var a = s.accounts[e];
        if (!COURSES[a.course]) a.course = 'python';
        Object.keys(a.progress || {}).forEach(function (id) {
          if (!COURSES[id]) { delete a.progress[id]; return; }
          var total = COURSES[id].modules.reduce(function (n, m) { return n + m.lessons.length; }, 0);
          a.progress[id] = Math.min(a.progress[id], total);
        });
      });
      s.v = 2; s._migrated = true;
    }
    if (!s.accounts['alex@email.com']) s.accounts['alex@email.com'] = demoAccount();
    if (s.session && !s.accounts[s.session]) s.session = null;
    return s;
  }
  var state = load();
  if (state._migrated) { delete state._migrated; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento */ } }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* almacenamiento no disponible */ }
    try { window.dispatchEvent(new CustomEvent('codyu:change')); } catch (e) { /* sin eventos */ }
  }
  function acct() { return state.accounts[state.session] || state.accounts['alex@email.com']; }

  /* ---------- Tema y accesibilidad ---------- */
  function applyTheme() {
    var root = document.documentElement, st = state.settings;
    var dark = st.theme === 'oscuro' || (st.theme === 'sistema' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-motion', st.t.animaciones ? 'reduce' : 'normal');
    root.setAttribute('data-contrast', st.t.contraste ? 'high' : 'normal');
    root.style.zoom = st.size === 'xl' ? '1.2' : st.size === 'grande' ? '1.1' : '';
  }
  applyTheme();
  if (window.matchMedia) {
    try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme); } catch (e) { /* navegador antiguo */ }
  }
  window.addEventListener('storage', function (e) { if (e.key === KEY) { state = load(); applyTheme(); } });

  /* ---------- Cálculos ---------- */
  function courseView(id, a) {
    a = a || acct();
    var c = COURSES[id] || COURSES.python, done = Math.max(0, a.progress[c.id] || 0);
    var total = 0, idx = 0, mods = [], current = null, modulesDone = 0;
    c.modules.forEach(function (m, mi) {
      var start = total; total += m.lessons.length;
      var mDone = Math.max(0, Math.min(m.lessons.length, done - start));
      var status = mDone === m.lessons.length ? 'done' : (done >= start && done < total) ? 'current' : 'locked';
      if (status === 'done') modulesDone++;
      mods.push({ n: mi + 1, title: m.title, desc: m.desc, count: m.lessons.length, done: mDone, start: start, status: status,
        lessons: m.lessons.map(function (t, li) { var g = start + li; return { n: li + 1, g: g, title: t, done: g < done, current: g === done, locked: g > done }; }) });
    });
    mods.forEach(function (m, i) { if (m.status === 'locked' && i > 0 && mods[i - 1].status === 'current') m.status = 'next'; });
    var finished = done >= total;
    mods.forEach(function (m) {
      m.lessons.forEach(function (l) { if (l.current) current = { g: l.g, title: l.title, n: l.n, of: m.count, module: m.title, moduleN: m.n }; });
    });
    if (!current) { var last = mods[mods.length - 1]; current = { g: total - 1, title: last.lessons[last.count - 1].title, n: last.count, of: last.count, module: last.title, moduleN: last.n }; }
    return { id: c.id, name: c.name, title: c.title, glyph: c.glyph, tileBg: c.tileBg, tileFg: c.tileFg, blurb: c.blurb, lang: LANG[c.id], ext: c.ext,
      modules: mods, total: total, done: Math.min(done, total), pct: Math.round(Math.min(done, total) / total * 100), current: current, finished: finished, modulesDone: modulesDone };
  }
  function streakOf(a) {
    var t = today(), d = a.days[t] ? t : addDays(t, -1), n = 0;
    while (a.days[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  function bestStreak(a) {
    var keys = Object.keys(a.days).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) { run = (prev && diffDays(prev, k) === 1) ? run + 1 : 1; best = Math.max(best, run); prev = k; });
    return best;
  }
  function stats(a) {
    a = a || acct();
    var lvl = 0; for (var i = 0; i < LEVELS.length; i++) if (a.xp >= LEVELS[i]) lvl = i;
    var next = LEVELS[lvl + 1] || LEVELS[lvl], lessonsTotal = 0, modulesBest = 0;
    COURSE_ORDER.forEach(function (id) { var v = courseView(id, a); lessonsTotal += v.done; modulesBest = Math.max(modulesBest, v.modulesDone); });
    var badgeCount = Object.keys(a.badges).length;
    return { xp: a.xp, weekXp: a.weekXp, level: lvl + 1, levelName: LEVEL_NAMES[lvl], levelFloor: LEVELS[lvl], nextLevelXp: next, toNext: Math.max(0, next - a.xp),
      levelPct: next > LEVELS[lvl] ? Math.round((a.xp - LEVELS[lvl]) / (next - LEVELS[lvl]) * 100) : 100,
      lessonsTotal: lessonsTotal, modulesBest: modulesBest, streak: streakOf(a), streakBest: Math.max(bestStreak(a), streakOf(a)), todayDone: !!a.days[today()],
      todayMin: a.days[today()] || 0, goal: state.settings.goal, badges: badgeCount, badgesTotal: BADGES.length, minutes: a.counters.minutes,
      exercises: a.counters.exercises };
  }
  function week(a) {
    a = a || acct();
    var t = today(), out = [];
    for (var i = 6; i >= 0; i--) {
      var d = addDays(t, -i);
      out.push({ date: d, label: i === 0 ? 'Hoy' : DIAS_C[parse(d).getDay()], done: !!a.days[d], isToday: i === 0, min: a.days[d] || 0 });
    }
    return out;
  }
  function checkBadges(a) {
    var s = stats(a), earned = [];
    BADGES.forEach(function (b) {
      if (Object.prototype.hasOwnProperty.call(a.badges, b.id)) return;
      var r = b.test(a, s);
      if (r[0] >= r[1]) {
        a.badges[b.id] = today(); a.xp += b.xp; a.weekXp += b.xp;
        a.activity.unshift({ id: a.seq++, kind: 'badge', title: 'Obtuviste la insignia «' + b.title + '»', sub: b.desc, date: today(), xp: b.xp });
        earned.push(b);
      }
    });
    return earned;
  }
  function practice(a, minutes) {
    var t = today();
    a.days[t] = (a.days[t] || 0) + minutes;
    a.counters.minutes += minutes;
  }

  /* ---------- Ejecutar código ---------- */
  var RUN_LANG = { python: 'python', java: 'java', cpp: 'cpp', sql: 'sql', javascript: 'js', html: 'html', css: 'css' };
  var apiToken = null, apiInfo = null;
  function getToken() {
    if (apiToken) return Promise.resolve(apiToken);
    return fetch('/api/token', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('sin api'); return r.json(); })
      .then(function (j) { apiToken = j.token; return apiToken; });
  }
  function runJS(code, stdin) {
    return new Promise(function (resolve) {
      var started = Date.now(), out = [], err = [], finished = false, idle = null, w = null, url = null;
      var src = [
        "function __f(a){return Array.prototype.map.call(a,function(x){if(typeof x==='string')return x;if(x===undefined)return 'undefined';if(x===null||typeof x==='number'||typeof x==='boolean'||typeof x==='bigint')return String(x);if(typeof x==='function')return '[Function]';try{return JSON.stringify(x);}catch(e){return String(x);}}).join(' ');}",
        "var __in=" + JSON.stringify(String(stdin || '').split('\n')) + ";",
        "self.prompt=function(){return __in.length?__in.shift():null;};",
        "self.console={log:function(){postMessage({t:'o',s:__f(arguments)});},info:function(){postMessage({t:'o',s:__f(arguments)});},",
        "warn:function(){postMessage({t:'e',s:__f(arguments)});},error:function(){postMessage({t:'e',s:__f(arguments)});},table:function(x){postMessage({t:'o',s:__f([x])});}};",
        "self.onunhandledrejection=function(e){postMessage({t:'e',s:'Promesa rechazada: '+(e.reason&&e.reason.message||e.reason)});};",
        "self.onmessage=function(){try{(new Function(" + JSON.stringify(String(code)) + "))();}catch(e){postMessage({t:'e',s:(e&&e.name?e.name+': ':'')+(e&&e.message||e)});postMessage({t:'x'});return;}postMessage({t:'d'});};"
      ].join('\n');
      function done(timeout, failed) {
        if (finished) return; finished = true;
        clearTimeout(idle); clearTimeout(limit);
        try { w.terminate(); } catch (e) { /* ya terminado */ }
        try { URL.revokeObjectURL(url); } catch (e) { /* nada */ }
        if (timeout) err.push('El programa tardó más de 5 s y se detuvo. ¿Hay un bucle infinito?');
        resolve({ ok: !timeout && !failed && err.length === 0, code: (timeout || failed || err.length) ? 1 : 0, stdout: out.join('\n'), stderr: err.join('\n'), ms: Date.now() - started, runner: 'JavaScript en AGbyte', timeout: !!timeout });
      }
      var limit = setTimeout(function () { done(true); }, 5000);
      try {
        url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        w = new Worker(url);
      } catch (e) { clearTimeout(limit); resolve({ ok: false, code: 1, stdout: '', stderr: 'No se pudo iniciar JavaScript: ' + e.message, ms: 0, runner: 'JavaScript' }); return; }
      w.onmessage = function (ev) {
        var m = ev.data;
        if (m.t === 'o') out.push(m.s); else if (m.t === 'e') err.push(m.s);
        if (m.t === 'x') { done(false, true); return; }
        clearTimeout(idle); idle = setTimeout(function () { done(false); }, m.t === 'd' ? 250 : 600);
      };
      w.onerror = function (ev) { err.push(ev.message || 'Error de JavaScript'); ev.preventDefault(); done(false, true); };
      w.postMessage('run');
    });
  }
  function runCode(courseId, code, stdin) {
    var lang = RUN_LANG[courseId] || courseId;
    if (lang === 'js') return runJS(code, stdin);
    return getToken().then(function (tok) {
      return fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AGbyte-Token': tok }, body: JSON.stringify({ lang: lang, code: code, stdin: stdin || '' }) });
    }).then(function (r) { return r.json(); }).catch(function () {
      return { ok: false, code: -1, stdout: '', ms: 0, runner: 'sin ejecutor',
        stderr: 'Para ejecutar ' + (COURSES[courseId] ? COURSES[courseId].name : courseId) + ' abre AGbyte con AGbyte.exe o con «Abrir AGbyte.bat».' };
    });
  }
  function errorLine(courseId, stderr) {
    var m = null, s = String(stderr || '');
    if (courseId === 'python') { var all = s.match(/File "[^"]*", line (\d+)/g) || s.match(/line (\d+)/g); if (all) m = all[all.length - 1].match(/(\d+)\s*$/); }
    else if (courseId === 'java') m = s.match(/\.java:(\d+)/);
    else if (courseId === 'cpp') m = s.match(/main\.cpp:(\d+)/);
    else if (courseId === 'javascript') m = s.match(/<anonymous>:(\d+)/);
    return m ? +m[1] : 0;
  }
  function norm(s) { return String(s || '').replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').trim(); }

  /* ---------- Ejercicios: 3 niveles por lenguaje; cada uno se desbloquea al resolver el anterior ---------- */
  var EX_LEVELS = {
    python: ['Primeros pasos', 'Variables y operaciones', 'Decisiones y bucles'],
    javascript: ['Primeros pasos', 'Variables y operaciones', 'Decisiones y bucles'],
    java: ['Primeros pasos', 'Variables y operaciones', 'Decisiones y bucles'],
    cpp: ['Primeros pasos', 'Variables y operaciones', 'Decisiones y bucles'],
    sql: ['Primeras consultas', 'Filtrar y ordenar', 'Contar y agrupar'],
    html: ['Primeras etiquetas', 'Enlaces y atributos', 'Listas, imágenes y formularios'],
    css: ['Primeros estilos', 'Cajas y colores', 'Diseño y estados']
  };
  var JAVA_MAIN = function (body) { return 'public class Main {\n  public static void main(String[] args) {\n' + body + '\n  }\n}\n'; };
  var CPP_MAIN = function (body) { return '#include <iostream>\n#include <string>\n\nint main() {\n' + body + '\n  return 0;\n}\n'; };
  var EXERCISES = {
    python: [
      { id: 'py-order', lv: 1, type: 'order' },
      { id: 'py-fill', lv: 1, type: 'fill', title: 'Completa la línea', goal: 'Completa el código para guardar 17 en la variable edad.', lines: ['edad ___ 17', 'print(edad)'], answers: ['='], explain: 'En Python el signo = guarda un valor en una variable.' },
      { id: 'py-code', lv: 1, type: 'code', title: 'Escribe tu programa', goal: 'Escribe un programa que muestre la suma de 7 y 5.', starter: '# Escribe tu código aquí\n', expected: '12', hint: 'print(7 + 5)' },
      { id: 'py-predict-1', lv: 2, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la pantalla al ejecutar este código?', code: ['precio = 4', 'cantidad = 3', 'print(precio * cantidad)'], options: ['43', '12', '7', 'precio * cantidad'], answer: 1, explain: '* multiplica los valores: 4 × 3 = 12.' },
      { id: 'py-fill-2', lv: 2, type: 'fill', title: 'Completa la línea', goal: 'Completa la letra que convierte el texto en un f-string para mostrar la variable.', lines: ['nombre = "Ana"', 'print(___"Hola, {nombre}")'], answers: ['f'], explain: 'Con una f antes de las comillas, lo que va entre llaves se reemplaza por su valor.' },
      { id: 'py-code-2', lv: 2, type: 'code', title: 'Área de un rectángulo', goal: 'Guarda la base 8 y la altura 5 en variables y muestra el área del rectángulo.', starter: '# Escribe tu código aquí\n', expected: '40', hint: 'base = 8\naltura = 5\nprint(base * altura)' },
      { id: 'py-predict-2', lv: 3, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la pantalla?', code: ['edad = 15', 'if edad >= 18:', '    print("Adulto")', 'else:', '    print("Menor")'], options: ['Adulto', 'Adulto y Menor', 'Menor', 'Nada'], answer: 2, explain: '15 no es mayor o igual que 18, así que se ejecuta el else.' },
      { id: 'py-fill-3', lv: 3, type: 'fill', title: 'Completa el bucle', goal: 'Completa la función que genera los números 1, 2 y 3.', lines: ['for i in ___(1, 4):', '    print(i)'], answers: ['range'], explain: 'range(1, 4) genera 1, 2 y 3: el último número no se incluye.' },
      { id: 'py-code-3', lv: 3, type: 'code', title: 'Suma con un bucle', goal: 'Usa un bucle para sumar los números del 1 al 10 y muestra el resultado.', starter: '# Escribe tu código aquí\n', expected: '55', hint: 'total = 0\nfor n in range(1, 11):\n    total += n\nprint(total)' }
    ],
    javascript: [
      { id: 'js-order', lv: 1, type: 'order' },
      { id: 'js-fill', lv: 1, type: 'fill', title: 'Completa la línea', goal: 'Completa la palabra que declara la variable.', lines: ['___ edad = 17;', 'console.log(edad);'], answers: ['let', 'const', 'var'], explain: 'let y const declaran variables en JavaScript (const si el valor no cambia).' },
      { id: 'js-code', lv: 1, type: 'code', title: 'Escribe tu programa', goal: 'Muestra en la consola la suma de 7 y 5.', starter: '// Escribe tu código aquí\n', expected: '12', hint: 'console.log(7 + 5);' },
      { id: 'js-predict-1', lv: 2, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la consola?', code: ['let a = 5;', 'let b = "5";', 'console.log(a + b);'], options: ['10', 'Error', '55', 'a + b'], answer: 2, explain: 'Si uno de los dos es texto, + une los textos: "5" + "5" = "55".' },
      { id: 'js-fill-2', lv: 2, type: 'fill', title: 'Completa la plantilla', goal: 'Completa el nombre de la variable que va dentro de ${ }.', lines: ['const nombre = "Ana";', 'console.log(`Hola, ${___}`);'], answers: ['nombre'], explain: 'Dentro de ${ } va la variable o la operación que quieres mostrar.' },
      { id: 'js-code-2', lv: 2, type: 'code', title: 'Área de un rectángulo', goal: 'Guarda la base 8 y la altura 5 en variables y muestra el área en la consola.', starter: '// Escribe tu código aquí\n', expected: '40', hint: 'const base = 8;\nconst altura = 5;\nconsole.log(base * altura);' },
      { id: 'js-predict-2', lv: 3, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la consola?', code: ['const nota = 14;', 'if (nota >= 11) {', '  console.log("Aprobado");', '} else {', '  console.log("Desaprobado");', '}'], options: ['Aprobado', 'Desaprobado', '14', 'Nada'], answer: 0, explain: '14 es mayor o igual que 11, así que se cumple el if.' },
      { id: 'js-fill-3', lv: 3, type: 'fill', title: 'Completa el bucle', goal: 'Completa lo que hace avanzar a i de uno en uno.', lines: ['for (let i = 1; i <= 3; ___) {', '  console.log(i);', '}'], answers: ['i++', '++i', 'i+=1', 'i=i+1'], explain: 'i++ suma 1 a i al final de cada vuelta.' },
      { id: 'js-code-3', lv: 3, type: 'code', title: 'Suma con un bucle', goal: 'Usa un bucle para sumar los números del 1 al 10 y muestra el resultado.', starter: '// Escribe tu código aquí\n', expected: '55', hint: 'let total = 0;\nfor (let n = 1; n <= 10; n++) {\n  total += n;\n}\nconsole.log(total);' }
    ],
    java: [
      { id: 'java-order', lv: 1, type: 'order' },
      { id: 'java-fill', lv: 1, type: 'fill', title: 'Completa la línea', goal: 'Completa el tipo de dato para guardar un número entero.', lines: ['___ edad = 17;', 'System.out.println(edad);'], answers: ['int'], explain: 'int es el tipo de dato para números enteros en Java.' },
      { id: 'java-code', lv: 1, type: 'code', title: 'Escribe tu programa', goal: 'Completa main para que muestre la suma de 7 y 5.', starter: JAVA_MAIN('    // Escribe tu código aquí\n    '), expected: '12', hint: 'System.out.println(7 + 5);' },
      { id: 'java-predict-1', lv: 2, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la pantalla?', code: ['int a = 7;', 'int b = 2;', 'System.out.println(a / b);'], options: ['3.5', '3', '4', 'Error'], answer: 1, explain: 'Entre enteros, / descarta los decimales: 7 / 2 = 3.' },
      { id: 'java-fill-2', lv: 2, type: 'fill', title: 'Completa el tipo', goal: 'Completa el tipo de dato que guarda texto.', lines: ['___ nombre = "Ana";', 'System.out.println("Hola, " + nombre);'], answers: ['String', 'var'], explain: 'String guarda texto y va con S mayúscula.' },
      { id: 'java-code-2', lv: 2, type: 'code', title: 'Área de un rectángulo', goal: 'Guarda la base 8 y la altura 5 en variables int y muestra el área del rectángulo.', starter: JAVA_MAIN('    // Escribe tu código aquí\n    '), expected: '40', hint: 'int base = 8;\nint altura = 5;\nSystem.out.println(base * altura);' },
      { id: 'java-predict-2', lv: 3, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la pantalla?', code: ['int nota = 9;', 'if (nota >= 11) {', '  System.out.println("Aprobado");', '} else {', '  System.out.println("Desaprobado");', '}'], options: ['Aprobado', '9', 'Nada', 'Desaprobado'], answer: 3, explain: '9 no llega a 11, así que se ejecuta el else.' },
      { id: 'java-fill-3', lv: 3, type: 'fill', title: 'Completa el bucle', goal: 'Completa el método que muestra cada número en su propia línea.', lines: ['for (int i = 1; i <= 3; i++) {', '  System.out.___(i);', '}'], answers: ['println'], explain: 'println muestra el valor y salta de línea.' },
      { id: 'java-code-3', lv: 3, type: 'code', title: 'Suma con un bucle', goal: 'Usa un bucle for para sumar los números del 1 al 10 y muestra el resultado.', starter: JAVA_MAIN('    // Escribe tu código aquí\n    '), expected: '55', hint: 'int total = 0;\nfor (int n = 1; n <= 10; n++) {\n  total += n;\n}\nSystem.out.println(total);' }
    ],
    cpp: [
      { id: 'cpp-order', lv: 1, type: 'order' },
      { id: 'cpp-fill', lv: 1, type: 'fill', title: 'Completa la línea', goal: 'Completa el objeto que muestra texto en pantalla.', lines: ['#include <iostream>', 'int main() {', '  std::___ << "Hola";', '}'], answers: ['cout'], explain: 'std::cout es la salida estándar de C++.' },
      { id: 'cpp-code', lv: 1, type: 'code', title: 'Escribe tu programa', goal: 'Muestra la suma de 7 y 5.', starter: '#include <iostream>\n\nint main() {\n  // Escribe tu código aquí\n  \n  return 0;\n}\n', expected: '12', hint: 'std::cout << 7 + 5 << std::endl;' },
      { id: 'cpp-predict-1', lv: 2, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la pantalla?', code: ['int a = 7, b = 2;', 'std::cout << a % b;'], options: ['3', '3.5', '1', '0'], answer: 2, explain: '% da el resto de la división: 7 = 2 × 3 + 1.' },
      { id: 'cpp-fill-2', lv: 2, type: 'fill', title: 'Completa el tipo', goal: 'Completa el tipo que guarda texto.', lines: ['#include <iostream>', '#include <string>', 'int main() {', '  std::___ nombre = "Ana";', '  std::cout << "Hola, " << nombre;', '}'], answers: ['string'], explain: 'std::string guarda texto; necesita #include <string>.' },
      { id: 'cpp-code-2', lv: 2, type: 'code', title: 'Área de un rectángulo', goal: 'Guarda la base 8 y la altura 5 en variables y muestra el área del rectángulo.', starter: '#include <iostream>\n\nint main() {\n  // Escribe tu código aquí\n  \n  return 0;\n}\n', expected: '40', hint: 'int base = 8;\nint altura = 5;\nstd::cout << base * altura << std::endl;' },
      { id: 'cpp-predict-2', lv: 3, type: 'predict', title: '¿Qué muestra?', goal: '¿Qué aparece en la pantalla?', code: ['for (int i = 1; i <= 3; i++) {', '  std::cout << i;', '}'], options: ['123', '1 2 3', '321', '3'], answer: 0, explain: 'cout no agrega espacios ni saltos: los números salen pegados.' },
      { id: 'cpp-fill-3', lv: 3, type: 'fill', title: 'Completa la decisión', goal: 'Completa la palabra que pregunta si se cumple una condición.', lines: ['#include <iostream>', 'int main() {', '  int edad = 20;', '  ___ (edad >= 18) {', '    std::cout << "Adulto";', '  }', '}'], answers: ['if'], explain: 'if ejecuta el bloque solo si la condición es verdadera.' },
      { id: 'cpp-code-3', lv: 3, type: 'code', title: 'Suma con un bucle', goal: 'Usa un bucle for para sumar los números del 1 al 10 y muestra el resultado.', starter: '#include <iostream>\n\nint main() {\n  // Escribe tu código aquí\n  \n  return 0;\n}\n', expected: '55', hint: 'int total = 0;\nfor (int n = 1; n <= 10; n++) {\n  total += n;\n}\nstd::cout << total << std::endl;' }
    ],
    sql: [
      { id: 'sql-order', lv: 1, type: 'order' },
      { id: 'sql-fill', lv: 1, type: 'fill', title: 'Completa la consulta', goal: 'Completa la palabra que filtra las filas.', lines: ['SELECT nombre FROM frutas ___ precio < 5;'], answers: ['WHERE'], caseInsensitive: true, explain: 'WHERE filtra las filas que cumplen una condición.' },
      { id: 'sql-code', lv: 1, type: 'code', title: 'Escribe tu consulta', goal: 'Muestra el nombre y el stock de las frutas con stock mayor a 10.', starter: '-- Escribe tu consulta aquí\n', reference: 'SELECT nombre, stock FROM frutas WHERE stock > 10;', hint: 'SELECT nombre, stock FROM frutas WHERE stock > 10;' },
      { id: 'sql-predict-1', lv: 2, type: 'predict', title: '¿Qué devuelve?', goal: 'Precios: mango 3.50, fresa 6.00, maracuyá 4.20, plátano 2.00 y uva 8.50. ¿Qué frutas devuelve?', code: ['SELECT nombre FROM frutas', 'WHERE precio > 5;'], options: ['mango y fresa', 'fresa y uva', 'solo uva', 'ninguna'], answer: 1, explain: 'fresa (6.00) y uva (8.50) son las únicas que cuestan más de 5.' },
      { id: 'sql-fill-2', lv: 2, type: 'fill', title: 'Completa el orden', goal: 'Completa la palabra que ordena el resultado del más caro al más barato.', lines: ['SELECT nombre, precio FROM frutas', '___ BY precio DESC;'], answers: ['ORDER'], caseInsensitive: true, explain: 'ORDER BY ordena; DESC lo hace de mayor a menor.' },
      { id: 'sql-code-2', lv: 2, type: 'code', title: 'La fruta más cara', goal: 'Muestra solo el nombre de la fruta más cara (usa ORDER BY y LIMIT).', starter: '-- Escribe tu consulta aquí\n', reference: 'SELECT nombre FROM frutas ORDER BY precio DESC LIMIT 1;', hint: 'SELECT nombre FROM frutas\nORDER BY precio DESC\nLIMIT 1;' },
      { id: 'sql-predict-2', lv: 3, type: 'predict', title: '¿Qué devuelve?', goal: 'Clientes: Ana (Lima), Luis (Arequipa), Sofía (Cusco) y Diego (Lima). ¿Qué número devuelve?', code: ['SELECT COUNT(*) FROM clientes', "WHERE ciudad = 'Lima';"], options: ['4', '1', '0', '2'], answer: 3, explain: 'Ana y Diego viven en Lima: COUNT(*) cuenta 2 filas.' },
      { id: 'sql-fill-3', lv: 3, type: 'fill', title: 'Completa la función', goal: 'Completa la función que cuenta filas.', lines: ['SELECT ciudad, ___(*) AS total', 'FROM clientes', 'GROUP BY ciudad;'], answers: ['COUNT'], caseInsensitive: true, explain: 'COUNT(*) cuenta cuántas filas hay en cada grupo.' },
      { id: 'sql-code-3', lv: 3, type: 'code', title: 'Clientes por ciudad', goal: 'Muestra cada ciudad y cuántos clientes hay en ella (usa GROUP BY).', starter: '-- Escribe tu consulta aquí\n', reference: 'SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad;', hint: 'SELECT ciudad, COUNT(*) AS total\nFROM clientes\nGROUP BY ciudad;' }
    ],
    html: [
      { id: 'html-order', lv: 1, type: 'order' },
      { id: 'html-fill', lv: 1, type: 'fill', title: 'Completa la etiqueta', goal: 'Completa la etiqueta que crea un párrafo.', lines: ['<___>Me gusta programar</p>'], answers: ['p'], explain: '<p> abre un párrafo y </p> lo cierra.' },
      { id: 'html-code', lv: 1, type: 'code', title: 'Escribe tu HTML', goal: 'Crea una lista con al menos 3 frutas usando <ul> y <li>.', starter: '<!-- Escribe tu HTML aquí -->\n', dom: [{ sel: 'ul li', min: 3, msg: 'Agrega al menos 3 <li> dentro de un <ul>.' }], okMsg: 'Tu lista se ve en la vista previa.', hint: '<ul>\n  <li>Mango</li>\n  <li>Fresa</li>\n  <li>Uva</li>\n</ul>' },
      { id: 'html-predict-1', lv: 2, type: 'predict', title: '¿Qué hace?', goal: '¿Qué crea este código?', code: ['<a href="https://www.wikipedia.org">Buscar</a>'], options: ['Una imagen', 'Un enlace que dice Buscar', 'Un título grande', 'Un botón que envía datos'], answer: 1, explain: '<a> crea un enlace; href dice a dónde lleva.' },
      { id: 'html-fill-2', lv: 2, type: 'fill', title: 'Completa el atributo', goal: 'Completa el atributo que indica a dónde lleva el enlace.', lines: ['<a ___="https://www.wikipedia.org">Wikipedia</a>'], answers: ['href'], explain: 'href guarda la dirección del enlace.' },
      { id: 'html-code-2', lv: 2, type: 'code', title: 'Tu primer enlace', goal: 'Crea un enlace a https://www.wikipedia.org que diga Wikipedia.', starter: '<!-- Escribe tu HTML aquí -->\n', dom: [{ sel: 'a[href*="wikipedia.org"]', min: 1, text: 'wikipedia', msg: 'Necesito un <a> con href="https://www.wikipedia.org" y el texto Wikipedia.' }], okMsg: 'Tu enlace funciona.', hint: '<a href="https://www.wikipedia.org">Wikipedia</a>' },
      { id: 'html-predict-2', lv: 3, type: 'predict', title: '¿Qué muestra?', goal: '¿Cómo se ve esta lista?', code: ['<ol>', '  <li>Lavar</li>', '  <li>Cortar</li>', '</ol>'], options: ['Con viñetas (•)', 'Como una tabla', 'Numerada: 1. Lavar, 2. Cortar', 'Como dos títulos'], answer: 2, explain: '<ol> es una lista ordenada: numera sus elementos.' },
      { id: 'html-fill-3', lv: 3, type: 'fill', title: 'Completa el atributo', goal: 'Completa el atributo que describe la imagen para quien no puede verla.', lines: ['<img src="gato.png" ___="Foto de un gato">'], answers: ['alt'], explain: 'alt describe la imagen; lo leen los lectores de pantalla.' },
      { id: 'html-code-3', lv: 3, type: 'code', title: 'Un formulario', goal: 'Crea un formulario (<form>) con un campo de texto (<input>) y un botón (<button>).', starter: '<!-- Escribe tu HTML aquí -->\n', dom: [{ sel: 'form', min: 1, msg: 'Falta el <form>.' }, { sel: 'form input', min: 1, msg: 'Pon un <input> dentro del <form>.' }, { sel: 'form button', min: 1, msg: 'Pon un <button> dentro del <form>.' }], okMsg: 'Tu formulario está listo.', hint: '<form>\n  <input type="text" placeholder="Tu nombre">\n  <button>Enviar</button>\n</form>' }
    ],
    css: [
      { id: 'css-order', lv: 1, type: 'order' },
      { id: 'css-fill', lv: 1, type: 'fill', title: 'Completa la propiedad', goal: 'Completa la propiedad que cambia el tamaño de la letra.', lines: ['p {', '  ___: 18px;', '}'], answers: ['font-size'], explain: 'font-size controla el tamaño del texto.' },
      { id: 'css-code', lv: 1, type: 'code', title: 'Escribe tu CSS', goal: 'Escribe una regla para que todos los párrafos (p) sean de color red.', starter: '/* Escribe tu CSS aquí */\n', css: [{ sel: 'p', prop: 'color', val: 'rgb(255, 0, 0)' }], okMsg: 'Todos los párrafos ahora son rojos.', hint: 'p {\n  color: red;\n}' },
      { id: 'css-predict-1', lv: 2, type: 'predict', title: '¿Qué hace?', goal: '¿Qué hace esta regla?', code: ['h1 {', '  text-align: center;', '}'], options: ['Pone el título en negrita', 'Centra el texto del título', 'Cambia el color del título', 'Oculta el título'], answer: 1, explain: 'text-align: center centra el texto dentro de su caja.' },
      { id: 'css-fill-2', lv: 2, type: 'fill', title: 'Completa la propiedad', goal: 'Completa la propiedad que agrega espacio DENTRO de la caja, entre el borde y el texto.', lines: ['.caja {', '  ___: 20px;', '}'], answers: ['padding'], explain: 'padding es el relleno interior; margin es el espacio exterior.' },
      { id: 'css-code-2', lv: 2, type: 'code', title: 'Color de fondo', goal: 'Haz que el fondo de la página (body) sea de color lightyellow.', starter: '/* Escribe tu CSS aquí */\n', css: [{ sel: 'body', prop: 'background-color', val: 'rgb(255, 255, 224)' }], okMsg: 'La página ahora tiene fondo amarillo claro.', hint: 'body {\n  background-color: lightyellow;\n}' },
      { id: 'css-predict-2', lv: 3, type: 'predict', title: '¿Qué hace?', goal: '¿Qué hace display: flex en el menú?', code: ['.menu {', '  display: flex;', '}'], options: ['Oculta el menú', 'Lo pinta de azul', 'Pone sus elementos uno al lado del otro', 'Lo hace más grande'], answer: 2, explain: 'flex coloca a los hijos en fila (uno al lado del otro).' },
      { id: 'css-fill-3', lv: 3, type: 'fill', title: 'Completa el estado', goal: 'Completa para cambiar el color del botón cuando pasas el mouse por encima.', lines: ['.boton:___ {', '  background: crimson;', '}'], answers: ['hover'], explain: ':hover se aplica cuando el mouse está encima.' },
      { id: 'css-code-3', lv: 3, type: 'code', title: 'Un borde', goal: 'Haz que los elementos con la clase caja tengan un borde de 2px solid black.', starter: '/* Escribe tu CSS aquí */\n', css: [{ sel: '.caja', prop: 'border-top-width', val: '2px' }, { sel: '.caja', prop: 'border-top-style', val: 'solid' }, { sel: '.caja', prop: 'border-top-color', val: 'rgb(0, 0, 0)' }], okMsg: 'La caja ahora tiene borde.', hint: '.caja {\n  border: 2px solid black;\n}' }
    ]
  };
  var CSS_SAMPLE = '<h1>Mi página</h1><p>Este es un párrafo.</p><p>Y este es otro párrafo.</p><div class="caja">Una caja</div>' +
    '<nav class="menu"><a href="#">Inicio</a> <a href="#">Cursos</a> <a href="#">Perfil</a></nav><button class="boton">Botón</button>';

  /* ---------- Retos del editor: encuentra el error (se desbloquean en orden) ---------- */
  var RETOS = {
    python: [EDITOR.python.err,
      { name: 'bucle.py', lines: ['# Encuentra el error y ejecuta', 'for i in range(3)', '    print("Vuelta", i)'], line: 2, fixed: 'for i in range(3):', hint: 'Después de for ... va dos puntos (:).' },
      { name: 'promedio.py', lines: ['# Encuentra el error y ejecuta', 'notas = [14, 16, 18]', 'promedio = sum(notas) / len(nota)', 'print("Promedio:", promedio)'], line: 3, fixed: 'promedio = sum(notas) / len(notas)', hint: 'La lista se llama notas (con s). Corrígelo así:' },
      { name: 'saludo.py', lines: ['# Encuentra el error y ejecuta', 'def saludar(nombre):', 'print("Hola,", nombre)', '', 'saludar("Alex")'], line: 3, fixed: '    print("Hola,", nombre)', hint: 'El código de una función va con sangría (4 espacios):' }],
    javascript: [EDITOR.javascript.err,
      { name: 'bucle.js', lines: ['// Encuentra el error y ejecuta', 'for (let i = 0; i < 3; i++ {', '  console.log("Vuelta", i);', '}'], line: 2, fixed: 'for (let i = 0; i < 3; i++) {', hint: 'Falta cerrar el paréntesis del for:' },
      { name: 'puntos.js', lines: ['// Encuentra el error y ejecuta', 'const puntos = 10;', 'puntos = puntos + 5;', 'console.log("Puntos:", puntos);'], line: 2, fixed: 'let puntos = 10;', hint: 'Una const no se puede cambiar. Si el valor va a cambiar, usa let:' },
      { name: 'lista.js', lines: ['// Encuentra el error y ejecuta', 'const frutas = ["mango", "fresa", "uva"];', 'console.log("Hay " + frutas.lenght + " frutas");'], line: 3, fixed: 'console.log("Hay " + frutas.length + " frutas");', hint: 'Se escribe length (la t va antes de la h):' }],
    java: [EDITOR.java.err,
      { name: 'Tipos.java', lines: ['public class Tipos {', '  public static void main(String[] args) {', '    int edad = "17";', '    System.out.println("Edad: " + edad);', '  }', '}'], line: 3, fixed: '    int edad = 17;', hint: 'Un int guarda números, no texto. Quita las comillas:' },
      { name: 'Saludo.java', lines: ['public class Saludo {', '  public static void main(String[] args) {', '    string nombre = "Alex";', '    System.out.println("Hola, " + nombre);', '  }', '}'], line: 3, fixed: '    String nombre = "Alex";', hint: 'En Java, String va con S mayúscula:' },
      { name: 'Llaves.java', lines: ['public class Llaves {', '  public static void main(String[] args) {', '    int total = 0;', '    for (int i = 1; i <= 3; i++) {', '      total += i;', '', '    System.out.println("Total: " + total);', '  }', '}'], line: 6, fixed: '    }', hint: 'Falta cerrar la llave del for en la línea 6:' }],
    cpp: [EDITOR.cpp.err,
      { name: 'edad.cpp', lines: ['#include <iostream>', '', 'int main() {', '  int edad = 17', '  std::cout << "Edad: " << edad;', '  return 0;', '}'], line: 4, fixed: '  int edad = 17;', hint: 'Falta el punto y coma al final de la línea 4:' },
      { name: 'comillas.cpp', lines: ['#include <iostream>', '', 'int main() {', "  std::cout << 'Hola, mundo';", '  return 0;', '}'], line: 4, fixed: '  std::cout << "Hola, mundo";', hint: 'El texto va entre comillas dobles. Las simples son para un solo carácter:' },
      { name: 'bucle.cpp', lines: ['#include <iostream>', '', 'int main() {', '  for (int i = 1; i <= 3; i++) {', '    std::cout << i << std::endl;', '', '  return 0;', '}'], line: 6, fixed: '  }', hint: 'Falta cerrar la llave del for en la línea 6:' }],
    sql: [EDITOR.sql.err,
      { name: 'orden.sql', lines: ['-- Encuentra el error y ejecuta', 'SELECT nombre, precio', 'FROM frutas', 'ORDER precio DESC;'], line: 4, fixed: 'ORDER BY precio DESC;', hint: 'Después de ORDER va BY:' },
      { name: 'ciudad.sql', lines: ['-- Encuentra el error y ejecuta', 'SELECT nombre FROM clientes', 'WHERE ciudad = Lima;'], line: 3, fixed: "WHERE ciudad = 'Lima';", hint: 'Los textos van entre comillas simples:' },
      { name: 'tabla.sql', lines: ['-- Encuentra el error y ejecuta', 'SELECT nombre, stock', 'FROM fruta;'], line: 3, fixed: 'FROM frutas;', hint: 'La tabla se llama frutas (con s):' }],
    html: [EDITOR.html.err,
      { name: 'enlace.html', lines: ['<!-- Encuentra el error -->', '<h1>Mis enlaces</h1>', '<a href="https://www.wikipedia.org>Wikipedia</a>'], line: 3, fixed: '<a href="https://www.wikipedia.org">Wikipedia</a>', hint: 'Falta cerrar las comillas del href:' },
      { name: 'lista.html', lines: ['<!-- Encuentra el error -->', '<ul>', '  <li>Mango</li>', '  <li>Fresa</li>', '<ul>'], line: 5, fixed: '</ul>', hint: 'La última etiqueta debe cerrar la lista:' },
      { name: 'imagen.html', lines: ['<!-- Encuentra el error -->', '<h1>Mi gato</h1>', '<img scr="gato.png" alt="Un gato">'], line: 3, fixed: '<img src="gato.png" alt="Un gato">', hint: 'El atributo se escribe src, no scr:' }],
    css: [EDITOR.css.err,
      { name: 'colores.css', lines: ['/* Encuentra el error */', 'p {', '  colour: red;', '}'], line: 3, fixed: '  color: red;', hint: 'En CSS se escribe color (sin u):' },
      { name: 'tamano.css', lines: ['/* Encuentra el error */', 'h1 {', '  font-size: 32;', '}'], line: 3, fixed: '  font-size: 32px;', hint: 'Los tamaños necesitan unidad, por ejemplo px:' },
      { name: 'nota.css', lines: ['/* Encuentra el error */', '#titulo {', '  color: crimson;', '}', '', '.nota', '  font-style: italic;', '}'], line: 6, fixed: '.nota {', hint: 'Falta abrir la llave después del selector:' }]
  };
  function sqlRows(out) {
    var lines = norm(out).split('\n');
    if (lines.length < 2) return null;
    var rows = lines.slice(2).filter(function (l) { return !/^\(\d+ filas?\)$/.test(l.trim()) && l.trim(); }).map(function (l) { return l.split('|').map(function (x) { return x.trim(); }).join('|'); }).sort();
    return (lines[0].split('|').length) + '\n' + rows.join('\n');
  }
  function cssComputed(code, rules) {
    return new Promise(function (resolve) {
      var fr = document.createElement('iframe');
      fr.setAttribute('aria-hidden', 'true');
      fr.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;height:600px;border:0;visibility:hidden';
      var done = false;
      function finish(v) { if (done) return; done = true; try { fr.remove(); } catch (e) { /* nada */ } resolve(v); }
      fr.onload = function () {
        try {
          var d = fr.contentDocument, w = fr.contentWindow;
          if (!d || !d.querySelector('.caja')) return; // aún no carga el documento de prueba
          finish(rules.map(function (r) { var el = d.querySelector(r.sel); return el ? w.getComputedStyle(el).getPropertyValue(r.prop) : ''; }));
        } catch (e) { finish(null); }
      };
      setTimeout(function () { finish(null); }, 4000);
      fr.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>' + String(code).replace(/<\/style/gi, '') + '</style></head><body>' + CSS_SAMPLE + '</body></html>';
      document.body.appendChild(fr);
    });
  }
  function checkExercise(courseId, ex, code) {
    if (ex.dom) {
      var doc = new DOMParser().parseFromString(code, 'text/html');
      for (var i = 0; i < ex.dom.length; i++) {
        var r = ex.dom[i], els = doc.querySelectorAll(r.sel);
        var good = els.length >= (r.min || 1);
        if (good && r.text) good = Array.prototype.some.call(els, function (e) { return e.textContent.toLowerCase().indexOf(r.text) >= 0; });
        if (!good) return Promise.resolve({ pass: false, msg: r.msg });
      }
      return Promise.resolve({ pass: true, msg: ex.okMsg || '¡Bien hecho!' });
    }
    if (ex.css) {
      return cssComputed(code, ex.css).then(function (vals) {
        if (!vals) return { pass: false, msg: 'No pude revisar tu CSS. Inténtalo otra vez.' };
        var bad = ex.css.filter(function (r, i) { return String(vals[i]).trim() !== r.val; });
        return bad.length ? { pass: false, msg: 'Todavía no: revisa el selector ' + bad[0].sel + ' y la propiedad que pide el ejercicio.' } : { pass: true, msg: ex.okMsg || '¡Bien hecho!' };
      });
    }
    if (ex.reference) {
      return Promise.all([runCode(courseId, code, ''), runCode(courseId, ex.reference, '')]).then(function (rs) {
        var mine = rs[0], ref = rs[1];
        if (!mine.ok) return { pass: false, run: mine, msg: 'Tu consulta tiene un error. Revisa la consola.' };
        var pass = sqlRows(mine.stdout) === sqlRows(ref.stdout);
        return { pass: pass, run: mine, msg: pass ? 'Tu consulta trae las filas esperadas.' : 'La consulta funciona, pero no trae las mismas filas o columnas que se piden.' };
      });
    }
    return runCode(courseId, code, '').then(function (r) {
      if (!r.ok) return { pass: false, run: r, msg: 'Tu código tiene un error. Revisa la consola.' };
      var pass = norm(r.stdout) === norm(ex.expected);
      return { pass: pass, run: r, msg: pass ? 'La salida es ' + norm(ex.expected) + '.' : 'Tu programa funciona, pero muestra «' + (norm(r.stdout) || '(nada)') + '» y se esperaba «' + norm(ex.expected) + '».' };
    });
  }
  function exerciseProgram(courseId, ex, filled) {
    var body = filled;
    if (courseId === 'java' && body.indexOf('class ') < 0) return JAVA_MAIN(body.split('\n').map(function (l) { return '    ' + l; }).join('\n'));
    if (courseId === 'cpp' && body.indexOf('main(') < 0) return CPP_MAIN(body.split('\n').map(function (l) { return '  ' + l; }).join('\n'));
    return body;
  }

  /* ---------- Personalización: el código de ejemplo usa tu nombre ---------- */
  function codeName() {
    var a = acct(), f = String((a && a.name) || '').trim().split(/\s+/)[0] || '';
    f = f.replace(/["'`\\<>{}$;%]/g, '');
    return f || 'Alex';
  }
  var personalCache = {};
  function personal(key, o) {
    var n = codeName();
    if (!o || n === 'Alex') return o;
    var k = key + '|' + n;
    if (!personalCache[k]) personalCache[k] = JSON.parse(JSON.stringify(o).replace(/\bAlex\b/g, n));
    return personalCache[k];
  }

  /* ---------- API ---------- */
  var S = {
    today: today, addDays: addDays, fmtLong: fmtLong, fmtShort: fmtShort, fmtRel: fmtRel, fmtMonthYear: fmtMonthYear,
    COURSES: COURSES, COURSE_ORDER: COURSE_ORDER, get EDITOR() { return personal('editor', EDITOR); }, codeName: codeName, EXERCISE: EXERCISE, BADGES: BADGES, tokenize: tokenize,
    lang: function (id) { return LANG[id || acct().course] || 'python'; },
    reload: function () { state = load(); applyTheme(); },
    isLogged: function () { return !!state.session; },
    me: function () {
      var a = acct(), first = (a.name || 'Estudiante').trim().split(/\s+/)[0];
      return { name: a.name, first: first, initial: first.charAt(0).toUpperCase(), user: a.user, email: a.email, country: a.country,
        since: a.since, sinceLabel: fmtShort(a.since) + ' ' + parse(a.since).getFullYear(), sinceMonth: fmtMonthYear(a.since), course: a.course, level: a.level,
        avatar: a.avatar || '' };
    },
    account: acct,
    login: function (email) {
      email = String(email || '').trim().toLowerCase();
      if (!state.accounts[email]) {
        var base = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (x) { return x.toUpperCase(); });
        state.accounts[email] = blankAccount(base || 'Estudiante', email);
      }
      state.session = email; save(); return state.accounts[email];
    },
    register: function (name, email) {
      email = String(email || '').trim().toLowerCase();
      var a = blankAccount(String(name || '').trim() || 'Estudiante', email);
      state.accounts[email] = a; state.session = email; save(); return a;
    },
    logout: function () { state.session = null; save(); },
    deleteAccount: function () {
      var e = state.session; if (!e) return;
      delete state.accounts[e]; state.session = null; save();
    },
    updateProfile: function (p) {
      var a = acct();
      ['name', 'user', 'country'].forEach(function (k) { if (p[k] !== undefined && String(p[k]).trim()) a[k] = String(p[k]).trim(); });
      if (p.email && /.+@.+\..+/.test(p.email) && p.email.toLowerCase() !== a.email) {
        var newE = p.email.trim().toLowerCase();
        if (!state.accounts[newE]) {
          delete state.accounts[a.email]; a.email = newE; state.accounts[newE] = a;
          if (state.session) state.session = newE;
        }
      }
      if (a.user && a.user.charAt(0) !== '@') a.user = '@' + a.user;
      if (p.avatar !== undefined) { a.avatar = String(p.avatar || ''); a.avatarSource = a.avatar ? (p.avatarSource || 'user') : ''; }
      save();
    },
    finishOnboarding: function (o) {
      var a = acct();
      a.course = COURSES[o.course] ? o.course : 'python';
      a.level = o.level || 'nuevo';
      if (o.goal) state.settings.goal = +o.goal;
      if (!a.progress[a.course] && a.level !== 'nuevo') {
        a.progress[a.course] = COURSES[a.course].modules[0].lessons.length;
        a.activity.unshift({ id: a.seq++, kind: 'module', title: 'Saltaste el módulo Introducción', sub: 'Según tu nivel', date: today(), xp: 0 });
      }
      a.onboarded = true; save();
    },
    settings: function () { return state.settings; },
    setSetting: function (k, v) { state.settings[k] = v; save(); applyTheme(); },
    setToggle: function (k, v) { state.settings.t[k] = !!v; save(); applyTheme(); },
    course: function (id) { return courseView(id || acct().course); },
    courses: function () { var a = acct(); return COURSE_ORDER.map(function (id) { var v = courseView(id, a); v.active = id === a.course; v.started = (a.progress[id] || 0) > 0; return v; }); },
    setCourse: function (id) { if (COURSES[id]) { acct().course = id; save(); } },
    stats: function () { return stats(); },
    week: function () { return week(); },
    lessonContent: function (courseId, g) {
      var c = COURSES[courseId]; if (!c) return null;
      var i = 0, title = null;
      c.modules.forEach(function (m) { m.lessons.forEach(function (t) { if (i === g) title = t; i++; }); });
      return title ? personal(courseId + ':' + title, CONTENT[courseId + ':' + title] || null) : null;
    },
    lessonMeta: function (courseId, g) {
      var v = courseView(courseId), found = null;
      v.modules.forEach(function (m) { m.lessons.forEach(function (l) { if (l.g === g) found = { g: g, title: l.title, n: l.n, of: m.count, module: m.title, moduleN: m.n, done: l.done, current: l.current, locked: l.locked, siblings: m.lessons }; }); });
      return found;
    },
    completeLesson: function (courseId, g, r) {
      var a = acct(), meta = this.lessonMeta(courseId, g), before = stats(a), isNew = (a.progress[courseId] || 0) === g;
      var gained = isNew ? r.correct * 10 : Math.round(r.correct * 5);
      if (isNew) a.progress[courseId] = g + 1;
      a.xp += gained; a.weekXp += gained;
      practice(a, 5);
      if (r.correct === r.total) a.counters.perfect++;
      if (r.seconds && r.seconds < 120) a.counters.fast++;
      a.activity.unshift({ id: a.seq++, kind: 'lesson', title: (isNew ? 'Completaste' : 'Repasaste') + ' «' + (meta ? meta.title : 'Lección') + '»', sub: (meta ? meta.module : '') + ' · ' + COURSES[courseId].name, date: today(), xp: gained });
      var v = courseView(courseId, a);
      if (isNew && meta && meta.n === meta.of) a.activity.unshift({ id: a.seq++, kind: 'module', title: 'Terminaste el módulo ' + meta.module, sub: meta.of + ' de ' + meta.of + ' lecciones', date: today(), xp: 0 });
      var newBadges = checkBadges(a);
      var after = stats(a);
      a.lastResult = { course: courseId, g: g, title: meta ? meta.title : '', module: meta ? meta.module : '', courseName: COURSES[courseId].name,
        xp: gained + newBadges.reduce(function (s, b) { return s + b.xp; }, 0), lessonXp: gained, correct: r.correct, total: r.total, seconds: r.seconds || 0,
        streak: after.streak, streakUp: !before.todayDone, badges: newBadges.map(function (b) { return b.title; }), next: v.finished ? null : v.current.title, isNew: isNew,
        moduleDone: meta ? Math.min(meta.of, (v.modules[meta.moduleN - 1] || {}).done || 0) : 0, moduleOf: meta ? meta.of : 0, levelUp: after.level > before.level, level: after.level };
      save();
      return a.lastResult;
    },
    run: function (courseId, code, stdin) { return runCode(courseId, code, stdin); },
    runtimeInfo: function () {
      if (apiInfo) return Promise.resolve(apiInfo);
      return fetch('/api/info', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { apiInfo = j; return j; }).catch(function () { return null; });
    },
    errorLine: errorLine,
    norm: norm,
    getCode: function (courseId, file, fallback) { var a = acct(); return (a.code && a.code[courseId] && typeof a.code[courseId][file] === 'string') ? a.code[courseId][file] : fallback; },
    saveCode: function (courseId, file, text) { var a = acct(); a.code = a.code || {}; a.code[courseId] = a.code[courseId] || {}; a.code[courseId][file] = text; save(); },
    resetCode: function (courseId, file) { var a = acct(); if (a.code && a.code[courseId]) { delete a.code[courseId][file]; save(); } },
    exercises: function (courseId) { return EXERCISES[courseId] || EXERCISES.python; },
    exerciseLevels: function (courseId) { return EX_LEVELS[courseId] || EX_LEVELS.python; },
    exerciseProgram: exerciseProgram,
    cssSample: function () { return CSS_SAMPLE; },
    retos: function (courseId) { return personal('retos', RETOS)[courseId] || []; },
    retoId: function (i) { return i === 0 ? 'reto' : 'reto-' + (i + 1); },
    exerciseDoneIds: function (courseId) { var a = acct(); return (a.exDone && a.exDone[courseId]) || {}; },
    checkExercise: function (courseId, ex, code) { return checkExercise(courseId, ex, code); },
    solveExercise: function (courseId, id) {
      var a = acct(); a.exDone = a.exDone || {}; a.exDone[courseId] = a.exDone[courseId] || {};
      if (a.exDone[courseId][id]) return false;
      a.exDone[courseId][id] = today(); a.counters.exercises++; a.xp += 15; a.weekXp += 15; practice(a, 2); checkBadges(a); save(); return true;
    },
    skipLesson: function (courseId, g) {
      var a = acct(), meta = this.lessonMeta(courseId, g);
      if ((a.progress[courseId] || 0) === g) {
        a.progress[courseId] = g + 1;
        a.activity.unshift({ id: a.seq++, kind: 'lesson', title: 'Marcaste como vista «' + (meta ? meta.title : 'Lección') + '»', sub: (meta ? meta.module : '') + ' · ' + COURSES[courseId].name, date: today(), xp: 0 });
        save();
      }
      return courseView(courseId, a);
    },
    lastResult: function () { return acct().lastResult || null; },
    exerciseDone: function () { var a = acct(); a.counters.exercises++; a.xp += 15; a.weekXp += 15; practice(a, 2); checkBadges(a); save(); },
    editorRun: function () { var a = acct(); a.counters.editorRuns++; var b = checkBadges(a); save(); return b; },
    badges: function () {
      var a = acct(), s = stats(a);
      return BADGES.map(function (b, i) { var r = b.test(a, s); return { id: b.id, n: (i < 9 ? '0' : '') + (i + 1), title: b.title, desc: b.desc, xp: b.xp, icon: b.icon, tone: b.tone, earned: Object.prototype.hasOwnProperty.call(a.badges, b.id), date: Object.prototype.hasOwnProperty.call(a.badges, b.id) ? fmtShort(a.badges[b.id]) : '', cur: r[0], max: r[1], pct: Math.round(r[0] / r[1] * 100) }; });
    },
    activity: function (n) { return acct().activity.slice(0, n || 6).map(function (x) { return Object.assign({}, x, { when: fmtRel(x.date) }); }); },
    ranking: function () {
      var a = acct(), me = { name: a.name, i: (a.name || 'E').charAt(0).toUpperCase(), tone: 'me', streak: streakOf(a), xp: a.weekXp, me: true, friend: true, photo: a.avatar || '' };
      var rows = RIVALS.concat([me]).sort(function (x, y) { return y.xp - x.xp || (x.me ? -1 : 1); });
      rows.forEach(function (r, i) { r.pos = i + 1; });
      var pos = rows.filter(function (r) { return r.me; })[0].pos;
      var gap = pos > 3 ? rows[2].xp - me.xp + 1 : 0;
      return { rows: rows, pos: pos, gap: gap, weekXp: a.weekXp };
    },
    notifications: function () {
      var a = acct(), s = stats(a), t = today(), list = [], rk = this.ranking();
      if (!s.todayDone) list.push(s.streak > 0
        ? { id: 'racha-' + t, icon: 'flame', title: 'Tu racha de ' + s.streak + ' ' + (s.streak === 1 ? 'día' : 'días') + ' está en juego', text: 'Completa una lección antes de las 23:59 para llegar a ' + (s.streak + 1) + ' días.', date: t, time: 'Hoy', action: 'Practicar ahora', href: 'Leccion-Teoria.dc.html' }
        : { id: 'racha0-' + t, icon: 'flame', title: 'Empieza tu racha hoy', text: 'Una lección de 5 minutos basta para empezar.', date: t, time: 'Hoy', action: 'Empezar', href: 'Leccion-Teoria.dc.html' });
      if (rk.pos > 3 && state.settings.t.liga) list.push({ id: 'liga-' + t, icon: 'users', title: 'Estás en el puesto ' + rk.pos + ' de la Liga Granate', text: 'Te faltan ' + rk.gap + ' XP para la zona de ascenso.', date: t, time: 'Hoy', action: 'Ver ranking', href: 'Ranking.dc.html' });
      a.activity.slice(0, 6).forEach(function (x) {
        if (x.kind === 'badge') list.push({ id: 'act-' + x.id, icon: 'trophy', title: x.title.replace('Obtuviste la insignia', 'Insignia desbloqueada:'), text: x.sub + (x.xp ? '. Ganaste ' + x.xp + ' XP.' : ''), date: x.date, time: fmtRel(x.date), action: 'Ver logros', href: 'Logros.dc.html' });
        else if (x.kind === 'lesson') list.push({ id: 'act-' + x.id, icon: 'check', title: x.title, text: '+' + x.xp + ' XP · ' + x.sub, date: x.date, time: fmtRel(x.date) });
      });
      list.push({ id: 'dark', icon: 'moon', title: 'Novedad: modo oscuro', text: 'Actívalo en Ajustes › Apariencia para practicar de noche.', date: addDays(t, -4), time: fmtRel(addDays(t, -4)), action: 'Probar', href: 'Ajustes.dc.html' });
      list.push({ id: 'tip', icon: 'spark', title: 'Consejo de Cody', text: 'Repasar 2 minutos al día ayuda a recordar. Prueba la práctica rápida.', date: addDays(t, -5), time: fmtRel(addDays(t, -5)), action: 'Practicar', href: 'Ejercicio.dc.html' });
      list.forEach(function (n) { n.read = !!a.notifRead[n.id]; var d = diffDays(n.date, t); n.group = d <= 0 ? 'Hoy' : d === 1 ? 'Ayer' : 'Esta semana'; });
      return list;
    },
    unreadCount: function () { return this.notifications().filter(function (n) { return !n.read; }).length; },
    markRead: function (id) { acct().notifRead[id] = true; save(); },
    markAllRead: function () { var a = acct(); this.notifications().forEach(function (n) { a.notifRead[n.id] = true; }); save(); },
    chat: function () { return acct().chat; },
    saveChat: function (msgs) { acct().chat = msgs.slice(-60); save(); },
    exportData: function () { return JSON.stringify({ perfil: this.me(), ajustes: state.settings, cuenta: acct() }, null, 2); }
  };
  window.CodyuStore = S;
})();
