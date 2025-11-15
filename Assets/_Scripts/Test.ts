@component
export class Test extends BaseScriptComponent {
    @input
    @widget(new TextAreaWidget())
    prompt: string = "A cute dog wearing a hat";

    @input
    private refineMesh: boolean = true;

    @input
    private useVertexColor: boolean = false;

    @input
    hintText: Text;
    onAwake() {

    }
}
