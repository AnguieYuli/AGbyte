AGbyte — Cómo agregar, editar o eliminar lecciones
====================================================

Todo el contenido de los cursos (módulos, lecciones, teoría, ejemplos y quiz) vive en esta
carpeta, como archivos JSON planos. NO hace falta tocar codyu-store.js ni ningún otro archivo
del programa para cambiar lecciones: basta con editar estos .json y guardar.

AGbyte los lee cada vez que abres la app (o recargas la página), directamente desde aquí.


Archivos de esta carpeta
-------------------------
- _catalogo.json        Lista, en orden, los cursos que existen (sus ids). Define qué cursos
                         aparecen en "Mis cursos" y en qué orden.
- python.json           Curso de Python: módulos + contenido de cada lección.
- java.json             Curso de Java.
- javascript.json       Curso de JavaScript.
- html.json             Curso de HTML.
- css.json              Curso de CSS.
- sql.json               Curso de SQL.
- cpp.json              Curso de C++.

Cada curso es independiente: puedes editar uno sin tocar los demás.


1) Agregar una lección nueva a un curso que ya existe
------------------------------------------------------
Abre el .json del curso (por ejemplo python.json) y:

a) Agrega el TÍTULO de la lección en el arreglo "lessons" del módulo donde quieras que aparezca:

    {
      "title": "Fundamentos",
      "desc": "Variables, tipos de datos, operadores, entrada y salida.",
      "lessons": [
        "¿Qué es programar?",
        "Tu primer print()",
        "Mi lección nueva"        <-- la agregas aquí, en el orden en que debe aparecer
      ]
    }

b) Agrega el CONTENIDO de esa lección dentro de "lessons" (el diccionario grande al final del
   archivo), usando EXACTAMENTE el mismo texto como clave:

    "lessons": {
      "Mi lección nueva": {
        "paras": [
          ["Un párrafo de teoría. Puedes resaltar código así: ", {"c": "print()"}, " dentro del texto."],
          ["Puedes poner negrita con ", {"b": "una palabra en negrita"}, "."]
        ],
        "example": {
          "file": "ejemplo.py",
          "lines": ["print(\"Hola\")"],
          "output": ["Hola"]
        },
        "tryit": {
          "label": "Pruébalo: elige un valor y ejecuta",
          "file": "prueba.py",
          "choices": ["A", "B", "C"],
          "lines": ["print(\"{v}\")"],
          "output": "{v}"
        },
        "remember": [
          ["Primer punto para recordar."],
          ["Segundo punto, con ", {"c": "código"}, " incluido."]
        ],
        "tip": "Un consejo corto para el estudiante.",
        "quiz": [
          {
            "prompt": "¿Pregunta de opción múltiple?",
            "code": ["print(\"ejemplo\")"],
            "options": ["Opción correcta", "Opción B", "Opción C", "Opción D"],
            "answer": 0,
            "explain": "Por qué la opción 0 es la correcta."
          }
        ]
      }
    }

   Si una lección NO tiene entrada en "lessons" (content), AGbyte simplemente no muestra teoría/quiz
   para ella (igual que pasaba antes con las lecciones "pendientes" de este curso). No es un error.


2) Editar una lección existente
---------------------------------
Busca su título dentro de "lessons" (el diccionario de contenido) y cambia lo que necesites:
paras, example, tryit, remember, tip o quiz. También puedes renombrar el título de una lección,
pero si lo haces, cambia el texto en LOS DOS lugares: en el módulo ("lessons": [...]) y en la
clave del contenido ("lessons": { "...": {...} }), para que sigan coincidiendo.


3) Eliminar una lección
--------------------------
Quita su título del arreglo "lessons" del módulo. Puedes dejar (o borrar) su entrada de contenido;
si ya no aparece en ningún módulo, simplemente no se usa.

Aviso: el progreso guardado de cada persona (qué lección va) se guarda como un número de posición
dentro del curso. Si borras o reordenas lecciones en medio de un curso, quienes ya tenían progreso
guardado podrían ver que su "lección actual" cambia. Para evitar sorpresas, lo más seguro es agregar
lecciones nuevas al FINAL de un módulo (o del curso) en vez de insertarlas en medio.


4) Agregar un curso/lenguaje totalmente nuevo
------------------------------------------------
a) Copia un archivo existente (por ejemplo css.json) con un nombre nuevo, ej. "ruby.json".
b) Cambia "id", "name", "title", "glyph", "tileBg", "tileFg", "ext" y "blurb" por los del nuevo curso.
c) Reemplaza "modules" y "lessons" por los módulos/lecciones del curso nuevo.
d) Agrega el id ("ruby") a la lista de _catalogo.json.

Con eso el curso aparece en la app automáticamente: no se toca ningún archivo .java ni .js.

Nota: para que el botón "Ejecutar" funcione con un lenguaje nuevo, ese lenguaje también debe estar
soportado por el ejecutor de AGbyte (hoy: Python, Java, C++ y SQL). Un curso de un lenguaje no
soportado por el ejecutor puede igual tener teoría, ejemplos y quiz; solo no podrá ejecutar código
real en el editor.


Referencia rápida de los campos de una lección (todos son opcionales)
------------------------------------------------------------------------
paras      Lista de párrafos de teoría. Cada párrafo es una lista de "trozos": un texto plano
           ("así"), o un objeto para resaltar: {"c": "texto en código"} o {"b": "texto en negrita"}.

diagram    (opcional) Un pequeño diagrama de piezas con etiqueta, usado en algunas lecciones de
           variables. Tiene "parts": [{"t": "...", "label": "...", "kind": "name|op|value"}] y
           "caption": "...".

example    Un bloque de código de ejemplo: {"file": "nombre.ext", "lines": [...], "output": [...]}.
           "stdin" (opcional) simula lo que escribiría el usuario si el ejemplo usa entrada de datos.

tryit      Una variante interactiva del ejemplo: el estudiante elige un valor de "choices" y ve el
           resultado. "output" (un texto con "{v}") o "outputs" (un objeto por cada choice).

remember   Lista de frases clave para recordar (mismo formato que "paras", pero más cortas).

tip        Un consejo corto en texto plano.

quiz       Lista de preguntas de opción múltiple:
           {"prompt": "...", "code": [...] (opcional), "options": [...], "answer": <índice de la
           opción correcta, empezando en 0>, "explain": "por qué es correcta"}.


Formato de cada archivo de curso (python.json, java.json, ...)
------------------------------------------------------------------
{
  "id": "python",            identificador interno del curso (no lo cambies sin cambiar también
                              su entrada en _catalogo.json)
  "name": "Python",          nombre corto, se muestra en varios lados
  "title": "Python: de cero a avanzado",   título largo de la portada del curso
  "glyph": "py",              texto corto del icono del curso
  "tileBg": "#3776AB",        color de fondo del icono
  "tileFg": "#FFE873",        color del texto/símbolo del icono
  "ext": "py",                 extensión de archivo que usa el editor para este curso
  "blurb": "...",             frase corta de presentación del curso
  "modules": [                 lista de módulos, en el orden en que aparecen
    { "title": "...", "desc": "...", "lessons": ["Título 1", "Título 2", ...] }
  ],
  "lessons": {                 contenido de cada lección, por título exacto (ver sección 1b)
    "Título 1": { ...paras, example, tryit, remember, tip, quiz... }
  }
}
