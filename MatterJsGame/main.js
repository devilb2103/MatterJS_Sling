//basic world property declarations
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine = Engine.create();
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 900,
    height: 500,
    wireframes: false
  }
});

//mouse click and drag controlls
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: {visible: false}
  }
});
render.mouse = mouse;

//world objects
let ball = Matter.Bodies.circle(300,200,20);
let sling = Matter.Constraint.create({
  pointA: {x: 300, y: 200},
  bodyB: ball,
  stiffness: 0.05
});

var ground = Bodies.rectangle(630,350,300,30,{ isStatic: true });
let stack = Matter.Composites.stack(570,140,4,4,0,0,function(x,y){
  let sides = Math.round(Matter.Common.random(2,8));
  return Matter.Bodies.polygon(x,y,8,20);
})

//game functions
let firing = false;

Matter.Events.on(mouseConstraint, 'enddrag', function(e){
  if(e.body == ball){
    firing = true;
  }
});

Matter.Events.on(engine, 'afterUpdate', function(){
  if(firing && Math.abs(ball.position.x-300) < 20 && Math.abs(ball.position.y-200) < 20){
    ball = Matter.Bodies.circle(300,200,20);
    Matter.World.add(engine.world,ball);
    sling.bodyB = ball;
    firing = false;
  }
});

//instantiate and initialize world
World.add(engine.world, [ball,sling,stack,ground,mouseConstraint]);
Engine.run(engine);
Render.run(render);