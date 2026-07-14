// Wrapper per validare body con Zod
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Dati non validi",
      details: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};
