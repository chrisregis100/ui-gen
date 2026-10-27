export interface GeneratedComponent {
  name: string
  description: string
  code: string
}

export interface Provider {
  readonly id: string
  readonly model: string
  generateComponent(request: {
    system: string
    user: string
    model?: string
  }): Promise<GeneratedComponent>
}
