@component
export class SpellMovement extends BaseScriptComponent {
    public forwardVec:vec3 = vec3.forward();
    private lifespan: number = 10;
    private movespeed: number = 300;

    onAwake(){
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }


    onUpdate()
    {

        
        this.lifespan -= getDeltaTime();
        if (this.lifespan <= 0)
        {
            this.sceneObject.destroy();
            return
        }
        if (this.getTransform() == null)
            return;
       var transform = this.getTransform();

       var pos = transform.getWorldPosition();

       let movement = this.forwardVec.uniformScale( this.movespeed * getDeltaTime());
       pos = pos.sub(movement);
       transform.setWorldPosition(pos);
    }
}
