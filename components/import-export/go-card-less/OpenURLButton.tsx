import { useCallback } from "react";
import { Button, Linking } from "react-native";

type OpenURLButtonProps = {
    url: string;
    children: string;
    disabled: boolean;
};

export default function OpenURLButton({ url, children, disabled }: OpenURLButtonProps) {
    const handlePress = useCallback(async () => {
        console.log(url)
        await Linking.openURL(url);
    }, [url]);

    return <Button disabled={disabled} title={children} onPress={handlePress} />;
};