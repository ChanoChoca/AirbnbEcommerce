import {HttpParams} from "@angular/common/http";

// Interfaz para la estructura de los parámetros de paginación
export interface Pagination {
  page: number;
  size: number;
  sort: string[];
}

// Interfaz para la estructura de la paginación que se recibe desde el servidor
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Interfaz para la estructura de la ordenación
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Interfaz para la estructura de una página de resultados
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  sort: Sort;
  number: number;
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Función para crear los parámetros de paginación para una solicitud HTTP
export const createPaginationOption = (req: Pagination): HttpParams => {
  let params = new HttpParams();
  // Añadir los parámetros de página y tamaño
  params = params.append("page", req.page).append("size", req.size);

  // Añadir los parámetros de ordenación
  req.sort.forEach(value => {
    params = params.append("sort", value);
  });

  return params;
};
