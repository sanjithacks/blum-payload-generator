import { createHash, publicEncrypt, constants } from "crypto";

/**
 * Function to generate a nonce and a corresponding hash for a given input string.
 * @param input - The input string
 * @param difficulty - The number of leading zeros required in the hash (difficulty level)
 * @returns {nonce, hash, iterations, timeTaken} - The generated nonce, the corresponding hash, total iterations, and time taken
 */
export function generateChallenge(
  gameId: string,
  difficulty = 4
): { nonce: number; hash: string; iterations: number; timeTaken: number } {
  let nonce = 0;
  let hash = "";
  let iterations = 0;
  const target = "0".repeat(difficulty); // Define the target hash prefix (e.g., '0000')

  const startTime = Date.now(); // Start time for performance measurement

  while (true) {
    // Combine input and nonce
    const data = gameId + nonce;

    // Create the SHA-256 hash of the combined string
    hash = createHash("sha256").update(data).digest("hex");
    iterations++; // Count iterations

    // Check if the hash starts with the desired number of zeros (based on difficulty)
    if (hash.startsWith(target)) {
      break; // If it matches, break the loop
    }

    // Increment the nonce and try again
    nonce++;
  }

  const timeTaken = Date.now() - startTime; // Calculate time taken
  return { nonce, hash, iterations, timeTaken };
}

/**
 * Encrypts a given payload using an RSA public key.
 * @param payload - The payload to encrypt (as a string).
 * @returns The encrypted payload as a base64 string, or null in case of an error.
 */
export async function encryptPayload(payload: string) {
  try {
    const loadPublicKey =
      "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUF6NXM0cnRzZkxiRmxoZnRoNFJ1OQpZZFdzaU45eVpJc2RtdUE4U2lOaTIrU1pSZlplQVRIMUh2ZVc5OUQyc3JxbkloOFVpUlR4dEpiWFdGSDFCTEQ2CkUvZ09RdjBMdy9Ld1VHZWhScjc3Zm5PT05QbkJBTnF3dEppOFRvWDZDL2hFeW9JMFlFaU5JUzdiY21JczVVNmkKRm9heTF0UFlmRzFkSEJXVGxxU2NidG5lSUthTTJxL3JtRXlQaHlRcDhTcHlTc0x5WTE1WGxERGM4SE5zNVhMNQpNU2hZTllQRWUrVG9hTTNsMDRMSDR6UmRxTEJLZ0ZJMFpqRWxVWlh0T24vTS81em1WamFwd1Q2Ymk0cldOTnZKCmM3TTdabkQ5RXJGWFFxemRLR0x0cHA4Q1hPdXZnUncxRGdPdFpITWwxRzVzY0p1TFZmYjJYRnBKaFNHUmYyQkkKMFFxbmhJc1VWNW03M1JWWE9Ma214dzZOcWpsbnI0TmNpR3F4MzMzWjFSa2o0U09odHJCbitiVXg3SzFIUVNveApDWVgycmlsRlFsdWdDNXd4NmxVU0lRRlQvU010anQ0S20remszYWFiQjlPQUQvWjgzOWVqVzM5MEpLbzA3MVg3CnVITkNhM2dIMjUvV2Rzc0Yra0NybDR3ZmhlUUhUcDhwck9qTjMrTXNNUTRBdzNBOFBvR1ZYdytMK3E1dmVuK0IKcndqanJyYmQzZ0pGMzdkYURydjRrWEFycGNFdHkxNVV4TTB0YzZZUXV5TzR3UDVwTG9BSmNOTFNtc1VGNzBOMwp4a3dqT05BYlByWURqc0x5c1dpUmRUWCsxaGx4NndqL2xWRVNmVjV2U0RvTytENmZUTjd2ZXRqZE5MSWRFeG9hClRmTzBkNzUrc2NGdGdtellvM2NxK1pNQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ==";
    const publicKey = Buffer.from(loadPublicKey, "base64").toString("utf-8");
    const payloadBuffer = Buffer.from(payload);
    const encryptedPayload = publicEncrypt(
      {
        key: publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      new Uint8Array([...payloadBuffer])
    );
    return encryptedPayload.toString("base64");
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Example usage
const gameData = {
  version: 1.2,
  gameId: "",
  challenge: {
    nonce: 0,
    hash: "",
  },
  earnedPoints: { BP: { amount: 100 } },
  assetClicks: {
    BOMB: { clicks: 0 },
    CLOVER: { clicks: 100 },
    FREEZE: { clicks: 1 }, //there maybe many more like DOGS or other assets during event
  },
  isNode: false, //Better to be false
};

const gameId = "abcd-efghi-jklmno-292ddhdjh"; //Your gameId
const points = 169; //Your points

const challenge = generateChallenge(gameId);
gameData.gameId = gameId;
gameData.challenge.nonce = challenge.nonce;
gameData.challenge.hash = challenge.hash;
gameData.earnedPoints.BP.amount = points;
gameData.assetClicks.CLOVER.clicks = points;
gameData.assetClicks.FREEZE.clicks = 1;

const encrypted_payload = await encryptPayload(JSON.stringify(gameData));

console.log(encrypted_payload);
