class Game{
    constructor(){
        this.reset = createButton("Reset");
    }
    readGameState(){
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value",(data)=>{
            gameStateValue = data.val()
        });
    }
    start(){
        playerObj = new Player();
        playerObj.readPlayerCount();

        player = createSprite(50,150);
        player.addImage("player",playerImg);
        player.scale = 0.06;

        enemy = createSprite(450,150);
        enemy.addImage("enemy",enemyImg);
        enemy.scale = 0.3;

        playersArray = [player,enemy];  
        
        laserGroup = new Group();
    }
    update(state){
     database.ref("/").update({
         gameState : state
     })   
    }
    handleElements(){
        this.reset.position(width-60,10);
        formObj.hide();
    }
    handleResetButton(){
        this.reset.mousePressed(()=>{
            database.ref("/").update({
                gameState : 0,
                playerCount : 0 , 
                players : [] 
            })
            window.location.reload();
        })
    }
    handlePlayerControls(){
        if(keyIsDown(UP_ARROW)){ 
            playerObj.positionY = playerObj.positionY-10;
            playerObj.update();
        }
        if(keyIsDown(DOWN_ARROW)){ 
            playerObj.positionY = playerObj.positionY+10;
            playerObj.update();
        }
    }
    handlePlayerAttacks(){
        if(playerObj.index === 1){
            if(keyWentDown("space")){
                this.playerAttack(55,playerObj.positionY,3,laserImg,11);
            }

        }
        else{
            if(keyWentDown("space")){
                this.playerAttack(445,playerObj.positionY,-3,laser2Img,2);
            }
        }
    }
    laserPositionUpdate(){
    }
    displayPlayerHealth(){
         if(playerObj.index === 1){
            push();
            fill("red");
            stroke("black");
            rect(440,playersArray[1].position.y-35,50,5);
            fill("green");
            rect(440,playersArray[1].position.y-35,playerObj.health/2,5);
            pop();
        }
        else{
            push();
            fill("red");
            stroke("black");
            rect(40,playersArray[0].position.y-35,50,5);
            fill("green");
            rect(40,playersArray[0].position.y-35,playerObj.health/2,5);
            pop();
        }
    }
    playerAttack(x,y,v,img,index){
        var laser = createSprite(x,y,10,10)
        laser.velocityX = v;
        laser.scale = 0.1;
        laser.y = y;
        laser.addImage("playerLaser",img);
        laserGroup.add(laser);
        var laserIndex = "lasers/laser" + index
        console.log(laser.x)
        database.ref(laserIndex).update({
            laserX : laser.x,
            laserY : laser.y,
        })
    } 
    handleAttackCollision(index){
        if(index === 1){
            playersArray[1].overlap(laserGroup,function(collector,collected){
            collected.remove();
                console.log("test");
                playerObj.health = playerObj.health - 10;
        })}
        else{
            playersArray[0].overlap(laserGroup,function(collector,collected){
                collected.remove();
                console.log("test1");
                playerObj.health = playerObj.health - 10;
            })
        }
    }

//        displayEnemyHealth(){
//            if(playerObj.index === 2){
//               push();
//               fill("white");
//               rect(440,playerObj.positionY-35,50,5);
//               fill("green");
//               rect(440,playerObj.positionY-35,playerObj.health/2,5);
//               pop();
//           }
//    }
    play(){
        this.handleElements();
        this.handleResetButton();
        Player.getPlayerInfo();
        if(allPlayers !== undefined){
            var index  = 0;
            for(var plr in allPlayers ){
                index = index + 1;
                var y = allPlayers[plr].positionY;
                playersArray[index-1].position.y = y;
                this.handlePlayerAttacks();
                if(index === playerObj.index){
                    this.displayPlayerHealth();
                    this.handleAttackCollision(index);
//                    this.displayEnemyHealth();
                }
            }
            this.handlePlayerControls();
            drawSprites();
        }
    }

}