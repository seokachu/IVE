import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_RANDOM_NICKNAME_URL;

const getRandomNickname = async () => {
  try {
    const { data } = await axios.post(SERVER_URL!, {
      lang: "ko",
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error nickname", error.message);
    }
    throw error;
  }
};

export default getRandomNickname;
