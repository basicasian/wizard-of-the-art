// -----JS CODE-----
// @input Asset.ObjectPrefab prefabToSpawn {"label":"Prefab to Spawn"}
// @input float spawnInterval = 2.0 {"label":"Spawn Every (Seconds)"}

// This timer will count up from 0 to the spawnInterval
var timer = 0.0;

// A reference to the object that will act as the parent for new instances
var spawnParent;

/**
 * This function runs once when the script starts up.
 */
function onStart() {
    spawnParent = script.getSceneObject();

    // --- Safety Checks ---
    if (!script.prefabToSpawn) {
        print("Spawner ERROR: 'Prefab to Spawn' is not set. Please drag a prefab from the Resources panel into the script's input.");
        return;
    }
    if (script.spawnInterval <= 0) {
        print("Spawner ERROR: Spawn Interval must be a positive number greater than 0.");
    }
}

/**
 * This function runs on every frame. It handles the timer logic.
 */
function onUpdate(eventData) {
    // If the inputs are invalid, do nothing.
    if (!script.prefabToSpawn || script.spawnInterval <= 0) {
        return;
    }

    // Add the time since the last frame to our timer.
    var deltaTime = eventData.getDeltaTime();
    timer += deltaTime;

    // Check if the timer has reached the spawn interval.
    if (timer >= script.spawnInterval) {
        spawnNewInstance();
        timer -= script.spawnInterval;
    }
}

/**
 * This function handles the creation of the new object from the prefab.
 */
function spawnNewInstance() {
    var newInstance = script.prefabToSpawn.instantiate(spawnParent);
    print("New instance spawned from prefab!");
}


var startEvent = script.createEvent("OnStartEvent");
startEvent.bind(onStart);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);