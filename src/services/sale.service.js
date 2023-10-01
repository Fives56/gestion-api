const model = "Sale";
const db = require("./../models");
const Op = db.Sequelize.Op;

/**
 * Get the sales
 * @param {string} querys.search - String to search
 * @param {string} querys.order - Property to sort by
 * @param {string} querys.direction - Direction of the order (asc or desc) 
 * @param {boolean} querys.pagination - Boolean to paginate
 * @param {number} querys.limit - Limit of sales per page
 * @param {number} querys.offset - Number of product to skip
 * @returns The sales
 */
async function get(querys) {
    const { search, pagination, order, direction, limit, offset } = 
    querys;
  const sales = await db[model].findAndCountAll({
    where: {
    },
    raw: true,
    limit: pagination ? limit : null,
    offset: pagination ? offset : null,
    order: [[order, direction]]
  });
  return sales;
}

/**
 * Create or update the sale
 * @param {Object} body - Contains id, productId, quantity, and date
 * @param {number} body.id - Id of the sale to be updated
 * @param {string} body.productId - product sold id
 * @param {string} body.quantity - Amount of  product sold
 * @param {number} body.date - Date of the sale
 * @returns The sale created or updated
 * @throws {Error} If the id not exist in the data base throws a error
 */
async function createOrUpdate(body) {
  let sale;
  if (!body.id) {
    sale = await db[model].create({
      productId: body.productId,
      quantity: body.quantity,
      date: body.date
    });
  } else {
    sale = await db[model].findByPk(body.id);
    if (!sale) {
      throw new Error(`Sale with ID ${body.id} not found.`);
    }

    await sale.update({
      productId: body.productId,
      quantity: body.quantity,
      date: body.date
    });
  }
  return sale;
}

/**
 * Delete a sale by id
 * @param {number} id - Id of the sale to be delete 
 * @returns A menssage
 * @throws {Error} - Throws a error if the id is not in the data base
 */
async function destroy(id) {
  const sale = await db[model].findByPk(id);
  if (!sale) {
    throw new Error(`Sale with ID ${id} not found.`)
  }

  await sale.destroy();
  return `The sale ${id} has been deleted.`;
}

module.exports = { get, createOrUpdate, destroy};