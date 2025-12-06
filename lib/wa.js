import waApi from "./waApi";

export async function sendWA(payload) {
  try {
    console.log('📤 WA Function received:', payload); // ✅ Debug
    
    // ✅ Validate payload
    if (!payload || !payload.number || !payload.text) {
      throw new Error('Missing required fields: number and text');
    }
    
    console.log('📤 Sending to API:', payload);
    
    const res = await waApi.post("/api/whatsapp/send", payload);
    
    console.log('✅ WA Response:', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ WA API ERROR:", err.response?.data || err.message);
    throw err;
  }
}