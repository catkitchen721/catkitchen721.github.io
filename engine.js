var canvas = document.getElementById('myCanvas');
var debugScreen = document.getElementById('debug');
var debugToggleButton = document.getElementById('debugToggleButton');
var muteButton = document.getElementById('muteButton');
var bgm = document.getElementById('bgm');
var typo = document.getElementById('typo');
var music1 = document.getElementById('music1');
var code1 = document.getElementById('code1').innerHTML;

var ctx = canvas.getContext('2d');

var debugPoint = false;

var isMute = false;
var isDebug = false;
var isBGMPlaying = false;
var isMusicPlaying = false;
var notes = [];
var types = ['0', 'a', 'b', 'c', 'd'];
var isGameStart = false;
var isHolding = false;
var isGreat = false;
var isGood = false;

var songCodeRaw = "";
var songCode = [];

var centerBg_width = 100;
var centerBg_position = {x:canvas.width/2 - centerBg_width/2, y:canvas.height/2 - centerBg_width/2};
var noteTimer = null;
var musicBPM = 256;
var musicBPMInterval = 60000/musicBPM;
var maxNoteNum = 10;
var currentNoteIndex = 0;
var currentNoteStart = 0;
var noteSpeedInver = 200;
var noteDx = (centerBg_position.x) / noteSpeedInver;
var noteDy = (centerBg_position.y) / noteSpeedInver;
var initNoteX = -noteDx * 5;
var initNoteY = -noteDy * 5;
var noteOverDist = 200;
var distGreatArea = 20;
var distGoodArea = 50;
var hitShowTime = 15;  /* unit: ms / 10 */
var currentHitShowTime = 0;
var songCodeIndex = 0;
var currScore = 0;

var picFolder = "pic/";
var gameBg = new Image();
gameBg.src = picFolder + "gameBg.jpg";
var centerBg = new Image();
centerBg.src = picFolder + "centerBg.png";
var note0 = new Image();
note0.src = picFolder + "note0.png";
var great = new Image();
great.src = picFolder + "great.png";
var good = new Image();
good.src = picFolder + "good.png";

for(let i=0; i<maxNoteNum; i++)
{
	notes[i] = {x:initNoteX, y:initNoteY, status:false, type:'0'};
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyUpHandler(e)
{
	isHolding = false;
}

function keyDownHandler(e)
{
	if(!isHolding)
	{
		isHolding = true;
		if(isGameStart)
		{
			if(e.keyCode != 32)
				typo.play();
			else
				typo2.play();
			if(e.keyCode == 32)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == '0')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 65)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'a')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 83)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 's')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 68)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'd')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 70)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'f')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 71)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'g')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 72)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'h')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 74)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'j')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 75)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'k')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
			else if(e.keyCode == 76)
			{
				for(let i=0; i<maxNoteNum; i++)
				{
					if(notes[i].status == true)
					{
						if(notes[i].type == 'l')
						{
							if(isGreatArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGreat = true;
								currScore += 600;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
							else if(isGoodArea(notes[i].x, notes[i].y))
							{
								notes[i].status = false;
								isGood = true;
								currScore += 300;
								document.getElementById('score').innerHTML = currScore;
								break;
							}
						}
					}
				}
			}
		}
	}
}

function drawBg()
{
	ctx.drawImage(gameBg, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(centerBg, centerBg_position.x, centerBg_position.y, centerBg_width, centerBg_width);
}

function drawNote()
{
	for(let i=currentNoteStart; i<maxNoteNum; i++)
	{
		if(notes[i].status == true)
		{
			if(notes[i].type != " ")
			{
				note0.src = picFolder + "note" + notes[i].type + ".png";
				ctx.drawImage(note0, notes[i].x, notes[i].y, centerBg_width, centerBg_width);
			}
			notes[i].x += noteDx;
			notes[i].y += noteDy;
			if(notes[i].x > centerBg_position.x + noteDx * noteOverDist && notes[i].y > centerBg_position.y + noteDy * noteOverDist)
			{
				notes[i].status = false;
			}
		}
	}
	for(let i=0; i<currentNoteStart; i++)
	{
		if(notes[i].status == true)
		{
			if(notes[i].type != " ")
			{
				note0.src = picFolder + "note" + notes[i].type + ".png";
				ctx.drawImage(note0, notes[i].x, notes[i].y, centerBg_width, centerBg_width);
			}
			notes[i].x += noteDx;
			notes[i].y += noteDy;
			if(notes[i].x > centerBg_position.x + noteDx * noteOverDist && notes[i].y > centerBg_position.y + noteDy * noteOverDist)
			{
				notes[i].status = false;
			}
		}
	}
}

function drawHit(type)
{
	if(type == 0)
	{
		ctx.drawImage(great, canvas.width/2 - canvas.width/12, canvas.height/2 - canvas.height/6 - canvas.height/10, canvas.width/6, canvas.height/6);
	}
	else if(type == 1)
	{
		ctx.drawImage(good, canvas.width/2 - canvas.width/12, canvas.height/2 - canvas.height/6 - canvas.height/10, canvas.width/6, canvas.height/6);
	}
	else
	{
		
	}
}

function draw()
{
	drawBg();
	drawNote();
	if(isGameStart)
	{
		drawNote();
	}
	if(isGreat)
	{
		if(currentHitShowTime <= hitShowTime)
		{
			drawHit(0);
			currentHitShowTime += 1;
		}
		else
		{
			isGreat = false;
			currentHitShowTime = 0;
		}
	}
	if(isGood)
	{
		if(currentHitShowTime <= hitShowTime)
		{
			drawHit(1);
			currentHitShowTime += 1;
		}
		else
		{
			isGood = false;
			currentHitShowTime = 0;
		}
	}
	debugScreen.innerHTML = 
	"<h3>0: " + notes[0].x + ", " + notes[0].y + " " + notes[0].status + " " + notes[0].type + "</h3>" +
	"<h3>1: " + notes[1].x + ", " + notes[1].y + " " + notes[1].status + " " + notes[1].type + "</h3>" +
	"<h3>2: " + notes[2].x + ", " + notes[2].y + " " + notes[2].status + " " + notes[2].type + "</h3>" +
	"<h3>" + debugPoint + "</h3>" + 
	"<h3>" + currentHitShowTime + "</h3>" + 
	"<h3>" + songCodeRaw + "</h3>" +
	"<h3>" + isGameStart + "</h3>";
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
		debugScreen.style = "border:3px solid #504040; padding:3px; margin:auto; width:30%; text-align:center; background-color:white";
		isDebug = true;
		debugToggleButton.innerHTML = "Debug Off";
	}
}

function muteToggle()
{
	if(isMute)
	{
		music1.muted = false;
		isMute = false;
		muteButton.innerHTML = "靜音";
	}
	else
	{
		music1.muted = true;
		isMute = true;
		muteButton.innerHTML = "開啟音效";
	}
}

function chooseSong()
{
	if(!isMusicPlaying)
	{
		music1.play();
		isMusicPlaying = true;
	}
	isGameStart = true;
	songCodeRaw = code1;
	songCode = code1.split("");
	noteTimer = setInterval(createNote, musicBPMInterval);
}

function createNote()
{
	if(currentNoteIndex >= maxNoteNum)
	{
		currentNoteIndex = 0;
		currentNoteStart = 0;
	}
	if(notes[currentNoteIndex].x != 0 || notes[currentNoteIndex].y != 0)
	{
		currentNoteStart += 1;
		if(currentNoteStart >= maxNoteNum)
		{
			currentNoteStart = 0;
		}
	}
	notes[currentNoteIndex].type = songCode[songCodeIndex];
	songCodeIndex++;
	notes[currentNoteIndex].status = true;
	notes[currentNoteIndex].x = initNoteX;
	notes[currentNoteIndex].y = initNoteY;
	currentNoteIndex++;
	if(songCodeIndex == songCode.length)
	{
		clearInterval(noteTimer);
	}
}

function isGreatArea(x, y)
{
	if(x > centerBg_position.x - distGreatArea && x < centerBg_position.x + distGreatArea)
	{
		if(y > centerBg_position.y - distGreatArea && y < centerBg_position.y + distGreatArea)
		{
			return true;
		}
	}
	else return false;
}

function isGoodArea(x, y)
{
	if(isGreatArea(x, y)) return false;
	if(x > centerBg_position.x - distGoodArea && x < centerBg_position.x + distGoodArea)
	{
		if(y > centerBg_position.y - distGoodArea && y < centerBg_position.y + distGoodArea)
		{
			return true;
		}
	}
	else return false;
}

var timer = setInterval(draw, 10);