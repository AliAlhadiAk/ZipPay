import getSecret from "./aws"

type SecretResponse = string | null; 

export const DATABASE_URL = async (): Promise<string | null> => {
  return await getSecret('db-url');
};

export const getStripeSecret = async (): Promise<string | null> => {
    const secret = await getSecret('stripe-secret');
    return secret; 
  };


