# Turkcell Decision Engine

Gerçek zamanlı event işleme ve kural motoru sistemi. Mikroservis mimarisi ile NestJS, MongoDB ve Next.js kullanılarak geliştirilmiştir.

## Proje Yapısı

```
.
├── backend/
│   ├── event-service/         # Event Processing Microservice (Port 3001)
│   ├── rule-engine-service/   # Rule Engine Microservice (Port 3002)
│   └── user-state-service/    # User State Microservice (Port 3003)
└── frontend/                  # Next.js Dashboard (Port 3000)
```

## Teknolojiler

### Backend
- Node.js + NestJS
- MongoDB + Mongoose
- Mikroservis Architecture
- REST API + Event Bus

### Frontend
- Next.js 16
- Tailwind CSS v4
- Real-time Updates
- shadcn/ui Components

## Hızlı Başlangıç

### 1. MongoDB Başlat

```bash
docker run -d -p 27017:27017 --name turkcell-mongo mongo:latest
```

### 2. Backend Servisleri Başlat

```bash
# Event Service
cd backend/event-service
npm install
npm run start:dev

# Rule Engine Service
cd backend/rule-engine-service
npm install
npm run start:dev

# User State Service
cd backend/user-state-service
npm install
npm run start:dev
```

### 3. Frontend Başlat

```bash
cd frontend
npm install
npm run dev
```

Dashboard: http://localhost:3000

## Environment Variables

Her servis için `.env` dosyası oluşturun:

```env
MONGODB_URI=mongodb://localhost:27017/turkcell-decision-engine
```

Detaylı kurulum için `backend/README.md` dosyasına bakın.

## Mikroservis İletişimi

```
Event Service (3001)
    ↓ REST API
Rule Engine Service (3002)
    ↓ REST API
User State Service (3003)
```

1. Event Service event'i alır
2. Rule Engine'e gönderir ve kuralları değerlendirir
3. Eşleşen kurallar için User State güncellenir
4. Dashboard real-time olarak güncellenir

## Özellikler

- Real-time event stream
- Rule management UI
- Analytics & charts
- User state tracking
- Event history
- Rule execution statistics
