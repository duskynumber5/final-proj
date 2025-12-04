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
        var BGcolor = Phaser.Display.Color.GetColor(128, 128, 128)
        this.add.rectangle(config.width / 2, config.height / 2, 600, 600, BGcolor)
        var ACcolor = Phaser.Display.Color.GetColor(100, 100, 100)
        this.add.rectangle(config.width / 2, config.height / 2, 550, 550, ACcolor)

        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        const COLOR_PRIMARY = 0xB8860B
        const COLOR_DARK    = 0xFFD700

        this.label = this.add.text(500, 150, `Lanterns: ${game.currentLanterns}`, {
            fontSize: '18px',
            color: '#ffffff'
        })

        const rexUI = this.rexUI
        
        const track = rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK)
        const thumb = rexUI.add.roundRectangle(0, 0, 0, 0, 12, COLOR_PRIMARY)

        this.slider = this.rexUI.add.slider({
            x: 700,
            y: 200,
            width: 400,
            height: 20,
            orientation: 'x',
            track,
            thumb,
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
            if (game.landscapeUpdate == false) {
                var overlayColor = 0xFFD700
                this.B1.fillColor = overlayColor
                game.landscapeUpdate = true
            } else {
                var overlayColor = Phaser.Display.Color.GetColor(250, 250, 250)
                this.B1.fillColor = overlayColor
                game.landscapeUpdate = false
            }
        })

        this.add.text(500, 380, `Scene Mood:`, {
            fontSize: '18px',
            color: '#ffffff'
        })

        this.sceneButtons = []
        this.createSceneButton(600, 450, 'Calm', 'calm')
        this.createSceneButton(750, 450, 'Festival', 'festival')
        this.createSceneButton(900, 450, 'Easter', 'easter')
    }

    createSceneButton(x, y, text, stateValue) {
        const rectColor = Phaser.Display.Color.GetColor(250, 250, 250)
        const rect = this.add.rectangle(x, y, 120, 40, rectColor).setOrigin(0.5).setInteractive()

        const label = this.add.text(x, y, text, {
            fontSize: '16px',
            color: '#000000'
        }).setOrigin(0.5)

        this.sceneButtons.push({ rect, stateValue })

        rect.on('pointerdown', () => {
            game.sceneState = stateValue
            game.lanternUpdate = true

            this.sceneButtons.forEach(btn => {
                btn.rect.fillColor = 0xFFFFFF
            })

            rect.fillColor = 0xFFD700
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.scene.stop('settingsScene')
            this.scene.resume('homeScene')
        }
    }
}