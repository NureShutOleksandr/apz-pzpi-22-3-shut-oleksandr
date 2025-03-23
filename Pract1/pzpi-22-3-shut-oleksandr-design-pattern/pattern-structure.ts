/**
 * Інтерфейс Абстрактної Фабрики оголошує набір методів, які повертають
 * різні абстрактні продукти. Ці продукти називаються родиною і є
 * взаємопов'язаними за допомогою загальної теми або концепції. Продукти однієї родини зазвичай
 * можуть взаємодіяти між собою. Родина продуктів може мати кілька
 * варіантів, але продукти одного варіанту несумісні з продуктами іншого.
 */
interface AbstractFactory {
  createProductA(): AbstractProductA;

  createProductB(): AbstractProductB;
}

/**
* Конкретні фабрики створюють родину продуктів, що належать до одного
* варіанту. Фабрика гарантує, що створені продукти сумісні. Зверніть увагу,
* що підписи методів Конкретної Фабрики повертають абстрактний продукт,
* в той час як всередині методу створюється конкретний продукт.
*/
class ConcreteFactory1 implements AbstractFactory {
  public createProductA(): AbstractProductA {
      return new ConcreteProductA1();
  }

  public createProductB(): AbstractProductB {
      return new ConcreteProductB1();
  }
}

/**
* Кожна Конкретна Фабрика має відповідний варіант продукту.
*/
class ConcreteFactory2 implements AbstractFactory {
  public createProductA(): AbstractProductA {
      return new ConcreteProductA2();
  }

  public createProductB(): AbstractProductB {
      return new ConcreteProductB2();
  }
}

/**
* Кожен окремий продукт родини продуктів повинен мати базовий інтерфейс. Всі
* варіанти продукту повинні реалізовувати цей інтерфейс.
*/
interface AbstractProductA {
  usefulFunctionA(): string;
}

/**
* Ці Конкретні Продукти створюються відповідними Конкретними Фабриками.
*/
class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA(): string {
      return 'Результат продукту A1.';
  }
}

class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA(): string {
      return 'Результат продукту A2.';
  }
}

/**
* Ось базовий інтерфейс для іншого продукту. Всі продукти можуть взаємодіяти
* один з одним, але правильна взаємодія можлива тільки між продуктами одного
* конкретного варіанту.
*/
interface AbstractProductB {
  /**
   * Продукт B може виконувати свою функцію...
   */
  usefulFunctionB(): string;

  /**
   * ...але також може співпрацювати з Продуктом A.
   *
   * Абстрактна Фабрика гарантує, що всі продукти, які вона створює, належать
   * до одного варіанту і, таким чином, сумісні.
   */
  anotherUsefulFunctionB(collaborator: AbstractProductA): string;
}

/**
* Ці Конкретні Продукти створюються відповідними Конкретними Фабриками.
*/
class ConcreteProductB1 implements AbstractProductB {

  public usefulFunctionB(): string {
      return 'Результат продукту B1.';
  }

  /**
   * Варіант, Продукт B1, може коректно працювати тільки з варіантом
   * Продукту A1. Проте, він приймає будь-який екземпляр AbstractProductA як
   * аргумент.
   */
  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
      const result = collaborator.usefulFunctionA();
      return `Результат B1 у співпраці з (${result})`;
  }
}

class ConcreteProductB2 implements AbstractProductB {

  public usefulFunctionB(): string {
      return 'Результат продукту B2.';
  }

  /**
   * Варіант, Продукт B2, може коректно працювати тільки з варіантом
   * Продукту A2. Проте, він приймає будь-який екземпляр AbstractProductA як
   * аргумент.
   */
  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
      const result = collaborator.usefulFunctionA();
      return `Результат B2 у співпраці з (${result})`;
  }
}

/**
* Клієнтський код працює з фабриками та продуктами тільки через абстрактні
* типи: AbstractFactory та AbstractProduct. Це дозволяє передавати будь-яку фабрику або
* підклас продукту в клієнтський код без порушення його роботи.
*/
function clientCode(factory: AbstractFactory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();

  console.log(productB.usefulFunctionB());
  console.log(productB.anotherUsefulFunctionB(productA));
}

/**
* Клієнтський код може працювати з будь-яким класом конкретної фабрики.
*/
console.log('Клієнт: Тестуємо клієнтський код з першим типом фабрики...');
clientCode(new ConcreteFactory1());

console.log('Клієнт: Тестуємо той самий клієнтський код з другим типом фабрики...');
clientCode(new ConcreteFactory2());
