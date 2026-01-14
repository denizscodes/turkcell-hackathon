"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateRuleDialog({ open, onOpenChange, onSuccess }: CreateRuleDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventType: "call_ended",
    conditionField: "cost",
    conditionOperator: "greater_than",
    conditionValue: "",
    actionType: "SEND_NOTIFICATION",
    priority: "10",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const ruleData = {
      name: formData.name,
      description: formData.description,
      eventType: formData.eventType,
      conditions: [
        {
          field: formData.conditionField,
          operator: formData.conditionOperator,
          value: Number(formData.conditionValue) || formData.conditionValue,
        },
      ],
      actions: [
        {
          type: formData.actionType,
          parameters: {
            message: `Rule ${formData.name} triggered`,
          },
        },
      ],
      isActive: true,
      priority: Number(formData.priority),
    }

    try {
      await fetch("http://localhost:3002/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ruleData),
      })

      onSuccess()
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        eventType: "call_ended",
        conditionField: "cost",
        conditionOperator: "greater_than",
        conditionValue: "",
        actionType: "SEND_NOTIFICATION",
        priority: "10",
      })
    } catch (error) {
      console.error("[v0] Error creating rule:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Rule</DialogTitle>
          <DialogDescription>Define a new rule for event processing</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Select
              value={formData.eventType}
              onValueChange={(value) => setFormData({ ...formData, eventType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call_ended">call_ended</SelectItem>
                <SelectItem value="sms_sent">sms_sent</SelectItem>
                <SelectItem value="data_usage">data_usage</SelectItem>
                <SelectItem value="payment_received">payment_received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-3">Condition</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="conditionField">Field</Label>
                <Input
                  id="conditionField"
                  value={formData.conditionField}
                  onChange={(e) => setFormData({ ...formData, conditionField: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="conditionOperator">Operator</Label>
                <Select
                  value={formData.conditionOperator}
                  onValueChange={(value) => setFormData({ ...formData, conditionOperator: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">equals</SelectItem>
                    <SelectItem value="not_equals">not equals</SelectItem>
                    <SelectItem value="greater_than">greater than</SelectItem>
                    <SelectItem value="less_than">less than</SelectItem>
                    <SelectItem value="contains">contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="conditionValue">Value</Label>
                <Input
                  id="conditionValue"
                  value={formData.conditionValue}
                  onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-3">Action</h3>
            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <Select
                value={formData.actionType}
                onValueChange={(value) => setFormData({ ...formData, actionType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEND_NOTIFICATION">Send Notification</SelectItem>
                  <SelectItem value="CHANGE_STATE">Change State</SelectItem>
                  <SelectItem value="TRIGGER_WORKFLOW">Trigger Workflow</SelectItem>
                  <SelectItem value="LOG_EVENT">Log Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Rule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
