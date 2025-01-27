import { stateHeight , Sitting, Running, Jumping, Falling , Squating , Dieing} from "./playerStates.js";//,Squating

export class Player {
    constructor(game){
        this.game = game;
        this.width = 88;
        this.height = 94;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 0.3;
        this.image = document.getElementById("source");
        this.positionLocationX = 1853;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 15;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.states = [new Sitting(this.game),new Running(this.game) , new Jumping(this.game), new Falling(this.game) , new Squating(this.game) , new Dieing(this.game)];//, new Squating(this)
        this.stateheight = stateHeight;
    }
    update(input , deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        
        this.y += this.vy;
        if(input.includes("ArrowDown")) this.weight = 2;
        else this.weight = 0.3;
        if(! this.onGround())this.vy += this.weight;
        else this.vy = 0;

        // vertical boundaries
        if(this.y  >= this.game.height - this.height - this.game.groundMargin){
            this.y = this.game.height - this.height - this.game.groundMargin
        }

        
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame)this.frameX++;
            else this.frameX = 0;
            
        } 
        else{
            this.frameTimer += deltaTime;
            
        }
        
    }
    draw(context){
        context.drawImage(this.image,this.positionLocationX +  this.frameX * this.width , this.frameY ,  this.width , this.height , this.x , this.y , this.width, this.height);
    }
    onGround(){
        return this.y  >= this.game.height - this.height - this.game.groundMargin ;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy =>{
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height >this.y
            ){
                //碰撞成功
                enemy.markedForDeletion = true;
                this.game.gameOver = true;
                this.game.score++;
            } else {
                //碰撞失敗

            }
        });
    }
}