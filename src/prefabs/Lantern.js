class Lantern extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)

        scene.add.existing(this)    // add object to scene
        scene.physics.add.existing(this)    // enable object physics

        const baseColor = Phaser.Display.Color.GetColor(
            246,
            Phaser.Math.Between(200, 225),
            Phaser.Math.Between(100, 160)
        )

        const glowColor = Phaser.Display.Color.GetColor(255, 215, 0)
        this.glowRect = scene.add.rectangle(0, 0, 32, 42, glowColor).setAlpha(0.4)
        this.glowRect.setOrigin(0.5)
        this.add(this.glowRect)

        this.bodyRect = scene.add.rectangle(0, 0, 32, 42, baseColor)
        this.bodyRect.setOrigin(0.5)
        this.add(this.bodyRect)

        this.body.setSize(32, 42)
        this.body.setOffset(-16, -21)

        // random movement
        this.randomX = Phaser.Math.Between(-1, 1)
        this.randomY = Phaser.Math.Between(-1, 1)
        this.body.setVelocity(10 * this.randomX, 10 * this.randomY)  

        // gravity
        this.body.setDrag(200, 200)
        this.body.setDamping(true)
        this.body.setCollideWorldBounds(true)
        this.body.setBounce(0.5)
        this.body.setMaxVelocity(16, 16)

        // pattern
        
    }

    applySizeType(type) {
        if (type === 'small') {
            this.width = 32
            this.height = 42
        } else if (type === 'medium') {
            this.width = 46
            this.height = 60
        } else if (type === 'large') {
            this.width = 64
            this.height = 80
        }

        if (this.body) {
            this.bodyRect.setSize(this.width, this.height)
            this.glowRect.setSize(this.width + 10, this.height + 10)
        }
    }

    applyPalette(palette) {
        let r, g, b

        if (palette === 'cool') {
            // bluish / purple
            r = Phaser.Math.Between(120, 170)
            g = Phaser.Math.Between(150, 210)
            b = Phaser.Math.Between(210, 255)
        } else if (palette === 'warm') {
            // orange / red
            r = Phaser.Math.Between(230, 255)
            g = Phaser.Math.Between(160, 210)
            b = Phaser.Math.Between(110, 160)
        } else {
            // mixed
            r = Phaser.Math.Between(180, 255)
            g = Phaser.Math.Between(140, 220)
            b = Phaser.Math.Between(160, 255)
        }

        const color = Phaser.Display.Color.GetColor(r, g, b)
        this.bodyRect.setFillStyle(color, 1)   // change rect color
    }

    addDrawing(drawing) {
        if (this.drawingSprite) {
            this.drawingSprite.destroy()
            this.drawingSprite = null
        }

        if (!this.scene.textures.exists(drawing)) return

        const img = this.scene.add.image(0, 0, drawing)
        img.setOrigin(0.5)

        const source = img.texture.getSourceImage()
        const bodyW = this.bodyRect.width
        const bodyH = this.bodyRect.height
        const sx = bodyW / source.width
        const sy = bodyH / source.height
        img.setScale(Math.min(sx, sy))

        this.add(img)
        this.drawingSprite = img
    }

    update(pointer) {
        // update movement w/ player mouse
        this.Xdistance = (this.body.x - pointer.x)
        this.Ydistance = (this.body.y - pointer.y)
        
        if (this.Xdistance <= 200 && this.Xdistance >= 0) {
            if (this.Ydistance <= 200 && this.Ydistance >= 0) {
                this.body.setVelocity(15,15)
            } else if (this.Ydistance <= 0 && this.Ydistance >= -200) {
                this.body.setVelocity(15,-15)
            } else {
                this.body.setVelocity(15,0)
            }
        } else if (this.Xdistance <= 0 && this.Xdistance >= -200) {
            if (this.Ydistance <= 0 && this.Ydistance >= -200) {
                this.body.setVelocity(-15,-15)
            } else if (this.Ydistance <= 200 && this.Ydistance >= 0) {
                this.body.setVelocity(-15,15)
            } else {
                this.body.setVelocity(-15,0)
            }
        }
    }
}