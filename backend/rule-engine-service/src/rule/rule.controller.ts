import { Controller, Get, Post, Put, Delete, Param } from "@nestjs/common"
import type { RuleService } from "./rule.service"

@Controller("rules")
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  create(createRuleDto: any) {
    return this.ruleService.create(createRuleDto)
  }

  @Get()
  findAll() {
    return this.ruleService.findAll()
  }

  @Get("stats")
  getStats() {
    return this.ruleService.getStats()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findById(id);
  }

  @Put(":id")
  update(@Param('id') id: string, updateRuleDto: any) {
    return this.ruleService.update(id, updateRuleDto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ruleService.delete(id);
  }

  @Post("evaluate")
  evaluateEvent(eventData: any) {
    return this.ruleService.evaluateEvent(eventData)
  }
}
