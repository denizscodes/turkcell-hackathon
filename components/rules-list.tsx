"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2, Trash2, Edit } from "lucide-react";
import { CreateRuleDialog } from "@/components/create-rule-dialog";

interface Rule {
  _id: string;
  name: string;
  description: string;
  eventType: string;
  isActive: boolean;
  priority: number;
  executionCount: number;
  conditions: any[];
  actions: any[];
}

export function RulesList() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      const response = await fetch("http://localhost:3002/api/rules");
      const data = await response.json();

      if (Array.isArray(data)) {
        // Backend'den gelen snake_case veriyi frontend camelCase formatına çeviriyoruz
        const formattedRules = data.map((rule: any) => ({
          _id: rule.id || rule._id,
          name: rule.name,
          description: rule.description || "",
          eventType: rule.event_type || rule.eventType,
          isActive: rule.is_active ?? rule.isActive,
          priority: rule.priority || 0,
          executionCount: rule.execution_count || 0,
          conditions: Array.isArray(rule.conditions) ? rule.conditions : [],
          actions: Array.isArray(rule.actions) ? rule.actions : [],
        }));
        setRules(formattedRules);
      } else {
        console.error("Gelen veri dizi değil:", data);
        setRules([]);
      }
    } catch (error) {
      console.error("[v0] Error fetching rules:", error);
      setRules([]);
    }
  }

  async function deleteRule(id: string) {
    if (!confirm("Bu kuralı silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`http://localhost:3002/api/rules/${id}`, {
        method: "DELETE",
      });
      fetchRules();
    } catch (error) {
      console.error("[v0] Error deleting rule:", error);
    }
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Rule Management
            </CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!Array.isArray(rules) || rules.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Settings2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  No rules configured yet. Create your first rule to get
                  started.
                </p>
              </div>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule._id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        {rule.isActive ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRule(rule._id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Event Type:</span>
                      <Badge
                        variant="outline"
                        className="ml-2 font-mono text-xs"
                      >
                        {rule.eventType}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="ml-2 font-semibold">
                        {rule.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executions:</span>
                      <span className="ml-2 font-semibold">
                        {rule.executionCount}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Conditions ({rule.conditions?.length || 0}):
                      </p>
                      <div className="space-y-1">
                        {rule.conditions
                          ?.slice(0, 2)
                          .map((cond: any, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs font-mono bg-background px-2 py-1 rounded border"
                            >
                              {cond.field} {cond.operator}{" "}
                              {JSON.stringify(cond.value)}
                            </div>
                          ))}
                        {rule.conditions?.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{rule.conditions.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Actions ({rule.actions?.length || 0}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions?.map((action: any, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-[10px] uppercase"
                          >
                            {action.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <CreateRuleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchRules}
      />
    </>
  );
}
