import { test, expect, type Page } from '@playwright/test';

const BUN = 'Краторная булка N-200i';
const OTHER_BUN = 'Флюоресцентная булка R2-D3';
const MAIN = 'Биокотлета из марсианской Магнолии';
const SAUCE = 'Соус Spicy-X';
const ORDER_NUMBER = '12345';
const USER_NAME = 'Test User';

const getIngredientsPanel = (page: Page) =>
  page.locator('section').filter({ has: page.locator('nav') });

const getConstructorPanel = (page: Page) =>
  page.locator('section').filter({ hasText: 'Оформить заказ' });

const getCard = (page: Page, name: string) =>
  getIngredientsPanel(page).locator('li').filter({ hasText: name });

const getModal = (page: Page) => page.locator('#modals');

const openConstructor = async (page: Page) => {
  await page.goto('/');
  await expect(getCard(page, BUN)).toBeVisible();
};

const addIngredient = async (page: Page, name: string) => {
  await getCard(page, name).getByRole('button', { name: 'Добавить' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', (route) => route.abort());
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    notFound: 'fallback'
  });
});

test.describe('Страница конструктора бургера', () => {
  test.describe('Добавление ингредиентов в конструктор', () => {
    test.beforeEach(async ({ page }) => {
      await openConstructor(page);
    });

    test('добавляет булку: появляются верх и низ, плейсхолдеры пропадают', async ({
      page
    }) => {
      const constructorPanel = getConstructorPanel(page);
      await expect(constructorPanel.getByText('Выберите булки')).toHaveCount(2);

      await addIngredient(page, BUN);

      await expect(constructorPanel.getByText(`${BUN} (верх)`)).toBeVisible();
      await expect(constructorPanel.getByText(`${BUN} (низ)`)).toBeVisible();
      await expect(constructorPanel.getByText('Выберите булки')).toHaveCount(0);
    });

    test('добавляет начинку и соус в список ингредиентов', async ({ page }) => {
      const constructorPanel = getConstructorPanel(page);
      await expect(
        constructorPanel.getByText('Выберите начинку')
      ).toBeVisible();

      await addIngredient(page, MAIN);
      await addIngredient(page, SAUCE);

      await expect(constructorPanel.getByText(MAIN)).toBeVisible();
      await expect(constructorPanel.getByText(SAUCE)).toBeVisible();
      await expect(constructorPanel.getByText('Выберите начинку')).toHaveCount(
        0
      );
    });

    test('новая булка заменяет предыдущую', async ({ page }) => {
      const constructorPanel = getConstructorPanel(page);

      await addIngredient(page, BUN);
      await addIngredient(page, OTHER_BUN);

      await expect(
        constructorPanel.getByText(`${OTHER_BUN} (верх)`)
      ).toBeVisible();
      await expect(constructorPanel.getByText(`${BUN} (верх)`)).toHaveCount(0);
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test.beforeEach(async ({ page }) => {
      await openConstructor(page);
    });

    test('открывается по клику на карточку', async ({ page }) => {
      const modal = getModal(page);

      await getCard(page, MAIN).getByRole('link').click();

      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();
    });

    test('показывает данные именно того ингредиента, по которому кликнули', async ({
      page
    }) => {
      const modal = getModal(page);

      await getCard(page, MAIN).getByRole('link').click();

      await expect(modal.getByRole('heading', { name: MAIN })).toBeVisible();
      await expect(modal.getByText('4242', { exact: true })).toBeVisible();
      await expect(modal.getByText('420', { exact: true })).toBeVisible();
      await expect(modal.getByText('142', { exact: true })).toBeVisible();
      await expect(modal.getByText('242', { exact: true })).toBeVisible();
      await expect(modal.getByRole('heading', { name: BUN })).toHaveCount(0);
    });

    test('закрывается по клику на крестик', async ({ page }) => {
      const modal = getModal(page);

      await getCard(page, MAIN).getByRole('link').click();
      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();

      await modal.locator('button').click();

      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toHaveCount(0);
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      const modal = getModal(page);

      await getCard(page, MAIN).getByRole('link').click();
      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();

      await page
        .locator('#modals > div')
        .last()
        .click({ position: { x: 5, y: 5 } });

      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toHaveCount(0);
    });
  });

  test.describe('Создание заказа', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().addCookies([
        {
          name: 'accessToken',
          value: 'fake-access-token',
          domain: 'localhost',
          path: '/'
        }
      ]);
      await page.addInitScript(() => {
        window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      });
      await page.routeFromHAR('./tests/hars/user.har', {
        url: '**/api/auth/user',
        notFound: 'fallback'
      });
      await page.routeFromHAR('./tests/hars/order.har', {
        url: '**/api/orders',
        notFound: 'fallback'
      });
      await openConstructor(page);
      await expect(page.getByText(USER_NAME)).toBeVisible();
    });

    test('собирает бургер, оформляет заказ, проверяет номер, закрывает окно и очищает конструктор', async ({
      page
    }) => {
      const constructorPanel = getConstructorPanel(page);
      const modal = getModal(page);

      await addIngredient(page, BUN);
      await addIngredient(page, MAIN);
      await expect(constructorPanel.getByText(`${BUN} (верх)`)).toBeVisible();
      await expect(constructorPanel.getByText(MAIN)).toBeVisible();
      await constructorPanel
        .getByRole('button', { name: 'Оформить заказ' })
        .click();
      await expect(
        modal.getByRole('heading', { name: ORDER_NUMBER })
      ).toBeVisible();
      await expect(constructorPanel.getByText('Выберите булки')).toHaveCount(2);
      await expect(
        constructorPanel.getByText('Выберите начинку')
      ).toBeVisible();
      await modal.locator('button').click();
      await expect(
        modal.getByRole('heading', { name: ORDER_NUMBER })
      ).toHaveCount(0);
    });
  });
});
