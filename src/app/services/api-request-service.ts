import { Injectable } from '@angular/core';
import { Settings } from '../common/settings';
import { HttpClient } from '@angular/common/http';
import { Paper, FetchPapersResponse, SinglePaperResponse } from '../common/paper';
import { from, Observable, of } from 'rxjs';
import * as usersData from '../common/results.json';
import { ComparisonResultSet, ParagraphResult, ComparisonResult } from '../common/results';

@Injectable({
  providedIn: 'root'
})
export class ApiResquestService {
  private baseUrl = Settings.baseUrl;
  
  constructor(private httpClient: HttpClient) { }

  getResearchPapersList():Observable<FetchPapersResponse>{
    return this.httpClient.get<FetchPapersResponse>(this.baseUrl);
  }

  getReseachPaperById(Id: string):Observable<SinglePaperResponse>{
    return this.httpClient.get<SinglePaperResponse>(`${this.baseUrl}get?id=${Id}`);
  }

  getResults(source :string, target: string):Observable<ComparisonResultSet[]>{
    return this.httpClient.get<ComparisonResultSet[]>(`${this.baseUrl}compare?source=${source}&target=${target}`);
  }

  getResultsPerParagraph(source :string, target: string, paragraphId: string, uniqueId: string):Observable<ParagraphResult>{
    return this
    .httpClient
    .get<ParagraphResult>(`${this.baseUrl}compare_paragraph?source=${source}&target=${target}&source_paragraph_id=${paragraphId}&uid=${uniqueId}`);
  }
}
