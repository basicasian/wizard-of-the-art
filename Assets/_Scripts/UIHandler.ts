
import { RectangleButton } from '../_Packages/SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
import { GestureHandler } from "./GestureHandler";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { EnemySpawner } from "./enemy_scripts/EnemySpawner";
import { PlayerHealth } from "./Player/PlayerHealth";

@component
export class UIHandler extends BaseScriptComponent {
    @input
    public mainCam: Camera;

    @input
    public startButton: RectangleButton;

    @input
    public startText: Text;

    @input
    public infoText: Text;

    @input
    spellModel: SceneObject;

    @input
    gestureGPTScript: GestureHandler;

    @input
    public enemySpawner: EnemySpawner;

    @input
    public playerHealth: PlayerHealth;

    private mCamera = WorldCameraFinderProvider.getInstance();

    onAwake() {

        // attach events
        this.startButton.onTriggerUp.add(() => {
            print('Start fully triggered!');

            //let spell = this.gestureGPTScript.getSpellObject("Water", this.mCamera.getWorldPosition().sub(this.mCamera.forward().uniformScale(110)));
            //spell.createComponent(SpellMovement.getTypeName());
            //spell.getComponent(SpellMovement.getTypeName()).forwardVec =  this.mCamera.forward();

            
            this.playerHealth.revive()
            this.enemySpawner.startSpawning();

            
            this.infoText.text = "Good Luck!"
            this.startButton.enabled = false
            this.startText.enabled = false
        });

        /*
        this.restartButton.onTriggerUp.add(() => {
            print('Start fully triggered!');
            this.playerHealth.revive()
        });*/

    }



}
