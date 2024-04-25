const consolewindow = document.getElementById('console-window');

function fetchCodeOutput() {
    const code = document.getElementById('code-input').value;
    const codeList = code.split('\n');
    const codeString = codeList.join('\n');

    fetch('https://computermathematik.noemt.dev/api/v1/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: codeString
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        if (data.error) {
            let output = Array.isArray(data.output) ? data.output.join('<br>') : data.output;
            consolewindow.innerHTML = data.error + '<br>' + data.traceback.replace(/\n/g, '<br>') + '<hr>' + output;
            
            return;
        }
        else {
            consolewindow.innerHTML = data.output.join('\n');
        }
    })
}

let pegasusCode = `def pegasus(f, a, b, max_iter=50, tol=1e-200):
    fa = f(a)
    fb = f(b)
    for _ in range(max_iter):
        c = b - fb * (b - a) / (fb - fa + 1e-100)  # division durch null vermeiden
        fc = f(c)
        if abs(fc) < tol:
            return c
        a, b, fa, fb = (b, c, fb, fc) if fa * fc > 0 else (a, c, fa, fc)
    return b 

def nullstellenfunktion(f, a, b, num_intervals=1):
    interval_size = (b - a) / num_intervals
    nullstellen = []
    for i in range(num_intervals):
        interval_a = a + i * interval_size
        interval_b = a + (i + 1) * interval_size
        nullstelle = pegasus(f, interval_a, interval_b)
        if nullstelle is not None:
            nullstellen.append(nullstelle)

    return list(set(nullstellen))

def interwall_schaetzen(f, a, b, interval_size=0.1):
    num_intervals = 0
    x = a
    while x < b:
        slope = abs((f(x+interval_size) - f(x)) / interval_size)
        num_intervals += max(1, int(slope))
        x += interval_size
    return num_intervals


"""
VARIABLEN
"""
untere_grenze = -7
obere_grenze = 7

def f(x):
    return math.sin(x)

num_intervals = interwall_schaetzen(f, untere_grenze, obere_grenze)
nullstellen = nullstellenfunktion(f, untere_grenze, obere_grenze, num_intervals)

nullstellen = sorted([nullstelle for nullstelle in nullstellen if untere_grenze <= nullstelle <= obere_grenze])

print(nullstellen)`

function loadPegasus() {
    document.getElementById('code-input').value = pegasusCode;
}

let fixpunktCode = `def f(x):
    return x**0.5 # hier soll die Funktion definiert werden.

def fixpunkt_berechnen(startwert, toleranz=10e-7, max_iterationen=1000):

    wert = startwert
    for i in range(max_iterationen):
        iteration = f(wert)
        differenz = abs(iteration - wert)

        if differenz < toleranz:
            return iteration

        wert = iteration
    return None

fixpunkt = fixpunkt_berechnen(0.1)

if fixpunkt:
    print(f"Fixpunkt: {fixpunkt}")

else:
    print("Kein Fixpunkt mit der gegebenen Toleranz und maximalen Menge an iterationen gefunden.")`

function loadFixpunkt() {
    document.getElementById('code-input').value = fixpunktCode;
}

let bisektionCode = `class BisektionsVerfahren:
    def __init__(self, a:float, b:float, c:float):
        self.a = a
        self.b = b 
        self.c = c

    def funktionswert(self, x:float):
        return self.a*x*x + self.b*x + self.c

    def verfahren(self, iterationen: int, untere_grenze: float, obere_grenze: float) -> list:
        if self.funktionswert(untere_grenze) > self.funktionswert(obere_grenze):
            cache = untere_grenze
            untere_grenze = obere_grenze
            obere_grenze = cache

        mittelwert = 0
        naeherungswerte = []

        naeherungswerte = []
        for i in range(iterationen):
            mittelwert = (untere_grenze+obere_grenze) / 2
            string = f"{untere_grenze} {obere_grenze} {mittelwert}"
            naeherungswerte.append(string)
            
            if self.funktionswert(mittelwert) == 0:
                break

            if self.funktionswert(untere_grenze)*self.funktionswert(obere_grenze) < 0:
                obere_grenze = mittelwert

            else:
                untere_grenze = mittelwert
                
        return naeherungswerte

bisektion = BisektionsVerfahren(1, 2, 3)
print(bisektion.verfahren(5, -5, 5))`

function loadBisektion() {
    document.getElementById('code-input').value = bisektionCode;
}

newtonCode = `class NewtonVerfahren:
    """
    Berechnung mit quadratischen Funktionen
    """
    def __init__(self, a:float, b:float, c:float):
        self.a = a
        self.b = b 
        self.c = c

    def funktionswert(self, x:float):
        a = self.a
        b = self.b
        c = self.c
        
        return a*x*x + b*x + c

    def ableitungswert(self, x:float):
        a = self.a
        b = self.b
        c = self.c

        return 2*a*x + b

    def verfahren(self, iterationen: int, naeherungswert: float) -> list:
        naeherungswerte = []
        for i in range(iterationen):
            naeherungswert = naeherungswert-(
                self.funktionswert(naeherungswert)/
                self.ableitungswert(naeherungswert)
            )
            naeherungswerte.append(naeherungswert)

        return naeherungswerte

newton = NewtonVerfahren(a=1, b=0, c=-2)
print(newton.verfahren(20, 3))`

function loadNewton() {
    document.getElementById('code-input').value = newtonCode;
}
