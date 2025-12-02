class Lantern extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 32, 42, Phaser.Display.Color.GetColor(246, Phaser.Math.Between(200, 225), Phaser.Math.Between(100, 160)))

        scene.add.existing(this)    // add object to scene
        scene.physics.add.existing(this)    // enable object physics

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

        // random pattern

    }

    applySizeType(type) {
        if (type === 'small') {
            this.width = 20
            this.height = 26
        } else if (type === 'medium') {
            this.width = 32
            this.height = 42
        } else if (type === 'large') {
            this.width = 46
            this.height = 60
        }

        // update physics body to match new rect size
        if (this.body) {
            this.body.setSize(this.width, this.height)
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
        this.setFillStyle(color, 1)   // change rect color
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