# Turkcell Decision Engine - Backend Microservices

## Architecture

Bu proje 3 bağımsız mikroservisten oluşur:

### 1. Event Service (Port 3001)
- Event'leri alır ve işler
- Supabase PostgreSQL'e kaydeder
- Rule Engine'e gönderir
- Event geçmişini yönetir

### 2. Rule Engine Service (Port 3002)
- Kuralları tanımlar ve yönetir
- Event'leri değerlendirir
- Eşleşen kuralları bulur
- Aksiyon listesi döner

### 3. User State Service (Port 3003)
- Kullanıcı durumlarını takip eder
- State geçmişini tutar
- State transition'ları yönetir

## Database Setup

Tüm servisler Supabase PostgreSQL'i paylaşır. Database tablolarını oluşturmak için:

```bash
# SQL scriptleri çalıştır (v0 otomatik çalıştırabilir)
# scripts/001_create_tables.sql
# scripts/002_seed_sample_rules.sql
```

## Configuration

Her servis için `secret.json` dosyası oluşturun. `.example` dosyalarını kopyalayıp kullanabilirsiniz:

### Event Service
```bash
cd backend/event-service
cp secret.json.example secret.json
# secret.json dosyasını Supabase bilgilerinizle düzenleyin
```

**secret.json örneği:**
```json
{
  "supabase": {
    "url": "your-supabase-url",
    "serviceRoleKey": "your-service-role-key"
  },
  "services": {
    "ruleEngineUrl": "http://localhost:3002",
    "userStateUrl": "http://localhost:3003"
  },
  "server": {
    "port": 3001
  }
}
```

### Rule Engine Service
```bash
cd backend/rule-engine-service
cp secret.json.example secret.json
```

### User State Service
```bash
cd backend/user-state-service
cp secret.json.example secret.json
```

**Not:** `secret.json` dosyaları `.gitignore`'a eklenmiştir ve Git'e commit edilmez.

## Installation & Run

### Tüm servisleri başlat:

```bash
# Event Service
cd backend/event-service
npm install
npm run start:dev

# Rule Engine Service (yeni terminal)
cd backend/rule-engine-service
npm install
npm run start:dev

# User State Service (yeni terminal)
cd backend/user-state-service
npm install
npm run start:dev
```

## API Endpoints

### Event Service (3001)
- `POST /api/events` - Yeni event oluştur
- `GET /api/events` - Tüm event'leri listele
- `GET /api/events/stats` - Event istatistikleri
- `GET /api/events/:id` - Tekil event
- `GET /api/events/user/:userId` - Kullanıcıya ait event'ler

### Rule Engine Service (3002)
- `POST /api/rules` - Yeni kural oluştur
- `GET /api/rules` - Tüm kuralları listele
- `GET /api/rules/stats` - Kural istatistikleri
- `GET /api/rules/:id` - Tekil kural
- `PUT /api/rules/:id` - Kural güncelle
- `DELETE /api/rules/:id` - Kural sil
- `POST /api/rules/evaluate` - Event değerlendir

### User State Service (3003)
- `GET /api/user-state` - Tüm kullanıcı durumları
- `GET /api/user-state/stats` - Durum istatistikleri
- `GET /api/user-state/:userId` - Kullanıcı durumu
- `POST /api/user-state/update` - Durum güncelle

## Test Data

### Create Event:
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "eventType": "PURCHASE_COMPLETED",
    "metadata": {
      "amount": 1500,
      "product": "Premium Package"
    }
  }'
```

### Create Rule:
```bash
curl -X POST http://localhost:3002/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Value Customer Upgrade",
    "eventType": "PURCHASE_COMPLETED",
    "conditions": {
      "amount": {"$gte": 1000}
    },
    "actions": [
      {
        "type": "UPDATE_USER_STATE",
        "params": {"tier": "GOLD"}
      },
      {
        "type": "SEND_NOTIFICATION",
        "params": {"message": "Congratulations! You are now a GOLD member"}
      }
    ],
    "isActive": true,
    "priority": 10
  }'
```

## Technology Stack

- **Framework**: NestJS 10.3
- **Database**: Supabase PostgreSQL
- **Language**: TypeScript
- **Configuration**: secret.json (JSON-based config)
- **Communication**: REST API + Event Bus pattern
- **Architecture**: Microservices
```

```text file=".gitignore"
# ... existing code ...

# Secrets
**/secret.json
!**/secret.json.example
