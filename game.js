
//////***************************************creating gameport and renderer******************/
var GAME_WIDTH =350;
var GAME_HEIGHT=620;
var GAME_SCALE =1;

var gameport =document.getElementById("gameport");
var renderer= new PIXI.autoDetectRenderer(GAME_WIDTH,GAME_HEIGHT,{backgroundColor:0x99d5ff});
var world;

gameport.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;
var knight;
var mouth;
var endScreen = new PIXI.Container();
/*************************************************Ending gameport and renderer*************************/
function getRandomInt(min,max) {
    return Math.floor(Math.random()*(max-min))+min;

}
function box_point_intersection(box,x,y){
    if (box.position.x > x) return false;
    if (x > box.position.x + box.width) return false;
    if (box.position.y > y) return false;
    if (y > box.position.y + box.height) return false;
    return true;
}
function endCondition(){
    createjs.Tween.removeTweens(knight.position);
    createjs.Tween.removeTweens(mouth.position);
    endScreen.visible=1;
    world.visible=0;
    clearTimeout(timer);
}
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
        {name: "Shooting", from: "still", to: "Shoot"},
        {name: "Nothing", from: "Shoot", to: "still"},
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
        onNothing:function(){standingStill();},
        onShooting:function(){shooterMcGavin();}
    }
});
/******************************************************Ending State Machine*****************/
function moveLeft(){
    if (!knight) return;
    if(knight.position.x-32>16) {
        moveSound.play();
        createjs.Tween.removeTweens(knight.position);
        knight.scale.x = -1;
        knight.play();
        createjs.Tween.get(knight.position).to({x: knight.x - 32}, 500);
        mouth.position.x = knight.position.x;
        gameRestart.position.x = knight.position.x - 130;
        endText.position.x = knight.position.x - 50;
    }

}
function standingStill(){
    if (!knight) return;
    createjs.Tween.removeTweens(knight.position);
    knight.gotoAndStop(1);

}
function moveRight(){
    if (!knight) return;
    if(knight.position.x+32<1370) {
        moveSound.play();
        createjs.Tween.removeTweens(knight.position);

        knight.scale.x = 1;
        knight.play();
        createjs.Tween.get(knight.position).to({x: knight.x + 32}, 500);
        mouth.position.x = knight.position.x;
        gameRestart.position.x = knight.position.x - 130;
        endText.position.x = knight.position.x - 50;
    }


}
function shooterMcGavin(){
    if(mouth.visible==0){
        shootSound.play();
        createjs.Tween.removeTweens(mouth.position);
        createjs.Tween.get(mouth.position).to({y: -10}, 1000);
        mouth.visible=1;
    }


}
/************************************************Preloader and function for it**************/
PIXI.loader
    .add('map_json','map.json')
    .add('tileset','tileset.png')
    .add("fatman.json")
    .add("myfont.fnt")
    .add("shoottongue.mp3")
    .add("move.mp3")
    .add ("food.mp3")
    .load(ready);
var frames = [];
var starts=[];
var burgers;
var starts2=[];
var starts3=[];
var starts4=[];
var moveSound;
var shootSound;
var hitSound;
var titlescreen = new PIXI.Container();
var endScreen = new PIXI.Container();
endScreen.visible=0;
var timer;
var gameRestart;
var endText;

function ready() {
    var title = new PIXI.extras.BitmapText("World Champion Eater",{font:"32px myfont"});
    title.position.x=10;
    title.position.y=100;

    titlescreen.addChild(title);
    var gameStart = new PIXI.extras.BitmapText("Click Here to start",{font:"32px myfont"});
    gameStart.position.x=40;
    gameStart.position.y=200;
    gameStart.interactive=true;
    gameStart.on('mousedown',mouseHandle);
    function mouseHandle(){
        world.visible=1;
        titlescreen.visible=0;
        timer = setTimeout(endCondition,120000);
    }
    titlescreen.addChild(gameStart);
    titlescreen.visible=1;
    stage.addChild(titlescreen);








    moveSound =PIXI.audioManager.getAudio("move.mp3");
    shootSound = PIXI.audioManager.getAudio("shoottongue.mp3");
    hitSound = PIXI.audioManager.getAudio("food.mp3");



    var tu = new TileUtilities(PIXI);
    world = tu.makeTiledWorld("map_json", "tileset.png");
    world.visible=0;
    stage.addChild(world);

    for (i=1;i<=3;i++){
        frames.push(PIXI.Texture.fromFrame("fatman"+i+".png"));
    }

    var temp_texture=new PIXI.Texture.fromImage("burger.png");
    var temp_texture2=new PIXI.Texture.fromImage("shake.png");
    var temp_texture3=new PIXI.Texture.fromImage("pizza.png");
    var temp_texture4=new PIXI.Texture.fromImage("fries.png");
    starts.length=0;
    starts2.length=0;
    starts3.length=0;
    starts4.length=0;
    for(i=0;i<31;i++) {
        burgers = new PIXI.Sprite(temp_texture);
        burgers.position.x = getRandomInt(0, 290);
        burgers.position.y = getRandomInt(10, 200);
        starts.push(burgers);
    }
    for(i=0;i<31;i++){
        burgers = new PIXI.Sprite(temp_texture2);
        burgers.position.x = getRandomInt(365, 650);
        burgers.position.y = getRandomInt(10, 200);
        starts2.push(burgers);
    }
    for(i=0;i<31;i++){
        burgers = new PIXI.Sprite(temp_texture3);
        burgers.position.x = getRandomInt(720, 975);
        burgers.position.y = getRandomInt(10, 200);
        starts3.push(burgers);
    }
    for(i=0;i<31;i++){
        burgers = new PIXI.Sprite(temp_texture4);
        burgers.position.x = getRandomInt(1100, 1360);
        burgers.position.y = getRandomInt(10, 200);
        starts4.push(burgers);
    }

    knight = new PIXI.extras.MovieClip(frames);
    knight.anchor.x = 0.5;
    knight.anchor.y = 0.57;
    knight.position.x=50;
    knight.position.y=593;
    knight.animationSpeed=.1;



    endText = new PIXI.extras.BitmapText("Times Up!",{font:"32px myfont"});
    endText.position.x=stage.x+100;
    endText.position.y=100;
    gameRestart= new PIXI.extras.BitmapText("Click Here to go back\n    to the main menu",{font:"32px myfont"});
    gameRestart.position.x=stage.x+20;
    gameRestart.position.y=200;
    gameRestart.interactive=true;
    gameRestart.on('mousedown',mouseHandler);
    function mouseHandler(){
        world.visible=0;
        endScreen.visible=0;
        ready();

    }

    endScreen.addChild(endText);
    endScreen.addChild(gameRestart);
    stage.addChild(endScreen);


    var m= new PIXI.Texture.fromImage("tongue.png");
    mouth = new PIXI.Sprite(m);
    mouth.anchor.x=.5;
    mouth.anchor.y=.5;
    mouth.position.x=knight.position.x+10;
    mouth.position.y=knight.position.y-64;
    mouth.visible=0;





    var entity_layer= world.getObject("Entities");
    entity_layer.addChild(knight);
    for(j=0;j<31;j++){
        entity_layer.addChild(starts[j]);
        entity_layer.addChild(starts2[j]);
        entity_layer.addChild(starts3[j]);
        entity_layer.addChild(starts4[j]);

    }
    entity_layer.addChild(mouth);






}
/********************************************************************************************/
document.addEventListener("keyup",function (e){
    menu.Nothing();
});

document.addEventListener("keydown",function (e) {
    if(titlescreen.visible==0 && endScreen.visible==0){
        if(e.keyCode==65){
            menu.aKey();
        }
        if(e.keyCode==68){
            menu.dKey();
        }
        if(e.keyCode==69){
            menu.Shooting();
        }
    }

});


/*******************************************Ending Preloader and function*****************/
function animate(timestamp) {
    requestAnimationFrame(animate);
    update_camera();
    if(mouth.position.y<0){
        mouth.position.y=knight.position.y-64;
        mouth.visible=0;
    }
    for(i=0;i<31;i++){
        if(box_point_intersection(starts[i],mouth.x,mouth.y)){
            hitSound.play();
            createjs.Tween.removeTweens(mouth.position);
            createjs.Tween.removeTweens(starts[i].position);
            starts[i].position.y=-10;
            starts[i].visible=0;
            mouth.visible = false;
            mouth.position.y=knight.position.y-64;
        }
        if(box_point_intersection(starts2[i],mouth.x,mouth.y)){
            hitSound.play();
            createjs.Tween.removeTweens(mouth.position);
            createjs.Tween.removeTweens(starts2[i].position);
            starts2[i].position.y=-10;
            starts2[i].visible=0;
            mouth.visible = false;
            mouth.position.y=knight.position.y-64;
        }
        if(box_point_intersection(starts3[i],mouth.x,mouth.y)){
            hitSound.play();
            createjs.Tween.removeTweens(mouth.position);
            createjs.Tween.removeTweens(starts3[i].position);
            starts3[i].position.y=-10;
            starts3[i].visible=0;
            mouth.visible = false;
            mouth.position.y=knight.position.y-64;
        }
        if(box_point_intersection(starts4[i],mouth.x,mouth.y)){
            hitSound.play();
            createjs.Tween.removeTweens(mouth.position);
            createjs.Tween.removeTweens(starts4[i].position);
            starts4[i].position.y=-10;
            starts4[i].visible=0;
            mouth.visible = false;
            mouth.position.y=knight.position.y-64;
        }

    }

    renderer.render(stage);
}


function update_camera() {
    stage.x = -knight.x*GAME_SCALE + GAME_WIDTH/2 - knight.width/2*GAME_SCALE;
    stage.y = -knight.y*GAME_SCALE + GAME_HEIGHT/2 + knight.height/2*GAME_SCALE;
    stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
    stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

animate();
