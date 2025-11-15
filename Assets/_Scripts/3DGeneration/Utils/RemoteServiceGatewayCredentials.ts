export enum AvaliableApiTypes {
  Snap = "Snap",
  OpenAI = "OpenAI",
  Google = "Google",
}

@component
export class RemoteServiceGatewayCredentials extends BaseScriptComponent {
  @input
  @label("OpenAI Token")
  openAIToken: string = "12b02f05-4d81-4dcb-acd9-e2fc3be7ae26";
  @input
  @label("Google Token")
  googleToken: string = "b82d7645-73c6-43d4-9f3f-c79ee6596f67";
  @input
  @label("Snap Token")
  snapToken: string = "f03f2406-c0c5-4b67-b8a1-c5b20e458bc9";

  @ui.label(
    '<span style="color: red;">⚠️ Do not include your API token when sharing or uploading this project to version control.</span>'
  )
  @ui.label(
    'For setup instructions, please visit: <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/remoteservice-gateway#setup-instructions" target="_blank">Remote Service Gateway Setup</a>'
  )
  private static snapToken: string = "f03f2406-c0c5-4b67-b8a1-c5b20e458bc9";
  private static googleToken: string = "b82d7645-73c6-43d4-9f3f-c79ee6596f67";
  private static openAIToken: string = "f03f2406-c0c5-4b67-b8a1-c5b20e458bc9";

  onAwake() {
    RemoteServiceGatewayCredentials.snapToken = this.snapToken;
    RemoteServiceGatewayCredentials.googleToken = this.googleToken;
    RemoteServiceGatewayCredentials.openAIToken = this.openAIToken;
  }

  static getApiToken(avaliableType: AvaliableApiTypes) {
    switch (avaliableType) {
      case AvaliableApiTypes.Snap:
        return RemoteServiceGatewayCredentials.snapToken;
      case AvaliableApiTypes.Google:
        return RemoteServiceGatewayCredentials.googleToken;
      case AvaliableApiTypes.OpenAI:
        return RemoteServiceGatewayCredentials.openAIToken;
      default:
        return "";
    }
  }

  static setApiToken(avaliableType: AvaliableApiTypes, token: string) {
    switch (avaliableType) {
      case AvaliableApiTypes.Snap:
        RemoteServiceGatewayCredentials.snapToken = token;
        break;
    }
  }
}
