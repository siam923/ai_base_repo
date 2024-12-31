import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises';
import { z } from 'zod';

dotenv.config();

// Interactive console
const terminal = readline.createInterface({
    input: process.stdin, // Type of input to expect from the user coming from the terminal as standard input (stdin) 
    output: process.stdout,
  });


  const weatherParamSchema = z.object({
    location: z.string().describe('The location to get the weather for'),
  });

  const getWeather = async ({ location }) => {
    return {
      location,
      temperature: 25,
    }
  }

  const getProducts = async () => {
    return {
      products: [
        {
          name: 'Kaju Badam',
          price: 100,
        },
        {
          name: 'Khejur',
          price: 200,
        },
        {
          name: 'Misti',
          price: 300,
        },
        {
          name: 'Chocolate',
          price: 100,
        }

      ],
    }
  }



  const celciusToFahrenheit = async ({ celsius }) => {
    const fahrenheit = celsius * 9 / 5 + 32;
    return { fahrenheit: Math.round(fahrenheit * 100 ) / 100 };
  }


  const messages = [];

  const availableTools = {
    getProducts: tool({
      description: 'Get products of a shop',
      parameters: z.object({}),
      execute: getProducts,
    }),
    weather: tool({
      description: 'Get the weather for a location (in Celsius)',
      parameters: weatherParamSchema,
      execute: getWeather,
    }),
    convertCelciusToFahrenheit: tool({
      description: 'Convert a temperature in Celsius to Fahrenheit',
      parameters: z.object({
        celsius: z.number().describe('The temperature in Celsius to convert to Fahrenheit'),
      }),
      execute: celciusToFahrenheit,
    }),
  }

  // Multi step tool response setup
  const multiStepSetup = {
    maxSteps: 5, 
    onStepFinish: step => {
      console.log(`Analyzing`)
      // console.log(JSON.stringify(step, null, 2))
    }
  }

  async function main() {
    while (true) {
      const userInput = await terminal.question('You: ');
  
      messages.push({ role: 'user', content: userInput });
      
      const option = {
        model: openai('gpt-4o-mini'),
        messages,
        tools: availableTools,
        ...multiStepSetup,
      };

      const result = streamText(option);
  
      let fullResponse = '';
      process.stdout.write('\nAssistant: ');
      for await (const delta of result.textStream) {
        fullResponse += delta;
        process.stdout.write(delta);
      }
      process.stdout.write('\n\n');

      // tool call result 
      // console.log(await result.toolCalls)
      // console.log(await result.toolResults)
  
      messages.push({ role: 'assistant', content: fullResponse });
    }
  }
  
  main().catch(console.error);

