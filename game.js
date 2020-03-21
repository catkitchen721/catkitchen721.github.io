var canvas = document.getElementById('myCanvas');
var debugScreen = document.getElementById('debug');
var debugToggleButton = document.getElementById('debugToggleButton');
var muteButton = document.getElementById('muteButton');
var gravityButton = document.getElementById('gravityButton');
var bgm = document.getElementById('bgm');
var ballm = document.getElementById('ballm');
var goodm = document.getElementById('goodm');
var badm = document.getElementById('badm');
var afterWinButton = document.getElementById('afterWinButton');
	
var ctx = canvas.getContext('2d');

var speed = 2;
const hpMax = 20;
var gravity = 0.001;
const paddleFriction = 0.5;
const treasureSize = 50;

var dx = 0 * Math.sqrt(speed);
var dy = 2 * Math.sqrt(speed);

var ballRadius = 10;
var red = 0;
var green = 149;
var blue = 221;
var ballColor = "rgb(" + red + ", " + green + ", " + blue + ")";

var paddleHeight = 10 ;
var paddleWidth = 150;/*150*/
var paddleX = (canvas.width-paddleWidth)/2;
var checkHitOffset = 15 + 5 * (speed - 1);  //easy -> more, hard -> less.
var brickCheckHitOffset = 2;
var verticalCheckHitOffset = 15;

var x = paddleX + (paddleWidth/2);
var y = canvas.height - paddleHeight - ballRadius;

var treasureX = 0;
var treasureY = 0;

//var fasterTimes = 0;

var brickRowCount = 16;
var brickColumnCount = 5;
var brickWidth = 40;
var brickHeight = 10;
var brickPadding = 0.1;
var brickOffsetTop = 350;
var brickOffsetLeft = 205;
var brickFillColor = "#D2691E";
var brickStrokeColor = "#8B4513";

var bricks = [];
for(let c=0; c<brickColumnCount; c++)
{
	bricks[c] = [];
	for(let r=0; r<11; r++)
	{
		bricks[c][r] = {x:0, y:0, status:1};
	}
	for(let r=11; r<12; r++)
	{
		bricks[c][r] = {x:0, y:0, status:1};
	}
	for(let r=12; r<brickRowCount; r++)
	{
		bricks[c][r] = {x:0, y:0, status:1};
	}
}
var brickRegion = {x:0, y:0, width:1, height:1};

var rightPressed = false;
var leftPressed = false;
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keydown", keyDownHandler);

var isDebug = false;
var isAfterGameOver = true;
var isBGMPlaying = false;
var isMute = false;
var isGravity = false;
var isInitialBricksMoreThanThisTimes = 0;
var isWin = false;
var isChoosingDrct = false;
var isDrawTreasure = false;
//var drct = -1;
var hp = hpMax;
document.getElementById('hp').innerHTML = hp;

var img = new Image();
img.src = "bg.jpg";

var speedDownTreasure = new Image();
speedDownTreasure.src = "sd.png";

var healthUpTreasure = new Image();
healthUpTreasure.src = "hu.png";

var treasureType = 0;

var v1 = new MumiVector(dx, dy, x, y);
var v2 = new MumiVector(dx, dy, x, y);
var vi = new MumiVector(dx, dy, x, y);

function keyUpHandler(e)
{
	if(e.keyCode == 39)
	{
		rightPressed = false;
	}
	else if(e.keyCode == 37)
	{
		leftPressed = false;
	}
	else if(e.keyCode == 90)
	{
		if(isAfterGameOver)
		{
			isChoosingDrct = false;
			isAfterGameOver = false;
		}
	}
}

function keyDownHandler(e)
{
	if(e.keyCode == 39)
	{
		rightPressed = true;
	}
	else if(e.keyCode == 37)
	{
		leftPressed = true;
	}
	else if(e.keyCode == 90)
	{
		if(isAfterGameOver && !isWin)
		{
			if(!isBGMPlaying)
			{
				bgm.play();
				isBGMPlaying = true;
			}
			isChoosingDrct = true;
			drct = Math.floor(Math.random() * 6);
			switch(drct)
			{
				case 0:
					dx = 2 * Math.sqrt(speed);
					dy = -2 * Math.sqrt(speed);
					drct = -1;
					break;
				case 1:
					dx = -Math.sqrt(2) * Math.sqrt(speed);
					dy = -Math.sqrt(6) * Math.sqrt(speed);
					drct = -1;
					break;
				case 2:
					dx = -Math.sqrt(6) * Math.sqrt(speed);
					dy = -Math.sqrt(2) * Math.sqrt(speed);
					drct = -1;
					break;
				case 3:
					dx = Math.sqrt(6) * Math.sqrt(speed);
					dy = -Math.sqrt(2) * Math.sqrt(speed);
					drct = -1;
					break;
				case 4:
					dx = Math.sqrt(2) * Math.sqrt(speed);
					dy = -Math.sqrt(6) * Math.sqrt(speed);
					drct = -1;
					break;
				case 5:
					dx = 2 * Math.sqrt(speed);
					dy = -2 * Math.sqrt(speed);
					drct = -1;
					break;
				default:
					break;
			}
		}
	}
}

function draw()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ballColor = "rgb(" + red + ", " + green + ", " + blue + ")";
	drawImg();
	drawBricks();
	drawBall(ballColor);
	drawPaddle();
	if(isDrawTreasure)
	{
		drawTreasure(treasureX, treasureY, treasureType);
	}
	collisionDetection();
	
	if(x + dx < ballRadius || x + dx > canvas.width - ballRadius)
	{
		dx = -dx;
	}
	if(y + dy < ballRadius) 
	{
		dy = -dy;
	} 
	else if(y + dy > canvas.height-ballRadius-paddleHeight + verticalCheckHitOffset) 
	{
		if(!isAfterGameOver)
		{
			if(x > paddleX - checkHitOffset && x < paddleX + paddleWidth + checkHitOffset) 
			{
				ballm.currentTime = 0;
				ballm.play();
				if((rightPressed && dx >= 0) || (leftPressed && dx < 0))
				{
					if(dx >= 0)
					{
						dx += paddleFriction;
					}
					else
					{
						dx -= paddleFriction;
					}
				}
				else if((rightPressed && dx < 0) || (leftPressed && dx >= 0))
				{
					if(dx >= 0)
					{
						dx -= paddleFriction;
					}
					else
					{
						dx += paddleFriction;
					}
				}
				dy = -dy;
				/*dx *= 1.05;
				dy *= 1.05;
				fasterTimes += 1;*/
			}
			else
			{
				gameOver();
				/*for(var i=0; i<fasterTimes; i++)
				{
					dx /= 1.05;
					dy /= 1.05;
				}
				fasterTimes = 0;*/
			}
		}
	}
	if(rightPressed && paddleX < canvas.width-paddleWidth)
	{
		paddleX += (5 + 1.1 * (speed - 1));
	}
	else if(leftPressed && paddleX > 0)
	{
		paddleX -= (5 + 1.1 * (speed - 1));
	}
	
	if(!isAfterGameOver)
	{
		dy += gravity;
		x += dx;
		y += dy;
	}
	else
	{
		x = paddleX + (paddleWidth/2);
		if(isChoosingDrct)
		{
			//choose <- change here
			
		}
		if(isWin)
		{
			drawWinPic();
			afterWinButton.style = "display:inline;width:120px;height:40px;font-size:20px;";
		}
	}
	
	if(isDrawTreasure)
	{
		treasureY += 1;
		if(treasureY > canvas.height - treasureSize)
		{
			if(treasureX + (treasureSize/2) > paddleX - checkHitOffset && treasureX + (treasureSize/2) < paddleX + paddleWidth + checkHitOffset)
			{
				doTreasureFunc();
			}
			isDrawTreasure = false;
		}
	}
	
	v1.setValue(dx, 0, x, y);
	v2.setValue(0, dy, x, y);
	v1.std(ballRadius+(ballRadius/5), ballRadius+(ballRadius/5));
	v2.std(ballRadius+(ballRadius/5), ballRadius+(ballRadius/5));
	if(isDebug)
	{
		v1.drawVector();
		v2.drawVector();
	}
	
	debugScreen.innerHTML = /*fasterTimes + ", */"(" + isInitialBricksMoreThanThisTimes + ")"
	+ "<h3>vxd: " + v1.vxd + " vyd: " + v1.vyd + " vx: " + v1.vx + " vy: " + v1.vy
	+ " vlength: " + v1.vlength + "</h3><h3>vxd: " + v2.vxd + " vyd: " + v2.vyd + " vx: " + v2.vx + " vy: " + v2.vy
	+ " vlength: " + v2.vlength + "</h3><h3>treasure: " + isDrawTreasure + "</h3>";
	
}

function drawImg()
{
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function drawBall(color)
{
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.strokeStyle = "#000000";
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawPaddle() 
{
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
	ctx.strokeStyle = "#000000";
    ctx.fill();
	ctx.stroke();
    ctx.closePath();
}

function drawBricks()
{
	for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1)
			{
				var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = brickFillColor;
				ctx.fill();
				ctx.closePath();
				
				ctx.beginPath();
				ctx.lineWidth = 3.0;
				ctx.strokeStyle = brickStrokeColor;
				ctx.moveTo(brickX, brickY+brickHeight);
				ctx.lineTo(brickX+brickWidth, brickY+brickHeight);
				ctx.stroke();
				ctx.closePath();
				
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.strokeStyle = brickStrokeColor;
				ctx.moveTo(brickX+brickWidth, brickY);
				ctx.lineTo(brickX+brickWidth, brickY+brickHeight);
				ctx.stroke();
				ctx.closePath();
			}
        }
    }
}

function drawTreasure(treasureX, treasureY, type) {
	if(type == 0)
	{
		ctx.drawImage(speedDownTreasure, treasureX, treasureY, treasureSize, treasureSize);
	}
	else if(type == 1)
	{
		ctx.drawImage(healthUpTreasure, treasureX, treasureY, treasureSize, treasureSize);
	}
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1)
			{
				//Has defined "brickRegion": {x, y, width, height}, this is for collide checking function.
				
				brickRegion.x = b.x;
				brickRegion.y = b.y;
				brickRegion.width = brickWidth;
				brickRegion.height = brickHeight;
				
				//collide
				
				if(v1.isOverlap(brickRegion))
				{
					if(treasurePropResult(90, 100)) //90% will drop treasure
					{
						treasureX = b.x + (brickWidth / 2);
						treasureY = b.y;
						treasureType = getRandomNum(2);
						isDrawTreasure = true;
					}
					b.status = 0;
					ballm.currentTime = 0;
					ballm.play();
					dx = -dx;
					v1.setValue(dx, 0, x, y);
					v1.std(ballRadius+(ballRadius/5), ballRadius+(ballRadius/5));
				}
				if(v2.isOverlap(brickRegion))
				{
					if(treasurePropResult(90, 100)) //90% will drop treasure
					{
						treasureX = b.x + (brickWidth / 2);
						treasureY = b.y;
						treasureType = getRandomNum(2);
						isDrawTreasure = true;
					}
					b.status = 0;
					ballm.currentTime = 0;
					ballm.play();
					dy = -dy;
					v2.setValue(0, dy, x, y);
					v2.std(ballRadius+(ballRadius/5), ballRadius+(ballRadius/5));
				}
				
				//winCheck
				winCheck();
			}
        }
    }
}

function debugToggle()
{
	if(isDebug)
	{
		debugScreen.style = "display:none; border:3px solid #504040; padding:3px; margin:auto; width:30%; text-align:center;";
		isDebug = false;
		debugToggleButton.innerHTML = "Debug On";
	}
	else
	{
		debugScreen.style = "border:3px solid #504040; padding:3px; margin:auto; width:30%; text-align:center;";
		isDebug = true;
		debugToggleButton.innerHTML = "Debug Off";
	}
}

function muteToggle()
{
	if(isMute)
	{
		bgm.muted = false;
		isMute = false;
		muteButton.innerHTML = "Mute";
	}
	else
	{
		bgm.muted = true;
		isMute = true;
		muteButton.innerHTML = "Mute Off";
	}
}

function gravityToggle()
{
	if(isGravity)
	{
		gravity = 0.001;
		isGravity = false;
		gravityButton.innerHTML = "To Gravity On";
	}
	else
	{
		gravity = 0.1;
		isGravity = true;
		gravityButton.innerHTML = "To Gravity Off";
	}
}

function gameOver()
{
	hp -= 1;
	if(hp <= 0)
	{
		badm.currentTime = 0;
		badm.play();
		bgm.currentTime = 0;
		bgm.pause();
		isBGMPlaying = false;
		rightPressed = false;
		leftPressed = false;
		alert('Game Over!');
	}
	document.getElementById('hp').innerHTML = hp;
	y = canvas.height - paddleHeight - ballRadius;
	x = paddleX + (paddleWidth/2);
	if(hp <= 0)
	{
		initBricks();
		hp = hpMax;
		document.getElementById('hp').innerHTML = hp;
	}
	isAfterGameOver = true;
}

function winCheck()
{
	for(let c=0; c<brickColumnCount; c++)
	{
		for(let r=0; r<brickRowCount; r++)
		{
			if(bricks[c][r].status == 1)
			{
				return;
			}
		}
	}
	//music processing
	goodm.currentTime = 0;
	goodm.play();
	bgm.currentTime = 0;
	bgm.pause();
	isBGMPlaying = false;
	//alert and win processing
	rightPressed = false;
	leftPressed = false;
	hp = hpMax;
	document.getElementById('hp').innerHTML = hpMax;
	y = canvas.height - paddleHeight - ballRadius;
	x = paddleX + (paddleWidth/2);
	alert('You Win!');
	isWin = true;
	isAfterGameOver = true;
}

function initBricks()
{
	if(x == paddleX + (paddleWidth/2) && y == canvas.height - paddleHeight - ballRadius)
	{
		for(let c=0; c<brickColumnCount; c++)
		{
			for(let r=0; r<brickRowCount; r++)
			{
				bricks[c][r].status = 1;
			}
		}
		return;
	}
	else 
	{
		if(isInitialBricksMoreThanThisTimes > 100)
		{
			//isInitialBricksMoreThanThisTimes = 0;
			alert('Something Error.');
			return;
		}
		isInitialBricksMoreThanThisTimes++;
		initBricks();
	}
}

function pictureIsLookedToggle()
{
	initBricksAndWinFalse();
	afterWinButton.style = "display:none";
}

function initBricksAndWinFalse()
{
	img.src = "bg.jpg";
	initBricks();
	isWin = false;
}

function MumiVector(vxd, vyd, centerX, centerY)
{
	this.vxd = vxd;
	this.vyd = vyd;
	this.centerX = centerX;
	this.centerY = centerY;
	this.vx = centerX + vxd;
	this.vy = centerY + vyd;
	this.vlength = Math.sqrt((vxd*vxd) + (vyd*vyd));
	this.setValue = function(vxd, vyd, centerX, centerY)
	{
		this.vxd = vxd;
		this.vyd = vyd;
		this.centerX = centerX;
		this.centerY = centerY;
		this.vx = centerX + vxd;
		this.vy = centerY + vyd;
		this.vlength = Math.sqrt((vxd*vxd) + (vyd*vyd));
	}
	this.std = function(xLen, yLen)
	{
		this.vxd = this.vxd / this.vlength;
		this.vyd = this.vyd / this.vlength;
		this.vxd *= xLen;
		this.vyd *= yLen;
		this.setValue(this.vxd, this.vyd, this.centerX, this.centerY);
	}
	this.drawVector = function()
	{
		ctx.beginPath();
		ctx.lineWidth = 1.0;
		ctx.strokeStyle = "#880000";
		ctx.moveTo(this.centerX, this.centerY);
		ctx.lineTo(this.vx, this.vy);
		ctx.stroke();
		ctx.closePath();
	}
	this.isOverlap = function(region)
	{
		if(this.vx > region.x && this.vx < region.x + region.width)
		{
			if(this.vy > region.y && this.vy < region.y + region.height)
			{
				return true;
			}
		}
		return false;
	}
	this.setPolar = function(len, angleRadian)
	{
		this.vxd = len * Math.cos(angleRadian);
		this.vyd = len * Math.sin(angleRadian);
	}
}

function getRandomNum(x){
    return Math.floor(Math.random() * x);
}

function treasurePropResult(prop, totalProp) { // probability of (prop/totalProp)
	if(getRandomNum(totalProp) < prop)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function doTreasureFunc() {
	if(treasureType == 0)
	{
		// speed down
	}
	else if(treasureType == 1)
	{
		hp += 1;
		document.getElementById('hp').innerHTML = hp;
	}
}

function drawWinPic()
{
	img.src = "bgWin.jpg";
}

var timer = setInterval(draw, 10);