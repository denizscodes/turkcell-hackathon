"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_service_1 = require("../config/config.service");
const configService = new config_service_1.ConfigService();
exports.supabase = (0, supabase_js_1.createClient)(configService.supabaseUrl, configService.supabaseServiceRoleKey);
//# sourceMappingURL=supabase.js.map