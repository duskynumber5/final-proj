class Home extends Phaser.Scene {
    constructor() {
        super("homeScene")
    }

    create() {
        this.physics.world.setBounds(-25, -25, 1525, 825)

        if (!game.sceneState) {
            game.sceneState = 'calm'
        }
        this.initLanternGrammar()

        this.drawLandscape1()
        this.drawLandscape2()
        this.genWater()

        // create lanterns
        game.maxLanterns = 200
        game.currentLanterns = 50
        this.lanterns = []
        this.genLanterns()

        this.label = this.add.text(0, 0, '(x, y)')

        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        document.getElementById('info').innerHTML = 'S: Settings Menu'
    }

    update() {
        const pointer = this.input.activePointer

        this.label.setText('(' + pointer.x + ', ' + pointer.y + ')')

        for (var i = 0; i < this.lanterns.length; i++ ) {
            const lantern = this.lanterns[i]
            if (lantern) lantern.update(pointer)
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.scene.pause('homeScene')
            this.scene.launch('settingsScene')
        }

        if (game.landscapeUpdate == true) {
            this.landscapeGraphics1.destroy()
            this.landscapeGraphics2.destroy()
            this.drawLandscape1()
            this.drawLandscape2()
            this.genLanterns()
        }

        if (game.lanternUpdate == true) {
            this.regenWater()
            this.genLanterns()
        }
    }

    genWater() {
        const tiles = []

        for (let x = -25; x < 1525; x += 10) {
            for (let y = 655; y < 825; y += 10) {

                const scale = 0.02 
                let v = Math.sin(x * scale) + Math.sin(y * scale * 1.3)
                v = (v + 2) / 4;

                let r, g, b

                if (game.sceneState === 'calm') {
                    // calm: bluish/purple, soft variation
                    r = 40 + 40 * v
                    g = 90 + 80 * v
                    b = 160 + 80 * v
                } else if (game.sceneState === 'festival') {
                    // festival: warmer, more saturated
                    r = 180 + 70 * v
                    g = 100 + 60 * v
                    b = 80 + 40 * v
                } else {
                    // sparse/mixed: somewhere between
                    r = 80 + 80 * v
                    g = 110 + 80 * v
                    b = 150 + 80 * v
                }

                // make sure we stay in [0,255]
                r = Phaser.Math.Clamp(r, 0, 255)
                g = Phaser.Math.Clamp(g, 0, 255)
                b = Phaser.Math.Clamp(b, 0, 255)

                const color = Phaser.Display.Color.GetColor(r, g, b)
                const sq = this.add.rectangle(x, y, 10, 10, color).setAlpha(0.7)

                tiles.push(sq)
            }
        }
    }

    regenWater() {
        // destroy old tiles
        if (this.waterTiles) {
            this.waterTiles.forEach(tile => tile.destroy())
        }
        this.waterTiles = []
        this.genWater()
        game.waterUpdate = false
    }

    genLanterns() {
        game.lanternUpdate = false 
        this.removeLanterns()
        this.lanterns = []

        const rules = this.lanternGrammar[game.sceneState] || this.lanternGrammar.calm

        for (var i = 0; i < game.currentLanterns; i++) {
            const x = Phaser.Math.Between(0, 1500)
            const y = Phaser.Math.Between(0, 800)

            const lantern = new Lantern(this, x, y)

            const type = this.chooseWeightedKey(rules.typeWeights)
            lantern.applySizeType(type)
            lantern.applyPalette(rules.palette)
            
            this.lanterns.push(lantern)
        }
    }

    removeLanterns() {
        this.lanterns.forEach(lantern => {
            lantern.destroy()
        })
    }

    // refrence: https://gamedev.stackexchange.com/questions/93511/how-can-i-generate-a-2d-mountain-landscape-procedurally
    drawLandscape1() {
        game.landscapeUpdate = false

        this.landscapeGraphics1 = this.add.graphics()
        var color = Phaser.Display.Color.GetColor(100, 100, 100)
        this.landscapeGraphics1.lineStyle(1, color, 1)
        
        // parameters
        var STEP_MAX = 2.5
        var STEP_CHANGE = 0.5
        var HEIGHT_MAX = 650

        // starting conditions
        var height = Phaser.Math.Between(0, HEIGHT_MAX)
        var slope = Phaser.Math.Between(0, HEIGHT_MAX)

        // creating the landscape
        for (var x = 0; x < config.width; x++) {
            // change height and slope
            height += slope
            slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE

            // clip height and slope to maximum
            if (slope > STEP_MAX) { slope = STEP_MAX }
            if (slope < -STEP_MAX) { slope = -STEP_MAX }
        
            if (height > HEIGHT_MAX) { 
                height = HEIGHT_MAX
                slope *= -1
            }
            if (height < 0) { 
                height = 0
                slope *= -1
            }
            
            // draw column
            this.landscapeGraphics1.beginPath()
            this.landscapeGraphics1.moveTo(x, HEIGHT_MAX)
            this.landscapeGraphics1.lineTo(x, height)
            this.landscapeGraphics1.strokePath()
        }
    }

    drawLandscape2() {
        game.landscapeUpdate = false

        this.landscapeGraphics2 = this.add.graphics()
        var color = Phaser.Display.Color.GetColor(200, 200, 200)
        this.landscapeGraphics2.lineStyle(1, color, 1)
        
        // parameters
        var STEP_MAX = 4
        var STEP_CHANGE = 5
        var HEIGHT_MAX = 650

        // starting conditions
        var height = Phaser.Math.Between(400, HEIGHT_MAX)
        var slope = Phaser.Math.Between(400, HEIGHT_MAX)

        // creating the landscape
        for (var x = 0; x < config.width; x++) {
            // change height and slope
            height += slope
            slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE

            // clip height and slope to maximum
            if (slope > STEP_MAX) { slope = STEP_MAX }
            if (slope < -STEP_MAX) { slope = -STEP_MAX }
        
            if (height > HEIGHT_MAX) { 
                height = HEIGHT_MAX
                slope *= -1
            }
            if (height < 0) { 
                height = 0
                slope *= -1
            }
            
            // draw column
            this.landscapeGraphics2.beginPath()
            this.landscapeGraphics2.moveTo(x, HEIGHT_MAX)
            this.landscapeGraphics2.lineTo(x, height)
            this.landscapeGraphics2.strokePath()
        }
    }

    initLanternGrammar() {
        this.lanternGrammar = {
            calm: {
                typeWeights: {
                    small: 0.6,
                    medium: 0.3,
                    large: 0.1
                },
                palette: 'cool'
            },
            festival: {
                typeWeights: {
                    small: 0.2,
                    medium: 0.5,
                    large: 0.3
                },
                palette: 'warm'
            },
            sparse: {
                typeWeights: {
                    small: 0.8,
                    medium: 0.15,
                    large: 0.05
                },
                palette: 'mixed'
            }
        }
    }

    chooseWeightedKey(weightMap) {
        let total = 0
        for (let key in weightMap) {
            total += weightMap[key]
        }

        let r = Math.random() * total
        let running = 0

        for (let key in weightMap) {
            running += weightMap[key]
            if (r <= running) {
                return key
            }
        }

        const keys = Object.keys(weightMap)
        return keys[keys.length - 1]
    }
}