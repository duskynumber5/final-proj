class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {

    }

    update() {
        this.scene.start('homeScene')
    }
}