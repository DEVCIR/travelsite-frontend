import { OpenAI } from "openai";

const openai = new OpenAI( process.env.OPENAI_API_KEY );

export async function POST( request )
{
  try
  {
    const { from, to, stops, maxDistance, autonomy } = await request.json();

    const prompt = `Calculate the total distance and estimated driving time for an EV road trip with these parameters:
Start: ${from} 
Destination: ${to}
${stops?.length > 0 ? `Stops: ${stops.join( ", " )}\n` : ""}
Max Daily Distance: ${maxDistance}
Vehicle Range: ${autonomy}

FORMAT REQUIREMENTS:
1. Return JSON with these exact fields:
{
  "totalDistance": "{distance with unit}",
  "drivingTime": "~{hours} HOURS",
  "dailyLimit": "<{maxDistance}",
  "chargingInterval": "{minRange}-{maxRange}{unit}"
}

2. Calculation Rules:
- Total distance should be realistic for the route
- Driving time should include charging stops (30 min per stop)
- Daily limit should match the input maxDistance
- Charging interval should be 80-100% of vehicle range
- Use same unit (KM/MI) as provided in inputs
- Average speed: 80 km/h or 50 mph depending on unit`;

    const response = await openai.chat.completions.create( {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: 'You are a precise route calculator that returns perfectly formatted JSON output for EV trips.',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Lower temperature for more consistent results
      response_format: { type: "json_object" },
    } );

    const result = JSON.parse( response.choices[ 0 ].message.content );

    return new Response(
      JSON.stringify( {
        overview: result,
        parameters: {
          from,
          to,
          stops,
          maxDistance,
          autonomy,
        },
      } ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch ( error )
  {
    console.error( "API Error:", error );
    return new Response(
      JSON.stringify( {
        error: "Failed to calculate route overview",
        debug: error.message,
      } ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}