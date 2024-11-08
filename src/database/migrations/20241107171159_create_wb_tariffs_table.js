/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function (knex) {
  return knex.schema.createTable('wb_tariffs', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('warehouseName').notNullable();
    table.float('boxDeliveryAndStorageExpr').notNullable();
    table.float('boxDeliveryBase').notNullable();
    table.float('boxDeliveryLiter').notNullable();
    table.float('boxStorageBase').nullable();
    table.float('boxStorageLiter').nullable();
    table.date('dtNextBox').nullable();
    table.date('dtTillMax').notNullable();
    table.timestamp('exportedAt').nullable();
    table.timestamps(true, true, true);

    table.unique(['warehouseName', 'dtNextBox']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('wb_tariffs');
};
