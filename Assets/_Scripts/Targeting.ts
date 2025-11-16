import { GestureHandler } from "./GestureHandler";
import { SpellMovement } from "./SpellMovement";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";


@component
export class Targeting extends BaseScriptComponent {
  private gestureModule: GestureModule = require('LensStudio:GestureModule');
  @input debugText: Text;
  // Reference to TSComponentA with proper typing
  @input
  gestureGPTScript: GestureHandler;

  @input
  spellModel: SceneObject;

  @input 
  fireAudio:AudioComponent

  @input 
  waterAudio:AudioComponent

  private mCamera = WorldCameraFinderProvider.getInstance();

  onAwake() {
    print("Targeting onAwake")
    this.debugText.text = "im working"

    this.gestureModule
      .getPinchDownEvent(GestureModule.HandType.Left)
      .add((pinchDownArgs: PinchDownArgs) => {
        this.debugText.text = 'Left Hand Pinch Down'
        print('Left Hand Pinch Down');

        if (this.gestureGPTScript.IsDone() ) {

          let spell = this.gestureGPTScript.getSpellObject("Water", this.mCamera.getWorldPosition().sub(this.mCamera.forward().uniformScale(110)));
          spell.createComponent(SpellMovement.getTypeName());
          spell.getComponent(SpellMovement.getTypeName()).forwardVec = this.mCamera.forward();
          this.waterAudio.play(1);

        }
      });

    this.gestureModule
      .getGrabBeginEvent(GestureModule.HandType.Right)
      .add((grabBeginArgs: GrabBeginArgs) => {
        print('Right Hand Grab Begin');

        if (this.gestureGPTScript.IsDone()) {
          let spell = this.gestureGPTScript.getSpellObject("Water", this.mCamera.getWorldPosition().sub(this.mCamera.forward().uniformScale(110)));
          spell.createComponent(SpellMovement.getTypeName());
          spell.getComponent(SpellMovement.getTypeName()).forwardVec = this.mCamera.forward();
           this.fireAudio.play(1);
        }
      });



  }
}