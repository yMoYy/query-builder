import { QueryResultBase, QueryResultRow } from "pg";

export interface QBConnection {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export interface DataSource extends QBConnection {
  provider?: string = "Postgres";
  url?: string;
}

export interface Database {
  name:string;
}

export interface PostgresColumn {
  name: string;
  type: string;
  constraints?: Array<Constraint>
}

export interface Constraint {
  field: string;
}

export interface PostgresTable {
  tableName: string;
  columns: Array<PostgresColumn>
}

export interface QueryPostgreSQL {
  text: string;
  values?: any[];
}

export interface PostgreSQLOptions {
  id?: string;
  table: string;
  columnId?: string;
  columns: Array<string>;
  conditions?: Array<string>;
  values?: any[];
}

export interface PgJoinOptions extends PostgreSQLOptions {
  join: PgJoinType;
  tables: Array<string>;
  keys: Array<string>;
}

export interface EntityResult<T> {
  msg: string,
  entity: T | string,
  error?: any
}

export const enum PgJoinType {
  CROSS = "CROSS JOIN",
  INNER = "INNER JOIN",
  LEFT = "LEFT OUTER JOIN",
  RIGHT = "RIGTH OUTER JOIN",
  FULL = "FULL OUTER JOIN"
}

export const enum QueryAction {
  INSERT = "[ACTION] INSERTED",
  UPDATE = "[ACTION] UPDATED",
  DELETE = "[ACTION] DELETED"
}

