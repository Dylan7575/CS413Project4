
//////***************************************creating gameport and renderer******************/
var GAME_WIDTH =720;
var GAME_HEIGHT=400;
var GAME_SCALE =1;

var gameport =document.getElementById("gameport");
var renderer= new PIXI.autoDetectRenderer(GAME_WIDTH,GAME_HEIGHT,{backgroundColor:0x99d5ff});
var world;

gameport.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;
var knight;
/*************************************************Ending gameport and renderer*************************/


/************************************************creating state machine for moving***********/
var menu = StateMachine.create({
    initial: {state: 'still', event: 'init'},
    error: function() {},
    events: [
        {name: "dKey", from: "still", to: "moveRight"},
        {name: "aKey", from: "still", to: "moveLeft"},
        {name: "dKey", from: "moveRight", to: "moveRight"},
        {name: "Nothing", from: "moveLeft", to: "still"},
        {name: "Nothing", from: "moveRight", to: "still"},
        {name: "aKey", from: "moveLeft", to: "moveLeft"},
        {name: "aKey", from: "moveRight", to: "moveLeft"},
        {name: "dKey", from: "moveLeft", to: "moveRight"}],
       // {name: "down", from: "run", to: "run"},

       // {name: "up", from: "fight", to: "fight"},
       // {name: "up", from: "magic", to: "fight"},
       // {name: "up", from: "steal", to: "magic"},
       // {name: "up", from: "item", to: "steal"},
      //  {name: "up", from: "run", to: "item"}],

    callbacks: {
        onaKey: function() { moveLeft(); },
        ondKey: function() { moveRight(); },
        onNothing:function(){standingStill();}
    }
});
/******************************************************Ending State Machine*****************/
function moveLeft(){
    if (!knight) return;
    createjs.Tween.removeTweens(knight.position);
    knight.scale.x = -1;
    knight.play();
    createjs.Tween.get(knight.position).to({x: knight.x - 32}, 500);

}
function standingStill(){
    if (!knight) return;
    createjs.Tween.removeTweens(knight.position);
    knight.gotoAndStop(1);

}
function moveRight(){
    if (!knight) return;
    createjs.Tween.removeTweens(knight.position);
    knight.scale.x = 1;
    knight.play();
    createjs.Tween.get(knight.position).to({x: knight.x + 32}, 500);
}
/************************************************Preloader and function for it**************/
PIXI.loader
    .add('map_json','map.json')
    .add('tileset','tileset.png')
    .add("knight.json")
    .load(ready);
var frames = [];

var start;
function ready() {

    var tu = new TileUtilities(PIXI);
    world = tu.makeTiledWorld("map_json", "tileset.png");
    stage.addChild(world);
    for (i=1;i<=6;i++){
        frames.push(PIXI.Texture.fromFrame("runner"+i+".png"));
    }
    start = world.getObject("start");
    knight = new PIXI.extras.MovieClip(frames);
    knight.scale.y=1;
    knight.scale.x=1;
    knight.anchor.x = 0.5;
    knight.anchor.y = 0.3;
    knight.position.x=start.x;
    knight.position.y=start.y;
    knight.animationSpeed=.1;

    var entity_layer= world.getObject("Entities");
    entity_layer.addChild(knight);
}
/********************************************************************************************/
document.addEventListener("keyup",function (e){
    menu.Nothing();
});

document.addEventListener("keydown",function (e) {
    if(e.keyCode==65){
        menu.aKey();
    }
    if(e.keyCode==68){
        menu.dKey();
    }
});


/*******************************************Ending Preloader and function*****************/
function animate(timestamp) {
    requestAnimationFrame(animate);
    update_camera();
    renderer.render(stage);
}


function update_camera() {
    stage.x = -knight.x*GAME_SCALE + GAME_WIDTH/2 - knight.width/2*GAME_SCALE;
    stage.y = -knight.y*GAME_SCALE + GAME_HEIGHT/2 + knight.height/2*GAME_SCALE;
    stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
    stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

animate();
