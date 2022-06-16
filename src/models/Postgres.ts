import { Pool, QueryResult } from "pg";
import {
  DataSource,
  QBConnection,
  PostgresTable,
  QueryPostgreSQL,
  PostgreSQLOptions,
  QueryAction,
  PgJoinOptions,
  EntityResult,
} from "../types";

class PostgreSchema<T> {
  private datasource?: DataSource;
  private connection: QBConnection;

  constructor(connection: QBConnection, datasource?: DataSource) {
    this.connection = connection;
    this.datasource = datasource;
  }

  async createTable(model: PostgresTable): Promise<void> {
    try {
      const { tableName, columns }: PostgresTable = model;
      let nameColumns: Array<string> = columns.map(
        (column) => `${column.name} ${column.type.toUpperCase()}`
      );
      console.log(nameColumns);
      const pool: Pool = new Pool(this.connection);
      const query: QueryPostgreSQL = {
        text: `
          CREATE TABLE ${tableName} (
            ${nameColumns}
          );
        `,
      };
      await pool.query(query);
      await pool.end();
    } catch (error) {
      console.log(error);
    }
  }

  async customQuery(query: QueryPostgreSQL): Promise<Array<T> | undefined> {
    try {
      const pool: Pool = new Pool(this.connection);
      const queryResult: QueryResult<any> = await pool.query(query);
      const rows: Array<T> = queryResult.rows;
      if (!rows) {
        throw new Error("Data not available");
      }
      await pool.end();
      return rows;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async getAll(params: PostgreSQLOptions): Promise<Array<T> | undefined> {
    try {
      const { table }: PostgreSQLOptions = params;
      const pool: Pool = new Pool(this.connection);
      let query: QueryPostgreSQL = {
        text: `SELECT ${params.columns} FROM ${table}`,
      };
      if (params.conditions) {
        query = {
          text: `SELECT ${params.columns} FROM ${table} WHERE ${params.conditions[0]} = $1`,
          values: params.values,
        };
      }
      const queryResult: QueryResult<any> = await pool.query(query);
      const rows: Array<T> = queryResult.rows;
      if (!rows) {
        throw new Error("Data not available");
      }
      await pool.end();
      return rows;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async getAllWithTwoConditions(
    params: PostgreSQLOptions
  ): Promise<Array<T> | undefined> {
    try {
      const { table }: PostgreSQLOptions = params;
      const pool: Pool = new Pool(this.connection);
      let query: QueryPostgreSQL = {
        text: `SELECT ${params.columns} FROM ${table}`,
      };
      if (params.conditions) {
        query = {
          text: `SELECT ${params.columns} FROM ${table} WHERE ${params.conditions[0]} = $1 AND ${params.conditions[1]} = $2`,
          values: params.values,
        };
      }
      const queryResult: QueryResult<any> = await pool.query(query);
      const rows: Array<T> = queryResult.rows;
      if (!rows) {
        throw new Error("Data not available");
      }
      await pool.end();
      return rows;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  async findOneById(params: PostgreSQLOptions): Promise<T | undefined> {
    try {
      const { id, table, columnId }: PostgreSQLOptions = params;
      const pool: Pool = new Pool(this.connection);
      let query: QueryPostgreSQL = {
        text: `SELECT ${params.columns} FROM ${table} WHERE ${columnId} = $1`,
        values: [id],
      };
      const queryResult: QueryResult<any> = await pool.query(query);
      const entityFound: T = queryResult.rows[0];
      if (!entityFound) {
        throw new Error("Entity not found");
      }
      await pool.end();
      return entityFound;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async joinTwoTables(params: PgJoinOptions): Promise<Array<T> | undefined> {
    try {
      const { id, table, tables, columnId, join }: PgJoinOptions = params;
      const pool: Pool = new Pool(this.connection);
      let query: QueryPostgreSQL = {
        text: `
          SELECT ${params.columns}
          FROM ${table}
          ${join} ${tables[0]}
          ON ${table}.${params.keys[0]} = ${tables[0]}.${params.keys[0]}
          WHERE ${table}.${columnId} = $1;
        `,
        values: [id],
      };
      const queryResult: QueryResult<any> = await pool.query(query);
      const entityFound: Array<T> = queryResult.rows;
      if (!entityFound) {
        throw new Error("Entity not found");
      }
      await pool.end();
      return entityFound;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async insertInto(params: PostgreSQLOptions): Promise<EntityResult<T>> {
    const { table, columns, values }: PostgreSQLOptions = params;
    const iter = columns.map((_column, index) => {
      return `$${index+1}`;
    });
    try {
      const pool: Pool = new Pool(this.connection);
      const query: QueryPostgreSQL = {
        text: `
          INSERT INTO ${table} (${columns})
          VALUES (${iter})
          RETURNING *
        `,
        values,
      };
      const queryResult: QueryResult<any> = await pool.query(query);
      const entityFound: T = queryResult.rows[0];
      if (!entityFound) {
        throw new Error("Entity not found");
      }
      await pool.end();
      return {
        msg: QueryAction.INSERT,
        entity: entityFound,
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        msg: "Ups... somethig went wrong",
        entity: "Entity not found"
      }
    }
  }
  
  async findAndDelete(params: PostgreSQLOptions): Promise<EntityResult<T>> {
    const { id, table, columns }: PostgreSQLOptions = params;
    try {
      const pool: Pool = new Pool(this.connection);
      const query: QueryPostgreSQL = {
        text: `
          DELETE FROM ${table}
          WHERE ${columns} = '${id}'
          RETURNING *
        `,
      };
      const queryResult: QueryResult<any> = await pool.query(query);
      const entityFound: T = queryResult.rows[0];
      if (!entityFound) {
        throw new Error("Entity not found");
      }
      await pool.end();
      return {
        msg: QueryAction.DELETE,
        entity: entityFound,
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        msg: "Ups... somethig went wrong",
        entity: "Entity not found"
      }
    }
  }

  async findAndUpdate(params: PostgreSQLOptions): Promise<EntityResult<T>>{
    const { id, table, columns, columnId, values }: PostgreSQLOptions = params;
    try {
      const pool: Pool = new Pool(this.connection);
      const iter = columns.map((_column, index) => {
        return `$${index+1}`;
      });
      const query: QueryPostgreSQL = {
        text: `
          UPDATE ${table}
          SET ${columns} = ${iter}
          WHERE ${columnId} = '${id}'
          RETURNING *
        `,
        values
      };
      const queryResult: QueryResult<any> = await pool.query(query);
      const entityFound: T = queryResult.rows[0];
      if (!entityFound) {
        throw new Error("Entity not found");
      }
      await pool.end();
      return {
        msg: QueryAction.UPDATE,
        entity: entityFound,
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        msg: "Ups... somethig went wrong",
        entity: "Entity not found"
      }
    }
  }
}

export default PostgreSchema;