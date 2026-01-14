// rule.controller.ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { RuleService } from "./rule.service";

@Controller("rules")
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Get()
  findAll() {
    return this.ruleService.findAll();
  }
}
