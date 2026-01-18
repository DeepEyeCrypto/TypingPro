/**
 * Google Identity Services SDK Loader
 * Dynamically loads the Google Sign-In script and provides initialization helpers.
 */

export const loadGoogleSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
};

export const initGoogleSignIn = async (clientId: string, callback: (response: any) => void) => {
    try {
        await loadGoogleSDK();
        window.google?.accounts.id.initialize({
            client_id: clientId,
            callback: callback,
            auto_select: false,
            cancel_on_tap_outside: true,
        });
    } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
    }
};
