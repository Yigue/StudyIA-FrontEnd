import { Params } from '../../types';
import { Summary } from '../../types/summary/summary';
import { SummaryCreateDTO, SummaryUpdateDTO } from '../../types/summary/summaryRequest';
import { httpClient } from '../api/httpClient';

// Obtener todos los resúmenes con paginación
export async function getAllSummaries(params?: Params) {
  return httpClient<Summary>('/summaries', {
    method: 'GET',
    params
  });
}

// Obtener un resumen específico
export async function getSummaryById(id: string) {
  return httpClient<Summary>(`/summaries/${id}`, {
    method: 'GET'
  });
}

// Obtener resúmenes por material
export async function getSummariesByMaterial(materialId: string) {
  return httpClient<Summary[]>(`/summaries/material/${materialId}`, {
    method: 'GET'
  });
}

// Crear un resumen
export async function createSummary(summaryData: SummaryCreateDTO) {
  return httpClient<Summary, SummaryCreateDTO>('/summaries', {
    method: 'POST',
    data: summaryData
  });
}

// Actualizar un resumen
export async function updateSummary(id: string, summaryData: SummaryUpdateDTO) {
  return httpClient<Summary, SummaryUpdateDTO>(`/summaries/${id}`, {
    method: 'PUT',
    data: summaryData
  });
}

// Eliminar un resumen
export async function deleteSummary(id: string) {
  return httpClient<void>(`/summaries/${id}`, {
    method: 'DELETE'
  });
}
