const model = "Product";
const db = require("./../models");
const Op = db.Sequelize.Op;

/**
 * Get the product
 * @param {string} querys.search - String to search
 * @param {string} querys.order - Property to sort by
 * @param {string} querys.direction - Direction of the order (asc or desc) 
 * @param {boolean} querys.pagination - Boolean to paginate
 * @param {number} querys.limit - Limit of product per page
 * @param {number} querys.offset - Number of product to skip
 * @param {number} querys.category - Category
 * @returns The product
 */
async function get(querys) {
    const { search, pagination, order, direction, limit, offset, category } = 
    querys;
  const product = await db[model].findAndCountAll({
    where: {
      [Op.and]: [
        search && {
          [Op.or]: [
            {name: {[Op.iLike]: '%'+ search +'%'}},
            {amount: {[Op.iLike]: '%'+ search +'%'}},
          ]
        },
      ],
    },
    raw: true,
    limit: pagination ? limit : null,
    offset: pagination ? offset : null,
    order: [[order, direction]]
  });
  return product;
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
    throw new Error(`Product with ID ${id} not found.`)
  }

  await product.destroy();
  return `The product ${id} has been deleted.`;
}


module.exports = { get, createOrUpdate, destroy};