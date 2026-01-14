-- Insert sample rules for the Decision Engine
INSERT INTO rules (name, event_type, conditions, actions, priority, is_active) VALUES
(
  'High Value Customer Upgrade',
  'PURCHASE_COMPLETED',
  '{"amount": {"$gte": 1000}}',
  '[{"type": "UPDATE_USER_STATE", "params": {"tier": "GOLD"}}, {"type": "SEND_NOTIFICATION", "params": {"message": "Congratulations! You are now a GOLD member"}}]',
  10,
  true
),
(
  'Frequent Buyer Discount',
  'PURCHASE_COMPLETED',
  '{"purchaseCount": {"$gte": 5}}',
  '[{"type": "APPLY_DISCOUNT", "params": {"discount": 15}}, {"type": "UPDATE_USER_STATE", "params": {"hasDiscount": true}}]',
  5,
  true
),
(
  'Cart Abandonment Reminder',
  'CART_ABANDONED',
  '{"cartValue": {"$gte": 50}}',
  '[{"type": "SEND_EMAIL", "params": {"template": "cart_reminder"}}, {"type": "SCHEDULE_NOTIFICATION", "params": {"delay": 3600}}]',
  3,
  true
),
(
  'New User Welcome',
  'USER_REGISTERED',
  '{}',
  '[{"type": "SEND_WELCOME_EMAIL"}, {"type": "UPDATE_USER_STATE", "params": {"isNewUser": true, "registrationDate": "{{timestamp}}"}}]',
  8,
  true
);
