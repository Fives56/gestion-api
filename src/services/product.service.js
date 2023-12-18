const model = "Product";
const db = require("./../models");
const Op = db.Sequelize.Op;
const { Product, Sale, sequelize } = require("../models"); // Asegúrate de importar correctamente tus modelos

/**
 * Get the product
 * @param {string} querys.search - String to search
 * @param {string} querys.order - Property to sort by
 * @param {string} querys.direction - Direction of the order (asc or desc)
 * @param {boolean} querys.pagination - Boolean to paginate
 * @param {number} querys.limit - Limit of product per page
 * @param {number} querys.offset - Number of product to skip
 * @returns The product
 */

async function get(querys) {
  const { search, pagination, order, direction, limit, offset, category } =
    querys;
  const product = await db[model].findAndCountAll({
    include: [
      {
        model: db["Sale"],
        as: "sales",
      },
    ],
    where: {
      [Op.and]: [
        search && {
          [Op.or]: [
            { name: { [Op.iLike]: "%" + search + "%" } },
            { amount: { [Op.iLike]: "%" + search + "%" } },
          ],
        },
      ],
    },
    raw: true,
    limit: pagination ? limit : null,
    offset: pagination ? offset : null,
    order: [[order, direction]],
  });
  return product;
}

/* async function getPoductById(id) {
  const product = await db[model].findByPk(id);
  return product;
} */

/**
 * Get the sales of a product
 * @param {string} querys.search - String to search
 * @param {string} querys.order - Property to sort by
 * @param {string} querys.direction - Direction of the order (asc or desc)
 * @param {boolean} querys.pagination - Boolean to paginate
 * @param {number} querys.limit - Limit of product per page
 * @param {number} querys.offset - Number of sales to skip
 * @returns The sales
 */
async function getProductSales(querys, id) {
  const { search, pagination, order, direction, limit, offset } = querys;

  const product = await db[model].findByPk(id);
  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    }); /* new Error('Product not found'); */
  }

  const sales = await product.getSales({
    where: {
      [Op.and]: [
        search && {
          [Op.or]: [
            { name: { [Op.iLike]: "%" + search + "%" } },
            { amount: { [Op.iLike]: "%" + search + "%" } },
          ],
        },
      ],
    },
    raw: true,
    limit: pagination ? limit : null,
    offset: pagination ? offset : null,
    order: [[order, direction]],
  });
  return sales;
}

/**
 * Performs a database query to retrieve products sold today and the quantity of each sale.
 * @returns {Promise<Array<{ name: string, value: number }>>} A promise that resolves to an array of objects containing the product name and the quantity of sales.
 */

async function getSoldProducts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Product.findAll({
    attributes: [
      "id",
      "name",
      "price",
      "amount",
      "createdAt",
      "updatedAt",
      [
        sequelize.literal(`
          COALESCE(
            (SELECT SUM("quantity")
            FROM "Sales"
            WHERE "Sales"."productId" = "Product"."id"
            AND "Sales"."date" >= '${today.toISOString()}'
            ), 0
          )
        `),
        "totalSales",
      ],
    ],
    raw: true,
  }).then((products) => {
    const results = products.map((product) => ({
      name: product.name,
      value: parseInt(product.totalSales) || 0,
    }));
    return results;
  });
}
/**
 * Create or update the product
 * @param {Object} body - Contains name, price, and amount
 * @param {number} body.id - Id of the product to be updated
 * @param {string} body.name - Name of the product
 * @param {string} body.amount - Amount of the product
 * @param {number} body.price - Price of the product
 * @returns The product created or updated
 * @throws {Error} If the id not exist in the data base throws a error
 */
async function createOrUpdate(body) {
  let product;
  if (!body.id) {
    product = await db[model].create({
      name: body.name,
      amount: body.amount,
      price: body.price,
    });
  } else {
    product = await db[model].findByPk(body.id);
    if (!product) {
      throw new Error(`Product with ID ${body.id} not found.`);
    }

    await product.update({
      name: body.name,
      amount: body.amount,
      price: body.price,
    });
  }
  return product;
}

/**
 * Delete a product by id
 * @param {number} id - Id of the product to be delete
 * @returns A menssage
 * @throws {Error} - Throws a error if the id is not in the data base
 */
async function destroy(id) {
  const product = await db[model].findByPk(id);
  if (!product) {
    throw new Error(`Product with ID ${id} not found.`);
  }

  await product.destroy();
  return `The product ${id} has been deleted.`;
}

module.exports = {
  get,
  createOrUpdate,
  destroy,
  getProductSales,
  getSoldProducts,
};
