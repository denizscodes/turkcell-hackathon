import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { RuleService } from "./rule.service";

// Frontend "api/rules" beklediği için burayı güncelledik
@Controller("rules")
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  // 1. İstatistikler (DİKKAT: :id rotasından üstte olmalı!)
  @Get("stats")
  async getStats() {
    return this.ruleService.getStats();
  }

  // 2. Tüm Kuralları Listele
  @Get()
  async findAll() {
    return this.ruleService.findAll();
  }

  // 3. Yeni Kural Oluştur
  @Post()
  async create(@Body() createRuleDto: any) {
    return this.ruleService.create(createRuleDto);
  }

  // 4. Tek bir kural getir
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.ruleService.findById(id);
  }

  // 5. Kural Güncelle
  @Put(":id")
  async update(@Param("id") id: string, @Body() updateRuleDto: any) {
    return this.ruleService.update(id, updateRuleDto);
  }

  // 6. Kural Sil
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.ruleService.delete(id);
  }
}
