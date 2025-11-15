import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class Lerp extends BaseScriptComponent {

    @input 
    speedLevel : number = 5.0

     transform
     isMoving: boolean = false
     startPosition: vec3
     endPosition: vec3
     totalTimeForTravel
     elapsedTime = 0.0
    
    private mCamera = WorldCameraFinderProvider.getInstance();

onAwake() {

}

public init(startPoint: vec3) {
    this.startPosition = startPoint;
}

onStart() {
    var sceneObject = this.getSceneObject();
    this.transform = sceneObject.getTransform();

    if (this.speedLevel <= 0) {
        print("MOVE SCRIPT ERROR: 'Movement Speed' must be greater than 0.");
        return;
    }

    //startPosition = script.startPoint.getTransform().getWorldPosition();
    this.endPosition = this.mCamera.getTransform().getWorldPosition();

    this.transform.setWorldPosition(this.startPosition);

    var totalDistance = this.startPosition.distance(this.endPosition);
    if (totalDistance > 0.001) {
        this.totalTimeForTravel = totalDistance / this.speedLevel;
        this.isMoving = true;
        print("Movement Initialized. Travel time: " + this.totalTimeForTravel.toFixed(2) + "s");
    } else {
        print("Movement Skipped: Start and End points are the same.");
    }

}

onUpdate() {
    if (!this.isMoving) {
        return;
    }

    var deltaTime = getDeltaTime();
    this.elapsedTime += deltaTime;
    var progress = this.elapsedTime / this.totalTimeForTravel;

    if (progress >= 1.0) {
        progress = 1.0; // clamp to 1.0 to ensure we land exactly on the end position
        this.isMoving = false;
        print("Movement Complete.");
        var sceneObject = this.getSceneObject();
        sceneObject.destroy();
        return; // we dont want objects to linger on
    }

    var newPosition = vec3.lerp(this.startPosition, this.endPosition, progress);
    this.transform.setWorldPosition(newPosition);

}
}
