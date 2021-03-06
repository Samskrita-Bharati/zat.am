// Game constants
var musicelements;
var MOVE_INC = 25,
yourturns=0,
    INIT_BOARD_POS = 0,
    MANUAL_PLAYER = 1,
    AUTO_PLAYER = 0,
    BOARD_SIZE = 900,
    SQUARE_SIZE = 90,
    COIN_SIZE = 80,
    SHADOW_OFFSET = 3,
    COLS = 10,
    ROWS = 10,
    START_X = 0,
    START_Y = 810,
    SND_MOVE = 0,
    SND_DICE = 1,
    SND_HAPPY = 2,
    SND_SAD = 3,
    SND_END = 4,
    SND_WLCM = 5,
    NUM_START_POINTS = 2;
    EVNT_AUDIO_DWNLD_COMP = 'loadeddata',
    EVNT_AUDIO_ENDED = 'ended',
    STYLE_HIDDEN = 'hidden',
//    BOARD_COLORS = ['red', 'orange', 'yellow','green','blue','indigo', 'violet'],
    BOARD_COLORS = ['white', 'white', 'white','white','white','white', 'white'],
//    BOARD_TCOLORS = ['white','black', 'black', 'black', 'white', 'white', 'black'];
    BOARD_TCOLORS = ['red', 'orange', 'yellow','green','blue','indigo', 'violet'],
    SANKHYA = ['०','१','२','३','४','५','६','७','८','९','१०','११','१२','१३','१४','१५','१६','१७','१८','१९','२०','२१','२२','२३','२४','२५','२६','२७','२८','२९','३०','३१','३२','३३','३४','३५','३६','३७','३८','३९','४०','४१','४२','४३','४४','४५','४६','४७','४८','४९','५०','५१','५२','५३','५४','५५','५६','५७','५८','५९','६०','६१','६२','६३','६४','६५','६६','६७','६८','६९','७०','७१','७२','७३','७४','७५','७६','७७','७८','७९','८०','८१','८२','८३','८४','८५','८६','८७','८८','८९','९०','९१','९२','९३','९४','९५','९६','९७','९८','९९','१००','','','','','','','','','',''];
//    SANKHYA_HIN = ['०','ek','do','teen','char','paanch','६','७','८','९','१०','११','१२','१३','१४','१५','१६','१७','१८','१९','२०','२१','२२','२३','२४','२५','२६','२७','२८','२९','३०','३१','३२','३३','३४','३५','३६','३७','३८','३९','४०','४१','४२','४३','४४','४५','४६','४७','४८','४९','५०','५१','५२','५३','५४','५५','५६','५७','५८','५९','६०','६१','६२','६३','६४','६५','६६','६७','६८','६९','७०','७१','७२','७३','७४','७५','७६','७७','७८','७९','८०','८१','८२','८३','८४','८५','८६','८७','८८','८९','९०','९१','९२','९३','९४','९५','९६','९७','९८','९९','१००','','','','','','','','','',''];
    SANKHYA_HIN = ['shoonya' , 'ek' , 'do' , 'teen' , 'chaar' , 'paanch' , 'chhuh' , 'saat' , 'aath' , 'nau' , 'dus' , 'gyaaruh' , 'baaruh' , 'tayruh' , 'chauduh' , 'pundrah' , 'soluh' , 'sattruh' , 'utthaaruh' , 'unnees' , 'bees' , 'ikkees' , 'baaees' , 'tayees' , 'chaubees' , 'pucchees' , 'chhubbees' , 'suttaaees' , 'utthaaees' , 'unatees' , 'tees' , 'ikattees' , 'buttees' , 'tayntees' , 'chauntees' , 'payntees' , 'chhuttees' , 'sayntees' , 'urdtees' , 'unataalees' , 'chaalees' , 'ikataalees' , 'buyaalees' , 'tayntaalees' , 'chauwaalees' , 'payntaalees' , 'chhiyaatees' , 'sayntaalees' , 'urdtaalees' , 'unachaas' , 'puchaass' , 'ikyaawaun' , 'baawun' , 'tirpun' , 'chauwun' , 'puchpun' , 'chhuppun' , 'suttaawun' , 'utthhaawun' , 'unasuth' , 'saath' , 'ikasuth' , 'baasuth' , 'tirsuth' , 'chaunsuth' , 'paynsuth' , 'chhiyaasuth' , 'sursuth' , 'urdsuth' , 'unahuttur' , 'suttur' , 'ikahuttur' , 'buhuttur' , 'tihuttur' , 'chahuttur' , 'puchahuttur' , 'chhihuttur' , 'sutahuttur' , 'uthahuttur' , 'unyaasee' , 'ussee', 'ikyaasee' , 'buyaasee' , 'tiraasee' , 'chauraasee' , 'puchaasee' , 'chhiyaasee' , 'suttaasee' , 'utthaasee' , 'nuwaasee' , 'nubbay' , 'ikyaanaway' , 'baanaway' , 'tiraanaway' , 'chauraanaway' , 'puchaanaway' , 'chhiyaanaway' , 'suttaanaway' , 'utthhaanaway' , 'ninyaanaway' , 'sau' ];
//    SANKHYA_SAN = ['०','ekam','dvi','trini','chatvari','५','६','७','८','९','१०','११','१२','१३','१४','१५','१६','१७','१८','१९','२०','२१','२२','२३','२४','२५','२६','२७','२८','२९','३०','३१','३२','३३','३४','३५','३६','३७','३८','३९','४०','४१','४२','४३','४४','४५','४६','४७','४८','४९','५०','५१','५२','५३','५४','५५','५६','५७','५८','५९','६०','६१','६२','६३','६४','६५','६६','६७','६८','६९','७०','७१','७२','७३','७४','७५','७६','७७','७८','७९','८०','८१','८२','८३','८४','८५','८६','८७','८८','८९','९०','९१','९२','९३','९४','९५','९६','९७','९८','९९','१००','','','','','','','','','',''];
SANKHYA_SAN = ['shoonya' , 'ekaM' , 'dvi' , 'triiNi' , 'chatvaari' , 'paJNcha' , 'shhaD.h' , 'sapta' , 'ashhTa' , 'nava' , 'dasha' , 'ekaadasha' , 'dvaadasha' , 'trayodasha' , 'chaturdasha' , 'paJNchadasha' , 'shhoDasha' , 'saptadasha' , 'ashhTaadasha' , 'navadasha' , 'vi.nshati' , 'ekavi.nshati' , 'dvaavi.nshati' , 'trayovi.nshati' , 'chaturvi.nshati' , 'paJNchavi.nshati' , 'shhaD.hvi.nshati' , 'saptavi.nshati' , 'ashhTaavi.nshati' , 'navavi.nshati' , 'tri.nshat.h' , 'ekatri.nshat.h' , 'dvaatri.nshat.h' , 'tryastri.nshat.h' , 'chatustri.nshat.h' , 'paJNchatri.nshat.h' , 'shhaD.htri.nshat.h' , 'saptatri.nshat.h' , 'ashhTaatri.nshat.h' , 'navatri.nshat.h' , 'chatvaari.nshat.h' , 'ekachatvaari.nshat.h' , 'dvichatvaari.nshat.h' , 'trichatvaari.nshat.h' , 'chatushchatvaari.nshat.h' , 'paJNchachatvaari.nshat.h' , 'shhaT.hchatvaari.nshat.h' , 'saptachatvaari.nshat.h' , 'ashhTachatvaari.nshat.h' , 'navachatvaari.nshat.h' , 'paJNchaashat.h' , 'ekapaJNchaashat.h' , 'dvipaJNchaashat.h' , 'tripaJNchaashat.h' , 'chatuHpaJNchaashat.h' , 'paJNchapaJNchaashat.h' , 'shhaD.hpaJNchaashat.h' , 'saptapaJNchaashat.h' , 'ashhTapaJNchaashat.h' , 'navapaJNchaashat.h' , 'shhashhTi' , 'ekashhashhTi' , 'dvishhashhTi' , 'trishhashhTi' , 'chatuHshhashhTi' , 'paJNchashhashhTi' , 'shhaD.hshhashhTi' , 'saptashhashhTi' , 'ashhTashhashhTi' , 'navashhashhTi' , 'saptati' , 'ekasaptati' , 'dvisaptati' , 'tryaHsaptati' , 'chatuHsaptati' , 'paJNchasaptati' , 'shhaD.hsaptati' , 'saptasaptati' , 'ashhTasaptati' , 'navasaptati' , 'ashiiti' , 'ekaashiiti' , 'dvyashiiti' , 'tryashiiti' , 'chaturashiiti' , 'paJNchaashiiti' , 'shhaD.hashiiti' ,'saptaashiiti' , 'ashhTaashiiti' , 'navaashiiti' , 'navati' , 'ekanavati' , 'dvinavati' , 'trinavati' , 'chaturnavati' , 'paJNchanavati' , 'shhaD.hnavati' , 'saptanavati' , 'ashhTanavati' , 'navanavati' , 'shatam.h'];
    
function dialogCallBack(index) {return;};
/*
 * GameEng core object
 * @name GameEng
 */
var GameEng = {
    /*
     * Canvas node
     * @type object DOM Node
     * @name canvas
     */
    canvas: {},
    
    /*
     * Canvas context
     * @type object Context
     * @name ctx
     */
    ctx: {},
    
    /*
     * Player list
     * @type Array 
     * @name players
     */
    players: [],
    
    /*
     * sopan list
     * @type Array 
     * @name sopans
     */
    sopans: [],
    
    /*
     * Snakes list
     * @type Array 
     * @name snakes
     */
    snakes: [],
    
    /*
     * Snake positions
     * @type Array 
     * @name snakePositions
     */
    snakePositions: [],

    /*
     * sopan positions
     * @type Array 
     * @name sopanPositions
     */
    sopanPositions: [],
    
    /*
     * Players' list
     * @type Array 
     * @name players
     */
    players: [],
    
    /*
     * Current Player
     * @type GameProps 
     * @name currentPlayer
     */
    currentPlayer: {},
    
    /*
     * Current Player index
     * @type {int}
     * @name curPlayerIndex
     */
    curPlayerIndex: 0,
    
    /*
     * Flag for rolling dice
     * @type {boolean}
     * @name canRoll
     */
    canRoll: true,
    
    /*
     * Flag for pausing music
     * @type {boolean}
     * @name contMusic
     */
    contMusic: true,
    
    /*
     * Flag for playing music
     * @type {boolean}
     * @name musicOn
     */
    musicOn: true,
    
    
    /*
     * Start points
     * @type {int}
     * @name startFlag
     */
    startFlag: 0,
    
    /*
     * Audio resource list
     * @type {Array}
     * @name audioResources
     */
    audioResources: [],
    
    /*
     * Currently playing audio
     * @type {Audio} 
     * @name currentAudio
     */
    currentAudio: null,
    
    /*
     * Count to manage loaded resource
     * @type {int}
     * @name loadedResourceCount
     */
    loadedResourceCount: 0,
    
    /*
     * Total resource used
     * @type {int}
     * @name totalResourceCount
     */
    totalResourceCount: 9,
    
    /*
     * Last move index
     * @type {int}
     * @name lastMoveIndex
     */
    lastMoveIndex: 0,
    
    /*
     * Initializes the game engine
     * @param void
     * @name init
     */
    init: function() {
        var canvas,
            dcanvas,
            that = this,
            musicNode,
            startNode;
/*
document.ontouchstart = function(event) {
    event.preventDefault();
}
document.ontouchmove = function(event) {
    event.preventDefault();
}
document.ontouchend = function(event) {
    event.preventDefault();
}
 */
       this.canvas = canvas = document.getElementById("canvas");
        dcanvas = document.getElementById("dcanvas");
		this.setCanvasSize();
		window.onresize = function() { that.setCanvasSize();};
        dcanvas.style.display = 'block';
        if (canvas.getContext) {
            this.showLoading();
//hht		this.startFlag++;
//hht                this.startGame();
            this.ctx = canvas.getContext("2d");
            GameAnimator.ctx = this.ctx;
            GameAnimator.onAnimEnds = function() {
                that.moveEnds();
            };
            this.initMusic();
            this.initBoard();
            //this.happyAudio.play();
            this.initsopans();
            this.initSnakes();
            this.initDice();
            this.initPlayers();
            
            //this.showTurn();
            this.canvas.onclick = function (e) {
                that.showTurnE(e);
            }
            musicNode = document.getElementById('music');
            musicNode.onclick = function() {
                var mStatus = 'Sound On';
                if (false === that.musicOn) {
                    that.musicOn = true;
                    mStatus = 'Sound On';
                } else {
                    that.musicOn = false;
                    mStatus = 'Sound Off';
                    that.stopMusic();
                }
               musicNode.getElementsByTagName('button')[0].innerHTML = mStatus; 
            }
        } else {
            document.write("No support for 2D canvas.");
            document.close();
        }
    },
    
    /*
     * Sets Canvas size
     * @param void
     * @name setCanvasSize
     */
	setCanvasSize: function() {
        var rtCol,
            canvas = this.canvas,
            dcanvas = document.getElementById("dcanvas"),
            winHeight = document.body.clientHeight,
            winWidth = document.body.clientWidth,
            cHeight;
	if (580 <= winHeight) {
            rtCol = document.getElementById("rtColumn");
            rtCol.style.left = winHeight + 5 + 'px';
            cHeight= (winHeight - 17) + 'px';
            canvas.style.width = cHeight;
            canvas.style.height = cHeight;
            dcanvas.style.width = cHeight;
            dcanvas.style.height = cHeight;
        }
	},

    /*
     * Keeps in track loaded game resource
     * @param void
     * @name updateGameResource
     */
    updateGameResource: function() {
        this.loadedResourceCount++;
        if (this.totalResourceCount === this.loadedResourceCount) {
            this.startFlag++;
        }
    },
    
    /*
     * Starts the game.
     * @param void
     * @name startGame
     */
    startGame: function() {
        var curPlayerIndex,
            currentPlayer,
            ctx = this.ctx,
            randPlayer;
        randPlayer = ((Math.floor(Math.random() * 10)) % 2);
        this.currentPlayer = this.players[randPlayer];
        this.curPlayerIndex = randPlayer;
        if (AUTO_PLAYER === randPlayer) {
            this.showCompTurn();
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            //this.rollDice();
        } else {
            this.showTurn();
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
        }
    },
    
    /*
     * Initializes the Dice
     * @param void
     * @name initDice
     */
    initDice: function() {
        var dObj = document.getElementById('dice'),
            that = this;
        dObj.onclick = function() {
		
            that.rollDice();
//alert(yourturns);
        };
    },
    
    /*
     * Initializes the game board
     * @param void
     * @name initBoard
     */
    initBoard: function() {
        var ctx = this.ctx,
//            canvasWidth = canvas.width,
//            canvasHeight = canvas.height,
canvasHeight=document.getElementById('canvas').height,
canvasWidth=document.getElementById('canvas').width,
            squareWidth = canvasWidth/10,
            squareHeight = canvasHeight/10,
            i=0,
            rowCount = 0,
            squareCount = 100,
            squareTxt,
	    incrementY = false,
            y = 0,
            colorIndex = 0;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
shiftX=squareWidth;
        for (x = 0; x <= canvasWidth;) {
if (incrementY) {y=y+90;incrementY=false;}
            colorIndex        = (squareCount+4) % 7;
            ctx.fillStyle     = BOARD_COLORS[colorIndex];
            ctx.fillRect(x + 1, y + 1, squareWidth - 2, squareHeight - 2);
            ctx.fillStyle     = BOARD_TCOLORS[colorIndex];
            ctx.font          = 'bold 17px sans-serif';
	

            ctx.textBaseline  = 'top';
            ctx.fillText(squareCount, x + 65, y + 3);
            ctx.textBaseline  = 'bottom';
           ctx.fillText(SANKHYA[squareCount], x + 23, y+81 );
            if (1 == squareCount) {
                ctx.fillText('Start', x + 20, y + 40);
            }
            if (100 == squareCount) {
                ctx.fillText('Finish', x + 17, y + 40);
            }
squareCount-=1;
x += shiftX;

          if (x >= 900) {
          shiftX=shiftX*-1;
y=y+90;
          x += shiftX;
//squareCount+=1;
            }
   if (x <= 0) {
          shiftX=shiftX*-1;
incrementY = true;
//x=0;   
            colorIndex        = (squareCount+4) % 7;
            ctx.fillStyle     = BOARD_COLORS[colorIndex];
            ctx.fillRect(x + 1, y + 1, squareWidth - 2, squareHeight - 2);
            ctx.fillStyle     = BOARD_TCOLORS[colorIndex];
            ctx.font          = 'bold 17px sans-serif';
	

            ctx.textBaseline  = 'top';
            ctx.fillText(squareCount, x + 65, y + 3);
            ctx.textBaseline  = 'bottom';
           ctx.fillText(SANKHYA[squareCount], x + 23, y+81 );
            if (1 == squareCount) {
                ctx.fillText('Start', x + 20, y + 40);
            }
            if (100 == squareCount) {
                ctx.fillText('Finish', x + 17, y + 40);
            }
squareCount-=1;
         
            }

            i++;
            if (y == canvasHeight)  {
                break;
            }
        }
        ctx.fillStyle     = 'rgba(0, 0, 255, 0.1)';
        ctx.font          = 'bold 100px sans-serif';
        ctx.textBaseline  = 'top';
        ctx.shadowOffsetX = SHADOW_OFFSET;
        ctx.shadowOffsetY = SHADOW_OFFSET;
        ctx.shadowBlur    = 20;
        ctx.shadowColor   = "rgba(0, 0, 255, 0.1)";
        ctx.fillText('सोपान सर्प च', 70, 400);
        
    },
    
    /*
     * Initializes the sopans
     * @param void
     * @name initsopans
     */
    initsopans: function() {
        var ctx = this.ctx,
            that = this,
            sopan1 = new GameProps('res/sopan1.png', 80, 710),
            sopan2 = new GameProps('res/sopan1.png', 80, 325),
            sopan3 = new GameProps('res/sopan1.png', 80, 400),
            sopan4 = new GameProps('res/sopan1.png', 80, 325);
            sopan5 = new GameProps('res/sopan1.png', 80, 115);
        this.sopanPositions.push([39, 64], [16, 54], [68, 85], [5,17]);
        this.sopans.push(sopan1, sopan2, sopan3);            
        sopan1.img.onload = function() {
            ctx.shadowOffsetX = SHADOW_OFFSET;
            ctx.shadowOffsetY = SHADOW_OFFSET;
            ctx.shadowBlur = 20;

            ctx.shadowColor = "black";
            ctx.rotate(0.55);
            that.placeProps(sopan2, 385, 120);
            that.updateGameResource();
            ctx.rotate(-0.05);
            that.placeProps(sopan3, 670, 80);
            that.updateGameResource();
            ctx.rotate(-1.4);
            that.placeProps(sopan4, 120, 400);
            that.updateGameResource();
            ctx.rotate(0.9);
              ctx.rotate(-0.6);
            that.placeProps(sopan5, -195, 830);
            that.updateGameResource();
            ctx.rotate(0.6);

            ctx.restore();
            
        }
    },
    
    /*
     * Initializes the snakes
     * @param void
     * @name initSnakes
     */
    initSnakes: function() {
        var ctx = this.ctx,
            that = this,

            snake2 = new GameProps('res/snake2.png', 200, 405),
            snake3 = new GameProps('res/snake3.png', 94, 309),
            snake4 = new GameProps('res/snake5.png', 283, 380);

        snake2.animationCoordinates = [[73, 295],[60, 361],[46, 483], [60, 631], [175, 550]];
        snake4.animationCoordinates = [[585, 172],[618, 180],[589, 225], [520, 214], [522, 336], [417, 334], [462, 429]];
        snake3.animationCoordinates = [[450, 625],[500, 655],[500, 790], [460, 740]];
        this.snakePositions.push( [60, 23, snake2], [27, 6, snake3], [88, 45, snake4]);
        
        this.snakes.push(snake2, snake3);
        snake2.img.onload = function() {
            ctx.restore();
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "black";
            that.placeProps(snake2, 50, 300);
            that.updateGameResource();
        }

        snake3.img.onload = function() {
            ctx.restore();
            ctx.shadowOffsetX = SHADOW_OFFSET;
            ctx.shadowOffsetY = SHADOW_OFFSET;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "black";
            that.placeProps(snake3, 500, 595);
            that.updateGameResource();
        }
        
        snake4.img.onload = function() {
            ctx.restore();
            ctx.shadowOffsetX = SHADOW_OFFSET;
            ctx.shadowOffsetY = SHADOW_OFFSET;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "black";
            that.placeProps(snake4, 410, 125);
            that.updateGameResource();
        }
    },
    
    /*
     * Initializes the players
     * @param void
     * @name initPlayers
     */
    initPlayers: function() {
        var ctx = this.ctx,
            that = this,
            player1 = new GameProps('res/comp.png', COIN_SIZE, COIN_SIZE),
            player2 = new GameProps('res/u.png', COIN_SIZE, COIN_SIZE);
            
        this.players = [];
        player1.img.onload = function() {
            ctx.shadowOffsetX = SHADOW_OFFSET;
            ctx.shadowOffsetY = SHADOW_OFFSET;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "lightblue";
            player1.type = AUTO_PLAYER;
            player1.boardPosition = INIT_BOARD_POS;
            that.players[0] = player1;
            that.updateGameResource();
        }
        player2.img.onload = function() {
            ctx.shadowOffsetX = SHADOW_OFFSET;
            ctx.shadowOffsetY = SHADOW_OFFSET;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "yellow";
            player2.boardPosition = INIT_BOARD_POS;
            player2.type = MANUAL_PLAYER;
            that.players[1] = player2;
            that.updateGameResource();
        }
    },
    
    /*
     * Initializes the players
     * @param {GameProps} propObj 
     * @param {int} startX - Starting X position
     * @param {int} startY - Starting Y Position
     * @name placeProps
     */
    placeProps: function(propObj, startX, startY) {
        propObj.position = [startX, startY];
        this.ctx.drawImage(propObj.img, startX, startY, propObj.width, propObj.height);
    },
    
    /*
     * Rolls the dice.
     * @param void
     * @name rollDice
     */
    rollDice: function() {
        if (false === this.canRoll || NUM_START_POINTS > this.startFlag) {
            return;
        }
yourturns+=1;
        this.contMusic = true;
        //this.playAudio(this.audioResources[SND_DICE], true);
        this.canRoll = false;
        var dObj = document.getElementById('dice'),
            that = this;
        dObj.className = 'roll';
        
        setTimeout(function () {
            dObj.className = '';
            //var rand = parseInt(document.getElementById('chatTxt').value);//Math.floor(Math.random() * 6) + 1;
            var rand = Math.floor(Math.random() * 6) + 1,
                dFile = 'res/dice' + rand + '.png',
                dIObj = dObj.getElementsByTagName('img')[1];
            dIObj.src = dFile;
            that.onRollEnds(rand);
        }, 1000);
    },

    /*
     * Checks whether a given position is pre-occupied by another coin or not
     * @param {int} Pos -  Board position
     * @return {boolean} 
     * @name isPositionOccupied
     */        
    isPositionOccupied: function(pos) {
        var posCnt = 0,
            i = 0,
            player;
        for(i = 0; i < this.players.length; i++) {
            player = this.players[i];
            if (pos === player.boardPosition) {
                posCnt++;
            }
        }
        return (posCnt > 1);
    },
    
    /*
     * Checking for the presence of sopan for a given position
     * @param {int} Pos -  Board position
     * @return {int} End Position
     * @name checksopan
     */
    checksopan: function(pos) {
        var sopanPositions = this.sopanPositions,
            position;
        for (var i in sopanPositions) {
            position = sopanPositions[i][0];
            if (pos == position) {
                return sopanPositions[i];
            }
        }
        return null;
    },
    
    /*
     * Checking for the presence of snake for a given position
     * @param {int} Pos -  Board position
     * @return {int} End Position or null
     * @name checkSnake
     */
    checkSnake: function(pos) {
        var snakePositions = this.snakePositions,
            position;
        for (var i in snakePositions) {
            position = snakePositions[i][0];
            if (pos == position) {
                return snakePositions[i];
            }
        }
        return null;
    },

    /*
     * Calculates and get the XY coordinates for a given position
     * @param {int} Pos -  Board position
     * @return {Array} XY coordinates
     * @name calculateXYForPos
     */
    calculateXYForPos: function(pos) {
        var dest = [],
            row = parseInt((pos - 1) / COLS) + 1,
            col = (pos - 1) % COLS;
        if (0 === (row % 2)) {
            col = (COLS - col) - 1;
        }
        dest[0] = (col) * SQUARE_SIZE;
        dest[1] = (ROWS - row) * SQUARE_SIZE;
        return dest;
    },
    
    /*
     * Event - end of rolling dice
     * @param {int} rand - random number
     * @name onRollEnds
     */
    onRollEnds: function(rand) {
        var currentPlayer = this.currentPlayer,
            playerPosition = currentPlayer.position,
            boardPosition = currentPlayer.boardPosition,
            boardPos = parseInt((boardPosition - 1) / COLS),
            currentPixels = currentPlayer.currentPixels,
            ctx = this.ctx;
        this.lastMoveIndex = rand;
        //this.playAudio(this.audioResources[SND_MOVE], true);
        if (0 === boardPosition) {
            rand--;
            //hht local
//hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 
            currentPixels = ctx.getImageData(START_X, START_Y, SQUARE_SIZE, SQUARE_SIZE);
            currentPlayer.position = playerPosition = [START_X, START_Y];
            GameAnimator.currentPixels = currentPixels;
            GameAnimator.left = START_X;
            GameAnimator.top = START_Y;
            boardPosition = 1;
            this.placeProps(currentPlayer, START_X, START_Y, SQUARE_SIZE, SQUARE_SIZE);
            if (0 === rand) {
                currentPlayer.boardPosition = boardPosition;
                this.moveEnds();
                return;
            }
        }
        boardPosition += rand;
        if (0 === (boardPos % 2)) {
            GameAnimator.mtype = 0;
        } else {
            GameAnimator.mtype = 2;
        }
        if (99 < boardPosition) {
            rand -= (boardPosition - 100);
        }
        currentPlayer.boardPosition = boardPosition;
        GameAnimator.moveCoinHoriz(currentPixels, currentPlayer.img, rand, playerPosition[0], playerPosition[1]);        
        
    },
    
    /*
     * Event end of coin-move
     * @param {boolean} aftersopan 
     * @name moveEnds
     */
    moveEnds: function() {
        var that = this,
            currentPlayer = this.currentPlayer,
            playerIndex = this.curPlayerIndex,
            left = GameAnimator.left,
            top = GameAnimator.top,
            pos = currentPlayer.boardPosition,
            nextPlayer,
            sopan,
            sopanPos,
            snake,
            snakePos,
            dest,
            snakeCoords = [];
            

        if (99 < pos) {
            if (MANUAL_PLAYER === playerIndex) {
                this.showWon();
		//this.playagainW();
            } else {
                this.showLost();
		//this.playagainL();
            }
            
         //   this.playAudio(this.audioResources[SND_END], true);
            return;
        }
        this.stopMusic();
        currentPlayer.position = [left, top];
        // On sopan
        sopan = this.checksopan(pos);
        if (sopan) {
            this.contMusic = true;
            //this.playAudio(this.audioResources[SND_HAPPY], true);
            sopanPos = sopan[1];
            dest = this.calculateXYForPos(sopanPos);
            currentPlayer.boardPosition = sopanPos;
            GameAnimator.moveCoin(GameAnimator.currentPixels, currentPlayer.img, left, top, dest[0], dest[1]);
            return;
        }
        // On snake
        snake = this.checkSnake(pos);
        if (snake) {
            this.contMusic = true;
            //this.playAudio(this.audioResources[SND_SAD], true);
            snakePos = snake[1]; 
            dest = this.calculateXYForPos(snakePos);
            currentPlayer.boardPosition = snakePos;
            snakeCoords = snake[2].animationCoordinates;
            GameAnimator.moveCoinViaCoordinates(GameAnimator.currentPixels, currentPlayer.img, left, top, dest[0], dest[1], snakeCoords);
            return;
        }
//hht
//alert(currentPlayer);
     this.popNum(currentPlayer.boardPosition,currentPlayer.src);
        nextPlayer = currentPlayer;

            playerIndex = ((playerIndex + 1) % this.players.length);
            nextPlayer = this.players[playerIndex];
            if (true === this.isPositionOccupied(pos)) {
                this.switchCoins(nextPlayer, left, top);
            } else {
                currentPlayer.currentPixels = GameAnimator.currentPixels;
            }
            this.curPlayerIndex = playerIndex;
            this.currentPlayer = nextPlayer;
        this.canRoll = true;
        if (AUTO_PLAYER === nextPlayer.type) {
            this.showCompTurn();
            setTimeout(function() {
                that.rollDice();
            }, 1000);
        } else {
            this.showTurn();
        }
    },
    
    /*
     * Switch on coin over another if they overlap
     * @param {GameProps} nextPlayer - GameProps object
     * @param {int} left - Left position
     * @param {int} top - Top postion 
     * @name switchCoins
     */
    switchCoins: function(nextPlayer, left, top) {
        var tempPixels,
            currentPlayer = this.currentPlayer,
            ctx = this.ctx;
        tempPixels = nextPlayer.currentPixels;
        currentPlayer.currentPixels = tempPixels;//empty
        ctx.putImageData(tempPixels, left, top);
        ctx.drawImage(currentPlayer.img, left, top, COIN_SIZE, COIN_SIZE);
                    //hht local
//hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 

        nextPlayer.currentPixels = ctx.getImageData(left, top, SQUARE_SIZE, SQUARE_SIZE);
        ctx.drawImage(nextPlayer.img, left, top, COIN_SIZE, COIN_SIZE);
    },
playagainW: function(){
if (confirm("You Won! Would you like to play again?"))
{
GameEng.startFlag=0;
GameEng.init();
}
else
{
blackberry.app.exit();
}
},    
playagainL: function(){
if (confirm("You Lost! Would you like to play again?"))
{
GameEng.startFlag=0;
GameEng.init();
}
else
{
blackberry.app.exit();
}
},
    /*
     * Shows user as winner
     * @param {boolean} toggle - color toggle flag
     * @name showWon
     */
    showWon: function(toggle) {
        var that = this,
            ctx = this.ctx;
        if (toggle) { 
            toggle = false;
            ctx.fillStyle = 'rgba(0, 255, 0, 1)';
        } else {
            toggle = true;
            ctx.fillStyle = 'rgba(255, 255, 0, 1)';
        }
        ctx.font          = 'bold 120px sans-serif';
        ctx.textBaseline  = 'top';
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;
        ctx.shadowBlur    = 20;
        ctx.shadowColor   = "rgba(0, 0, 0, 0.5)";
        ctx.fillText('You Win!', 180, 370);
    //that.playagain();
    setTimeout(function () {
            that.showWon(toggle);
        }, 500);
    },
    
    /*
     * Shows Intro
     * @param {void}
     * @name showIntro
     */
    showIntro: function() {
        var dcanvas = document.getElementById('dcanvas'),
            ctx = dcanvas.getContext('2d'),
            that = this,
            img = new Image(),
            img1 = new Image(),
            img2 = new Image();
                dcanvas.style.display = 'none';
                that.startFlag++;
                that.startGame();
        img.src = 'res/welcome.png';
        img.onload = function() {
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.drawImage(img, 50, 60, 300, 300);
        }
        img1.src = 'res/comp.png';
        img1.onload = function() {
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.drawImage(img1, 100, 600, 190, 190);
        }
        img2.src = 'res/u.png';
        img2.onload = function() {
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.drawImage(img2, 500, 600, 190, 190);
        }

    },
    
    /*
     * Shows user's turn
     * @param {void}
     * @name showTurn
     */
    showTurn: function() {
        if (MANUAL_PLAYER === this.curPlayerIndex && true === this.canRoll) {
            var that = this,
                ctx = this.ctx;
            this.canRoll = false;
                        //hht local
            //hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 

            this.currentPixels = ctx.getImageData(0, 0, BOARD_SIZE, BOARD_SIZE);
            ctx.fillStyle     = 'rgba(0, 0, 0, 1)';
            ctx.font          = 'bold 120px sans-serif';
            ctx.textBaseline  = 'top';
            ctx.shadowOffsetX = 20;
            ctx.shadowOffsetY = 20;
            ctx.shadowBlur    = 20;
            ctx.shadowColor   = "rgba(0, 0, 0, 0.5)";
            ctx.fillText('Your Turn!', 150, 370);
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur    = 0;
            setTimeout(function () {
                that.clearTurn();
            }, 500);
        }
    },
    
    /*
     * Shows user's turn
     * @param {void}
     * @name showTurn
     */
    showTurnE: function(e) {
        if (MANUAL_PLAYER === this.curPlayerIndex && true === this.canRoll) {
            var that = this,
                ctx = this.ctx;
            this.canRoll = false;
                        //hht local
//hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 

            this.currentPixels = ctx.getImageData(0, 0, BOARD_SIZE, BOARD_SIZE);
            ctx.fillStyle     = 'rgba(0, 0, 0, 1)';
            ctx.font          = 'bold 120px sans-serif';
            ctx.textBaseline  = 'top';
            ctx.shadowOffsetX = 20;
            ctx.shadowOffsetY = 20;
            ctx.shadowBlur    = 20;
            ctx.shadowColor   = "rgba(0, 0, 0, 0.5)";
//hht 
//if (e) { alert(e.clientX/85+":"+e.clientY/85);}
/*var rDiff = that.canvas.offsetWidth / BOARD_SIZE;
var digitX = 0;
if (parseInt(e.clientY*rDiff/40)%2 == 0 ) {digitX = (9-parseInt(e.clientX*rDiff/40))+1 } else {digitX =parseInt(e.clientX*rDiff/40)+1};
this.popNum((9-parseInt(e.clientY*rDiff/40))*10+digitX);
  */
          ctx.fillText('Your Turn!', 150, 370);
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur    = 0;
            setTimeout(function () {
                that.clearTurn();
            }, 500);
        }
    },

    /*
     * Shows loading status.
     * @param {Context} ctx - game 2d context object
     * @param {boolean} toggle - color toggle flag
     * @name showLoading
     */
    showLoading: function(ctx, toggle) {

        if (0 < this.startFlag) {
             this.showIntro();
            return;
        }
        var dummyCanvas,
            ctx,
            that = this;

        dummyCanvas = document.getElementById('dcanvas');
        if (!ctx) {
            ctx = dummyCanvas.getContext('2d');
        }

        dummyCanvas.style.display = 'block';
        dummyCanvas.width = '900';
        if (toggle) { 
            toggle = false;
            ctx.fillStyle = 'rgba(255, 255, 0, 1)';
        } else {
            toggle = true;
            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        }
        ctx.font          = 'bold 120px sans-serif';
        ctx.textBaseline  = 'top';
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;
        ctx.shadowBlur    = 20;
        ctx.shadowColor   = "rgba(0, 0, 0, 0.5)";
        var percent = Math.floor((this.loadedResourceCount/this.totalResourceCount) * 100);
        ctx.fillText(percent + '% Loading...', 50, 370);
        setTimeout(function () {
            that.showLoading(ctx, toggle);
        }, 500);
    },  
    /*
     * Shows computer's turn
     * @param {void}
     * @name showCompTurn
     */
    showCompTurn: function() {
        var that = this,
            ctx = this.ctx;
        this.canRoll = false;
                    //hht local
//hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 

        this.currentPixels = ctx.getImageData(0, 0, BOARD_SIZE, BOARD_SIZE);
        ctx.fillStyle      = 'rgba(0, 0, 0, 1)';
        ctx.font           = 'bold 120px sans-serif';
        ctx.textBaseline   = 'top';
        ctx.shadowOffsetX  = 20;
        ctx.shadowOffsetY  = 20;
        ctx.shadowBlur     = 20;
        ctx.shadowColor    = "rgba(0, 0, 0, 0.5)";
        ctx.fillText('Comp\'s Turn!', 50, 370);
        ctx.shadowOffsetX  = 0;
        ctx.shadowOffsetY  = 0;
        ctx.shadowBlur     = 0;
        setTimeout(function () {
            that.clearTurn();
            that.rollDice();
        }, 1000);
    },
    
    /*
     * Intializes game audio
     * @param {void}
     * @name initMusic
     */
    initMusic: function() {
        var that = this,
            welcomeAudio,
            diceAudio,
            moveAudio,
            happyAudio,
            sadAudio,
            endAudio;
musicelements = document.getElementsByTagName("audio");
      /*this.audioResources[SND_HAPPY] = happyAudio = new Audio('res/level.ogg');
        happyAudio.addEventListener(EVNT_AUDIO_DWNLD_COMP, function() {
            that.updateGameResource();
        }, true);
        happyAudio.load();
        happyAudio.addEventListener(EVNT_AUDIO_ENDED, function() {
            that.playAudio(happyAudio);
        }, true);
        
        this.audioResources[SND_SAD] = sadAudio = new Audio('res/oooo.ogg');
        sadAudio.volume = 0.3;
        sadAudio.addEventListener(EVNT_AUDIO_DWNLD_COMP, function() {
            that.updateGameResource();
        }, true);
        sadAudio.load();
        sadAudio.addEventListener(EVNT_AUDIO_ENDED, function() {
            that.playAudio(sadAudio);
        }, true);

        this.audioResources[SND_END] = endAudio = new Audio('res/level.ogg');
        endAudio.addEventListener(EVNT_AUDIO_DWNLD_COMP, function() {
            that.updateGameResource();
        }, true);
        endAudio.load();
        endAudio.addEventListener(EVNT_AUDIO_ENDED, function() {
            that.playAudio(endAudio);
        }, true);
      */
    },
    
    /*
     * Clears the board for next turn
     * @param {void}
     * @name clearTurn
     */
    clearTurn: function() {
        var ctx = this.ctx;
        ctx.shadowOffsetX = SHADOW_OFFSET;
        ctx.shadowOffsetY = SHADOW_OFFSET;
        ctx.putImageData(this.currentPixels, 0, 0);
        this.canRoll = true;  
    },
    
    /*
     * Shows game over message
     * @param {boolean} toggle - color toggle flag
     * @name showLost
     */
    showLost: function(toggle) {
        var that = this,
            ctx = this.ctx;
        if (toggle) { 
            toggle = false;
            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        } else {
            toggle = true;
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        }
        ctx.font          = 'bold 120px sans-serif';
        ctx.textBaseline  = 'top';
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;
        ctx.shadowBlur    = 20;
        ctx.shadowColor   = "rgba(0, 0, 0, 0.5)";
        ctx.fillText("Comp Wins!", 110, 370);

        //that.playagain();

        setTimeout(function () {
            that.showLost(toggle);
        }, 500);
    },
 popNum: function(sansnum,imgsrc)
{
 if (true === this.musicOn) 
	{ 
musicelements[sansnum-1].play();
}
var mytext = '';
mytext = mytext+' = '+SANKHYA[sansnum]+' = '+SANKHYA_SAN[sansnum];
var myposstr=sansnum+" = "+SANKHYA[sansnum]+" = "+SANKHYA_SAN[sansnum];
//var compos = document.getElementById('comppos');
//var upos = document.getElementById('upos');
var uposdiv = document.getElementById('uposdiv');
var compposdiv = document.getElementById('compposdiv');
//alert(compposdiv.innerHTML);
if (imgsrc=="res/u.png")
  {
//upos.value=myposstr;  
uposdiv.innerHTML=myposstr;
}
else 
  {
//compos.value=myposstr;  
compposdiv.innerHTML=myposstr;
   }
      //this.playAudio(this.audioResources[sansnum], true);

},
    
    /*
     * Shows game-over message
     * @param {audio} myAudio - audio object
     * @param {boolean} init - Flag to check the initial call
     * @name playAudio
     */
    playAudio: function(myAudio, init) {
        if (true === this.musicOn) {
            var curAudio = this.currentAudio;
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
            
            if (true === init) {
                this.currentAudio = myAudio;
            }
            if (true === this.contMusic) {
                this.currentAudio.currentTime = 0;
                this.currentAudio.play();
            } else {
                myAudio.pause();
            }
        }
    },
    
    /*
     * Stops game's music
     * @param {void}
     * @name stopMusic
     */
    stopMusic: function() {
        //this.contMusic = false;
        var curAudio = this.currentAudio;
        //curAudio.pause();
        //setTimeout(function () {curAudio.pause();}, 400);
    }
}

/*
 * Class to manage game props like snake, sopan and coins
 * Class GameProps
 * @name GameProps
 */
var GameProps = function(src, width, height) {
    /*
     * Prop image src
     * @type {string}
     * @name src
     */
    this.src = src;
    
    /*
     * Prop obj width
     * @type {Integer}
     * @name width
     */
    this.width = width;
    
    /*
     * Prop obj height
     * @type {Integer}
     * @name height
     */
    this.height = height;
    
    /*
     * Prop obj start coordinates
     * @type {Array}
     * @name startCoordinates
     */
    this.startCoordinates = [];
    
    /*
     * Prop obj animation coordinates
     * @type {Array}
     * @name animationCoordinates
     */
    this.animationCoordinates = [];
    
    /*
     * Prop obj start coordinates
     * @type {Array}
     * @name position
     */
    this.position = [];
    
    /*
     * Source image
     * @type {Image}
     * @name img
     */
    this.img = new Image();
    
    this.img.src = src;
};

/*
 * Class to manage game animations
 * Class GameAnimator
 * @name GameAnimator
 */
var GameAnimator = {
    /*
     * 2D context object
     * @type {2DContext}
     * @name ctx
     */
    ctx: null,
    
    /*
     * Buffered pixel data
     * @type {ImageData}
     * @name currentPixels
     */
    currentPixels: null,
    
    /*
     * Image to be moved
     * @type {Image}
     * @name prop
     */
    prop: null,
    
    /*
     * Image to be moved
     * @type {Image}
     * @name prop
     */
    left: null,
    
    /*
     * Image to be moved
     * @type {Image}
     * @name prop
     */
    top: null,
    
    /*
     * End of animation event
     * @type {Event}
     * @name onAnimEnds
     */
    onAnimEnds: null,
    
    /*
     * Board position type
     * @type {int}
     * @name mtype
     */
    mtype: 0,

    /*
     * Moves image horizontally
     * @param {ImageData} currentPixels - Last pixel data
     * @param {Image} prop - Coin image
     * @param {int} moveCount - Count of no. of moves to be made
     * @param {int} left - start left position
     * @param {int} top - start top position
     * @name moveCoinHoriz
     */
    moveCoinHoriz: function(currentPixels, prop, moveCount, left, top) {
        this.prop = prop;
        this.currentPixels = currentPixels;
        this.moveCoinGeneric(moveCount, left, top);
    },

    /*
     * Moves image vertically
     * @param {ImageData} currentPixels - Last pixel data
     * @param {Image} prop - Coin image
     * @param {int} moveCount - Count of no. of moves to be made
     * @param {int} left - start left position
     * @param {int} top - start top position
     * @name moveCoinVert
     */
    moveCoinVert: function(currentPixels, prop, moveCount, left, top) {
        this.prop = prop;
        this.currentPixels = currentPixels;
        this.moveCoinGeneric(moveCount, left, top);
    },
    
    /*
     * Moves image either horizontally or vertically
     * @param {int} moveCount - Count of no. of moves to be made
     * @param {int} left - start left position
     * @param {int} top - start top position
     * @name moveCoinGeneric
     */
    moveCoinGeneric: function(moveCount, left, top) {
        var ctx = this.ctx,
            currentPixels = this.currentPixels,
            mtype = this.mtype;

        ctx.putImageData(currentPixels, left, top);

        if(((left + 90) == BOARD_SIZE) && (this.mtype == 0)) {
            mtype = 1;
        }
        else if((left == 0) && (this.mtype == 2)) {
            mtype = 1;
        }

        if (0 === mtype) {
            left = left + SQUARE_SIZE;
        } else if(1 === mtype) {
            top = top - SQUARE_SIZE;
        } else if(2 == mtype) {
            left = left - SQUARE_SIZE;
        }
                    //hht local
            //hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 

        this.currentPixels = ctx.getImageData(left, top, SQUARE_SIZE, SQUARE_SIZE);
        ctx.drawImage(this.prop, left, top, COIN_SIZE, COIN_SIZE);
        moveCount--;
        that = this;
        this.mtype = mtype;
        if(((left + SQUARE_SIZE) == BOARD_SIZE) && (mtype == 1)) {
            this.mtype = 2;
        }
        else if ((left == 0) && (mtype == 2)) {
            this.mtype = 1;
        }
        else if ((left == 0) && (mtype == 1)) {
            this.mtype = 0;
        }
        if (moveCount > 0) {
            setTimeout(function () {
                that.moveCoinGeneric(moveCount, left, top);
            }, 500);
        } else {
            this.left = left;
            this.top = top;
            if (this.onAnimEnds) {
                this.onAnimEnds();
            }
        }
    },
    
    /*
     * Moves image over given coordinates
     * @param {ImageData} currentPixels - Last pixel data
     * @param {Image} prop - Coin image
     * @param {int} left - start left position
     * @param {int} top - start top position
     * @param {int} destX - Destination X position
     * @param {int} destY - Destination Y position
     * @param {Array} coords - Array of coordinates on which image to be moved
     * @name moveCoinViaCoordinates
     */
    moveCoinViaCoordinates: function(currentPixels, prop, left, top, destX, destY, coords) {
        this.prop = prop;
        this.currentPixels = currentPixels;
        coords.push([destX, destY]);
        this.animationCoordinates = coords;
        this.animIndex = 0;
        this.left = left;
        this.top = top;
        this.moveCoinToNextCoords(0);
    },
    
    /*
     * Moves image over next coordinate
     * @param {int} index - Coordinates index
     * @name moveCoinToNextCoords
     */
    moveCoinToNextCoords: function(index) {
        var coords = this.animationCoordinates,
            startX = this.left,
            startY = this.top,
            endX,
            endY,
            contFlag = false;
        if (coords[index]) {
            this.animIndex++;
            endX = coords[index][0];
            endY = coords[index][1];
            if (coords[index + 1]) {
                contFlag = true;
            }
            this.moveCoinExactly(startX, startY, endX, endY, contFlag);
        }
    },
    
    /*
     * Moves image within given from - to coordinates
     * @param {ImageData} currentPixels - Last pixel data
     * @param {Image} prop - Coin image
     * @param {int} left - start left position
     * @param {int} top - start top position
     * @param {int} destX - Destination X position
     * @param {int} destY - Destination Y position
     * @name moveCoin
     */
    moveCoin: function(currentPixels, prop, left, top, destX, destY) {
        this.prop = prop;
        this.currentPixels = currentPixels;
        this.moveCoinExactly(left, top, destX, destY);
    },
    
    /*
     * Moves image within given from - to coordinates and takes care of in between positions
     * @param {int} left - start left position
     * @param {int} top - start top position
     * @param {int} destX - Destination X position
     * @param {int} destY - Destination Y position
     * @param {boolean} contFlag - Flag to continue to next position
     * @name moveCoinExactly
     */
    moveCoinExactly: function(left, top, destX, destY, contFlag) {
        var ctx = this.ctx,
            currentPixels = this.currentPixels,
            prop = this.prop
            that = this,
            onClose = false;

        ctx.putImageData(currentPixels, left, top);
        var xdiff = destX - left,
            ydiff = destY - top,
            pX = xdiff,
            pY = ydiff,
            xInc = 0, 
            yInc = 0,
            inc = MOVE_INC;
        if (xdiff < 0) {
            pX *= -1;
        }
        if (ydiff < 0) {
            pY *= -1;
        }
        if (pX >= pY) {
            xInc = inc;
            yInc = Math.floor((pY / pX) * inc);
        } else {
            yInc = inc;
            xInc = Math.floor((pX / pY) * inc);
        }
        if (xdiff < 0) {
            xInc *= -1;
        }
        if (ydiff < 0) {
            yInc *= -1;
        }
        left += xInc;
        top += yInc;
        if ((left == destX && top == destY) ||
            (left > START_Y || left < 0 || top < 0 || top > START_Y) ||
            ((xdiff <= 0 && ydiff <= 0) && (left < destX || top < destY)) ||
            ((xdiff >= 0 && ydiff <= 0) && (left > destX || top < destY)) ||
            ((xdiff <= 0 && ydiff >= 0) && (left < destX || top > destY)) ||
            ((xdiff >= 0 && ydiff >= 0) && (left > destX || top > destY))) {
            onClose = true;
            left = destX;
            top = destY;
            
        }
                    //hht local
            //hht            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 

        this.currentPixels = ctx.getImageData(left, top, SQUARE_SIZE, SQUARE_SIZE);
        ctx.drawImage(prop, left, top, COIN_SIZE, COIN_SIZE);
        
        if (onClose) {
            this.left = left;
            this.top = top;
            if (true === contFlag) {
                this.moveCoinToNextCoords(this.animIndex);
            } else {
                if (this.onAnimEnds) {
                    this.onAnimEnds();
                }
            }
        } else {
            setTimeout(function () {
                that.moveCoinExactly(left, top, destX, destY, contFlag);
            }, 150);
        }
    }
}