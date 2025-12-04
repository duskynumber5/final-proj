class Drawing extends Phaser.Scene {
    constructor() {
        super('drawScene')
    }

    create() {
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        const canvasW = 32 * 12.5
        const canvasH = 42 * 12.5
        const canvasX = config.width / 2 - canvasW / 2
        const canvasY = config.height / 2 - canvasH / 2
        
        this.add.rectangle(250, canvasY - 75, config.width - 500, canvasH + 150, 0xF5F5DC).setOrigin(0)
        this.add.rectangle(canvasX, canvasY, canvasW, canvasH, 0xBDB76B).setOrigin(0)

        
        this.add.text(260, canvasY - 50, "Customize a lantern!", { fontSize: '32px', fill: '#000' })
        this.add.text(260, canvasY + canvasH + 25, "Press D to save your drawing", { fontSize: '32px', fill: '#000' })

        var B1color = Phaser.Display.Color.GetColor(0, 0, 0)
        this.B1 = this.add.rectangle(canvasX + canvasW + 70, 290, 150, 40, B1color).setOrigin(0).setInteractive()
        this.B1.on('pointerdown', () => {
            this.rt.clear()
        })

        this.add.text(canvasX + canvasW + 80, 300, `clear canvas`, {
            fontSize: '18px',
            color: '#FFFFFF'
        })

        this.rt = this.add.renderTexture(canvasX, canvasY, canvasW, canvasH).setOrigin(0)
        this.rt.clear()

        const pen = this.add.graphics()
        pen.fillStyle(0xffffff, 0.8)
        pen.fillCircle(8, 8, 8)
        pen.generateTexture('brush', 16, 16)
        pen.destroy()

        this.isDrawing = false
        this.drawingPresent = false

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.isDrawing = true
                this.drawAt(pointer.x, pointer.y)
                this.drawingPresent = true
            }
        })

        this.input.on('pointermove', (pointer) => {
            if (!this.isDrawing) return
            this.drawAt(pointer.x, pointer.y)
        })

        this.input.on('pointerup', () => {
            this.isDrawing = false
        })
    }

    drawAt(worldX, worldY) {
        if (
            worldX >= this.rt.x && worldX <= this.rt.x + this.rt.width &&
            worldY >= this.rt.y && worldY <= this.rt.y + this.rt.height
        ) {
            const localX = worldX - this.rt.x
            const localY = worldY - this.rt.y
            this.rt.draw('brush', localX, localY)
        }
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyD)) {
            
            if (this.drawingPresent) {
                let i = 0
                let key = ''

                do {
                    key = `playerLanternArt_${i}`
                    i++
                } while (this.textures.exists(key))

                this.rt.saveTexture(key)

                game.playerDrawingReady = true
                game.lastDrawingKey = key
            } else {
                game.playerDrawingReady = false
            }

            this.drawingPresent = false

            this.scene.stop('drawScene')
            this.scene.resume('homeScene')
        }
    }
}
