import { Summary } from '../../types';
import { summaryCreatedDTO } from '../../types/summary/summaryRequest';
import { httpClient } from '../api/httpClient';

export async function getAllSummaries(authToken: string) {
  return httpClient<Summary[]>('/summary', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function getSummaryById(id: string, authToken: string) {
  return httpClient<Summary>(`/summary/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function getSummariesByMaterial(materialId: string, authToken: string) {
  return httpClient<Summary[]>(`/summary/material/${materialId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function createSummary(summaryData:summaryCreatedDTO, authToken: string) {
  return httpClient<Summary,summaryCreatedDTO>('/summary', {
    method: 'POST',
    data: summaryData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function updateSummary(id: string, summaryData: summaryCreatedDTO, authToken: string) {
  return httpClient<Summary,summaryCreatedDTO>(`/summary/${id}`, {
    method: 'PUT',
    data: summaryData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function deleteSummary(id: string, authToken: string) {
  return httpClient<void>(`/summary/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}
