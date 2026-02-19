// Web Crypto API wrapper for E2EE

const ALGORITHM_NAME = 'ECDH';
const NAMED_CURVE = 'P-521'; // High security curve
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const ENCRYPTION_LENGTH = 256;

// Generate ECDH Key Pair
export const generateKeyPair = async () => {
    return await window.crypto.subtle.generateKey(
        {
            name: ALGORITHM_NAME,
            namedCurve: NAMED_CURVE,
        },
        true, // extractor
        ['deriveKey', 'deriveBits']
    );
};

// Export Public Key to send to server/other user (JWK format)
export const exportPublicKey = async (publicKey) => {
    const exported = await window.crypto.subtle.exportKey(
        'jwk',
        publicKey
    );
    return JSON.stringify(exported);
};

// Import Public Key received from other user
export const importPublicKey = async (jwkJson) => {
    const jwk = JSON.parse(jwkJson);
    return await window.crypto.subtle.importKey(
        'jwk',
        jwk,
        {
            name: ALGORITHM_NAME,
            namedCurve: NAMED_CURVE,
        },
        true,
        []
    );
};

// Derive Shared Secret Key (AES-GCM)
export const deriveSharedKey = async (privateKey, publicKey) => {
    return await window.crypto.subtle.deriveKey(
        {
            name: ALGORITHM_NAME,
            public: publicKey,
        },
        privateKey,
        {
            name: ENCRYPTION_ALGORITHM,
            length: ENCRYPTION_LENGTH,
        },
        true, // exportable? maybe false is safer but for debug implementation true
        ['encrypt', 'decrypt']
    );
};

// Encrypt Message
export const encryptMessage = async (sharedKey, message) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: ENCRYPTION_ALGORITHM,
            iv: iv,
        },
        sharedKey,
        data
    );

    // Combine IV and Ciphertext for transport
    // Format: IV (12 bytes) + Ciphertext
    const buffer = new Uint8Array(iv.byteLength + encryptedContent.byteLength);
    buffer.set(iv, 0);
    buffer.set(new Uint8Array(encryptedContent), iv.byteLength);

    // Convert to Base64 string
    return btoa(String.fromCharCode(...buffer));
};

// Decrypt Message
export const decryptMessage = async (sharedKey, encryptedMessageBase64) => {
    try {
        const binaryString = atob(encryptedMessageBase64);
        const buffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            buffer[i] = binaryString.charCodeAt(i);
        }

        const iv = buffer.slice(0, 12);
        const data = buffer.slice(12);

        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: ENCRYPTION_ALGORITHM,
                iv: iv,
            },
            sharedKey,
            data
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedContent);
    } catch (e) {
        console.error("Decryption failed", e);
        return "[Encrypted Message - Key Mismatch]";
    }
};
