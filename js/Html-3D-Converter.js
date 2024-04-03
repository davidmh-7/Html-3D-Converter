(() => {
    const containerElement = document.querySelector('#CrearEfecto3D');

    const DISTANCIAHIJOS = 15;
    const DISTANCIA = 10000;

    let isDragging = false;
    let rotationX = 0;
    let rotationY = 0;
    let startX, startY;

    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 50 + Math.floor(Math.random() * 30);
        const lightness = 40 + Math.floor(Math.random() * 30);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    const getDOMDepth = element => [...element.children].reduce((max, child) => Math.max(max, getDOMDepth(child)), 0) + 1;
    const domDepthCache = getDOMDepth(document.body);
    const getColorByDepth = (depth, hue = 0, lighten = 0) => `hsl(${hue}, 75%, ${Math.min(10 + depth * (1 + 60 / domDepthCache), 90) + lighten}%)`;

    // Aplica el estilo 3D al Container
    containerElement.style.overflow = "visible";
    containerElement.style.transformStyle = "preserve-3d";
    containerElement.style.perspective = DISTANCIA;
    containerElement.style.perspectiveOrigin = containerElement.style.transformOrigin = `50% 50%`;

    // Llame a la función recorrerDOM después de que el contenedor esté configurado correctamente
    document.addEventListener('DOMContentLoaded', () => {
        recorrerDOM(containerElement, 0, 0, 0);
    });

    document.addEventListener("mousedown", (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            rotationY += deltaX * 0.5;
            rotationX -= deltaY * 0.5;
            startX = event.clientX;
            startY = event.clientY;
            containerElement.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }
    });

    // Función recursiva para recorrer nodos secundarios, aplicar estilos 3D a los hijos
    function recorrerDOM(nodoPadre, profundidad, ejeX, ejeY) {
        for (let children = nodoPadre.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
            const childNode = children[i];
            if (!(1 === childNode.nodeType && !childNode.classList.contains('dom-3d-side-face'))) continue;

            Object.assign(childNode.style, {
                transform: `translateZ(${DISTANCIAHIJOS}px)`,
                overflow: "visible",
                backfaceVisibility: "visible",
                isolation: "auto",
                transformStyle: "preserve-3d",
                willChange: 'transform',
            });

            let updatedejeX = ejeX;
            let updatedejeY = ejeY;
            if (childNode.offsetParent === nodoPadre) {
                updatedejeX += nodoPadre.offsetLeft;
                updatedejeY += nodoPadre.offsetTop;
            }

            recorrerDOM(childNode, profundidad + 1, updatedejeX, updatedejeY);
        }
    }
})();