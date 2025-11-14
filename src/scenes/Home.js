class Home extends Phaser.Scene {
    constructor() {
        super("homeScene")
    }

    create() {
        this.physics.world.setBounds(-25, -25, 1525, 825)
        this.genNoise()
        this.drawLandscape1()
        this.drawLandscape2()

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
            this.genLanterns()
        }
    }

    genNoise() {
        //noiseSeed(round(seedNoise))
        for (let x = -25; x < 1525; x += 10) {
            for (let y = -25; y < 825; y += 10) {
                //let n = noise(x * 0.01 + seedNoise, y * 0.01 + seedNoise)
                let n = Phaser.Math.Between(0, 255)
                var color = Phaser.Display.Color.GetColor(n, n, n)
                this.square = this.add.rectangle(x, y, 10, 10, color).setAlpha(0.5)
            }
        } 
    }

    genLanterns() {
        game.lanternUpdate = false 
        this.removeLanterns()
        this.lanterns = []
        for (var i = 0; i < game.currentLanterns; i++) {
            this.lanterns.push(
                new Lantern(this, Phaser.Math.Between(0, 1500), Phaser.Math.Between(0, 800))
            )
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
        var HEIGHT_MAX = config.height

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
        var HEIGHT_MAX = config.height

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
            this.landscapeGraphics2.beginPath()
            this.landscapeGraphics2.moveTo(x, HEIGHT_MAX)
            this.landscapeGraphics2.lineTo(x, height)
            this.landscapeGraphics2.strokePath()
        }
    }
}