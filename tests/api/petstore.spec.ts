import { test, expect, type APIRequestContext } from '@playwright/test';

// Public Petstore is shared and resets data -> every test creates its own pet with a unique ID.
const uniqueId = () => Date.now() * 1000 + Math.floor(Math.random() * 1000);

const buildPet = (id: number) => ({
  id,
  category: { id: 7, name: 'Dogs' },
  name: `qa-pet-${id}`,
  photoUrls: ['https://example.com/pet.jpg'],
  tags: [{ id: 1, name: 'friendly' }],
  status: 'available',
});

async function createPet(request: APIRequestContext) {
  const pet = buildPet(uniqueId());
  const res = await request.post('pet', { data: pet });
  expect(res.status()).toBe(200);
  return pet;
}

test.describe('Petstore API (bonus)', () => {
  test('API-01 create a pet and retrieve it by the created ID', async ({ request }) => {
    const pet = await createPet(request);

    const res = await request.get(`pet/${pet.id}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(pet);
  });

  test('API-02 update name/status, other fields stay unchanged', async ({ request }) => {
    const pet = await createPet(request);
    const updated = { ...pet, name: `${pet.name}-updated`, status: 'sold' };

    const put = await request.put('pet', { data: updated });
    expect(put.status()).toBe(200);

    const get = await request.get(`pet/${pet.id}`);
    const body = await get.json();
    expect(body.name).toBe(updated.name);
    expect(body.status).toBe('sold');
    expect(body.category).toEqual(pet.category);
    expect(body.tags).toEqual(pet.tags);
    expect(body.photoUrls).toEqual(pet.photoUrls);
  });

  test('API-03 delete a pet, then GET returns 404 (negative)', async ({ request }) => {
    const pet = await createPet(request);

    const del = await request.delete(`pet/${pet.id}`);
    expect(del.status()).toBe(200);

    const get = await request.get(`pet/${pet.id}`);
    expect(get.status()).toBe(404);
    expect((await get.json()).message).toBe('Pet not found');
  });
});
