class Home extends Phaser.Scene {
    constructor() {
        super("homeScene")
    }

    create() {
        // create lanterns
        this.lanterns = []
        for (var i = 0; i < 10; i++) {
            this.lanterns.push(
                new Lantern(this, Phaser.Math.Between(0, 1200), Phaser.Math.Between(0, 800))
            )
        }

        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'})
    }

    update() {
        const pointer = this.input.activePointer

        this.label.setText('(' + pointer.x + ', ' + pointer.y + ')')

        for (var i = 0; i < this.lanterns.length; i++ ) {
            const lantern = this.lanterns[i]
            if (lantern) lantern.update(pointer)
        }
    }
}