const model = "Sale";
const db = require("./../models");
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const moment = require("moment");
require("moment/locale/es");
const sequelize = new Sequelize("db_gestion_dev", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

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
async function get(querys, date) {
  const { pagination, order, direction, limit, offset } = querys;
  let sales;

  if (!!date.year) {
    sales = await db[model].findAndCountAll({
      where: sequelize.where(
        sequelize.fn("EXTRACT", sequelize.literal("YEAR FROM date")),
        date.year
      ),
      include: [
        {
          model: db["Product"],
          as: "product",
        },
      ],
      raw: true,
      limit: pagination ? limit : null,
      offset: pagination ? offset : null,
      order: [[order, direction]],
    });
    return sales;
  } else if (!!date.month) {
    sales = await db[model].findAndCountAll({
      where: sequelize.where(
        sequelize.fn("EXTRACT", sequelize.literal("MONTH FROM date")),
        date.month
      ),
      include: [
        {
          model: db["Product"],
          as: "product",
        },
      ],
      raw: true,
      limit: pagination ? limit : null,
      offset: pagination ? offset : null,
      order: [[order, direction]],
    });
    return sales;
  } else if (!!date.day) {
    sales = await db[model].findAndCountAll({
      where: sequelize.where(
        sequelize.fn("EXTRACT", sequelize.literal("DAY FROM date")),
        date.day
      ),
      include: [
        {
          model: db["Product"],
          as: "product",
        },
      ],
      raw: true,
      limit: pagination ? limit : null,
      offset: pagination ? offset : null,
      order: [[order, direction]],
    });
    return sales;
  } else {
    sales = await db[model].findAndCountAll({
      where: {},
      include: [
        {
          model: db["Product"],
          as: "product",
        },
      ],
      raw: true,
      limit: pagination ? limit : null,
      offset: pagination ? offset : null,
      order: [[order, direction]],
    });
    return sales;
  }
}

async function getMonths(querys) {
  moment.locale("es");
  const { pagination, direction, limit, offset } = querys;

  const monthSales = await db[model].findAll({
    attributes: [
      [sequelize.fn("EXTRACT", sequelize.literal("MONTH FROM date")), "month"],
      [sequelize.fn("COUNT", sequelize.col("quantity")), "sales"],
    ],
    group: [sequelize.literal("EXTRACT(MONTH FROM date)")],
    order: [[sequelize.literal("month"), direction]],
    limit: pagination ? limit : null,
    offset: pagination ? offset : 0,
  });

  const months = monthSales.map((sale) => {
    const monthNumber = sale.dataValues.month;
    const monthName = moment()
      .month(monthNumber - 1)
      .format("MMMM")
      .replace(/\b\w/g, (match) => match.toUpperCase());
    return { month: monthName, sales: sale.dataValues.sales };
  });
  return months;
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
  let sale = [];
  if (body.products.length > 0) {
    for (const element of body.products) {
      sale.push( await db[model].create({
        productId:element.product.id,
        quantity: element.quantity,
        date: moment()
      }));
    }
  console.log(body);
  } else if (!body.id) {
    sale[0] = await db[model].create({
      productId: body.productId,
      quantity: body.quantity,
      date: body.date,
    });
  } else {
    sale[0] = await db[model].findByPk(body.id);
    if (!sale) {
      throw new Error(`Sale with ID ${body.id} not found.`);
    }
    await sale.update({
      productId: body.productId,
      quantity: body.quantity,
      date: body.date,
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
    throw new Error(`Sale with ID ${id} not found.`);
  }

  await sale.destroy();
  return `The sale ${id} has been deleted.`;
}

module.exports = { get, createOrUpdate, destroy, getMonths };
