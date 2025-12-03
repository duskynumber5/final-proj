class Drawing extends Phaser.Scene {
    constructor() {
        super('drawScene')
    }

    create() {
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        const canvasW = 600
        const canvasH = 600
        const canvasX = config.width / 2 - canvasW / 2
        const canvasY = config.height / 2 - canvasH / 2

        this.add.rectangle(canvasX, canvasY, canvasW, canvasH, 0xFFFFFF).setOrigin(0)

        this.rt = this.add.renderTexture(canvasX, canvasY, canvasW, canvasH).setOrigin(0)
        this.rt.clear()

        const g = this.add.graphics()
        g.fillStyle(0x000000, 1)
        g.fillCircle(4, 4, 4)
        g.generateTexture('brush', 8, 8)
        g.destroy()

        this.isDrawing = false

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.isDrawing = true
                this.drawAt(pointer.x, pointer.y)
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
            this.rt.saveTexture('playerLanternArt')

            this.scene.stop('drawScene')
            this.scene.resume('homeScene')
        }
    }
}
