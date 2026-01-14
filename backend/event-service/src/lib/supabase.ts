import { createClient } from "@supabase/supabase-js"
import { ConfigService } from "../config/config.service"

const configService = new ConfigService()

export const supabase = createClient(configService.supabaseUrl, configService.supabaseServiceRoleKey)
