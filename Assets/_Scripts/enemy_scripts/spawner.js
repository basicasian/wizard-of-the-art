// -----JS CODE-----
// @input Asset.ObjectPrefab prefabToSpawn {"label":"Prefab to Spawn"}
// @input float spawnInterval = 2.0 {"label":"Spawn Every (Seconds)"}

var timer = 0.0;
var spawnParent;

function onStart() {
    spawnParent = script.getSceneObject();

    if (!script.prefabToSpawn) {
        print("Spawner ERROR: 'Prefab to Spawn' is not set. Please drag a prefab from the Resources panel into the script's input.");
        return;
    }
    if (script.spawnInterval <= 0) {
        print("Spawner ERROR: Spawn Interval must be a positive number greater than 0.");
    }
}

function onUpdate(eventData) {
    if (!script.prefabToSpawn || script.spawnInterval <= 0) {
        return;
    }

    var deltaTime = eventData.getDeltaTime();
    timer += deltaTime;

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