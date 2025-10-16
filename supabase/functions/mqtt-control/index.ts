import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import mqtt from "https://esm.sh/mqtt@5.3.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { esp32_id, action } = await req.json();

    if (!esp32_id || !action) {
      throw new Error('Missing esp32_id or action');
    }

    console.log(`MQTT Control: ${action} for ESP32: ${esp32_id}`);

    // Load MQTT settings from database
    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('setting_key, setting_value');

    if (settingsError) throw settingsError;

    const config: Record<string, string> = {};
    settings?.forEach((s) => {
      config[s.setting_key] = s.setting_value;
    });

    const brokerUrl = config.mqtt_broker_url || 'broker.hivemq.com';
    const brokerPort = parseInt(config.mqtt_broker_port || '1883');
    const useSsl = config.mqtt_use_ssl === 'true';
    const username = config.mqtt_username || '';
    const password = config.mqtt_password || '';
    const topicPrefix = config.mqtt_topic_prefix || 'forklift/';

    console.log(`Connecting to MQTT broker: ${brokerUrl}:${brokerPort} (SSL: ${useSsl})`);

    // Construct MQTT URL
    const protocol = useSsl ? 'mqtts' : 'mqtt';
    const mqttUrl = `${protocol}://${brokerUrl}:${brokerPort}`;

    // Connect to MQTT broker
    const client = mqtt.connect(mqttUrl, {
      username: username || undefined,
      password: password || undefined,
      protocol: useSsl ? 'mqtts' : 'mqtt',
      connectTimeout: 10000,
    });

    // Wait for connection
    await new Promise((resolve, reject) => {
      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        resolve(true);
      });
      client.on('error', (err: Error) => {
        console.error('MQTT Connection Error:', err);
        reject(err);
      });
      setTimeout(() => reject(new Error('Connection timeout')), 15000);
    });

    // Publish message
    const topic = `${topicPrefix}${esp32_id}`;
    const message = action === 'login' ? 'ON' : 'OFF';

    await new Promise((resolve, reject) => {
      client.publish(topic, message, { qos: 1 }, (err?: Error) => {
        if (err) {
          console.error('Publish Error:', err);
          reject(err);
        } else {
          console.log(`Published to ${topic}: ${message}`);
          resolve(true);
        }
      });
    });

    client.end();
    console.log('Disconnected from MQTT broker');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Command ${action} sent to ${esp32_id}`,
        topic,
        payload: message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('MQTT Control Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
