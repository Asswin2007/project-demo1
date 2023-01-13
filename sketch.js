var PLAY = 1; // 1 = true  0 = false
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("back1.png");
  
  
  obstacle1 = loadImage("obstacle.png");
    
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600,200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(600,100,200,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2


  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);  // image is apply in sprite
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,40,40,0);
  trex.debug = false

  
  stroke("red");
  score = 0;

  trex.depth = ground.depth;
  trex.depth += 1;

  

}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    
    score = score + Math.round(getFrameRate()/60);

    score.depth = trex.depth;
    score.depth += 1;

    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
  
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      if(mousePressedOver(restart)) {
      reset();
    }

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
       
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
 

  drawSprites();
}

function reset(){
  
  restart.visible = false;
  gameState.visible = false;
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   obstacle.addImage(obstacle1);

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;

   //obstacle.debug = true
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
