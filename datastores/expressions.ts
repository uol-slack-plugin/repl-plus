export const userIdExpression = (userId: string) => ({
  expression: "#user_id = :user_id",
  expression_attributes: { "#user_id": "user_id" },
  expression_values: { ":user_id": userId },
});
