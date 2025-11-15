import { GestureHandler } from "./GestureHandler";
import { SpellMovement } from "./SpellMovement";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";


@component
export class PinchExample extends BaseScriptComponent {
  private gestureModule: GestureModule = require('LensStudio:GestureModule');
  @input debugText: Text;
  @input
  mainCamera: Camera;
  // Reference to TSComponentA with proper typing
  @input
  gestureGPTScript: GestureHandler;

  @input
  spellModel: SceneObject;

  private mCamera = WorldCameraFinderProvider.getInstance();

  onAwake() {

    this.debugText.text = "im working"

    this.gestureModule
      .getPinchDownEvent(GestureModule.HandType.Left)
      .add((pinchDownArgs: PinchDownArgs) => {
        this.debugText.text = 'Left Hand Pinch Down'
        print('Left Hand Pinch Down');

        if (this.gestureGPTScript.IsDone()) {
          let spell = this.gestureGPTScript.getSpellObject("Water", this.mCamera.getWorldPosition().sub(this.mCamera.forward().uniformScale(110)));
          spell.createComponent(SpellMovement.getTypeName());
          spell.getComponent(SpellMovement.getTypeName()).forwardVec = this.mCamera.forward();
        }

      });


    this.gestureModule
      .getGrabBeginEvent(GestureModule.HandType.Left)
      .add((grabBeginArgs: GrabBeginArgs) => {
        this.debugText.text = 'Left Hand Grab  Begin'
        print('Left Hand Grab Begin');

        if (this.gestureGPTScript.IsDone()) {
          let spell = this.gestureGPTScript.getSpellObject("Fire", this.mCamera.getWorldPosition().sub(this.mCamera.forward().uniformScale(110)));
          spell.createComponent(SpellMovement.getTypeName());
          spell.getComponent(SpellMovement.getTypeName()).forwardVec = this.mCamera.forward();
        }
      });

  }
}