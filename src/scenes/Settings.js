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

        this.add.text(500, 380, `Scene Mood:`, {
            fontSize: '18px',
            color: '#ffffff'
        })

        this.stateLabel = this.add.text(500, 405, `Current: ${game.sceneState}`, {
            fontSize: '16px',
            color: '#ffffff'
        })

        this.createSceneButton(600, 450, 'Calm', 'calm')
        this.createSceneButton(750, 450, 'Festival', 'festival')
        this.createSceneButton(900, 450, 'Sparse', 'sparse')
    }

    createSceneButton(x, y, text, stateValue) {
        const rectColor = Phaser.Display.Color.GetColor(250, 250, 250)
        const rect = this.add.rectangle(x, y, 120, 40, rectColor).setOrigin(0.5).setInteractive()

        const label = this.add.text(x, y, text, {
            fontSize: '16px',
            color: '#000000'
        }).setOrigin(0.5)

        rect.on('pointerdown', () => {
            // set global scene state
            game.sceneState = stateValue

            // tell Home scene to regenerate lanterns with new grammar
            game.lanternUpdate = true

            // update label text so player sees current mode
            this.stateLabel.setText(`Current: ${game.sceneState}`)
        })

        // Optional: simple hover effect
        rect.on('pointerover', () => {
            rect.setFillStyle(Phaser.Display.Color.GetColor(220, 220, 220))
        })
        rect.on('pointerout', () => {
            rect.setFillStyle(rectColor)
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.scene.stop('settingsScene')
            this.scene.resume('homeScene')
        }
    }
}