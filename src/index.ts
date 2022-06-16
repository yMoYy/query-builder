import PostgreSchema from "./models/Postgres";
import { EntityResult, PgJoinOptions, PgJoinType, PostgreSQLOptions, PostgresTable, QBConnection } from "./types";

const conn: QBConnection = {
  user: "postgres",
  host: "localhost",
  database: "cinemajs",
  password: "proot",
  port: 5432,
};

interface User {
  user_id: string;
  u_name: string;
  u_last_name: string;
  u_email: string;
  u_password: string;
  u_image: string;
  u_phone: number;
  u_adress: string;
  u_state: boolean;
  role_id: number;
}

const pg:PostgreSchema<User> = new PostgreSchema<User>(conn);
const id: string = "5ndxql0o-s0tu-43wg-idjs-hadf94h208ha";

async function createModel() {
  const pg: PostgreSchema<User> = new PostgreSchema<User>(conn);
  const model: PostgresTable = {
    tableName: "Users",
    columns: [
      { name: "userId", type: "text" },
      { name: "name", type: "text" },
      { name: "email", type: "text" },
      { name: "password", type: "text" },
      { name: "role", type: "int" },
    ],
  };
  pg.createTable(model);
}

async function getUser() {
  const queryValues: PostgreSQLOptions = { 
    id, 
    table: "users",
    columnId: "user_id",
    columns: ["user_id", "u_name", "u_last_name", "role_id"]
    //columns: ["*"]
  };
  const user: User | undefined = await pg.findOneById(queryValues);
  console.log(user);
}

async function getAllUsers() {
  const queryValues: PostgreSQLOptions = {
    table: "users",
    columns: ["*"]
  };
  const users: Array<User> | undefined = await pg.getAll(queryValues);
  console.log(users);
}

async function getAllUsersWithCondition() {
  const queryValues: PostgreSQLOptions = {
    table: "users",
    columns: ["user_id", "u_name", "u_last_name", "role_id"], 
    //columns: ["*"], 
    conditions: ["role_id"],
    values: [2]
  };
  const users: Array<User> | undefined = await pg.getAll(queryValues);
  console.log(users);
}

async function getAllUsersWithSecondCondition() {
  const queryValues: PostgreSQLOptions = {
    table: "users",
    columns: [ "u_name", "u_last_name", "role_id"],
    //columns: [ "*"],
    conditions: ["role_id", "u_state"],
    values: [2, true]
  };
  const users: Array<User> | undefined = await pg.getAllWithTwoConditions(queryValues);
  console.log(users);
}

async function getAllMoviesComments() {
  const queryValues: PgJoinOptions = {
    columns: [ "movies.movie_id", "m_name", "m_description", "comments_.movie_id", "comment_id", "c_description"],
    //columns: [ "*"],
    table: "movies",
    join: PgJoinType.FULL,
    keys: ["movie_id"],
    tables: ["comments_"],
    columnId: "movie_id",
    id: "th39b4tm4n-20kzc"
  };
  const users: Array<User> | undefined = await pg.joinTwoTables(queryValues);
  console.log(users);
}

async function insertUser() {
  const queryValues:PostgreSQLOptions = {
    table: "users",
    columns: ["user_id", "u_name", "u_last_name", "u_email", "u_password", "u_image", "u_phone", "u_adress", "u_state", "role_id"],
    values: ["9or8th3o-9kgh-oahn-test-123a0280op0j", "test@1", "T@1", "test_test1@correo.com", "12345678", "", "58", "Av. Test", "true", "2"]
  }
  const entity: EntityResult<User> = await pg.insertInto(queryValues);
  console.log(entity);
}

async function deleteUser() {
  const queryValues:PostgreSQLOptions = {
    table: "users",
    columns: ["user_id"],
    id: "9or8th3o-9kgh-oahn-test-123a0280op0j",
  }
  const entity: EntityResult<User> = await pg.findAndDelete(queryValues);
  console.log(entity);
}

async function updateUser() {
  const queryValues:PostgreSQLOptions = {
    table: "users",
    columns: ["u_email"],
    columnId: "user_id",
    id: "9or8th3o-9kgh-oahn-test-123a0280op0j",
    values: ["test.1@correo.com"]
  }
  const entity: EntityResult<User> = await pg.findAndUpdate(queryValues)
  console.log(entity);
}