// -----JS CODE-----
// @input SceneObject startPoint {"label":"Start Point"}
// @input SceneObject cameraObject {"label":"Camera"}
// @input float speedLevel = 5.0 {"label":"Movement Speed"}

var transform;
var isMoving = false;
var startPosition;
var endPosition;
var totalTimeForTravel;
var elapsedTime = 0.0;

/**
 * This function runs ONCE when the lens starts.
 * It sets up everything needed for the movement.
 */
function onStart() {
    var sceneObject = script.getSceneObject();
    transform = sceneObject.getTransform();
    
    // guard clauses. can prob remove?
    if (!script.startPoint) {
        print("MOVE SCRIPT ERROR: 'Start Point' is not assigned in the Inspector.");
        return;
    }
    if (!script.cameraObject) {
        print("MOVE SCRIPT ERROR: 'Camera' is not assigned in the Inspector.");
        return;
    }
    if (script.speedLevel <= 0) {
        print("MOVE SCRIPT ERROR: 'Movement Speed' must be greater than 0.");
        return;
    }

    startPosition = script.startPoint.getTransform().getWorldPosition();
    endPosition = script.cameraObject.getTransform().getWorldPosition();
    
    transform.setWorldPosition(startPosition);

    var totalDistance = startPosition.distance(endPosition);
    if (totalDistance > 0.001) {
        totalTimeForTravel = totalDistance / script.speedLevel;
        isMoving = true;
        print("Movement Initialized. Travel time: " + totalTimeForTravel.toFixed(2) + "s");
    } else {
        print("Movement Skipped: Start and End points are the same.");
    }
}

function onUpdate(eventData) {
    if (!isMoving) {
        return;
    }

    var deltaTime = eventData.getDeltaTime();
    elapsedTime += deltaTime;
    var progress = elapsedTime / totalTimeForTravel;
    
    if (progress >= 1.0) {
        progress = 1.0; // clamp to 1.0 to ensure we land exactly on the end position
        isMoving = false;
        print("Movement Complete.");
        var sceneObject = script.getSceneObject();
        sceneObject.destroy();
        return; // we dont want objects to linger on
    }

    var newPosition = vec3.lerp(startPosition, endPosition, progress);
    transform.setWorldPosition(newPosition);
}

var startEvent = script.createEvent("OnStartEvent");
startEvent.bind(onStart);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);