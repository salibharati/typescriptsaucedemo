import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * GraphQL API tests against the public Countries API.
 * Demonstrates querying with variables, asserting nested data, and validating
 * a collection response - the GraphQL equivalent of the REST suite.
 */
const GRAPHQL = 'https://countries.trevorblades.com/';

test.beforeEach(async () => {
  await allure.parentSuite('GraphQL API');
  await allure.epic('Quality Engineering');
  await allure.feature('Countries GraphQL');
  await allure.owner('automai');
});

test.describe('Countries GraphQL API', { tag: '@regression' }, () => {
  test(
    'queries a country by code with variables',
    { tag: '@smoke' },
    async ({ request }) => {
      const res = await request.post(GRAPHQL, {
        data: {
          query: `query Country($code: ID!) {
            country(code: $code) { name capital currency }
          }`,
          variables: { code: 'CM' },
        },
      });
      expect(res.status()).toBe(200);

      const { data } = await res.json();
      expect(data.country).toMatchObject({
        name: 'Cameroon',
        capital: 'Yaoundé',
        currency: 'XAF',
      });
    },
  );

  test('returns all seven continents', async ({ request }) => {
    const res = await request.post(GRAPHQL, {
      data: { query: '{ continents { code name } }' },
    });
    expect(res.ok()).toBeTruthy();

    const { data } = await res.json();
    expect(data.continents).toHaveLength(7);
  });

  test('returns an error for an invalid query (negative)', async ({
    request,
  }) => {
    const res = await request.post(GRAPHQL, {
      data: { query: '{ country(code: "CM") { nonExistentField } }' },
    });
    const body = await res.json();
    expect(body.errors?.length).toBeGreaterThan(0);
  });
});
