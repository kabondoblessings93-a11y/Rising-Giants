export class AiProvider {
  async generateReply(_messages) {
    throw new Error("generateReply must be implemented by a provider.");
  }
}
