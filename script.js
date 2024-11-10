//defining html element
const board =document.querySelector('#game-board')
const instructionText=document.querySelector('#instructions')
const logo=document.querySelector('#logo')
const score=document.querySelector('#scores')
const highScoreText=document.querySelector('#highScore')
const audio=document.querySelector('.bgm')
const audio2=document.querySelector('.bgm2')

//grid size constant
const gridSize=20;
//Defining game variables
let snake=[{x:10,y:10}];
//rangom positioning of food
let food=generateFood();
//direction of moving
let direction= 'right';
//definig game interval
let gameInterval;
let gameSpeedDelay=200
let GameStarted=false
let highScore=0
//drawing game map,snake,food
function draw(){
    //whernever this is called, the board gets reset
    board.innerHTML=''
    drawSnake();
    drawFood();
    updateScore();
}

//Drawing snake
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    });
}

//ceating a snake or a food cube
function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className;
    return element;
}
//setting the position of snake or food
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

//draw food funciton
function drawFood(){
    if(GameStarted){
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

//Gnerating food at random positions
function generateFood(){
    const x=Math.floor(Math.random() * gridSize) + 1;
    const y=Math.floor(Math.random() * gridSize) + 1;
    return { x , y };
}

function move(){
    const head = {...snake[0]} //head of the snake
    switch(direction){ //this piece of code moves the head of the snake
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){
        food=generateFood();
        clearInterval(gameInterval);//to clear past interval
        increaseSpeed();
        gameInterval=setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay)
    }
    else{
        snake.pop();
    }

}


//start game function
function startGame(){
    audio.play();
    GameStarted=true;//to keep track of a running game
    instructionText.style.display='none'
    logo.style.display='none'
    gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay)
}

// key press listener
function handleKeyPress(event){
    if( (!GameStarted && event.code==='Space')||(!GameStarted && event.key===' ')){
        startGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                if(direction!='down')
                direction='up';
                break;
            case 'ArrowDown':
                if(direction!='up')
                direction='down';
                break;
            case 'ArrowRight':
                if(direction!='left')
                direction='right';
                break;
            case 'ArrowLeft':
                if(direction!='right')
                direction='left';
                break;
            
        }
    }
}
document.addEventListener('keydown',handleKeyPress);
function increaseSpeed(){
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkCollision(){
    const head=snake[0];
    if(head.x<1 || head.x>gridSize || head.y<1 ||head.y>gridSize)
    {
        resetGame();
    }
    for(let i =1;i<snake.length;i++){
        if(head.x===snake[i].x && head.y===snake[i].y){
            resetGame();
        }

    }
}
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10,y:10}];
    food=generateFood();
    direction='right'
    gameSpeedDelay=200;
    updateScore();
}
function updateScore(){
    const currentScore=snake.length-1;
    score.textContent=currentScore.toString().padStart(3,'0');
}
function stopGame(){
    audio.pause();
    audio2.play();
    clearInterval(gameInterval);
    GameStarted=false;
    instructionText.style.display='block';
    logo.style.display='block';
}
function updateHighScore()
{
    const currentScore=snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
        highScoreText.style.display='block';
    }
}