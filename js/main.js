
class Particle{
    constructor(ctx, color){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;

        this.edgeSize = 20;
        
        this.x = this.edgeSize + Math.floor((Math.random()*(this.canvas.width - 2*this.edgeSize)));
        this.y = this.edgeSize + Math.floor((Math.random()*(this.canvas.height - 2*this.edgeSize)));

        this.radius = Math.floor(Math.random()*1 + 2);

        this.speedX = (Math.random() - 1) || 1;
        this.speedY = (Math.random() - 1) || -1;

        this.color = color;
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        this.ctx.fill();
        this.ctx.closePath();
    }

    move(){
        this.x += this.speedX;
        this.y += this.speedY;

    }

    checkCollision(){
        if(this.x - this.radius <= 0 || this.x + this.radius >= this.canvas.width){
            this.speedX *= -1;
        }

        if(this.y - this.radius <= 0 || this.y + this.radius >= this.canvas.height){
            this.speedY *= -1;
        }
    }
}

const resizeCanvas = (canvas, container) => {
    const {clientWidth, clientHeight} = container;
    
    canvas.width = clientWidth;
    canvas.height = clientHeight;
}


const initParticles = (PARTICLES_ARRAY, NUMBER_OF_PARTICLES, ctx, COLOR) => {
    const length = PARTICLES_ARRAY.length;

    for(let i = 0; i < length; i++){
        PARTICLES_ARRAY.pop();
    }

    for(let i = 0; i < NUMBER_OF_PARTICLES; i++){
        PARTICLES_ARRAY.push(new Particle(ctx, COLOR));
    }

}


const createCanvas = (container) => {
    const canvas = document.createElement("CANVAS");
    canvas.classList.add("canvas");

    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    resizeCanvas(canvas, container);

    /* Particles creation start */
    const PARTICLES_ARRAY = [];
    let NUMBER_OF_PARTICLES = 2;
    let COLOR = "yellow";

    if(container.classList.contains("card--cyan")){
        NUMBER_OF_PARTICLES = 2;
        COLOR = "hsl(180, 62%, 55%)";
    }
    if(container.classList.contains("card--red")){
        NUMBER_OF_PARTICLES = 3;
        COLOR = "hsl(0, 78%, 62%)";
    }
    if(container.classList.contains("card--blue")){
        NUMBER_OF_PARTICLES = 2;
        COLOR = "hsl(212, 86%, 64%)";
    }

    if(container.classList.contains("card--orange")){
        COLOR = "hsl(34, 97%, 64%)";
    }


    initParticles(PARTICLES_ARRAY, NUMBER_OF_PARTICLES, ctx, COLOR);
    /* Particles creation end */


    /* Animations start */
    const updateParticles = () => {
        PARTICLES_ARRAY.forEach(particle => {
            particle.draw();
            particle.checkCollision();
            particle.move();
        })
    }

    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const animate = () => {
        clearCanvas();
        updateParticles();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    /* Animations end */


    return {
        particlesArray:PARTICLES_ARRAY, 
        numberOfParticles:NUMBER_OF_PARTICLES,
        ctx, 
        color: COLOR,
        containerElement: container
    }

}

const canvasContainers = document.querySelectorAll(".canvas-container");

const canvasObjects = [];

canvasContainers.forEach(container => {
    const canvasObject = createCanvas(container);
    canvasObjects.push(canvasObject);
})


window.addEventListener("resize", () => {
    canvasObjects.forEach(canvasObject => {

        initParticles(
            canvasObject.particlesArray,
            canvasObject.numberOfParticles,
            canvasObject.ctx,
            canvasObject.color    
        );

        resizeCanvas(canvasObject.ctx.canvas, canvasObject.containerElement);

    })
})







/************************\
    Ripple Effect Start
\************************/

const rippleElements = document.querySelectorAll(".ripple-element");

const handleRippleAnimationEnd = (e) => {
    e.currentTarget.removeEventListener("animationend", handleRippleAnimationEnd);
    e.currentTarget.remove();
}

const createRippleEffect = (e) => {
    // Stoping event bubbling in case user clicked ripple element which is 
    // a child of element which also is element with ripple effect. 
    e.stopPropagation();
    
    // Element in which we will create ripple effect. 
    const element = e.currentTarget;

    // Getting elements left and top position relative to viewport.
    const {top: elementTop, left: elementLeft } = element.getBoundingClientRect();

    // Getting click event's x and y coordinates.
    const top = e.clientY;
    const left = e.clientX;

    // calculating click event's x and y coordinate relative to element.
    // this x and y will be ripple elements center position's coordinates relative to parent element which in this case is "element".
    const posY = top - elementTop;
    const posX = left - elementLeft;


    const ripple = document.createElement("div");
    ripple.style.top = posY + "px";
    ripple.style.left = posX + "px";
    let COLOR = null;

    if(element.classList.contains("card--cyan")){
        COLOR = "hsl(180, 62%, 55%)";
    }
    if(element.classList.contains("card--red")){
        COLOR = "hsl(0, 78%, 62%)";
    }
    if(element.classList.contains("card--blue")){
        COLOR = "hsl(212, 86%, 64%)";
    }

    if(element.classList.contains("card--orange")){
        COLOR = "hsl(34, 97%, 64%)";
    }
    ripple.style.backgroundColor = COLOR;

    
    
    ripple.classList.add("ripple");
    
    ripple.addEventListener("animationend", handleRippleAnimationEnd);

    element.appendChild(ripple);


}

rippleElements.forEach(element => {
    element.style.position = "relative";
    element.style.zIndex = "0";
    element.style.overflow = "hidden";
    element.addEventListener("click", createRippleEffect);

})

/************************\
    Ripple Effect end
\************************/