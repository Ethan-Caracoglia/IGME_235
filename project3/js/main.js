'use strict'

// Player and enemies
let player = Player;
let enemies = [];

// Scene variables
let menuScene;
let gameScene;
let overScene;

// Text Display
let titleDisplay;
let playDisplay;
let backgroundDisplay;
let healthDisplay;
let waveDisplay;
let gameOverDisplay;
let menuDisplay;

let titleDisplayPath = "images/Title.png";
let playDisplayPath = "images/Play.png";
let backgroundDisplayPath = "images/Background.png";
let gameOverDisplayPath = "images/GameOver.png";
let menuDisplayPath = "images/Menu.png";

// Game variables
let wave = 1;
let enemyAdditions = 5; //The amount of enemies to add each wave; 

// Time variables
let deltaTime = 0; 
let lastTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Create a PixiJS Application
    const app = new PIXI.Application({
        width: 1280,
        height: 720,
        backgroundColor: 0xEEEEFF,
    });

    // Append the canvas to the HTML body
    document.body.appendChild(app.view);

    // Scene Dimensions
    const sceneWidth = app.view.width;
    const sceneHeight = app.view.height;

    // Setup the game to the main menu.
    setup();

    // Start the game loop
    app.ticker.add(delta => {
        if (gameScene.visible) {
            gameLoop();
        }
    });

    //Loads the game into the game scene
    function loadGame(m) {
        if (m.clientX >= 400 && m.clientX <= 900 &&
            m.clientY >= 415 && m.clientY <= 660 &&
            menuScene.visible) {
                menuScene.visible = false;
                gameScene.visible = true;
                gameScene.addChild(backgroundDisplay);
                start();
        }

        if (m.clientX >= 400 && m.clientX <= 900 &&
            m.clientY >= 415 && m.clientY <= 660 &&
            overScene.visible) {
                overScene.visible = false;
                menuScene.visible = true;
                menuScene.addChild(backgroundDisplay);
                menuScene.addChild(titleDisplay);
                menuScene.addChild(playDisplay);
            }
    }

    function nextLevel() {
        wave++;
        start();
    }

    function gameLoop() {
        // Update the deltaTime
        deltaTime = (performance.now() - lastTime) / 1000;
        lastTime = performance.now();
        
        // Update the player
        player.update(enemies);

        // Update the enemies
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].update(player);
            if (enemies[i].died) {
                gameScene.removeChild(enemies[i].sprite);
            }
        }

        enemies = enemies.filter(enemy => enemy.died == false);

        if (player.health <= 0) {
            wave = 1;
            gameScene.visible = false;
            overScene.visible = true;
            overScene.addChild(backgroundDisplay);
            overScene.addChild(menuDisplay);
            overScene.addChild(gameOverDisplay);
            overScene.addChild(waveDisplay);
        }
        
        gameScene.removeChild(waveDisplay);
        waveDisplay = new PIXI.Text("Wave: " + wave);
        waveDisplay.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: "Futura",
            fontStyle: "bold",
            stroke: 0x000000,
            strokeThickness: 6
        });
        waveDisplay.x = 20;
        waveDisplay.y = 10;
        gameScene.addChild(waveDisplay);

        gameScene.removeChild(healthDisplay);
        healthDisplay = new PIXI.Text("Health: " + player.health);
        healthDisplay.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: "Futura",
            fontStyle: "bold",
            stroke: 0x000000,
            strokeThickness: 6
        });
        healthDisplay.x = 20;
        healthDisplay.y = 60;
        gameScene.addChild(healthDisplay);

        if (enemies.length == 0) {
            nextLevel();
        }
    }
    
    function setup() {
        menuScene = new PIXI.Container();
        gameScene = new PIXI.Container();
        overScene = new PIXI.Container();
    
        app.stage.addChild(menuScene);
        app.stage.addChild(gameScene);
        app.stage.addChild(overScene);
    
        menuScene.visible = true;
        gameScene.visible = false;
        overScene.visible = false;

        titleDisplay = new PIXI.Sprite(PIXI.Texture.from(titleDisplayPath));
        playDisplay = new PIXI.Sprite(PIXI.Texture.from(playDisplayPath));
        backgroundDisplay = new PIXI.Sprite(PIXI.Texture.from(backgroundDisplayPath));
        menuDisplay = new PIXI.Sprite(PIXI.Texture.from(menuDisplayPath));
        gameOverDisplay = new PIXI.Sprite(PIXI.Texture.from(gameOverDisplayPath));

        menuScene.addChild(backgroundDisplay);
        menuScene.addChild(titleDisplay);
        menuScene.addChild(playDisplay);

        titleDisplay.x = sceneWidth / 2;
        titleDisplay.y = 125;
        titleDisplay.anchor.set(0.5);
        playDisplay.x = sceneWidth / 2;
        playDisplay.y = 460;
        playDisplay.anchor.set(0.5);
        backgroundDisplay.x = sceneWidth / 2;
        backgroundDisplay.y = sceneHeight / 2;
        backgroundDisplay.scale.set(1.28);
        backgroundDisplay.anchor.set(0.5);
        menuDisplay.x = sceneWidth / 2;
        menuDisplay.y = 460;
        menuDisplay.anchor.set(0.5);
        gameOverDisplay.x = sceneWidth / 2;
        gameOverDisplay.y = 125;
        gameOverDisplay.anchor.set(0.5);

        window.addEventListener('mousedown', loadGame);

        waveDisplay = new PIXI.Text("Wave: " + wave);
        waveDisplay.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: "Futura",
            fontStyle: "bold",
            stroke: 0x000000,
            strokeThickness: 6
        });
        waveDisplay.x = 20;
        waveDisplay.y = 10;
        gameScene.addChild(waveDisplay);

        healthDisplay = new PIXI.Text("Health: " + player.health);
        healthDisplay.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: "Futura",
            fontStyle: "bold",
            stroke: 0x000000,
            strokeThickness: 6
        });
        healthDisplay.x = 20;
        healthDisplay.y = 60;
        gameScene.addChild(healthDisplay);
    }
    
    function start() {    
        // Create the player
        gameScene.removeChild(player.sprite);
        gameScene.removeChild(player.attackSprite);
        player = [];
        player = new Player(sceneWidth / 2, sceneHeight / 2);
        player.setup();
    
        enemies = [];
        // Spawn Shamblers
        for (let i = 0; i < (wave * enemyAdditions); i++) {
            enemies.push(
                new Shambler(
                    randRange(0, sceneWidth), randRange(0, sceneHeight)
                )
            );
        }
    }
});