export class ComparisonResult{
    score : string  
    explanation: string[]
    matches?: number
    count?: number
}

export class ComparisonResultSet{
    topicModel : ComparisonResult  
    doc2vec: ComparisonResult
    doc2vecParagraph: ComparisonResult
    commonWords: string[]
}

export class ParagraphResult{
    results: ComparisonResultSet[]
}
