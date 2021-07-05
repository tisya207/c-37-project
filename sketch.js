var PLAY = 1;
var END = 0;
var gameState = PLAY;

//var trex, trex_running, trex_collided;
var runner;
var ground, invisibleGround, groundImage, trex;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trexImg = loadImage('trex.png');
  
  groundImage = loadImage("ground2.png");
   cloudImage = loadImage("cloud.png");  
  cloudImage1 = loadImage("cloud 1.png");
  cloudImage2 = loadImage("cloud 2.png");
  cloudImage3 = loadImage("cloud 3.png");
  cloudImage4 = loadImage("cloud 4.png");
  cloudImage5 = loadImage("cloud 5.png");

  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3"); 
}

function setup() {
  createCanvas(displayWidth - 20, 500);
  
  trex = createSprite(50,180,20,50);
  trex.addImage("running", trexImg);
  trex.addImage("collided", trexImg);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background('#ffff00');
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
  
    if(keyDown("space")) {
      console.log('hi')
      jumpSound.play();
      trex.velocityY = -5;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
  
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();  
      gameState = END;
        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeImage("collided",trexImg);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

/* function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth - 20,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage1);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  } */
  
function spawnClouds() {
  if(frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth - 20,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: cloud.addImage(cloudImage1);
              break;
      case 2: cloud.addImage(cloudImage2);
              break;
      case 3: cloud.addImage(cloudImage3);
              break;
      case 4: cloud.addImage(cloudImage4);
              break; 
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth - 20,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  ground.velocityX = -(6 + 3*score/100);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeImage("running",trexImg);
  
  score = 0;
  
}



//camera.position.x=trex.x
//trex.x=