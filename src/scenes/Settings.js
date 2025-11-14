class Settings extends Phaser.Scene {
    constructor() {
        super("settingsScene")
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })
    }

    create() {
        this.pointer = this.input.activePointer

        var BGcolor = Phaser.Display.Color.GetColor(255, 56, 190)
        this.add.rectangle(config.width / 2, config.height / 2, 600, 600, BGcolor)

        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        const COLOR_PRIMARY = 0x4e342e
        const COLOR_DARK    = 0x260e04

        this.label = this.add.text(500, 150, `Lanterns: ${game.currentLanterns}`, {
            fontSize: '18px',
            color: '#ffffff'
        })

        this.slider = this.rexUI.add.slider({
            x: 700,
            y: 200,
            width: 400,
            height: 20,
            orientation: 'x',

            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 12, COLOR_PRIMARY),

            input: 'drag',
            value: game.currentLanterns / game.maxLanterns,

            valuechangeCallback: (value) => {
                const newCount = Math.round(value * game.maxLanterns)
                this.label.setText(`Lanterns: ${newCount}`)
                if (game.currentLanterns != newCount) {
                    game.currentLanterns = newCount
                    game.lanternUpdate = true
                }
            }
        }).layout()

        this.add.text(500, 300, `Regenerate Landscape`, {
            fontSize: '18px',
            color: '#ffffff'
        })
        var B1color = Phaser.Display.Color.GetColor(250, 250, 250)
        this.B1 = this.add.rectangle(750, 290, 40, 40, B1color).setOrigin(0).setInteractive()

        this.B1.on('pointerdown', () => {
            var overlayColor = Phaser.Display.Color.GetColor(160, 0, 30)
            this.B1.fillColor = overlayColor
            game.landscapeUpdate = true
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.scene.stop('settingsScene')
            this.scene.resume('homeScene')
        }
    }
}