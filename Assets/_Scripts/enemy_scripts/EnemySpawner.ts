import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import {Lerp} from "./Lerp";

@component
export class EnemySpawner extends BaseScriptComponent {

    timer : number= 0.0;
    spawnInterval : number = 3.0;
    @input
    spawnParent : SceneObject;  
    @input
    enemyPrefab : ObjectPrefab;
    currentEnemy : SceneObject;

    private mCamera = WorldCameraFinderProvider.getInstance();
    onAwake() {
        this.spawnParent = this.getSceneObject();
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    onUpdate()
    {
        if (!this.enemyPrefab || this.spawnInterval <= 0) {
            return;
        }

        var deltaTime = getDeltaTime();
        this.timer += deltaTime;

        if (this.timer >= this.spawnInterval) {
            print("spawn!")
            this.spawnNewInstance();
            this.timer -= this.spawnInterval;
        }
    }  

    private spawnNewInstance() 
    {   

        this.currentEnemy = this.enemyPrefab.instantiate(this.spawnParent);
        this.currentEnemy.enabled = true
        
        var pos = this.getRandomSpawnPosition(100)

        this.currentEnemy.getTransform().setWorldPosition(pos)
        /*
        if (this.currentEnemy.getComponent(Lerp.getTypeName()) != null )
        {
            //this.currentEnemy.getComponent(Lerp.getTypeName()).init(this.getRandomSpawnPosition(2.5)) // TODOO: need pass position
            print("New instance spawned from prefab!");
        }*/
    }

    private getRandomSpawnPosition(radius: number): vec3
    {
        var angle = Math.random() * 2 * Math.PI;
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);
        var y = 0// Assuming ground level spawn
        print("enemy position is " + new vec3(x, y, z) )
        return new vec3(x, y, z ).add(this.mCamera.getTransform().getWorldPosition());
    }

}
