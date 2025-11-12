let config = {      // screen size & add physics & scenes
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    autoCenter: true,
    render: {
        pixelArt: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Home ]
}

let game = new Phaser.Game(config)  // make the game!

// set key bindings
let Pointer