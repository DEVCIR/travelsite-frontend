import { OpenAI } from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

function getCityName(location) {
  return location.split(",")[0].trim();
}

export async function POST(request) {
  try {
    const { from, to, stops, maxDistance, autonomy, needHotel, startDate } =
      await request.json();

      // console.log(needHotel);

    // Format the cities without "United States"
    const formattedFrom = getCityName(from);
    const formattedTo = getCityName(to);
    const formattedStops = stops?.map((stop) => getCityName(stop)) || [];
    let prompt = '';
    if (needHotel) {
      prompt = `Create a detailed itinerary for this EV road trip:
Start: ${formattedFrom}
Destination: ${formattedTo}
${formattedStops.length > 0 ? `Stops: ${formattedStops.join(", ")}\n` : ""}
Max Daily Distance: ${maxDistance}
Vehicle Range: ${autonomy}
Start Date: ${new Date(startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}

FORMAT REQUIREMENTS:
1. For each travel day:
DAY {n}: {From} --> {To} (~{distance})
Departure/Overnight Stay: {Month} {day}, {year}
Midway Charging Stop: {Specific charger name and location}
Hotel Recommendation: {Hotel name}

2. Rules:
- Use only city names (no countries/states)
- Show real charging stations (Tesla, EVgo, Electrify America)
- Show charging station which is most nearest to the city
- Include hotel recommendations
- recommend hotel which is most nearest to the city
- Use ~ before distance numbers
- Use --> between cities
- Calculate proper dates from start date
- If the distance to next stop/city exceeds the daily driving limit (${maxDistance}), break the journey and add an intermediate stop where the daily limit would be reached
- Never exceed the daily driving limit of ${maxDistance} in a single day`;
    } else {
      prompt = `Create a detailed itinerary for this EV road trip:
Start: ${formattedFrom}
Destination: ${formattedTo}
${formattedStops.length > 0 ? `Stops: ${formattedStops.join(", ")}\n` : ""}
Max Daily Distance: ${maxDistance}
Vehicle Range: ${autonomy}
Start Date: ${new Date(startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}

FORMAT REQUIREMENTS:
1. For each travel day:
DAY {n}: {From} --> {To} (~{distance})
Departure/Overnight Stay: {Month} {day}, {year}
Midway Charging Stop: {Specific charger name and location}

2. Rules:
- Use only city names (no countries/states)
- Show real charging stations (Tesla, EVgo, Electrify America)
- Show charging station which is most nearest to the city
- Use ~ before distance numbers
- Use --> between cities
- Calculate proper dates from start date`;
    }

    const url = 'https://chatgpt-42.p.rapidapi.com/chatgpt';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'ebd3559690msh9b122b43952923cp1a3704jsncde96212af8d',
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a precise travel assistant that creates perfectly formatted EV road trip itineraries.'
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 700,
      }),
    };

    const response = await fetch(url, options);
    const result = await response.text();
    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content: 'You are a precise travel assistant that creates perfectly formatted EV road trip itineraries.',
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   temperature: 0.1,
    //   max_tokens: 700,
    // });

    // const itinerary = response.choices[0].message.content;
    let itinerary;

    try {
      itinerary = JSON.parse(result);
    } catch (e) {
      console.error("RapidAPI returned invalid JSON:", result);
      throw new Error("Itinerary service returned malformed response");
    }
    console.log("itinerary",itinerary);


    if (itinerary.error || !itinerary.result) {
      console.error("RapidAPI failed:", itinerary);
      throw new Error(itinerary.error || "Failed to generate itinerary");
    }

    const itinerary2 = itinerary.result;

    return new Response(
      JSON.stringify({
        itinerary: itinerary2,
        parameters: {
          from: formattedFrom,
          to: formattedTo,
          stops: formattedStops,
          maxDistance,
          autonomy,
          needHotel,
          startDate: new Date(startDate).toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate itinerary",
        debug: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
