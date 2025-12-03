class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    update() {
        this.scene.start('homeScene')
    }
}