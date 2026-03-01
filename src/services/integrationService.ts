import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface SlackWebhookConfig {
    webhookUrl: string;
    connectedAt: string;
    isActive: boolean;
}

export const integrationService = {
    /**
     * Save the Slack Webhook URL for a user
     */
    async saveSlackWebhook(ownerId: string, webhookUrl: string): Promise<void> {
        try {
            const { firestore } = initializeFirebase();
            if (!firestore) throw new Error('Firestore not initialized');

            const configRef = doc(firestore, 'users', ownerId, 'integrations', 'slack');
            const data: SlackWebhookConfig = {
                webhookUrl,
                connectedAt: new Date().toISOString(),
                isActive: true,
            };
            await setDoc(configRef, data, { merge: true });
        } catch (error) {
            console.error('Error saving Slack webhook:', error);
            throw error;
        }
    },

    /**
     * Get the configured Slack Webhook URL for a user
     */
    async getSlackWebhook(ownerId: string): Promise<string | null> {
        try {
            const { firestore } = initializeFirebase();
            if (!firestore) throw new Error('Firestore not initialized');

            const configRef = doc(firestore, 'users', ownerId, 'integrations', 'slack');
            const snapshot = await getDoc(configRef);

            if (snapshot.exists()) {
                const data = snapshot.data() as SlackWebhookConfig;
                if (data.isActive && data.webhookUrl) {
                    return data.webhookUrl;
                }
            }
            return null;
        } catch (error) {
            console.error('Error getting Slack webhook:', error);
            return null;
        }
    },

    /**
     * Disconnect/Remove the Slack webhook
     */
    async disconnectSlack(ownerId: string): Promise<void> {
        try {
            const { firestore } = initializeFirebase();
            if (!firestore) throw new Error('Firestore not initialized');

            const configRef = doc(firestore, 'users', ownerId, 'integrations', 'slack');
            await setDoc(configRef, {
                webhookUrl: '',
                isActive: false,
                disconnectedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Error disconnecting Slack webhook:', error);
            throw error;
        }
    }
};
