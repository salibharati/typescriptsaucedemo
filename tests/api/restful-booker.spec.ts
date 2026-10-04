import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * REST API tests against Restful Booker - a real service with token auth and
 * persistent CRUD. Runs as an ordered lifecycle (serial): authenticate ->
 * create -> read -> update -> delete -> verify removal.
 *
 * The service requires an `Accept: application/json` header, and writes
 * (PUT/DELETE) require the auth token as a cookie.
 */
const BASE = 'https://restful-booker.herokuapp.com';
const JSON_HEADERS = { Accept: 'application/json' };

// Credentials from env when set, else the service's public demo defaults.
const BOOKER_USER = process.env.BOOKER_USERNAME ?? 'admin';
const BOOKER_PASS = process.env.BOOKER_PASSWORD ?? 'password123';

test.describe.serial('Restful Booker REST API', { tag: '@regression' }, () => {
  let token = '';
  let bookingId = 0;

  test.beforeEach(async () => {
    await allure.parentSuite('API');
    await allure.epic('Quality Engineering');
    await allure.feature('Restful Booker (auth + CRUD)');
    await allure.owner('automai');
  });

  test('POST /auth returns a token', { tag: '@smoke' }, async ({ request }) => {
    const res = await request.post(`${BASE}/auth`, {
      data: { username: BOOKER_USER, password: BOOKER_PASS },
    });
    expect(res.status()).toBe(200);
    token = (await res.json()).token;
    expect(token).toBeTruthy();
  });

  test(
    'POST /booking creates a booking',
    { tag: '@smoke' },
    async ({ request }) => {
      const payload = {
        firstname: 'Lewis',
        lastname: 'Yaka',
        totalprice: 150,
        depositpaid: true,
        bookingdates: { checkin: '2026-07-01', checkout: '2026-07-05' },
        additionalneeds: 'Breakfast',
      };
      const res = await request.post(`${BASE}/booking`, {
        headers: JSON_HEADERS,
        data: payload,
      });
      expect(res.status()).toBe(200);

      const body = await res.json();
      bookingId = body.bookingid;
      expect(bookingId).toBeGreaterThan(0);
      expect(body.booking).toMatchObject({
        firstname: 'Lewis',
        lastname: 'Yaka',
        totalprice: 150,
      });
    },
  );

  test('GET /booking/:id returns the created booking', async ({ request }) => {
    const res = await request.get(`${BASE}/booking/${bookingId}`, {
      headers: JSON_HEADERS,
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).firstname).toBe('Lewis');
  });

  test('PUT /booking/:id updates the booking', async ({ request }) => {
    const res = await request.put(`${BASE}/booking/${bookingId}`, {
      headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
      data: {
        firstname: 'Lewis',
        lastname: 'Updated',
        totalprice: 200,
        depositpaid: false,
        bookingdates: { checkin: '2026-07-01', checkout: '2026-07-06' },
        additionalneeds: 'Late checkout',
      },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.lastname).toBe('Updated');
    expect(body.totalprice).toBe(200);
  });

  test('DELETE /booking/:id removes the booking', async ({ request }) => {
    const res = await request.delete(`${BASE}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(201);
  });

  test('GET /booking/:id is 404 after deletion (negative)', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/booking/${bookingId}`, {
      headers: JSON_HEADERS,
    });
    expect(res.status()).toBe(404);
  });

  // Documented backlog: tracked as a skipped test so the planned coverage is
  // visible in the report (Categories -> Ignored / skipped).
  test('PATCH /booking applies a partial update', async () => {
    // eslint-disable-next-line playwright/no-skipped-test -- intentional documented backlog
    test.skip(
      true,
      'Pending: partial-update (PATCH) coverage planned for next iteration',
    );
  });
});
