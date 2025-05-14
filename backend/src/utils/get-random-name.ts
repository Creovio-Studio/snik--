import { config } from "../config/app.config";
import { AppError } from "./app-error";

export async function getRandomName() {
  try {
    const params = new URLSearchParams({
      nameType: "fullname",
      quantity: "1",
    });

    const response = await fetch(
      `https://randommer.io/api/Name/${params.toString()}`,
      {
        headers: {
          "X-Api-Key": config.RANDOMERR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new AppError("Failed to fetch name from randomeer api");
    }

    const name = await response.json();
    return name;
  } catch (error) {
    throw new AppError("Can't fetch name");
  }
}
