import * as SecureStore from 'expo-secure-store';

export function getSecureStoredString(key: string): Promise<string> {
    return SecureStore.getItemAsync(key)
        .then(secret => {
            if (secret === null) return '';
            else return secret;
        });
};