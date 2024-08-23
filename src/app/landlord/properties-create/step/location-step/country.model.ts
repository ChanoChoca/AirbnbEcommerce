// Define la interfaz para nombres oficiales y comunes de un país
export interface OfficialAndCommon {
  common: string;   // Nombre común del país
  official: string; // Nombre oficial del país
}

// Define la interfaz para el nombre de un país, incluyendo nombres en diferentes idiomas
export interface CountryName extends OfficialAndCommon {
  native: {
    [languageCode: string]: OfficialAndCommon; // Nombres oficiales y comunes en diferentes idiomas
  }
}

// Define la interfaz para la moneda de un país
export interface Currency {
  name: string;  // Nombre de la moneda
  symbol: string; // Símbolo de la moneda
}

// Define la interfaz para el código de marcación internacional
export interface IntlDirectDialingCode {
  root: string;   // Código raíz de marcación
  suffixes: string[]; // Sufijos para la marcación internacional
}

// Define la interfaz para los demónimos (término usado para describir a los habitantes de un país)
export interface Demonyms {
  f: string; // Demónimo femenino
  m: string; // Demónimo masculino
}

// Define la interfaz para un país con todas sus propiedades relevantes
export interface Country {
  name: CountryName;   // Nombre del país en diferentes idiomas
  tld: string[];       // Dominio de nivel superior (ej. ".us" para Estados Unidos)
  cca2: string;        // Código de país de dos letras (ej. "US")
  ccn3: string;        // Código de país de tres dígitos (ej. "840")
  cca3: string;        // Código de país de tres letras (ej. "USA")
  cioc: string;        // Código del Comité Olímpico Internacional (ej. "USA")
  independent: boolean; // Indica si el país es independiente
  status: string;      // Estado del país (ej. "official", "deprecated")
  currencies: { [currencyCode: string]: Currency }; // Monedas utilizadas por el país
  idd: IntlDirectDialingCode; // Código de marcación internacional
  capital: string[];  // Capitales del país
  altSpellings: string[]; // Variantes de la ortografía del nombre del país
  region: string;     // Región del país (ej. "América del Norte")
  subregion: string; // Subregión del país (ej. "América del Norte")
  languages: { [languageCode: string]: string }; // Idiomas hablados en el país
  translations: { [languageCode: string]: OfficialAndCommon }; // Traducciones del nombre del país
  latlng: [number, number]; // Coordenadas geográficas (latitud, longitud)
  demonyms: { [languageCode: string]: Demonyms }; // Demónimos en diferentes idiomas
  landlocked: boolean; // Indica si el país es sin salida al mar
  borders: string[];  // Códigos de países vecinos
  area: number;       // Área del país en kilómetros cuadrados
  flag: string;       // URL del flag del país
}

// Define un tipo para una lista de países
export type Countries = Country[];
