
import { RectangleButton } from '../_Packages/SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
import {GestureHandler} from "./GestureHandler";
import {SpellMovement} from "./SpellMovement";


@component
export class UIHandler extends BaseScriptComponent {

    @input
    public startButton: RectangleButton;

    @input
    public startText: Text;

    @input
    spellModel: SceneObject;

    @input
    gestureGPTScript: GestureHandler;


    onAwake() {  


        // attach events
        this.startButton.onTriggerUp.add(() => {
            print('Start fully triggered!');
            let spell = this.gestureGPTScript.getSpellObject("Water");
            //let obj = global.scene.createSceneObject("Name")
            //obj.getTransform
            spell.createComponent(SpellMovement.getTypeName());
        });
  
    }

    startGame() {

    }



}
