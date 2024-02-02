export const userIdExpression = (userId: string) => ({
  expression: "#user_id = :user_id",
  expression_attributes: { "#user_id": "user_id" },
  expression_values: { ":user_id": userId },
});

export const moduleIdExpression = (moduleId: string) => ({
  expression: "#module_id = :module_id",
  expression_attributes: { "#module_id": "module_id" },
  expression_values: { ":module_id": moduleId },
});