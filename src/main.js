let config = {      // screen size & add physics & scenes
    type: Phaser.AUTO,
    width: 1500,
    height: 800,
    parent: 'phaser-game',
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
    scene: [ Home, Load, Settings ]
}

let game = new Phaser.Game(config)  // make the game!

// set key bindings
let Pointer, keyS