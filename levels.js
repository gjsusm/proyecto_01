/***********************************************************************
 * BANCO DE NIVELES PYQUEST PRO - PARTE 3A (NIVELES 1 AL 4)
 ***********************************************************************/
const LEVEL_DATA = [
  // =====================================================================
  // NIVEL 1: PRE-NOVATO (20 EJERCICIOS + JEFE 1 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "pre_novato",
    number: 1,
    name: "Pre-Novato",
    role: "Recluta de la Red",
    color: "cyan",
    icon: "🛰️",
    description: "Domina la sintaxis elemental: salida por consola, variables, conversión de tipos y operadores.",
    boss: {
      name: "El Guardián del Firewall",
      avatar: "🤖",
      lore: "El Guardián bloquea la puerta de enlace del Sector 01. Recibes datos crudos de un agente en texto y números. Debes transformar los tipos, calcular su potencia real y emitir la credencial oficial.",
      combatRule: "Restricción Táctica (AST): Prohibido escribir el número literal 150 en tu código; debes calcularlo dinámicamente con las variables.",
      problemSpec: {
        objective: "Calcula la variable 'potencia_total' e imprime la credencial formateada.",
        rules: [
          "Convierte 'energia_txt' a entero, multiplícalo por 'multiplicador' y súmale 'bono'. Guarda el resultado en 'potencia_total'.",
          "Capitaliza 'agente_crudo' ('Kael') e imprime exactamente: AGENTE: Kael | POTENCIA: 150"
        ],
        expectedOutput: "AGENTE: Kael | POTENCIA: 150"
      },
      starterCode: `# NODO JEFE 1: El Guardián del Firewall\nagente_crudo = "kael"\nenergia_txt = "45"\nmultiplicador = 3\nbono = 15\n\n# Escribe tu solución aquí abajo:\n`,
      solutionCode: `agente_crudo = "kael"\nenergia_txt = "45"\nmultiplicador = 3\nbono = 15\n\npotencia_total = int(energia_txt) * multiplicador + bono\nprint(f"AGENTE: {agente_crudo.capitalize()} | POTENCIA: {potencia_total}")`,
      hints: [
        { cost: 50, text: "Pista 1: Convierte 'energia_txt' con int(energia_txt) antes de multiplicar por 'multiplicador' y sumar 'bono'." },
        { cost: 100, text: "Pista 2: Usa print(f\"AGENTE: {agente_crudo.capitalize()} | POTENCIA: {potencia_total}\")." }
      ],
      shields: [
        {
          name: "Escudo 1: Regla AST",
          validatePy: `
import ast
_tree = ast.parse(_user_code)
_lit = [n.value for n in ast.walk(_tree) if isinstance(n, ast.Constant) and n.value == 150]
assert len(_lit) == 0, "Violación Táctica: No escribas 150 directamente; calcúlalo con las variables."
assert 'potencia_total' in globals(), "Falta definir la variable 'potencia_total'."
`
        },
        {
          name: "Escudo 2: Lote Visible",
          validatePy: `
assert potencia_total == 150, f"Se esperaba potencia_total == 150, pero obtuviste {potencia_total}."
assert "AGENTE: Kael | POTENCIA: 150" in _captured_stdout, "La salida debe ser exactamente: AGENTE: Kael | POTENCIA: 150"
`
        },
        {
          name: "Escudo 3: Prueba Ciega",
          validatePy: `
_env = {}
exec(_user_code.replace('"45"', '"20"').replace('bono = 15', 'bono = 5'), _env)
assert _env.get('potencia_total') == 65, "Fallo en prueba ciega: tu fórmula no calculó dinámicamente con energia_txt='20' y bono=5."
`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "Primera Transmisión", theory: "En Python usamos <code>print()</code> para enviar mensajes a la consola.", prompt: "Muestra el mensaje en pantalla:", template: ["___", "(\"Sistema en línea\")"], answers: ["print"], options: ["print", "echo", "console", "mostrar"], explanation: "print() muestra en consola lo que pongas entre paréntesis." },
      { type: "fill_blank", title: "Cadenas de Texto (Strings)", theory: "Los textos (<code>str</code>) van rodeados por comillas dobles <code>\" \"</code> o simples <code>' '</code>.", prompt: "Declara el texto del sector actual:", template: ["sector = ", "___", "Sector Norte", "___"], answers: ["\"", "\""], options: ["\"", "\"", "(", ")"], explanation: "Las comillas indican que es texto literal." },
      { type: "multiple_choice", title: "Identificando Variables", theory: "Una variable guarda datos en memoria usando el signo <code>=</code>.", prompt: "¿Cuál línea crea correctamente la variable <code>escudo</code> con valor <code>100</code>?", codePreview: "# Selecciona la sintaxis válida", choices: ["escudo = 100", "var escudo := 100", "100 = escudo", "int escudo == 100"], correctIndex: 0, explanation: "En Python basta con escribir nombre = valor." },
      { type: "fill_blank", title: "Números Enteros (int)", theory: "Los números enteros (<code>int</code>) se escriben sin comillas.", prompt: "Asigna 3 núcleos al reactor:", template: ["nucleos ", "___", " ", "___"], answers: ["=", "3"], options: ["=", "3", "\"3\"", "=="], explanation: "3 sin comillas es un número operable." },
      { type: "fill_blank", title: "Números Decimales (float)", theory: "Los decimales (<code>float</code>) usan el punto <code>.</code> y nunca la coma.", prompt: "Registra la frecuencia en 98.6:", template: ["frecuencia = ", "___"], answers: ["98.6"], options: ["98.6", "98,6", "\"98,6\"", "float(98,6)"], explanation: "Python usa punto decimal." },
      { type: "fill_blank", title: "Booleanos (bool)", theory: "El tipo <code>bool</code> solo admite <code>True</code> o <code>False</code> (con inicial mayúscula).", prompt: "Activa el protocolo de sigilo:", template: ["sigilo_activo = ", "___"], answers: ["True"], options: ["True", "true", "\"True\"", "TRUE"], explanation: "True y False inician con mayúscula." },
      { type: "order_lines", title: "Reasignación Secuencial", theory: "El código se ejecuta de arriba hacia abajo; la variable conserva el último valor asignado.", prompt: "Ordena para iniciar bateria en 50, actualizarla a 100 e imprimirla:", lines: ["bateria = 50", "bateria = 100", "print(bateria)"], explanation: "Se inicializa, se actualiza y finalmente imprime 100." },
      { type: "bug_hunt", title: "Caza de Bugs: Nombre Inválido", theory: "Los nombres de variables no admiten espacios; usamos guion bajo (<code>snake_case</code>).", prompt: "¿Cómo corriges la línea defectuosa?", buggyCode: "1 | piloto = 'Nova'\n2 | nivel energia = 85\n3 | print(piloto)", choices: ["Cambiar línea 2 por: nivel_energia = 85", "Cambiar línea 1 por: piloto == 'Nova'", "Cambiar línea 3 por: print('piloto')", "Poner punto y coma al final"], correctIndex: 0, explanation: "Los espacios en nombres de variables causan SyntaxError." },
      { type: "fill_blank", title: "Multiplicación (*)", theory: "Usamos <code>+</code>, <code>-</code>, <code>*</code> (multiplicar) y <code>/</code> (dividir).", prompt: "Multiplica el ataque base por el crítico:", template: ["ataque = 25\ncritico = 2\ndano_total = ataque ", "___", " critico"], answers: ["*"], options: ["*", "x", "+", "^"], explanation: "El asterisco (*) multiplica en Python." },
      { type: "multiple_choice", title: "División Entera y Módulo", theory: "<code>//</code> divide descartando decimales y <code>%</code> devuelve el residuo.", prompt: "¿Qué imprimirá este código?", codePreview: "cajas = 10 // 3\nsobrante = 10 % 3\nprint(cajas, sobrante)", choices: ["3 1", "3.33 0", "3 3", "1 3"], correctIndex: 0, explanation: "10 // 3 es 3 y sobra 1 (10 % 3 = 1)." },
      { type: "fill_blank", title: "Potencia (**)", theory: "Para elevar a una potencia usamos doble asterisco <code>**</code>.", prompt: "Eleva el voltaje (5) al cuadrado:", template: ["voltaje = 5\nsobrecarga = voltaje ", "___", " 2"], answers: ["**"], options: ["**", "^", "*", "//"], explanation: "** es el operador de potencia." },
      { type: "fill_blank", title: "Concatenación (+)", theory: "El signo <code>+</code> entre dos strings los une en uno solo.", prompt: "Une el prefijo y el nombre:", template: ["prefijo = \"Agente \"\nnombre = \"Vex\"\ncredencial = prefijo ", "___", " nombre"], answers: ["+"], options: ["+", "&", ".", "*"], explanation: "+ concatena textos." },
      { type: "fill_blank", title: "Plantillas f-strings", theory: "Las <code>f-strings</code> incrustan variables usando <code>f</code> antes de las comillas y <code>{ }</code>.", prompt: "Completa el f-string:", template: ["carga = 95\nreporte = ", "___", "\"Reactor al ", "___", " por ciento\""], answers: ["f", "{carga}"], options: ["f", "{carga}", "$carga", "str"], explanation: "El prefijo f evalúa variables entre llaves." },
      { type: "fill_blank", title: "Inspección con type()", theory: "<code>type()</code> revela el tipo de dato de una variable.", prompt: "Inspecciona el tipo de coordenada:", template: ["coordenada = 42.5\nprint(", "___", "(coordenada))"], answers: ["type"], options: ["type", "kind", "typeof", "class"], explanation: "type(42.5) devuelve float." },
      { type: "fill_blank", title: "Conversión a Entero (int)", theory: "<code>int()</code> convierte un texto numérico como <code>\"50\"</code> en número entero.", prompt: "Convierte dato_sensor a entero para sumarle 10:", template: ["dato_sensor = \"50\"\nlectura_real = ", "___", "(dato_sensor) + 10"], answers: ["int"], options: ["int", "str", "num", "parse"], explanation: "int('50') + 10 da 60." },
      { type: "bug_hunt", title: "Caza de Bugs: TypeError", theory: "No puedes sumar un <code>str</code> con un <code>int</code> directamente sin convertirlo.", prompt: "¿Cómo reparas la línea 2?", buggyCode: "1 | nivel = 4\n2 | mensaje = 'Rango: ' + nivel\n3 | print(mensaje)", choices: ["Usar str(nivel) o f'Rango: {nivel}'", "Cambiar + por -", "Quitar comillas de 'Rango: '", "Usar nivel == 4"], correctIndex: 0, explanation: "str(nivel) o f-strings evitan el TypeError." },
      { type: "fill_blank", title: "Incremento Abreviado (+=)", theory: "<code>xp += 50</code> suma 50 directamente a la variable actual.", prompt: "Incrementa xp en 50:", template: ["xp = 100\nxp ", "___", " 50"], answers: ["+="], options: ["+=", "=+", "++", "=="], explanation: "xp pasa de 100 a 150." },
      { type: "fill_blank", title: "Capitalización (.capitalize)", theory: "<code>.capitalize()</code> pone la primera letra del texto en mayúscula.", prompt: "Normaliza el nombre del agente:", template: ["alias = \"kael\"\nlimpio = alias.", "___", "()"], answers: ["capitalize"], options: ["capitalize", "upper", "lower", "cap"], explanation: "'kael'.capitalize() devuelve 'Kael'." },
      { type: "order_lines", title: "Cálculo y Reporte", theory: "Combinemos variables, multiplicación y salida con f-string.", prompt: "Ordena el script de cálculo de XP:", lines: ["nodos_completados = 20", "xp_total = nodos_completados * 15", "print(f'XP ganada: {xp_total}')"], explanation: "Declaración, cálculo e impresión." },
      { type: "free_code", title: "Reto Pre-Jefe: Conversión y Cálculo", theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Usa la barra táctil o tu teclado para escribir la expresión completa.", prompt: "Dada <code>energia_txt = \"30\"</code>, asigna a <code>total</code> la conversión a entero de <code>energia_txt</code> multiplicada por <code>4</code>:", contextCode: "energia_txt = \"30\"\n# Escribe tu línea abajo:", placeholder: "total = ...", acceptedAnswers: ["total = int(energia_txt) * 4", "total = 4 * int(energia_txt)"], explanation: "¡Perfecto! Estás listo para el Jefe del Nivel 1." }
    ]
  },

  // =====================================================================
  // NIVEL 2: NOVATO (20 EJERCICIOS + JEFE 2 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "novato",
    number: 2,
    name: "Novato",
    role: "Hacker de Terminal",
    color: "emerald",
    icon: "💻",
    description: "Controla el flujo lógico: condicionales (if/elif/else), operadores booleanos y bucles (for y while).",
    boss: {
      name: "Centinela de Fuerza Bruta",
      avatar: "🕷️",
      lore: "El Centinela protege los puertos del 1 al 30. Combina aritmética modular con bucles y condicionales encadenados para calcular el balance energético sin caer en puertos infectados.",
      combatRule: "Restricción Táctica (AST): Obligatorio usar bucle (for/while) y condicional (if). Prohibido escribir el número 110.",
      problemSpec: {
        objective: "Escanea desde 1 hasta 'limite_puerto' (incluido) y actualiza 'balance_energia'.",
        rules: [
          "Si el puerto es múltiplo de 3 Y de 5 al mismo tiempo (ej. 15, 30), RESTA 25 a 'balance_energia'.",
          "Si es múltiplo solo de 3, SUMA 10. Si es múltiplo solo de 5, SUMA 20.",
          "Imprime 'balance_energia' al final."
        ],
        expectedOutput: "110"
      },
      starterCode: `# NODO JEFE 2: Centinela de Fuerza Bruta\nlimite_puerto = 30\nbalance_energia = 0\n\n# Programa tu escáner aquí abajo:\n`,
      solutionCode: `limite_puerto = 30\nbalance_energia = 0\n\nfor p in range(1, limite_puerto + 1):\n    if p % 3 == 0 and p % 5 == 0:\n        balance_energia -= 25\n    elif p % 3 == 0:\n        balance_energia += 10\n    elif p % 5 == 0:\n        balance_energia += 20\n\nprint(balance_energia)`,
      hints: [
        { cost: 50, text: "Pista 1: Evalúa PRIMERO la condición doble (p % 3 == 0 and p % 5 == 0) en el if principal." },
        { cost: 100, text: "Pista 2: Recorre for p in range(1, limite_puerto + 1): con if (ambos) -= 25, elif (%3) += 10, elif (%5) += 20." }
      ],
      shields: [
        {
          name: "Escudo 1: Bucle y Regla AST",
          validatePy: `
import ast
_tree = ast.parse(_user_code)
assert any(isinstance(n, (ast.For, ast.While)) for n in ast.walk(_tree)), "Debes usar un bucle for o while."
assert any(isinstance(n, ast.If) for n in ast.walk(_tree)), "Debes usar condicionales if/elif."
assert not any(isinstance(n, ast.Constant) and n.value == 110 for n in ast.walk(_tree)), "Prohibido escribir 110 directamente."
`
        },
        {
          name: "Escudo 2: Rango 1..30",
          validatePy: `
assert balance_energia == 110, f"Se esperaba 110, pero obtuviste {balance_energia}."
assert "110" in _captured_stdout, "Imprime balance_energia con print()."
`
        },
        {
          name: "Escudo 3: Prueba Ciega",
          validatePy: `
_env = {}
exec(_user_code.replace("limite_puerto = 30", "limite_puerto = 15"), _env)
assert _env.get("balance_energia") == 55, "Fallo en prueba ciega con limite_puerto=15 (debería dar 55)."
`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "Igualdad (==)", theory: "<code>=</code> asigna y <code>==</code> compara si dos datos son iguales.", prompt: "Compara si clave es igual a 777:", template: ["clave = 777\nacceso_valido = clave ", "___", " 777"], answers: ["=="], options: ["==", "=", "!=", "is"], explanation: "== devuelve True si son idénticos." },
      { type: "fill_blank", title: "Desigualdad (!=)", theory: "<code>!=</code> devuelve <code>True</code> cuando dos valores son diferentes.", prompt: "Verifica si estado es diferente de \"limpio\":", template: ["estado = \"corrupto\"\nalerta = estado ", "___", " \"limpio\""], answers: ["!="], options: ["!=", "==", "=!", "<>"], explanation: "!= evalúa desigualdad." },
      { type: "multiple_choice", title: "Umbrales (>= y <=)", theory: "<code>&gt;=</code> incluye el valor límite en la comparación.", prompt: "¿Qué imprimirá este código?", codePreview: "escudo = 50\nprint(escudo > 50, escudo >= 50)", choices: ["False True", "True True", "False False", "True False"], correctIndex: 0, explanation: "50 > 50 es False, pero 50 >= 50 es True." },
      { type: "fill_blank", title: "Sentencia if", theory: "<code>if</code> ejecuta su bloque si la condición se cumple. Termina con <code>:</code>.", prompt: "Completa el condicional:", template: ["temperatura = 120\n", "___", " temperatura >= 100", "___", "\n    print(\"Alerta\")"], answers: ["if", ":"], options: ["if", ":", "then", "{}"], explanation: "Siempre usa 'if condicion:'." },
      { type: "bug_hunt", title: "Caza de Bugs: IndentationError", theory: "El bloque dentro de un <code>if</code> requiere 4 espacios de sangría.", prompt: "¿Cómo corriges el error?", buggyCode: "1 | bateria = 15\n2 | if bateria < 20:\n3 | print('Recarga')", choices: ["Agregar 4 espacios antes de print en la línea 3", "Quitar los dos puntos en línea 2", "Usar llaves { }", "Cambiar if por when"], correctIndex: 0, explanation: "La línea dentro del if debe ir indentada." },
      { type: "fill_blank", title: "Bloque else", theory: "<code>else:</code> se ejecuta cuando la condición del <code>if</code> es falsa.", prompt: "Agrega el caso contrario:", template: ["if pin_correcto:\n    print(\"OK\")\n", "___", ":\n    print(\"Denegado\")"], answers: ["else"], options: ["else", "otherwise", "elif", "default"], explanation: "else captura el caso falso." },
      { type: "order_lines", title: "Protocolo if / else", theory: "Primero evaluamos con <code>if</code> y luego cerramos con <code>else</code>.", prompt: "Ordena la estructura condicional:", lines: ["if energia >= 50:", "    print('Núcleo estable')", "else:", "    print('Núcleo crítico')"], explanation: "Orden estándar if -> acción -> else -> acción." },
      { type: "fill_blank", title: "Rutas Múltiples con elif", theory: "<code>elif</code> evalúa condiciones intermedias.", prompt: "Completa la estructura de 3 niveles:", template: ["if senal >= 80:\n    rango = \"Alta\"\n", "___", " senal >= 40:\n    rango = \"Media\"\n", "___", ":\n    rango = \"Baja\""], answers: ["elif", "else"], options: ["elif", "else", "elseif", "when"], explanation: "elif evalúa la segunda condición si el if falló." },
      { type: "multiple_choice", title: "Primera Coincidencia", theory: "Python solo ejecuta el primer bloque verdadero de la cadena <code>if/elif/else</code>.", prompt: "¿Qué imprimirá en consola?", codePreview: "nivel = 75\nif nivel >= 90:\n    print('Oro')\nelif nivel >= 70:\n    print('Plata')\nelif nivel >= 50:\n    print('Bronce')", choices: ["Plata", "Plata y Bronce", "Oro", "Bronce"], correctIndex: 0, explanation: "Entra en nivel >= 70 ('Plata') e ignora el resto." },
      { type: "fill_blank", title: "Operador Lógico and", theory: "<code>and</code> exige que AMBAS condiciones sean verdaderas.", prompt: "Exige llave Y código válido:", template: ["autorizado = tiene_llave ", "___", " codigo_valido"], answers: ["and"], options: ["and", "&&", "or", "both"], explanation: "and devuelve True solo si ambos lados son True." },
      { type: "fill_blank", title: "Operador Lógico or", theory: "<code>or</code> devuelve True si AL MENOS UNA condición se cumple.", prompt: "Permite paso a admin O pase VIP:", template: ["entrada = es_admin ", "___", " tiene_pase_vip"], answers: ["or"], options: ["or", "||", "and", "either"], explanation: "Con or basta una condición verdadera." },
      { type: "fill_blank", title: "Inversor not", theory: "<code>not</code> invierte <code>True</code> a <code>False</code> y viceversa.", prompt: "Verifica que NO esté bloqueada:", template: ["bloqueada = False\npuede_avanzar = ", "___", " bloqueada"], answers: ["not"], options: ["not", "!", "no", "~"], explanation: "not False es True." },
      { type: "bug_hunt", title: "Caza de Bugs: = en vez de ==", theory: "Dentro de la condición de un <code>if</code> debes usar <code>==</code> para comparar.", prompt: "¿Por qué falla la línea 2?", buggyCode: "1 | sector = 4\n2 | if sector = 4:\n3 |     print('Localizado')", choices: ["En la línea 2 se usó '=' en lugar de '=='", "Falta int en línea 1", "4 debe ir entre comillas", "Falta then"], correctIndex: 0, explanation: "Usa 'if sector == 4:'." },
      { type: "fill_blank", title: "Bucle for con range()", theory: "<code>for i in range(5):</code> repite el bloque 5 veces (de 0 a 4).", prompt: "Itera 5 veces con for:", template: ["___", " barrido ", "___", " range(5):\n    print(barrido)"], answers: ["for", "in"], options: ["for", "in", "while", "of"], explanation: "for variable in range(n): recorre la secuencia." },
      { type: "multiple_choice", title: "Límites de range(inicio, fin)", theory: "El valor de <code>inicio</code> se incluye, pero el de <code>fin</code> se excluye.", prompt: "¿Qué números imprime?", codePreview: "for p in range(1, 4):\n    print(p)", choices: ["1, 2 y 3", "1, 2, 3 y 4", "0, 1, 2 y 3", "0, 1, 2, 3, 4"], correctIndex: 0, explanation: "Se detiene uno antes del 4." },
      { type: "fill_blank", title: "Saltos en range()", theory: "<code>range(inicio, fin, paso)</code> avanza según el tercer argumento.", prompt: "Avanza de 2 en 2:", template: ["for par in ", "___", "(2, 10, ", "___", "):\n    print(par)"], answers: ["range", "2"], options: ["range", "2", "10", "step"], explanation: "El paso 2 genera 2, 4, 6, 8." },
      { type: "order_lines", title: "Acumulador en Bucle", theory: "Inicializa en 0 antes del bucle y suma con <code>+=</code> adentro.", prompt: "Ordena para sumar del 1 al 3:", lines: ["total = 0", "for n in range(1, 4):", "    total += n", "print(total)"], explanation: "Suma 1 + 2 + 3 e imprime 6." },
      { type: "fill_blank", title: "Bucle while", theory: "<code>while</code> repite mientras la condición sea verdadera.", prompt: "Repite mientras energia > 0 restando 1:", template: ["energia = 3\n", "___", " energia > 0:\n    energia ", "___", " 1"], answers: ["while", "-="], options: ["while", "-=", "for", "=="], explanation: "Reduce energia hasta cortar el ciclo." },
      { type: "fill_blank", title: "Corte con break", theory: "<code>break</code> detiene el bucle inmediatamente.", prompt: "Detén el bucle si nodo == 5:", template: ["for nodo in range(10):\n    if nodo == 5:\n        ", "___"], answers: ["break"], options: ["break", "stop", "exit", "continue"], explanation: "break sale del ciclo al instante." },
      { type: "free_code", title: "Reto Pre-Jefe: Condición Doble", theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Escribe la cabecera <code>if</code> combinando <code>%</code> y <code>and</code>.", prompt: "Escribe la línea <code>if</code> (con dos puntos al final) que verifique si <code>p</code> es divisible entre <code>3</code> Y divisible entre <code>5</code>:", contextCode: "# Verifica si p es múltiplo de 3 y 5:", placeholder: "if ...", acceptedAnswers: ["if p % 3 == 0 and p % 5 == 0:", "if (p % 3 == 0) and (p % 5 == 0):", "if p % 5 == 0 and p % 3 == 0:"], explanation: "¡Exacto! Así detectarás los puertos infectados del Jefe." }
    ]
  },

  // =====================================================================
  // NIVEL 3: APRENDIZ (20 EJERCICIOS + JEFE 3 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "aprendiz",
    number: 3,
    name: "Aprendiz",
    role: "Arquitecto de Datos",
    color: "blue",
    icon: "🧬",
    description: "Domina estructuras de datos (listas, diccionarios, tuplas, sets) y funciones reutilizables.",
    boss: {
      name: "El Núcleo de Memoria",
      avatar: "🧠",
      lore: "El banco central está colapsando. Recibes una lista de diccionarios con el estado de cada servidor y debes construir una función auditora.",
      combatRule: "Restricción Táctica: Tu función auditar_red(servidores) debe calcular el diccionario para cualquier lista recibida.",
      problemSpec: {
        objective: "Crea la función auditar_red(servidores) e imprime su retorno con 'red_central'.",
        rules: [
          "Filtra solo los servidores donde 'activo' sea True Y 'carga' >= 50.",
          "Retorna {'total_carga': suma_de_cargas, 'alertas': lista_nombres_nodos}."
        ],
        expectedOutput: "{'total_carga': 210, 'alertas': ['A1', 'C3']}"
      },
      starterCode: `# NODO JEFE 3: El Núcleo de Memoria\nred_central = [\n    {"nodo": "A1", "carga": 80, "activo": True},\n    {"nodo": "B2", "carga": 95, "activo": False},\n    {"nodo": "C3", "carga": 130, "activo": True},\n    {"nodo": "D4", "carga": 30, "activo": True}\n]\n\n# Define auditar_red(servidores) e imprime su resultado:\n`,
      solutionCode: `red_central = [\n    {"nodo": "A1", "carga": 80, "activo": True},\n    {"nodo": "B2", "carga": 95, "activo": False},\n    {"nodo": "C3", "carga": 130, "activo": True},\n    {"nodo": "D4", "carga": 30, "activo": True}\n]\n\ndef auditar_red(servidores):\n    total = 0\n    alertas = []\n    for srv in servidores:\n        if srv["activo"] and srv["carga"] >= 50:\n            total += srv["carga"]\n            alertas.append(srv["nodo"])\n    return {"total_carga": total, "alertas": alertas}\n\nprint(auditar_red(red_central))`,
      hints: [
        { cost: 50, text: "Pista 1: Crea total = 0 y alertas = [] dentro de la función antes del bucle for." },
        { cost: 100, text: "Pista 2: Si srv['activo'] and srv['carga'] >= 50:, suma srv['carga'] a total y haz alertas.append(srv['nodo'])." }
      ],
      shields: [
        {
          name: "Escudo 1: Contrato de Función",
          validatePy: `assert 'auditar_red' in globals() and callable(auditar_red), "Falta definir auditar_red(servidores)."`
        },
        {
          name: "Escudo 2: Lote Visible",
          validatePy: `
_r1 = auditar_red(red_central)
assert _r1 == {'total_carga': 210, 'alertas': ['A1', 'C3']}, f"Se esperaba {{'total_carga': 210, 'alertas': ['A1', 'C3']}}, pero retornó {_r1}."
`
        },
        {
          name: "Escudo 3: Prueba Ciega",
          validatePy: `
_oc = [{"nodo": "X9", "carga": 50, "activo": True}, {"nodo": "Z1", "carga": 100, "activo": True}, {"nodo": "Y2", "carga": 250, "activo": False}]
assert auditar_red(_oc) == {'total_carga': 150, 'alertas': ['X9', 'Z1']}, "Fallo en prueba ciega con lote oculto."
`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "Creación de Listas", theory: "Las listas usan corchetes <code>[ ]</code>.", prompt: "Declara la lista de protocolos:", template: ["protocolos = ", "___", "\"TCP\", \"UDP\", \"SSH\"", "___"], answers: ["[", "]"], options: ["[", "]", "{", "}"], explanation: "Los corchetes definen listas mutables." },
      { type: "fill_blank", title: "Indexación 0 y -1", theory: "El primer elemento es <code>0</code> y el último es <code>-1</code>.", prompt: "Extrae el primero y el último:", template: ["servidores = [\"Alfa\", \"Beta\", \"Gamma\"]\nprimero = servidores[", "___", "]\nultimo = servidores[", "___", "]"], answers: ["0", "-1"], options: ["0", "-1", "1", "3"], explanation: "0 es el inicio y -1 el final." },
      { type: "multiple_choice", title: "Rebanado (Slicing)", theory: "<code>lista[1:4]</code> extrae desde el índice 1 hasta el 3.", prompt: "¿Qué imprime este corte?", codePreview: "nodos = [10, 20, 30, 40, 50]\nprint(nodos[1:4])", choices: ["[20, 30, 40]", "[10, 20, 30, 40]", "[20, 30, 40, 50]", "[10, 20, 30]"], correctIndex: 0, explanation: "Índices 1, 2 y 3 corresponden a [20, 30, 40]." },
      { type: "fill_blank", title: "Métodos .append() y .pop()", theory: "<code>.append()</code> agrega al final y <code>.pop()</code> retira el último.", prompt: "Agrega \"Radar\" y luego extrae el último:", template: ["inv = [\"Láser\"]\ninv.", "___", "(\"Radar\")\nextraido = inv.", "___", "()"], answers: ["append", "pop"], options: ["append", "pop", "push", "remove"], explanation: "append inserta y pop retira." },
      { type: "fill_blank", title: "Conteo y Búsqueda (len e in)", theory: "<code>len()</code> cuenta elementos e <code>in</code> verifica existencia.", prompt: "Cuenta los puertos y busca el 80:", template: ["puertos = [22, 80, 443]\ncantidad = ", "___", "(puertos)\nweb = 80 ", "___", " puertos"], answers: ["len", "in"], options: ["len", "in", "count", "has"], explanation: "len devuelve 3 y 80 in puertos devuelve True." },
      { type: "bug_hunt", title: "Caza de Bugs: IndexError", theory: "En una lista de 3 ítems, el último índice es <code>2</code> (o <code>-1</code>).", prompt: "¿Cómo corriges el IndexError?", buggyCode: "1 | sectores = ['Norte', 'Sur', 'Este']\n2 | print(sectores[3])", choices: ["Cambiar sectores[3] por sectores[2] o sectores[-1]", "Usar sectores(3)", "Usar llaves { }", "Cambiar a sectores[4]"], correctIndex: 0, explanation: "El tercer elemento tiene índice 2." },
      { type: "fill_blank", title: "Tuplas Inmutables ( )", theory: "Las tuplas usan paréntesis <code>( )</code> y no pueden modificarse.", prompt: "Define la tupla de coordenadas:", template: ["coordenadas = ", "___", "120, -45, 300", "___"], answers: ["(", ")"], options: ["(", ")", "[", "]"], explanation: "Las tuplas protegen datos constantes." },
      { type: "bug_hunt", title: "Caza de Bugs: Mutación de Tupla", theory: "Para modificar elementos por índice debes usar una lista <code>[ ]</code>.", prompt: "¿Cómo reparas el TypeError?", buggyCode: "1 | blindaje = (100, 80)\n2 | blindaje[0] = 150", choices: ["Cambiar paréntesis por corchetes [100, 80] en línea 1", "Usar blindaje(0) = 150", "Usar blindaje.append(150)", "Borrar línea 1"], correctIndex: 0, explanation: "Las listas sí permiten reasignar ítems." },
      { type: "fill_blank", title: "Desempaquetado", theory: "Puedes asignar los elementos de una tupla a varias variables a la vez.", prompt: "Desempaqueta en x e y:", template: ["posicion = (45, 90)\n", "___", ", ", "___", " = posicion"], answers: ["x", "y"], options: ["x", "y", "posicion[0]", "tuple"], explanation: "x recibe 45 e y recibe 90." },
      { type: "multiple_choice", title: "Sets sin Duplicados", theory: "<code>set()</code> elimina automáticamente cualquier valor repetido.", prompt: "¿Qué imprimirá este código?", codePreview: "ips = ['10.1', '10.2', '10.1', '10.1']\nprint(len(set(ips)))", choices: ["2", "4", "1", "3"], correctIndex: 0, explanation: "Quedan solo 2 IPs únicas." },
      { type: "fill_blank", title: "Diccionarios (dict)", theory: "Los diccionarios guardan pares <code>clave: valor</code> entre llaves <code>{ }</code>.", prompt: "Consulta la clave \"energia\":", template: ["reactor = {\"sector\": \"A1\", \"energia\": 950}\nlectura = reactor[", "___", "]"], answers: ["\"energia\""], options: ["\"energia\"", "1", "energia", "0"], explanation: "Accedemos mediante la clave entre comillas." },
      { type: "order_lines", title: "Actualizando un Diccionario", theory: "Asignar a <code>dict[\"nueva\"] = valor</code> inserta o actualiza la clave.", prompt: "Ordena para crear el dron y añadir su velocidad:", lines: ["dron = {'id': 'X-01'}", "dron['velocidad'] = 300", "print(dron)"], explanation: "Se crea, se añade la clave y se imprime." },
      { type: "fill_blank", title: "Lectura Segura con .get()", theory: "<code>.get(clave, defecto)</code> evita errores si la clave no existe.", prompt: "Obtén \"municion\" o devuelve 0:", template: ["nave = {\"escudo\": 100}\nbalas = nave.", "___", "(\"municion\", ", "___", ")"], answers: ["get", "0"], options: ["get", "0", "find", "None"], explanation: "Devuelve 0 sin lanzar KeyError." },
      { type: "fill_blank", title: "Iterando con .items()", theory: "<code>.items()</code> recorre clave y valor simultáneamente.", prompt: "Recorre nombre y lectura:", template: ["for nombre, lectura in sensores.", "___", "():\n    print(nombre, lectura)"], answers: ["items"], options: ["items", "values", "keys", "pairs"], explanation: ".items() entrega pares (clave, valor)." },
      { type: "fill_blank", title: "Funciones (def y return)", theory: "<code>def</code> define la función y <code>return</code> devuelve el resultado.", prompt: "Define la función triplicar:", template: ["___", " triplicar(potencia):\n    ", "___", " potencia * 3"], answers: ["def", "return"], options: ["def", "return", "function", "print"], explanation: "def declara y return retorna el valor." },
      { type: "multiple_choice", title: "Cierre de return", theory: "<code>return</code> finaliza la función en ese mismo instante.", prompt: "¿Qué imprimirá?", codePreview: "def escudo(b):\n    return b + 50\n    return b + 999\nprint(escudo(100))", choices: ["150", "1099", "100", "None"], correctIndex: 0, explanation: "El primer return termina la ejecución devolviendo 150." },
      { type: "fill_blank", title: "Parámetros por Defecto", theory: "Puedes definir un valor por defecto con <code>param=valor</code>.", prompt: "Asigna 2 por defecto a multiplicador:", template: ["def amplificar(senal, multiplicador", "___", "___", "):\n    return senal * multiplicador"], answers: ["=", "2"], options: ["=", "2", ":", "default"], explanation: "Si no se pasa el segundo argumento, usará 2." },
      { type: "order_lines", title: "Función con Bucle", theory: "Una función puede recorrer una lista y retornar el acumulado.", prompt: "Ordena la función contadora:", lines: ["def contar_nodos(lista):", "    total = 0", "    for item in lista:", "        total += 1", "    return total"], explanation: "Recorre la lista y retorna el conteo." },
      { type: "bug_hunt", title: "Caza de Bugs: Función devuelve None", theory: "Si olvidas escribir <code>return</code>, la función devuelve <code>None</code>.", prompt: "¿Cómo corriges la función?", buggyCode: "1 | def sumar(a, b):\n2 |     total = a + b\n3 | print(sumar(10, 5))", choices: ["Agregar 'return total' indentado antes de imprimir", "Cambiar def por function", "Quitar paréntesis", "Usar total == a + b"], correctIndex: 0, explanation: "return entrega el resultado calculado." },
      { type: "free_code", title: "Reto Pre-Jefe: Append desde Diccionario", theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Extrae el valor de un diccionario y agrégalo a una lista.", prompt: "Agrega <code>srv[\"nodo\"]</code> al final de la lista <code>alertas</code>:", contextCode: "alertas = []\nsrv = {\"nodo\": \"A1\", \"carga\": 80}\n# Escribe tu línea abajo:", placeholder: "alertas.append(...)", acceptedAnswers: ["alertas.append(srv[\"nodo\"])", "alertas.append(srv['nodo'])"], explanation: "¡Perfecto! Esa línea es clave para el Jefe El Núcleo de Memoria." }
    ]
  },

  // =====================================================================
  // NIVEL 4: PROFESIONAL (20 EJERCICIOS + JEFE 4 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "profesional",
    number: 4,
    name: "Profesional",
    role: "Ingeniero de Sistemas",
    color: "purple",
    icon: "⚡",
    description: "Código Pythonic con List Comprehensions, funciones lambda, map/filter y manejo de excepciones.",
    boss: {
      name: "Purificador de Telemetría",
      avatar: "🔮",
      lore: "Los sensores envían lecturas en texto mezcladas con códigos de fallo ('ERROR_RED', 'NULO') y negativos. Combina try/except, List Comprehensions y ordenamiento.",
      combatRule: "Restricción Táctica (AST): Obligatorio usar try/except y al menos una List Comprehension o lambda.",
      problemSpec: {
        objective: "Define purificar_telemetria(datos) e imprime su resultado con 'lote_crudo'.",
        rules: [
          "Convierte cada ítem a int() usando try/except para ignorar textos corruptos.",
          "Filtra solo los enteros positivos (> 0) y multiplícalos por 2.",
          "Retorna la lista ordenada de MAYOR A MENOR (sorted(..., reverse=True))."
        ],
        expectedOutput: "[240, 160, 80]"
      },
      starterCode: `# NODO JEFE 4: Purificador de Telemetría\nlote_crudo = ["40", "-15", "ERROR_RED", "120", "NULO", "80"]\n\n# Define purificar_telemetria(datos) e imprime su resultado:\n`,
      solutionCode: `lote_crudo = ["40", "-15", "ERROR_RED", "120", "NULO", "80"]\n\ndef purificar_telemetria(datos):\n    nums = []\n    for d in datos:\n        try:\n            nums.append(int(d))\n        except ValueError:\n            pass\n    limpios = [n * 2 for n in nums if n > 0]\n    return sorted(limpios, reverse=True)\n\nprint(purificar_telemetria(lote_crudo))`,
      hints: [
        { cost: 50, text: "Pista 1: Usa un bucle con try: nums.append(int(d)) except ValueError: pass para extraer enteros." },
        { cost: 100, text: "Pista 2: Luego haz limpios = [n * 2 for n in nums if n > 0] y retorna sorted(limpios, reverse=True)." }
      ],
      shields: [
        {
          name: "Escudo 1: try/except y Comprehension",
          validatePy: `
import ast
_t = ast.parse(_user_code)
assert any(isinstance(n, ast.Try) for n in ast.walk(_t)), "Debes usar un bloque try/except."
assert any(isinstance(n, (ast.ListComp, ast.GeneratorExp, ast.Lambda)) for n in ast.walk(_t)), "Debes usar List Comprehension o lambda."
assert 'purificar_telemetria' in globals(), "Falta definir purificar_telemetria(datos)."
`
        },
        {
          name: "Escudo 2: Lote Visible",
          validatePy: `assert purificar_telemetria(lote_crudo) == [240, 160, 80], f"Se esperaba [240, 160, 80], obtuviste {purificar_telemetria(lote_crudo)}."`
        },
        {
          name: "Escudo 3: Prueba Ciega",
          validatePy: `assert purificar_telemetria(["10", "FALLO", "-50", "50", "0", "30"]) == [100, 60, 20], "Fallo en prueba ciega con lote oculto."`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "List Comprehensions", theory: "Sintaxis en una línea: <code>[expresion for item in lista]</code>.", prompt: "Eleva cada número al cuadrado:", template: ["nums = [1, 2, 3, 4]\ncuadrados = [n ** 2 ", "___", " n ", "___", " nums]"], answers: ["for", "in"], options: ["for", "in", "map", "where"], explanation: "Genera [1, 4, 9, 16]." },
      { type: "multiple_choice", title: "Métodos en Comprehension", theory: "Puedes aplicar métodos como <code>.upper()</code> a cada ítem.", prompt: "¿Qué imprime?", codePreview: "s = ['a1', 'b2']\nprint([x.upper() for x in s])", choices: ["['A1', 'B2']", "['a1', 'b2']", "'A1B2'", "[True, True]"], correctIndex: 0, explanation: "Convierte cada string a mayúsculas." },
      { type: "fill_blank", title: "Filtro en Comprehension", theory: "Añade <code>if condicion</code> al final para filtrar elementos.", prompt: "Filtra lecturas mayores a 100:", template: ["altas = [x for x in datos ", "___", " x ", "___", " 100]"], answers: ["if", ">"], options: ["if", ">", "where", "=="], explanation: "Conserva solo los valores > 100." },
      { type: "bug_hunt", title: "Caza de Bugs: Orden del if", theory: "Un filtro <code>if</code> (sin <code>else</code>) va siempre al final de la List Comprehension.", prompt: "¿Cómo corriges la línea 2?", buggyCode: "1 | temps = [30, 95, 110]\n2 | crit = [t if t >= 90 for t in temps]", choices: ["Mover el if al final: [t for t in temps if t >= 90]", "Usar paréntesis", "Cambiar for por while", "Usar t == 90"], correctIndex: 0, explanation: "La estructura es [expr for x in lista if cond]." },
      { type: "fill_blank", title: "Ternario en Comprehension", theory: "Con <code>if/else</code> se coloca al principio: <code>[val_si if cond else val_no for x in lista]</code>.", prompt: "Etiqueta \"OK\" o \"BAJO\":", template: ["estados = [\"OK\" ", "___", " v >= 50 ", "___", " \"BAJO\" for v in voltajes]"], answers: ["if", "else"], options: ["if", "else", "elif", "then"], explanation: "Transforma todos los elementos según la condición." },
      { type: "fill_blank", title: "Dict Comprehensions", theory: "Con llaves <code>{k: v for ...}</code> creas diccionarios.", prompt: "Crea el diccionario de cuadrados:", template: ["nodos = [1, 2, 3]\nmapa = ", "___", "n: n ** 2 for n in nodos", "___"], answers: ["{", "}"], options: ["{", "}", "[", "]"], explanation: "Genera {1: 1, 2: 4, 3: 9}." },
      { type: "fill_blank", title: "Funciones lambda", theory: "<code>lambda x: expresion</code> crea una función anónima en línea.", prompt: "Triplica x con lambda:", template: ["triplicar = ", "___", " x", "___", " x * 3"], answers: ["lambda", ":"], options: ["lambda", ":", "def", "->"], explanation: "Retorna automáticamente x * 3." },
      { type: "fill_blank", title: "Lambda Multiparámetro", theory: "Separa múltiples parámetros con comas antes de <code>:</code>.", prompt: "Suma base y bono:", template: ["dano = lambda ", "___", ", ", "___", ": base + bono"], answers: ["base", "bono"], options: ["base", "bono", "return", "def"], explanation: "Acepta dos argumentos y retorna su suma." },
      { type: "multiple_choice", title: "Transformación con map()", theory: "<code>map(func, lista)</code> aplica la función a cada elemento.", prompt: "¿Qué imprime?", codePreview: "v = [10, 20]\nprint(list(map(lambda x: x + 5, v)))", choices: ["[15, 25]", "[10, 20, 5]", "[50, 100]", "30"], correctIndex: 0, explanation: "Suma 5 a cada ítem." },
      { type: "fill_blank", title: "Usando list(map(...))", theory: "Envuelve <code>map()</code> en <code>list()</code> para obtener la lista final.", prompt: "Duplica las velocidades con map:", template: ["dobles = ", "___", "(", "___", "(lambda v: v * 2, velocidades))"], answers: ["list", "map"], options: ["list", "map", "filter", "set"], explanation: "Transforma todos los ítems de la lista." },
      { type: "fill_blank", title: "Filtrado con filter()", theory: "<code>filter(func, lista)</code> conserva los ítems donde la función da <code>True</code>.", prompt: "Filtra señales > 50:", template: ["validas = list(", "___", "(", "___", " s: s > 50, senales))"], answers: ["filter", "lambda"], options: ["filter", "lambda", "map", "if"], explanation: "Descarta las señales <= 50." },
      { type: "order_lines", title: "Orden Descendente con sorted()", theory: "<code>sorted(lista, reverse=True)</code> ordena de mayor a menor.", prompt: "Ordena las lecturas de mayor a menor:", lines: ["lecturas = [40, 120, 80]", "ordenadas = sorted(lecturas, reverse=True)", "print(ordenadas)"], explanation: "Imprime [120, 80, 40]." },
      { type: "fill_blank", title: "Bloques try / except", theory: "Envuelve código riesgoso en <code>try:</code> y captura errores en <code>except:</code>.", prompt: "Captura la división por cero:", template: ["___", ":\n    flujo = 100 / n\n", "___", " ZeroDivisionError:\n    flujo = 0"], answers: ["try", "except"], options: ["try", "except", "catch", "error"], explanation: "Evita que el programa colapse." },
      { type: "multiple_choice", title: "Capturando ValueError", theory: "<code>int(\"NULO\")</code> lanza <code>ValueError</code>.", prompt: "¿Qué imprime este código?", codePreview: "try:\n    v = int('NULO')\nexcept ValueError:\n    v = -1\nprint(v)", choices: ["-1", "'NULO'", "0", "Error"], correctIndex: 0, explanation: "Salta al bloque except y asigna -1." },
      { type: "bug_hunt", title: "Caza de Bugs: catch vs except", theory: "Python usa la palabra reservada <code>except</code>, no <code>catch</code>.", prompt: "¿Cómo corriges la línea 3?", buggyCode: "1 | try:\n2 |     conectar()\n3 | catch ConnectionError:\n4 |     offline()", choices: ["Cambiar 'catch' por 'except' en la línea 3", "Cambiar try por attempt", "Quitar dos puntos", "Poner comillas"], correctIndex: 0, explanation: "En Python siempre es try / except." },
      { type: "order_lines", title: "Bloque finally", theory: "<code>finally:</code> se ejecuta siempre al terminar.", prompt: "Ordena try, except y finally:", lines: ["try:", "    transmitir()", "except RuntimeError:", "    print('Fallo')", "finally:", "    cerrar_puerto()"], explanation: "Estructura completa de manejo de excepciones." },
      { type: "fill_blank", title: "Capturando KeyError", theory: "Buscar una clave inexistente en un diccionario lanza <code>KeyError</code>.", prompt: "Atrapa el error de clave faltante:", template: ["try:\n    ip = config[\"backup\"]\nexcept ", "___", ":\n    ip = \"127.0.0.1\""], answers: ["KeyError"], options: ["KeyError", "IndexError", "ValueError", "TypeError"], explanation: "KeyError protege consultas a diccionarios." },
      { type: "fill_blank", title: "Lanzando Errores (raise)", theory: "<code>raise</code> dispara una excepción manualmente.", prompt: "Lanza un ValueError si presion < 0:", template: ["if presion < 0:\n    ", "___", " ValueError(\"Negativa\")"], answers: ["raise"], options: ["raise", "throw", "error", "except"], explanation: "raise detiene el flujo e informa el error." },
      { type: "order_lines", title: "Conversión Segura en Función", theory: "Combinemos <code>def</code> con <code>try / except</code>.", prompt: "Ordena la función de conversión segura:", lines: ["def parsear_seguro(texto):", "    try:", "        return int(texto)", "    except ValueError:", "        return 0"], explanation: "Retorna el entero o 0 si el texto es inválido." },
      { type: "free_code", title: "Reto Pre-Jefe: List Comprehension con Filtro", theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Escribe la List Comprehension completa.", prompt: "Asigna a <code>limpios</code> una List Comprehension con <code>n * 2</code> para cada <code>n</code> en <code>nums</code> si <code>n > 0</code>:", contextCode: "# Escribe tu List Comprehension:", placeholder: "limpios = [n * 2 for ...]", acceptedAnswers: ["limpios = [n * 2 for n in nums if n > 0]", "limpios = [2 * n for n in nums if n > 0]"], explanation: "¡Listo para derrotar al Purificador de Telemetría!" }
    ]
  }
];
/***********************************************************************
 * BANCO DE NIVELES PYQUEST PRO - PARTE 3B (NIVELES 5 AL 7)
 ***********************************************************************/
LEVEL_DATA.push(
  // =====================================================================
  // NIVEL 5: MAESTRO (20 EJERCICIOS + JEFE 5 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "maestro",
    number: 5,
    name: "Maestro",
    role: "Señor de los Algoritmos",
    color: "amber",
    icon: "🛡️",
    description: "Arquitectura de software con POO (Clases, Herencia, Polimorfismo) y Recursividad.",
    boss: {
      name: "Fábrica de Drones Autónomos",
      avatar: "🛸",
      lore: "Programa una jerarquía de clases que simule el consumo de batería durante una misión de fuego continuo, combinando POO y herencia.",
      combatRule: "Restricción Táctica: DronCombate debe heredar formalmente de Unidad usando super().__init__() y gestionar self.bateria.",
      problemSpec: {
        objective: "Diseña la clase base 'Unidad' y la subclase 'DronCombate', e imprime el resultado de ejecutar la misión.",
        rules: [
          "Unidad debe tener __init__(self, modelo, bateria) guardando self.modelo y self.bateria.",
          "DronCombate(Unidad) debe recibir __init__(self, modelo, bateria, rafagas), llamar a super().__init__ y guardar self.rafagas.",
          "En DronCombate, ejecutar_mision(self) debe restar 15 de batería por cada ráfaga si hay suficiente energía, acumulando el daño. Retorna el daño total.",
          "Instancia dron = DronCombate('MK-9', 35, [40, 60, 100]) e imprime print(dron.ejecutar_mision())."
        ],
        expectedOutput: "100"
      },
      starterCode: `# NODO JEFE 5: Fábrica de Drones Autónomos\n# Diseña las clases Unidad y DronCombate(Unidad) aquí:\n\n\n# Instancia dron y muestra su misión:\n`,
      solutionCode: `class Unidad:\n    def __init__(self, modelo, bateria):\n        self.modelo = modelo\n        self.bateria = bateria\n\nclass DronCombate(Unidad):\n    def __init__(self, modelo, bateria, rafagas):\n        super().__init__(modelo, bateria)\n        self.rafagas = rafagas\n\n    def ejecutar_mision(self):\n        dano_total = 0\n        for r in self.rafagas:\n            if self.bateria >= 15:\n                self.bateria -= 15\n                dano_total += r\n        return dano_total\n\ndron = DronCombate("MK-9", 35, [40, 60, 100])\nprint(dron.ejecutar_mision())`,
      hints: [
        { cost: 50, text: "Pista 1: Con 35 de batería, dispara dos veces (gasta 30, quedan 5) y la tercera ráfaga ya no se ejecuta." },
        { cost: 100, text: "Pista 2: Usa super().__init__(modelo, bateria) en la subclase y recorre 'for r in self.rafagas:'." }
      ],
      shields: [
        {
          name: "Escudo 1: Herencia POO",
          validatePy: `
assert 'Unidad' in globals() and 'DronCombate' in globals(), "Define Unidad y DronCombate."
assert issubclass(DronCombate, Unidad), "DronCombate debe heredar de Unidad."
`
        },
        {
          name: "Escudo 2: Misión MK-9",
          validatePy: `
_d = DronCombate("MK-9", 35, [40, 60, 100])
assert _d.ejecutar_mision() == 100, "El daño total debe ser 100 (40+60)."
assert _d.bateria == 5, "La batería final debe quedar en 5."
`
        },
        {
          name: "Escudo 3: Prueba Ciega",
          validatePy: `
_d2 = DronCombate("OMEGA", 45, [20, 30, 50, 90])
assert _d2.ejecutar_mision() == 100 and _d2.bateria == 0, "Fallo en prueba ciega con OMEGA."
`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "Clases (class)", theory: "<code>class</code> define un plano para crear objetos (PascalCase).", prompt: "Declara la clase Androide:", template: ["___", " ", "___", ":\n    sistema = \"Activo\""], answers: ["class", "Androide"], options: ["class", "Androide", "def", "object"], explanation: "class crea un nuevo tipo de objeto." },
      { type: "fill_blank", title: "Instanciación", theory: "Instanciar es crear un objeto llamando a la clase con paréntesis <code>Clase()</code>.", prompt: "Instancia Centinela en unidad_1:", template: ["class Centinela:\n    pass\n\nunidad_1 = ", "___", "___"], answers: ["Centinela", "()"], options: ["Centinela", "()", "new", "{}"], explanation: "Centinela() construye el objeto." },
      { type: "fill_blank", title: "Constructor (__init__)", theory: "<code>__init__</code> inicializa los atributos del objeto al crearlo.", prompt: "Completa el constructor:", template: ["class Agente:\n    def ", "___", "(", "___", ", alias):\n        self.alias = alias"], answers: ["__init__", "self"], options: ["__init__", "self", "init", "this"], explanation: "__init__ recibe self como primer parámetro." },
      { type: "bug_hunt", title: "Caza de Bugs: self faltante", theory: "Los métodos de clase deben recibir siempre <code>self</code> como primer parámetro.", prompt: "¿Por qué falla la llamada?", buggyCode: "1 | class Nave:\n2 |     def activar():\n3 |         print('OK')", choices: ["En la línea 2 debe escribirse def activar(self):", "Falta new", "Nave debe ser minúscula", "Falta return"], correctIndex: 0, explanation: "Python pasa la instancia automáticamente a self." },
      { type: "multiple_choice", title: "Acceso con Punto (.)", theory: "Leemos y modificamos atributos con <code>objeto.atributo</code>.", prompt: "¿Qué imprime?", codePreview: "class Reactor:\n    def __init__(self, p):\n        self.p = p\nr = Reactor(300)\nr.p += 50\nprint(r.p)", choices: ["300", "350", "50", "Error"], correctIndex: 1, explanation: "300 + 50 da 350." },
      { type: "order_lines", title: "Ensamblaje de Clase", theory: "Definición, constructor con self e instanciación.", prompt: "Ordena para crear Torreta:", lines: ["class Torreta:", "    def __init__(self, alcance):", "        self.alcance = alcance", "t1 = Torreta(500)"], explanation: "Clase, constructor, atributo e instancia." },
      { type: "fill_blank", title: "Métodos de Instancia", theory: "Los métodos pueden leer atributos mediante <code>self.atributo</code>.", prompt: "Devuelve el triple de la energía:", template: ["class Nucleo:\n    def __init__(self, e):\n        self.e = e\n    def sobrecargar(self):\n        return ", "___", ".", "___", " * 3"], answers: ["self", "e"], options: ["self", "e", "Nucleo", "this"], explanation: "self.e accede al atributo de la instancia." },
      { type: "fill_blank", title: "Mutación de Estado", theory: "Modifica atributos actualizando <code>self.atributo</code>.", prompt: "Resta el impacto al escudo:", template: ["def recibir_dano(self, impacto):\n    ", "___", ".escudo ", "___", " impacto"], answers: ["self", "-="], options: ["self", "-=", "==", "return"], explanation: "self.escudo -= impacto reduce el valor." },
      { type: "multiple_choice", title: "Atributos de Clase", theory: "Variables fuera de <code>__init__</code> son compartidas por todas las instancias.", prompt: "¿Qué muestra?", codePreview: "class Dron:\n    fac = 'Guard'\n    def __init__(self, id):\n        self.id = id\nd1 = Dron('A')\nd2 = Dron('B')\nprint(d1.fac == d2.fac, d1.id == d2.id)", choices: ["True True", "False False", "True False", "False True"], correctIndex: 2, explanation: "Comparten fac ('Guard' -> True) pero tienen id distinto ('A' vs 'B' -> False)." },
      { type: "fill_blank", title: "Atributos Privados (__)", theory: "Prefijar con <code>__</code> aplica *name mangling* para proteger el atributo.", prompt: "Encapsula el PIN como privado:", template: ["class Boveda:\n    def __init__(self, pin):\n        self.", "___", " = pin"], answers: ["__pin"], options: ["__pin", "private_pin", "_pin_", "secret"], explanation: "__pin oculta el acceso directo externo." },
      { type: "order_lines", title: "Ciclo de Vida de Objeto", theory: "Instanciar, modificar por método y consultar atributo.", prompt: "Ordena para instanciar batería, cargar y consultar:", lines: ["bat = Bateria(50)", "bat.cargar(30)", "print(bat.carga)"], explanation: "Secuencia lógica de POO." },
      { type: "fill_blank", title: "Herencia de Clases", theory: "<code>class Hija(Padre):</code> hereda métodos y atributos.", prompt: "Haz que CazaEstelar herede de Vehiculo:", template: ["class CazaEstelar(", "___", "):\n    pass"], answers: ["Vehiculo"], options: ["Vehiculo", "super", "extends", "self"], explanation: "Herencia directa en Python." },
      { type: "fill_blank", title: "super().__init__()", theory: "<code>super()</code> invoca el constructor de la clase padre.", prompt: "Llama al constructor padre:", template: ["class Elite(Agente):\n    def __init__(self, nombre):\n        ", "___", ".", "___", "(nombre)"], answers: ["super()", "__init__"], options: ["super()", "__init__", "Agente", "self"], explanation: "Delega la inicialización al padre." },
      { type: "multiple_choice", title: "Sobrescritura y Polimorfismo", theory: "Un método en la clase hija sobrescribe al del padre.", prompt: "¿Qué imprime elite.disparar()?", codePreview: "class Base:\n    def disparar(self):\n        return 10\nclass Plasma(Base):\n    def disparar(self):\n        return 50\nelite = Plasma()\nprint(elite.disparar())", choices: ["10", "60", "50", "None"], correctIndex: 2, explanation: "Ejecuta el método de Plasma (50)." },
      { type: "fill_blank", title: "isinstance()", theory: "<code>isinstance(obj, Clase)</code> valida el linaje de un objeto.", prompt: "Verifica si unidad es Dron:", template: ["valido = ", "___", "(unidad, ", "___", ")"], answers: ["isinstance", "Dron"], options: ["isinstance", "Dron", "type", "subclass"], explanation: "isinstance comprueba clases y subclases." },
      { type: "bug_hunt", title: "Caza de Bugs: super()", theory: "<code>super()</code> es una función y requiere paréntesis: <code>super().__init__()</code>.", prompt: "¿Cómo corriges la línea 3?", buggyCode: "1 | class Medico(Bot):\n2 |     def __init__(self, s):\n3 |         super.__init__(self, s)", choices: ["Cambiar línea 3 por: super().__init__(s)", "Usar extends", "Quitar __init__", "Cambiar def por class"], correctIndex: 0, explanation: "super() necesita paréntesis." },
      { type: "fill_blank", title: "Recursividad: Caso Base", theory: "Toda función recursiva necesita un caso base con <code>return</code> para detenerse.", prompt: "Detén la recursión cuando n <= 0:", template: ["def cuenta(n):\n    ", "___", " n <= 0:\n        ", "___", " \"Fin\""], answers: ["if", "return"], options: ["if", "return", "while", "break"], explanation: "if y return previenen bucles infinitos." },
      { type: "multiple_choice", title: "Llamada Recursiva", theory: "La función se resuelve acumulando llamadas hasta el caso base.", prompt: "¿Qué imprime sumar_hasta(3)?", codePreview: "def sumar(n):\n    if n == 1:\n        return 1\n    return n + sumar(n - 1)\nprint(sumar(3))", choices: ["6", "3", "1", "4"], correctIndex: 0, explanation: "3 + 2 + 1 = 6." },
      { type: "bug_hunt", title: "Caza de Bugs: RecursionError", theory: "Asegúrate de acercarte al caso base restando en lugar de sumar.", prompt: "¿Cuál es el fallo en factorial?", buggyCode: "1 | def fac(n):\n2 |     if n == 1:\n3 |         return 1\n4 |     return n * fac(n + 1)", choices: ["Se suma n + 1 alejándose del caso base; debe ser fac(n - 1)", "Falta while", "Las funciones no pueden llamarse a sí mismas", "Debe retornar yield"], correctIndex: 0, explanation: "Debe reducirse hacia el caso base n == 1." },
      { type: "free_code", title: "Reto Pre-Jefe: super()", theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Invoca al constructor padre.", prompt: "Escribe la línea para llamar al constructor padre con <code>modelo</code> y <code>bateria</code>:", contextCode: "class Dron(Unidad):\n    def __init__(self, modelo, bateria, rafagas):\n        # Llama al padre abajo:", placeholder: "super()...", acceptedAnswers: ["super().__init__(modelo, bateria)"], explanation: "¡Excelente! super().__init__(modelo, bateria) inicializa la superclase." }
    ]
  },

  // =====================================================================
  // NIVEL 6: LEYENDA (20 EJERCICIOS + JEFE 6 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "leyenda",
    number: 6,
    name: "Leyenda",
    role: "Oráculo del Núcleo",
    color: "rose",
    icon: "👑",
    description: "Metaprogramación y flujos perezosos: Generadores (yield), Decoradores (@), Closures y Dunder.",
    boss: {
      name: "IA Central Nemesis",
      avatar: "👁️",
      lore: "Nemesis opera en el núcleo cuántico. Combina un generador perezoso con yield y un decorador que intercepte y duplique el flujo total de energía.",
      combatRule: "Restricción Táctica: Obligatorio definir el decorador 'amplificar_flujo' y usar 'yield' en 'pulsos_estables'.",
      problemSpec: {
        objective: "Crea el decorador @amplificar_flujo, aplícalo a pulsos_estables(limite) e imprime el resultado de pulsos_estables(6).",
        rules: [
          "El decorador amplificar_flujo(func) debe recibir (*args, **kwargs), sumar los valores del generador con sum() y retornar esa suma multiplicada por 2.",
          "pulsos_estables(limite) debe recorrer de 1 a 'limite' y emitir con 'yield' el cuadrado (i ** 2) solo de los números pares.",
          "Imprime print(pulsos_estables(6)) (pares: 2, 4, 6 -> cuadrados: 4+16+36 = 56 -> x2 = 112)."
        ],
        expectedOutput: "112"
      },
      starterCode: `# NODO JEFE 6: IA Central Nemesis\n# Define @amplificar_flujo y el generador pulsos_estables(limite):\n\n\n# Imprime pulsos_estables(6):\n`,
      solutionCode: `def amplificar_flujo(func):\n    def wrapper(*args, **kwargs):\n        return sum(func(*args, **kwargs)) * 2\n    return wrapper\n\n@amplificar_flujo\ndef pulsos_estables(limite):\n    for i in range(1, limite + 1):\n        if i % 2 == 0:\n            yield i ** 2\n\nprint(pulsos_estables(6))`,
      hints: [
        { cost: 50, text: "Pista 1: Dentro del decorador, wrapper(*args, **kwargs) retorna sum(func(*args, **kwargs)) * 2." },
        { cost: 100, text: "Pista 2: En el generador, usa 'for i in range(1, limite + 1): if i % 2 == 0: yield i ** 2'." }
      ],
      shields: [
        {
          name: "Escudo 1: Yield y Decorador",
          validatePy: `
import ast
_t = ast.parse(_user_code)
assert any(isinstance(n, ast.Yield) for n in ast.walk(_t)), "Debes usar yield."
assert 'amplificar_flujo' in globals() and 'pulsos_estables' in globals(), "Define amplificar_flujo y pulsos_estables."
`
        },
        {
          name: "Escudo 2: Lote Visible (limite=6)",
          validatePy: `assert pulsos_estables(6) == 112, f"Se esperaba 112, pero retornó {pulsos_estables(6)}."`
        },
        {
          name: "Escudo 3: Prueba Ciega (limite=4)",
          validatePy: `assert pulsos_estables(4) == 40, "Fallo en prueba ciega con limite=4."`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "Generadores (yield)", theory: "<code>yield</code> pausa la ejecución, entrega un valor y recuerda su estado.", prompt: "Emite n con yield:", template: ["def secuencia():\n    n = 0\n    while True:\n        ", "___", " n\n        n += 1"], answers: ["yield"], options: ["yield", "return", "emit", "next"], explanation: "yield convierte la función en un generador." },
      { type: "multiple_choice", title: "next() en Generadores", theory: "<code>next()</code> reanuda el generador hasta el siguiente <code>yield</code>.", prompt: "¿Qué imprime?", codePreview: "def f():\n    yield 'A'\n    yield 'B'\ngen = f()\nnext(gen)\nprint(next(gen))", choices: ["B", "A", "AB", "Error"], correctIndex: 0, explanation: "El primer next consume 'A' y el segundo devuelve 'B'." },
      { type: "bug_hunt", title: "Caza de Bugs: StopIteration", theory: "Llamar a <code>next()</code> en un generador agotado lanza <code>StopIteration</code>.", prompt: "¿Por qué colapsa al llamar next dos veces?", buggyCode: "1 | def uno():\n2 |     yield 10\n3 | g = uno()\n4 | print(next(g))\n5 | print(next(g))", choices: ["El generador solo emite un valor; usa un bucle for que maneja StopIteration automáticamente", "Falta return", "next no existe", "Usa tuplas"], correctIndex: 0, explanation: "Un bucle for maneja StopIteration de forma segura." },
      { type: "fill_blank", title: "Expresiones Generadoras", theory: "Usa paréntesis <code>(expr for x in iterable)</code> para crear generadores eficientes.", prompt: "Crea la expresión generadora de cubos:", template: ["cubos = ", "___", "x ** 3 for x in range(1000)", "___"], answers: ["(", ")"], options: ["(", ")", "[", "]"], explanation: "Los paréntesis generan valores bajo demanda sin gastar memoria." },
      { type: "order_lines", title: "Materializar con list()", theory: "<code>list(gen)</code> convierte un generador en una lista clásica.", prompt: "Ordena para generar y convertir en lista:", lines: ["def pares(lim):", "    for n in range(lim):", "        yield n * 2", "res = list(pares(3))"], explanation: "list() consume el generador y produce [0, 2, 4]." },
      { type: "multiple_choice", title: "Generadores de Un Solo Uso", theory: "Un generador solo puede recorrerse una vez; al agotarse queda vacío.", prompt: "¿Qué imprime este código?", codePreview: "g = (x * 10 for x in [1, 2])\na = list(g)\nb = list(g)\nprint(a, b)", choices: ["[10, 20] []", "[10, 20] [10, 20]", "[] [10, 20]", "Error"], correctIndex: 0, explanation: "La segunda lectura encuentra el generador vacío []." },
      { type: "fill_blank", title: "Closures", theory: "Una función interna que recuerda el entorno de su función externa se llama <strong>closure</strong>.", prompt: "Devuelve la función interna multiplicar:", template: ["def crear_amp(factor):\n    def multiplicar(s):\n        return s * factor\n    ", "___", " multiplicar"], answers: ["return"], options: ["return", "yield", "def", "global"], explanation: "Retorna la referencia de la función interna." },
      { type: "multiple_choice", title: "Memoria Léxica", theory: "Cada closure conserva su propia copia de las variables externas.", prompt: "¿Qué imprime triplicador(10)?", codePreview: "def fabricar(n):\n    def aplicar(x):\n        return x * n\n    return aplicar\ntriplicador = fabricar(3)\nprint(triplicador(10))", choices: ["30", "20", "60", "13"], correctIndex: 0, explanation: "10 * 3 = 30." },
      { type: "fill_blank", title: "nonlocal", theory: "Usa <code>nonlocal</code> para modificar variables de la función envolvente.", prompt: "Habilita la modificación del contador externo:", template: ["def contador():\n    c = 0\n    def inc():\n        ", "___", " c\n        c += 1\n        return c\n    return inc"], answers: ["nonlocal"], options: ["nonlocal", "global", "self", "outer"], explanation: "nonlocal permite reasignar la variable del ámbito superior." },
      { type: "fill_blank", title: "Argumentos *args y **kwargs", theory: "<code>*args</code> captura argumentos posicionales y <code>**kwargs</code> argumentos clave.", prompt: "Configura la firma universal:", template: ["def proxy(", "___", "args, ", "___", "kwargs):\n    return len(args)"], answers: ["*", "**"], options: ["*", "**", "&", "@"], explanation: "* y ** agrupan argumentos variables." },
      { type: "order_lines", title: "Desempaquetado Universal", prompt: "Ordena el envoltorio universal:", lines: ["def envoltura(*args, **kwargs):", "    print('Log')", "    return func(*args, **kwargs)"], explanation: "Reenvía todos los argumentos a la función original." },
      { type: "fill_blank", title: "Decoradores (@)", theory: "Coloca <code>@decorador</code> encima de una función para extender su comportamiento.", prompt: "Aplica el decorador cifrar_canal:", template: ["___", "cifrar_canal\ndef transmitir():\n    return \"OK\""], answers: ["@"], options: ["@", "#", "$", "&"], explanation: "Sintaxis oficial de decoradores." },
      { type: "order_lines", title: "Estructura de un Decorador", prompt: "Ordena las líneas del decorador:", lines: ["def auditar(func):", "    def envoltura():", "        print('Auditando')", "        return func()", "    return envoltura"], explanation: "Recibe func, define envoltura y la retorna." },
      { type: "bug_hunt", title: "Caza de Bugs: Ejecución Prematura", theory: "Un decorador debe retornar la función sin paréntesis: <code>return wrapper</code>.", prompt: "¿Cómo corriges la línea 4?", buggyCode: "1 | def blindar(func):\n2 |     def wrapper():\n3 |         return func()\n4 |     return wrapper()", choices: ["Cambiar línea 4 por: return wrapper (sin paréntesis)", "Quitar def", "Usar yield", "Poner punto y coma"], correctIndex: 0, explanation: "Retorna la función y no su ejecución." },
      { type: "multiple_choice", title: "Decorador Transformador", theory: "Un decorador puede modificar el resultado devuelto por la función.", prompt: "¿Qué imprime?", codePreview: "def x10(func):\n    def wrap():\n        return func() * 10\n    return wrap\n@x10\ndef val():\n    return 5\nprint(val())", choices: ["50", "5", "15", "None"], correctIndex: 0, explanation: "5 * 10 = 50." },
      { type: "fill_blank", title: "Método Dunder __str__", theory: "<code>__str__(self)</code> define el texto que muestra <code>print(objeto)</code>.", prompt: "Implementa __str__:", template: ["class Nodo:\n    def __init__(self, c):\n        self.c = c\n    def ", "___", "(self):\n        return self.c"], answers: ["__str__"], options: ["__str__", "__print__", "toString", "__text__"], explanation: "__str__ personaliza la representación en string." },
      { type: "fill_blank", title: "Método Dunder __len__", theory: "<code>__len__(self)</code> habilita la función nativa <code>len()</code> en tus clases.", prompt: "Habilita len() para la clase:", template: ["class Escuadron:\n    def __init__(self, d):\n        self.d = d\n    def ", "___", "(self):\n        return len(self.d)"], answers: ["__len__"], options: ["__len__", "len", "__size__", "count"], explanation: "__len__ debe retornar un entero." },
      { type: "multiple_choice", title: "Sobrecarga con __add__", theory: "<code>__add__(self, otro)</code> define el comportamiento del operador <code>+</code>.", prompt: "¿Qué imprime b1 + b2?", codePreview: "class B:\n    def __init__(self, c):\n        self.c = c\n    def __add__(self, o):\n        return self.c + o.c\nb1 = B(40)\nb2 = B(60)\nprint(b1 + b2)", choices: ["100", "B(100)", "4060", "TypeError"], correctIndex: 0, explanation: "40 + 60 = 100." },
      { type: "fill_blank", title: "Igualdad con __eq__", theory: "<code>__eq__(self, otro)</code> personaliza el operador de comparación <code>==</code>.", prompt: "Define __eq__ para comparar pines:", template: ["class Llave:\n    def __init__(self, pin):\n        self.pin = pin\n    def ", "___", "(self, otra):\n        return self.pin == otra.pin"], answers: ["__eq__"], options: ["__eq__", "==", "__same__", "="], explanation: "__eq__ intercepta el operador ==" },
      { type: "free_code", title: "Reto Pre-Jefe: Emisión con yield", theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Emite con <code>yield</code>.", prompt: "Escribe la línea que emite el cuadrado de <code>i</code> bajo demanda:", contextCode: "for i in range(1, limite + 1):\n    if i % 2 == 0:\n        # Emite i al cuadrado con yield:", placeholder: "yield ...", acceptedAnswers: ["yield i ** 2", "yield (i ** 2)", "yield i * i"], explanation: "¡Excelente! yield i ** 2 emite cada pulso cuántico." }
    ]
  },

  // =====================================================================
  // NIVEL 7: TITÁN ANALÍTICO (20 EJERCICIOS + JEFE 7 DE 3 ESCUDOS)
  // =====================================================================
  {
    id: "titan_datos",
    number: 7,
    name: "Titán Analítico",
    role: "Oráculo de Automatización y Datos",
    color: "cyan",
    icon: "📊",
    description: "Automatiza flujos reales: limpieza ETL, JSON, expresiones regulares (re) y fechas.",
    boss: {
      name: "El Leviatán de Telemetría Corrupta",
      avatar: "🐉",
      lore: "El servidor central recibió un lote JSON con facturaciones contaminadas con texto ('Consumo: 120 m3', 'ERROR'). Construye un pipeline ETL combinando JSON, Regex, fechas y diccionarios.",
      combatRule: "Restricción Táctica: La función procesar_etl(json_str) debe usar 'json' y 're' para filtrar el mes '2026-10' y agrupar por sector.",
      problemSpec: {
        objective: "Crea procesar_etl(json_str) e imprime su resultado con 'trama_json'.",
        rules: [
          "Deserializa json_str con json.loads().",
          "Filtra registros de octubre de 2026 ('2026-10').",
          "Extrae dígitos con re.findall(r'\\d+', ...) y convierte el primero a int().",
          "Acumula la suma por 'sector' en un diccionario y retórnalo con print()."
        ],
        expectedOutput: "{'Norte': 200, 'Sur': 85}"
      },
      starterCode: `# NODO JEFE 7: El Leviatán de Telemetría Corrupta\nimport json\nimport re\n\ntrama_json = '''[\n    {"sector": "Norte", "lectura": "Consumo: 120 m3", "fecha": "2026-10-05"},\n    {"sector": "Sur", "lectura": "85 m3", "fecha": "2026-10-12"},\n    {"sector": "Norte", "lectura": "ERROR_SENSOR", "fecha": "2026-10-14"}\n]'''\n\n# Define procesar_etl(json_str) e imprime su resultado:\n`,
      solutionCode: `import json\nimport re\n\ntrama_json = '''[\n    {"sector": "Norte", "lectura": "Consumo: 120 m3", "fecha": "2026-10-05"},\n    {"sector": "Sur", "lectura": "85 m3", "fecha": "2026-10-12"},\n    {"sector": "Norte", "lectura": "ERROR_SENSOR", "fecha": "2026-10-14"}\n]'''\n\ndef procesar_etl(json_str):\n    registros = json.loads(json_str)\n    resumen = {}\n    for reg in registros:\n        if reg["fecha"].startswith("2026-10"):\n            hallados = re.findall(r"\\d+", reg["lectura"])\n            if hallados:\n                sec = reg["sector"]\n                resumen[sec] = resumen.get(sec, 0) + int(hallados[0])\n    return resumen\n\nprint(procesar_etl(trama_json))`,
      hints: [
        { cost: 50, text: "Pista 1: Usa reg['fecha'].startswith('2026-10') y re.findall(r'\\d+', reg['lectura'])." },
        { cost: 100, text: "Pista 2: Acumula en el diccionario con resumen[sec] = resumen.get(sec, 0) + int(hallados[0])." }
      ],
      shields: [
        {
          name: "Escudo 1: Módulos json y re",
          validatePy: `
assert 'procesar_etl' in globals() and callable(procesar_etl), "Define procesar_etl(json_str)."
assert "json.loads" in _user_code and "re." in _user_code, "Debes emplear json.loads() y el módulo re."
`
        },
        {
          name: "Escudo 2: Lote Visible",
          validatePy: `assert procesar_etl(trama_json) == {'Norte': 120, 'Sur': 85}, f"Se esperaba {{'Norte': 120, 'Sur': 85}}, retornó {procesar_etl(trama_json)}."`
        },
        {
          name: "Escudo 3: Prueba Ciega",
          validatePy: `
_oc = '[{"sector": "Este", "lectura": "300 m3", "fecha": "2026-10-01"}, {"sector": "Este", "lectura": "50 m3", "fecha": "2026-10-20"}]'
assert procesar_etl(_oc) == {'Este': 350}, "Fallo en prueba ciega."
`
        }
      ]
    },
    exercises: [
      { type: "fill_blank", title: "Saneamiento (.strip)", theory: "<code>.strip()</code> elimina espacios y saltos de línea invisibles en los extremos.", prompt: "Limpia los espacios del medidor:", template: ["crudo = \"   MED-9042   \"\nlimpio = crudo.", "___", "()"], answers: ["strip"], options: ["strip", "clean", "trim", "split"], explanation: "strip() limpia los bordes del texto." },
      { type: "fill_blank", title: "Partición (.split)", theory: "<code>.split(sep)</code> corta una cadena y devuelve una lista.", prompt: "Separa la fila CSV por comas:", template: ["fila = \"Sector,1450\"\ncols = fila.", "___", "(", "___", ")"], answers: ["split", "\",\""], options: ["split", "\",\"", "join", "\";\""], explanation: "split(',') divide el string en fragmentos." },
      { type: "multiple_choice", title: "Normalización (.replace)", theory: "<code>.replace()</code> quita símbolos y comas antes de convertir a número.", prompt: "¿Qué imprime?", codePreview: "m = '$1,500'\nprint(int(m.replace('$', '').replace(',', '')) + 500)", choices: ["2000", "1500500", "$2,000", "ValueError"], correctIndex: 0, explanation: "1500 + 500 = 2000." },
      { type: "fill_blank", title: "Ensamblaje (.join)", theory: "<code>\"-\".join(lista)</code> une los elementos de una lista en un string.", prompt: "Une con guiones:", template: ["partes = [\"2026\", \"10\", \"16\"]\nfecha = \"-\".", "___", "(", "___", ")"], answers: ["join", "partes"], options: ["join", "partes", "split", "merge"], explanation: "'-'.join() concatena la lista." },
      { type: "bug_hunt", title: "Caza de Bugs: Inmutabilidad", theory: "Los strings son inmutables; debes reasignar el resultado de <code>.replace()</code>.", prompt: "¿Cómo corriges la línea 2?", buggyCode: "1 | c = 'ID--99'\n2 | c.replace('--', '-')\n3 | print(c)", choices: ["Reasignar: c = c.replace('--', '-')", "Usar strip", "Usar corchetes", "Convertir a tupla"], correctIndex: 0, explanation: "Guarda siempre el string retornado." },
      { type: "fill_blank", title: "json.loads()", theory: "<code>json.loads()</code> convierte una cadena JSON en un diccionario de Python.", prompt: "Parsea el texto JSON:", template: ["import ", "___", "\npayload = '{\"nodo\": \"A1\"}'\ndatos = json.", "___", "(payload)"], answers: ["json", "loads"], options: ["json", "loads", "dumps", "parse"], explanation: "loads transforma texto JSON en dict Python." },
      { type: "multiple_choice", title: "Navegación JSON Anidado", theory: "Encadena claves e índices para extraer datos profundos.", prompt: "¿Qué imprime?", codePreview: "d = {'s': [{'p': 40}, {'p': 85}]}\nprint(d['s'][1]['p'])", choices: ["85", "40", "s", "Error"], correctIndex: 0, explanation: "Accede al segundo elemento y extrae 'p' (85)." },
      { type: "fill_blank", title: "json.dumps()", theory: "<code>json.dumps()</code> convierte un diccionario de Python a texto JSON estándar.", prompt: "Serializa el diccionario:", template: ["import json\nrep = {\"ok\": True}\ntexto = ", "___", ".", "___", "(rep)"], answers: ["json", "dumps"], options: ["json", "dumps", "loads", "stringify"], explanation: "dumps genera el string JSON." },
      { type: "order_lines", title: "Transformación JSON", prompt: "Ordena para cargar, actualizar y exportar JSON:", lines: ["import json", "data = json.loads('{\"intentos\": 2}')", "data['intentos'] += 1", "salida = json.dumps(data)"], explanation: "Loads, modifica y dumps." },
      { type: "bug_hunt", title: "Caza de Bugs: Comillas en JSON", theory: "El estándar JSON exige comillas dobles <code>\" \"</code> para todas las claves.", prompt: "¿Por qué falla loads()?", buggyCode: "1 | import json\n2 | t = \"{'id': 10}\"\n3 | json.loads(t)", choices: ["JSON exige comillas dobles: '{\"id\": 10}'", "Usa dumps", "Falta re", "El número 10 no está permitido"], correctIndex: 0, explanation: "JSON no admite comillas simples." },
      { type: "fill_blank", title: "Regex re.findall()", theory: "<code>re.findall(r\"\\d+\", texto)</code> extrae todos los números en una lista.", prompt: "Extrae los números del log:", template: ["import ", "___", "\nlog = \"Sensor 7: 140 psi\"\nnumeros = re.", "___", "(r\"\\d+\", log)"], answers: ["re", "findall"], options: ["re", "findall", "regex", "search"], explanation: "findall localiza todos los dígitos." },
      { type: "multiple_choice", title: "Capturas con re.findall()", theory: "<code>r\"\\d+\"</code> agrupa dígitos consecutivos.", prompt: "¿Qué imprime este extractor?", codePreview: "import re\nt = 'Medidor_04 -> 325m3'\nprint(re.findall(r'\\d+', t))", choices: ["['04', '325', '3']", "[4, 325]", "['04', '325']", "Error"], correctIndex: 0, explanation: "Captura cada grupo de dígitos." },
      { type: "fill_blank", title: "Limpieza con re.sub()", theory: "<code>re.sub(patron, nuevo, texto)</code> reemplaza patrones.", prompt: "Elimina caracteres no numéricos:", template: ["import re\ns = \"SN#409-X8\"\ndigitos = re.", "___", "(r\"[^0-9]\", ", "___", ", s)"], answers: ["sub", "\"\""], options: ["sub", "\"\"", "replace", "findall"], explanation: "re.sub borra todo lo que no sea dígito." },
      { type: "fill_blank", title: "Búsqueda con re.search()", theory: "<code>re.search()</code> busca un patrón. El ancla <code>^</code> indica 'al inicio'.", prompt: "Verifica si empieza con CRITICO:", template: ["ok = re.", "___", "(r\"", "___", "CRITICO\", log)"], answers: ["search", "^"], options: ["search", "^", "sub", "$"], explanation: "^ ancla la búsqueda al inicio del texto." },
      { type: "bug_hunt", title: "Caza de Bugs: Tipos de Regex", theory: "<code>re.findall()</code> devuelve strings; debes convertirlos a <code>int()</code> para sumar.", prompt: "¿Por qué da TypeError?", buggyCode: "1 | import re\n2 | h = re.findall(r'\\d+', 'Val: 40 y 60')\n3 | total = sum(h)", choices: ["Convierte a entero: sum(int(x) for x in h)", "Usa re.sub", "Usa r'\\w+'", "Quita import re"], correctIndex: 0, explanation: "sum() no puede sumar strings directamente." },
      { type: "fill_blank", title: "Fechas con strptime()", theory: "<code>datetime.strptime(texto, formato)</code> convierte strings en fechas.", prompt: "Parsea la fecha ISO:", template: ["from datetime import datetime\nf = datetime.", "___", "(\"2026-10-16\", \"", "___", "\")"], answers: ["strptime", "%Y-%m-%d"], options: ["strptime", "%Y-%m-%d", "strftime", "DD/MM/YYYY"], explanation: "strptime interpreta %Y-%m-%d." },
      { type: "fill_blank", title: "Formato con strftime()", theory: "<code>.strftime(formato)</code> formatea objetos de fecha a texto.", prompt: "Formatea a DD/MM/YYYY:", template: ["rep = fecha.", "___", "(\"%d/", "___", "/%Y\")"], answers: ["strftime", "%m"], options: ["strftime", "%m", "strptime", "%M"], explanation: "strftime da formato de salida al string." },
      { type: "multiple_choice", title: "Días de Mora (timedelta)", theory: "Restar dos fechas devuelve un timedelta cuyo atributo <code>.days</code> da el entero.", prompt: "¿Qué imprime?", codePreview: "from datetime import datetime\na = datetime.strptime('2026-10-01', '%Y-%m-%d')\nb = datetime.strptime('2026-10-16', '%Y-%m-%d')\nprint((b - a).days)", choices: ["15", "16", "'15 days'", "1"], correctIndex: 0, explanation: "Hay exactamente 15 días de diferencia." },
      { type: "order_lines", title: "Conteo con Counter", theory: "<code>Counter(lista)</code> cuenta frecuencias de elementos.", prompt: "Ordena para importar Counter y contar errores:", lines: ["from collections import Counter", "eventos = ['OK', 'ERROR', 'ERROR']", "res = Counter(eventos)", "print(resumen['ERROR'])"], explanation: "Counter agiliza conteos y frecuencias." },
      {
        type: "free_code",
        title: "Reto Pre-Jefe: Deserialización JSON",
        theory: "🔥 <strong>ESCRITURA LIBRE:</strong> Parsea un string JSON en Python.",
        prompt: "Escribe la línea para asignar a <code>registros</code> el resultado de parsear <code>json_str</code> con <code>json</code>:",
        contextCode: "import json\n# Parsea json_str aquí:",
        placeholder: "registros = ...",
        acceptedAnswers: ["registros = json.loads(json_str)"],
        explanation: "¡Excelente! json.loads() es el inicio de tu pipeline ETL."
      }
    ]
  }
);