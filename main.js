/*jslint browser: true, undef: true, eqeqeq: true, nomen: true, white: true */
/*global window: false, document: false */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(event) {
    event.preventDefault();
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    event.preventDefault();
    const xDiff = touchEndX - touchStartX;
    const yDiff = touchEndY - touchStartY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant.
        if (xDiff > 0) {
            console.log("right swipe");
            // Implement right swipe action
        } else {
            console.log("left swipe");
            // Implement left swipe action
        }
    } else {
        if (yDiff > 0) {
            console.log("down swipe");
            // Implement down swipe action
        } else {
            console.log("up swipe");
            // Implement up swipe action
        }
    }
    // Reset values
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}

const gameContainer = document.getElementById('pacman');
gameContainer.addEventListener('touchstart', handleTouchStart, false);
gameContainer.addEventListener('touchmove', handleTouchMove, false);
gameContainer.addEventListener('touchend', handleTouchEnd, false);

function handleTouchEnd(event) {
    // Existing code...

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            // Right swipe
            user.keyDown({keyCode: KEY.ARROW_RIGHT});
        } else {
            // Left swipe
            user.keyDown({keyCode: KEY.ARROW_LEFT});
        }
    } else {
        if (yDiff > 0) {
            // Down swipe
            user.keyDown({keyCode: KEY.ARROW_DOWN});
        } else {
            // Up swipe
            user.keyDown({keyCode: KEY.ARROW_UP});
        }
    }
    // Reset values
}


// Declare global variables for Supabase client and functions
let supabase;


async function saveHighScore(name, score, team) {
    let gameEndTime = new Date(); // Capture the end time in UTC
    let duration = (gameEndTime - gameStartTime) / 1000; // Calculate duration in seconds

    // Adjust for UTC+2
    gameEndTime.setHours(gameEndTime.getHours() + 2);

    let playedAt = gameEndTime.toISOString(); // Format end time for the database, adjusted to UTC+2

    try {
        const { data, error } = await supabase
            .from('high_scores')
            .insert([
                { 
                    name, 
                    score, 
                    team,
                    time: playedAt, // Time when the game was played, adjusted to UTC+2
                    duration: duration // Duration of the game in seconds
                }
            ]);

        if (error) {
            throw error;
        }
        console.log('High score, time, and duration saved successfully', data);
        await refreshAndDisplayScores(); // Refresh the high scores here
    } catch (error) {
        console.error('Error saving high score, time, and duration:', error);
    }
}



async function loadHighScores() {
    try {
        const { data, error } = await supabase
            .from('high_scores')
            .select('*')
            .order('score', { ascending: false });
        if (error) throw error;
        console.log(data); // Temporarily log the fetched data for debugging
        return data;
    } catch (error) {
        console.error('Exception loading high scores:', error);
        return [];
    }
}

async function refreshAndDisplayScores() {
    try {
        const scores = await loadHighScores(); // This waits for the scores to be loaded
        updateHighScoresUI(scores); // Now that we have scores, update the UI
    } catch (error) {
        console.error('Failed to load or display scores', error);
    }
}

function updateHighScoresUI(scores) {
    const scoresList = document.getElementById('high-scores').querySelector('ol');
    scoresList.innerHTML = ''; // Clear current scores

    scores.forEach((score, index) => {
        const rank = index + 1;  // Calculate rank based on array position
        const listItem = document.createElement('li');
        listItem.textContent = `${rank}. ${score.name}: ${score.score}`;
        listItem.className = `high-score-${score.team}`; // Apply color based on team
        scoresList.appendChild(listItem);
    });

    if (scores.length === 0) {
        scoresList.innerHTML = '<li>No high scores yet!</li>';
    }
}


// Initialize Supabase client and define global functions
function initApp() {
    const supabaseUrl = 'https://zcgcledsadhiiormgiyx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2NsZWRzYWRoaWlvcm1naXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4ODkyMjIsImV4cCI6MjAyNzQ2NTIyMn0.8tFxVubXloJTnOT95tPqV3-kOa00l-XsF_aqgDe_Ak8';
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    refreshAndDisplayScores(); // Start by loading high scores
}

// The initApp function will be called as soon as the window loads
//window.onload = initApp;
// Initialization of Supabase client and high scores loading happens on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initApp(); // Set up initial state but don't start the game yet

    const startGameButton = document.getElementById('start-game');
    const el = document.getElementById("pacman");

    if (el && 'getContext' in document.createElement('canvas')) {
        if (startGameButton) {
            startGameButton.addEventListener('click', function() {
                validateAndProceed(el); // Pass the canvas element to the validate function
            });
        } else {
            console.error("Start game button not found");
        }
    } else {
        el.textContent = "Sorry, needs a browser with support for canvas.";
    }
});

function validateAndProceed(el) {
    const playerNameInput = document.getElementById('player-name').value.trim();
    const teamSelectInput = document.getElementById('team-select').value;

    if (!playerNameInput || !teamSelectInput) {
        alert("Please enter your name and select a team before starting the game.");
        return; // Stop the function here if validation fails
    }

    // Set global variables or use them directly as needed
    playerName = playerNameInput;
    playerTeam = teamSelectInput;
    document.getElementById('start-screen').style.display = 'none'; // Hide the start screen

    // Now initialize the game after the player clicks start and validation passes
    PACMAN.init(el, '.');
}



// Step 2.2: Game Initialization Logic
function initializeGame() {
    if (!gameState.isValidationPassed) {
        console.error("Game initialization aborted: Validation failed.");
        return;
    }

    // Assuming PACMAN.init and game start logic goes here
    const gameContainer = document.getElementById("pacman");
    if (gameContainer) {
        PACMAN.init(gameContainer, '.');
    } else {
        console.error("Game container element not found.");
    }

    // Set playerName and playerTeam in the game logic as needed
    window.playerName = gameState.playerName;
    window.playerTeam = gameState.playerTeam;
}

function validateAndStartGame() {
    // Retrieve user input values
    const playerNameInput = document.getElementById('player-name').value.trim();
    const teamSelect = document.getElementById('team-select');
    const teamSelectValue = teamSelect.options[teamSelect.selectedIndex].value;

    // Perform validation check for player name and team selection
    if (!playerNameInput || teamSelectValue === "") {
        // If validation fails, show an alert and prevent the game from starting
        alert("Please enter your name and select a team before starting the game.");
        return; // Exit the function to halt game start process
    }

    // Hide the start screen since validation passed
    document.getElementById('start-screen').style.display = 'none';

    // Variables playerName and playerTeam are set for use in the game
    window.playerName = playerNameInput;
    window.playerTeam = teamSelectValue;

    // Now that validation has passed, the game can be safely started
    startGameAfterValidation();
}

function startGameAfterValidation() {
    // Initialize PACMAN game here after validation success
    // Note: Ensure that the PACMAN.init or similar function does not get called elsewhere without validation
    const gameContainer = document.getElementById("pacman");
    if (gameContainer) {
        PACMAN.init(gameContainer, '.');
    } else {
        console.error("Game container element not found.");
    }
}
// Initialization of game images
let gameImages = {
    pillImages: [],
    ghostImages: {
        normal: new Image(),
        vulnerable: new Image(),
        eaten: new Image()
    },
    pacmanImages: {
        regular: new Image(),
        dead: new Image()
    }
};

let totalImagesLoaded = 0;
const totalUniqueImages = 9; // Adjust this to the actual number of images you're loading

// Image loaded handler
function imageLoaded() {
    totalImagesLoaded++;
    if (totalImagesLoaded === totalUniqueImages) {
        console.log("All images loaded successfully. Game can be started.");
        // Start or enable game start here, like enabling a "Start" button
    }
}

// Function to initialize and load all game images
function loadGameImages() {
    // Load pill images
    let pillImageSources = ['pill2.png', 'pill2.png', 'pill3.png', 'pill4.png']; // Add your image filenames here
    for (let i = 0; i < pillImageSources.length; i++) {
        let img = new Image();
        img.onload = imageLoaded;
        img.onerror = () => console.error("Failed to load image", pillImageSources[i]);
        img.src = pillImageSources[i];
        gameImages.pillImages.push(img);
    }

    // Load ghost and Pacman images
    let ghostImageSources = {
        normal: 'ghostface_normal.png',
        vulnerable: 'ghostface_vulnerable.png',
        eaten: 'ghostface_eaten.png'
    };
    let pacmanImageSources = {
        regular: 'face.png',
        dead: 'dead.png'
    };

    // Assign onload and onerror for ghost images
    Object.keys(ghostImageSources).forEach(key => {
        let img = gameImages.ghostImages[key];
        img.onload = imageLoaded;
        img.onerror = () => console.error("Failed to load ghost image", key);
        img.src = ghostImageSources[key];
    });

    // Assign onload and onerror for Pacman images
    Object.keys(pacmanImageSources).forEach(key => {
        let img = gameImages.pacmanImages[key];
        img.onload = imageLoaded;
        img.onerror = () => console.error("Failed to load Pacman image", key);
        img.src = pacmanImageSources[key];
    });
}

// Call this function where it makes sense in your game's initialization flow
loadGameImages();

var NONE        = 4,
    UP          = 3,
    LEFT        = 2,
    DOWN        = 1,
    RIGHT       = 11,
    WAITING     = 5,
    PAUSE       = 6,
    PLAYING     = 7,
    COUNTDOWN   = 8,
    EATEN_PAUSE = 9,
    DYING       = 10,
    Pacman      = {};

Pacman.FPS = 30;

Pacman.Ghost = function (game, map, colour) {

    var position  = null,
        direction = null,
        eatable   = null,
        eaten     = null,
        due       = null;

    // Adjust speed based on level
    function getSpeed() {
        var levelMultiplier = Math.max(1, game.getLevel() * 0.1); // Increase speed by 10% per level
        if (isVunerable()) {
            return 1 * levelMultiplier;
        } else if (isHidden()) {
            return 4;
        }
        return 2 * levelMultiplier; // Base speed increased by level
    }
    
    function getNewCoord(dir, current) { 
        
        var speed  = isVunerable() ? 1 : isHidden() ? 4 : 2,
            xSpeed = (dir === LEFT && -speed || dir === RIGHT && speed || 0),
            ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);
    
        return {
            "x": addBounded(current.x, xSpeed),
            "y": addBounded(current.y, ySpeed)
        };
    };

    /* Collision detection(walls) is done when a ghost lands on an
     * exact block, make sure they dont skip over it 
     */
    function addBounded(x1, x2) { 
        var rem    = x1 % 10, 
            result = rem + x2;
        if (rem !== 0 && result > 10) {
            return x1 + (10 - rem);
        } else if(rem > 0 && result < 0) { 
            return x1 - rem;
        }
        return x1 + x2;
    };
    
    function isVunerable() { 
        return eatable !== null;
    };
    
    function isDangerous() {
        return eaten === null;
    };

    function isHidden() { 
        return eatable === null && eaten !== null;
    };
    
    function getRandomDirection() {
        var moves = (direction === LEFT || direction === RIGHT) 
            ? [UP, DOWN] : [LEFT, RIGHT];
        return moves[Math.floor(Math.random() * 2)];
    };
    
    function reset() {
        eaten = null;
        eatable = null;
        position = {"x": 90, "y": 80};
        direction = getRandomDirection();
        due = getRandomDirection();
    };
    
    function onWholeSquare(x) {
        return x % 10 === 0;
    };
    
    function oppositeDirection(dir) { 
        return dir === LEFT && RIGHT ||
            dir === RIGHT && LEFT ||
            dir === UP && DOWN || UP;
    };

    function getEatableTime() {
        var levelMultiplier = Math.max(1, game.getLevel());
        return 6 / levelMultiplier; // Decrease time by level
    }

    function getEatenTime() {
        var levelMultiplier = Math.max(1, game.getLevel());
        return 5 / levelMultiplier; // Decrease time by level
    }

    function makeEatable() {
        eatable = game.getTick();
        direction = oppositeDirection(direction);
    }

    function makeNormal() {
        eatable = null; // Ghost is no longer eatable
        eaten = null;
    }

    function checkEatableTimeout() {
        if (eatable && secondsAgo(eatable) > getEatableTime()) {
            makeNormal();
        }
    }

    function checkEatenTimeout() {
        if (eaten && secondsAgo(eaten) > getEatenTime()) {
            eaten = null; // Ghost respawns
        }
    }

    function eat() {
        eaten = game.getTick();
        eatable = null;
    }

    function pointToCoord(x) {
        return Math.round(x / 10);
    };

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) { 
            return x; 
        } else if (dir === RIGHT || dir === DOWN) { 
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function secondsAgo(tick) { 
        return (game.getTick() - tick) / Pacman.FPS;
    };

    function getColour() { 
        if (eatable) { 
            if (secondsAgo(eatable) > 5) { 
                return game.getTick() % 20 > 10 ? "#FFFFFF" : "#0000BB";
            } else { 
                return "#0000BB";
            }
        } else if(eaten) { 
            return "#222";
        } 
        return colour;
    };

    function draw(ctx) {
        var blockSize = map.blockSize,
            ghostSize = blockSize * 1.5, // Adjusted for visible size without being too large
            positionCorrection = (ghostSize - blockSize) / 2,
            top = position.y / 10 * blockSize - positionCorrection,
            left = position.x / 10 * blockSize - positionCorrection,
            img = gameImages.ghostImages.normal; // Access through gameImages
    
        if (eatable) img = gameImages.ghostImages.vulnerable; // Access through gameImages
        else if (eaten) img = gameImages.ghostImages.eaten; // Access through gameImages
    
        // Draw the ghost image
        ctx.drawImage(img, left, top, ghostSize, ghostSize);
    }
    
    
    

    function pane(pos) {

        if (pos.y === 100 && pos.x >= 190 && direction === RIGHT) {
            return {"y": 100, "x": -10};
        }
        
        if (pos.y === 100 && pos.x <= -10 && direction === LEFT) {
            return position = {"y": 100, "x": 190};
        }

        return false;
    };
    
    function move(ctx) {
        var oldPos = position,
            onGrid = onGridSquare(position),
            npos = null;
    
        // Check if the ghost should revert to normal state from eaten or eatable
        if (eaten && secondsAgo(eaten) > 5) {
            makeNormal();  // Revert from eaten state after 5 seconds
        } else if (eatable && secondsAgo(eatable) > 6) {
            makeNormal();  // Revert from eatable state after 6 seconds
        }
    
        if (due !== direction) {
            npos = getNewCoord(due, position);
            if (onGrid && map.isFloorSpace({ "y": pointToCoord(nextSquare(npos.y, due)), "x": pointToCoord(nextSquare(npos.x, due)) })) {
                direction = due;
            } else {
                npos = null;
            }
        }
    
        if (npos === null) {
            npos = getNewCoord(direction, position);
        }
    
        if (onGrid && map.isWallSpace({ "y": pointToCoord(nextSquare(npos.y, direction)), "x": pointToCoord(nextSquare(npos.x, direction)) })) {
            due = getRandomDirection();            
            return move(ctx);
        }
    
        position = npos;
        
        var tmp = pane(position);
        if (tmp) { 
            position = tmp;
        }
    
        due = getRandomDirection();
    
        return {
            "new": position,
            "old": oldPos
        };
    }
    
    
    
    
    return {
        "eat"         : eat,
        "isVunerable" : isVunerable,
        "isDangerous" : isDangerous,
        "makeEatable" : makeEatable,
        "reset"       : reset,
        "move"        : move,
        "draw"        : draw,
        "checkEatableTimeout": checkEatableTimeout,
        "checkEatenTimeout": checkEatenTimeout
    };
};

Pacman.User = function (game, map) {
    
    var position  = null,
        direction = null,
        eaten     = null,
        due       = null, 
        lives     = null,
        score     = 5,
        keyMap    = {};
    
    keyMap[KEY.ARROW_LEFT]  = LEFT;
    keyMap[KEY.ARROW_UP]    = UP;
    keyMap[KEY.ARROW_RIGHT] = RIGHT;
    keyMap[KEY.ARROW_DOWN]  = DOWN;

    function addScore(nScore) { 
        score += nScore;
        if (score >= 10000 && score - nScore < 10000) { 
            lives += 1;
        }
    };

    function theScore() { 
        return score;
    };

    function loseLife() { 
        lives -= 1;
    };

    function getLives() {
        return lives;
    };

    function initUser() {
        score = 0;
        lives = 3;
        newLevel();
    }
    
    function newLevel() {
        resetPosition();
        eaten = 0;
    };
    
    function resetPosition() {
        position = {"x": 90, "y": 120};
        direction = LEFT;
        due = LEFT;
    };
    
    function reset() {
        initUser();
        resetPosition();
    };        
    
    function keyDown(e) {
        if (e.keyCode === 78) { // 78 is the key code for "N"
            startNewGame();
            e.preventDefault(); // Prevent default action to avoid any unwanted behavior
        } else if (typeof keyMap[e.keyCode] !== "undefined") { 
            due = keyMap[e.keyCode];
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return true;
    };
    

    function getNewCoord(dir, current) {   
        return {
            "x": current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
            "y": current.y + (dir === DOWN && 2 || dir === UP    && -2 || 0)
        };
    };

    function onWholeSquare(x) {
        return x % 10 === 0;
    };

    function pointToCoord(x) {
        return Math.round(x/10);
    };
    
    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) { 
            return x; 
        } else if (dir === RIGHT || dir === DOWN) { 
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function next(pos, dir) {
        return {
            "y" : pointToCoord(nextSquare(pos.y, dir)),
            "x" : pointToCoord(nextSquare(pos.x, dir)),
        };                               
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function isOnSamePlane(due, dir) { 
        return ((due === LEFT || due === RIGHT) && 
                (dir === LEFT || dir === RIGHT)) || 
            ((due === UP || due === DOWN) && 
             (dir === UP || dir === DOWN));
    };

    function move(ctx) {
        
        var npos        = null, 
            nextWhole   = null, 
            oldPosition = position,
            block       = null;
        
        if (due !== direction) {
            npos = getNewCoord(due, position);
            
            if (isOnSamePlane(due, direction) || 
                (onGridSquare(position) && 
                 map.isFloorSpace(next(npos, due)))) {
                direction = due;
            } else {
                npos = null;
            }
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }
        
        if (onGridSquare(position) && map.isWallSpace(next(npos, direction))) {
            direction = NONE;
        }

        if (direction === NONE) {
            return {"new" : position, "old" : position};
        }
        
        if (npos.y === 100 && npos.x >= 190 && direction === RIGHT) {
            npos = {"y": 100, "x": -10};
        }
        
        if (npos.y === 100 && npos.x <= -12 && direction === LEFT) {
            npos = {"y": 100, "x": 190};
        }
        
        position = npos;        
        nextWhole = next(position, direction);
        
        block = map.block(nextWhole);        
        
        if ((isMidSquare(position.y) || isMidSquare(position.x)) &&
            block === Pacman.BISCUIT || block === Pacman.PILL) {
            
            map.setBlock(nextWhole, Pacman.EMPTY);           
            addScore((block === Pacman.BISCUIT) ? 10 : 50);
            eaten += 1;
            
            if (eaten === 182) {
                game.completedLevel();
            }
            
            if (block === Pacman.PILL) { 
                game.eatenPill();
            }
        }   
                
        return {
            "new" : position,
            "old" : oldPosition
        };
    };

    function isMidSquare(x) { 
        var rem = x % 10;
        return rem > 3 || rem < 7;
    };

    function calcAngle(dir, pos) { 
        if (dir == RIGHT && (pos.x % 10 < 5)) {
            return {"start":0.25, "end":1.75, "direction": false};
        } else if (dir === DOWN && (pos.y % 10 < 5)) { 
            return {"start":0.75, "end":2.25, "direction": false};
        } else if (dir === UP && (pos.y % 10 < 5)) { 
            return {"start":1.25, "end":1.75, "direction": true};
        } else if (dir === LEFT && (pos.x % 10 < 5)) {             
            return {"start":0.75, "end":1.25, "direction": true};
        }
        return {"start":0, "end":2, "direction": false};
    };

    function drawDead(ctx, amount) { 
        var size = map.blockSize, 
            half = size / 2;
    
        if (amount >= 1) { 
            return;
        }
    
        // Original dying animation - let's keep it
        ctx.fillStyle = "white";
        ctx.beginPath();        
        ctx.moveTo(((position.x/10) * size) + half, 
                   ((position.y/10) * size) + half);
        ctx.arc(((position.x/10) * size) + half, 
                ((position.y/10) * size) + half,
                half, 0, Math.PI * 2 * amount, true); 
        ctx.fill();    
    
        // Adjusting for image overlay
        if (amount < 1) {
            var scale = 1.5; // Adjust based on your preferred scaling
            var imageSize = size * scale; // New size based on scale
            var imagePosX = ((position.x / 10) * size) + half - (imageSize / 2); // Center image on Pacman
            var imagePosY = ((position.y / 10) * size) + half - (imageSize / 2); // Center image on Pacman
    
            ctx.drawImage(gameImages.pacmanImages.dead, imagePosX, imagePosY, imageSize, imageSize);

        }
    };

    function draw(ctx) { 

        var s = map.blockSize, 
            angle = calcAngle(direction, position);
    
        ctx.fillStyle = "#white";
        ctx.beginPath();        
        ctx.moveTo(((position.x/10) * s) + s / 2, ((position.y/10) * s) + s / 2);
        ctx.arc(((position.x/10) * s) + s / 2, ((position.y/10) * s) + s / 2, s / 2, Math.PI * angle.start, Math.PI * angle.end, angle.direction); 
        ctx.fill(); 
    
        // Using scale to adjust the image size
        var scale = 1.5; // Example scale factor
        var imageSize = map.blockSize * scale; // New scaled size of the image
        var gridPosX = (position.x / 10) * map.blockSize; // Original grid position X
        var gridPosY = (position.y / 10) * map.blockSize; // Original grid position Y
        var imagePosX = gridPosX - ((imageSize - map.blockSize) / 2); // Adjusted X position
        var imagePosY = gridPosY - ((imageSize - map.blockSize) / 2); // Adjusted Y position
    
        // Correcting the reference to use the encapsulated pacmanImages
        ctx.drawImage(gameImages.pacmanImages.regular, imagePosX, imagePosY, imageSize, imageSize);
    };
    
    
    initUser();

    return {
        "draw"          : draw,
        "drawDead"      : drawDead,
        "loseLife"      : loseLife,
        "getLives"      : getLives,
        "score"         : score,
        "addScore"      : addScore,
        "theScore"      : theScore,
        "keyDown"       : keyDown,
        "move"          : move,
        "newLevel"      : newLevel,
        "reset"         : reset,
        "resetPosition" : resetPosition
    };
};

Pacman.Map = function (size) {
    
    var height    = null, 
        width     = null, 
        blockSize = size,
        pillSize  = 0,
        map       = null;
    
    function withinBounds(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width;
    }
    
    function isWall(pos) {
        return withinBounds(pos.y, pos.x) && map[pos.y][pos.x] === Pacman.WALL;
    }
    
    function isFloorSpace(pos) {
        if (!withinBounds(pos.y, pos.x)) {
            return false;
        }
        var peice = map[pos.y][pos.x];
        return peice === Pacman.EMPTY || 
            peice === Pacman.BISCUIT ||
            peice === Pacman.PILL;
    }
    
    function drawWall(ctx) {

        var i, j, p, line;
        //map colour
        ctx.strokeStyle = "#B22B0E";
        ctx.lineWidth   = 5;
        ctx.lineCap     = "round";
        
        for (i = 0; i < Pacman.WALLS.length; i += 1) {
            line = Pacman.WALLS[i];
            ctx.beginPath();

            for (j = 0; j < line.length; j += 1) {

                p = line[j];
                
                if (p.move) {
                    ctx.moveTo(p.move[0] * blockSize, p.move[1] * blockSize);
                } else if (p.line) {
                    ctx.lineTo(p.line[0] * blockSize, p.line[1] * blockSize);
                } else if (p.curve) {
                    ctx.quadraticCurveTo(p.curve[0] * blockSize, 
                                         p.curve[1] * blockSize,
                                         p.curve[2] * blockSize, 
                                         p.curve[3] * blockSize);   
                }
            }
            ctx.stroke();
        }
    }
    
    function reset() {       
        map    = Pacman.MAP.clone();
        height = map.length;
        width  = map[0].length;        
    };

    function block(pos) {
        return map[pos.y][pos.x];
    };
    
    function setBlock(pos, type) {
        map[pos.y][pos.x] = type;
    };

    function drawPills(ctx) {
        ctx.imageSmoothingEnabled = true; // Enable image smoothing
        ctx.imageSmoothingQuality = 'high'; // Set the quality of image smoothing
    
        // Special pill coordinates
        const specialPills = [
            { x: 1, y: 2 }, // Coordinates for pill1
            { x: 17, y: 2 }, // Coordinates for pill2
            { x: 1, y: 16 }, // Coordinates for pill3
            { x: 17, y: 16 } // Coordinates for pill4
        ];
    
        // Adjust the size of the special pills to fill the block size as much as possible
        for (let i = 0; i < specialPills.length; i++) {
            const pill = specialPills[i];
            const img = gameImages.pillImages[i];
            if (map[pill.y][pill.x] === Pacman.PILL) {
                // Removing the 0.6 scaling factor and using the full blockSize
                ctx.drawImage(img, pill.x * blockSize, pill.y * blockSize, blockSize, blockSize);
            }
        }
    
        // Draw regular pills for the remaining positions
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Check if this position is not a special pill, then draw the regular pill
                if (map[y][x] === Pacman.PILL && !specialPills.some(p => p.x === x && p.y === y)) {
                    // Use the full blockSize for regular pills too
                    ctx.drawImage(gameImages.pillImages[0], x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    function getPillImageByPosition(row, col) {
        // Example logic to select an image based on position, adjust as needed
        let selection = (row + col) % pillImages.length; // This will cycle through 0 to 3 based on pillImages array length
        return pillImages[selection];
    }
    
    
    
    function draw(ctx) {
        var i, j, size = blockSize;
    
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width * size, height * size);
    
        drawWall(ctx);
        
        for (i = 0; i < height; i++) {
            for (j = 0; j < width; j++) {
                drawBlock(i, j, ctx);
            }
        }
    
        drawPills(ctx); // Ensure this line is present to draw the pills
    }
    
    
    
    
    function drawBlock(y, x, ctx) {

        var layout = map[y][x];

        if (layout === Pacman.PILL) {
            return;
        }

        ctx.beginPath();
        
        if (layout === Pacman.EMPTY || layout === Pacman.BLOCK || 
            layout === Pacman.BISCUIT) {
            
            ctx.fillStyle = "#000";
		    ctx.fillRect((x * blockSize), (y * blockSize), 
                         blockSize, blockSize);

            if (layout === Pacman.BISCUIT) {
                ctx.fillStyle = "#FFF";
		        ctx.fillRect((x * blockSize) + (blockSize / 2.5), 
                             (y * blockSize) + (blockSize / 2.5), 
                             blockSize / 6, blockSize / 6);
	        }
        }
        ctx.closePath();	 
    };

    reset();
    
    return {
        "draw"         : draw,
        "drawBlock"    : drawBlock,
        "drawPills"    : drawPills,
        "block"        : block,
        "setBlock"     : setBlock,
        "reset"        : reset,
        "isWallSpace"  : isWall,
        "isFloorSpace" : isFloorSpace,
        "height"       : height,
        "width"        : width,
        "blockSize"    : blockSize
    };
};

function showStartScreen() {
    const startScreen = document.createElement('div');
    startScreen.id = 'startScreen';
    startScreen.innerHTML = `
        <input type="text" id="playerName" placeholder="Enter your name" />
        <select id="teamSelect">
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
            <option value="team3">Team 3</option>
        </select>
        <button onclick="startGame()">Start Game</button>
    `;
    document.body.appendChild(startScreen);
}

var PACMAN = (function () {
    var game = this;

    var state        = WAITING,
        //audio        = null,
        ghosts       = [],
        ghostSpecs   = ["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"],
        eatenCount   = 0,
        level        = 0,
        tick         = 0,
        ghostPos, userPos, 
        stateChanged = true,
        timerStart   = null,
        lastTime     = 0,
        ctx          = null,
        timer        = null,
        map          = null,
        user         = null,
        stored       = null;

    function getTick() { 
        return tick;
    };
    
    function getLevel() {
        return level;
    }

    function nextLevel() {
        level += 1;
        console.log('Advancing to level:', level);
        startLevel();  // Reset game state for the new level
    }

    function drawScore(text, position) {
        ctx.fillStyle = "white";
        ctx.font      = "12px BDCartoonShoutRegular";
        ctx.fillText(text, 
                     (position["new"]["x"] / 10) * map.blockSize, 
                     ((position["new"]["y"] + 5) / 10) * map.blockSize);
    }
    
    function dialog(text) {
        ctx.fillStyle = "white";
        ctx.font      = "18px Calibri";
        var width = ctx.measureText(text).width,
            x     = ((map.width * map.blockSize) - width) / 2;        
        ctx.fillText(text, x, (map.height * 10) + 8);
    }

    function soundDisabled() {
        return localStorage["soundDisabled"] === "true";
    };
    
    function startLevel() {        
        user.resetPosition();
        for (var i = 0; i < ghosts.length; i += 1) { 
            ghosts[i].reset();
        }
        //audio.play("start");
        timerStart = tick;
        setState(COUNTDOWN);
        user.resetPosition();
        ghosts.forEach(ghost => ghost.reset());
    }    

    function keyDown(e) {
        if (e.keyCode === KEY.N) {
            startNewGame();
        } else if (e.keyCode === KEY.S) {
            //audio.disableSound();
            localStorage["soundDisabled"] = !soundDisabled();
        } else if (e.keyCode === KEY.P && state === PAUSE) {
            //audio.resume();
            map.draw(ctx);
            setState(stored);
        } else if (e.keyCode === KEY.P) {
            stored = state;
            setState(PAUSE);
            //audio.pause();
            map.draw(ctx);
            dialog("Paused");
        } else if (state !== PAUSE) {   
            return user.keyDown(e);
        }
        return true;
    }    
    var GAME_OVER = 12; // The value should be unique and not conflict with existing states

    function setState(newState) {
        if (state !== newState) {
            state = newState;
            stateChanged = true;
    
            if (state === GAME_OVER) {
                // Handle game over logic, like stopping the game loop or disabling controls
                clearInterval(timer); // Example: stop the main game loop
            }
        }
    }

    function loseLife() {        
        console.log('loseLife called, Lives left:', user.getLives());
        user.loseLife();
    
        if (user.getLives() > 0) {
            console.log('Starting new level...');
            startLevel();
        } else {
            console.log("Final Game Over, State before setting GAME_OVER:", state);
            let finalScore = user.theScore(); // Capture the score right before any game state reset
    
            if (!isScoreSaved) {
                isScoreSaved = true;
                saveHighScore(playerName, finalScore, playerTeam)
                    .then(() => {
                        refreshAndDisplayScores(); // Refresh scores after saving
                    })
                    .catch(error => console.error('Failed to save or refresh scores', error));
            }
    
            // Conditionally show the game over screen to avoid repetition
            if (state !== GAME_OVER) {
                showGameOverScreen(finalScore); // Pass the captured score
                setState(GAME_OVER);
            }
        }
    }
    
    
    async function showGameOverScreen(score) {
        console.log('Showing game over screen');
        let gameOverScreen = document.getElementById('game-over-screen');
        if (!gameOverScreen) {
            gameOverScreen = document.createElement('div');
            gameOverScreen.id = 'game-over-screen';
            document.body.appendChild(gameOverScreen);
        }
    
        // Ensure the game over screen is visible
        gameOverScreen.style.display = 'block';  
        gameOverScreen.style.position = 'fixed';  
        gameOverScreen.style.left = '50%';
        gameOverScreen.style.top = '50%';
        gameOverScreen.style.transform = 'translate(-50%, -50%)';
        gameOverScreen.style.zIndex = '1000';  
        gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverScreen.style.color = 'white';
        gameOverScreen.style.padding = '20px';
        gameOverScreen.style.textAlign = 'center';
        gameOverScreen.style.borderRadius = '10px'; // Added a border radius for a softer look
        gameOverScreen.style.fontSize = '20px'; // Adjust the font size for better readability
        
        // Initialize game over screen HTML structure
        gameOverScreen.innerHTML = `
            <h1>Game Over</h1>
            <p>Score: ${score}</p>
            <p><span id="player-rank">calculating...</span></p>
            <button id="start-new-game-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Start New Game</button>
        `; // Added inline styling for the button for better visibility
    
        // Attach the event listener to the Start New Game button
        const startNewGameButton = document.getElementById("start-new-game-button");
        startNewGameButton.onclick = () => {
            PACMAN.startNewGame(); // Make sure this aligns with how you're structuring your game start logic
        };
    
        // Calculate and update rank after fetching high scores
        try {
            const scores = await loadHighScores();
            const rank = scores.findIndex(s => s.score <= score) + 1;
            document.getElementById('player-rank').textContent = rank > 0 ? `Rank: ${rank}` : 'N/A';
        } catch (error) {
            console.error('Error calculating rank:', error);
            document.getElementById('player-rank').textContent = 'Error calculating rank';
        }
    }
    
    
    
    

    async function calculateRank(score) {
        const scores = await loadHighScores();
        loadHighScores().then(scores => {
            var rank = scores.findIndex(s => s.score <= score) + 1;
            var rankElement = document.getElementById('player-rank');
            if (rankElement) {
                rankElement.textContent = rank > 0 ? rank : 'N/A';
            }
        }).catch(error => {
            console.error('Error calculating rank:', error);
            var rankElement = document.getElementById('player-rank');
            if (rankElement) {
                rankElement.textContent = 'Error';
            }
        });
        document.getElementById('player-rank').textContent = calculatedRank;
    }
    
    

    function setState(nState) { 
        state = nState;
        stateChanged = true;
    };
    
    function collided(user, ghost) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) + 
                          Math.pow(ghost.y - user.y, 2))) < 10;
    };

    function drawFooter() {
        
        var topLeft  = (map.height * map.blockSize),
            textBase = topLeft + 17;
        
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);
        
        ctx.fillStyle = "white";

        for (var i = 0, len = user.getLives(); i < len; i++) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(150 + (25 * i) + map.blockSize / 2,
                       (topLeft+1) + map.blockSize / 2);
            
            ctx.arc(150 + (25 * i) + map.blockSize / 2,
                    (topLeft+1) + map.blockSize / 2,
                    map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
            ctx.fill();
        }

        ctx.fillStyle = !soundDisabled() ? "#00FF00" : "#FF0000";
        ctx.font = "bold 16px sans-serif";
        //ctx.fillText("♪", 10, textBase);
        ctx.fillText("s", 10, textBase);

        ctx.fillStyle = "white";
        ctx.font      = "14px Calibri";
        ctx.fillText("Score: " + user.theScore(), 30, textBase);
        ctx.fillText("Level: " + level, 260, textBase);
    }

    function redrawBlock(pos) {
        map.drawBlock(Math.floor(pos.y/10), Math.floor(pos.x/10), ctx);
        map.drawBlock(Math.ceil(pos.y/10), Math.ceil(pos.x/10), ctx);
    }

    function mainDraw() { 

        var diff, u, i, len, nScore;
        
        ghostPos = [];
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Example drawing order
        map.draw(ctx); // Redraw the game map
        ghosts.forEach(ghost => ghost.draw(ctx)); // Redraw each ghost
        user.draw(ctx); // Redraw Pacman
        drawFooter(); // Redraw UI elements like score and lives

        for (i = 0, len = ghosts.length; i < len; i += 1) {
            ghostPos.push(ghosts[i].move(ctx));
        }
        u = user.move(ctx);
        
        for (i = 0, len = ghosts.length; i < len; i += 1) {
            redrawBlock(ghostPos[i].old);
        }
        redrawBlock(u.old);
        
        for (i = 0, len = ghosts.length; i < len; i += 1) {
            ghosts[i].draw(ctx);
        }                     
        user.draw(ctx);
        
        userPos = u["new"];
        
        for (i = 0, len = ghosts.length; i < len; i += 1) {
            if (collided(userPos, ghostPos[i]["new"])) {
                if (ghosts[i].isVunerable()) { 
                    //audio.play("eatghost");
                    ghosts[i].eat();
                    eatenCount += 1;
                    nScore = eatenCount * 50;
                    drawScore(nScore, ghostPos[i]);
                    user.addScore(nScore);                    
                    setState(EATEN_PAUSE);
                    timerStart = tick;
                } else if (ghosts[i].isDangerous()) {
                    //audio.play("die");
                    setState(DYING);
                    timerStart = tick;
                }
            }
        }                             
    };

    function mainLoop() {
        if (state === GAME_OVER && !isGameOverShown) {
            let finalScore = user.theScore();
            showGameOverScreen(finalScore);
            isGameOverShown = true; // Prevent further calls
        }
        var diff;

        if (state !== PAUSE) { 
            ++tick;
        }

        map.drawPills(ctx);

        if (state === PLAYING) {
            mainDraw();
        } else if (state === WAITING && stateChanged) {            
            stateChanged = false;
            map.draw(ctx);
            dialog("Press N to start a New game");            
        } else if (state === EATEN_PAUSE && 
                   (tick - timerStart) > (Pacman.FPS / 3)) {
            map.draw(ctx);
            setState(PLAYING);
        } else if (state === DYING) {
            if (tick - timerStart > (Pacman.FPS * 2)) { 
                loseLife();
            } else { 
                redrawBlock(userPos);
                for (let i = 0, len = ghosts.length; i < len; i++) {
                    redrawBlock(ghostPos[i].old);
                    ghostPos.push(ghosts[i].draw(ctx));
                }                                   
                user.drawDead(ctx, (tick - timerStart) / (Pacman.FPS * 2));
            }
        } else if (state === COUNTDOWN) {
            //change start timer delay
            diff = 3 + Math.floor((timerStart - tick) / Pacman.FPS);
            
            if (diff === 0) {
                map.draw(ctx);
                setState(PLAYING);
            } else {
                if (diff !== lastTime) { 
                    lastTime = diff;
                    map.draw(ctx);
                    dialog("Starting in: " + diff);
                }
            }
        } 

        drawFooter();
    }

    function eatenPill() {
        //audio.play("eatpill");
        timerStart = tick;
        eatenCount = 0;
        for (let i = 0; i < ghosts.length; i++) {
            ghosts[i].makeEatable(ctx);
        }        
    };
    
    function completedLevel() {
        setState(WAITING);
        level += 1;
        map.reset();
        user.newLevel();
        startLevel();
    };

    function keyPress(e) { 
        if (state !== WAITING && state !== PAUSE) { 
            e.preventDefault();
            e.stopPropagation();
        }
    };
    window.startNewGame = startNewGame;

    function startNewGame() {
        console.log("startNewGame called. Resetting game.");
        isScoreSaved = false; // Reset score saving flag
        state = WAITING; // Or PLAYING, depending on how you wish to start the new game
        level = 1; // Reset level to 1 or appropriate starting level
        user.reset(); // Reset user/player state
        map.reset(); // Reset game map
        refreshAndDisplayScores(); // Refresh and display scores, if necessary
        
        // Reset any flags or conditions that control the display of the game over screen
        isGameOverShown = false; // Assuming you have a flag like this to control game over screen visibility
    
        // Hide or remove the game over screen
        let gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        gameStartTime = new Date();
        console.log("Game start time:", gameStartTime.toISOString());

        startLevel(); // Function to start or restart the game level
    }
    
    
    
    
    
    
    
    function init(wrapper, root) {
        var blockSize = wrapper.offsetWidth / 19;
        var pillSize = blockSize * 0.6;
        gameImages.pillSize = pillSize;
        var i, len, ghost,
            blockSize = wrapper.offsetWidth / 19,
            canvas = document.createElement("canvas");
    
        canvas.setAttribute("width", (blockSize * 19) + "px");
        canvas.setAttribute("height", (blockSize * 22) + 30 + "px");
        wrapper.appendChild(canvas);
    
        ctx = canvas.getContext('2d');
    
        map = new Pacman.Map(blockSize);
        user = new Pacman.User({
            "completedLevel": completedLevel,
            "eatenPill": eatenPill
        }, map);
    
        for (i = 0, len = ghostSpecs.length; i < len; i += 1) {
            ghost = new Pacman.Ghost({"getTick": getTick}, map, ghostSpecs[i]);
            ghosts.push(ghost);
        }
        
        map.draw(ctx);
        dialog("Loading ...");
    
        // Always enable the Start Game button, but perform validation on click
        var startButton = document.getElementById('start-game');
        startButton.disabled = false; // The button is always enabled, but validation happens onClick
    
        startButton.addEventListener('click', function() {
            var playerNameInput = document.getElementById('player-name').value.trim();
            var teamSelectInput = document.getElementById('team-select').value;
    
            if (!playerNameInput || !teamSelectInput) {
                // If validation fails, alert the user and do not start the game
                alert("Please enter your name and select a team before starting the game.");
            } else {
                // If validation passes, hide the start screen and start the game
                playerName = playerNameInput;
                playerTeam = teamSelectInput;
                document.getElementById('start-screen').style.display = 'none';
                loaded(); // Now start the game
                PACMAN.startNewGame();
            }
        });
    
        document.addEventListener("keydown", keyDown, true);
        document.addEventListener("keypress", keyPress, true);
    
        if (timer) {
            clearInterval(timer); // Clear the existing interval
        }
        timer = setInterval(mainLoop, 1000 / Pacman.FPS);
    
        startNewGame(); // Load the game assets and high scores
    }
    
       
    function loaded() {

        dialog("Press N to Start");
        
        document.addEventListener("keydown", keyDown, true);
        document.addEventListener("keypress", keyPress, true); 
        
        loadHighScores(); // Fetch high scores as soon as the game is loaded

        if (timer) {
            clearInterval(timer); // Clear the existing interval
        }
        timer = setInterval(mainLoop, 1000 / Pacman.FPS);
    };
    return {
        init: init,
        startNewGame: startNewGame,
        getLevel: getLevel,
        nextLevel: nextLevel  // Make sure to expose this if you need to call it externally
    };
    
}());

/* Human readable keyCode index */
var KEY = {'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27, 'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40, 'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59, 'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93, 'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107, 'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110, 'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145, 'SEMICOLON': 186, 'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189, 'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192, 'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220, 'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222};

(function () {
	/* 0 - 9 */
	for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
	}
	/* A - Z */
	for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
	}
	/* NUM_PAD_0 - NUM_PAD_9 */
	for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
	}
	/* F1 - F12 */
	for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
	}
})();

Pacman.WALL    = 0;
Pacman.BISCUIT = 1;
Pacman.EMPTY   = 2;
Pacman.BLOCK   = 3;
Pacman.PILL    = 4;

Pacman.MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 4, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0],
	[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
	[2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2],
	[0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0],
	[2, 2, 2, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 2, 2, 2],
	[0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
	[2, 2, 2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 2],
	[0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
	[0, 4, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 0],
	[0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
	[0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

Pacman.WALLS = [
    
    [{"move": [0, 9.5]}, {"line": [3, 9.5]},
     {"curve": [3.5, 9.5, 3.5, 9]}, {"line": [3.5, 8]},
     {"curve": [3.5, 7.5, 3, 7.5]}, {"line": [1, 7.5]},
     {"curve": [0.5, 7.5, 0.5, 7]}, {"line": [0.5, 1]},
     {"curve": [0.5, 0.5, 1, 0.5]}, {"line": [9, 0.5]},
     {"curve": [9.5, 0.5, 9.5, 1]}, {"line": [9.5, 3.5]}],

    [{"move": [9.5, 1]},
     {"curve": [9.5, 0.5, 10, 0.5]}, {"line": [18, 0.5]},
     {"curve": [18.5, 0.5, 18.5, 1]}, {"line": [18.5, 7]},
     {"curve": [18.5, 7.5, 18, 7.5]}, {"line": [16, 7.5]},
     {"curve": [15.5, 7.5, 15.5, 8]}, {"line": [15.5, 9]},
     {"curve": [15.5, 9.5, 16, 9.5]}, {"line": [19, 9.5]}],

    [{"move": [2.5, 5.5]}, {"line": [3.5, 5.5]}],

    [{"move": [3, 2.5]},
     {"curve": [3.5, 2.5, 3.5, 3]},
     {"curve": [3.5, 3.5, 3, 3.5]},
     {"curve": [2.5, 3.5, 2.5, 3]},
     {"curve": [2.5, 2.5, 3, 2.5]}],

    [{"move": [15.5, 5.5]}, {"line": [16.5, 5.5]}],

    [{"move": [16, 2.5]}, {"curve": [16.5, 2.5, 16.5, 3]},
     {"curve": [16.5, 3.5, 16, 3.5]}, {"curve": [15.5, 3.5, 15.5, 3]},
     {"curve": [15.5, 2.5, 16, 2.5]}],

    [{"move": [6, 2.5]}, {"line": [7, 2.5]}, {"curve": [7.5, 2.5, 7.5, 3]},
     {"curve": [7.5, 3.5, 7, 3.5]}, {"line": [6, 3.5]},
     {"curve": [5.5, 3.5, 5.5, 3]}, {"curve": [5.5, 2.5, 6, 2.5]}],

    [{"move": [12, 2.5]}, {"line": [13, 2.5]}, {"curve": [13.5, 2.5, 13.5, 3]},
     {"curve": [13.5, 3.5, 13, 3.5]}, {"line": [12, 3.5]},
     {"curve": [11.5, 3.5, 11.5, 3]}, {"curve": [11.5, 2.5, 12, 2.5]}],

    [{"move": [7.5, 5.5]}, {"line": [9, 5.5]}, {"curve": [9.5, 5.5, 9.5, 6]},
     {"line": [9.5, 7.5]}],
    [{"move": [9.5, 6]}, {"curve": [9.5, 5.5, 10.5, 5.5]},
     {"line": [11.5, 5.5]}],


    [{"move": [5.5, 5.5]}, {"line": [5.5, 7]}, {"curve": [5.5, 7.5, 6, 7.5]},
     {"line": [7.5, 7.5]}],
    [{"move": [6, 7.5]}, {"curve": [5.5, 7.5, 5.5, 8]}, {"line": [5.5, 9.5]}],

    [{"move": [13.5, 5.5]}, {"line": [13.5, 7]},
     {"curve": [13.5, 7.5, 13, 7.5]}, {"line": [11.5, 7.5]}],
    [{"move": [13, 7.5]}, {"curve": [13.5, 7.5, 13.5, 8]},
     {"line": [13.5, 9.5]}],

    [{"move": [0, 11.5]}, {"line": [3, 11.5]}, {"curve": [3.5, 11.5, 3.5, 12]},
     {"line": [3.5, 13]}, {"curve": [3.5, 13.5, 3, 13.5]}, {"line": [1, 13.5]},
     {"curve": [0.5, 13.5, 0.5, 14]}, {"line": [0.5, 17]},
     {"curve": [0.5, 17.5, 1, 17.5]}, {"line": [1.5, 17.5]}],
    [{"move": [1, 17.5]}, {"curve": [0.5, 17.5, 0.5, 18]}, {"line": [0.5, 21]},
     {"curve": [0.5, 21.5, 1, 21.5]}, {"line": [18, 21.5]},
     {"curve": [18.5, 21.5, 18.5, 21]}, {"line": [18.5, 18]},
     {"curve": [18.5, 17.5, 18, 17.5]}, {"line": [17.5, 17.5]}],
    [{"move": [18, 17.5]}, {"curve": [18.5, 17.5, 18.5, 17]},
     {"line": [18.5, 14]}, {"curve": [18.5, 13.5, 18, 13.5]},
     {"line": [16, 13.5]}, {"curve": [15.5, 13.5, 15.5, 13]},
     {"line": [15.5, 12]}, {"curve": [15.5, 11.5, 16, 11.5]},
     {"line": [19, 11.5]}],

    [{"move": [5.5, 11.5]}, {"line": [5.5, 13.5]}],
    [{"move": [13.5, 11.5]}, {"line": [13.5, 13.5]}],

    [{"move": [2.5, 15.5]}, {"line": [3, 15.5]},
     {"curve": [3.5, 15.5, 3.5, 16]}, {"line": [3.5, 17.5]}],
    [{"move": [16.5, 15.5]}, {"line": [16, 15.5]},
     {"curve": [15.5, 15.5, 15.5, 16]}, {"line": [15.5, 17.5]}],

    [{"move": [5.5, 15.5]}, {"line": [7.5, 15.5]}],
    [{"move": [11.5, 15.5]}, {"line": [13.5, 15.5]}],
    
    [{"move": [2.5, 19.5]}, {"line": [5, 19.5]},
     {"curve": [5.5, 19.5, 5.5, 19]}, {"line": [5.5, 17.5]}],
    [{"move": [5.5, 19]}, {"curve": [5.5, 19.5, 6, 19.5]},
     {"line": [7.5, 19.5]}],

    [{"move": [11.5, 19.5]}, {"line": [13, 19.5]},
     {"curve": [13.5, 19.5, 13.5, 19]}, {"line": [13.5, 17.5]}],
    [{"move": [13.5, 19]}, {"curve": [13.5, 19.5, 14, 19.5]},
     {"line": [16.5, 19.5]}],

    [{"move": [7.5, 13.5]}, {"line": [9, 13.5]},
     {"curve": [9.5, 13.5, 9.5, 14]}, {"line": [9.5, 15.5]}],
    [{"move": [9.5, 14]}, {"curve": [9.5, 13.5, 10, 13.5]},
     {"line": [11.5, 13.5]}],

    [{"move": [7.5, 17.5]}, {"line": [9, 17.5]},
     {"curve": [9.5, 17.5, 9.5, 18]}, {"line": [9.5, 19.5]}],
    [{"move": [9.5, 18]}, {"curve": [9.5, 17.5, 10, 17.5]},
     {"line": [11.5, 17.5]}],

    [{"move": [8.5, 9.5]}, {"line": [8, 9.5]}, {"curve": [7.5, 9.5, 7.5, 10]},
     {"line": [7.5, 11]}, {"curve": [7.5, 11.5, 8, 11.5]},
     {"line": [11, 11.5]}, {"curve": [11.5, 11.5, 11.5, 11]},
     {"line": [11.5, 10]}, {"curve": [11.5, 9.5, 11, 9.5]},
     {"line": [10.5, 9.5]}]
];

Object.prototype.clone = function () {
    var i, newObj = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i === 'clone') {
            continue;
        }
        if (this[i] && typeof this[i] === "object") {
            newObj[i] = this[i].clone();
        } else {
            newObj[i] = this[i];
        }
    }
    return newObj;
};
