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