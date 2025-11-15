
import { RectangleButton } from '../_Packages/SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
import {GestureHandler} from "./GestureHandler";
import {SpellMovement} from "./SpellMovement";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class UIHandler extends BaseScriptComponent {
    @input 
    public mainCam : Camera;
    @input
    public startButton: RectangleButton;

    @input
    public startText: Text;

    @input
    spellModel: SceneObject;

    @input
    gestureGPTScript: GestureHandler;

    @input
    public enemy: SceneObject;
    
  private mCamera = WorldCameraFinderProvider.getInstance();

    onAwake() {  

        this.enemy.enabled = false;

        // attach events
        this.startButton.onTriggerUp.add(() => {
            print('Start fully triggered!');

            this.enemy.enabled = true;
            
            let spell = this.gestureGPTScript.getSpellObject("Water", this.mCamera.getWorldPosition().sub(this.mCamera.forward().uniformScale(110)));
            spell.createComponent(SpellMovement.getTypeName());
            spell.getComponent(SpellMovement.getTypeName()).forwardVec =  this.mCamera.forward();

        });
  
    }

    startGame() {

    }



}
