import { Injectable } from "@nestjs/common"
import { readFileSync } from "fs"
import { join } from "path"

interface SecretConfig {
  supabase: {
    url: string
    serviceRoleKey: string
  }
  server: {
    port: number
  }
}

@Injectable()
export class ConfigService {
  private config: SecretConfig

  constructor() {
    const secretPath = join(process.cwd(), "secret.json")
    const secretData = readFileSync(secretPath, "utf8")
    this.config = JSON.parse(secretData)
  }

  get supabaseUrl(): string {
    return this.config.supabase.url
  }

  get supabaseServiceRoleKey(): string {
    return this.config.supabase.serviceRoleKey
  }

  get port(): number {
    return this.config.server.port
  }
}
