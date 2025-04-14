/**
 * Clase para representar queries ya asociadas con parámetros.
 */
class ParameterizedQuery {
  constructor(
    public query: string,
    public params: any[],
  ) {};
}

export default ParameterizedQuery;