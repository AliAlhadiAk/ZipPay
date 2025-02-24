import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secretManagerClient = new SecretsManagerClient({
  region: 'us-east-1', 
});

export default async function getSecret(secretName: string): Promise<string> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });
    
    const data = await secretManagerClient.send(command);
    
    if (!data.SecretString) {
      throw new Error(`Secret value for ${secretName} is not available as a string.`);
    }
    
    return data.SecretString;
  } catch (error) {
    console.error(`Failed to retrieve secret ${secretName}:`, error);
    throw error; 
  }
}