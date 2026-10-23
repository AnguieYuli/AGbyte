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

  /* ---------- Cursos ---------- */
  function M(title, desc, lessons) { return { title: title, desc: desc, lessons: lessons }; }
  var COURSES = {
    python: {
      id: 'python', name: 'Python', title: 'Python: de cero a avanzado', glyph: 'py', tileBg: '#3776AB', tileFg: '#FFE873', ext: 'py',
      blurb: 'Claro, versátil y perfecto para empezar.',
      modules: [
        M('Fundamentos', 'Variables, tipos de datos, operadores, entrada y salida.', ['¿Qué es programar?', 'Tu primer print()', '¿Qué es una variable?', 'Declarar variables', 'Tipos de datos', 'Operadores', 'Entrada con input()', 'Mini proyecto: Calculadora']),
        M('Control de flujo', 'Decisiones y repeticiones con if, elif, else, for y while.', ['if y else', 'elif', 'Condiciones combinadas', 'Bucle for', 'Bucle while', 'break y continue', 'Mini proyecto: Adivina el número']),
        M('Estructuras de datos', 'Listas, tuplas, conjuntos y diccionarios.', ['Listas', 'Métodos de listas', 'Tuplas', 'Conjuntos', 'Diccionarios', 'Recorrer colecciones', 'Mini proyecto: Agenda de contactos']),
        M('Funciones', 'Parámetros, argumentos, retorno y funciones lambda.', ['Definir funciones', 'Parámetros y argumentos', 'return', 'Valores por defecto', 'Funciones lambda', 'Mini proyecto: Conversor de unidades']),
        M('Programación modular', 'Módulos, paquetes e importaciones.', ['¿Qué es un módulo?', 'import y from', 'Crea tus propios módulos', 'Paquetes', 'Mini proyecto: Tu propia librería']),
        M('Programación orientada a objetos', 'Clases, objetos, herencia, encapsulamiento y polimorfismo.', ['Clases y objetos', 'Atributos y métodos', 'El constructor __init__', 'Herencia', 'Encapsulamiento', 'Polimorfismo', 'Mini proyecto: Mascota virtual']),
        M('Temas avanzados', 'Excepciones, archivos, iteradores, generadores, decoradores y expresiones regulares.', ['Excepciones con try y except', 'Leer y escribir archivos', 'Iteradores', 'Generadores', 'Decoradores', 'Expresiones regulares']),
        M('Herramientas', 'pip, entornos virtuales, Git, pruebas y APIs.', ['pip y paquetes', 'Entornos virtuales', 'Git básico', 'Pruebas con pytest', 'Consumir una API']),
        M('Especialización', 'Automatización, análisis de datos, inteligencia artificial y desarrollo web.', ['Automatiza tareas', 'Análisis de datos con pandas', 'Introducción a la inteligencia artificial', 'Desarrollo web con Flask', 'Proyecto final'])
      ]
    },
    java: {
      id: 'java', name: 'Java', title: 'Java: de cero a avanzado', glyph: 'Jv', tileBg: '#DC2626', tileFg: '#FFFFFF', ext: 'java',
      blurb: 'Apps Android, empresas y backend con Spring Boot.',
      modules: [
        M('Fundamentos', 'Sintaxis, variables, tipos de datos y operadores.', ['¿Qué es Java?', 'Tu primer programa', 'Variables', 'Tipos de datos', 'Operadores', 'Mini proyecto: Ficha personal']),
        M('Condicionales y ciclos', 'Decisiones y repeticiones con if, switch, for y while.', ['if y else', 'switch', 'Bucle for', 'Bucle while', 'Mini proyecto: Tabla de multiplicar']),
        M('Métodos', 'Parámetros, retorno, sobrecarga y recursividad.', ['Crear métodos', 'Parámetros y retorno', 'Sobrecarga de métodos', 'Recursividad', 'Mini proyecto: Calculadora']),
        M('Programación orientada a objetos', 'Clases, objetos, constructores, herencia e interfaces.', ['Clases y objetos', 'Constructores', 'Herencia', 'Interfaces', 'Mini proyecto: Cuenta bancaria']),
        M('Estructuras de datos', 'Arreglos, listas, conjuntos y mapas.', ['Arreglos', 'Listas con ArrayList', 'Conjuntos con HashSet', 'Mapas con HashMap', 'Mini proyecto: Inventario']),
        M('Manejo de errores', 'Excepciones y bloques try-catch.', ['¿Qué es una excepción?', 'try y catch', 'finally y throw', 'Tus propias excepciones']),
        M('Temas avanzados', 'Genéricos, colecciones, streams, lambdas y programación concurrente.', ['Genéricos', 'Colecciones', 'Lambdas', 'Streams', 'Programación concurrente']),
        M('Herramientas', 'JVM, JDK, Maven o Gradle y JUnit.', ['JVM y JDK', 'Maven y Gradle', 'Pruebas con JUnit']),
        M('Especialización', 'Aplicaciones empresariales, APIs REST y backend con Spring Boot.', ['Aplicaciones empresariales', '¿Qué es una API REST?', 'Tu primera API con Spring Boot', 'Proyecto final: API de tareas'])
      ]
    },
    javascript: {
      id: 'javascript', name: 'JavaScript', title: 'JavaScript: de cero a avanzado', glyph: 'JS', tileBg: '#FACC15', tileFg: '#422006', ext: 'js',
      blurb: 'El lenguaje de la web: da vida a las páginas.',
      modules: [
        M('Fundamentos', 'Variables con let y const, tipos y operadores.', ['¿Qué es JavaScript?', 'Tu primer console.log()', 'let y const', 'Tipos de datos', 'Operadores', 'Mini proyecto: Saludo']),
        M('Control de flujo', 'Condiciones, ciclos y funciones.', ['if y else', 'switch', 'Bucles for y while', 'Funciones', 'Funciones flecha', 'Mini proyecto: Adivina el número']),
        M('Datos', 'Arrays, objetos, métodos y desestructuración.', ['Arrays', 'Métodos de arrays', 'Objetos', 'Desestructuración', 'Mini proyecto: Lista de compras']),
        M('Conceptos importantes', 'Alcance, closures, this y prototipos.', ['Alcance (scope)', 'Closures', 'La palabra this', 'Prototipos']),
        M('El DOM', 'Seleccionar y modificar elementos HTML.', ['¿Qué es el DOM?', 'Seleccionar elementos', 'Cambiar textos y estilos', 'Crear elementos', 'Mini proyecto: Contador']),
        M('Eventos', 'Clics, formularios, teclado y validaciones.', ['Eventos de clic', 'Formularios', 'Eventos de teclado', 'Validaciones', 'Mini proyecto: Formulario de registro']),
        M('Asincronía', 'Callbacks, promesas, async/await y Fetch API.', ['Callbacks', 'Promesas', 'async y await', 'Fetch API', 'Mini proyecto: El clima']),
        M('Temas avanzados', 'Módulos, clases, manejo de errores y almacenamiento web.', ['Módulos', 'Clases', 'Manejo de errores', 'Almacenamiento web']),
        M('Especialización', 'Node.js, Express, React y aplicaciones web interactivas.', ['Node.js', 'Express', 'React', 'Proyecto final: App interactiva'])
      ]
    },
    html: {
      id: 'html', name: 'HTML', title: 'HTML: estructura de páginas web', glyph: '</>', tileBg: '#C2410C', tileFg: '#FFFFFF', ext: 'html',
      blurb: 'La estructura de toda página web.',
      modules: [
        M('Estructura básica', 'Las etiquetas html, head, body y title.', ['¿Qué es HTML?', 'Tu primera página', 'html, head y body', 'La etiqueta title']),
        M('Textos', 'Etiquetas de texto, títulos, párrafos y comentarios.', ['Títulos', 'Párrafos', 'Negrita y cursiva', 'Comentarios']),
        M('Enlaces, imágenes y listas', 'Enlaces, imágenes, rutas y listas.', ['Enlaces', 'Imágenes', 'Rutas de archivos', 'Listas', 'Mini proyecto: Galería']),
        M('Tablas', 'Tablas, filas y celdas.', ['Tablas', 'Filas y celdas', 'Encabezados de tabla', 'Mini proyecto: Horario de clases']),
        M('Formularios', 'Formularios, campos, botones y validación.', ['Formularios', 'Campos de texto', 'Botones', 'Validación', 'Mini proyecto: Formulario de contacto']),
        M('HTML semántico', 'Las etiquetas header, nav, main, section, article y footer.', ['¿Qué es el HTML semántico?', 'header y nav', 'main y section', 'article y footer']),
        M('Multimedia', 'Audio, video, iframe y contenido incrustado.', ['Audio', 'Video', 'iframe', 'Contenido incrustado']),
        M('Accesibilidad y metadatos', 'Accesibilidad, atributos globales y metadatos.', ['Accesibilidad', 'Texto alternativo', 'Atributos globales', 'Metadatos']),
        M('SEO y buenas prácticas', 'SEO básico, estructura correcta y buenas prácticas.', ['SEO básico', 'Estructura correcta', 'Buenas prácticas', 'Proyecto final: Tu página personal'])
      ]
    },
    css: {
      id: 'css', name: 'CSS', title: 'CSS: diseño y presentación', glyph: 'CSS', tileBg: '#DB2777', tileFg: '#FFFFFF', ext: 'css',
      blurb: 'Colores, diseño y animaciones para tus páginas.',
      modules: [
        M('Introducción a CSS', 'Selectores, propiedades, valores y formas de aplicar CSS.', ['¿Qué es CSS?', 'Selectores', 'Propiedades y valores', 'Formas de aplicar CSS']),
        M('Colores y texto', 'Colores, fondos, tipografía y unidades.', ['Colores', 'Fondos', 'Tipografía', 'Unidades']),
        M('Modelo de caja', 'margin, padding y border.', ['El modelo de caja', 'margin', 'padding', 'border', 'Mini proyecto: Tarjeta de perfil']),
        M('Posicionamiento', 'display, position, overflow y z-index.', ['display', 'position', 'overflow', 'z-index']),
        M('Flexbox y CSS Grid', 'Ordena elementos en filas, columnas y cuadrículas.', ['Flexbox', 'Alinear con Flexbox', 'CSS Grid', 'Áreas de Grid', 'Mini proyecto: Galería']),
        M('Diseño adaptable', 'Media queries y enfoque responsive.', ['¿Qué es el diseño responsive?', 'Media queries', 'Mobile first', 'Mini proyecto: Página adaptable']),
        M('Selectores avanzados', 'Pseudoclases, pseudoelementos y selectores avanzados.', ['Pseudoclases', 'Pseudoelementos', 'Selectores avanzados']),
        M('Animación', 'Transiciones, transformaciones y animaciones.', ['Transiciones', 'Transformaciones', 'Animaciones con keyframes', 'Mini proyecto: Botón animado']),
        M('Buenas prácticas', 'Variables CSS, especificidad y organización.', ['Variables CSS', 'Especificidad', 'Organiza tu CSS']),
        M('Frameworks (opcional)', 'Bootstrap y Tailwind CSS.', ['Bootstrap', 'Tailwind CSS', 'Proyecto final: Landing page'])
      ]
    },
    sql: {
      id: 'sql', name: 'SQL', title: 'SQL: bases de datos', glyph: 'SQL', tileBg: '#334155', tileFg: '#FFFFFF', ext: 'sql',
      blurb: 'Consulta y ordena datos como un analista.',
      modules: [
        M('Conceptos', 'Tablas, registros, campos, claves y relaciones.', ['¿Qué es una base de datos?', 'Tablas, registros y campos', 'Claves primarias y foráneas', 'Relaciones entre tablas']),
        M('Consultas', 'SELECT, WHERE, ORDER BY, DISTINCT y LIMIT.', ['Tu primera consulta', 'WHERE', 'ORDER BY', 'DISTINCT', 'LIMIT']),
        M('Filtros', 'AND, OR, IN, BETWEEN, LIKE y NULL.', ['AND y OR', 'IN y BETWEEN', 'LIKE', 'Valores NULL']),
        M('Funciones', 'COUNT, SUM, AVG, MIN y MAX.', ['COUNT', 'SUM y AVG', 'MIN y MAX', 'Mini proyecto: Reporte de ventas']),
        M('Agrupación', 'GROUP BY y HAVING.', ['GROUP BY', 'HAVING', 'Mini proyecto: Ventas por mes']),
        M('Relaciones', 'INNER JOIN, LEFT JOIN y RIGHT JOIN.', ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'Mini proyecto: Pedidos y clientes']),
        M('Manipulación', 'INSERT, UPDATE y DELETE.', ['INSERT', 'UPDATE', 'DELETE']),
        M('Definición', 'CREATE, ALTER y DROP.', ['CREATE TABLE', 'ALTER TABLE', 'DROP']),
        M('Nivel avanzado', 'Subconsultas, CTE, vistas, índices y funciones de ventana.', ['Subconsultas', 'CTE con WITH', 'Vistas', 'Índices', 'Funciones de ventana']),
        M('Administración', 'Transacciones, normalización, permisos, seguridad y optimización.', ['Transacciones', 'Normalización', 'Permisos y seguridad', 'Optimización']),
        M('Motores para practicar', 'MySQL, PostgreSQL y SQL Server.', ['MySQL', 'PostgreSQL', 'SQL Server', 'Proyecto final: Base de datos de una tienda'])
      ]
    },
    cpp: {
      id: 'cpp', name: 'C++', title: 'C++: de cero a avanzado', glyph: 'C++', tileBg: '#7C3AED', tileFg: '#FFFFFF', ext: 'cpp',
      blurb: 'Rápido y potente: videojuegos y sistemas.',
      modules: [
        M('Fundamentos', 'Sintaxis, variables, tipos, operadores y entrada/salida.', ['¿Qué es C++?', 'Tu primer programa', 'Variables y tipos', 'Operadores', 'Entrada y salida']),
        M('Condicionales, ciclos y funciones', 'Toma decisiones, repite y organiza tu código.', ['if y else', 'switch', 'Bucles', 'Funciones', 'Mini proyecto: Calculadora']),
        M('Arreglos, cadenas y matrices', 'Guarda varios valores y trabaja con texto.', ['Arreglos', 'Cadenas', 'Matrices']),
        M('Punteros, referencias y memoria', 'Cómo C++ usa la memoria.', ['Direcciones de memoria', 'Punteros', 'Referencias']),
        M('Programación estructurada', 'Programación estructurada y recursividad.', ['Divide tu programa en partes', 'Recursividad', 'Mini proyecto: Torres de Hanói']),
        M('Programación orientada a objetos', 'Clases, objetos, constructores, herencia y polimorfismo.', ['Clases y objetos', 'Constructores', 'Herencia', 'Polimorfismo']),
        M('La STL', 'vector, map, set, queue, stack y algoritmos.', ['vector', 'map y set', 'queue y stack', 'Algoritmos de la STL']),
        M('C++ moderno', 'Plantillas, lambdas, excepciones y movimiento de objetos.', ['Plantillas', 'Lambdas', 'Excepciones', 'Movimiento de objetos']),
        M('Gestión de recursos', 'RAII, smart pointers y memoria dinámica.', ['Memoria dinámica', 'RAII', 'Smart pointers']),
        M('Archivos y herramientas', 'Archivos, depuración, compilación y pruebas.', ['Archivos', 'Depuración', 'Compilación', 'Pruebas']),
        M('Especialización', 'Videojuegos, sistemas, simulaciones y aplicaciones de alto rendimiento.', ['Videojuegos', 'Sistemas', 'Simulaciones', 'Proyecto final: Juego en consola'])
      ]
    }
  };
  var COURSE_ORDER = ['python', 'java', 'javascript', 'html', 'css', 'sql', 'cpp'];
  var LANG = { python: 'python', javascript: 'js', html: 'html', css: 'css', sql: 'sql', java: 'java', cpp: 'cpp' };

  /* ---------- Contenido de lecciones (teoría + quiz) ---------- */
  function P() { return Array.prototype.slice.call(arguments); }   // párrafo: ['texto', {c:'código'}, ...]
  var CONTENT = {
    'python:¿Qué es programar?': {
      paras: [P('Programar es escribir instrucciones para que la computadora las siga, una por una y en orden.'),
              P('En Python, la instrucción ', { c: 'print()' }, ' muestra un mensaje en la pantalla. Lo que escribas entre comillas aparece tal cual.')],
      example: { file: 'hola.py', lines: ['print("¡Hola, mundo!")', 'print("Estoy aprendiendo Python")'], output: ['¡Hola, mundo!', 'Estoy aprendiendo Python'] },
      tryit: { label: 'Pruébalo: elige un nombre y ejecuta', file: 'prueba.py', choices: ['Ana', 'Luis', 'Sofía'], lines: ['print("Hola, {v}")'], output: 'Hola, {v}' },
      remember: [P('El texto va entre comillas: ', { c: '"Hola"' }, '.'), P(print_paren('print')), P('Python lee tu código de arriba hacia abajo.')],
      tip: 'Si algo falla, revisa primero las comillas y los paréntesis. Son los errores más comunes.',
      quiz: [
        { prompt: '¿Qué hace print() en Python?', code: ['print("Hola")'], options: ['Muestra un mensaje en pantalla', 'Imprime en una impresora', 'Borra la pantalla', 'Guarda un archivo'], answer: 0, explain: 'print() muestra en la pantalla lo que pongas entre paréntesis.' },
        { prompt: '¿Cuál de estas líneas está bien escrita?', code: ['# Elige la correcta'], options: ['print("Hola")', 'print(Hola")', 'Print["Hola"]', 'print "Hola"'], answer: 0, explain: 'print va en minúsculas, con paréntesis y el texto entre comillas.' },
        { prompt: '¿Qué muestra este código?', code: ['print("2 + 3")'], options: ['2 + 3', '5', '"2 + 3"', 'Un error'], answer: 0, explain: 'Entre comillas es texto: Python lo muestra tal cual, sin calcular.' }
      ]
    },
    'python:Declarar variables': {
      paras: [P('Una ', { b: 'variable' }, ' es un nombre que guarda un valor para usarlo después. En Python la creas así: escribes el nombre, el signo ', { c: '=' }, ' y el valor.'),
              P('No necesitas palabras como ', { c: 'var' }, ' o ', { c: 'int' }, ': Python deduce el tipo por el valor que le das.')],
      diagram: { parts: [{ t: 'edad', label: 'el nombre', kind: 'name' }, { t: '=', label: '«guarda»', kind: 'op' }, { t: '17', label: 'el valor', kind: 'value' }], caption: 'Se lee: «edad guarda 17».' },
      example: { file: 'ejemplo.py', lines: ['nombre = "Alex"', 'edad = 17', 'precio = 4.50', 'print(nombre, "tiene", edad, "años")'], output: ['Alex tiene 17 años'] },
      tryit: { label: 'Pruébalo: elige una fruta y ejecuta', file: 'prueba.py', choices: ['mango', 'chirimoya', 'maracuyá'], lines: ['fruta = "{v}"', 'print("Me gusta el", fruta)'], output: 'Me gusta el {v}' },
      remember: [P('El nombre va a la izquierda del ', { c: '=' }, ' y el valor a la derecha.'), P('Puedes cambiar el valor cuando quieras: ', { c: 'edad = 18' }, '.'), P('Python distingue mayúsculas: ', { c: 'Edad' }, ' y ', { c: 'edad' }, ' son distintas.')],
      tip: 'Truco: lee el = como «guarda». Así nunca lo confundirás con ==.',
      quiz: [
        { prompt: '¿Cuál es la forma correcta de declarar una variable en Python?', code: ['# Elige la opción correcta', 'x = 10', 'var x = 10'], options: ['x = 10', 'var x = 10', 'int x = 10', 'x := 10'], answer: 0, explain: 'En Python basta con nombre = valor. No hace falta var ni int.' },
        { prompt: '¿Qué muestra este código?', code: ['nombre = "Ana"', 'nombre = "Luis"', 'print(nombre)'], options: ['Ana', 'Luis', 'Ana Luis', 'Un error'], answer: 1, explain: 'La segunda línea reemplaza el valor: la variable solo guarda el último, "Luis".' },
        { prompt: '¿Cuál de estos nombres de variable es válido?', code: ['# Solo uno funciona en Python', '??? = 17'], options: ['2edad', 'mi-edad', 'mi_edad', 'mi edad'], answer: 2, explain: 'Un nombre no puede empezar con número ni llevar guiones o espacios. Usa guion bajo: mi_edad.' }
      ]
    },
    'javascript:¿Qué es JavaScript?': {
      paras: [P('JavaScript es el lenguaje que da vida a las páginas web: botones que responden, mensajes, juegos y animaciones.'),
              P('Para mostrar un mensaje usamos ', { c: 'console.log()' }, '. El texto va entre comillas y cada instrucción termina con ', { c: ';' }, '.')],
      example: { file: 'main.js', lines: ['console.log("¡Hola, mundo!");', 'console.log("Estoy aprendiendo JavaScript");'], output: ['¡Hola, mundo!', 'Estoy aprendiendo JavaScript'] },
      tryit: { label: 'Pruébalo: elige un nombre y ejecuta', file: 'prueba.js', choices: ['Ana', 'Luis', 'Sofía'], lines: ['console.log("Hola, {v}");'], output: 'Hola, {v}' },
      remember: [P({ c: 'console.log()' }, ' muestra mensajes en la consola.'), P('JavaScript distingue mayúsculas: ', { c: 'Console.Log' }, ' no funciona.'), P('Termina cada instrucción con ', { c: ';' }, '.')],
      tip: 'Abre la consola de cualquier navegador con F12: ahí aparecen tus console.log().',
      quiz: [
        { prompt: '¿Qué hace console.log()?', code: ['console.log("Hola");'], options: ['Muestra un mensaje en la consola', 'Crea un botón', 'Guarda un archivo', 'Cierra la página'], answer: 0, explain: 'console.log() escribe en la consola lo que pongas entre paréntesis.' },
        { prompt: '¿Cuál de estas líneas está bien escrita?', code: ['// Elige la correcta'], options: ['console.log("Hola");', 'console.log(Hola");', 'Console.Log("Hola");', 'log.console("Hola");'], answer: 0, explain: 'Todo en minúsculas, con punto entre console y log, y el texto entre comillas.' },
        { prompt: '¿Qué muestra este código?', code: ['console.log("5" + "5");'], options: ['55', '10', '"5" + "5"', 'Un error'], answer: 0, explain: 'Con comillas son textos, y + entre textos los une: "55".' }
      ]
    },
    'html:¿Qué es HTML?': {
      paras: [P('HTML es el lenguaje que describe el contenido de una página web: títulos, párrafos, imágenes y enlaces.'),
              P('Cada parte va dentro de etiquetas. ', { c: '<h1>' }, ' abre un título y ', { c: '</h1>' }, ' lo cierra. ', { c: '<p>' }, ' crea un párrafo.')],
      example: { file: 'index.html', lines: ['<h1>¡Hola, mundo!</h1>', '<p>Estoy aprendiendo HTML</p>'], output: ['[Título] ¡Hola, mundo!', '[Párrafo] Estoy aprendiendo HTML'] },
      tryit: { label: 'Pruébalo: elige un nombre y mira la página', file: 'prueba.html', choices: ['Ana', 'Luis', 'Sofía'], lines: ['<h1>Hola, {v}</h1>'], output: '[Título] Hola, {v}' },
      remember: [P('Casi todas las etiquetas se abren y se cierran: ', { c: '<p>…</p>' }, '.'), P('La etiqueta de cierre lleva una barra: ', { c: '</h1>' }, '.'), P('Hay seis niveles de título: de ', { c: '<h1>' }, ' a ', { c: '<h6>' }, '.')],
      tip: 'Guarda tu archivo como .html y ábrelo con doble clic: tu navegador lo mostrará.',
      quiz: [
        { prompt: '¿Qué etiqueta crea el título principal?', code: ['<!-- Elige la etiqueta -->'], options: ['<h1>', '<p>', '<title1>', '<big>'], answer: 0, explain: '<h1> es el título más importante de la página.' },
        { prompt: '¿Cuál está bien cerrada?', code: ['<!-- Solo una es correcta -->'], options: ['<p>Hola</p>', '<p>Hola<p>', '</p>Hola<p>', '<p>Hola</>'], answer: 0, explain: 'Se abre con <p> y se cierra con </p>, con barra.' },
        { prompt: '¿Qué hace la etiqueta <p>?', code: ['<p>Me gusta programar</p>'], options: ['Crea un párrafo', 'Inserta una imagen', 'Crea un enlace', 'Pone el texto en negrita'], answer: 0, explain: '<p> viene de «paragraph»: un párrafo de texto.' }
      ]
    },
    'css:¿Qué es CSS?': {
      paras: [P('HTML arma la estructura de una página y CSS le da estilo: colores, tamaños, espacios y posiciones.'),
              P('Una regla CSS tiene un selector, que dice a qué elementos se aplica, y entre llaves una o más propiedades con su valor: ', { c: 'h1 { color: green; }' }, '.')],
      example: { file: 'estilos.css', lines: ['h1 {', '  color: green;', '  font-size: 32px;', '}', 'p {', '  color: gray;', '}'], output: ['[Título] verde y de 32 px', '[Párrafo] gris'] },
      tryit: { label: 'Pruébalo: elige un color para el título', file: 'prueba.css', choices: ['green', 'purple', 'orange'], lines: ['h1 { color: {v}; }'], outputs: { green: '[Título] ahora es verde', purple: '[Título] ahora es morado', orange: '[Título] ahora es naranja' } },
      remember: [P('El selector va primero: ', { c: 'h1' }, ', ', { c: 'p' }, ', ', { c: '.clase' }, '.'), P('Las propiedades van entre llaves ', { c: '{ }' }, '.'), P('Cada propiedad termina con ', { c: ';' }, '.')],
      tip: 'Si un estilo no se aplica, revisa los dos puntos y el punto y coma: es el error más común en CSS.',
      quiz: [
        { prompt: '¿Para qué sirve CSS?', code: ['/* Elige la respuesta */'], options: ['Para dar estilo a una página', 'Para guardar datos', 'Para hacer cálculos', 'Para crear bases de datos'], answer: 0, explain: 'CSS controla cómo se ve una página: colores, tamaños y posiciones.' },
        { prompt: '¿Cuál de estas reglas está bien escrita?', code: ['/* Solo una es correcta */'], options: ['p { color: red; }', 'p ( color = red )', '{ p color: red }', 'p: color red;'], answer: 0, explain: 'Selector, llaves, propiedad, dos puntos, valor y punto y coma.' },
        { prompt: 'En esta regla, ¿cuál es el selector?', code: ['h1 { color: blue; }'], options: ['h1', 'color', 'blue', '{ }'], answer: 0, explain: 'El selector indica a qué elementos se aplica la regla: aquí, a todos los h1.' }
      ]
    },
    'sql:¿Qué es una base de datos?': {
      paras: [P('Una base de datos guarda información ordenada en tablas, como una hoja de cálculo: cada fila es un registro y cada columna un dato.'),
              P('Con SQL le haces preguntas. ', { c: 'SELECT' }, ' elige columnas y ', { c: 'FROM' }, ' dice de qué tabla.')],
      example: { file: 'consulta.sql', lines: ['SELECT nombre, precio', 'FROM frutas;'], output: ['nombre   | precio', '---------+-------', 'mango    | 3.50', 'fresa    | 6.00', 'maracuyá | 4.20', 'plátano  | 2.00', 'uva      | 8.50', '(5 filas)'] },
      tryit: { label: 'Pruébalo: elige una columna y ejecuta', file: 'prueba.sql', choices: ['nombre', 'precio', 'stock'], lines: ['SELECT {v} FROM frutas;'], outputs: { nombre: 'nombre\n--------\nmango\nfresa\nmaracuyá\nplátano\nuva\n(5 filas)', precio: 'precio\n------\n3.50\n6.00\n4.20\n2.00\n8.50\n(5 filas)', stock: 'stock\n-----\n24\n10\n15\n40\n5\n(5 filas)' } },
      remember: [P({ c: 'SELECT' }, ' va primero y ', { c: 'FROM' }, ' después.'), P('El asterisco ', { c: '*' }, ' trae todas las columnas.'), P('Termina la consulta con ', { c: ';' }, '.')],
      tip: 'SQL no distingue mayúsculas en sus palabras clave, pero escribirlas en mayúsculas ayuda a leer.',
      quiz: [
        { prompt: '¿Qué palabra elige las columnas?', code: ['??? nombre FROM frutas;'], options: ['SELECT', 'FROM', 'TABLE', 'GET'], answer: 0, explain: 'SELECT dice qué columnas quieres ver.' },
        { prompt: '¿Qué indica FROM frutas?', code: ['SELECT * FROM frutas;'], options: ['La tabla de donde salen los datos', 'Que se borre la tabla', 'El orden de las filas', 'Que se cree la tabla'], answer: 0, explain: 'FROM indica la tabla que consultas.' },
        { prompt: '¿Qué consulta trae todas las columnas?', code: ['-- Elige la correcta'], options: ['SELECT * FROM frutas;', 'SELECT ALL frutas;', 'GET * frutas;', 'FROM frutas SELECT *;'], answer: 0, explain: 'El asterisco * significa «todas las columnas».' }
      ]
    },
    'java:¿Qué es Java?': {
      paras: [P('Java es un lenguaje muy usado en apps Android, sistemas de bancos y videojuegos como Minecraft.'),
              P('Para mostrar texto usamos ', { c: 'System.out.println()' }, '. Todo programa vive dentro de una clase y empieza en el método ', { c: 'main' }, '.')],
      example: { file: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    System.out.println("¡Hola, mundo!");', '  }', '}'], output: ['¡Hola, mundo!'] },
      tryit: { label: 'Pruébalo: elige un nombre y ejecuta', file: 'Prueba.java', choices: ['Ana', 'Luis', 'Sofía'], lines: ['System.out.println("Hola, {v}");'], output: 'Hola, {v}' },
      remember: [P('Cada instrucción termina con ', { c: ';' }, '.'), P('Las llaves ', { c: '{ }' }, ' agrupan el código de la clase y de main.'), P('Java distingue mayúsculas: ', { c: 'System' }, ' empieza con S mayúscula.')],
      tip: 'println agrega un salto de línea al final; print escribe sin saltar de línea.',
      quiz: [
        { prompt: '¿Qué instrucción muestra texto en Java?', code: ['// Elige la correcta'], options: ['System.out.println()', 'print()', 'console.log()', 'echo'], answer: 0, explain: 'En Java se usa System.out.println() para mostrar una línea de texto.' },
        { prompt: '¿Dónde empieza a ejecutarse un programa en Java?', code: ['public static void main(String[] args)'], options: ['En el método main', 'En la última línea', 'En el primer comentario', 'En cualquier llave'], answer: 0, explain: 'Java siempre empieza por el método main.' },
        { prompt: '¿Qué le falta a esta línea?', code: ['System.out.println("Hola")'], options: ['Un ; al final', 'Unas llaves', 'Nada', 'La palabra print'], answer: 0, explain: 'Cada instrucción en Java termina con punto y coma.' }
      ]
    },
    'cpp:¿Qué es C++?': {
      paras: [P('C++ es un lenguaje rápido que se usa en videojuegos, motores gráficos y programas que necesitan mucha velocidad.'),
              P('Para mostrar texto usamos ', { c: 'std::cout' }, ' y el operador ', { c: '<<' }, '. Al inicio incluyes ', { c: '<iostream>' }, '.')],
      example: { file: 'main.cpp', lines: ['#include <iostream>', '', 'int main() {', '  std::cout << "¡Hola, mundo!" << std::endl;', '  return 0;', '}'], output: ['¡Hola, mundo!'] },
      tryit: { label: 'Pruébalo: elige un nombre y ejecuta', file: 'prueba.cpp', choices: ['Ana', 'Luis', 'Sofía'], lines: ['std::cout << "Hola, {v}";'], output: 'Hola, {v}' },
      remember: [P({ c: '#include <iostream>' }, ' permite usar cout.'), P({ c: '<<' }, ' envía el texto a la salida.'), P('Cada instrucción termina con ', { c: ';' }, '.')],
      tip: 'std::endl hace un salto de línea, igual que escribir "\\n".',
      quiz: [
        { prompt: '¿Qué muestra texto en C++?', code: ['// Elige la correcta'], options: ['std::cout', 'print()', 'echo', 'System.out'], answer: 0, explain: 'std::cout es la salida estándar de C++.' },
        { prompt: '¿Qué librería necesitas para usar cout?', code: ['#include <?>'], options: ['<iostream>', '<stdio.py>', '<console>', '<html>'], answer: 0, explain: '<iostream> trae las herramientas de entrada y salida.' },
        { prompt: '¿Qué hace << en esta línea?', code: ['std::cout << "Hola";'], options: ['Envía el texto a la salida', 'Compara dos números', 'Comenta la línea', 'Termina el programa'], answer: 0, explain: 'Con cout, << «empuja» el texto hacia la pantalla.' }
      ]
    },
    /* @@LECCIONES-INICIO@@ */
    /* ===== Python · Módulo 1: Fundamentos ===== */
    'python:Tu primer print()': {
      paras: [P('Con ', { c: 'print()' }, ' puedes mostrar textos, números y hasta varias cosas a la vez. Si separas los valores con comas, Python los muestra en la misma línea con un espacio entre ellos.'),
              P('Cada ', { c: 'print()' }, ' termina con un salto de línea, así que dos ', { c: 'print' }, ' seguidos aparecen en dos líneas distintas.')],
      example: { file: 'saludo.py', lines: ['print("Hola")', 'print("Tengo", 17, "años")', 'print(10 + 5)'], output: ['Hola', 'Tengo 17 años', '15'] },
      tryit: { label: 'Pruébalo: elige un número y ejecuta', file: 'prueba.py', choices: ['3', '7', '12'], lines: ['print("El doble de {v} es", {v} * 2)'], outputs: { '3': 'El doble de 3 es 6', '7': 'El doble de 7 es 14', '12': 'El doble de 12 es 24' } },
      remember: [P('Los textos van entre comillas; los números, sin comillas.'), P('Las comas separan valores: ', { c: 'print("Edad:", 17)' }, '.'), P('Sin comillas, Python calcula: ', { c: 'print(2 + 3)' }, ' muestra 5.')],
      tip: 'Usa print() para ver qué está pasando en tu programa: es la herramienta favorita para encontrar errores.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print("Tengo", 3, "gatos")'], options: ['Tengo 3 gatos', 'Tengo3gatos', '"Tengo", 3, "gatos"', 'Un error'], answer: 0, explain: 'Las comas separan los valores y Python pone un espacio entre ellos.' },
        { prompt: '¿Qué muestra este código?', code: ['print(4 * 5)'], options: ['4 * 5', '20', '45', '9'], answer: 1, explain: 'Sin comillas, Python calcula la operación: 4 × 5 = 20.' },
        { prompt: '¿Cuántas líneas aparecen en pantalla?', code: ['print("Uno")', 'print("Dos")'], options: ['Una', 'Dos', 'Ninguna', 'Tres'], answer: 1, explain: 'Cada print() termina con un salto de línea.' }
      ]
    },
    'python:¿Qué es una variable?': {
      paras: [P('Imagina una ', { b: 'caja con etiqueta' }, ': por fuera tiene un nombre y por dentro guarda un valor. Eso es una variable.'),
              P('Cuando usas el nombre de la variable, Python busca la caja y usa lo que hay dentro. Si guardas algo nuevo, lo anterior se reemplaza.')],
      diagram: { parts: [{ t: 'puntos', label: 'la etiqueta', kind: 'name' }, { t: '=', label: '«guarda»', kind: 'op' }, { t: '100', label: 'lo que hay dentro', kind: 'value' }], caption: 'La caja «puntos» guarda 100.' },
      example: { file: 'caja.py', lines: ['puntos = 100', 'print(puntos)', 'puntos = 150', 'print(puntos)'], output: ['100', '150'] },
      tryit: { label: 'Pruébalo: elige tu comida favorita', file: 'prueba.py', choices: ['ceviche', 'lomo saltado', 'ají de gallina'], lines: ['comida = "{v}"', 'print("Mi comida favorita es", comida)'], output: 'Mi comida favorita es {v}' },
      remember: [P('Una variable tiene un nombre y un valor.'), P('Al usar el nombre, obtienes el valor guardado.'), P('Si guardas un valor nuevo, el anterior se pierde.')],
      tip: 'Elige nombres que expliquen qué guardan: precio es mejor que p.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['vidas = 3', 'vidas = 2', 'print(vidas)'], options: ['3', '2', '3 2', '5'], answer: 1, explain: 'La segunda línea reemplaza el valor: ahora vidas guarda 2.' },
        { prompt: '¿Qué es una variable?', code: ['# Elige la mejor descripción'], options: ['Un nombre que guarda un valor', 'Un error del programa', 'Un tipo de número', 'Una instrucción para imprimir'], answer: 0, explain: 'Es como una caja con etiqueta: el nombre y el valor que guarda.' },
        { prompt: '¿Qué muestra este código?', code: ['ciudad = "Cusco"', 'print("Vivo en", ciudad)'], options: ['Vivo en ciudad', 'Vivo en Cusco', 'Vivo en "Cusco"', 'Cusco'], answer: 1, explain: 'Sin comillas, ciudad es la variable: Python muestra su valor, Cusco.' }
      ]
    },
    'python:Tipos de datos': {
      paras: [P('Cada valor tiene un ', { b: 'tipo' }, '. Los más usados son: ', { c: 'int' }, ' (enteros), ', { c: 'float' }, ' (decimales), ', { c: 'str' }, ' (texto) y ', { c: 'bool' }, ' (', { c: 'True' }, ' o ', { c: 'False' }, ').'),
              P('La función ', { c: 'type()' }, ' te dice el tipo de un valor. Y puedes convertir entre tipos con ', { c: 'int()' }, ', ', { c: 'float()' }, ' y ', { c: 'str()' }, '.')],
      example: { file: 'tipos.py', lines: ['edad = 17', 'precio = 3.5', 'nombre = "Ana"', 'activo = True', 'print(type(edad), type(precio))', 'print(type(nombre), type(activo))', 'print(int("20") + 5)'], output: ["<class 'int'> <class 'float'>", "<class 'str'> <class 'bool'>", '25'] },
      tryit: { label: 'Pruébalo: elige un valor y mira su tipo', file: 'prueba.py', choices: ['42', '4.2', '"42"'], lines: ['print(type({v}))'], outputs: { '42': "<class 'int'>", '4.2': "<class 'float'>", '"42"': "<class 'str'>" } },
      remember: [P({ c: '17' }, ' es int, ', { c: '17.0' }, ' es float y ', { c: '"17"' }, ' es str.'), P({ c: 'True' }, ' y ', { c: 'False' }, ' van con mayúscula inicial.'), P('Convierte texto a número con ', { c: 'int("20")' }, ' o ', { c: 'float("3.5")' }, '.')],
      tip: '"5" + "5" da "55" porque son textos. Convierte con int() si quieres sumar.',
      quiz: [
        { prompt: '¿De qué tipo es "3.14"?', code: ['valor = "3.14"'], options: ['float', 'int', 'str', 'bool'], answer: 2, explain: 'Está entre comillas, así que es texto (str), aunque parezca número.' },
        { prompt: '¿Qué muestra este código?', code: ['print(int("8") + 2)'], options: ['82', '10', '"8"2', 'Un error'], answer: 1, explain: 'int("8") convierte el texto en el número 8; 8 + 2 = 10.' },
        { prompt: '¿Cuál es un valor bool?', code: ['# Elige uno'], options: ['"True"', 'True', 'true', '1.0'], answer: 1, explain: 'True (sin comillas y con T mayúscula) es un booleano.' }
      ]
    },
    'python:Operadores': {
      paras: [P('Python calcula con ', { c: '+' }, ', ', { c: '-' }, ', ', { c: '*' }, ' y ', { c: '/' }, '. También tiene ', { c: '//' }, ' (división entera), ', { c: '%' }, ' (resto) y ', { c: '**' }, ' (potencia).'),
              P('Para comparar usa ', { c: '==' }, ', ', { c: '!=' }, ', ', { c: '<' }, ', ', { c: '>' }, ', ', { c: '<=' }, ' y ', { c: '>=' }, '. Una comparación siempre da ', { c: 'True' }, ' o ', { c: 'False' }, '.')],
      example: { file: 'operadores.py', lines: ['print(7 / 2)', 'print(7 // 2)', 'print(7 % 2)', 'print(2 ** 3)', 'print(5 > 3, 5 == 3)'], output: ['3.5', '3', '1', '8', 'True False'] },
      tryit: { label: 'Pruébalo: elige un número y mira si es par', file: 'prueba.py', choices: ['8', '13', '20'], lines: ['print({v} % 2 == 0)'], outputs: { '8': 'True', '13': 'False', '20': 'True' } },
      remember: [P({ c: '/' }, ' siempre da decimal; ', { c: '//' }, ' quita los decimales.'), P({ c: '%' }, ' da el resto: sirve para saber si un número es par.'), P({ c: '=' }, ' guarda; ', { c: '==' }, ' compara.')],
      tip: 'Python respeta el orden de las matemáticas: primero * y /, luego + y -. Usa paréntesis para ir a lo seguro.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print(10 % 3)'], options: ['3', '1', '3.33', '0'], answer: 1, explain: '10 entre 3 da 3 y sobra 1: el resto es 1.' },
        { prompt: '¿Qué muestra este código?', code: ['print(2 + 3 * 4)'], options: ['20', '14', '24', '9'], answer: 1, explain: 'Primero se multiplica (3 × 4 = 12) y luego se suma: 2 + 12 = 14.' },
        { prompt: '¿Qué muestra este código?', code: ['print(4 != 4)'], options: ['True', 'False', '0', 'Un error'], answer: 1, explain: '!= pregunta si son distintos. 4 y 4 son iguales, así que da False.' }
      ]
    },
    'python:Entrada con input()': {
      paras: [P({ c: 'input()' }, ' detiene el programa y espera a que la persona escriba algo. Lo que escriba se guarda como ', { b: 'texto' }, '.'),
              P('Si necesitas un número, conviértelo con ', { c: 'int()' }, ' o ', { c: 'float()' }, '. En el editor de AGbyte escribe tus respuestas en «Entrada del programa».')],
      example: { file: 'entrada.py', stdin: 'Ana\n15', lines: ['nombre = input("¿Cómo te llamas? ")', 'edad = int(input("¿Cuántos años tienes? "))', 'print("Hola,", nombre)', 'print("El próximo año tendrás", edad + 1)'], output: ['¿Cómo te llamas? Ana', '¿Cuántos años tienes? 15', 'Hola, Ana', 'El próximo año tendrás 16'] },
      tryit: { label: 'Pruébalo: elige lo que escribe el usuario', file: 'prueba.py', choices: ['Lima', 'Arequipa', 'Trujillo'], lines: ['ciudad = input("¿Dónde vives? ")', 'print("¡Saludos a", ciudad + "!")'], output: '¿Dónde vives? {v}\n¡Saludos a {v}!', outputs: { 'Lima': '¡Saludos a Lima!', 'Arequipa': '¡Saludos a Arequipa!', 'Trujillo': '¡Saludos a Trujillo!' } },
      remember: [P({ c: 'input()' }, ' siempre devuelve texto.'), P('Para sumar, convierte: ', { c: 'int(input())' }, '.'), P('El texto entre paréntesis es la pregunta que ve el usuario.')],
      tip: 'Deja un espacio al final de la pregunta: input("Nombre: ") se ve más ordenado.',
      quiz: [
        { prompt: '¿De qué tipo es lo que devuelve input()?', code: ['dato = input("Escribe: ")'], options: ['int', 'str', 'float', 'bool'], answer: 1, explain: 'input() siempre devuelve texto (str), aunque escribas números.' },
        { prompt: 'Si el usuario escribe 4, ¿qué muestra?', code: ['n = input()', 'print(n + n)'], options: ['8', '44', 'n + n', 'Un error'], answer: 1, explain: 'n es el texto "4", y "4" + "4" une los textos: 44.' },
        { prompt: '¿Cómo pides un número para hacer cálculos?', code: ['# Elige la línea correcta'], options: ['n = int(input("Número: "))', 'n = input(int("Número: "))', 'n = number(input())', 'int n = input()'], answer: 0, explain: 'Primero input() lee el texto y luego int() lo convierte en número.' }
      ]
    },
    'python:Mini proyecto: Calculadora': {
      paras: [P('¡Hora de juntar todo! Una calculadora ', { b: 'pide dos números' }, ', hace las operaciones y muestra los resultados.'),
              P('Usarás ', { c: 'input()' }, ' para leer, ', { c: 'float()' }, ' para convertir, operadores para calcular y ', { c: 'print()' }, ' para mostrar.')],
      example: { file: 'calculadora.py', stdin: '8\n2', lines: ['a = float(input("Primer número: "))', 'b = float(input("Segundo número: "))', 'print("Suma:", a + b)', 'print("Resta:", a - b)', 'print("Multiplicación:", a * b)', 'print("División:", a / b)'], output: ['Primer número: 8', 'Segundo número: 2', 'Suma: 10.0', 'Resta: 6.0', 'Multiplicación: 16.0', 'División: 4.0'] },
      tryit: { label: 'Pruébalo: elige la operación', file: 'prueba.py', choices: ['+', '-', '*'], lines: ['a = 12', 'b = 4', 'print(a {v} b)'], outputs: { '+': '16', '-': '8', '*': '48' } },
      remember: [P('Usa ', { c: 'float()' }, ' para aceptar decimales como 2.5.'), P('Divide entre cero y Python dará un error: lo resolverás más adelante con ', { c: 'if' }, '.'), P('Llévalo al editor y agrégale la potencia con ', { c: '**' }, '.')],
      tip: 'Reto: copia la calculadora en el editor, escribe dos números en «Entrada del programa» y pulsa Ejecutar.',
      quiz: [
        { prompt: '¿Qué muestra si a = 9.0 y b = 3.0?', code: ['print("División:", a / b)'], options: ['División: 3', 'División: 3.0', 'División: 27.0', 'División: 6.0'], answer: 1, explain: '/ siempre da un decimal: 9.0 / 3.0 = 3.0.' },
        { prompt: '¿Por qué se usa float(input())?', code: ['a = float(input("Número: "))'], options: ['Para convertir el texto en número decimal', 'Para mostrar el número', 'Para borrar la entrada', 'Para redondear'], answer: 0, explain: 'input() da texto; float() lo convierte en un número con decimales.' },
        { prompt: '¿Qué operador calcula la potencia?', code: ['# 2 elevado a 3'], options: ['^', '**', '//', 'pow'], answer: 1, explain: '** eleva a una potencia: 2 ** 3 = 8.' }
      ]
    },

    /* ===== Python · Módulo 2: Control de flujo ===== */
    'python:if y else': {
      paras: [P('Con ', { c: 'if' }, ' el programa ', { b: 'toma decisiones' }, ': si la condición es verdadera, ejecuta el bloque de abajo. Con ', { c: 'else' }, ' indicas qué hacer si no se cumple.'),
              P('Fíjate en los dos puntos ', { c: ':' }, ' y en la ', { b: 'sangría' }, ' (los espacios al inicio): así Python sabe qué líneas pertenecen a cada bloque.')],
      example: { file: 'nota.py', lines: ['nota = 14', 'if nota >= 11:', '    print("Aprobaste")', 'else:', '    print("A estudiar un poco más")'], output: ['Aprobaste'] },
      tryit: { label: 'Pruébalo: elige la temperatura', file: 'prueba.py', choices: ['30', '18', '8'], lines: ['temp = {v}', 'if temp > 25:', '    print("Hace calor")', 'else:', '    print("No hace calor")'], outputs: { '30': 'Hace calor', '18': 'No hace calor', '8': 'No hace calor' } },
      remember: [P('Después de la condición van dos puntos: ', { c: 'if x > 5:' }, '.'), P('El bloque va con sangría (4 espacios o un Tab).'), P({ c: 'else' }, ' no lleva condición.')],
      tip: 'Si ves «IndentationError», revisa los espacios al inicio de las líneas.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['dinero = 5', 'if dinero >= 10:', '    print("Compro")', 'else:', '    print("Ahorro")'], options: ['Compro', 'Ahorro', 'Compro Ahorro', 'Nada'], answer: 1, explain: '5 no es mayor o igual que 10, así que se ejecuta el else.' },
        { prompt: '¿Qué le falta a esta línea?', code: ['if edad >= 18'], options: ['Dos puntos al final', 'Un punto y coma', 'Paréntesis', 'Nada'], answer: 0, explain: 'En Python, if termina con dos puntos: if edad >= 18:' },
        { prompt: '¿Cómo sabe Python qué líneas van dentro del if?', code: ['if x > 0:', '    print("positivo")'], options: ['Por la sangría', 'Por las llaves { }', 'Por el punto y coma', 'Por las comillas'], answer: 0, explain: 'Python usa la sangría (los espacios al inicio) para agrupar el código.' }
      ]
    },
    'python:elif': {
      paras: [P('Cuando hay más de dos caminos usa ', { c: 'elif' }, ' (abreviatura de «else if»). Python revisa las condiciones ', { b: 'de arriba hacia abajo' }, ' y ejecuta solo la primera que se cumple.'),
              P('Puedes poner tantos ', { c: 'elif' }, ' como necesites y, al final, un ', { c: 'else' }, ' para todo lo demás.')],
      example: { file: 'semaforo.py', lines: ['color = "amarillo"', 'if color == "verde":', '    print("Avanza")', 'elif color == "amarillo":', '    print("Precaución")', 'else:', '    print("Detente")'], output: ['Precaución'] },
      tryit: { label: 'Pruébalo: elige tu nota', file: 'prueba.py', choices: ['19', '14', '8'], lines: ['nota = {v}', 'if nota >= 18:', '    print("Excelente")', 'elif nota >= 11:', '    print("Aprobado")', 'else:', '    print("Desaprobado")'], outputs: { '19': 'Excelente', '14': 'Aprobado', '8': 'Desaprobado' } },
      remember: [P('Solo se ejecuta el primer bloque cuya condición sea verdadera.'), P({ c: 'elif' }, ' lleva condición; ', { c: 'else' }, ' no.'), P('El orden importa: pon primero las condiciones más exigentes.')],
      tip: 'Compara textos con ==: color == "verde". Un solo = guardaría el valor.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['n = 0', 'if n > 0:', '    print("positivo")', 'elif n < 0:', '    print("negativo")', 'else:', '    print("cero")'], options: ['positivo', 'negativo', 'cero', 'Nada'], answer: 2, explain: '0 no es mayor ni menor que 0, así que se ejecuta el else.' },
        { prompt: '¿Qué muestra este código?', code: ['x = 20', 'if x > 5:', '    print("A")', 'elif x > 10:', '    print("B")'], options: ['A', 'B', 'A y B', 'Nada'], answer: 0, explain: 'La primera condición ya se cumple, así que Python no revisa las demás.' },
        { prompt: '¿Qué significa elif?', code: ['# elif ...'], options: ['else if: «si no, si…»', 'el final del if', 'un error', 'else for'], answer: 0, explain: 'elif revisa otra condición cuando las anteriores no se cumplieron.' }
      ]
    },
    'python:Condiciones combinadas': {
      paras: [P('Puedes unir condiciones con ', { c: 'and' }, ' (las dos deben cumplirse), ', { c: 'or' }, ' (basta una) y negarlas con ', { c: 'not' }, '.'),
              P('Así escribes reglas como «entra si tiene entrada ', { b: 'y' }, ' es mayor de edad» en una sola línea.')],
      example: { file: 'cine.py', lines: ['edad = 16', 'con_adulto = True', 'if edad >= 18 or con_adulto:', '    print("Puedes entrar")', 'if edad >= 18 and not con_adulto:', '    print("Entras solo")'], output: ['Puedes entrar'] },
      tryit: { label: 'Pruébalo: ¿hace sol?', file: 'prueba.py', choices: ['True', 'False'], lines: ['sol = {v}', 'fin_de_semana = True', 'if sol and fin_de_semana:', '    print("¡A la playa!")', 'else:', '    print("Plan en casa")'], outputs: { 'True': '¡A la playa!', 'False': 'Plan en casa' } },
      remember: [P({ c: 'and' }, ': verdadero solo si ambas lo son.'), P({ c: 'or' }, ': verdadero si al menos una lo es.'), P({ c: 'not' }, ' invierte: ', { c: 'not True' }, ' es ', { c: 'False' }, '.')],
      tip: 'Para rangos puedes escribir 1 <= x <= 10: Python lo entiende.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print(True and False)'], options: ['True', 'False', 'TrueFalse', 'Un error'], answer: 1, explain: 'Con and, ambas deben ser verdaderas. Una es False, así que da False.' },
        { prompt: '¿Qué muestra este código?', code: ['print(False or True)'], options: ['True', 'False', 'None', 'Un error'], answer: 0, explain: 'Con or basta que una sea verdadera.' },
        { prompt: '¿Qué muestra este código?', code: ['x = 7', 'print(1 <= x <= 5)'], options: ['True', 'False', '7', 'Un error'], answer: 1, explain: '7 no está entre 1 y 5, así que la comparación da False.' }
      ]
    },
    'python:Bucle for': {
      paras: [P('Un ', { b: 'bucle' }, ' repite código. Con ', { c: 'for' }, ' recorres una secuencia: cada vuelta, la variable toma el siguiente valor.'),
              P({ c: 'range(1, 6)' }, ' genera 1, 2, 3, 4 y 5 (el último número no se incluye). También puedes recorrer los caracteres de un texto.')],
      example: { file: 'tabla.py', lines: ['for i in range(1, 6):', '    print("3 x", i, "=", 3 * i)'], output: ['3 x 1 = 3', '3 x 2 = 6', '3 x 3 = 9', '3 x 4 = 12', '3 x 5 = 15'] },
      tryit: { label: 'Pruébalo: elige una palabra', file: 'prueba.py', choices: ['sol', 'luna', 'mar'], lines: ['for letra in "{v}":', '    print(letra)'], outputs: { 'sol': 's\no\nl', 'luna': 'l\nu\nn\na', 'mar': 'm\na\nr' } },
      remember: [P({ c: 'range(5)' }, ' va de 0 a 4.'), P({ c: 'range(1, 6)' }, ' va de 1 a 5.'), P('No olvides los dos puntos y la sangría.')],
      tip: 'range(0, 10, 2) cuenta de 2 en 2: 0, 2, 4, 6, 8.',
      quiz: [
        { prompt: '¿Cuántas veces se repite?', code: ['for i in range(4):', '    print("Hola")'], options: ['3', '4', '5', 'Infinitas'], answer: 1, explain: 'range(4) genera 0, 1, 2 y 3: cuatro vueltas.' },
        { prompt: '¿Qué muestra este código?', code: ['total = 0', 'for n in range(1, 4):', '    total = total + n', 'print(total)'], options: ['3', '6', '10', '4'], answer: 1, explain: 'Suma 1 + 2 + 3 = 6.' },
        { prompt: '¿Qué números genera range(2, 5)?', code: ['list(range(2, 5))'], options: ['2, 3, 4', '2, 3, 4, 5', '3, 4, 5', '2, 5'], answer: 0, explain: 'Empieza en 2 y se detiene antes del 5.' }
      ]
    },
    'python:Bucle while': {
      paras: [P({ c: 'while' }, ' repite ', { b: 'mientras' }, ' la condición sea verdadera. Es útil cuando no sabes cuántas vueltas darás.'),
              P('Asegúrate de que algo cambie dentro del bucle; si la condición nunca se vuelve falsa, tendrás un ', { b: 'bucle infinito' }, '.')],
      example: { file: 'cuenta.py', lines: ['n = 3', 'while n > 0:', '    print(n)', '    n = n - 1', 'print("¡Despegue!")'], output: ['3', '2', '1', '¡Despegue!'] },
      tryit: { label: 'Pruébalo: elige desde dónde contar', file: 'prueba.py', choices: ['2', '4', '5'], lines: ['n = {v}', 'while n > 0:', '    print(n)', '    n -= 1'], outputs: { '2': '2\n1', '4': '4\n3\n2\n1', '5': '5\n4\n3\n2\n1' } },
      remember: [P({ c: 'while' }, ' revisa la condición antes de cada vuelta.'), P({ c: 'n -= 1' }, ' es lo mismo que ', { c: 'n = n - 1' }, '.'), P('Si el programa no termina, revisa que la condición cambie.')],
      tip: 'En AGbyte, un bucle infinito se detiene solo a los pocos segundos. ¡Tranquilo!',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['x = 1', 'while x < 10:', '    x = x * 2', 'print(x)'], options: ['8', '16', '10', '2'], answer: 1, explain: 'x vale 1, 2, 4, 8 y luego 16; 16 ya no es menor que 10.' },
        { prompt: '¿Qué problema tiene este código?', code: ['n = 5', 'while n > 0:', '    print(n)'], options: ['Es un bucle infinito', 'Le falta print', 'No hace nada', 'Está perfecto'], answer: 0, explain: 'n nunca cambia, así que n > 0 siempre es verdadero.' },
        { prompt: '¿Cuándo conviene while en vez de for?', code: ['# Elige la mejor respuesta'], options: ['Cuando no sabes cuántas vueltas habrá', 'Siempre', 'Para recorrer un texto', 'Nunca'], answer: 0, explain: 'while repite mientras se cumpla una condición, sin un número fijo de vueltas.' }
      ]
    },
    'python:break y continue': {
      paras: [P({ c: 'break' }, ' ', { b: 'sale' }, ' del bucle al instante. ', { c: 'continue' }, ' ', { b: 'salta' }, ' el resto de la vuelta actual y pasa a la siguiente.'),
              P('Sirven para detener una búsqueda cuando ya encontraste lo que querías o para ignorar valores que no te interesan.')],
      example: { file: 'saltos.py', lines: ['for n in range(1, 10):', '    if n == 3:', '        continue', '    if n == 6:', '        break', '    print(n)'], output: ['1', '2', '4', '5'] },
      tryit: { label: 'Pruébalo: elige dónde detenerte', file: 'prueba.py', choices: ['2', '4', '5'], lines: ['for n in range(1, 10):', '    if n == {v}:', '        break', '    print(n)'], outputs: { '2': '1', '4': '1\n2\n3', '5': '1\n2\n3\n4' } },
      remember: [P({ c: 'break' }, ' termina todo el bucle.'), P({ c: 'continue' }, ' solo salta la vuelta actual.'), P('Ambos se usan dentro de un ', { c: 'for' }, ' o un ', { c: 'while' }, '.')],
      tip: 'while True: con un break adentro es una forma común de repetir hasta que el usuario acierte.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['for n in range(1, 6):', '    if n == 4:', '        break', '    print(n)'], options: ['1 2 3 (en líneas)', '1 2 3 4 5', '4', '1 2 3 5'], answer: 0, explain: 'Al llegar a 4, break termina el bucle: solo se muestran 1, 2 y 3.' },
        { prompt: '¿Qué hace continue?', code: ['continue'], options: ['Salta a la siguiente vuelta', 'Termina el programa', 'Repite la vuelta actual', 'Sale del bucle'], answer: 0, explain: 'continue ignora lo que queda de la vuelta y pasa a la siguiente.' },
        { prompt: '¿Cuántos números muestra?', code: ['for n in range(5):', '    if n % 2 == 0:', '        continue', '    print(n)'], options: ['2', '3', '5', '0'], answer: 0, explain: 'Salta los pares (0, 2, 4) y muestra 1 y 3: dos números.' }
      ]
    },
    'python:Mini proyecto: Adivina el número': {
      paras: [P('Vamos a crear un juego: el programa guarda un ', { b: 'número secreto' }, ' y el jugador intenta adivinarlo. Después de cada intento, le das una pista: «más alto» o «más bajo».'),
              P('Usarás ', { c: 'while' }, ', ', { c: 'if/elif/else' }, ', ', { c: 'input()' }, ' y ', { c: 'break' }, '. Para un número al azar, usa ', { c: 'random.randint(1, 20)' }, '.')],
      example: { file: 'adivina.py', stdin: '10\n15\n13', lines: ['secreto = 13', 'intentos = 0', 'while True:', '    n = int(input("Tu número: "))', '    intentos += 1', '    if n < secreto:', '        print("Más alto")', '    elif n > secreto:', '        print("Más bajo")', '    else:', '        print("¡Ganaste en", intentos, "intentos!")', '        break'], output: ['Tu número: 10', 'Más alto', 'Tu número: 15', 'Más bajo', 'Tu número: 13', '¡Ganaste en 3 intentos!'] },
      tryit: { label: 'Pruébalo: elige tu intento (el secreto es 13)', file: 'prueba.py', choices: ['9', '13', '18'], lines: ['secreto = 13', 'n = {v}', 'if n < secreto:', '    print("Más alto")', 'elif n > secreto:', '    print("Más bajo")', 'else:', '    print("¡Adivinaste!")'], outputs: { '9': 'Más alto', '13': '¡Adivinaste!', '18': 'Más bajo' } },
      remember: [P({ c: 'while True:' }, ' repite hasta encontrar un ', { c: 'break' }, '.'), P('Cuenta los intentos con una variable que sube de uno en uno.'), P('Con ', { c: 'import random' }, ' el secreto cambia en cada partida.')],
      tip: 'Reto: cópialo en el editor, cambia secreto = 13 por random.randint(1, 20) y agrega import random al inicio.',
      quiz: [
        { prompt: 'Si el secreto es 13 y escribes 20, ¿qué pista sale?', code: ['if n < secreto:', '    print("Más alto")', 'elif n > secreto:', '    print("Más bajo")'], options: ['Más alto', 'Más bajo', '¡Ganaste!', 'Nada'], answer: 1, explain: '20 es mayor que 13, así que la pista es «Más bajo».' },
        { prompt: '¿Qué detiene el bucle while True?', code: ['while True:', '    ...'], options: ['break', 'else', 'continue', 'print'], answer: 0, explain: 'while True repite para siempre hasta que se ejecuta break.' },
        { prompt: '¿Qué hace intentos += 1?', code: ['intentos += 1'], options: ['Suma 1 a intentos', 'Pone intentos en 1', 'Compara con 1', 'Resta 1'], answer: 0, explain: '+= 1 es una forma corta de escribir intentos = intentos + 1.' }
      ]
    },
    /* ===== Python · Módulo 3: Estructuras de datos ===== */
    'python:Listas': {
      paras: [P('Una ', { b: 'lista' }, ' guarda varios valores en orden, entre corchetes y separados por comas: ', { c: '["mango", "fresa", "uva"]' }, '.'),
              P('Cada elemento tiene una ', { b: 'posición' }, ' (índice) que empieza en ', { c: '0' }, '. Con ', { c: 'len()' }, ' sabes cuántos elementos tiene y con índices negativos cuentas desde el final.')],
      diagram: { parts: [{ t: '"mango"', label: 'posición 0', kind: 'value' }, { t: '"fresa"', label: 'posición 1', kind: 'value' }, { t: '"uva"', label: 'posición 2', kind: 'value' }], caption: 'frutas[0] es "mango"; frutas[-1] es "uva".' },
      example: { file: 'listas.py', lines: ['frutas = ["mango", "fresa", "uva"]', 'print(frutas[0])', 'print(frutas[-1])', 'print(len(frutas))', 'frutas[1] = "piña"', 'print(frutas)'], output: ['mango', 'uva', '3', "['mango', 'piña', 'uva']"] },
      tryit: { label: 'Pruébalo: elige una posición', file: 'prueba.py', choices: ['0', '1', '2'], lines: ['colores = ["rojo", "verde", "azul"]', 'print(colores[{v}])'], outputs: { '0': 'rojo', '1': 'verde', '2': 'azul' } },
      remember: [P('Los índices empiezan en ', { c: '0' }, '.'), P({ c: 'lista[-1]' }, ' es el último elemento.'), P('Las listas se pueden cambiar: ', { c: 'lista[0] = "nuevo"' }, '.')],
      tip: 'Si pides una posición que no existe verás «IndexError». Revisa len() de tu lista.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['n = [10, 20, 30]', 'print(n[1])'], options: ['10', '20', '30', 'Un error'], answer: 1, explain: 'Los índices empiezan en 0, así que la posición 1 es el segundo elemento: 20.' },
        { prompt: '¿Qué muestra este código?', code: ['letras = ["a", "b", "c", "d"]', 'print(len(letras))'], options: ['3', '4', '5', 'd'], answer: 1, explain: 'len() cuenta los elementos: hay 4.' },
        { prompt: '¿Cómo obtienes el último elemento de una lista?', code: ['datos = [5, 8, 2]'], options: ['datos[-1]', 'datos[3]', 'datos[last]', 'datos(-1)'], answer: 0, explain: 'Los índices negativos cuentan desde el final: -1 es el último.' }
      ]
    },
    'python:Métodos de listas': {
      paras: [P('Las listas traen herramientas propias llamadas ', { b: 'métodos' }, ': ', { c: 'append()' }, ' agrega al final, ', { c: 'insert()' }, ' agrega en una posición, ', { c: 'remove()' }, ' quita un valor y ', { c: 'pop()' }, ' saca el último.'),
              P('También puedes ordenar con ', { c: 'sort()' }, ' y preguntar si algo está en la lista con ', { c: 'in' }, '.')],
      example: { file: 'compras.py', lines: ['compras = ["pan", "leche"]', 'compras.append("huevos")', 'compras.insert(0, "café")', 'compras.remove("leche")', 'print(compras)', 'print("pan" in compras)', 'nums = [5, 2, 9]', 'nums.sort()', 'print(nums)'], output: ["['café', 'pan', 'huevos']", 'True', '[2, 5, 9]'] },
      tryit: { label: 'Pruébalo: elige qué agregar', file: 'prueba.py', choices: ['palta', 'queso', 'arroz'], lines: ['lista = ["pan"]', 'lista.append("{v}")', 'print(lista)'], output: "['pan', '{v}']" },
      remember: [P({ c: 'append(x)' }, ' agrega al final.'), P({ c: 'remove(x)' }, ' quita la primera aparición de x.'), P({ c: 'x in lista' }, ' da ', { c: 'True' }, ' o ', { c: 'False' }, '.')],
      tip: 'sort() ordena la lista original. Si quieres una copia ordenada usa sorted(lista).',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['a = [1, 2]', 'a.append(3)', 'print(a)'], options: ['[1, 2, 3]', '[3, 1, 2]', '[1, 2]', '3'], answer: 0, explain: 'append agrega el valor al final de la lista.' },
        { prompt: '¿Qué muestra este código?', code: ['a = [4, 1, 3]', 'a.sort()', 'print(a)'], options: ['[4, 1, 3]', '[1, 3, 4]', '[4, 3, 1]', 'None'], answer: 1, explain: 'sort() ordena de menor a mayor.' },
        { prompt: '¿Qué muestra este código?', code: ['a = ["x", "y"]', 'print("z" in a)'], options: ['True', 'False', 'z', 'Un error'], answer: 1, explain: '"z" no está en la lista, así que in da False.' }
      ]
    },
    'python:Tuplas': {
      paras: [P('Una ', { b: 'tupla' }, ' es como una lista, pero ', { b: 'no se puede cambiar' }, ' después de crearla. Se escribe entre paréntesis: ', { c: '(10, 20)' }, '.'),
              P('Son ideales para datos fijos, como coordenadas o una fecha. Además puedes ', { b: 'desempaquetarlas' }, ' en varias variables a la vez.')],
      example: { file: 'tuplas.py', lines: ['punto = (3, 7)', 'print(punto[0])', 'x, y = punto', 'print("x =", x, "y =", y)', 'fecha = (21, "octubre", 2026)', 'print(len(fecha))'], output: ['3', 'x = 3 y = 7', '3'] },
      tryit: { label: 'Pruébalo: elige un día', file: 'prueba.py', choices: ['lunes', 'viernes', 'domingo'], lines: ['dia, hora = ("{v}", 9)', 'print("Clase el", dia, "a las", hora)'], output: 'Clase el {v} a las 9' },
      remember: [P('Las tuplas usan paréntesis: ', { c: '(1, 2)' }, '.'), P('No puedes cambiar sus valores (son inmutables).'), P('Desempaqueta así: ', { c: 'a, b = (1, 2)' }, '.')],
      tip: 'Para intercambiar dos variables en Python basta con: a, b = b, a',
      quiz: [
        { prompt: '¿Qué pasa si haces t[0] = 5 con una tupla?', code: ['t = (1, 2)', 't[0] = 5'], options: ['Da un error', 'Cambia el valor', 'Crea otra tupla', 'No pasa nada'], answer: 0, explain: 'Las tuplas no se pueden modificar; Python muestra un TypeError.' },
        { prompt: '¿Qué muestra este código?', code: ['a, b = (5, 9)', 'print(b)'], options: ['5', '9', '(5, 9)', '14'], answer: 1, explain: 'Al desempaquetar, a toma 5 y b toma 9.' },
        { prompt: '¿Cuál es una tupla?', code: ['# Elige una'], options: ['[1, 2]', '(1, 2)', '{1, 2}', '"1, 2"'], answer: 1, explain: 'Las tuplas se escriben con paréntesis.' }
      ]
    },
    'python:Conjuntos': {
      paras: [P('Un ', { b: 'conjunto' }, ' (', { c: 'set' }, ') guarda valores ', { b: 'sin repetir' }, ' y sin orden fijo. Se escribe entre llaves: ', { c: '{1, 2, 3}' }, '.'),
              P('Sirve para quitar duplicados y para comparar grupos: ', { c: '|' }, ' une, ', { c: '&' }, ' da lo común y ', { c: '-' }, ' lo que está en uno y no en el otro.')],
      example: { file: 'conjuntos.py', lines: ['numeros = [1, 2, 2, 3, 3, 3]', 'unicos = set(numeros)', 'print(unicos)', 'a = {1, 2, 3}', 'b = {2, 3, 4}', 'print(a & b)', 'print(len(a | b))'], output: ['{1, 2, 3}', '{2, 3}', '4'] },
      tryit: { label: 'Pruébalo: elige un número para agregar', file: 'prueba.py', choices: ['1', '5', '9'], lines: ['s = {1, 5}', 's.add({v})', 'print(len(s))'], outputs: { '1': '2', '5': '2', '9': '3' } },
      remember: [P('Un set no guarda repetidos.'), P({ c: 'set(lista)' }, ' quita duplicados de una lista.'), P('Un set vacío se crea con ', { c: 'set()' }, ', no con ', { c: '{}' }, '.')],
      tip: 'Los sets no tienen posiciones: no puedes pedir s[0].',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print(len({4, 4, 4, 5}))'], options: ['4', '2', '1', '3'], answer: 1, explain: 'Los repetidos se eliminan: quedan 4 y 5, dos elementos.' },
        { prompt: '¿Qué muestra este código?', code: ['a = {1, 2}', 'b = {2, 3}', 'print(a & b)'], options: ['{2}', '{1, 2, 3}', '{1, 3}', 'set()'], answer: 0, explain: '& da los elementos que están en ambos: solo el 2.' },
        { prompt: '¿Para qué sirve más un set?', code: ['# Elige la mejor respuesta'], options: ['Quitar repetidos', 'Guardar en orden', 'Guardar texto largo', 'Hacer bucles'], answer: 0, explain: 'Su gran ventaja es que no guarda valores repetidos.' }
      ]
    },
    'python:Diccionarios': {
      paras: [P('Un ', { b: 'diccionario' }, ' guarda pares ', { b: 'clave: valor' }, '. En vez de buscar por posición, buscas por la clave: ', { c: 'alumno["nombre"]' }, '.'),
              P('Puedes agregar o cambiar valores con ', { c: 'dicc["clave"] = valor' }, ' y usar ', { c: 'get()' }, ' para leer sin error si la clave no existe.')],
      diagram: { parts: [{ t: '"nombre"', label: 'la clave', kind: 'name' }, { t: ':', label: 'separa', kind: 'op' }, { t: '"Ana"', label: 'el valor', kind: 'value' }], caption: 'alumno["nombre"] devuelve "Ana".' },
      example: { file: 'alumno.py', lines: ['alumno = {"nombre": "Ana", "edad": 15}', 'print(alumno["nombre"])', 'alumno["edad"] = 16', 'alumno["ciudad"] = "Lima"', 'print(alumno)', 'print(alumno.get("correo", "sin correo"))'], output: ['Ana', "{'nombre': 'Ana', 'edad': 16, 'ciudad': 'Lima'}", 'sin correo'] },
      tryit: { label: 'Pruébalo: elige un producto', file: 'prueba.py', choices: ['pan', 'leche', 'queso'], lines: ['precios = {"pan": 0.5, "leche": 4.2, "queso": 12.0}', 'print(precios["{v}"])'], outputs: { 'pan': '0.5', 'leche': '4.2', 'queso': '12.0' } },
      remember: [P('Las claves van a la izquierda de los dos puntos.'), P('Cada clave es única: si la repites, se reemplaza el valor.'), P({ c: 'dicc.get("x", 0)' }, ' devuelve 0 si "x" no existe.')],
      tip: 'Piensa en un diccionario como una ficha: cada campo (clave) tiene su dato (valor).',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['d = {"a": 1, "b": 2}', 'print(d["b"])'], options: ['1', '2', 'b', 'Un error'], answer: 1, explain: 'La clave "b" guarda el valor 2.' },
        { prompt: '¿Qué muestra este código?', code: ['d = {"x": 5}', 'd["x"] = 7', 'print(d)'], options: ["{'x': 5}", "{'x': 7}", "{'x': 5, 'x': 7}", '7'], answer: 1, explain: 'Asignar a una clave existente reemplaza su valor.' },
        { prompt: '¿Qué muestra este código?', code: ['d = {"a": 1}', 'print(d.get("z", 0))'], options: ['0', 'None', 'z', 'Un error'], answer: 0, explain: 'get devuelve el valor por defecto (0) cuando la clave no existe.' }
      ]
    },
    'python:Recorrer colecciones': {
      paras: [P('Con ', { c: 'for' }, ' puedes recorrer listas, tuplas, sets y diccionarios. ', { c: 'enumerate()' }, ' te da la posición y el valor a la vez.'),
              P('En un diccionario, ', { c: '.items()' }, ' te entrega cada clave con su valor para que trabajes con ambos.')],
      example: { file: 'recorrer.py', lines: ['frutas = ["mango", "fresa"]', 'for i, f in enumerate(frutas, 1):', '    print(i, f)', 'stock = {"mango": 24, "uva": 5}', 'for fruta, cantidad in stock.items():', '    print(fruta, "->", cantidad)'], output: ['1 mango', '2 fresa', 'mango -> 24', 'uva -> 5'] },
      tryit: { label: 'Pruébalo: elige un mínimo de stock', file: 'prueba.py', choices: ['5', '10', '20'], lines: ['stock = {"mango": 24, "uva": 5, "pera": 12}', 'for f, c in stock.items():', '    if c >= {v}:', '        print(f)'], outputs: { '5': 'mango\nuva\npera', '10': 'mango\npera', '20': 'mango' } },
      remember: [P({ c: 'for x in lista:' }, ' recorre los valores.'), P({ c: 'enumerate(lista)' }, ' da (posición, valor).'), P({ c: 'dicc.items()' }, ' da (clave, valor).')],
      tip: 'Para sumar todos los números de una lista existe sum(lista). ¡Pruébalo!',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['total = 0', 'for n in [3, 4, 5]:', '    total += n', 'print(total)'], options: ['12', '345', '5', '3'], answer: 0, explain: 'Suma 3 + 4 + 5 = 12.' },
        { prompt: '¿Qué muestra este código?', code: ['for i, x in enumerate(["a", "b"]):', '    print(i, x)'], options: ['0 a / 1 b (en líneas)', '1 a / 2 b (en líneas)', 'a b', '0 1'], answer: 0, out: '0 a\n1 b', explain: 'enumerate empieza en 0 si no le indicas otro número.' },
        { prompt: '¿Qué te da .items() en un diccionario?', code: ['d.items()'], options: ['Pares clave y valor', 'Solo las claves', 'Solo los valores', 'La cantidad'], answer: 0, explain: 'items() entrega cada clave junto con su valor.' }
      ]
    },
    'python:Mini proyecto: Agenda de contactos': {
      paras: [P('Vas a crear una ', { b: 'agenda' }, ': un diccionario donde la clave es el nombre y el valor es el teléfono.'),
              P('Podrás agregar contactos, buscar uno con ', { c: 'get()' }, ' y mostrar todos ordenados con ', { c: 'sorted()' }, '.')],
      example: { file: 'agenda.py', lines: ['agenda = {}', 'agenda["Ana"] = "987 654 321"', 'agenda["Luis"] = "912 345 678"', 'agenda["Carla"] = "955 111 222"', 'print("Contactos:", len(agenda))', 'for nombre in sorted(agenda):', '    print(nombre, "-", agenda[nombre])', 'print(agenda.get("Pedro", "No está en tu agenda"))'], output: ['Contactos: 3', 'Ana - 987 654 321', 'Carla - 955 111 222', 'Luis - 912 345 678', 'No está en tu agenda'] },
      tryit: { label: 'Pruébalo: elige a quién buscar', file: 'prueba.py', choices: ['Ana', 'Luis', 'Pedro'], lines: ['agenda = {"Ana": "987 654 321", "Luis": "912 345 678"}', 'print(agenda.get("{v}", "No encontrado"))'], outputs: { 'Ana': '987 654 321', 'Luis': '912 345 678', 'Pedro': 'No encontrado' } },
      remember: [P('Un diccionario vacío se crea con ', { c: '{}' }, '.'), P({ c: 'sorted(agenda)' }, ' ordena las claves alfabéticamente.'), P('Para borrar: ', { c: 'del agenda["Luis"]' }, '.')],
      tip: 'Reto: agrega un menú con input() para elegir entre «agregar», «buscar» y «salir».',
      quiz: [
        { prompt: '¿Cómo agregas a Sofía a la agenda?', code: ['agenda = {}'], options: ['agenda["Sofía"] = "999"', 'agenda.append("Sofía")', 'agenda + "Sofía"', 'add(agenda, "Sofía")'], answer: 0, explain: 'En un diccionario se agrega asignando a una clave nueva.' },
        { prompt: '¿Qué muestra este código?', code: ['a = {"Luis": 1, "Ana": 2}', 'print(sorted(a))'], options: ["['Ana', 'Luis']", "['Luis', 'Ana']", '[1, 2]', "{'Ana': 2}"], answer: 0, explain: 'sorted() devuelve las claves ordenadas alfabéticamente.' },
        { prompt: '¿Qué hace del agenda["Ana"]?', code: ['del agenda["Ana"]'], options: ['Borra el contacto de Ana', 'Busca a Ana', 'Cambia el número', 'Muestra a Ana'], answer: 0, explain: 'del elimina la clave y su valor del diccionario.' }
      ]
    },

    /* ===== Python · Módulo 4: Funciones ===== */
    'python:Definir funciones': {
      paras: [P('Una ', { b: 'función' }, ' es un bloque de código con nombre que puedes usar muchas veces. Se crea con ', { c: 'def' }, ', el nombre, paréntesis y dos puntos.'),
              P('Definirla no la ejecuta: tienes que ', { b: 'llamarla' }, ' escribiendo su nombre con paréntesis, por ejemplo ', { c: 'saludar()' }, '.')],
      example: { file: 'funciones.py', lines: ['def saludar():', '    print("¡Hola!")', '    print("Bienvenido a AGbyte")', '', 'saludar()', 'saludar()'], output: ['¡Hola!', 'Bienvenido a AGbyte', '¡Hola!', 'Bienvenido a AGbyte'] },
      tryit: { label: 'Pruébalo: elige cuántas veces llamarla', file: 'prueba.py', choices: ['1', '2', '3'], lines: ['def aplaudir():', '    print("👏")', '', 'for _ in range({v}):', '    aplaudir()'], outputs: { '1': '👏', '2': '👏\n👏', '3': '👏\n👏\n👏' } },
      remember: [P({ c: 'def nombre():' }, ' crea la función.'), P('El cuerpo va con sangría.'), P('Para usarla, llámala: ', { c: 'nombre()' }, '.')],
      tip: 'Si copias el mismo código dos veces, probablemente debería ser una función.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['def hola():', '    print("Hola")'], options: ['Hola', 'Nada', 'hola', 'Un error'], answer: 1, out: '', explain: 'La función se define pero nunca se llama, así que no se muestra nada.' },
        { prompt: '¿Qué palabra crea una función en Python?', code: ['___ mi_funcion():'], options: ['def', 'function', 'func', 'fun'], answer: 0, explain: 'En Python las funciones se definen con def.' },
        { prompt: '¿Cuántas veces se muestra «Hola»?', code: ['def f():', '    print("Hola")', 'f()', 'f()', 'f()'], options: ['1', '3', '0', '2'], answer: 1, explain: 'La función se llama tres veces.' }
      ]
    },
    'python:Parámetros y argumentos': {
      paras: [P('Los ', { b: 'parámetros' }, ' son variables que la función recibe entre paréntesis. Los valores que le pasas al llamarla se llaman ', { b: 'argumentos' }, '.'),
              P('Así la misma función trabaja con datos distintos. Si tiene varios parámetros, sepáralos con comas.')],
      example: { file: 'parametros.py', lines: ['def saludar(nombre, ciudad):', '    print("Hola,", nombre, "de", ciudad)', '', 'saludar("Ana", "Lima")', 'saludar("Luis", "Puno")', 'saludar(ciudad="Ica", nombre="Sofía")'], output: ['Hola, Ana de Lima', 'Hola, Luis de Puno', 'Hola, Sofía de Ica'] },
      tryit: { label: 'Pruébalo: elige un nombre', file: 'prueba.py', choices: ['Ana', 'Luis', 'Sofía'], lines: ['def felicitar(nombre):', '    print("¡Feliz cumpleaños,", nombre + "!")', '', 'felicitar("{v}")'], output: '¡Feliz cumpleaños, {v}!' },
      remember: [P('Parámetro: el nombre en la definición. Argumento: el valor al llamar.'), P('El orden de los argumentos importa.'), P('Puedes nombrarlos al llamar: ', { c: 'f(ciudad="Ica")' }, '.')],
      tip: 'Si olvidas un argumento verás «missing 1 required positional argument».',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['def doble(n):', '    print(n * 2)', 'doble(7)'], options: ['7', '14', 'n * 2', '72'], answer: 1, explain: 'n recibe 7, y 7 × 2 = 14.' },
        { prompt: '¿Qué muestra este código?', code: ['def resta(a, b):', '    print(a - b)', 'resta(b=2, a=10)'], options: ['8', '-8', '12', 'Un error'], answer: 0, explain: 'Con argumentos nombrados el orden no importa: a = 10 y b = 2.' },
        { prompt: 'En def area(base, altura):, ¿qué son base y altura?', code: ['def area(base, altura):'], options: ['Parámetros', 'Argumentos', 'Funciones', 'Listas'], answer: 0, explain: 'Los nombres que aparecen en la definición son parámetros.' }
      ]
    },
    'python:return': {
      paras: [P({ c: 'return' }, ' hace que la función ', { b: 'devuelva' }, ' un resultado. Ese valor puedes guardarlo en una variable o usarlo en otra operación.'),
              P('Cuando se ejecuta ', { c: 'return' }, ', la función termina en ese momento. Si no hay return, la función devuelve ', { c: 'None' }, '.')],
      example: { file: 'return.py', lines: ['def area(base, altura):', '    return base * altura', '', 'a = area(8, 5)', 'print(a)', 'print(area(2, 3) + area(1, 1))'], output: ['40', '7'] },
      tryit: { label: 'Pruébalo: elige un precio', file: 'prueba.py', choices: ['10', '50', '80'], lines: ['def con_igv(precio):', '    return precio * 1.18', '', 'print(round(con_igv({v}), 2))'], outputs: { '10': '11.8', '50': '59.0', '80': '94.4' } },
      remember: [P({ c: 'return' }, ' entrega un valor y termina la función.'), P('Guarda el resultado: ', { c: 'x = f()' }, '.'), P('print() muestra; return devuelve. No son lo mismo.')],
      tip: 'Prefiere return a print dentro de las funciones: así puedes reutilizar el resultado.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['def f(x):', '    return x + 1', 'print(f(4) * 2)'], options: ['10', '9', '5', '8'], answer: 0, explain: 'f(4) devuelve 5, y 5 × 2 = 10.' },
        { prompt: '¿Qué muestra este código?', code: ['def f():', '    print("A")', 'print(f())'], options: ['A', 'A y luego None', 'None', 'Nada'], answer: 1, out: 'A\nNone', explain: 'f() muestra A, y como no tiene return, devuelve None, que también se muestra.' },
        { prompt: '¿Qué pasa con el código después de return?', code: ['def f():', '    return 1', '    print("hola")'], options: ['No se ejecuta', 'Se ejecuta primero', 'Da un error', 'Se repite'], answer: 0, explain: 'return termina la función: lo que viene después no se ejecuta.' }
      ]
    },
    'python:Valores por defecto': {
      paras: [P('Un parámetro puede tener un ', { b: 'valor por defecto' }, ': si no le pasas ese argumento, la función usa el valor indicado.'),
              P('Se escribe con ', { c: '=' }, ' en la definición. Los parámetros con valor por defecto van ', { b: 'al final' }, '.')],
      example: { file: 'defecto.py', lines: ['def saludar(nombre, saludo="Hola"):', '    print(saludo + ",", nombre)', '', 'saludar("Ana")', 'saludar("Luis", "Buenos días")'], output: ['Hola, Ana', 'Buenos días, Luis'] },
      tryit: { label: 'Pruébalo: elige la potencia', file: 'prueba.py', choices: ['2', '3', '4'], lines: ['def potencia(base, exp=2):', '    return base ** exp', '', 'print(potencia(3), potencia(3, {v}))'], outputs: { '2': '9 9', '3': '9 27', '4': '9 81' } },
      remember: [P('Se define así: ', { c: 'def f(x, y=10):' }, '.'), P('Si pasas el argumento, reemplaza al valor por defecto.'), P('Primero los parámetros sin valor por defecto.')],
      tip: 'print() usa valores por defecto: sep=" " y end="\\n". Prueba print("a", "b", sep="-").',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['def f(x, y=3):', '    return x + y', 'print(f(2))'], options: ['5', '2', '3', 'Un error'], answer: 0, explain: 'y toma su valor por defecto 3; 2 + 3 = 5.' },
        { prompt: '¿Qué muestra este código?', code: ['def f(x, y=3):', '    return x + y', 'print(f(2, 10))'], options: ['5', '12', '13', '23'], answer: 1, explain: 'El argumento 10 reemplaza al valor por defecto: 2 + 10 = 12.' },
        { prompt: '¿Cuál definición es correcta?', code: ['# Elige una'], options: ['def f(a=1, b):', 'def f(a, b=1):', 'def f(=1 a, b):', 'def f(a b=1):'], answer: 1, explain: 'Los parámetros con valor por defecto van al final.' }
      ]
    },
    'python:Funciones lambda': {
      paras: [P('Una ', { c: 'lambda' }, ' es una función pequeña de ', { b: 'una sola expresión' }, ', escrita en una línea: ', { c: 'lambda x: x * 2' }, '.'),
              P('Se usan mucho como argumento de otras funciones, por ejemplo para indicar cómo ordenar con ', { c: 'sorted(..., key=...)' }, '.')],
      example: { file: 'lambda.py', lines: ['doble = lambda x: x * 2', 'print(doble(6))', 'frutas = [("uva", 8.5), ("mango", 3.5), ("fresa", 6.0)]', 'baratas = sorted(frutas, key=lambda f: f[1])', 'print(baratas[0])', 'print(list(map(lambda n: n ** 2, [1, 2, 3])))'], output: ['12', "('mango', 3.5)", '[1, 4, 9]'] },
      tryit: { label: 'Pruébalo: elige cómo ordenar las palabras', file: 'prueba.py', choices: ['len', '-len', 'str.lower'], lines: ['palabras = ["Sol", "ave", "Montaña"]', 'print(sorted(palabras, key=lambda p: {v}(p)))'], outputs: { 'len': "['Sol', 'ave', 'Montaña']", '-len': "['Montaña', 'Sol', 'ave']", 'str.lower': "['ave', 'Montaña', 'Sol']" } },
      remember: [P('Forma: ', { c: 'lambda parámetros: resultado' }, '.'), P('No lleva ', { c: 'return' }, ': devuelve la expresión directamente.'), P('Úsalas para cosas cortas; para lo demás, ', { c: 'def' }, '.')],
      tip: 'filter(lambda n: n % 2 == 0, lista) se queda solo con los pares.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['f = lambda a, b: a + b', 'print(f(3, 4))'], options: ['7', '34', 'lambda', 'Un error'], answer: 0, explain: 'La lambda suma sus dos parámetros: 3 + 4 = 7.' },
        { prompt: '¿Qué muestra este código?', code: ['print(sorted([3, 1, 2], key=lambda x: -x))'], options: ['[1, 2, 3]', '[3, 2, 1]', '[-3, -2, -1]', '[3, 1, 2]'], answer: 1, explain: 'Ordena según -x, así que los más grandes quedan primero.' },
        { prompt: '¿Qué palabra NO se usa en una lambda?', code: ['lambda x: x + 1'], options: ['return', 'lambda', 'los dos puntos', 'el parámetro'], answer: 0, explain: 'La lambda devuelve su expresión sin escribir return.' }
      ]
    },
    'python:Mini proyecto: Conversor de unidades': {
      paras: [P('Crearás un ', { b: 'conversor' }, ' con funciones: una para pasar de Celsius a Fahrenheit, otra de kilómetros a millas y otra de soles a dólares.'),
              P('Cada función recibe un valor, hace el cálculo y lo ', { b: 'devuelve con return' }, '. Con ', { c: 'round()' }, ' muestras solo dos decimales.')],
      example: { file: 'conversor.py', lines: ['def c_a_f(c):', '    return c * 9 / 5 + 32', '', 'def km_a_millas(km):', '    return km * 0.621371', '', 'def soles_a_dolares(soles, tasa=3.75):', '    return soles / tasa', '', 'print(c_a_f(25), "°F")', 'print(round(km_a_millas(10), 2), "millas")', 'print(round(soles_a_dolares(100), 2), "dólares")'], output: ['77.0 °F', '6.21 millas', '26.67 dólares'] },
      tryit: { label: 'Pruébalo: elige la temperatura', file: 'prueba.py', choices: ['0', '20', '100'], lines: ['def c_a_f(c):', '    return c * 9 / 5 + 32', '', 'print(c_a_f({v}))'], outputs: { '0': '32.0', '20': '68.0', '100': '212.0' } },
      remember: [P('Una función por cada conversión: código ordenado.'), P({ c: 'round(x, 2)' }, ' deja dos decimales.'), P('El tipo de cambio puede ser un valor por defecto.')],
      tip: 'Reto: pide la temperatura con input() y muestra el resultado convertido.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print(round(3.14159, 2))'], options: ['3.14', '3.1', '3.15', '3'], answer: 0, explain: 'round(x, 2) redondea a dos decimales.' },
        { prompt: '¿Qué muestra este código?', code: ['def km_a_m(km):', '    return km * 1000', 'print(km_a_m(3))'], options: ['3000', '300', '0.003', '3'], answer: 0, explain: '3 km × 1000 = 3000 metros.' },
        { prompt: '¿Por qué usar return en el conversor?', code: ['def c_a_f(c):', '    return c * 9 / 5 + 32'], options: ['Para reutilizar el resultado', 'Para mostrarlo en pantalla', 'Para repetir la función', 'Porque es obligatorio'], answer: 0, explain: 'Con return puedes guardar o seguir calculando con el resultado.' }
      ]
    },
    /* ===== Python · Módulo 5: Programación modular ===== */
    'python:¿Qué es un módulo?': {
      paras: [P('Un ', { b: 'módulo' }, ' es un archivo de Python con funciones y variables listas para usar. Python trae muchos: ', { c: 'math' }, ' para matemáticas, ', { c: 'random' }, ' para azar y ', { c: 'datetime' }, ' para fechas.'),
              P('Para usar un módulo lo ', { b: 'importas' }, ' con ', { c: 'import' }, ' y luego escribes ', { c: 'modulo.funcion()' }, '.')],
      example: { file: 'modulos.py', lines: ['import math', 'print(math.sqrt(16))', 'print(round(math.pi, 2))', 'print(math.floor(7.9), math.ceil(7.1))'], output: ['4.0', '3.14', '7 8'] },
      tryit: { label: 'Pruébalo: elige una función de math', file: 'prueba.py', choices: ['math.sqrt(81)', 'math.floor(7.8)', 'math.ceil(7.2)'], lines: ['import math', 'print({v})'], outputs: { 'math.sqrt(81)': '9.0', 'math.floor(7.8)': '7', 'math.ceil(7.2)': '8' } },
      remember: [P('Importa una vez, al inicio del archivo.'), P('Usa el nombre del módulo y un punto: ', { c: 'math.sqrt(9)' }, '.'), P('Python trae cientos de módulos: es su «biblioteca estándar».')],
      tip: 'Escribe help(math) en Python para ver todo lo que trae un módulo.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['import math', 'print(math.sqrt(49))'], options: ['7', '7.0', '49', '2401'], answer: 1, explain: 'sqrt calcula la raíz cuadrada y devuelve un decimal: 7.0.' },
        { prompt: '¿Qué módulo usarías para números al azar?', code: ['import ___'], options: ['random', 'math', 'azar', 'numbers'], answer: 0, explain: 'random genera números al azar, por ejemplo random.randint(1, 6).' },
        { prompt: '¿Qué es un módulo?', code: ['# Elige la mejor descripción'], options: ['Un archivo con código reutilizable', 'Un error de Python', 'Un tipo de variable', 'Un bucle especial'], answer: 0, explain: 'Un módulo es un archivo .py con funciones que puedes importar.' }
      ]
    },
    'python:import y from': {
      paras: [P('Hay varias formas de importar: ', { c: 'import math' }, ' trae todo el módulo; ', { c: 'from math import sqrt' }, ' trae solo lo que necesitas y lo usas sin el prefijo.'),
              P('Con ', { c: 'as' }, ' le das un apodo más corto: ', { c: 'import statistics as st' }, '.')],
      example: { file: 'importar.py', lines: ['from math import sqrt, pi', 'import statistics as st', 'print(sqrt(25))', 'print(round(pi * 2, 2))', 'print(st.mean([4, 8, 6]))'], output: ['5.0', '6.28', '6'] },
      tryit: { label: 'Pruébalo: elige qué importar', file: 'prueba.py', choices: ['sqrt', 'floor', 'ceil'], lines: ['from math import {v}', 'print({v}(10.5))'], outputs: { 'sqrt': '3.24037034920393', 'floor': '10', 'ceil': '11' } },
      remember: [P({ c: 'import m' }, ' → usas ', { c: 'm.f()' }, '.'), P({ c: 'from m import f' }, ' → usas ', { c: 'f()' }, ' directo.'), P({ c: 'import m as x' }, ' → usas ', { c: 'x.f()' }, '.')],
      tip: 'Evita from modulo import *: no sabrás de dónde viene cada nombre.',
      quiz: [
        { prompt: 'Con from math import sqrt, ¿cómo llamas a la función?', code: ['from math import sqrt'], options: ['sqrt(9)', 'math.sqrt(9)', 'math(9)', 'import sqrt(9)'], answer: 0, explain: 'Al importar con from, usas el nombre directamente.' },
        { prompt: '¿Qué muestra este código?', code: ['import math as m', 'print(m.floor(3.9))'], options: ['3', '4', '3.9', 'Un error'], answer: 0, explain: 'm es un apodo de math; floor redondea hacia abajo: 3.' },
        { prompt: '¿Para qué sirve as?', code: ['import statistics as st'], options: ['Para darle un apodo', 'Para importar todo', 'Para borrar el módulo', 'Para crear un módulo'], answer: 0, explain: 'as crea un nombre corto para el módulo.' }
      ]
    },
    'python:Crea tus propios módulos': {
      paras: [P('Cualquier archivo ', { c: '.py' }, ' que escribas puede ser un módulo. Si guardas funciones en ', { c: 'saludos.py' }, ', desde otro archivo de la misma carpeta escribes ', { c: 'import saludos' }, '.'),
              P('El bloque ', { c: 'if __name__ == "__main__":' }, ' se ejecuta solo cuando corres ese archivo directamente, no cuando lo importas. Es ideal para pruebas.')],
      example: { file: 'saludos.py + main.py', norun: true, lines: ['# --- saludos.py ---', 'def hola(nombre):', '    return "Hola, " + nombre', '', '# --- main.py (misma carpeta) ---', 'import saludos', 'print(saludos.hola("Ana"))'], output: ['Hola, Ana'] },
      tryit: { label: 'Pruébalo: elige a quién saludar con tu módulo', file: 'main.py', norun: true, choices: ['Ana', 'Luis', 'Sofía'], lines: ['import saludos', 'print(saludos.hola("{v}"))'], output: 'Hola, {v}' },
      remember: [P('El nombre del archivo es el nombre del módulo (sin ', { c: '.py' }, ').'), P('Ambos archivos deben estar en la misma carpeta.'), P({ c: '__name__' }, ' vale ', { c: '"__main__"' }, ' solo en el archivo que ejecutas.')],
      tip: 'No llames a tu archivo math.py o random.py: taparías los módulos de Python.',
      quiz: [
        { prompt: 'Si tu archivo se llama utiles.py, ¿cómo lo importas?', code: ['# misma carpeta'], options: ['import utiles', 'import utiles.py', 'from utiles.py', 'include utiles'], answer: 0, explain: 'Se importa con el nombre del archivo, sin la extensión .py.' },
        { prompt: '¿Cuándo se ejecuta el bloque if __name__ == "__main__":?', code: ['if __name__ == "__main__":', '    pruebas()'], options: ['Al ejecutar ese archivo directamente', 'Siempre', 'Al importarlo', 'Nunca'], answer: 0, explain: 'Solo cuando corres ese archivo, no cuando otro lo importa.' },
        { prompt: '¿Por qué separar el código en módulos?', code: ['# Elige la mejor razón'], options: ['Para ordenarlo y reutilizarlo', 'Para que sea más lento', 'Porque Python lo exige', 'Para ocultar errores'], answer: 0, explain: 'Los módulos ordenan tu proyecto y te dejan reutilizar funciones.' }
      ]
    },
    'python:Paquetes': {
      paras: [P('Un ', { b: 'paquete' }, ' es una carpeta que agrupa varios módulos. Antes llevaba un archivo ', { c: '__init__.py' }, ' (hoy es opcional, pero sigue siendo buena práctica).'),
              P('Importas sus módulos con puntos: ', { c: 'from tienda.precios import con_igv' }, '. Así organizas proyectos grandes por temas.')],
      example: { file: 'estructura del proyecto', norun: true, lines: ['# tienda/', '#   __init__.py', '#   precios.py   -> def con_igv(p): return p * 1.18', '#   stock.py', '# main.py', 'from tienda.precios import con_igv', 'print(round(con_igv(100), 2))'], output: ['118.0'] },
      tryit: { label: 'Pruébalo: elige un módulo del paquete', file: 'main.py', norun: true, choices: ['precios', 'stock', 'clientes'], lines: ['import tienda.{v}', 'print("Importé tienda.{v}")'], output: 'Importé tienda.{v}' },
      remember: [P('Paquete = carpeta; módulo = archivo.'), P('Se navega con puntos: ', { c: 'paquete.modulo' }, '.'), P({ c: '__init__.py' }, ' marca la carpeta como paquete.')],
      tip: 'Los paquetes que instalas con pip (como requests) son paquetes como estos, hechos por otras personas.',
      quiz: [
        { prompt: '¿Qué es un paquete en Python?', code: ['# Elige una'], options: ['Una carpeta con módulos', 'Un solo archivo', 'Una función', 'Una variable global'], answer: 0, explain: 'Un paquete agrupa varios módulos dentro de una carpeta.' },
        { prompt: '¿Cómo importas con_igv del módulo precios dentro del paquete tienda?', code: ['# tienda/precios.py'], options: ['from tienda.precios import con_igv', 'import con_igv from tienda', 'from precios.tienda import con_igv', 'import tienda/precios'], answer: 0, explain: 'Se escribe paquete.modulo y luego lo que importas.' },
        { prompt: '¿Qué archivo suele marcar una carpeta como paquete?', code: ['tienda/'], options: ['__init__.py', 'main.py', 'paquete.py', 'setup.txt'], answer: 0, explain: '__init__.py le dice a Python que la carpeta es un paquete.' }
      ]
    },
    'python:Mini proyecto: Tu propia librería': {
      paras: [P('Crearás ', { c: 'mates.py' }, ', una librería con funciones útiles: saber si un número es par, calcular el promedio y el factorial.'),
              P('Al final, el bloque ', { c: 'if __name__ == "__main__":' }, ' prueba que todo funcione. Luego podrás importarla desde cualquier programa.')],
      example: { file: 'mates.py', lines: ['def es_par(n):', '    return n % 2 == 0', '', 'def promedio(numeros):', '    return sum(numeros) / len(numeros)', '', 'def factorial(n):', '    resultado = 1', '    for i in range(2, n + 1):', '        resultado *= i', '    return resultado', '', 'if __name__ == "__main__":', '    print(es_par(10), es_par(7))', '    print(promedio([12, 15, 18]))', '    print(factorial(5))'], output: ['True False', '15.0', '120'] },
      tryit: { label: 'Pruébalo: elige un número para el factorial', file: 'prueba.py', choices: ['3', '4', '6'], lines: ['def factorial(n):', '    r = 1', '    for i in range(2, n + 1):', '        r *= i', '    return r', '', 'print(factorial({v}))'], outputs: { '3': '6', '4': '24', '6': '720' } },
      remember: [P('Una buena librería tiene funciones pequeñas con nombres claros.'), P('Prueba tus funciones en el bloque ', { c: '__main__' }, '.'), P('Desde otro archivo: ', { c: 'from mates import promedio' }, '.')],
      tip: 'Reto: agrega a mates.py una función es_primo(n) y pruébala.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['def es_par(n):', '    return n % 2 == 0', 'print(es_par(8))'], options: ['True', 'False', '0', '8'], answer: 0, explain: '8 % 2 es 0, así que la función devuelve True.' },
        { prompt: '¿Qué muestra este código?', code: ['print(sum([2, 4, 6]) / 3)'], options: ['4.0', '12', '4', '6.0'], answer: 0, explain: 'La suma es 12 y 12 / 3 = 4.0.' },
        { prompt: '¿Cuánto es el factorial de 4?', code: ['4! = 4 × 3 × 2 × 1'], options: ['10', '24', '16', '12'], answer: 1, explain: '4 × 3 × 2 × 1 = 24.' }
      ]
    },

    /* ===== Python · Módulo 6: Programación orientada a objetos ===== */
    'python:Clases y objetos': {
      paras: [P('Una ', { b: 'clase' }, ' es un molde y un ', { b: 'objeto' }, ' es algo creado con ese molde. La clase ', { c: 'Perro' }, ' describe a todos los perros; ', { c: 'firulais' }, ' es un perro concreto.'),
              P('Se crea la clase con ', { c: 'class' }, ' y el objeto llamando a la clase como si fuera una función: ', { c: 'Perro()' }, '.')],
      example: { file: 'clases.py', lines: ['class Perro:', '    def ladrar(self):', '        print("¡Guau!")', '', 'firulais = Perro()', 'boby = Perro()', 'firulais.ladrar()', 'boby.ladrar()', 'print(type(firulais).__name__)'], output: ['¡Guau!', '¡Guau!', 'Perro'] },
      tryit: { label: 'Pruébalo: elige un sonido', file: 'prueba.py', choices: ['Miau', 'Muu', 'Pío'], lines: ['class Animal:', '    def sonido(self):', '        print("{v}")', '', 'Animal().sonido()'], output: '{v}' },
      remember: [P('Los nombres de clases empiezan con mayúscula: ', { c: 'Perro' }, '.'), P('Creas un objeto con ', { c: 'Clase()' }, '.'), P('Puedes crear muchos objetos con la misma clase.')],
      tip: 'Piensa en la clase como el plano de una casa, y en los objetos como las casas construidas.',
      quiz: [
        { prompt: '¿Qué palabra crea una clase?', code: ['___ Gato:'], options: ['class', 'def', 'object', 'new'], answer: 0, explain: 'Las clases se definen con class.' },
        { prompt: '¿Cómo creas un objeto de la clase Gato?', code: ['class Gato:', '    pass'], options: ['michi = Gato()', 'michi = new Gato', 'michi = class Gato', 'Gato michi'], answer: 0, explain: 'Se llama a la clase con paréntesis: Gato().' },
        { prompt: '¿Qué relación hay entre clase y objeto?', code: ['# Elige una'], options: ['La clase es el molde; el objeto, lo creado con él', 'Son lo mismo', 'El objeto crea la clase', 'No se relacionan'], answer: 0, explain: 'La clase describe; los objetos son ejemplos concretos.' }
      ]
    },
    'python:Atributos y métodos': {
      paras: [P('Los ', { b: 'atributos' }, ' son los datos de un objeto (su color, su batería) y los ', { b: 'métodos' }, ' son las acciones que puede hacer (cargar, encender).'),
              P('Dentro de los métodos, ', { c: 'self' }, ' representa al propio objeto: ', { c: 'self.bateria' }, ' es la batería de ese celular.')],
      example: { file: 'celular.py', lines: ['class Celular:', '    marca = "Genérico"', '    bateria = 20', '', '    def cargar(self, cuanto):', '        self.bateria = min(100, self.bateria + cuanto)', '', 'mi_cel = Celular()', 'mi_cel.marca = "Zeta"', 'mi_cel.cargar(50)', 'print(mi_cel.marca, mi_cel.bateria)', 'mi_cel.cargar(50)', 'print(mi_cel.bateria)'], output: ['Zeta 70', '100'] },
      tryit: { label: 'Pruébalo: elige cuánto cargar', file: 'prueba.py', choices: ['10', '40', '90'], lines: ['class Celular:', '    bateria = 20', '    def cargar(self, cuanto):', '        self.bateria = min(100, self.bateria + cuanto)', '', 'c = Celular()', 'c.cargar({v})', 'print(c.bateria)'], outputs: { '10': '30', '40': '60', '90': '100' } },
      remember: [P('Atributo = dato; método = acción.'), P('Los métodos llevan ', { c: 'self' }, ' como primer parámetro.'), P('Accedes con punto: ', { c: 'objeto.atributo' }, ', ', { c: 'objeto.metodo()' }, '.')],
      tip: 'self no se escribe al llamar: c.cargar(10), no c.cargar(c, 10).',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['class Caja:', '    lleno = False', 'c = Caja()', 'c.lleno = True', 'print(c.lleno)'], options: ['True', 'False', 'lleno', 'Un error'], answer: 0, explain: 'Cambiamos el atributo de ese objeto a True.' },
        { prompt: '¿Qué representa self dentro de un método?', code: ['def cargar(self, cuanto):'], options: ['Al objeto que usa el método', 'A la clase entera', 'A Python', 'A un número'], answer: 0, explain: 'self es el propio objeto sobre el que trabaja el método.' },
        { prompt: 'En un objeto «auto», ¿qué sería un método?', code: ['# Elige una'], options: ['acelerar()', 'color', 'marca', 'año'], answer: 0, explain: 'Los métodos son acciones; color, marca y año son atributos.' }
      ]
    },
    'python:El constructor __init__': {
      paras: [P('El método ', { c: '__init__' }, ' es el ', { b: 'constructor' }, ': se ejecuta automáticamente al crear el objeto y sirve para darle sus valores iniciales.'),
              P('Los argumentos que pasas al crear el objeto llegan a ', { c: '__init__' }, ': ', { c: 'Alumno("Ana", 17)' }, '.')],
      example: { file: 'alumno.py', lines: ['class Alumno:', '    def __init__(self, nombre, nota):', '        self.nombre = nombre', '        self.nota = nota', '', '    def aprobo(self):', '        return self.nota >= 11', '', 'a = Alumno("Ana", 17)', 'b = Alumno("Luis", 9)', 'print(a.nombre, a.aprobo())', 'print(b.nombre, b.aprobo())'], output: ['Ana True', 'Luis False'] },
      tryit: { label: 'Pruébalo: elige la nota', file: 'prueba.py', choices: ['8', '11', '20'], lines: ['class Alumno:', '    def __init__(self, nombre, nota):', '        self.nombre = nombre', '        self.nota = nota', '', 'a = Alumno("Sofía", {v})', 'print(a.nombre, "aprobó:", a.nota >= 11)'], outputs: { '8': 'Sofía aprobó: False', '11': 'Sofía aprobó: True', '20': 'Sofía aprobó: True' } },
      remember: [P({ c: '__init__' }, ' lleva dos guiones bajos a cada lado.'), P('Guarda los datos en ', { c: 'self.algo' }, ' para usarlos en otros métodos.'), P('Se ejecuta solo al crear el objeto.')],
      tip: 'Agrega un método __str__ para decidir cómo se ve tu objeto con print().',
      quiz: [
        { prompt: '¿Cuándo se ejecuta __init__?', code: ['p = Producto("pan", 0.5)'], options: ['Al crear el objeto', 'Al borrar el objeto', 'Al llamar print', 'Nunca solo'], answer: 0, explain: 'El constructor se ejecuta automáticamente al crear el objeto.' },
        { prompt: '¿Qué muestra este código?', code: ['class P:', '    def __init__(self, x):', '        self.x = x * 2', 'print(P(5).x)'], options: ['5', '10', 'x', 'Un error'], answer: 1, explain: 'El constructor guarda x * 2, es decir 10.' },
        { prompt: '¿Cómo se escribe el constructor?', code: ['# Elige uno'], options: ['def __init__(self):', 'def init(self):', 'def _init_(self):', 'def constructor():'], answer: 0, explain: 'Son dos guiones bajos antes y después: __init__.' }
      ]
    },
    'python:Herencia': {
      paras: [P('Con la ', { b: 'herencia' }, ' una clase hija recibe todo lo de una clase padre y puede agregar o cambiar cosas: ', { c: 'class Gato(Animal):' }, '.'),
              P('Si la hija redefine un método, usa su propia versión. Con ', { c: 'super()' }, ' llamas al método del padre.')],
      example: { file: 'herencia.py', lines: ['class Animal:', '    def __init__(self, nombre):', '        self.nombre = nombre', '    def presentarse(self):', '        print("Soy", self.nombre)', '', 'class Gato(Animal):', '    def presentarse(self):', '        super().presentarse()', '        print("y digo miau")', '', 'Animal("Tortuga").presentarse()', 'Gato("Michi").presentarse()'], output: ['Soy Tortuga', 'Soy Michi', 'y digo miau'] },
      tryit: { label: 'Pruébalo: elige el animal', file: 'prueba.py', choices: ['Perro', 'Pato', 'Vaca'], lines: ['class Animal:', '    def sonido(self):', '        return "..."', 'class Perro(Animal):', '    def sonido(self):', '        return "Guau"', 'class Pato(Animal):', '    def sonido(self):', '        return "Cuac"', 'class Vaca(Animal):', '    pass', '', 'print({v}().sonido())'], outputs: { 'Perro': 'Guau', 'Pato': 'Cuac', 'Vaca': '...' } },
      remember: [P('La clase padre va entre paréntesis: ', { c: 'class Hija(Padre):' }, '.'), P('La hija hereda atributos y métodos.'), P({ c: 'super()' }, ' llama al método del padre.')],
      tip: 'Usa herencia cuando puedas decir «un Gato ES UN Animal».',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['class A:', '    def hola(self):', '        return "A"', 'class B(A):', '    pass', 'print(B().hola())'], options: ['A', 'B', 'None', 'Un error'], answer: 0, explain: 'B no define hola, así que usa el de su padre A.' },
        { prompt: '¿Qué muestra este código?', code: ['class A:', '    def hola(self):', '        return "A"', 'class B(A):', '    def hola(self):', '        return "B"', 'print(B().hola())'], options: ['A', 'B', 'AB', 'Un error'], answer: 1, explain: 'B redefine hola, así que se usa su propia versión.' },
        { prompt: '¿Para qué sirve super()?', code: ['super().presentarse()'], options: ['Para llamar al método del padre', 'Para crear una clase', 'Para borrar al padre', 'Para salir del método'], answer: 0, explain: 'super() da acceso a los métodos de la clase padre.' }
      ]
    },
    'python:Encapsulamiento': {
      paras: [P('El ', { b: 'encapsulamiento' }, ' protege los datos de un objeto: en vez de cambiarlos directamente, usas métodos que revisan que todo esté bien.'),
              P('En Python, un atributo que empieza con guion bajo (', { c: '_saldo' }, ') indica «uso interno». Con dos guiones (', { c: '__pin' }, ') Python lo oculta aún más.')],
      example: { file: 'cuenta.py', lines: ['class Cuenta:', '    def __init__(self, saldo):', '        self._saldo = saldo', '', '    def retirar(self, monto):', '        if monto > self._saldo:', '            print("Saldo insuficiente")', '        else:', '            self._saldo -= monto', '', '    def ver_saldo(self):', '        return self._saldo', '', 'c = Cuenta(100)', 'c.retirar(150)', 'c.retirar(30)', 'print(c.ver_saldo())'], output: ['Saldo insuficiente', '70'] },
      tryit: { label: 'Pruébalo: elige cuánto retirar', file: 'prueba.py', choices: ['20', '80', '120'], lines: ['class Cuenta:', '    def __init__(self):', '        self._saldo = 100', '    def retirar(self, m):', '        if m > self._saldo:', '            return "Saldo insuficiente"', '        self._saldo -= m', '        return "Te quedan " + str(self._saldo)', '', 'print(Cuenta().retirar({v}))'], outputs: { '20': 'Te quedan 80', '80': 'Te quedan 20', '120': 'Saldo insuficiente' } },
      remember: [P('Cambia los datos con métodos, no a mano.'), P({ c: '_dato' }, ': «no lo toques desde fuera».'), P('Los métodos pueden validar antes de cambiar algo.')],
      tip: 'El decorador @property te deja leer un atributo protegido como si fuera normal: c.saldo.',
      quiz: [
        { prompt: '¿Qué indica un atributo como _saldo?', code: ['self._saldo = 100'], options: ['Que es de uso interno', 'Que es un error', 'Que es un número', 'Que es público'], answer: 0, explain: 'El guion bajo es una convención: no lo uses desde fuera de la clase.' },
        { prompt: '¿Por qué usar un método retirar() en vez de cambiar el saldo directamente?', code: ['c.retirar(50)'], options: ['Para validar que haya saldo', 'Porque es más corto', 'Porque Python no deja restar', 'No hay razón'], answer: 0, explain: 'El método puede revisar las reglas antes de cambiar el dato.' },
        { prompt: '¿Qué muestra este código?', code: ['class C:', '    def __init__(self):', '        self._n = 1', '    def subir(self):', '        self._n += 1', 'c = C()', 'c.subir()', 'c.subir()', 'print(c._n)'], options: ['1', '2', '3', 'Un error'], answer: 2, explain: 'Empieza en 1 y sube dos veces: 3.' }
      ]
    },
    'python:Polimorfismo': {
      paras: [P('El ', { b: 'polimorfismo' }, ' permite que objetos de clases distintas respondan al ', { b: 'mismo método' }, ' cada uno a su manera.'),
              P('Así puedes recorrer una lista de figuras y pedirles a todas su ', { c: 'area()' }, ' sin preguntar de qué tipo es cada una.')],
      example: { file: 'figuras.py', lines: ['class Cuadrado:', '    def __init__(self, lado):', '        self.lado = lado', '    def area(self):', '        return self.lado ** 2', '', 'class Rectangulo:', '    def __init__(self, b, h):', '        self.b, self.h = b, h', '    def area(self):', '        return self.b * self.h', '', 'figuras = [Cuadrado(3), Rectangulo(2, 5)]', 'for f in figuras:', '    print(type(f).__name__, f.area())'], output: ['Cuadrado 9', 'Rectangulo 10'] },
      tryit: { label: 'Pruébalo: elige el instrumento', file: 'prueba.py', choices: ['Guitarra', 'Tambor', 'Flauta'], lines: ['class Guitarra:', '    def tocar(self): return "tin tin"', 'class Tambor:', '    def tocar(self): return "pum pum"', 'class Flauta:', '    def tocar(self): return "fiu fiu"', '', 'print({v}().tocar())'], outputs: { 'Guitarra': 'tin tin', 'Tambor': 'pum pum', 'Flauta': 'fiu fiu' } },
      remember: [P('Mismo nombre de método, comportamiento distinto.'), P('Simplifica el código: un solo bucle para todos.'), P('Funciona muy bien junto con la herencia.')],
      tip: 'len() es polimórfica: funciona con textos, listas y diccionarios.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print(len("hola"), len([1, 2]))'], options: ['4 2', '2 4', '6', 'Un error'], answer: 0, explain: 'len funciona con distintos tipos: 4 letras y 2 elementos.' },
        { prompt: '¿Qué es el polimorfismo?', code: ['# Elige una'], options: ['Objetos distintos que responden al mismo método', 'Una clase con muchos atributos', 'Un tipo de bucle', 'Copiar una clase'], answer: 0, explain: 'Cada clase implementa el mismo método a su manera.' },
        { prompt: '¿Qué muestra este código?', code: ['class A:', '    def x(self): return 1', 'class B:', '    def x(self): return 2', 'print(sum(o.x() for o in [A(), B(), B()]))'], options: ['5', '3', '4', 'Un error'], answer: 0, explain: '1 + 2 + 2 = 5: cada objeto responde con su versión de x().' }
      ]
    },
    'python:Mini proyecto: Mascota virtual': {
      paras: [P('Vas a crear una ', { b: 'mascota virtual' }, ' con una clase: tiene nombre, hambre y energía, y métodos para comer, jugar y ver su estado.'),
              P('Los métodos cambian los atributos con reglas: jugar cansa y da hambre; comer quita el hambre. ¡Cuida que no llegue a 0 de energía!')],
      example: { file: 'mascota.py', lines: ['class Mascota:', '    def __init__(self, nombre):', '        self.nombre = nombre', '        self.hambre = 5', '        self.energia = 5', '', '    def comer(self):', '        self.hambre = max(0, self.hambre - 3)', '', '    def jugar(self):', '        self.energia -= 2', '        self.hambre += 1', '', '    def estado(self):', '        print(self.nombre, "| hambre:", self.hambre, "| energía:", self.energia)', '', 'p = Mascota("Pelusa")', 'p.jugar()', 'p.comer()', 'p.estado()'], output: ['Pelusa | hambre: 3 | energía: 3'] },
      tryit: { label: 'Pruébalo: elige qué hace tu mascota', file: 'prueba.py', choices: ['comer', 'jugar', 'estado'], lines: ['class Mascota:', '    def __init__(self):', '        self.hambre, self.energia = 5, 5', '    def comer(self):', '        self.hambre = max(0, self.hambre - 3)', '    def jugar(self):', '        self.energia -= 2', '        self.hambre += 1', '    def estado(self):', '        pass', '', 'm = Mascota()', 'm.{v}()', 'print("hambre", m.hambre, "energía", m.energia)'], outputs: { 'comer': 'hambre 2 energía 5', 'jugar': 'hambre 6 energía 3', 'estado': 'hambre 5 energía 5' } },
      remember: [P('Los atributos guardan el estado de la mascota.'), P('Los métodos cambian el estado con reglas.'), P({ c: 'max(0, x)' }, ' evita valores negativos.')],
      tip: 'Reto: agrega un método dormir() que suba la energía, y un aviso cuando el hambre pase de 8.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['print(max(0, 2 - 3))'], options: ['-1', '0', '2', '3'], answer: 1, explain: 'max elige el mayor entre 0 y -1: 0.' },
        { prompt: 'Si la energía es 5 y juega dos veces, ¿cuánta energía queda?', code: ['def jugar(self):', '    self.energia -= 2'], options: ['1', '3', '5', '-1'], answer: 0, explain: '5 - 2 - 2 = 1.' },
        { prompt: '¿Qué parte guarda el «estado» de la mascota?', code: ['self.hambre', 'self.energia'], options: ['Los atributos', 'Los métodos', 'La clase padre', 'El print'], answer: 0, explain: 'Los atributos guardan los datos; los métodos los cambian.' }
      ]
    },
    /* ===== Python · Módulo 7: Temas avanzados ===== */
    'python:Excepciones con try y except': {
      paras: [P('Cuando algo sale mal (dividir entre cero, convertir "hola" a número), Python lanza una ', { b: 'excepción' }, ' y el programa se detiene.'),
              P('Con ', { c: 'try' }, ' intentas algo arriesgado y con ', { c: 'except' }, ' decides qué hacer si falla, sin que el programa se caiga. ', { c: 'finally' }, ' se ejecuta siempre.')],
      example: { file: 'errores.py', lines: ['datos = ["10", "hola", "0"]', 'for d in datos:', '    try:', '        n = int(d)', '        print(100 / n)', '    except ValueError:', '        print(d, "no es un número")', '    except ZeroDivisionError:', '        print("No se puede dividir entre cero")'], output: ['10.0', 'hola no es un número', 'No se puede dividir entre cero'] },
      tryit: { label: 'Pruébalo: elige qué escribe el usuario', file: 'prueba.py', choices: ['25', 'veinte', '4.5'], lines: ['texto = "{v}"', 'try:', '    print("Doble:", int(texto) * 2)', 'except ValueError:', '    print("Eso no es un número entero")'], outputs: { '25': 'Doble: 50', 'veinte': 'Eso no es un número entero', '4.5': 'Eso no es un número entero' } },
      remember: [P('Pon en ', { c: 'try' }, ' solo el código que puede fallar.'), P('Atrapa errores concretos: ', { c: 'except ValueError:' }, '.'), P({ c: 'finally' }, ' se ejecuta pase lo que pase.')],
      tip: 'Lee el nombre del error en la consola: ValueError, TypeError, ZeroDivisionError… te dice qué pasó.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['try:', '    print(5 / 0)', 'except ZeroDivisionError:', '    print("Error")'], options: ['Error', '0', 'inf', 'El programa se cae'], answer: 0, explain: 'Dividir entre cero lanza ZeroDivisionError y el except lo atrapa.' },
        { prompt: '¿Qué error da int("abc")?', code: ['int("abc")'], options: ['ValueError', 'TypeError', 'ZeroDivisionError', 'NameError'], answer: 0, explain: 'El texto no representa un número: ValueError.' },
        { prompt: '¿Qué muestra este código?', code: ['try:', '    x = int("7")', 'except ValueError:', '    x = 0', 'finally:', '    print("listo")', 'print(x)'], options: ['listo y luego 7', '7', '0', 'listo y luego 0'], answer: 0, out: 'listo\n7', explain: 'No hay error, así que x = 7; finally siempre muestra «listo».' }
      ]
    },
    'python:Leer y escribir archivos': {
      paras: [P('Con ', { c: 'open()' }, ' abres un archivo. El modo ', { c: '"w"' }, ' escribe (borra lo anterior), ', { c: '"a"' }, ' agrega al final y ', { c: '"r"' }, ' lee.'),
              P('Usa ', { c: 'with' }, ': cierra el archivo solo cuando terminas, aunque haya un error. Indica ', { c: 'encoding="utf-8"' }, ' para que las tildes se guarden bien.')],
      example: { file: 'archivos.py', lines: ['with open("notas.txt", "w", encoding="utf-8") as f:', '    f.write("Matemática: 17\\n")', '    f.write("Historia: 15\\n")', '', 'with open("notas.txt", "a", encoding="utf-8") as f:', '    f.write("Inglés: 18\\n")', '', 'with open("notas.txt", encoding="utf-8") as f:', '    for linea in f:', '        print(linea.strip())'], output: ['Matemática: 17', 'Historia: 15', 'Inglés: 18'] },
      tryit: { label: 'Pruébalo: elige el modo de apertura', file: 'prueba.py', choices: ['w', 'a'], lines: ['with open("lista.txt", "w") as f:', '    f.write("pan\\n")', 'with open("lista.txt", "{v}") as f:', '    f.write("leche\\n")', 'print(open("lista.txt").read().split())'], outputs: { 'w': "['leche']", 'a': "['pan', 'leche']" } },
      remember: [P({ c: '"w"' }, ' sobrescribe; ', { c: '"a"' }, ' agrega; ', { c: '"r"' }, ' lee.'), P({ c: 'with open(...) as f:' }, ' cierra el archivo por ti.'), P({ c: 'linea.strip()' }, ' quita el salto de línea del final.')],
      tip: 'Para datos con columnas, el módulo csv lee y escribe archivos que abre Excel.',
      quiz: [
        { prompt: '¿Qué modo agrega texto al final sin borrar?', code: ['open("log.txt", ___)'], options: ['"a"', '"w"', '"r"', '"x"'], answer: 0, explain: '"a" (append) agrega al final del archivo.' },
        { prompt: '¿Qué ventaja tiene with open(...)?', code: ['with open("datos.txt") as f:'], options: ['Cierra el archivo automáticamente', 'Lo hace más rápido', 'Lo borra al final', 'Lo cifra'], answer: 0, explain: 'with se encarga de cerrar el archivo al terminar el bloque.' },
        { prompt: '¿Qué pasa al abrir con "w" un archivo que ya tiene texto?', code: ['open("notas.txt", "w")'], options: ['Se borra su contenido', 'Se agrega al final', 'Da un error', 'Solo se lee'], answer: 0, explain: '"w" empieza el archivo desde cero.' }
      ]
    },
    'python:Iteradores': {
      paras: [P('Un ', { b: 'iterador' }, ' entrega los elementos de una colección ', { b: 'uno por uno' }, '. Es lo que usa ', { c: 'for' }, ' por dentro.'),
              P('Con ', { c: 'iter()' }, ' obtienes el iterador y con ', { c: 'next()' }, ' pides el siguiente. Cuando no quedan más, aparece ', { c: 'StopIteration' }, '.')],
      example: { file: 'iteradores.py', lines: ['colores = ["rojo", "verde", "azul"]', 'it = iter(colores)', 'print(next(it))', 'print(next(it))', 'print(next(it))', 'print(next(it, "no quedan más"))'], output: ['rojo', 'verde', 'azul', 'no quedan más'] },
      tryit: { label: 'Pruébalo: elige cuántas veces llamar a next', file: 'prueba.py', choices: ['1', '2', '3'], lines: ['it = iter("sol")', 'for _ in range({v}):', '    print(next(it))'], outputs: { '1': 's', '2': 's\no', '3': 's\no\nl' } },
      remember: [P({ c: 'iter(x)' }, ' crea el iterador.'), P({ c: 'next(it)' }, ' da el siguiente elemento.'), P({ c: 'next(it, valor)' }, ' evita el error al final.')],
      tip: 'zip() y enumerate() también devuelven iteradores: se recorren una sola vez.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['it = iter([7, 8, 9])', 'next(it)', 'print(next(it))'], options: ['7', '8', '9', 'Un error'], answer: 1, explain: 'El primer next da 7 (sin mostrarlo) y el segundo da 8.' },
        { prompt: '¿Qué error aparece cuando ya no quedan elementos?', code: ['next(it)'], options: ['StopIteration', 'IndexError', 'ValueError', 'EndError'], answer: 0, explain: 'next lanza StopIteration cuando el iterador se agotó.' },
        { prompt: '¿Qué muestra este código?', code: ['for a, b in zip([1, 2], ["x", "y"]):', '    print(a, b)'], options: ['1 x / 2 y (en líneas)', '1 2 x y', '(1, 2)', 'Un error'], answer: 0, out: '1 x\n2 y', explain: 'zip junta los elementos de ambas listas en pares.' }
      ]
    },
    'python:Generadores': {
      paras: [P('Un ', { b: 'generador' }, ' es una función que usa ', { c: 'yield' }, ' en vez de ', { c: 'return' }, '. Entrega un valor, se pausa, y continúa desde ahí la próxima vez.'),
              P('Como produce los valores ', { b: 'a medida que se piden' }, ', ahorra memoria: puedes recorrer millones de números sin guardarlos todos.')],
      example: { file: 'generadores.py', lines: ['def cuenta_regresiva(n):', '    while n > 0:', '        yield n', '        n -= 1', '', 'for x in cuenta_regresiva(3):', '    print(x)', 'pares = (n for n in range(10) if n % 2 == 0)', 'print(sum(pares))'], output: ['3', '2', '1', '20'] },
      tryit: { label: 'Pruébalo: elige hasta dónde generar cuadrados', file: 'prueba.py', choices: ['3', '4', '5'], lines: ['def cuadrados(n):', '    for i in range(1, n + 1):', '        yield i * i', '', 'print(list(cuadrados({v})))'], outputs: { '3': '[1, 4, 9]', '4': '[1, 4, 9, 16]', '5': '[1, 4, 9, 16, 25]' } },
      remember: [P({ c: 'yield' }, ' entrega un valor y pausa la función.'), P('Se recorre con ', { c: 'for' }, ' o se convierte con ', { c: 'list()' }, '.'), P({ c: '(x for x in ...)' }, ' es un generador en una línea.')],
      tip: 'Un generador solo se puede recorrer una vez. Si lo necesitas de nuevo, vuelve a crearlo.',
      quiz: [
        { prompt: '¿Qué palabra convierte una función en generador?', code: ['def f():', '    ___ 1'], options: ['yield', 'return', 'gen', 'next'], answer: 0, explain: 'yield hace que la función entregue valores uno por uno.' },
        { prompt: '¿Qué muestra este código?', code: ['def f():', '    yield 1', '    yield 2', 'print(list(f()))'], options: ['[1, 2]', '1', '2', '[2]'], answer: 0, explain: 'list() recoge todos los valores que entrega el generador.' },
        { prompt: '¿Qué ventaja tienen los generadores?', code: ['# Elige una'], options: ['Ahorran memoria', 'Son más bonitos', 'Evitan errores siempre', 'Se recorren infinitas veces'], answer: 0, explain: 'Producen cada valor cuando se necesita, sin guardarlos todos.' }
      ]
    },
    'python:Decoradores': {
      paras: [P('Un ', { b: 'decorador' }, ' es una función que ', { b: 'envuelve' }, ' a otra para agregarle algo, sin cambiar su código. Se aplica con ', { c: '@' }, ' encima de la función.'),
              P('Se usan para medir tiempos, revisar permisos o registrar lo que pasa. Frameworks como Flask los usan para definir páginas.')],
      example: { file: 'decoradores.py', lines: ['def anunciar(funcion):', '    def envoltura():', '        print(">> Empieza", funcion.__name__)', '        funcion()', '        print(">> Termina")', '    return envoltura', '', '@anunciar', 'def saludar():', '    print("¡Hola!")', '', 'saludar()'], output: ['>> Empieza saludar', '¡Hola!', '>> Termina'] },
      tryit: { label: 'Pruébalo: elige cuántas veces repetir', file: 'prueba.py', choices: ['1', '2', '3'], lines: ['def repetir(funcion):', '    def envoltura():', '        for _ in range({v}):', '            funcion()', '    return envoltura', '', '@repetir', 'def hola():', '    print("hola")', '', 'hola()'], outputs: { '1': 'hola', '2': 'hola\nhola', '3': 'hola\nhola\nhola' } },
      remember: [P('Un decorador recibe una función y devuelve otra.'), P({ c: '@decorador' }, ' va justo encima del ', { c: 'def' }, '.'), P('La función original sigue igual: solo se envuelve.')],
      tip: '@decorador encima de f es lo mismo que escribir f = decorador(f).',
      quiz: [
        { prompt: '¿Qué símbolo aplica un decorador?', code: ['___mi_decorador', 'def f(): ...'], options: ['@', '#', '$', '&'], answer: 0, explain: 'El decorador se escribe con @ encima de la función.' },
        { prompt: '¿Qué muestra este código?', code: ['def mayus(f):', '    def env():', '        return f().upper()', '    return env', '@mayus', 'def saludo():', '    return "hola"', 'print(saludo())'], options: ['HOLA', 'hola', 'Hola', 'Un error'], answer: 0, explain: 'El decorador convierte en mayúsculas lo que devuelve la función.' },
        { prompt: '¿Qué recibe un decorador?', code: ['def decorador(___):'], options: ['Una función', 'Un número', 'Una lista', 'Un archivo'], answer: 0, explain: 'Un decorador recibe la función que va a envolver.' }
      ]
    },
    'python:Expresiones regulares': {
      paras: [P('Las ', { b: 'expresiones regulares' }, ' son patrones para buscar texto. Con el módulo ', { c: 're' }, ' puedes encontrar números, correos o validar formatos.'),
              P({ c: '\\d' }, ' significa «un dígito», ', { c: '+' }, ' «uno o más» y ', { c: '\\w' }, ' «letra, número o guion bajo». Escribe los patrones como ', { c: 'r"..."' }, '.')],
      example: { file: 'regex.py', lines: ['import re', 'texto = "Pedí 3 mangos y 12 fresas por 20 soles"', 'print(re.findall(r"\\d+", texto))', 'correo = "ana@agbyte.pe"', 'print(bool(re.fullmatch(r"[\\w.]+@[\\w.]+\\.\\w+", correo)))', 'print(re.sub(r"\\d", "#", "Tel: 987"))'], output: ["['3', '12', '20']", 'True', 'Tel: ###'] },
      tryit: { label: 'Pruébalo: elige un texto y busca los números', file: 'prueba.py', choices: ['Tengo 2 gatos', 'Año 2026', 'Sin números'], lines: ['import re', 'print(re.findall(r"\\d+", "{v}"))'], outputs: { 'Tengo 2 gatos': "['2']", 'Año 2026': "['2026']", 'Sin números': '[]' } },
      remember: [P({ c: 're.findall()' }, ' devuelve todas las coincidencias.'), P({ c: 're.fullmatch()' }, ' valida que todo el texto cumpla el patrón.'), P({ c: 're.sub()' }, ' reemplaza lo que coincide.')],
      tip: 'Prueba tus patrones de a poco: empieza simple y agrega piezas.',
      quiz: [
        { prompt: '¿Qué significa \\d en una expresión regular?', code: ['r"\\d"'], options: ['Un dígito', 'Una letra', 'Un espacio', 'Cualquier cosa'], answer: 0, explain: '\\d coincide con un dígito del 0 al 9.' },
        { prompt: '¿Qué muestra este código?', code: ['import re', 'print(re.findall(r"\\d+", "a1b22c333"))'], options: ["['1', '22', '333']", "['1', '2', '2', '3', '3', '3']", '[1, 22, 333]', "['a', 'b', 'c']"], answer: 0, explain: '\\d+ toma grupos de uno o más dígitos seguidos.' },
        { prompt: '¿Qué función reemplaza texto con un patrón?', code: ['import re'], options: ['re.sub', 're.find', 're.replace', 're.change'], answer: 0, explain: 're.sub(patrón, reemplazo, texto) sustituye las coincidencias.' }
      ]
    },

    /* ===== Python · Módulo 8: Herramientas ===== */
    'python:pip y paquetes': {
      paras: [P({ c: 'pip' }, ' es el instalador de paquetes de Python. Con él descargas librerías hechas por la comunidad desde PyPI, como ', { c: 'requests' }, ' o ', { c: 'pandas' }, '.'),
              P('Se usa en la terminal (en Windows: «Símbolo del sistema» o PowerShell), no dentro de tu programa.')],
      example: { file: 'terminal', norun: true, lines: ['py -m pip install requests', 'py -m pip list', 'py -m pip install --upgrade requests', 'py -m pip uninstall requests'], output: ['Successfully installed requests-2.32.3', 'Package    Version', 'requests   2.32.3', '…'] },
      tryit: { label: 'Pruébalo: elige un paquete para instalar', file: 'terminal', norun: true, choices: ['requests', 'pandas', 'flask'], lines: ['py -m pip install {v}'], output: 'Successfully installed {v}' },
      remember: [P('En Windows usa ', { c: 'py -m pip install paquete' }, '.'), P({ c: 'pip list' }, ' muestra lo instalado.'), P('Busca paquetes en pypi.org.')],
      tip: 'Guarda la lista de paquetes de tu proyecto con: py -m pip freeze > requirements.txt',
      quiz: [
        { prompt: '¿Para qué sirve pip?', code: ['pip install requests'], options: ['Para instalar paquetes', 'Para ejecutar programas', 'Para crear clases', 'Para borrar Python'], answer: 0, explain: 'pip descarga e instala librerías de PyPI.' },
        { prompt: '¿Dónde se escribe pip install?', code: ['# Elige una'], options: ['En la terminal', 'Dentro de un print', 'En un archivo .txt', 'En el navegador'], answer: 0, explain: 'pip es un programa de terminal.' },
        { prompt: '¿Qué comando muestra los paquetes instalados?', code: ['py -m pip ___'], options: ['list', 'show-all', 'packages', 'ls'], answer: 0, explain: 'pip list muestra los paquetes y sus versiones.' }
      ]
    },
    'python:Entornos virtuales': {
      paras: [P('Un ', { b: 'entorno virtual' }, ' es una carpeta con su propio Python y sus propios paquetes. Así cada proyecto tiene sus versiones sin mezclarse con otros.'),
              P('Se crea con ', { c: 'py -m venv .venv' }, ' y se activa antes de instalar paquetes. Cuando termines, ', { c: 'deactivate' }, ' lo apaga.')],
      example: { file: 'terminal', norun: true, lines: ['py -m venv .venv', '.venv\\Scripts\\activate', '(.venv) py -m pip install requests', '(.venv) py -m pip freeze > requirements.txt', '(.venv) deactivate'], output: ['(.venv) aparece al inicio: el entorno está activo', 'requests queda instalado solo en este proyecto'] },
      tryit: { label: 'Pruébalo: elige tu sistema', file: 'terminal', norun: true, choices: ['Windows', 'Mac', 'Linux'], lines: ['# Activar el entorno en {v}'], outputs: { 'Windows': '.venv\\Scripts\\activate', 'Mac': 'source .venv/bin/activate', 'Linux': 'source .venv/bin/activate' } },
      remember: [P('Un entorno por proyecto.'), P('Actívalo antes de instalar paquetes.'), P({ c: 'requirements.txt' }, ' guarda la lista para reinstalar luego.')],
      tip: 'No subas la carpeta .venv a Git: con requirements.txt cualquiera puede recrearla.',
      quiz: [
        { prompt: '¿Qué comando crea un entorno virtual?', code: ['# en la carpeta del proyecto'], options: ['py -m venv .venv', 'pip venv', 'python new env', 'venv create'], answer: 0, explain: 'El módulo venv crea el entorno en la carpeta indicada.' },
        { prompt: '¿Para qué sirve un entorno virtual?', code: ['# Elige una'], options: ['Separar los paquetes de cada proyecto', 'Hacer Python más rápido', 'Crear juegos', 'Navegar por internet'], answer: 0, explain: 'Cada proyecto tiene sus propios paquetes y versiones.' },
        { prompt: '¿Qué hace pip freeze > requirements.txt?', code: ['pip freeze > requirements.txt'], options: ['Guarda la lista de paquetes', 'Congela Python', 'Borra paquetes', 'Instala todo'], answer: 0, explain: 'Escribe en un archivo los paquetes instalados y sus versiones.' }
      ]
    },
    'python:Git básico': {
      paras: [P({ b: 'Git' }, ' guarda el historial de tu código: cada ', { b: 'commit' }, ' es una foto de tu proyecto a la que puedes volver.'),
              P('El ciclo diario es: cambias archivos, los preparas con ', { c: 'git add' }, ', los guardas con ', { c: 'git commit -m "mensaje"' }, ' y los subes a GitHub con ', { c: 'git push' }, '.')],
      example: { file: 'terminal', norun: true, lines: ['git init', 'git add main.py', 'git commit -m "Primera versión de la calculadora"', 'git status', 'git log --oneline'], output: ['Initialized empty Git repository', '[main a1b2c3d] Primera versión de la calculadora', 'nothing to commit, working tree clean', 'a1b2c3d Primera versión de la calculadora'] },
      tryit: { label: 'Pruébalo: elige un comando', file: 'terminal', norun: true, choices: ['git status', 'git log --oneline', 'git diff'], lines: ['{v}'], outputs: { 'git status': 'Muestra qué archivos cambiaron', 'git log --oneline': 'Muestra la lista de commits', 'git diff': 'Muestra las líneas que cambiaste' } },
      remember: [P({ c: 'git add' }, ' prepara; ', { c: 'git commit' }, ' guarda.'), P('Escribe mensajes claros: qué cambiaste y por qué.'), P({ c: 'git status' }, ' es tu mejor amigo.')],
      tip: 'Haz commits pequeños y seguidos: es más fácil volver atrás si algo se rompe.',
      quiz: [
        { prompt: '¿Qué guarda un commit?', code: ['git commit -m "..."'], options: ['Una foto del proyecto en ese momento', 'Un solo archivo para siempre', 'Una contraseña', 'Un paquete de pip'], answer: 0, explain: 'Cada commit guarda el estado del proyecto para poder volver a él.' },
        { prompt: '¿Qué comando prepara archivos antes del commit?', code: ['git ___ main.py'], options: ['add', 'push', 'init', 'log'], answer: 0, explain: 'git add pone los cambios en el área de preparación.' },
        { prompt: '¿Qué hace git push?', code: ['git push'], options: ['Sube tus commits a un servidor como GitHub', 'Borra el repositorio', 'Crea un commit', 'Descarga Python'], answer: 0, explain: 'push envía tus commits al repositorio remoto.' }
      ]
    },
    'python:Pruebas con pytest': {
      paras: [P('Las ', { b: 'pruebas automáticas' }, ' comprueban que tu código hace lo que debe. Con ', { c: 'assert' }, ' afirmas algo; si no se cumple, la prueba falla.'),
              P({ c: 'pytest' }, ' busca funciones que empiezan con ', { c: 'test_' }, ' y las ejecuta todas con un solo comando: ', { c: 'py -m pytest' }, '. Abajo las llamamos a mano para ver la idea.')],
      example: { file: 'test_mates.py', lines: ['def promedio(numeros):', '    return sum(numeros) / len(numeros)', '', 'def test_promedio():', '    assert promedio([10, 20]) == 15', '', 'def test_un_solo_numero():', '    assert promedio([7]) == 7', '', 'test_promedio()', 'test_un_solo_numero()', 'print("2 pruebas pasaron")'], output: ['2 pruebas pasaron'] },
      tryit: { label: 'Pruébalo: elige el resultado esperado', file: 'prueba.py', choices: ['15', '16'], lines: ['def promedio(n):', '    return sum(n) / len(n)', 'try:', '    assert promedio([10, 20]) == {v}', '    print("La prueba pasó")', 'except AssertionError:', '    print("La prueba falló")'], outputs: { '15': 'La prueba pasó', '16': 'La prueba falló' } },
      remember: [P('Las funciones de prueba empiezan con ', { c: 'test_' }, '.'), P({ c: 'assert condición' }, ' falla si la condición es falsa.'), P('Ejecuta todas con ', { c: 'py -m pytest' }, '.')],
      tip: 'Escribe una prueba cada vez que encuentres un error: así no vuelve a aparecer.',
      quiz: [
        { prompt: '¿Qué hace assert 2 + 2 == 5?', code: ['assert 2 + 2 == 5'], options: ['Lanza un error (la prueba falla)', 'Muestra 4', 'No hace nada', 'Cambia 2 + 2 a 5'], answer: 0, explain: 'La condición es falsa, así que assert lanza AssertionError.' },
        { prompt: '¿Cómo debe llamarse una función para que pytest la ejecute?', code: ['def ___():'], options: ['test_suma', 'suma_prueba', 'prueba', 'check'], answer: 0, explain: 'pytest busca funciones que empiecen con test_.' },
        { prompt: '¿Qué comando ejecuta las pruebas?', code: ['# en la terminal'], options: ['py -m pytest', 'py test.txt', 'pip test', 'git test'], answer: 0, explain: 'py -m pytest busca y ejecuta todas tus pruebas.' }
      ]
    },
    'python:Consumir una API': {
      paras: [P('Una ', { b: 'API' }, ' es un servicio en internet que responde con datos, casi siempre en formato ', { b: 'JSON' }, ' (parecido a un diccionario de Python).'),
              P('Con el paquete ', { c: 'requests' }, ' haces la consulta: ', { c: 'requests.get(url).json()' }, '. Aquí practicamos con una respuesta ya descargada usando el módulo ', { c: 'json' }, '.')],
      example: { file: 'clima.py', lines: ['import json', 'respuesta = \'{"ciudad": "Lima", "temp": 19.5, "dias": ["lun", "mar"]}\'', '# Con internet sería: datos = requests.get(url).json()', 'datos = json.loads(respuesta)', 'print(datos["ciudad"], datos["temp"], "°C")', 'print(len(datos["dias"]), "días de pronóstico")'], output: ['Lima 19.5 °C', '2 días de pronóstico'] },
      tryit: { label: 'Pruébalo: elige qué dato leer', file: 'prueba.py', choices: ['ciudad', 'temp', 'humedad'], lines: ['import json', 'datos = json.loads(\'{"ciudad": "Cusco", "temp": 12, "humedad": 60}\')', 'print(datos["{v}"])'], outputs: { 'ciudad': 'Cusco', 'temp': '12', 'humedad': '60' } },
      remember: [P('JSON se convierte en diccionarios y listas.'), P({ c: 'json.loads(texto)' }, ' convierte texto JSON; ', { c: 'json.dumps(d)' }, ' hace lo contrario.'), P('Revisa ', { c: 'respuesta.status_code' }, ': 200 significa «todo bien».')],
      tip: 'Instala requests con: py -m pip install requests. Muchas APIs piden una clave gratuita.',
      quiz: [
        { prompt: '¿En qué formato responden casi todas las APIs?', code: ['# Elige uno'], options: ['JSON', 'MP3', 'EXE', 'PNG'], answer: 0, explain: 'JSON es el formato estándar de las APIs web.' },
        { prompt: '¿Qué muestra este código?', code: ['import json', 'd = json.loads(\'{"a": 5}\')', 'print(d["a"] + 1)'], options: ['6', '51', 'a1', 'Un error'], answer: 0, explain: 'json.loads crea un diccionario; d["a"] es 5 y 5 + 1 = 6.' },
        { prompt: '¿Qué código de estado HTTP significa «todo bien»?', code: ['respuesta.status_code'], options: ['200', '404', '500', '301'], answer: 0, explain: '200 es OK; 404 es «no encontrado».' }
      ]
    },

    /* ===== Python · Módulo 9: Especialización ===== */
    'python:Automatiza tareas': {
      paras: [P('Python es ideal para ', { b: 'automatizar' }, ' tareas repetitivas: crear o renombrar archivos, ordenar carpetas o generar reportes.'),
              P('El módulo ', { c: 'pathlib' }, ' trabaja con archivos y carpetas de forma sencilla: ', { c: 'Path("carpeta").glob("*.txt")' }, ' encuentra todos los .txt.')],
      example: { file: 'automatiza.py', lines: ['from pathlib import Path', 'for i in range(1, 4):', '    Path(f"reporte_{i}.txt").write_text(f"Ventas del día {i}")', '', 'archivos = sorted(p.name for p in Path(".").glob("reporte_*.txt"))', 'print(archivos)', 'print(Path("reporte_2.txt").read_text())'], output: ["['reporte_1.txt', 'reporte_2.txt', 'reporte_3.txt']", 'Ventas del día 2'] },
      tryit: { label: 'Pruébalo: elige cuántos archivos crear', file: 'prueba.py', choices: ['2', '3', '5'], lines: ['from pathlib import Path', 'for i in range({v}):', '    Path(f"nota_{i}.txt").write_text("hola")', 'print(len(list(Path(".").glob("nota_*.txt"))), "archivos creados")'], outputs: { '2': '2 archivos creados', '3': '3 archivos creados', '5': '5 archivos creados' } },
      remember: [P({ c: 'Path(...).write_text()' }, ' crea un archivo con texto.'), P({ c: 'glob("*.txt")' }, ' busca por patrón.'), P('Prueba primero en una carpeta de práctica.')],
      tip: 'Programa tus scripts con el Programador de tareas de Windows para que se ejecuten solos.',
      quiz: [
        { prompt: '¿Qué hace Path(".").glob("*.pdf")?', code: ['from pathlib import Path'], options: ['Busca los PDF de la carpeta actual', 'Borra los PDF', 'Crea un PDF', 'Abre un PDF'], answer: 0, explain: 'glob devuelve los archivos que coinciden con el patrón.' },
        { prompt: '¿Qué muestra este código?', code: ['from pathlib import Path', 'print(Path("foto.png").suffix)'], options: ['.png', 'foto', 'png', 'foto.png'], answer: 0, explain: 'suffix es la extensión del archivo, con el punto.' },
        { prompt: '¿Qué tareas conviene automatizar?', code: ['# Elige la mejor'], options: ['Las repetitivas', 'Las que haces una sola vez', 'Ninguna', 'Solo las de juegos'], answer: 0, explain: 'Automatizar ahorra más tiempo en las tareas que repites seguido.' }
      ]
    },
    'python:Análisis de datos con pandas': {
      paras: [P({ c: 'pandas' }, ' es la librería más usada para analizar datos. Su estructura principal es el ', { b: 'DataFrame' }, ': una tabla con filas y columnas, como una hoja de Excel.'),
              P('Puedes leer archivos CSV o Excel, filtrar filas, ordenar y calcular promedios con muy pocas líneas. Se instala con ', { c: 'py -m pip install pandas' }, '.')],
      example: { file: 'ventas.py', norun: true, lines: ['import pandas as pd', 'df = pd.DataFrame({', '    "fruta": ["mango", "fresa", "uva"],', '    "precio": [3.5, 6.0, 8.5],', '    "vendidos": [24, 10, 5]', '})', 'df["total"] = df["precio"] * df["vendidos"]', 'print(df.sort_values("total", ascending=False))', 'print("Promedio:", df["precio"].mean())'], output: ['   fruta  precio  vendidos  total', '0  mango     3.5        24   84.0', '1  fresa     6.0        10   60.0', '2    uva     8.5         5   42.5', 'Promedio: 6.0'] },
      tryit: { label: 'Pruébalo: elige una columna para el promedio (sin pandas)', file: 'prueba.py', choices: ['precio', 'vendidos'], lines: ['datos = {"precio": [3.5, 6.0, 8.5], "vendidos": [24, 10, 5]}', 'col = datos["{v}"]', 'print(sum(col) / len(col))'], outputs: { 'precio': '6.0', 'vendidos': '13.0' } },
      remember: [P('Un DataFrame es una tabla; cada columna es una Serie.'), P({ c: 'pd.read_csv("archivo.csv")' }, ' carga datos de un CSV.'), P({ c: 'df[df["precio"] > 5]' }, ' filtra filas.')],
      tip: 'Jupyter Notebook o Google Colab son geniales para explorar datos con pandas paso a paso.',
      quiz: [
        { prompt: '¿Qué es un DataFrame?', code: ['pd.DataFrame(...)'], options: ['Una tabla de datos', 'Un gráfico', 'Un archivo de audio', 'Una función matemática'], answer: 0, explain: 'Es una tabla con filas y columnas.' },
        { prompt: '¿Cómo lees un archivo CSV con pandas?', code: ['import pandas as pd'], options: ['pd.read_csv("datos.csv")', 'open.csv("datos")', 'pd.csv.open()', 'read("datos.csv")'], answer: 0, explain: 'read_csv carga el archivo en un DataFrame.' },
        { prompt: '¿Qué calcula df["precio"].mean()?', code: ['df["precio"].mean()'], options: ['El promedio de la columna precio', 'El precio más alto', 'La suma', 'La cantidad de filas'], answer: 0, explain: 'mean() es el promedio.' }
      ]
    },
    'python:Introducción a la inteligencia artificial': {
      paras: [P('La ', { b: 'inteligencia artificial' }, ' (IA) hace que las computadoras aprendan de ejemplos en lugar de seguir solo reglas escritas a mano.'),
              P('Una idea sencilla es el «vecino más cercano»: para adivinar algo nuevo, busca el ejemplo conocido que más se le parece. Librerías como ', { c: 'scikit-learn' }, ' hacen esto (y mucho más) por ti.')],
      example: { file: 'vecino.py', lines: ['# Ejemplos: (horas de estudio, horas de sueño) -> resultado', 'ejemplos = [((1, 5), "desaprueba"), ((6, 8), "aprueba"),', '            ((4, 7), "aprueba"), ((2, 4), "desaprueba")]', '', 'def predecir(nuevo):', '    def distancia(e):', '        (a, b), _ = e', '        return (a - nuevo[0]) ** 2 + (b - nuevo[1]) ** 2', '    return min(ejemplos, key=distancia)[1]', '', 'print(predecir((5, 7)))', 'print(predecir((1, 4)))'], output: ['aprueba', 'desaprueba'] },
      tryit: { label: 'Pruébalo: elige cuántas horas estudias', file: 'prueba.py', choices: ['1', '3', '6'], lines: ['ejemplos = [(1, "desaprueba"), (2, "desaprueba"), (4, "aprueba"), (6, "aprueba")]', 'horas = {v}', 'mas_cercano = min(ejemplos, key=lambda e: abs(e[0] - horas))', 'print(mas_cercano[1])'], outputs: { '1': 'desaprueba', '3': 'desaprueba', '6': 'aprueba' } },
      remember: [P('La IA aprende patrones a partir de datos.'), P('Más y mejores ejemplos suelen dar mejores predicciones.'), P('scikit-learn, TensorFlow y PyTorch son librerías populares.')],
      tip: 'Una IA solo es tan buena como sus datos: si los ejemplos están sesgados, sus respuestas también.',
      quiz: [
        { prompt: '¿De qué aprende un modelo de IA?', code: ['# Elige una'], options: ['De ejemplos (datos)', 'De la pantalla', 'Del teclado', 'De nada'], answer: 0, explain: 'Los modelos encuentran patrones en los datos de ejemplo.' },
        { prompt: '¿Qué hace el método del vecino más cercano?', code: ['min(ejemplos, key=distancia)'], options: ['Elige el ejemplo más parecido', 'Elige uno al azar', 'Promedia todo', 'Ordena alfabéticamente'], answer: 0, explain: 'Predice usando el ejemplo conocido más cercano al nuevo.' },
        { prompt: '¿Qué muestra este código?', code: ['print(min([3, 9, 5], key=lambda x: abs(x - 8)))'], options: ['9', '3', '5', '8'], answer: 0, explain: 'El más cercano a 8 es 9 (distancia 1).' }
      ]
    },
    'python:Desarrollo web con Flask': {
      paras: [P({ c: 'Flask' }, ' es un framework para crear páginas y APIs web con Python. Cada página es una función decorada con ', { c: '@app.route("/ruta")' }, '.'),
              P('Lo que la función devuelve es lo que ve el navegador. Se instala con ', { c: 'py -m pip install flask' }, ' y se ejecuta con ', { c: 'py app.py' }, '.')],
      example: { file: 'app.py', norun: true, lines: ['from flask import Flask', 'app = Flask(__name__)', '', '@app.route("/")', 'def inicio():', '    return "<h1>¡Hola desde Flask!</h1>"', '', '@app.route("/saludo/<nombre>")', 'def saludo(nombre):', '    return f"Hola, {nombre}"', '', 'if __name__ == "__main__":', '    app.run(debug=True)'], output: ['* Running on http://127.0.0.1:5000', 'Abre esa dirección en tu navegador'] },
      tryit: { label: 'Pruébalo: elige qué dirección visitar', file: 'navegador', norun: true, choices: ['/', '/saludo/Ana', '/saludo/Luis'], lines: ['http://127.0.0.1:5000{v}'], outputs: { '/': '¡Hola desde Flask!', '/saludo/Ana': 'Hola, Ana', '/saludo/Luis': 'Hola, Luis' } },
      remember: [P('Cada ruta es una función con ', { c: '@app.route' }, '.'), P({ c: '<nombre>' }, ' en la ruta llega como parámetro.'), P({ c: 'debug=True' }, ' recarga solo al guardar cambios.')],
      tip: 'Con render_template puedes devolver archivos HTML completos en vez de texto.',
      quiz: [
        { prompt: '¿Qué indica @app.route("/contacto")?', code: ['@app.route("/contacto")', 'def contacto(): ...'], options: ['Qué dirección muestra esa función', 'El nombre del archivo', 'Un error', 'El puerto'], answer: 0, explain: 'La ruta define en qué dirección del sitio se ejecuta la función.' },
        { prompt: '¿Qué ve el navegador?', code: ['def inicio():', '    return "Hola"'], options: ['Lo que devuelve la función', 'El nombre de la función', 'El código Python', 'Nada'], answer: 0, explain: 'Flask envía al navegador lo que la función devuelve.' },
        { prompt: '¿Cómo instalas Flask?', code: ['# en la terminal'], options: ['py -m pip install flask', 'import flask install', 'git install flask', 'flask new'], answer: 0, explain: 'Flask es un paquete: se instala con pip.' }
      ]
    },
    'python:Proyecto final': {
      paras: [P('¡Llegaste al final! Tu proyecto: un ', { b: 'gestor de tareas' }, ' que usa todo lo aprendido: una clase, listas, funciones, bucles, archivos y manejo de errores.'),
              P('Cópialo en el editor, ejecútalo y luego hazlo tuyo: agrega prioridades, fechas o un menú con ', { c: 'input()' }, '.')],
      example: { file: 'tareas.py', lines: ['class Tarea:', '    def __init__(self, titulo):', '        self.titulo = titulo', '        self.hecha = False', '', 'class Gestor:', '    def __init__(self):', '        self.tareas = []', '    def agregar(self, titulo):', '        self.tareas.append(Tarea(titulo))', '    def completar(self, i):', '        try:', '            self.tareas[i].hecha = True', '        except IndexError:', '            print("No existe la tarea", i)', '    def mostrar(self):', '        for i, t in enumerate(self.tareas):', '            print(i, "[x]" if t.hecha else "[ ]", t.titulo)', '', 'g = Gestor()', 'g.agregar("Estudiar Python")', 'g.agregar("Hacer el reto")', 'g.completar(0)', 'g.completar(5)', 'g.mostrar()'], output: ['No existe la tarea 5', '0 [x] Estudiar Python', '1 [ ] Hacer el reto'] },
      tryit: { label: 'Pruébalo: elige qué tarea completar', file: 'prueba.py', choices: ['0', '1', '2'], lines: ['tareas = ["Leer", "Programar"]', 'hechas = set()', 'i = {v}', 'if i < len(tareas):', '    hechas.add(i)', '    print("Completaste:", tareas[i])', 'else:', '    print("Esa tarea no existe")'], outputs: { '0': 'Completaste: Leer', '1': 'Completaste: Programar', '2': 'Esa tarea no existe' } },
      remember: [P('Divide el problema en clases y funciones pequeñas.'), P('Maneja los errores con ', { c: 'try/except' }, '.'), P('Guarda tus tareas en un archivo para no perderlas.')],
      tip: '¡Felicitaciones! Comparte tu proyecto en GitHub y elige tu siguiente especialización.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['hecha = True', 'print("[x]" if hecha else "[ ]")'], options: ['[x]', '[ ]', 'True', 'Un error'], answer: 0, explain: 'Es un if en una línea: como hecha es True, muestra [x].' },
        { prompt: '¿Qué error se atrapa al pedir una tarea que no existe?', code: ['self.tareas[i]'], options: ['IndexError', 'ValueError', 'KeyError', 'TypeError'], answer: 0, explain: 'Pedir una posición fuera de la lista lanza IndexError.' },
        { prompt: '¿Qué mejora agregarías para no perder las tareas al cerrar?', code: ['# Elige una'], options: ['Guardarlas en un archivo', 'Usar más print', 'Quitar la clase', 'Usar sets'], answer: 0, explain: 'Guardar en un archivo (por ejemplo JSON) las conserva entre ejecuciones.' }
      ]
    },
    /* ===== Java · Módulo 1: Fundamentos ===== */
    'java:Tu primer programa': {
      paras: [P('Todo programa en Java vive dentro de una ', { b: 'clase' }, ' y empieza a ejecutarse en el método ', { c: 'main' }, '. El nombre del archivo debe coincidir con el de la clase: ', { c: 'Main.java' }, '.'),
              P({ c: 'System.out.println()' }, ' muestra un texto y salta de línea; ', { c: 'System.out.print()' }, ' lo muestra sin saltar.')],
      example: { file: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    System.out.println("¡Hola!");', '    System.out.print("Aprendo ");', '    System.out.println("Java");', '    System.out.println(7 + 3);', '  }', '}'], output: ['¡Hola!', 'Aprendo Java', '10'] },
      tryit: { label: 'Pruébalo: elige un lenguaje', file: 'Main.java', choices: ['Java', 'Python', 'C++'], lines: ['System.out.print("Me gusta ");', 'System.out.println("{v}");'], output: 'Me gusta {v}' },
      remember: [P('Cada instrucción termina con ', { c: ';' }, '.'), P('Las llaves ', { c: '{ }' }, ' abren y cierran bloques.'), P({ c: 'println' }, ' salta de línea; ', { c: 'print' }, ' no.')],
      tip: 'Si ves «class Main is public, should be declared in a file named Main.java», revisa el nombre del archivo.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['System.out.print("A");', 'System.out.print("B");'], options: ['AB', 'A B', 'A y B en dos líneas', 'Un error'], answer: 0, explain: 'print no salta de línea, así que todo queda junto: AB.' },
        { prompt: '¿Dónde empieza a ejecutarse un programa Java?', code: ['public static void main(String[] args)'], options: ['En el método main', 'En la primera llave', 'En el último println', 'En cualquier método'], answer: 0, explain: 'Java siempre empieza por main.' },
        { prompt: '¿Qué muestra este código?', code: ['System.out.println(2 + 2);'], options: ['4', '2 + 2', '22', 'Un error'], answer: 0, explain: 'Sin comillas, Java calcula: 2 + 2 = 4.' }
      ]
    },
    'java:Variables': {
      paras: [P('En Java debes indicar el ', { b: 'tipo' }, ' de cada variable al crearla: ', { c: 'int edad = 17;' }, '. Después puedes cambiar su valor, pero no su tipo.'),
              P('Usa ', { c: 'final' }, ' para valores que nunca cambian, como ', { c: 'final double IGV = 0.18;' }, '.')],
      diagram: { parts: [{ t: 'int', label: 'el tipo', kind: 'op' }, { t: 'edad', label: 'el nombre', kind: 'name' }, { t: '17', label: 'el valor', kind: 'value' }], caption: 'int edad = 17;' },
      example: { file: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    String nombre = "Ana";', '    int edad = 17;', '    edad = edad + 1;', '    final double IGV = 0.18;', '    System.out.println(nombre + " tiene " + edad + " años");', '    System.out.println("IGV: " + IGV);', '  }', '}'], output: ['Ana tiene 18 años', 'IGV: 0.18'] },
      tryit: { label: 'Pruébalo: elige tu ciudad', file: 'Main.java', choices: ['Lima', 'Cusco', 'Piura'], lines: ['String ciudad = "{v}";', 'System.out.println("Vivo en " + ciudad);'], output: 'Vivo en {v}' },
      remember: [P('Forma: ', { c: 'tipo nombre = valor;' }, '.'), P('Con ', { c: '+' }, ' unes textos y variables.'), P({ c: 'final' }, ' crea una constante.')],
      tip: 'Los nombres de variables en Java se escriben en camelCase: precioTotal, notaFinal.',
      quiz: [
        { prompt: '¿Cuál declaración es correcta en Java?', code: ['// Elige una'], options: ['int puntos = 10;', 'puntos = 10', 'var puntos: 10;', 'int puntos == 10;'], answer: 0, explain: 'Tipo, nombre, = valor y punto y coma.' },
        { prompt: '¿Qué muestra este código?', code: ['int x = 5;', 'x = x * 2;', 'System.out.println(x);'], options: ['5', '10', 'x * 2', '25'], answer: 1, explain: 'x pasa de 5 a 10.' },
        { prompt: '¿Qué hace final?', code: ['final int MAX = 3;'], options: ['Impide cambiar el valor', 'Termina el programa', 'Borra la variable', 'La hace pública'], answer: 0, explain: 'Una variable final no puede cambiar después de asignarse.' }
      ]
    },
    'java:Tipos de datos': {
      paras: [P('Java tiene tipos ', { b: 'primitivos' }, ': ', { c: 'int' }, ' (enteros), ', { c: 'double' }, ' (decimales), ', { c: 'char' }, ' (un carácter entre comillas simples) y ', { c: 'boolean' }, ' (', { c: 'true' }, '/', { c: 'false' }, '). ', { c: 'String' }, ' guarda texto.'),
              P('Puedes convertir: ', { c: '(int) 3.9' }, ' da 3 y ', { c: 'Integer.parseInt("20")' }, ' convierte texto en número.')],
      example: { file: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    int unidades = 3;', '    double precio = 4.5;', "    char talla = 'M';", '    boolean oferta = true;', '    System.out.println(unidades * precio);', '    System.out.println(talla + " " + oferta);', '    System.out.println((int) 9.99);', '    System.out.println(Integer.parseInt("20") + 5);', '  }', '}'], output: ['13.5', 'M true', '9', '25'] },
      tryit: { label: 'Pruébalo: elige un decimal para convertir a int', file: 'Main.java', choices: ['2.3', '7.9', '10.5'], lines: ['double d = {v};', 'System.out.println((int) d);'], outputs: { '2.3': '2', '7.9': '7', '10.5': '10' } },
      remember: [P({ c: 'char' }, ' usa comillas simples: ', { c: "'A'" }, '.'), P({ c: '(int)' }, ' corta los decimales, no redondea.'), P({ c: 'String' }, ' va con S mayúscula.')],
      tip: 'Para redondear de verdad usa Math.round(7.9), que da 8.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['System.out.println((int) 5.99);'], options: ['5', '6', '5.99', 'Un error'], answer: 0, explain: 'El cast a int corta los decimales: 5.' },
        { prompt: '¿Qué tipo usarías para guardar 3.75?', code: ['___ precio = 3.75;'], options: ['double', 'int', 'char', 'boolean'], answer: 0, explain: 'double guarda números con decimales.' },
        { prompt: '¿Qué muestra este código?', code: ['System.out.println(Integer.parseInt("8") * 2);'], options: ['16', '88', '8', 'Un error'], answer: 0, explain: 'parseInt convierte "8" en el número 8; 8 × 2 = 16.' }
      ]
    },
    'java:Operadores': {
      paras: [P('Java usa ', { c: '+ - * /' }, ' y ', { c: '%' }, ' (resto). Ojo: entre enteros, ', { c: '/' }, ' descarta los decimales. ', { c: 'x++' }, ' suma 1 y ', { c: 'x += 5' }, ' suma 5.'),
              P('Para comparar: ', { c: '== != < > <= >=' }, '. Para combinar condiciones: ', { c: '&&' }, ' (y), ', { c: '||' }, ' (o), ', { c: '!' }, ' (no).')],
      example: { file: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    System.out.println(7 / 2);', '    System.out.println(7.0 / 2);', '    System.out.println(7 % 2);', '    int x = 5;', '    x++;', '    x += 10;', '    System.out.println(x);', '    System.out.println(x > 10 && x < 20);', '  }', '}'], output: ['3', '3.5', '1', '16', 'true'] },
      tryit: { label: 'Pruébalo: elige un número y mira si es par', file: 'Main.java', choices: ['6', '9', '14'], lines: ['int n = {v};', 'System.out.println(n % 2 == 0);'], outputs: { '6': 'true', '9': 'false', '14': 'true' } },
      remember: [P('Entre enteros, ', { c: '7 / 2' }, ' es ', { c: '3' }, '.'), P({ c: '%' }, ' da el resto.'), P({ c: '&&' }, ' exige ambas condiciones; ', { c: '||' }, ' solo una.')],
      tip: 'Para comparar textos en Java usa nombre.equals("Ana"), no ==.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['System.out.println(10 / 4);'], options: ['2', '2.5', '3', '2.0'], answer: 0, explain: 'Entre enteros la división descarta decimales: 2.' },
        { prompt: '¿Qué muestra este código?', code: ['int a = 3;', 'a++;', 'a++;', 'System.out.println(a);'], options: ['3', '4', '5', '6'], answer: 2, explain: 'Cada ++ suma 1: 3 → 4 → 5.' },
        { prompt: '¿Qué muestra este código?', code: ['System.out.println(5 > 3 || 1 > 2);'], options: ['true', 'false', '1', 'Un error'], answer: 0, explain: 'Con || basta que una condición sea verdadera.' }
      ]
    },
    'java:Mini proyecto: Ficha personal': {
      paras: [P('Vas a crear una ', { b: 'ficha personal' }, ' que muestre tus datos ordenados: nombre, edad, ciudad, altura y si estudias.'),
              P('Usarás variables de varios tipos y ', { c: 'System.out.printf' }, ', que permite dar formato: ', { c: '%s' }, ' para texto, ', { c: '%d' }, ' para enteros y ', { c: '%.2f' }, ' para decimales con 2 cifras.')],
      example: { file: 'Main.java', lines: ['public class Main {', '  public static void main(String[] args) {', '    String nombre = "Alex";', '    int edad = 17;', '    String ciudad = "Arequipa";', '    double altura = 1.68;', '    boolean estudia = true;', '    System.out.println("=== Ficha personal ===");', '    System.out.printf("Nombre: %s%n", nombre);', '    System.out.printf("Edad: %d años%n", edad);', '    System.out.printf("Ciudad: %s%n", ciudad);', '    System.out.printf("Altura: %.2f m%n", altura);', '    System.out.println("Estudia: " + (estudia ? "sí" : "no"));', '  }', '}'], output: ['=== Ficha personal ===', 'Nombre: Alex', 'Edad: 17 años', 'Ciudad: Arequipa', 'Altura: 1.68 m', 'Estudia: sí'] },
      tryit: { label: 'Pruébalo: elige tu altura', file: 'Main.java', choices: ['1.5', '1.725', '1.8'], lines: ['double altura = {v};', 'System.out.printf("Altura: %.2f m%n", altura);'], outputs: { '1.5': 'Altura: 1.50 m', '1.725': 'Altura: 1.73 m', '1.8': 'Altura: 1.80 m' } },
      remember: [P({ c: '%n' }, ' en printf es un salto de línea.'), P({ c: '%.2f' }, ' muestra 2 decimales.'), P({ c: 'condición ? a : b' }, ' elige entre dos valores.')],
      tip: 'Reto: cópialo en el editor y agrega tu comida favorita y tu número de la suerte.',
      quiz: [
        { prompt: '¿Qué formato usarías para un entero en printf?', code: ['System.out.printf("Edad: ___", 17);'], options: ['%d', '%s', '%.2f', '%e'], answer: 0, explain: '%d es para enteros.' },
        { prompt: '¿Qué muestra este código?', code: ['System.out.printf("%.1f%n", 2.36);'], options: ['2.4', '2.3', '2.36', '2'], answer: 0, explain: '%.1f redondea a un decimal: 2.4.' },
        { prompt: '¿Qué muestra este código?', code: ['boolean b = false;', 'System.out.println(b ? "sí" : "no");'], options: ['no', 'sí', 'false', 'Un error'], answer: 0, explain: 'Como b es false, se elige el segundo valor: "no".' }
      ]
    },
    /* ===== JavaScript · Módulo 1: Fundamentos ===== */
    'javascript:Tu primer console.log()': {
      paras: [P({ c: 'console.log()' }, ' puede mostrar textos, números o varias cosas a la vez separadas por comas; las muestra con un espacio entre ellas.'),
              P('Sin comillas, JavaScript ', { b: 'calcula' }, ': ', { c: 'console.log(6 * 7)' }, ' muestra 42. Cada ', { c: 'console.log' }, ' escribe en una línea nueva.')],
      example: { file: 'main.js', lines: ['console.log("Hola");', 'console.log("Tengo", 17, "años");', 'console.log(6 * 7);'], output: ['Hola', 'Tengo 17 años', '42'] },
      tryit: { label: 'Pruébalo: elige un número', file: 'prueba.js', choices: ['4', '9', '15'], lines: ['console.log("El triple de {v} es", {v} * 3);'], outputs: { '4': 'El triple de 4 es 12', '9': 'El triple de 9 es 27', '15': 'El triple de 15 es 45' } },
      remember: [P('Los textos van entre comillas dobles o simples.'), P('Las comas separan valores con un espacio.'), P('Sin comillas, JavaScript calcula.')],
      tip: 'En el editor de AGbyte, la consola muestra todo lo que escribas con console.log().',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['console.log("Nivel", 3);'], options: ['Nivel 3', 'Nivel3', '"Nivel", 3', 'Un error'], answer: 0, explain: 'Las comas separan los valores con un espacio.' },
        { prompt: '¿Qué muestra este código?', code: ['console.log(10 - 4);'], options: ['6', '10 - 4', '104', 'Un error'], answer: 0, explain: 'Sin comillas se calcula la operación: 6.' },
        { prompt: '¿Qué muestra este código?', code: ['console.log("10 - 4");'], options: ['10 - 4', '6', '"10 - 4"', 'Un error'], answer: 0, explain: 'Entre comillas es texto: se muestra tal cual.' }
      ]
    },
    'javascript:let y const': {
      paras: [P('Las variables se declaran con ', { c: 'let' }, ' (si su valor va a cambiar) o ', { c: 'const' }, ' (si no cambiará). Por ejemplo: ', { c: 'let puntos = 0;' }, '.'),
              P('Si intentas cambiar una ', { c: 'const' }, ', JavaScript da un error. Evita ', { c: 'var' }, ': es la forma antigua y tiene comportamientos confusos.')],
      diagram: { parts: [{ t: 'let', label: 'puede cambiar', kind: 'op' }, { t: 'puntos', label: 'el nombre', kind: 'name' }, { t: '0', label: 'el valor', kind: 'value' }], caption: 'let puntos = 0;' },
      example: { file: 'main.js', lines: ['const nombre = "Ana";', 'let puntos = 0;', 'puntos = puntos + 10;', 'puntos += 5;', 'console.log(nombre, "tiene", puntos, "puntos");'], output: ['Ana tiene 15 puntos'] },
      tryit: { label: 'Pruébalo: elige cuántos puntos ganar', file: 'prueba.js', choices: ['5', '20', '50'], lines: ['let puntos = 10;', 'puntos += {v};', 'console.log("Puntos:", puntos);'], outputs: { '5': 'Puntos: 15', '20': 'Puntos: 30', '50': 'Puntos: 60' } },
      remember: [P({ c: 'let' }, ' para valores que cambian.'), P({ c: 'const' }, ' para valores fijos.'), P({ c: 'x += 5' }, ' es lo mismo que ', { c: 'x = x + 5' }, '.')],
      tip: 'Regla práctica: usa const por defecto y cámbialo a let solo si necesitas reasignar.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['let a = 2;', 'a = a * 5;', 'console.log(a);'], options: ['2', '10', '25', 'Un error'], answer: 1, explain: 'a pasa de 2 a 10.' },
        { prompt: '¿Qué pasa con este código?', code: ['const x = 1;', 'x = 2;'], options: ['Da un error', 'x vale 2', 'x vale 1', 'x vale 3'], answer: 0, explain: 'Una const no se puede reasignar: TypeError.' },
        { prompt: '¿Qué palabra usarías para un contador que sube?', code: ['___ contador = 0;'], options: ['let', 'const', 'fixed', 'static'], answer: 0, explain: 'El contador cambia, así que se declara con let.' }
      ]
    },
    'javascript:Tipos de datos': {
      paras: [P('Los tipos básicos son: ', { c: 'number' }, ' (enteros y decimales), ', { c: 'string' }, ' (texto), ', { c: 'boolean' }, ' (', { c: 'true' }, '/', { c: 'false' }, '), ', { c: 'undefined' }, ' (sin valor) y ', { c: 'null' }, ' (vacío a propósito).'),
              P({ c: 'typeof' }, ' te dice el tipo. Para convertir texto en número usa ', { c: 'Number("20")' }, ' y para lo contrario ', { c: 'String(20)' }, '.')],
      example: { file: 'main.js', lines: ['let edad = 17;', 'let nombre = "Luis";', 'let activo = true;', 'let apodo;', 'console.log(typeof edad, typeof nombre, typeof activo);', 'console.log(apodo);', 'console.log(Number("20") + 5, "20" + 5);'], output: ['number string boolean', 'undefined', '25 205'] },
      tryit: { label: 'Pruébalo: elige un valor y mira su tipo', file: 'prueba.js', choices: ['42', '"42"', 'false'], lines: ['console.log(typeof {v});'], outputs: { '42': 'number', '"42"': 'string', 'false': 'boolean' } },
      remember: [P('Enteros y decimales son ', { c: 'number' }, '.'), P({ c: '"20" + 5' }, ' une textos: ', { c: '"205"' }, '.'), P('Una variable sin valor es ', { c: 'undefined' }, '.')],
      tip: 'Number("hola") da NaN («no es un número»). Revisa los datos antes de calcular.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['console.log(typeof 3.5);'], options: ['number', 'float', 'decimal', 'string'], answer: 0, explain: 'En JavaScript todos los números son number.' },
        { prompt: '¿Qué muestra este código?', code: ['console.log("3" + 4);'], options: ['34', '7', '"3" + 4', 'Un error'], answer: 0, explain: 'Si uno es texto, + une: "34".' },
        { prompt: '¿Qué muestra este código?', code: ['console.log(Number("3") + 4);'], options: ['7', '34', 'NaN', 'Un error'], answer: 0, explain: 'Number convierte "3" en 3, y 3 + 4 = 7.' }
      ]
    },
    'javascript:Operadores': {
      paras: [P('Aritméticos: ', { c: '+ - * / % **' }, '. A diferencia de Java, ', { c: '7 / 2' }, ' da 3.5. Comparación: usa ', { c: '===' }, ' (igual en valor y tipo) y ', { c: '!==' }, '.'),
              P('Lógicos: ', { c: '&&' }, ' (y), ', { c: '||' }, ' (o), ', { c: '!' }, ' (no). Y ', { c: 'x++' }, ' suma 1 a una variable.')],
      example: { file: 'main.js', lines: ['console.log(7 / 2, 7 % 2, 2 ** 4);', 'console.log(5 == "5", 5 === "5");', 'let edad = 16;', 'console.log(edad >= 18 || edad === 16);', 'edad++;', 'console.log(edad);'], output: ['3.5 1 16', 'true false', 'true', '17'] },
      tryit: { label: 'Pruébalo: elige un número y mira si es par', file: 'prueba.js', choices: ['10', '7', '22'], lines: ['const n = {v};', 'console.log(n % 2 === 0 ? "par" : "impar");'], outputs: { '10': 'par', '7': 'impar', '22': 'par' } },
      remember: [P('Usa siempre ', { c: '===' }, ' en vez de ', { c: '==' }, '.'), P({ c: '**' }, ' es potencia: ', { c: '2 ** 3' }, ' = 8.'), P({ c: 'cond ? a : b' }, ' elige entre dos valores.')],
      tip: '== convierte tipos antes de comparar y puede sorprenderte. === no lo hace.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['console.log(9 / 2);'], options: ['4.5', '4', '5', '4.0'], answer: 0, explain: 'En JavaScript la división da decimales: 4.5.' },
        { prompt: '¿Qué muestra este código?', code: ['console.log(3 === "3");'], options: ['false', 'true', '3', 'Un error'], answer: 0, explain: '=== compara también el tipo: number no es string.' },
        { prompt: '¿Qué muestra este código?', code: ['console.log(true && !false);'], options: ['true', 'false', 'undefined', 'Un error'], answer: 0, explain: '!false es true, y true && true es true.' }
      ]
    },
    'javascript:Mini proyecto: Saludo': {
      paras: [P('Crearás un programa que ', { b: 'saluda según la hora' }, ': «Buenos días», «Buenas tardes» o «Buenas noches», con el nombre de la persona.'),
              P('Usarás variables, comparaciones y ', { b: 'plantillas de texto' }, ': entre comillas invertidas puedes meter variables con ', { c: '${nombre}' }, '.')],
      example: { file: 'saludo.js', lines: ['const nombre = "Sofía";', 'const hora = 15;', 'let saludo = "Buenas noches";', 'if (hora < 12) saludo = "Buenos días";', 'else if (hora < 19) saludo = "Buenas tardes";', 'console.log(`${saludo}, ${nombre}!`);', 'console.log(`Son las ${hora}:00`);'], output: ['Buenas tardes, Sofía!', 'Son las 15:00'] },
      tryit: { label: 'Pruébalo: elige la hora', file: 'prueba.js', choices: ['9', '15', '21'], lines: ['const hora = {v};', 'let s = "Buenas noches";', 'if (hora < 12) s = "Buenos días";', 'else if (hora < 19) s = "Buenas tardes";', 'console.log(s);'], outputs: { '9': 'Buenos días', '15': 'Buenas tardes', '21': 'Buenas noches' } },
      remember: [P('Las plantillas usan comillas invertidas: ', { c: '`Hola ${x}`' }, '.'), P('Revisa las condiciones de la más pequeña a la más grande.'), P('Para la hora real: ', { c: 'new Date().getHours()' }, '.')],
      tip: 'Reto: cambia const hora = 15 por new Date().getHours() y ejecútalo a distintas horas.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['const x = 5;', 'console.log(`x vale ${x * 2}`);'], options: ['x vale 10', 'x vale ${x * 2}', 'x vale 5', 'Un error'], answer: 0, explain: 'Dentro de ${ } se calcula la expresión: 10.' },
        { prompt: '¿Qué comillas usan las plantillas de texto?', code: ['// Elige una'], options: ['Invertidas `', 'Dobles "', 'Simples \'', 'Ninguna'], answer: 0, explain: 'Solo las comillas invertidas permiten ${ }.' },
        { prompt: '¿Qué muestra si hora = 11?', code: ['if (hora < 12) console.log("mañana");', 'else console.log("tarde");'], options: ['mañana', 'tarde', 'nada', 'Un error'], answer: 0, explain: '11 es menor que 12.' }
      ]
    },
    /* ===== HTML · Módulo 1: Introducción ===== */
    'html:Tu primera página': {
      paras: [P('Una página web es un archivo de texto con extensión ', { c: '.html' }, '. Empieza con ', { c: '<!DOCTYPE html>' }, ', que le dice al navegador que es HTML moderno.'),
              P('Dentro pones etiquetas como ', { c: '<h1>' }, ' para el título y ', { c: '<p>' }, ' para los párrafos. Guarda el archivo y ábrelo con doble clic: tu navegador lo mostrará.')],
      example: { file: 'index.html', lines: ['<!DOCTYPE html>', '<html>', '  <body>', '    <h1>Mi primera página</h1>', '    <p>¡Hola! Me llamo Alex.</p>', '    <p>Estoy aprendiendo HTML con AGbyte.</p>', '  </body>', '</html>'], output: ['[Título] Mi primera página', '[Párrafo] ¡Hola! Me llamo Alex.', '[Párrafo] Estoy aprendiendo HTML con AGbyte.'] },
      tryit: { label: 'Pruébalo: elige tu pasatiempo', file: 'index.html', choices: ['el fútbol', 'la música', 'los videojuegos'], lines: ['<h1>Sobre mí</h1>', '<p>Me encanta {v}.</p>'], output: '[Título] Sobre mí\n[Párrafo] Me encanta {v}.' },
      remember: [P('La primera línea es ', { c: '<!DOCTYPE html>' }, '.'), P('Guarda con extensión ', { c: '.html' }, '.'), P('Lo que ves en la página va dentro de ', { c: '<body>' }, '.')],
      tip: 'Pulsa F5 en el navegador cada vez que guardes cambios para verlos.',
      quiz: [
        { prompt: '¿Qué extensión tiene un archivo HTML?', code: ['index.___'], options: ['.html', '.txt', '.py', '.doc'], answer: 0, explain: 'Las páginas web se guardan como .html.' },
        { prompt: '¿Qué va en la primera línea?', code: ['<!-- línea 1 -->'], options: ['<!DOCTYPE html>', '<body>', '<h1>', '<end>'], answer: 0, explain: 'DOCTYPE indica que el documento es HTML moderno.' },
        { prompt: '¿Cómo ves tu página?', code: ['index.html'], options: ['Abriéndola en un navegador', 'Imprimiéndola', 'Con la calculadora', 'No se puede ver'], answer: 0, explain: 'El navegador interpreta el HTML y lo muestra.' }
      ]
    },
    'html:html, head y body': {
      paras: [P('Todo documento tiene tres partes: ', { c: '<html>' }, ' envuelve todo; ', { c: '<head>' }, ' guarda información para el navegador (título, idioma, estilos) y ', { c: '<body>' }, ' guarda lo que se ve.'),
              P('En ', { c: '<head>' }, ' suele ir ', { c: '<meta charset="utf-8">' }, ' para que las tildes y la ñ se vean bien.')],
      diagram: { parts: [{ t: '<head>', label: 'lo que no se ve', kind: 'name' }, { t: '+', label: 'dentro de <html>', kind: 'op' }, { t: '<body>', label: 'lo que se ve', kind: 'value' }], caption: 'Cabeza para el navegador, cuerpo para las personas.' },
      example: { file: 'index.html', lines: ['<!DOCTYPE html>', '<html lang="es">', '  <head>', '    <meta charset="utf-8">', '    <title>Mi sitio</title>', '  </head>', '  <body>', '    <h1>Bienvenidos</h1>', '    <p>Contenido de la página.</p>', '  </body>', '</html>'], output: ['[Pestaña] Mi sitio', '[Título] Bienvenidos', '[Párrafo] Contenido de la página.'] },
      tryit: { label: 'Pruébalo: elige dónde poner un párrafo', file: 'index.html', choices: ['<body>', '<head>'], lines: ['<!-- Pones <p>Hola</p> dentro de {v} -->'], outputs: { '<body>': '[Párrafo] Hola  → se ve en la página', '<head>': 'No se ve: el <head> es solo para el navegador' } },
      remember: [P({ c: '<head>' }, ': título, idioma, estilos.'), P({ c: '<body>' }, ': todo lo visible.'), P({ c: 'lang="es"' }, ' indica que la página está en español.')],
      tip: 'Usa sangría para que se note qué etiqueta está dentro de cuál.',
      quiz: [
        { prompt: '¿Dónde va el contenido visible?', code: ['<html> ... </html>'], options: ['En <body>', 'En <head>', 'Fuera de <html>', 'En <title>'], answer: 0, explain: 'Lo que ves en la página va dentro de <body>.' },
        { prompt: '¿Para qué sirve <meta charset="utf-8">?', code: ['<meta charset="utf-8">'], options: ['Para que se vean bien las tildes y la ñ', 'Para poner un título', 'Para crear un enlace', 'Para cambiar colores'], answer: 0, explain: 'utf-8 permite mostrar todos los caracteres del español.' },
        { prompt: '¿Qué etiqueta envuelve a head y body?', code: ['<___>', '  <head>…</head>', '  <body>…</body>', '</___>'], options: ['html', 'page', 'main', 'doc'], answer: 0, explain: '<html> es la raíz del documento.' }
      ]
    },
    'html:La etiqueta title': {
      paras: [P({ c: '<title>' }, ' va dentro de ', { c: '<head>' }, ' y define el texto que aparece en la ', { b: 'pestaña del navegador' }, ', en favoritos y en los resultados de Google.'),
              P('No se ve dentro de la página. Escribe títulos cortos y claros, por ejemplo «Recetas de Ana · Postres».')],
      example: { file: 'index.html', lines: ['<!DOCTYPE html>', '<html lang="es">', '  <head>', '    <meta charset="utf-8">', '    <title>Recetas de Ana · Postres</title>', '  </head>', '  <body>', '    <h1>Postres fáciles</h1>', '  </body>', '</html>'], output: ['[Pestaña] Recetas de Ana · Postres', '[Título] Postres fáciles'] },
      tryit: { label: 'Pruébalo: elige el título de la pestaña', file: 'index.html', choices: ['Mi blog', 'Tienda de frutas', 'Portafolio'], lines: ['<title>{v}</title>'], output: '[Pestaña] {v}' },
      remember: [P({ c: '<title>' }, ' va en ', { c: '<head>' }, ', no en ', { c: '<body>' }, '.'), P('Se ve en la pestaña, no en la página.'), P('Un buen título ayuda a que te encuentren en buscadores.')],
      tip: 'Cada página de tu sitio debería tener un título distinto que describa su contenido.',
      quiz: [
        { prompt: '¿Dónde se ve el texto de <title>?', code: ['<title>Mi sitio</title>'], options: ['En la pestaña del navegador', 'En el centro de la página', 'Al pie de la página', 'En ningún lado'], answer: 0, explain: 'El título aparece en la pestaña y en los favoritos.' },
        { prompt: '¿Dentro de qué etiqueta va <title>?', code: ['<___><title>…</title></___>'], options: ['head', 'body', 'p', 'h1'], answer: 0, explain: '<title> es información para el navegador: va en <head>.' },
        { prompt: '¿Cuál es mejor título?', code: ['<!-- Elige uno -->'], options: ['Tienda Mango · Frutas frescas', 'Página', 'asdf', 'Título'], answer: 0, explain: 'Debe describir el contenido de forma corta y clara.' }
      ]
    },
    /* ===== CSS · Módulo 1: Introducción ===== */
    'css:Selectores': {
      paras: [P('Un ', { b: 'selector' }, ' indica a qué elementos se aplica el estilo. Por etiqueta: ', { c: 'p { }' }, '. Por clase: ', { c: '.nota { }' }, ' (con punto). Por id: ', { c: '#titulo { }' }, ' (con numeral).'),
              P('Las clases se pueden repetir en muchos elementos; un id debe ser único en la página.')],
      example: { file: 'estilos.css', lines: ['p {', '  color: gray;', '}', '.nota {', '  color: crimson;', '}', '#titulo {', '  font-size: 40px;', '}'], output: ['[Todos los <p>] gris', '[class="nota"] rojo carmesí', '[id="titulo"] 40 px'] },
      tryit: { label: 'Pruébalo: elige el selector', file: 'estilos.css', choices: ['p', '.nota', '#titulo'], lines: ['{v} {', '  color: crimson;', '}'], outputs: { 'p': 'Todos los párrafos se ponen carmesí', '.nota': 'Solo los elementos con class="nota"', '#titulo': 'Solo el elemento con id="titulo"' } },
      remember: [P('Etiqueta: ', { c: 'p' }, '; clase: ', { c: '.nombre' }, '; id: ', { c: '#nombre' }, '.'), P('Una clase se reutiliza; un id es único.'), P('En el HTML: ', { c: 'class="nota"' }, ' y ', { c: 'id="titulo"' }, '.')],
      tip: 'Prefiere clases para dar estilos: son más fáciles de reutilizar que los id.',
      quiz: [
        { prompt: '¿Qué selector elige elementos con class="boton"?', code: ['___ { color: white; }'], options: ['.boton', '#boton', 'boton', '*boton'], answer: 0, explain: 'Las clases se seleccionan con punto.' },
        { prompt: '¿Qué selector elige el elemento con id="menu"?', code: ['___ { display: flex; }'], options: ['#menu', '.menu', 'menu', '@menu'], answer: 0, explain: 'Los id se seleccionan con numeral (#).' },
        { prompt: '¿Qué afecta el selector h2?', code: ['h2 { color: navy; }'], options: ['Todos los <h2>', 'Solo el primer <h2>', 'Las clases h2', 'Nada'], answer: 0, explain: 'Un selector de etiqueta afecta a todas esas etiquetas.' }
      ]
    },
    'css:Propiedades y valores': {
      paras: [P('Dentro de las llaves escribes ', { b: 'propiedad: valor;' }, '. La propiedad es lo que cambias (color, tamaño, fondo) y el valor es cómo lo quieres.'),
              P('Cada declaración termina con ', { c: ';' }, '. Si olvidas uno, el navegador puede ignorar esa línea y la siguiente.')],
      diagram: { parts: [{ t: 'color', label: 'propiedad', kind: 'name' }, { t: ':', label: 'separa', kind: 'op' }, { t: 'crimson', label: 'valor', kind: 'value' }], caption: 'color: crimson;' },
      example: { file: 'estilos.css', lines: ['h1 {', '  color: white;', '  background-color: #7A1A35;', '  font-size: 32px;', '  padding: 12px;', '  text-align: center;', '}'], output: ['[Título] letras blancas sobre fondo vino', '[Título] 32 px, con relleno de 12 px y centrado'] },
      tryit: { label: 'Pruébalo: elige un color de fondo', file: 'estilos.css', choices: ['crimson', 'gold', 'navy'], lines: ['body {', '  background-color: {v};', '}'], output: 'El fondo de la página se pone {v}' },
      remember: [P('Forma: ', { c: 'propiedad: valor;' }, '.'), P('Los colores pueden ser nombres (', { c: 'red' }, ') o códigos (', { c: '#7A1A35' }, ').'), P('Los tamaños llevan unidad: ', { c: '16px' }, '.')],
      tip: 'En el editor de AGbyte (CSS) la vista previa cambia al instante: experimenta con valores.',
      quiz: [
        { prompt: '¿Qué está mal aquí?', code: ['p {', '  color red;', '}'], options: ['Faltan los dos puntos', 'Sobran las llaves', 'red no es un color', 'Nada'], answer: 0, explain: 'Se escribe color: red; con dos puntos.' },
        { prompt: '¿Qué propiedad cambia el color del fondo?', code: ['___: gold;'], options: ['background-color', 'color', 'font-color', 'fill'], answer: 0, explain: 'background-color es el fondo; color es el texto.' },
        { prompt: '¿Con qué termina cada declaración?', code: ['font-size: 20px___'], options: [';', '.', ',', ':'], answer: 0, explain: 'Cada declaración termina en punto y coma.' }
      ]
    },
    'css:Formas de aplicar CSS': {
      paras: [P('Hay tres formas: ', { b: 'en línea' }, ' con el atributo ', { c: 'style="..."' }, '; ', { b: 'interna' }, ' con ', { c: '<style>' }, ' en el ', { c: '<head>' }, '; y ', { b: 'externa' }, ' con un archivo ', { c: '.css' }, ' enlazado con ', { c: '<link>' }, '.'),
              P('La externa es la mejor: un solo archivo da estilo a todas tus páginas y mantiene el HTML limpio.')],
      example: { file: 'index.html', lines: ['<head>', '  <link rel="stylesheet" href="estilos.css">', '  <style>', '    h1 { color: navy; }', '  </style>', '</head>', '<body>', '  <h1>Título azul</h1>', '  <p style="color: crimson;">Párrafo carmesí</p>', '</body>'], output: ['[Título] azul marino (CSS interno)', '[Párrafo] carmesí (CSS en línea)', 'estilos.css se aplica a toda la página (CSS externo)'] },
      tryit: { label: 'Pruébalo: elige la forma de aplicar CSS', file: 'index.html', choices: ['en línea', 'interna', 'externa'], lines: ['<!-- CSS {v} -->'], outputs: { 'en línea': '<p style="color: red;">…</p>  → solo ese elemento', 'interna': '<style> p { color: red; } </style>  → solo esta página', 'externa': '<link rel="stylesheet" href="estilos.css">  → todas tus páginas' } },
      remember: [P('Externa: la recomendada.'), P({ c: '<link>' }, ' va en el ', { c: '<head>' }, '.'), P('Si hay conflicto, gana el estilo en línea.')],
      tip: 'Usa el estilo en línea solo para pruebas rápidas; luego pásalo a tu archivo .css.',
      quiz: [
        { prompt: '¿Qué etiqueta enlaza un archivo CSS externo?', code: ['<___ rel="stylesheet" href="estilos.css">'], options: ['link', 'style', 'css', 'a'], answer: 0, explain: '<link rel="stylesheet"> enlaza la hoja de estilos.' },
        { prompt: '¿Cuál es la forma recomendada para un sitio con varias páginas?', code: ['/* Elige una */'], options: ['CSS externo', 'CSS en línea', 'CSS interno en cada página', 'Sin CSS'], answer: 0, explain: 'Un archivo externo da estilo a todas las páginas a la vez.' },
        { prompt: '¿Dónde va la etiqueta <style>?', code: ['<style> … </style>'], options: ['En el <head>', 'Al final del archivo CSS', 'Dentro de un <p>', 'En la pestaña'], answer: 0, explain: 'El CSS interno se escribe dentro de <style> en el <head>.' }
      ]
    },
    /* ===== SQL · Módulo 1: Introducción a bases de datos ===== */
    'sql:Tablas, registros y campos': {
      paras: [P('Una base de datos guarda la información en ', { b: 'tablas' }, '. Cada ', { b: 'campo' }, ' (columna) es un dato, como nombre o ciudad, y cada ', { b: 'registro' }, ' (fila) es un elemento completo, como un cliente.'),
              P('Con ', { c: 'SELECT * FROM tabla;' }, ' ves todos los campos y registros. El asterisco significa «todas las columnas».')],
      example: { file: 'consulta.sql', lines: ['-- Todos los clientes', 'SELECT * FROM clientes;'], output: ['id | nombre | ciudad', '---+--------+---------', '1  | Ana    | Lima', '2  | Luis   | Arequipa', '3  | Sofía  | Cusco', '4  | Diego  | Lima', '(4 filas)'] },
      tryit: { label: 'Pruébalo: elige qué campo ver del cliente 1', file: 'consulta.sql', choices: ['nombre', 'ciudad', 'id'], lines: ['SELECT {v} FROM clientes WHERE id = 1;'], outputs: { 'nombre': 'nombre\n------\nAna\n(1 fila)', 'ciudad': 'ciudad\n------\nLima\n(1 fila)', 'id': 'id\n--\n1\n(1 fila)' } },
      remember: [P('Tabla = conjunto de datos de un mismo tipo.'), P('Campo = columna; registro = fila.'), P('Cada consulta termina con ', { c: ';' }, '.')],
      tip: 'En el editor, la tabla clientes tiene 4 registros: pruébala con SELECT * FROM clientes;',
      quiz: [
        { prompt: 'En una tabla de alumnos, ¿qué es un registro?', code: ['-- alumnos(id, nombre, nota)'], options: ['Un alumno completo (una fila)', 'La columna nota', 'El nombre de la tabla', 'La base de datos'], answer: 0, explain: 'Un registro es una fila: todos los datos de un alumno.' },
        { prompt: '¿Qué significa * en SELECT * FROM frutas?', code: ['SELECT * FROM frutas;'], options: ['Todas las columnas', 'Multiplicar', 'Solo la primera columna', 'Ninguna columna'], answer: 0, explain: 'El asterisco pide todas las columnas.' },
        { prompt: 'La tabla clientes tiene id, nombre y ciudad. ¿Cuántos campos son?', code: ['-- clientes(id, nombre, ciudad)'], options: ['3', '4', '1', '2'], answer: 0, explain: 'Cada columna es un campo: id, nombre y ciudad.' }
      ]
    },
    'sql:Claves primarias y foráneas': {
      paras: [P('La ', { b: 'clave primaria' }, ' (PRIMARY KEY) identifica cada registro de forma única, como el ', { c: 'id' }, ' de un cliente. No se repite ni puede estar vacía.'),
              P('Una ', { b: 'clave foránea' }, ' es un campo que apunta a la clave primaria de otra tabla. En ', { c: 'pedidos' }, ', el campo ', { c: 'cliente_id' }, ' dice qué cliente hizo cada pedido.')],
      diagram: { parts: [{ t: 'pedidos.cliente_id', label: 'clave foránea', kind: 'name' }, { t: '→', label: 'apunta a', kind: 'op' }, { t: 'clientes.id', label: 'clave primaria', kind: 'value' }], caption: 'Cada pedido sabe de qué cliente es.' },
      example: { file: 'consulta.sql', lines: ['-- Pedidos del cliente con id 1 (Ana)', 'SELECT * FROM pedidos', 'WHERE cliente_id = 1;'], output: ['id | cliente_id | fruta_id | cantidad | fecha', '---+------------+----------+----------+-----------', '1  | 1          | 1        | 3        | 2026-10-01', '2  | 1          | 2        | 1        | 2026-10-03', '(2 filas)'] },
      tryit: { label: 'Pruébalo: elige un cliente', file: 'consulta.sql', choices: ['1', '2', '4'], lines: ['SELECT id, cantidad FROM pedidos', 'WHERE cliente_id = {v};'], outputs: { '1': 'id | cantidad\n---+---------\n1  | 3\n2  | 1\n(2 filas)', '2': 'id | cantidad\n---+---------\n3  | 6\n(1 fila)', '4': 'id | cantidad\n---+---------\n5  | 5\n(1 fila)' } },
      remember: [P('Clave primaria: única por registro.'), P('Clave foránea: apunta a otra tabla.'), P('Así se evitan datos repetidos.')],
      tip: 'Por convención, las claves foráneas se llaman como la tabla en singular + _id: cliente_id.',
      quiz: [
        { prompt: '¿Qué característica tiene una clave primaria?', code: ['id INTEGER PRIMARY KEY'], options: ['No se repite', 'Siempre es texto', 'Puede estar vacía', 'Se repite en cada fila'], answer: 0, explain: 'Identifica cada registro de forma única.' },
        { prompt: 'En pedidos, ¿qué es fruta_id?', code: ['-- pedidos(id, cliente_id, fruta_id, ...)'], options: ['Una clave foránea a frutas', 'La clave primaria de pedidos', 'El precio', 'El nombre de la fruta'], answer: 0, explain: 'fruta_id apunta al id de la tabla frutas.' },
        { prompt: '¿Para qué sirven las claves foráneas?', code: ['-- Elige una'], options: ['Para relacionar tablas', 'Para ordenar resultados', 'Para borrar datos', 'Para cambiar contraseñas'], answer: 0, explain: 'Conectan un registro con otro de otra tabla.' }
      ]
    },
    'sql:Relaciones entre tablas': {
      paras: [P('Las tablas se ', { b: 'relacionan' }, ' a través de sus claves. Un cliente puede tener muchos pedidos: es una relación ', { b: 'uno a muchos' }, '.'),
              P('Con ', { c: 'JOIN' }, ' juntas tablas relacionadas en una sola consulta: indicas qué campos coinciden con ', { c: 'ON' }, '. Lo verás a fondo en el módulo de JOIN.')],
      example: { file: 'consulta.sql', lines: ['-- ¿Qué frutas pidió Ana?', 'SELECT c.nombre, f.nombre AS fruta, p.cantidad', 'FROM pedidos p', 'JOIN clientes c ON c.id = p.cliente_id', 'JOIN frutas f ON f.id = p.fruta_id', "WHERE c.nombre = 'Ana';"], output: ['nombre | fruta | cantidad', '-------+-------+---------', 'Ana    | mango | 3', 'Ana    | fresa | 1', '(2 filas)'] },
      tryit: { label: 'Pruébalo: elige un cliente', file: 'consulta.sql', choices: ['Luis', 'Sofía', 'Diego'], lines: ['SELECT f.nombre AS fruta, p.cantidad', 'FROM pedidos p', 'JOIN clientes c ON c.id = p.cliente_id', 'JOIN frutas f ON f.id = p.fruta_id', "WHERE c.nombre = '{v}';"], outputs: { 'Luis': 'fruta   | cantidad\n--------+---------\nplátano | 6\n(1 fila)', 'Sofía': 'fruta    | cantidad\n---------+---------\nmaracuyá | 2\n(1 fila)', 'Diego': 'fruta | cantidad\n------+---------\nmango | 5\n(1 fila)' } },
      remember: [P('Uno a muchos: un cliente, muchos pedidos.'), P({ c: 'JOIN ... ON' }, ' une tablas por sus claves.'), P('Los alias (', { c: 'p' }, ', ', { c: 'c' }, ', ', { c: 'f' }, ') acortan los nombres.')],
      tip: 'Dibuja tus tablas con flechas entre las claves: entenderás las relaciones de un vistazo.',
      quiz: [
        { prompt: '¿Qué tipo de relación hay entre clientes y pedidos?', code: ['-- un cliente puede tener muchos pedidos'], options: ['Uno a muchos', 'Uno a uno', 'Ninguna', 'Muchos a ninguno'], answer: 0, explain: 'Cada cliente puede tener varios pedidos.' },
        { prompt: '¿Qué palabra une tablas en una consulta?', code: ['SELECT ... FROM pedidos ___ clientes ON ...'], options: ['JOIN', 'UNION', 'LINK', 'WITH'], answer: 0, explain: 'JOIN combina filas de tablas relacionadas.' },
        { prompt: '¿Qué indica ON en un JOIN?', code: ['JOIN clientes c ON c.id = p.cliente_id'], options: ['Qué campos deben coincidir', 'El orden del resultado', 'Cuántas filas mostrar', 'El nombre de la tabla'], answer: 0, explain: 'ON dice qué columnas conectan ambas tablas.' }
      ]
    },
    /* ===== C++ · Módulo 1: Fundamentos ===== */
    'cpp:Tu primer programa': {
      paras: [P('Un programa en C++ empieza en la función ', { c: 'main()' }, '. Antes incluyes las librerías que usarás: ', { c: '#include <iostream>' }, ' para mostrar texto.'),
              P('Con ', { c: 'std::cout <<' }, ' envías texto a la pantalla y con ', { c: 'std::endl' }, ' (o ', { c: '"\\n"' }, ') saltas de línea. ', { c: 'return 0;' }, ' indica que todo terminó bien.')],
      example: { file: 'main.cpp', lines: ['#include <iostream>', '', 'int main() {', '  std::cout << "¡Hola!" << std::endl;', '  std::cout << "Aprendo " << "C++" << "\\n";', '  std::cout << 6 * 7 << std::endl;', '  return 0;', '}'], output: ['¡Hola!', 'Aprendo C++', '42'] },
      tryit: { label: 'Pruébalo: elige un mensaje', file: 'main.cpp', choices: ['Hola', 'Buenas', 'Qué tal'], lines: ['std::cout << "{v}, mundo" << std::endl;'], output: '{v}, mundo' },
      remember: [P('Cada instrucción termina con ', { c: ';' }, '.'), P('Puedes encadenar varios ', { c: '<<' }, ' en una línea.'), P('Sin ', { c: 'std::endl' }, ' o ', { c: '"\\n"' }, ' no hay salto de línea.')],
      tip: 'Si ves «cout was not declared», te faltó #include <iostream> o el prefijo std::.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['std::cout << "A" << "B";'], options: ['AB', 'A B', 'A y B en dos líneas', 'Un error'], answer: 0, explain: 'Sin salto de línea ni espacios, todo sale junto: AB.' },
        { prompt: '¿Qué librería necesitas para usar std::cout?', code: ['#include <___>'], options: ['iostream', 'stdio.py', 'console', 'string'], answer: 0, explain: '<iostream> trae cout y cin.' },
        { prompt: '¿Qué muestra este código?', code: ['std::cout << 3 + 4;'], options: ['7', '3 + 4', '34', 'Un error'], answer: 0, explain: 'Sin comillas, C++ calcula: 7.' }
      ]
    },
    'cpp:Variables y tipos': {
      paras: [P('En C++ declaras el tipo de cada variable: ', { c: 'int' }, ' (enteros), ', { c: 'double' }, ' (decimales), ', { c: 'char' }, ' (un carácter), ', { c: 'bool' }, ' (', { c: 'true' }, '/', { c: 'false' }, ') y ', { c: 'std::string' }, ' (texto, con ', { c: '#include <string>' }, ').'),
              P('Al mostrar un ', { c: 'bool' }, ' con cout verás ', { c: '1' }, ' (true) o ', { c: '0' }, ' (false).')],
      example: { file: 'main.cpp', lines: ['#include <iostream>', '#include <string>', '', 'int main() {', '  std::string nombre = "Luis";', '  int edad = 16;', '  double altura = 1.72;', "  char inicial = 'L';", '  bool estudia = true;', '  edad = edad + 1;', '  std::cout << nombre << " (" << inicial << ") tiene " << edad << " años\\n";', '  std::cout << altura << " " << estudia << std::endl;', '  return 0;', '}'], output: ['Luis (L) tiene 17 años', '1.72 1'] },
      tryit: { label: 'Pruébalo: elige un número de vidas', file: 'main.cpp', choices: ['1', '3', '5'], lines: ['int vidas = {v};', 'vidas = vidas - 1;', 'std::cout << "Te quedan " << vidas << " vidas" << std::endl;'], outputs: { '1': 'Te quedan 0 vidas', '3': 'Te quedan 2 vidas', '5': 'Te quedan 4 vidas' } },
      remember: [P('Forma: ', { c: 'tipo nombre = valor;' }, '.'), P({ c: 'char' }, ' usa comillas simples; ', { c: 'std::string' }, ', dobles.'), P('Un bool se muestra como 1 o 0.')],
      tip: 'Inicializa siempre tus variables: en C++ una variable sin valor puede tener «basura».',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['bool listo = false;', 'std::cout << listo;'], options: ['0', 'false', '1', 'Un error'], answer: 0, explain: 'cout muestra false como 0.' },
        { prompt: '¿Qué tipo guarda un solo carácter?', code: ["___ letra = 'A';"], options: ['char', 'string', 'int', 'bool'], answer: 0, explain: 'char guarda un carácter entre comillas simples.' },
        { prompt: '¿Qué muestra este código?', code: ['int x = 4;', 'x = x * x;', 'std::cout << x;'], options: ['16', '8', '4', 'x * x'], answer: 0, explain: 'x pasa a valer 4 × 4 = 16.' }
      ]
    },
    'cpp:Operadores': {
      paras: [P('Aritméticos: ', { c: '+ - * / %' }, '. Entre enteros, ', { c: '/' }, ' descarta los decimales: ', { c: '7 / 2' }, ' es 3. Usa ', { c: '7.0 / 2' }, ' para obtener 3.5.'),
              P({ c: 'x++' }, ' suma 1 y ', { c: 'x += 5' }, ' suma 5. Las comparaciones (', { c: '== != < >' }, ') y los lógicos (', { c: '&& || !' }, ') devuelven 1 o 0 al mostrarlos.')],
      example: { file: 'main.cpp', lines: ['#include <iostream>', '', 'int main() {', '  std::cout << 7 / 2 << " " << 7.0 / 2 << " " << 7 % 2 << std::endl;', '  int puntos = 10;', '  puntos++;', '  puntos += 4;', '  std::cout << puntos << std::endl;', '  std::cout << (puntos > 12 && puntos < 20) << std::endl;', '  return 0;', '}'], output: ['3 3.5 1', '15', '1'] },
      tryit: { label: 'Pruébalo: elige un número y mira el resto entre 3', file: 'main.cpp', choices: ['9', '10', '11'], lines: ['int n = {v};', 'std::cout << n % 3 << std::endl;'], outputs: { '9': '0', '10': '1', '11': '2' } },
      remember: [P('Entre enteros, la división no tiene decimales.'), P({ c: '%' }, ' da el resto (solo con enteros).'), P('Pon paréntesis al mostrar comparaciones con cout.')],
      tip: 'std::cout << std::boolalpha << true; muestra «true» en vez de 1.',
      quiz: [
        { prompt: '¿Qué muestra este código?', code: ['std::cout << 9 / 4;'], options: ['2', '2.25', '3', '2.0'], answer: 0, explain: 'Entre enteros la división descarta decimales: 2.' },
        { prompt: '¿Qué muestra este código?', code: ['int a = 1;', 'a += 2;', 'a++;', 'std::cout << a;'], options: ['4', '3', '2', '1'], answer: 0, explain: '1 + 2 = 3, y ++ lo lleva a 4.' },
        { prompt: '¿Qué muestra este código?', code: ['std::cout << (5 == 5);'], options: ['1', 'true', '5', '0'], answer: 0, explain: 'La comparación es verdadera y cout la muestra como 1.' }
      ]
    },
    'cpp:Entrada y salida': {
      paras: [P('Con ', { c: 'std::cin >>' }, ' lees lo que escribe el usuario y lo guardas en una variable. Lee hasta el primer espacio.'),
              P('Para leer una línea completa (con espacios) usa ', { c: 'std::getline(std::cin, texto)' }, '. En AGbyte escribe tus datos en «Entrada del programa».')],
      example: { file: 'main.cpp', stdin: 'Ana\n15', lines: ['#include <iostream>', '#include <string>', '', 'int main() {', '  std::string nombre;', '  int edad;', '  std::cout << "¿Cómo te llamas? ";', '  std::cin >> nombre;', '  std::cout << "¿Cuántos años tienes? ";', '  std::cin >> edad;', '  std::cout << "Hola, " << nombre << ". El próximo año tendrás " << edad + 1 << std::endl;', '  return 0;', '}'], output: ['¿Cómo te llamas? Ana', '¿Cuántos años tienes? 15', 'Hola, Ana. El próximo año tendrás 16'] },
      tryit: { label: 'Pruébalo: elige lo que escribe el usuario', file: 'main.cpp', choices: ['4', '10', '25'], lines: ['int n;', 'std::cin >> n;', 'std::cout << "El doble es " << n * 2 << std::endl;'], outputs: { '4': 'El doble es 8', '10': 'El doble es 20', '25': 'El doble es 50' } },
      remember: [P({ c: 'cin >>' }, ' lee una palabra o un número.'), P({ c: 'getline' }, ' lee la línea completa.'), P('Las flechas apuntan hacia donde va el dato: ', { c: 'cout <<' }, ', ', { c: 'cin >>' }, '.')],
      tip: 'Si mezclas cin >> y getline, usa std::cin.ignore() antes del getline.',
      quiz: [
        { prompt: '¿Qué lee std::cin >> nombre si escribes «Ana María»?', code: ['std::cin >> nombre;'], options: ['Ana', 'Ana María', 'María', 'Nada'], answer: 0, explain: 'cin >> se detiene en el primer espacio.' },
        { prompt: '¿Cómo lees una línea completa?', code: ['std::string linea;'], options: ['std::getline(std::cin, linea);', 'std::cin >> linea;', 'std::read(linea);', 'input(linea);'], answer: 0, explain: 'getline lee hasta el final de la línea, con espacios.' },
        { prompt: '¿Hacia dónde apuntan las flechas en cin?', code: ['std::cin >> x;'], options: ['Hacia la variable: >>', 'Hacia la pantalla: <<', 'No llevan flechas', 'Hacia ambos lados'], answer: 0, explain: 'El dato va de cin hacia la variable: cin >> x.' }
      ]
    },
    /* @@LECCIONES-FIN@@ */
    'fin': null
  };
  function print_paren() { return 'Las instrucciones como print llevan paréntesis.'; }

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
  function apiPost(path, body) {
    return getToken().then(function (tok) {
      return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AGbyte-Token': tok }, body: JSON.stringify(body || {}) });
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
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
        avatar: a.avatar || '', google: a.google ? a.google.email : '' };
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
    /* Cuenta de Google (el servidor de AGbyte hace el flujo oficial en tu navegador) */
    googleStatus: function () {
      return fetch('/api/google/status', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('sin api'); return r.json(); })
        .catch(function () { return { noServer: true }; });
    },
    googleSaveConfig: function (cfg) { return apiPost('/api/google/config', cfg); },
    googleStart: function () { return apiPost('/api/google/start', {}); },
    googleResult: function (st) { return apiPost('/api/google/result', { state: st }); },
    openExternal: function (url) { return apiPost('/api/open', { url: url }).catch(function () { window.open(url, '_blank'); }); },
    loginGoogle: function (p) {
      var email = String(p.email || '').trim().toLowerCase();
      var a = state.accounts[email], isNew = !a;
      if (!a) { a = blankAccount(p.name || email.split('@')[0], email); state.accounts[email] = a; }
      a.google = { email: email, sub: p.sub || '', since: (a.google && a.google.since) || today() };
      if (p.picture && (!a.avatar || a.avatarSource === 'google')) { a.avatar = p.picture; a.avatarSource = 'google'; }
      state.session = email; save();
      return { account: a, isNew: isNew };
    },
    linkGoogle: function (p) {
      var a = acct(), email = String(p.email || '').trim().toLowerCase();
      a.google = { email: email, sub: p.sub || '', since: today() };
      if (p.picture && !a.avatar) { a.avatar = p.picture; a.avatarSource = 'google'; }
      save(); return a;
    },
    unlinkGoogle: function () { var a = acct(); delete a.google; save(); },
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
