// event.service.ts
import { Injectable } from "@nestjs/common";
import { Event } from "./event.dto"; // Interface'in burada olduğunu varsayıyorum
import { supabase } from "../lib/supabase";

@Injectable()
export class EventService {

  // 1. Yeni Etkinlik Oluştur (Interface'e uygun snake_case kayıt)
  async create(event: Event) {
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          user_id: event.user_id,
          event_type: event.event_type,
          event_data: event.event_data,
          processed: event.processed || false,
          // timestamp ve created_at genelde DB tarafından otomatik atanır
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 2. Tüm Etkinlikleri Getir (Frontend için camelCase'e çevirerek)
  async findAll() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];

    // ÖNEMLİ: DB'den gelen snake_case veriyi Frontend'in beklediği camelCase formatına sokuyoruz
    return (data || []).map(e => ({
      _id: e.id,
      userId: e.user_id,
      eventType: e.event_type,
      metadata: e.event_data,
      status: e.processed ? "processed" : "pending", // boolean'ı frontend'in beklediği stringe çevirdik
      timestamp: e.created_at || e.timestamp
    }));
  }

  // 3. İstatistikleri Getir (Senin şemana uygun sorgu)
  async getStats() {
    try {
      // Toplam kayıt
      const { count: total, error: err1 } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });

      // İşlenmiş (processed: true) kayıtlar
      const { count: processed, error: err2 } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("processed", true); // Senin şemanda sütun adı 'processed'

      if (err1 || err2) console.error("Stats Error:", err1 || err2);

      return {
        total: total || 0,
        processed: processed || 0
      };
    } catch (error) {
      console.error("System Error:", error);
      return { total: 0, processed: 0 };
    }
  }
}