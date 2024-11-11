import { NextRequest, NextResponse } from 'next/server';
import { Process, CompanyList, Source } from '@/app/store/discoAITypes';
import { processCompany } from './processCompany';


export async function POST(req: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  const allResults: { sections: { title: string; content: string; sources: Source[] }[]; companyName: string; processName: string }[] = [];

  const sendUpdate = async (message: string) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ message })}\n\n`));
  };

  const sendResult = async (result: { sections: { title: string; content: string; sources: Source[] }[]; companyName: string; processName: string }) => {
    const formattedOutput = `
      # ${result.processName} for ${result.companyName}

      ${result.sections.map(section => `
      ## ${section.title}

      ${section.content}

      ### Sources

      ${section.sources.map((source) => `
      - [${source.title}](${source.url})
        - ${source.explanation || 'No explanation provided'}
      `).join("\n")}
      `).join("\n")}`;

    allResults.push(result);

    await writer.write(encoder.encode(`data: ${JSON.stringify({ result: { ...result, output: formattedOutput } })}\n\n`));
  };

  (async () => {
    try {
      const body = await req.json();
      const { processes, companyList }: { processes: Process[], companyList: CompanyList } = body;

      console.log('Received processes:', processes);
      console.log('Received company list:', companyList);

      for (let i = 0; i < companyList.companies.length; i++) {
        const company = companyList.companies[i];
        await sendUpdate(`Processing company ${i + 1}/${companyList.companies.length}: ${company}`);

        for (let j = 0; j < processes.length; j++) {
          const process = processes[j];
          await sendUpdate(`Running process ${j + 1}/${processes.length}: ${process.name} for ${company}`);

          try {
            const result = await processCompany(company, process, sendUpdate);

            await sendResult({
              sections: result.sections,
              companyName: company,
              processName: process.name,
            });
            await sendUpdate(`Completed process ${process.name} for ${company}`);
          } catch (error) {
            console.error(`Error processing ${company} with ${process.name}:`, error);
            await sendUpdate(`Error in process ${process.name} for ${company}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }


        }
      }

      await sendUpdate('Preparing final report...');
      await writer.write(encoder.encode(`data: ${JSON.stringify({ finalReport: allResults })}\n\n`));

      await sendUpdate('All processes completed successfully');
      await writer.close();
    } catch (error) {
      console.error('Error in runProcess:', error);
      await sendUpdate(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      await writer.close();
    }
  })();

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}