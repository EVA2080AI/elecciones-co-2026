import { NextResponse } from 'next/server';

/**
 * Gemini API Proxy - Serverless Function para Vercel
 * Protege la API key de Gemini y agrega rate limiting
 * 
 * Environment variables requeridas:
 * - GEMINI_API_KEY: Tu API key de Google AI Studio
 * - GEMINI_RATE_LIMIT: Peticiones por hora por IP (default: 100)
 */

// Rate limiting simple en memoria (en producción usar Redis/Upstash)
const requestCounts = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 100): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  
  const userRequests = requestCounts.get(ip) || [];
  const recent = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  if (recent.length >= limit) {
    return false;
  }
  
  recent.push(now);
  requestCounts.set(ip, recent);
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Verificar rate limiting
  const rateLimit = parseInt(process.env.GEMINI_RATE_LIMIT || '100');
  if (!checkRateLimit(ip, rateLimit)) {
    return NextResponse.json(
      { error: 'Rate limit excedido. Intenta en 1 hora.' },
      { status: 429 }
    );
  }
  
  try {
    const body = await request.json();
    const { prompt, system, temperature, topP, maxTokens } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'El prompt es requerido' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada en el servidor' },
        { status: 500 }
      );
    }
    
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature ?? 0.4,
        topP: topP ?? 0.9,
        maxOutputTokens: maxTokens ?? 600
      }
    };
    
    if (system) {
      (requestBody as any).systemInstruction = { parts: [{ text: system }] };
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido');
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      
      // No exponer detalles del error de Gemini al cliente
      return NextResponse.json(
        { error: 'Error al procesar la solicitud' },
        { status: response.status === 429 ? 429 : 500 }
      );
    }
    
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join('\n').trim();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Respuesta vacía de Gemini' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ text }, { status: 200 });
    
  } catch (error) {
    console.error('Error en proxy Gemini:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Config para Vercel Edge Runtime (opcional, más rápido)
export const config = {
  runtime: 'edge',
};
