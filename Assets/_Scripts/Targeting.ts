import {GestureHandler} from "./GestureHandler";

@component
export class PinchExample extends BaseScriptComponent {
  private gestureModule: GestureModule = require('LensStudio:GestureModule');
  @input debugText: Text;


  // Reference to TSComponentA with proper typing
  @input
  refScript: GestureHandler;

  onAwake() {

    this.debugText.text = "im working"

    this.gestureModule
      .getPinchDownEvent(GestureModule.HandType.Right)
      .add((pinchDownArgs: PinchDownArgs) => {
        this.debugText.text = 'Right Hand Pinch Down'
        print('Right Hand Pinch Down');



      });

    this.gestureModule
      .getGrabBeginEvent(GestureModule.HandType.Right)
      .add((grabBeginArgs: GrabBeginArgs) => {
        this.debugText.text = 'Right Hand Grab  Begin '
        print('Right Hand Grab Begin');
      });

    this.gestureModule
      .getIsPhoneInHandBeginEvent(GestureModule.HandType.Right)
      .add((grabBeginArgs: GrabBeginArgs) => {
        this.debugText.text = 'Phone in Hand '
        print('Right hand started to hold a phone.');
      });


  }
}