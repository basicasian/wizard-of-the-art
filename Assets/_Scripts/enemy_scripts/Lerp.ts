import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class Lerp extends BaseScriptComponent {

    @input 
    speedLevel : number = 5.0

     transform : Transform
     isMoving: boolean = true
     startPosition: vec3
     endPosition: vec3
     totalTimeForTravel : number
     elapsedTime : number = 0.0 
     lifetime:number = 15.0
    private mCamera = WorldCameraFinderProvider.getInstance();

public Init() {
    this.transform = this.getTransform();
    this.mCamera = WorldCameraFinderProvider.getInstance();
    if (this.speedLevel <= 0) {
        print("MOVE SCRIPT ERROR: 'Movement Speed' must be greater than 0.");
        return;
    }

    //startPosition = script.startPoint.getTransform().getWorldPosition();
    print(this.mCamera)
    this.endPosition = this.mCamera.getTransform().getWorldPosition();

    //this.transform.setWorldPosition(this.startPosition);

    var totalDistance = this.getTransform().getWorldPosition().distance(this.endPosition);
    if (totalDistance > 0.001) {
        this.totalTimeForTravel = totalDistance / this.speedLevel;
        this.isMoving = true;
        print("Movement Initialized. Travel time: " + this.totalTimeForTravel.toFixed(2) + "s");
    } else {
        print("Movement Skipped: Start and End points are the same.");
    }

    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
}

public init(startPoint: vec3) {
    this.startPosition = startPoint;
}


onUpdate() {
    var deltaTime = getDeltaTime();
    this.lifetime -= deltaTime;
    if (this.lifetime <=0)
        this.sceneObject.destroy()
    
    let targetPos = this.mCamera.getWorldPosition();
    if(this.getTransform()== null)
        return;
    let direction = targetPos.sub(this.getTransform().getWorldPosition()).normalize()
    if(direction.lengthSquared <= 0.1)
        return;
    
    this.getTransform().setWorldPosition(this.getTransform().getWorldPosition().add(direction.uniformScale(this.speedLevel * deltaTime)));
    // if (!this.isMoving) {
    //     return;
    // }


    // this.elapsedTime += deltaTime;
    // var progress = this.elapsedTime / this.totalTimeForTravel;

    // if (progress >= 1.0) {
    //     progress = 1.0; // clamp to 1.0 to ensure we land exactly on the end position
    //     this.isMoving = false;
    //     print("Movement Complete.");
    //     this.destroy();
    //     return; // we dont want objects to linger on
    // }

    // var newPosition = vec3.lerp(this.transform.getWorldPosition(), this.endPosition, progress);
    // this.transform.setWorldPosition(newPosition);

}
}
