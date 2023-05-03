import type { ITask } from '@/types/task';
import type { ISearch } from '@/types/search';
import { load } from 'cheerio';

export const getTask = async (id: string): Promise<ITask | undefined> => {
  const response = await fetch(`${process.env.BRAINLY_API}/tarefa/${id}`, {
    headers: {
      'Accept-Language': process.env.HTTP_ACCEPT_LANGUAGE ?? '',
      'User-Agent': process.env.HTTP_USER_AGENT ?? '',
    },
  });

  if (response.ok) {
    const body = await response.text();
    const task = filterTask(body, id);

    return task;
  }
};

export const searchTask = async (
  query: string,
  limit?: number
): Promise<ISearch | undefined> => {
  const urlSearchParams = new URLSearchParams();

  urlSearchParams.set('operationName', 'SearchPage');

  urlSearchParams.set(
    'variables',
    JSON.stringify({ query, first: limit ?? 10 })
  );

  urlSearchParams.set(
    'extensions',
    JSON.stringify({
      persistedQuery: {
        version: Number(process.env.GRAPHQL_EXTENSIONS_VERSION),
        sha256Hash: process.env.GRAPHQL_EXTENSIONS_SHA256HASH,
      },
    })
  );

  const response = await fetch(
    `${process.env.BRAINLY_API}/graphql/pt?${urlSearchParams.toString()}`,
    {
      headers: {
        'Accept-Language': process.env.HTTP_ACCEPT_LANGUAGE ?? '',
        'User-Agent': process.env.HTTP_USER_AGENT ?? '',
      },
    }
  );

  if (response.ok) {
    const json = await response.json();
    const formatted = formatSearch(json);

    return formatted;
  }
};

const filterTask = (body: string, taskId: string): ITask | undefined => {
  const $ = load(body);
  const script = $('script[type="application/ld+json"]').html();

  if (script) {
    const json = JSON.parse(script);
    const entities = json.find((data: any) => data['@type'] === 'QAPage');

    const entity = entities.mainEntity;
    const formatted = formatTask(entity, taskId);

    return formatted;
  }
};

const formatTask = (task: any, taskId: string): ITask => {
  return {
    id: taskId,
    type: task['@type'].toLowerCase(),
    text: task.name,
    answerCount: task.answerCount,
    author: {
      type: task.author['@type'].toLowerCase(),
      name: task.author.name,
    },
    acceptedAnswer: task.acceptedAnswer?.map((acceptedAnswer: any) => ({
      type: acceptedAnswer['@type'].toLowerCase(),
      text: acceptedAnswer.text,
      upvoteCount: acceptedAnswer.upvoteCount,
      author: {
        type: acceptedAnswer.author['@type'].toLowerCase(),
        name: acceptedAnswer.author.name,
      },
      createdAt: new Date(acceptedAnswer.dateCreated).toISOString(),
    })),
    suggestedAnswer: task.suggestedAnswer?.map((suggestedAnswer: any) => ({
      type: suggestedAnswer['@type'].toLowerCase(),
      text: suggestedAnswer.text,
      upvoteCount: suggestedAnswer.upvoteCount,
      author: {
        type: suggestedAnswer.author['@type'].toLowerCase(),
        name: suggestedAnswer.author.name,
      },
      createdAt: new Date(suggestedAnswer.dateCreated).toISOString(),
    })),
    createdAt: new Date(task.dateCreated).toISOString(),
  };
};

const formatSearch = (search: any): ISearch => {
  return {
    totalAnswers: search.data.questionSearch?.count ?? 0,
    tasks:
      search?.data?.questionSearch?.edges?.map((edge: any) => ({
        id: edge.node?.databaseId ? String(edge.node?.databaseId) : null,
        authorId: edge.node.author?.databaseId
          ? String(edge.node.author?.databaseId)
          : null,
        text: edge.node.content,
        answers:
          edge.node.answers.nodes?.map((answer: any) => ({
            totalRates: answer.ratesCount,
            totalThanks: answer.thanksCount,
            rating: answer.rating,
            verified: answer.isConfirmed,
          })) ?? [],
      })) ?? [],
  };
};
