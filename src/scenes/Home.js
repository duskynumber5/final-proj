class Home extends Phaser.Scene {
    constructor() {
        super("homeScene")
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })
    }
    
    create() {
        this.physics.world.setBounds(-25, -25, 1525, 825)

        if (!game.sceneState) {
            game.sceneState = 'calm'
        }
        this.scenes()

        this.drawSky()
        this.drawLandscape1()
        this.drawLandscape2()
        this.genWater()

        // create lanterns
        game.maxLanterns = 200
        game.currentLanterns = 50
        this.lanterns = []
        this.genLanterns()

        this.sceneText = this.add.text(10, 10, '()')

        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        document.getElementById('info').innerHTML = 'S: Settings Menu -------- D: Drawing Menu'
    }

    update() {
        const pointer = this.input.activePointer

        this.sceneText.setText('( mood: ' + game.sceneState + ' )').setDepth(11)

        for (var i = 0; i < this.lanterns.length; i++ ) {
            const lantern = this.lanterns[i]
            if (lantern) lantern.update(pointer)
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.scene.pause('homeScene')
            this.scene.launch('settingsScene')
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyD)) {
            this.scene.pause('homeScene')
            this.scene.launch('drawScene')
        }

        if (game.landscapeUpdate == true) {
            this.landscapeGraphics1.destroy()
            this.landscapeGraphics2.destroy()
            this.drawLandscape1()
            this.drawLandscape2()
            this.regenWater()
            this.genLanterns()
        }

        if (game.lanternUpdate == true) {
            this.redrawSky()
            this.regenWater()
            this.genLanterns()

            this.skyGraphics.setDepth(0)
            this.landscapeGraphics1.setDepth(1)
            this.landscapeGraphics2.setDepth(2)
            this.lanterns.forEach(lantern => {
                lantern.setDepth(10)
            })
        }

        if (game.playerDrawingReady && this.textures.exists(game.lastDrawingKey)) {
            const rules = this.lanternGrammar[game.sceneState] || this.lanternGrammar.calm
            const x = Phaser.Math.Between(0, 1500)
            const y = Phaser.Math.Between(0, 800)
            
            const lantern = new Lantern(this, x, y)

            const type = this.chooseWeightedKey(rules.typeWeights)
            lantern.applySizeType(type)
            lantern.applyPalette(rules.palette)
            
            lantern.addDrawing(game.lastDrawingKey)
            
            this.lanterns.push(lantern)
            game.currentLanterns += 1
            lantern.setDepth(10)

            game.playerDrawingReady = false
        }
    }

    genWater() {
        const topY = 650
        const bottomY = 825
        const HEIGHT = bottomY - topY
        const tiles = []

        this.waterGraphics = this.add.graphics()

        for (let y = 0; y < HEIGHT; y++) {

            const worldY = topY + y
            const t = y / HEIGHT

            let rTop, gTop, bTop
            let rBot, gBot, bBot

            if (game.sceneState === 'calm') {
                rTop = 40;  gTop = 90;  bTop = 160
                rBot = 20;  gBot = 60;  bBot = 120
            } else if (game.sceneState === 'festival') {
                rTop = 180; gTop = 100; bTop = 80
                rBot = 100; gBot = 60;  bBot = 50
            } else {
                rTop = 80;  gTop = 110; bTop = 150
                rBot = 40;  gBot = 70;  bBot = 110
            }

            let r = Phaser.Math.Linear(rTop, rBot, t)
            let g = Phaser.Math.Linear(gTop, gBot, t)
            let b = Phaser.Math.Linear(bTop, bBot, t)

            const wave = Math.sin((worldY * 0.12)) * 8
            r = Phaser.Math.Clamp(r + wave, 0, 255)
            g = Phaser.Math.Clamp(g + wave, 0, 255)
            b = Phaser.Math.Clamp(b + wave, 0, 255)

            const color = Phaser.Display.Color.GetColor(r, g, b)
            this.waterGraphics.fillStyle(color, 0.95)
            this.waterGraphics.fillRect(-25, worldY, 1525, 1)
        }   
        const blue = Phaser.Display.Color.GetColor(51, 153, 255)
        this.add.rectangle(-25, 650, 1525, 170, blue).setAlpha(0.2).setOrigin(0,0)
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

        var color = Phaser.Display.Color.GetColor(34, 100, 34)
        this.landscapeGraphics1 = this.add.graphics()
        this.landscapeGraphics1.lineStyle(1, color, 1)
        
        // parameters
        var STEP_MAX = 2.5
        var STEP_CHANGE = 0.5
        var HEIGHT_MAX = 650

        // starting conditions
        var height = Phaser.Math.Between(0, HEIGHT_MAX)
        var slope = Phaser.Math.Between(-STEP_MAX, STEP_MAX)

        // creating the landscape
        for (var x = 0; x < config.width; x++) {
            // change height and slope
            height += slope
            slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE

            // clip height and slope to maximum
            slope = Phaser.Math.Clamp(slope, -STEP_MAX, STEP_MAX)
        
            if (height > HEIGHT_MAX || height < 0) {
                height = Phaser.Math.Clamp(height, 0, HEIGHT_MAX)
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

        var color = Phaser.Display.Color.GetColor(107, 142, 35)
        this.landscapeGraphics2 = this.add.graphics()
        this.landscapeGraphics2.lineStyle(1, color, 1)
        
        // parameters
        var STEP_MAX = 2
        var STEP_CHANGE = 0.5
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
            slope = Phaser.Math.Clamp(slope, -STEP_MAX, STEP_MAX)
        
            if (height > HEIGHT_MAX || height < 0) {
                height = Phaser.Math.Clamp(height, 0, HEIGHT_MAX)
                slope *= -1
            }
            
            // draw column
            this.landscapeGraphics2.beginPath()
            this.landscapeGraphics2.moveTo(x, HEIGHT_MAX)
            this.landscapeGraphics2.lineTo(x, height)
            this.landscapeGraphics2.strokePath()
        }
    }

    drawSky() {
        game.skyUpdate = false
        
        this.skyGraphics = this.add.graphics()
        var topColor = 0
        var bottomColor = 0
        
        if (game.sceneState == 'calm') {
            topColor = { r: 25,  g: 25,  b: 112 }
            bottomColor = { r: 135, g: 206, b: 250 }  
        } else if (game.sceneState == 'festival') {
            topColor = { r: 119,  g: 136,  b: 153 }
            bottomColor = { r: 105, g: 105, b: 105 }  
        } else {
            topColor = { r: 70,  g: 130,  b: 180 }
            bottomColor = { r: 0, g: 191, b: 255 }  
        }
        
        const HEIGHT_MAX = 650
        
        for (let y = 0; y < HEIGHT_MAX; y++) {
            
            const t = y / HEIGHT_MAX
            
            const r = Phaser.Math.Linear(topColor.r, bottomColor.r, t)
            const g = Phaser.Math.Linear(topColor.g, bottomColor.g, t)
            const b = Phaser.Math.Linear(topColor.b, bottomColor.b, t)
            
            const color = Phaser.Display.Color.GetColor(r, g, b)
            this.skyGraphics.fillStyle(color, 1)
            
            this.skyGraphics.fillRect(0, y, config.width, 1)
        }

        var color = Phaser.Display.Color.GetColor(0, 0, 128)
        this.add.rectangle(0, 0, config.width, config.height, color).setAlpha(0.3).setOrigin(0,0)
    }

    redrawSky() {
        if (this.skyGraphics) {
            this.skyGraphics.destroy()
        }
        this.drawSky()
        game.skyUpdate = false
    }

    scenes() {
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
            easter: {
                typeWeights: {
                    small: 0.8,
                    medium: 0.15,
                    large: 0.05
                },
                palette: 'mixed'
            }
        }
    }

    chooseWeightedKey(weights) {
        let total = 0
        for (let key in weights) {
            total += weights[key]
        }

        let r = Math.random() * total
        let parse = 0

        for (let key in weights) {
            parse += weights[key]
            if (r <= parse) {
                return key
            }
        }

        const keys = Object.keys(weights)
        return keys[keys.length - 1]
    }
}