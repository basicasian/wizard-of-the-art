import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import {Lerp} from "./Lerp";
import { SpellMovement } from "_Scripts/SpellMovement";
import { PlayerHealth } from "_Scripts/Player/PlayerHealth";

@component
export class EnemySpawner extends BaseScriptComponent {

    timer : number= 0.0;
    spawnInterval : number = 3.0;
    @input
    spawnParent : SceneObject;  
    @input
    enemyPrefab : ObjectPrefab;
    currentEnemy : SceneObject;
 
    @input 
    manAudio:AudioComponent

    private mCamera = WorldCameraFinderProvider.getInstance();
    onAwake() {
        print("EnemySpawner onAwake")
        this.spawnParent = this.getSceneObject();
        
    }

    startSpawning() {
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
        
        var pos = this.getRandomSpawnPosition(150)

        this.currentEnemy.getTransform().setWorldPosition(pos)
        // get rotation to make the enemy face the player
        // look dir
        let dir = this.getTransform().getWorldPosition().sub(this.currentEnemy.getTransform().getWorldPosition())
        // angle
        let rotation = quat.rotationFromTo(vec3.left(), dir)
        this.currentEnemy.getTransform().setWorldRotation(rotation)
        this.currentEnemy.getTransform().setWorldScale(vec3.one().uniformScale(2))
        this.currentEnemy.createComponent(Lerp.getTypeName())
        this.currentEnemy.getComponent(Lerp.getTypeName()).Init()
        
        // add collisions
        let body = this.currentEnemy.createComponent('Physics.BodyComponent')
        body.shape = Shape.createBoxShape();
        body.mass = 0
        body.onCollisionEnter.add(function (e)
        {
            var collision = e.collision;
            print(this.mCamera)
            print("OTHER COLLIDER NAME: " + collision.collider.sceneObject.name)
            if (collision.collider.sceneObject.name.includes("Player"))
            {
                // collide with player
                collision.collider.sceneObject.getComponent(PlayerHealth.getTypeName()).takeDamage()
                // make noise
                this.manAudio.play(1);

            }
            else if (e.collision.collider.sceneObject.name.includes("Spell"))
            {
                // collide with spells
                this.destroy()                
            }
        })
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
        return new vec3(x, y, z).add(this.mCamera.getTransform().getWorldPosition());
    }

}
