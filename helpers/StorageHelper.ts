import * as SecureStore from 'expo-secure-store';
import Storage from 'expo-sqlite/kv-store';

export function getSecureStoredString(key: string): Promise<string> {
    return SecureStore.getItemAsync(key)
        .then(secret => {
            if (secret === null) return '';
            else return secret;
        });
};

export async function saveSecure(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}
export async function saveInsecure(key: string, value: any): Promise<void> {
    return Storage.setItem(key, JSON.stringify(value));
}
export async function retrieveInsecure(key: string): Promise<any | null> {
    const value = await Storage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value);
}