import { Constraint } from "../types";

const enum ColumnType {
  UNIQUE = "UNIQUE",
  NOT_NULL = "NOT NULL",
  NULL = "NULL",
  PRIMARY_KEY = "PRIMARY KEY",
  FOREIGN_KEY = "FOREIGN KEY"
}

/*["NOT_NULL", "NULL","UNIQUE", "DEFAULT"]*/

export function validateTypes(
  constraints:Array<Constraint>
):void {
  let count:number = 0;
  constraints.forEach(constraint => {
    if (
      constraint.field !== ColumnType.UNIQUE &&
      constraint.field !== ColumnType.NOT_NULL &&
      constraint.field !== ColumnType.NULL &&
      constraint.field !== ColumnType.PRIMARY_KEY &&
      constraint.field !== ColumnType.FOREIGN_KEY
    ) {
      throw new Error ("Constraint not valid");
    }
    if (constraint.field === ColumnType.NOT_NULL) {
      constraints.forEach(check => {
        if(check.field === ColumnType.NULL) {
          throw new Error ("Constraint not valid");
        }
      });
    }
  });


}