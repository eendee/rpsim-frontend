import { ComparisonResultSet } from "./results";

export class Paper{
    id : string;
    title: string;
    summary: string;
}

export class ParagraphString{
    sentence : string;
    score?: number;
    Id?: number;
    originalParagraphId?: number;
    isInSpotlight = false;
    result?: ComparisonResultSet
}

export interface FetchPapersResponse{
    dataset: Paper[];
}

export interface SinglePaperResponse{
    dataset: ParagraphString[];
}