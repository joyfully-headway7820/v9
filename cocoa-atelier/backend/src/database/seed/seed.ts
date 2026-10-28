import { join } from 'path';
import { DataSource } from 'typeorm';
import { getDataSourceOptions } from '../getDataSourceOptions.js';
import { AppUser } from '../entities/AppUser.js';
import { Material } from '../entities/Material.js';
import { MaterialProduct } from '../entities/MaterialProduct.js';
import { MaterialSupplier } from '../entities/MaterialSupplier.js';
import { MaterialType } from '../entities/MaterialType.js';
import { Product } from '../entities/Product.js';
import { ProductType } from '../entities/ProductType.js';
import { Role } from '../entities/Role.js';
import { Supplier } from '../entities/Supplier.js';
import { SupplierType } from '../entities/SupplierType.js';
import { parseDate } from './parseDate.js';
import { parseNumber } from './parseNumber.js';
import { parseYesNo } from './parseYesNo.js';
import { readSheet } from './readSheet.js';

// Запуск: npm run seed [папка с csv], по умолчанию ../import
process.loadEnvFile();
const importDir = process.argv[2] ?? join(process.cwd(), '..', 'import');
const sheet = (name: string) =>
  readSheet(join(importDir, `CA_${name}_import.csv`));

// Ищет id по имени и сообщает, если в файлах есть ссылка на несуществующую запись
function findId(
  ids: Map<string, number>,
  name: string,
  entityTitle: string,
): number {
  const id = ids.get(name);
  if (id === undefined)
    throw new Error(`${entityTitle} «${name}» не найден(а) в данных импорта`);
  return id;
}

const dataSource = new DataSource(getDataSourceOptions(process.env));
await dataSource.initialize();

await dataSource.transaction(async (manager) => {
  await manager.query(
    'TRUNCATE material_supplier, material_product, app_user, role, supplier, supplier_type, product, material, product_type, material_type RESTART IDENTITY CASCADE',
  );

  const materialTypes = await manager.save(
    MaterialType,
    (await sheet('Material_type')).map(([materialTypeName, loss]) => ({
      materialTypeName,
      lossPercent: parseNumber(loss, 2),
    })),
  );
  const materialTypeIds = new Map(
    materialTypes.map(({ materialTypeName, materialTypeId }) => [
      materialTypeName,
      materialTypeId,
    ]),
  );

  const productTypes = await manager.save(
    ProductType,
    (await sheet('Product_type')).map(([productTypeName, coefficient]) => ({
      productTypeName,
      productTypeCoefficient: parseNumber(coefficient, 2),
    })),
  );
  const productTypeIds = new Map(
    productTypes.map(({ productTypeName, productTypeId }) => [
      productTypeName,
      productTypeId,
    ]),
  );

  const materials = await manager.save(
    Material,
    (await sheet('Materials')).map(
      ([materialName, typeName, price, stock, min, packageQuantity, unit]) => ({
        materialName,
        materialTypeId: findId(materialTypeIds, typeName, 'Тип материала'),
        unitPrice: parseNumber(price, 2),
        stockQuantity: parseNumber(stock, 3),
        minQuantity: parseNumber(min, 3),
        packageQuantity: parseNumber(packageQuantity, 3),
        unit,
      }),
    ),
  );
  const materialIds = new Map(
    materials.map(({ materialName, materialId }) => [materialName, materialId]),
  );

  const products = await manager.save(
    Product,
    (await sheet('Products')).map(
      ([productArticle, typeName, productName, price]) => ({
        productArticle,
        productName,
        productTypeId: findId(productTypeIds, typeName, 'Тип продукции'),
        minPartnerPrice: parseNumber(price, 2),
      }),
    ),
  );
  const productIds = new Map(
    products.map(({ productName, productId }) => [productName, productId]),
  );

  await manager.save(
    MaterialProduct,
    (await sheet('Material_products')).map(
      ([materialName, productName, quantity]) => ({
        materialId: findId(materialIds, materialName, 'Материал'),
        productId: findId(productIds, productName, 'Продукция'),
        materialQuantity: parseNumber(quantity, 4),
      }),
    ),
  );

  // Типы поставщиков отдельного файла не имеют, берём уникальные значения из файла поставщиков
  const supplierRows = await sheet('Suppliers');
  const supplierTypes = await manager.save(
    SupplierType,
    [
      ...new Set(supplierRows.map(([supplierTypeName]) => supplierTypeName)),
    ].map((supplierTypeName) => ({ supplierTypeName })),
  );
  const supplierTypeIds = new Map(
    supplierTypes.map(({ supplierTypeName, supplierTypeId }) => [
      supplierTypeName,
      supplierTypeId,
    ]),
  );

  const suppliers = await manager.save(
    Supplier,
    supplierRows.map(([typeName, supplierName, inn, rating, startDate]) => ({
      supplierTypeId: findId(supplierTypeIds, typeName, 'Тип поставщика'),
      supplierName,
      inn,
      rating: parseNumber(rating, 0),
      startDate: parseDate(startDate),
    })),
  );
  const supplierIds = new Map(
    suppliers.map(({ supplierName, supplierId }) => [supplierName, supplierId]),
  );

  await manager.save(
    MaterialSupplier,
    (await sheet('Material_suppliers')).map(
      ([materialName, supplierName, price, deliveryDays]) => ({
        materialId: findId(materialIds, materialName, 'Материал'),
        supplierId: findId(supplierIds, supplierName, 'Поставщик'),
        purchasePrice: parseNumber(price, 2),
        deliveryDays: parseNumber(deliveryDays, 0),
      }),
    ),
  );

  // Первый столбец файла ролей (ID) не читаем: идентификаторы выдаёт база по порядку строк
  const roles = await manager.save(
    Role,
    (await sheet('Roles')).map(([, roleName, roleDescription]) => ({
      roleName,
      roleDescription,
    })),
  );
  const roleIds = new Map(
    roles.map(({ roleName, roleId }) => [roleName, roleId]),
  );

  const users = await manager.save(
    AppUser,
    (await sheet('Users')).map(
      ([login, fullName, roleName, email, isActive]) => ({
        login,
        fullName,
        roleId: findId(roleIds, roleName, 'Роль'),
        email,
        isActive: parseYesNo(isActive),
      }),
    ),
  );

  console.log(
    `Импортировано: типов материалов ${materialTypes.length}, типов продукции ${productTypes.length}, ` +
      `материалов ${materials.length}, продукции ${products.length}, рецептур ${await manager.count(MaterialProduct)}, ` +
      `типов поставщиков ${supplierTypes.length}, поставщиков ${suppliers.length}, ` +
      `поставок материалов ${await manager.count(MaterialSupplier)}, ролей ${roles.length}, пользователей ${users.length}`,
  );
});

await dataSource.destroy();
