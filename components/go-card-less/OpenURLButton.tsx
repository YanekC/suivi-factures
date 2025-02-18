import { useCallback } from "react";
import { Button, Linking } from "react-native";

type OpenURLButtonProps = {
    url: string;
    children: string;
};

export default function OpenURLButton({ url, children }: OpenURLButtonProps) {
    const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
        await Linking.openURL(url);
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
};